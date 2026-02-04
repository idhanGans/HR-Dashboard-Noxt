import { Button } from "../Button";
import { Download } from "lucide-react";

interface DownloadPayslipButtonProps {
  onDownload: () => void;
  isLoading?: boolean;
}

/**
 * DownloadPayslipButton - Button to download payslip
 * @param {Function} onDownload - Callback when button is clicked
 */
export const DownloadPayslipButton = ({
  onDownload,
  isLoading = false,
}: DownloadPayslipButtonProps) => {
  return (
    <Button
      onClick={onDownload}
      className="w-full flex items-center justify-center gap-2"
      disabled={isLoading}
    >
      <Download size={18} />
      {isLoading ? "Downloading..." : "Download Payslip"}
    </Button>
  );
};
