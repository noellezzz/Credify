import supabase, { supabaseAdmin } from "../services/supabase.service.js";

export const getSchools = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("schools").select("*");
    if (error) throw error;
    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e });
  }
};

export const getSchoolProfile = async (req, res) => {
  try {
    // For now, we'll get the first school as a placeholder
    // In a real implementation, this would get the authenticated school's profile
    const { data, error } = await supabaseAdmin
      .from("schools")
      .select("*")
      .limit(1)
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch school profile",
      error: e.message
    });
  }
};

export const updateSchoolProfile = async (req, res) => {
  const formData = req.body;
  try {
    // For now, we'll update the first school as a placeholder
    // In a real implementation, this would update the authenticated school's profile
    const { data, error } = await supabaseAdmin
      .from("schools")
      .update(formData)
      .limit(1)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Failed to update school profile",
      error: e.message
    });
  }
};

export const updateSchool = async (req, res) => {
  const formData = req.body;
  const { id } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from("schools")
      .update(formData)
      .eq("id", id);
    if (error) throw error;
    return res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e });
  }
};
