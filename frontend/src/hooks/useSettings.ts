import { useState } from "react";

// Default settings state
const DEFAULT_SETTINGS = {
  fullName: "John Doe",
  email: "john.doe@company.com",
  phone: "+1 (555) 123-4567",
  department: "Human Resources",
  avatar: undefined as string | undefined,
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
 * Avatar is now managed by the backend via useAvatar hook
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState("profile");

  const handleSettingChange = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handlePreferenceChange = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Save all settings (avatar is already saved on change)
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
