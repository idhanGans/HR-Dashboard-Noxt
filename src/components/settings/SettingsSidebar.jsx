import { Card } from "../Card";
import { User, Bell, Eye, Lock } from "lucide-react";

/**
 * SettingsSidebar - Navigation sidebar for settings sections
 * @param {string} activeSection - Currently active section ID
 * @param {Function} onSectionChange - Callback when section changes
 */
export const SettingsSidebar = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Eye },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <Card>
      <nav className="space-y-2">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange?.(id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              activeSection === id
                ? "text-white bg-white/10"
                : "text-lightGrey hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </nav>
    </Card>
  );
};
