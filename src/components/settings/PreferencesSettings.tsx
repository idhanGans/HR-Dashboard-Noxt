import { Card } from "../Card";

/**
 * PreferencesSettings - Theme and language preferences
 * @param {Object} preferences - Preferences object with theme and language
 * @param {Function} onPreferenceChange - Callback when preference changes
 */
export const PreferencesSettings = ({ preferences, onPreferenceChange }) => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-6">Preferences</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Theme
          </label>
          <select
            value={preferences.theme}
            onChange={(e) => onPreferenceChange("theme", e.target.value)}
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
            value={preferences.language}
            onChange={(e) => onPreferenceChange("language", e.target.value)}
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
  );
};
