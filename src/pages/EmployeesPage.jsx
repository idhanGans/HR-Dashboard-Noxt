import { Card, DashboardLayout, Table, StatusBadge } from "../components";
import { employees } from "../utils/dummyData";
import { Mail, Phone, MapPin } from "lucide-react";

// Employee management page
export const EmployeesPage = ({ onLogout }) => {
  const columns = [
    {
      key: "avatar",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black text-xs font-bold">
            {row.avatar}
          </div>
          <span className="text-white font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "department", label: "Department" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout userRole="Administrator" onLogout={onLogout}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Employee Directory
        </h1>
        <p className="text-lightGrey">
          Manage and view all employees in the system.
        </p>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-lightGrey text-sm mb-2">Total Employees</p>
          <p className="text-2xl font-bold text-white">245</p>
          <p className="text-xs text-green-400 mt-2">↑ 12 new this month</p>
        </Card>
        <Card>
          <p className="text-lightGrey text-sm mb-2">Present Today</p>
          <p className="text-2xl font-bold text-white">238</p>
          <p className="text-xs text-lightGrey mt-2">97.1% attendance rate</p>
        </Card>
        <Card>
          <p className="text-lightGrey text-sm mb-2">On Leave</p>
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-xs text-lightGrey mt-2">Approved leaves</p>
        </Card>
        <Card>
          <p className="text-lightGrey text-sm mb-2">Departments</p>
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-xs text-lightGrey mt-2">Active departments</p>
        </Card>
      </div>

      {/* Employees Table */}
      <Card className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">All Employees</h2>
        <Table columns={columns} data={employees} />
      </Card>

      {/* Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Stats */}
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">
            Department Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { name: "Engineering", count: 45, color: "bg-blue-500" },
              { name: "Sales", count: 38, color: "bg-green-500" },
              { name: "Marketing", count: 28, color: "bg-purple-500" },
              { name: "HR", count: 15, color: "bg-pink-500" },
            ].map((dept) => (
              <div key={dept.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{dept.name}</span>
                    <span className="text-lightGrey text-sm">
                      {dept.count} employees
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${dept.color} h-2 rounded-full`}
                      style={{ width: `${(dept.count / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Company Info */}
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-silver mt-1" />
              <div>
                <p className="text-lightGrey text-sm mb-1">Email</p>
                <p className="text-white">hr@company.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-silver mt-1" />
              <div>
                <p className="text-lightGrey text-sm mb-1">Phone</p>
                <p className="text-white">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-silver mt-1" />
              <div>
                <p className="text-lightGrey text-sm mb-1">Address</p>
                <p className="text-white">
                  123 Business Street, New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
