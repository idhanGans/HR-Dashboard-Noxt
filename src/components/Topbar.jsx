import { Search, Bell, User, Menu } from "lucide-react";

// Top navigation bar component
export const Topbar = ({
  userName = "John Doe",
  userRole = "Administrator",
  onToggleSidebar,
}) => {
  return (
    <div className="fixed top-0 left-0 lg:left-64 right-0 bg-black/30 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2 sm:py-4 flex items-center gap-3 z-40">
      {/* Mobile menu button */}
      <button
        className="lg:hidden text-white hover:text-silver"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>
      {/* Search Bar */}
      <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-md">
        <div className="glass-input flex items-center gap-2 bg-white/5 border border-white/20 text-white rounded-lg px-3 sm:px-4 py-2">
          <Search size={18} className="text-lightGrey" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none flex-1 placeholder-white/40"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Notification */}
        <button className="relative text-lightGrey hover:text-white transition-all">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-lightGrey">{userRole}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center">
            <User size={20} className="text-black" />
          </div>
        </div>
      </div>
    </div>
  );
};
