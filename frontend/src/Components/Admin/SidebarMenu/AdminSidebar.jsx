import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, PlusSquare, History, Users,
  TrendingUp, MessageSquare, LogOut, Menu, X, Sparkles, ChevronRight,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", iconKey: "LayoutDashboard", path: "/admin/dashboard" },
    ],
  },
  {
    title: "Tasks",
    items: [
      { label: "Add Task", iconKey: "PlusSquare", path: "/admin/add-task" },
      { label: "Task History", iconKey: "History", path: "/admin/task-history" },
    ],
  },
  {
    title: "Employees",
    items: [
      { label: "Directory", iconKey: "Users", path: "/admin/employees" },
      { label: "Performance", iconKey: "TrendingUp", path: "/admin/performance" },
      { label: "Queries", iconKey: "MessageSquare", path: "/admin/queries" },
    ],
  },
];

const NavIcon = ({ iconKey, size, color }) => {
  const props = { size, style: { color, flexShrink: 0 } };
  switch (iconKey) {
    case "LayoutDashboard": return <LayoutDashboard {...props} />;
    case "PlusSquare": return <PlusSquare {...props} />;
    case "History": return <History {...props} />;
    case "Users": return <Users {...props} />;
    case "TrendingUp": return <TrendingUp {...props} />;
    case "MessageSquare": return <MessageSquare {...props} />;
    default: return <LayoutDashboard {...props} />;
  }
};

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-white/90 tracking-tight">WorkHub</span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">Admin Panel</span>
        </div>
      </div>

      {/* Admin chip */}
      <div className="mx-3 mt-4 mb-2 flex items-center gap-3 px-3 py-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(14,165,233,0.2)" }}>
          <span className="text-xs font-bold" style={{ color: "#38bdf8" }}>
            {user.username?.slice(0,2).toUpperCase() || "AD"}
          </span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-xs font-semibold text-white/80 capitalize">{user.username || "Administrator"}</p>
          <p className="text-[10px] text-white/35">Full access</p>
        </div>
        <div className="w-2 h-2 rounded-full shrink-0"
          style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-4 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            <p className="text-[10px] text-white/20 uppercase tracking-widest px-3 mb-1">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              const iconColor = isActive ? "#38bdf8" : "rgba(255,255,255,0.32)";
              return (
                <Link key={item.path} to={item.path} onClick={onNavClick}
                  className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 outline-none"
                  style={isActive
                    ? { background: "rgba(14,165,233,0.14)", color: "#38bdf8" }
                    : { color: "rgba(255,255,255,0.38)" }}>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                      style={{ background: "#38bdf8" }} />
                  )}
                  <NavIcon iconKey={item.iconKey} size={16} color={iconColor} />
                  <span className="text-sm font-medium flex-1 truncate group-hover:text-white/70 transition-colors">
                    {item.label}
                  </span>
                  {isActive && <ChevronRight size={12} style={{ color: "#38bdf8", flexShrink: 0 }} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150"
          style={{ color: "rgba(248,113,113,0.55)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.08)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(248,113,113,0.55)"; }}>
          <LogOut size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: "linear-gradient(180deg,#0d1424,#080d18)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white/90">WorkHub Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <Menu size={16} className="text-white/70" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full flex flex-col z-10"
            style={{ background: "linear-gradient(180deg,#0d1424,#080d18)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              <X size={14} className="text-white/60" />
            </button>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 z-30 h-screen w-64 flex-col"
        style={{ background: "linear-gradient(180deg,#0d1424 0%,#080d18 100%)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <SidebarContent onNavClick={undefined} />
      </aside>
    </>
  );
};

export default AdminSidebar;
