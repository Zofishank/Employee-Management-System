import React, { useEffect, useState } from "react";
import { Camera, User, Mail, Phone, Shield, Lock, Save } from "lucide-react";
import EmployeeSidebar from "../SidebarMenu/EmployeeSidebar";
import { useNotification } from "../../Employee/notifications/Notifications";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const token = localStorage.getItem("token");
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error ${res.status}: ${text}`);
        }
        const data = await res.json();
        setFormData({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",
          password: "",
        });
        const fullAvatarURL = data.avatar
          ? `http://localhost:5000${data.avatar}`
          : "";
        setAvatarPreview(fullAvatarURL);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data, avatar: fullAvatarURL }),
        );
      } catch (error) {
        showNotification("Failed to load profile", "error");
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image must be under 5MB", "error");
      e.target.value = "";
      return;
    }
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = new FormData();
      updateData.append("username", formData.username);
      updateData.append("email", formData.email);
      updateData.append("phone", formData.phone);
      if (formData.password) updateData.append("password", formData.password);
      if (avatar) updateData.append("avatar", avatar);

      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: updateData,
      });

      if (!res.ok) {
        const text = await res.text();
        let message = "Update failed";
        try {
          const json = JSON.parse(text);
          message = json.message || message;
        } catch {
          message = `Server error ${res.status}`;
        }
        throw new Error(message);
      }

      const data = await res.json();
      showNotification(
        data.message || "Profile updated successfully",
        "success",
      );
      const fullAvatarURL = data.user.avatar
        ? `http://localhost:5000${data.user.avatar}`
        : "";
      setFormData((prev) => ({ ...prev, password: "" }));
      setAvatar(null);
      setAvatarPreview(fullAvatarURL);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, avatar: fullAvatarURL }),
      );
    } catch (error) {
      showNotification(error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      icon: User,
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      icon: Mail,
      required: true,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      icon: Phone,
      required: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <EmployeeSidebar />
      <div className="ml-16 md:ml-64 flex-1 px-6 md:px-10 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-white/90">Edit Profile</h1>
          <p className="text-sm text-white/35 mt-1">
            Update your personal information and security settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
          {/* Avatar card */}
          <div
            className="rounded-2xl p-6 flex items-center gap-5"
            style={{
              background: "linear-gradient(145deg, #0d1424 0%, #080d18 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="relative shrink-0">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.12)" }}
                  >
                    <User size={28} style={{ color: "#818cf8" }} />
                  </div>
                )}
              </div>
              <label
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                }}
                title="Change avatar"
              >
                <Camera size={13} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-white/80">
                {formData.username || "Your Name"}
              </p>
              <p className="text-xs text-white/35 mt-0.5 capitalize">
                {formData.role || "Employee"}
              </p>
              <p className="text-[11px] text-white/25 mt-2">
                JPG or PNG, max 5MB
              </p>
            </div>
          </div>

          {/* Personal info card */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background: "linear-gradient(145deg, #0d1424 0%, #080d18 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest">
              Personal Info
            </p>

            {fields.map(({ name, label, type, icon: Icon, required }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-xs text-white/45">{label}</label>
                <div
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onFocus={() => {}}
                >
                  <Icon size={15} style={{ color: "rgba(255,255,255,0.25)" }} />
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20 outline-none"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                </div>
              </div>
            ))}

            {/* Role — read only */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/45">Role</label>
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Shield size={15} style={{ color: "rgba(255,255,255,0.15)" }} />
                <span className="text-sm text-white/30 capitalize">
                  {formData.role || "employee"}
                </span>
                <span className="ml-auto text-[10px] text-white/20 uppercase tracking-wider">
                  read only
                </span>
              </div>
            </div>
          </div>

          {/* Security card */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background: "linear-gradient(145deg, #0d1424 0%, #080d18 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest">
              Security
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/45">
                New Password <span className="text-white/20">(optional)</span>
              </label>
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Lock size={15} style={{ color: "rgba(255,255,255,0.25)" }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition disabled:opacity-40"
            style={{
              background: loading
                ? "rgba(99,102,241,0.4)"
                : "linear-gradient(135deg, #3b82f6, #6366f1)",
            }}
          >
            <Save size={15} />
            {loading ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
