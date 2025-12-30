import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  LogOut,
  Calendar,
  Settings,
} from "lucide-react";

// Sidebar navigation component
export const Sidebar = ({ userRole, onLogout, isOpen = false, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Attendance", path: "/attendance", icon: Clock },
    { label: "Payroll", path: "/payroll", icon: DollarSign },
    { label: "KPI Tracker", path: "/kpi", icon: TrendingUp },
    { label: "Employees", path: "/employees", icon: Users },
    { label: "Leave", path: "/leave", icon: Calendar },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 w-64 h-screen bg-gradient-sidebar border-r border-white/10 p-6 flex flex-col transform transition-transform duration-200 z-50 lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-silver to-white bg-clip-text text-transparent">
              HR Dashboard
            </h1>
            <p className="text-xs text-lightGrey mt-1">{userRole}</p>
          </div>
          {/* Close for mobile */}
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {/* eslint-disable-next-line no-unused-vars */}
          {menuItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`sidebar-item ${
                location.pathname === path ? "bg-white/20 text-white" : ""
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="sidebar-item justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-300 hover:text-red-200"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>
    </>
  );
};
