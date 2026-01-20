import { Button } from "../Button";
import { Save } from "lucide-react";

/**
 * SaveSettingsButton - Button to save settings
 * @param {Function} onSave - Callback when button is clicked
 */
export const SaveSettingsButton = ({ onSave }) => {
  return (
    <Button
      onClick={onSave}
      className="w-full flex items-center justify-center gap-2"
    >
      <Save size={18} />
      Save Settings
    </Button>
  );
};
