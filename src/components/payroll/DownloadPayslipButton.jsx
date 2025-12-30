import { Button } from "../Button";
import { Download } from "lucide-react";

/**
 * DownloadPayslipButton - Button to download payslip
 * @param {Function} onDownload - Callback when button is clicked
 */
export const DownloadPayslipButton = ({ onDownload }) => {
  return (
    <Button
      onClick={onDownload}
      className="w-full flex items-center justify-center gap-2"
    >
      <Download size={18} />
      Download Payslip
    </Button>
  );
};
