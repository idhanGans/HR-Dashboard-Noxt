import { Card } from "../Card";

/**
 * NotificationSettings - Notification preferences settings
 * @param {Object} notifications - Notification settings object
 * @param {Function} onNotificationChange - Callback when notification setting changes
 */
export const NotificationSettings = ({
  notifications,
  onNotificationChange,
}) => {
  const notificationOptions = [
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
  ];

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-6">
        Notification Preferences
      </h2>
      <div className="space-y-4">
        {notificationOptions.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div>
              <p className="text-white font-medium">{label}</p>
              <p className="text-lightGrey text-sm">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => onNotificationChange(key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-silver"></div>
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
};
