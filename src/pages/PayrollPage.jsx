import { DashboardLayout } from "../components";
import {
  PayslipCard,
  PayrollSummary,
  PaymentInfoCard,
  DownloadPayslipButton,
  PayrollHeader,
} from "../components/payroll";
import { salaryBreakdown } from "../utils/dummyData";

/**
 * MainPayslipSection - Main payslip display area
 */
const MainPayslipSection = ({ salaryBreakdown }) => (
  <div className="lg:col-span-2">
    <PayslipCard salaryBreakdown={salaryBreakdown} />
  </div>
);

/**
 * SidebarSection - Sidebar with summary, download, and payment info
 */
const SidebarSection = ({ salaryBreakdown, onDownload }) => (
  <div className="space-y-6">
    <PayrollSummary salaryBreakdown={salaryBreakdown} />
    <DownloadPayslipButton onDownload={onDownload} />
    <PaymentInfoCard />
  </div>
);

/**
 * PayrollPage - Payroll and salary slip page
 */
export const PayrollPage = ({ onLogout, userName, userRole }) => {
  const handleDownloadPayslip = () => {
    alert("✓ Payslip downloaded successfully!");
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <PayrollHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MainPayslipSection salaryBreakdown={salaryBreakdown} />
        <SidebarSection
          salaryBreakdown={salaryBreakdown}
          onDownload={handleDownloadPayslip}
        />
      </div>
    </DashboardLayout>
  );
};
