import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

// Main layout wrapper for dashboard pages
export const DashboardLayout = ({ children, userRole, userName, onLogout }) => {
  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar userRole={userRole} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Topbar */}
        <Topbar userName={userName} userRole={userRole} />

        {/* Page Content */}
        <div className="flex-1 overflow-auto mt-20 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};
