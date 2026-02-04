import { Card } from "../Card";
import { DropdownSelect } from "../DropdownSelect";
import type { SettingsState } from "../../types";

/**
 * PreferencesSettings - Theme and language preferences
 * @param {Object} preferences - Preferences object with theme and language
 * @param {Function} onPreferenceChange - Callback when preference changes
 */
export const PreferencesSettings = ({
  preferences,
  onPreferenceChange,
}: {
  preferences: Pick<SettingsState, "theme" | "language">;
  onPreferenceChange: <K extends "theme" | "language">(
    key: K,
    value: SettingsState[K],
  ) => void;
}) => {
  const themeOptions = [
    { value: "dark", label: "Dark Mode" },
    { value: "light", label: "Light Mode" },
  ];
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
  ];

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-6">Preferences</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Theme
          </label>
          <DropdownSelect
            value={preferences.theme}
            onChange={(value) => {
              if (value !== null) {
                onPreferenceChange(
                  "theme",
                  String(value) as SettingsState["theme"],
                );
              }
            }}
            options={themeOptions}
            ariaLabel="Select theme"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Language
          </label>
          <DropdownSelect
            value={preferences.language}
            onChange={(value) => {
              if (value !== null) {
                onPreferenceChange(
                  "language",
                  String(value) as SettingsState["language"],
                );
              }
            }}
            options={languageOptions}
            ariaLabel="Select language"
          />
        </div>
      </div>
    </Card>
  );
};
