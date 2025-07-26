import supabase, { supabaseAdmin } from "../services/supabase.service.js";

export const createDbSchool = async (schoolData) => {
  const {
    auth_id,
    email,
    schoolName,
    schoolType,
    address,
    city,
    province,
    zipCode,
    phoneNumber,
    principalName,
    principalEmail,
    principalPhone,
    establishedYear,
    studentCapacity,
    website,
    websiteOrFacebook,
    // File data (base64)
    depedCertificate,
    secCertificate,
    birCertificate,
    businessPermit,
    letterheadSample,
    principalId,
  } = schoolData;

  try {
    // Helper function to upload file to storage
    const uploadFileToStorage = async (
      fileBase64,
      fileName,
      bucketName = "credentials"
    ) => {
      if (!fileBase64) return null;

      // Convert base64 to buffer
      const base64Data = fileBase64.replace(/^data:.*,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Generate unique filename with .pdf extension
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${fileName}.pdf`;

      // Upload to storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload ${fileName}: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    };

    // Upload all files to storage
    const [
      depedCertificateUrl,
      secCertificateUrl,
      birCertificateUrl,
      businessPermitUrl,
      letterheadSampleUrl,
      principalIdUrl,
    ] = await Promise.all([
      uploadFileToStorage(depedCertificate, "deped_certificate"),
      uploadFileToStorage(secCertificate, "sec_certificate"),
      uploadFileToStorage(birCertificate, "bir_certificate"),
      uploadFileToStorage(businessPermit, "business_permit"),
      uploadFileToStorage(letterheadSample, "letterhead_sample"),
      uploadFileToStorage(principalId, "principal_id"),
    ]);

    // Insert school data into database
    const { data, error } = await supabase
      .from("schools")
      .insert({
        auth_id,
        email,
        school_name: schoolName,
        school_type: schoolType,
        address,
        city,
        province,
        zip_code: zipCode,
        phone_number: phoneNumber,
        principal_name: principalName,
        principal_email: principalEmail,
        principal_phone: principalPhone,
        established_year: parseInt(establishedYear),
        student_capacity: parseInt(studentCapacity),
        website,
        website_or_facebook: websiteOrFacebook,
        deped_certificate_url: depedCertificateUrl,
        sec_certificate_url: secCertificateUrl,
        bir_certificate_url: birCertificateUrl,
        business_permit_url: businessPermitUrl,
        letterhead_sample_url: letterheadSampleUrl,
        principal_id_url: principalIdUrl,
        status: "Pending",
        verified_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    // If there's an error, we might want to clean up uploaded files
    // This is optional but recommended for cleanup
    console.error("Error creating school:", error);
    throw error;
  }
};

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

// controllers/authController.js
export const schoolRegister = async (req, res) => {
  try {
    const {
      email,
      password,
      schoolName,
      schoolType,
      address,
      city,
      province,
      zipCode,
      phoneNumber,
      principalName,
      principalEmail,
      principalPhone,
      establishedYear,
      studentCapacity,
      website,
      websiteOrFacebook,
      // File data (base64)
      depedCertificate,
      secCertificate,
      birCertificate,
      businessPermit,
      letterheadSample,
      principalId,
    } = req.body;

    const cleanEmail = email.trim();

    // Create auth user first
    const authId = await createAuthUser(cleanEmail, password);

    // Create school record with file uploads
    const schoolData = await createDbSchool({
      auth_id: authId,
      email: cleanEmail,
      schoolName,
      schoolType,
      address,
      city,
      province,
      zipCode,
      phoneNumber,
      principalName,
      principalEmail,
      principalPhone,
      establishedYear,
      studentCapacity,
      website,
      websiteOrFacebook,
      depedCertificate,
      secCertificate,
      birCertificate,
      businessPermit,
      letterheadSample,
      principalId,
    });

    await createDbUser({
      auth_id: authId,
      email: cleanEmail,
      username: schoolName,
      firstname: schoolName,
      lastname: city,
      role: "verifier",
      status: "Pending",
    });

    res.json({
      message: "School registration successful",
      schoolId: schoolData.id,
    });
  } catch (error) {
    console.error("School registration error:", error);
    return res.status(500).json({ error: error.message });
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
      console.log("Auth error:", error);

      // Handle specific error types that your frontend expects
      if (error.message.includes("Invalid login credentials")) {
        return res.status(401).json({ message: "invalid_credentials" });
      }
      if (error.message.includes("Email not confirmed")) {
        return res.status(401).json({ message: "email_not_confirmed" });
      }

      return res.status(401).json({ message: error.message });
    }

    console.log("User authenticated:", data.user.id);

    // Use admin client to fetch user data from your database
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("auth_id", data.user.id)
      .single();

    if (userError) {
      console.log("User fetch error:", userError);
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
      status: userData.status,
    };

    console.log("Login successful for user:", parsedUser.username);
    return res.status(200).json({ message: "Success", data, parsedUser });
  } catch (e) {
    console.error("Error logging in:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
