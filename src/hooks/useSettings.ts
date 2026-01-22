import { useState } from "react";
import type { SettingsState } from "../types";

// Default settings state
const DEFAULT_SETTINGS: SettingsState = {
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
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState("profile");

  const handleSettingChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = <K extends keyof SettingsState["notifications"]>(
    key: K,
    value: SettingsState["notifications"][K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handlePreferenceChange = <K extends "theme" | "language">(
    key: K,
    value: SettingsState[K],
  ) => {
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
