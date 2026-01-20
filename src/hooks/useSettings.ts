import { useState } from "react";

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
export const useSettings = () => {
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