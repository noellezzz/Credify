import supabase, { supabaseAdmin } from "../services/supabase.service.js";


export const register = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    const cleanEmail = email.trim();

    const authId = await createAuthUser(cleanEmail, password);
    const data = await createDbUser({
      auth_id: authId,
      email: cleanEmail,
      username: firstname + " " + lastname,
      firstname,
      lastname,
    });

    res.json({
      message: "Register successful",
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const createAuthUser = async (email, password) => {
  try {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data.user.id;
  } catch (e) {
    console.error("Error creating AuthUser:", e);
    throw e;
  }
};

const createDbUser = async (userData) => {
  try {
    const { data, error } = await supabaseAdmin.from("users").insert(userData);
    if (error) {
      throw error;
    }
    console.log(data);
    return data;
  } catch (e) {
    console.error("Error creating DBUser:", e);
    throw e;
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Use the regular supabase client for authentication (NOT supabaseAdmin)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Auth error:', error);
      
      // Handle specific error types that your frontend expects
      if (error.message.includes('Invalid login credentials')) {
        return res.status(401).json({ message: "invalid_credentials" });
      }
      if (error.message.includes('Email not confirmed')) {
        return res.status(401).json({ message: "email_not_confirmed" });
      }
      
      return res.status(401).json({ message: error.message });
    }

    console.log('User authenticated:', data.user.id);
    
    // Use admin client to fetch user data from your database
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("auth_id", data.user.id)
      .single();

    if (userError) {
      console.log('User fetch error:', userError);
      return res.status(500).json({ message: "user_not_found" });
    }

    const parsedUser = {
      email: userData.email,
      role: userData.role,
      created_at: userData.created_at,
      username: userData.username,
      id: userData.auth_id,
      firstname: userData.firstname,
      lastname: userData.lastname,
    };

    console.log('Login successful for user:', parsedUser.username);
    return res.status(200).json({ message: "Success", data, parsedUser });
  } catch (e) {
    console.error("Error logging in:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
