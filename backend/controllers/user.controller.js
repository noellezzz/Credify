import { supabaseAdmin } from "../services/supabase.service.js";

export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*");

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res
      .status(200)
      .json({ message: "User fetched successfully", data: data });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Add these new functions:

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    // Validate role (you can customize these based on your app's roles)
    //raj pakibago n lng ng roles
    const validRoles = ["admin", "client", "verifier"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role })
      .eq("auth_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user role:", error);
      return res.status(500).json({ error: "Failed to update user role" });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User role updated successfully",
      user: data,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Validate status
    const validStatuses = ["active", "inactive", "banned", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ status })
      .eq("auth_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user status:", error);
      return res.status(500).json({ error: "Failed to update user status" });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User status updated successfully",
      user: data,
    });
  } catch (err) {
    console.error("Error updating user status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("auth_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      user: data,
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("role, status");

    if (error) {
      console.error("Error fetching user stats:", error);
      return res.status(500).json({ error: "Failed to fetch user statistics" });
    }

    const stats = {
      total: data.length,
      byRole: {},
      byStatus: {},
    };

    data.forEach((user) => {
      // Count by role
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;

      // Count by status
      stats.byStatus[user.status] = (stats.byStatus[user.status] || 0) + 1;
    });

    return res.status(200).json({
      message: "User statistics retrieved successfully",
      stats,
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
