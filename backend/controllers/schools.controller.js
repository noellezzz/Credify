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
