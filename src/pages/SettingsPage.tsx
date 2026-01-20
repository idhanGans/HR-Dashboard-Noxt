import { DashboardLayout } from "../components";
import {
  SettingsSidebar,
  ProfileSettings,
  NotificationSettings,
  PreferencesSettings,
  SaveSettingsButton,
  SettingsHeader,
} from "../components/settings";
import { useSettings } from "../hooks/useSettings";

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
