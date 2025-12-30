import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

// Main layout wrapper for dashboard pages
export const DashboardLayout = ({ children, userRole, userName, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col">
        {/* Topbar */}
        <Topbar
          userName={userName}
          userRole={userRole}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-auto mt-20 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};
