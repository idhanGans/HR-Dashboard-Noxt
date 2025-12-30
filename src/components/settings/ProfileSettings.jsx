import { Card } from "../Card";

/**
 * ProfileSettings - Profile information settings form
 * @param {Object} settings - Settings object with fullName, email, phone, department
 * @param {Function} onSettingChange - Callback when setting changes
 */
export const ProfileSettings = ({ settings, onSettingChange }) => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-6">Profile Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={settings.fullName}
            onChange={(e) => onSettingChange("fullName", e.target.value)}
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
            onChange={(e) => onSettingChange("email", e.target.value)}
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
            onChange={(e) => onSettingChange("phone", e.target.value)}
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
  );
};
