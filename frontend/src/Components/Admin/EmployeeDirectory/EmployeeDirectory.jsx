import React, { useEffect, useState } from "react";
import AdminSidebar from "../SidebarMenu/AdminSidebar";
import { Users, Search, Shield, User } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL + "";

const buildAvatarURL = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${BASE_URL}${avatar}`;
};

const getInitials = (name) => (name ? name.slice(0, 2).toUpperCase() : "U");

/* ── Employee avatar with real image ── */
const EmpAvatar = ({ user, size = 36 }) => {
  const [err, setErr] = useState(false);
  const url = buildAvatarURL(user?.avatar);
  const name = user?.username || "U";
  const isAdmin = user?.role === "admin";
  const bg = isAdmin ? "rgba(251,191,36,0.18)" : "rgba(14,165,233,0.18)";
  const color = isAdmin ? "#fbbf24" : "#38bdf8";

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {url && !err ? (
        <img
          src={url}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={() => setErr(true)}
        />
      ) : (
        <span
          style={{
            fontSize: size * 0.36,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("employee"); // default: hide admins
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Exclude admins by default
        setEmployees(Array.isArray(data) ? data : []);
        setFiltered(
          Array.isArray(data) ? data.filter((e) => e.role !== "admin") : [],
        );
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [token]);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      employees.filter((emp) => {
        const matchSearch = `${emp.username} ${emp.email}`
          .toLowerCase()
          .includes(lower);
        const matchRole = roleFilter === "all" ? true : emp.role === roleFilter;
        return matchSearch && matchRole;
      }),
    );
  }, [search, roleFilter, employees]);

  const empCount = employees.filter((e) => e.role !== "admin").length;
  const cardStyle = {
    background: "linear-gradient(145deg,#0d1424,#080d18)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="flex min-h-screen bg-[#080C14]">
      <AdminSidebar />
      <div className="md:ml-64 flex-1 px-4 md:px-10 pt-16 md:pt-8 pb-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(14,165,233,0.12)" }}
          >
            <Users size={18} style={{ color: "#38bdf8" }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white/90">
              Employee Directory
            </h1>
            <p className="text-sm text-white/35 mt-0.5">{empCount} employees</p>
          </div>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl flex-1"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Search size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
            />
          </div>
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {["employee", "all"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={
                  roleFilter === r
                    ? { background: "rgba(14,165,233,0.2)", color: "#38bdf8" }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {r === "employee" ? "Employees" : "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl h-16 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl py-14 flex flex-col items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Users size={28} className="text-white/20" />
            <p className="text-sm text-white/30">No employees found</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div
              className="hidden md:block rounded-2xl overflow-hidden"
              style={cardStyle}
            >
              <div
                className="grid grid-cols-4 px-5 py-3 text-[11px] font-medium text-white/30 uppercase tracking-wider"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="col-span-2">Employee</div>
                <div className="text-center">Email</div>
                <div className="text-center">Role</div>
              </div>
              <div
                className="divide-y"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                {filtered.map((emp) => (
                  <div
                    key={emp._id}
                    className="grid grid-cols-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <EmpAvatar user={emp} size={34} />
                      <p className="text-sm font-medium text-white/80 capitalize">
                        {emp.username}
                      </p>
                    </div>
                    <div className="text-center text-sm text-white/40 lowercase truncate px-4">
                      {emp.email}
                    </div>
                    <div className="flex justify-center">
                      <span
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize"
                        style={
                          emp.role === "admin"
                            ? {
                                color: "#fbbf24",
                                background: "rgba(251,191,36,0.1)",
                              }
                            : {
                                color: "#38bdf8",
                                background: "rgba(14,165,233,0.1)",
                              }
                        }
                      >
                        {emp.role === "admin" ? (
                          <Shield size={11} strokeWidth={2.5} />
                        ) : (
                          <User size={11} strokeWidth={2.5} />
                        )}
                        {emp.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-3">
              {filtered.map((emp) => (
                <div
                  key={emp._id}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={cardStyle}
                >
                  <EmpAvatar user={emp} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 capitalize">
                      {emp.username}
                    </p>
                    <p className="text-xs text-white/35 truncate mt-0.5">
                      {emp.email}
                    </p>
                  </div>
                  <span
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize shrink-0"
                    style={
                      emp.role === "admin"
                        ? {
                            color: "#fbbf24",
                            background: "rgba(251,191,36,0.1)",
                          }
                        : {
                            color: "#38bdf8",
                            background: "rgba(14,165,233,0.1)",
                          }
                    }
                  >
                    {emp.role}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
