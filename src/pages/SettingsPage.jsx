import { useState } from "react";
import { Card, DashboardLayout, Button } from "../components";
import { Save, User, Lock, Bell, Eye } from "lucide-react";

// Settings page
export const SettingsPage = ({ onLogout, userName, userRole }) => {
  const [settings, setSettings] = useState({
    fullName: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Human Resources",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    theme: "dark",
    language: "english",
  });

  const handleSettingChange = (key, value) => {
    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setSettings((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSaveSettings = () => {
    alert("✓ Settings saved successfully!");
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-lightGrey">
          Manage your profile and application settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "preferences", label: "Preferences", icon: Eye },
                { id: "security", label: "Security", icon: Lock },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-lightGrey hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon size={18} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={(e) =>
                    handleSettingChange("fullName", e.target.value)
                  }
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange("email", e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange("phone", e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={settings.department}
                  disabled
                  className="glass-input w-full opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                {
                  key: "email",
                  label: "Email Notifications",
                  desc: "Receive updates via email",
                },
                {
                  key: "sms",
                  label: "SMS Alerts",
                  desc: "Get critical alerts via SMS",
                },
                {
                  key: "push",
                  label: "Push Notifications",
                  desc: "Receive in-app notifications",
                },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-lightGrey text-sm">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[key]}
                      onChange={(e) =>
                        handleSettingChange(
                          `notifications.${key}`,
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-silver"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>

          {/* Preferences */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-6">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange("theme", e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                  className="glass-input w-full"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSaveSettings}
            className="w-full flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
