import { useState } from "react";
import { DashboardLayout } from "../components";
import {
  SettingsSidebar,
  ProfileSettings,
  NotificationSettings,
  PreferencesSettings,
  SaveSettingsButton,
  SettingsHeader,
} from "../components/settings";

// Default settings state
const DEFAULT_SETTINGS = {
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
};

/**
 * useSettings - Custom hook for settings state management
 */
const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState("profile");

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    alert("✓ Settings saved successfully!");
  };

  return {
    settings,
    activeSection,
    setActiveSection,
    handleSettingChange,
    handleNotificationChange,
    handlePreferenceChange,
    handleSaveSettings,
  };
};

/**
 * SettingsContent - Main settings content area
 */
const SettingsContent = ({
  settings,
  onSettingChange,
  onNotificationChange,
  onPreferenceChange,
  onSave,
}) => (
  <div className="lg:col-span-2 space-y-6">
    <ProfileSettings settings={settings} onSettingChange={onSettingChange} />

    <NotificationSettings
      notifications={settings.notifications}
      onNotificationChange={onNotificationChange}
    />

    <PreferencesSettings
      preferences={{ theme: settings.theme, language: settings.language }}
      onPreferenceChange={onPreferenceChange}
    />

    <SaveSettingsButton onSave={onSave} />
  </div>
);

/**
 * SettingsPage - Settings page
 */
export const SettingsPage = ({ onLogout, userName, userRole }) => {
  const {
    settings,
    activeSection,
    setActiveSection,
    handleSettingChange,
    handleNotificationChange,
    handlePreferenceChange,
    handleSaveSettings,
  } = useSettings();

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <SettingsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        <SettingsContent
          settings={settings}
          onSettingChange={handleSettingChange}
          onNotificationChange={handleNotificationChange}
          onPreferenceChange={handlePreferenceChange}
          onSave={handleSaveSettings}
        />
      </div>
    </DashboardLayout>
  );
};
