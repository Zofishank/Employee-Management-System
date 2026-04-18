import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Sparkles,
  UserCog,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useNotification } from "../../Employee/notifications/Notifications";

const BASE_URL = import.meta.env.VITE_API_URL + "";

const buildAvatarURL = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${BASE_URL}${avatar}`;
};

const EmployeeSidebar = () => {
  const [user, setUser] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Pull both showNotification and live unreadCount from context
  const { showNotification, unreadCount } = useNotification();

  const handleLogout = () => {
    showNotification("Logged out successfully", "success");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => navigate("/login", { replace: true }), 500);
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ ...parsed, avatar: buildAvatarURL(parsed.avatar) });
      } catch {
        /* ignore */
      }
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const fullAvatar = buildAvatarURL(data.avatar);
        setAvatarError(false);
        setUser({ ...data, avatar: fullAvatar });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data, avatar: fullAvatar }),
        );
      } catch (err) {
        console.error("Sidebar fetch error:", err.message);
      }
    })();
  }, []);

  // Nav sections — badge on Notifications is now dynamic
  const NAV_SECTIONS = [
    {
      title: "Main",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/employee/dashboard",
        },
        { label: "My Tasks", icon: CheckSquare, path: "/employee/tasks" },
        { label: "My Progress", icon: TrendingUp, path: "/employee/progress" },
      ],
    },
    {
      title: "Tools",
      items: [
        { label: "AI Assistant", icon: Sparkles, path: "/employee/assistant" },
        {
          label: "Notifications",
          icon: Bell,
          path: "/employee/notifications",
          badge: unreadCount > 0 ? unreadCount : null, // ← live from context
        },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Edit Profile", icon: UserCog, path: "/employee/profile" },
      ],
    },
  ];

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";
  const avatarURL = user?.avatar || "";

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}
        >
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-white/90 tracking-tight">
            WorkHub
          </span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">
            Employee Portal
          </span>
        </div>
      </div>

      {/* User chip */}
      <div
        className="mx-3 mt-4 mb-2 flex items-center gap-3 px-3 py-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
          style={{ background: "rgba(99,102,241,0.2)" }}
        >
          {avatarURL && !avatarError ? (
            <img
              src={avatarURL}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span className="text-xs font-bold text-indigo-300">
              {initials}
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-xs font-semibold text-white/80 truncate">
            {user?.username || "Loading..."}
          </p>
          <p className="text-[10px] text-white/35 capitalize">
            {user?.role || "employee"}
          </p>
        </div>
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }}
        />
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-3 flex flex-col gap-4 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            <p className="text-[10px] text-white/20 uppercase tracking-widest px-3 mb-1">
              {section.title}
            </p>
            {section.items.map(({ label, icon: Icon, path, badge }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onNavClick}
                className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 outline-none"
                style={({ isActive }) =>
                  isActive
                    ? { background: "rgba(99,102,241,0.14)", color: "#a78bfa" }
                    : { color: "rgba(255,255,255,0.38)" }
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                        style={{ background: "#a78bfa" }}
                      />
                    )}
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.5 : 2}
                      style={{
                        color: isActive ? "#a78bfa" : "rgba(255,255,255,0.32)",
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-sm font-medium flex-1 truncate group-hover:text-white/70 transition-colors">
                      {label}
                    </span>
                    {/* Dynamic badge — only shown when badge > 0 */}
                    {badge ? (
                      <span
                        className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold"
                        style={{ background: "#ef4444", color: "#fff" }}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight
                        size={12}
                        style={{ color: "#a78bfa", flexShrink: 0 }}
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        className="px-3 pb-4 pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150"
          style={{ color: "rgba(248,113,113,0.55)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.08)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(248,113,113,0.55)";
          }}
        >
          <LogOut size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{
          background: "linear-gradient(180deg,#0d1424,#080d18)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}
          >
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white/90">WorkHub</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Notification bell with live badge on mobile too */}
          <button
            onClick={() => navigate("/employee/notifications")}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Bell size={15} className="text-white/70" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Menu size={16} className="text-white/70" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative w-72 h-full flex flex-col z-10"
            style={{
              background: "linear-gradient(180deg,#0d1424,#080d18)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <X size={14} className="text-white/60" />
            </button>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 z-30 h-screen w-64 flex-col"
        style={{
          background: "linear-gradient(180deg,#0d1424 0%,#080d18 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <SidebarContent onNavClick={undefined} />
      </aside>
    </>
  );
};

export default EmployeeSidebar;
