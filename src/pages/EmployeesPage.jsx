import { useMemo, useState } from "react";
import {
  Card,
  DashboardLayout,
  Table,
  StatusBadge,
  Button,
  Modal,
} from "../components";
import { employees as seedEmployees } from "../utils/dummyData";
import { Mail, Phone, MapPin, Plus, Edit, LogOut } from "lucide-react";

// Employee management page with add/edit and employment type controls
export const EmployeesPage = ({ onLogout, userName, userRole }) => {
  const [employeeList, setEmployeeList] = useState(seedEmployees);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const emptyForm = {
    id: null,
    name: "",
    department: "Engineering",
    role: "",
    email: "",
    phone: "",
    status: "present",
    employmentType: "permanent",
    startDate: "",
  };
  const [form, setForm] = useState(emptyForm);

  const handleOpenAdd = () => {
    setMode("add");
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setMode("edit");
    setForm(emp);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.department.trim() || !form.role.trim()) {
      alert("Please fill name, department, and role.");
      return;
    }

    if (mode === "add") {
      const newEmployee = {
        ...form,
        id: Date.now(),
        avatar: (form.name || "")
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      };
      setEmployeeList((prev) => [newEmployee, ...prev]);
    } else {
      setEmployeeList((prev) =>
        prev.map((emp) => (emp.id === form.id ? { ...form } : emp))
      );
    }

    setIsModalOpen(false);
  };

  const handleMarkFormer = (emp) => {
    setEmployeeList((prev) =>
      prev.map((item) =>
        item.id === emp.id
          ? { ...item, employmentType: "former", status: "absent" }
          : item
      )
    );
  };

  const filteredEmployees = useMemo(() => {
    return employeeList.filter((emp) => {
      const matchesFilter =
        filter === "all" ? true : emp.employmentType.toLowerCase() === filter;
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [employeeList, filter, search]);

  const counts = useMemo(() => {
    const total = employeeList.length;
    const permanent = employeeList.filter(
      (e) => e.employmentType === "permanent"
    ).length;
    const temporary = employeeList.filter(
      (e) => e.employmentType === "temporary"
    ).length;
    const former = employeeList.filter(
      (e) => e.employmentType === "former"
    ).length;
    return { total, permanent, temporary, former };
  }, [employeeList]);

  const columns = [
    {
      key: "avatar",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-silver to-white rounded-full flex items-center justify-center text-black text-xs font-bold">
            {row.avatar || row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{row.name}</p>
            <p className="text-xs text-lightGrey">{row.role}</p>
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department" },
    {
      key: "employmentType",
      label: "Employment Type",
      render: (row) => (
        <span className="text-sm text-white capitalize">
          {row.employmentType}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="text-xs px-3 py-1 rounded bg-white/10 text-white border border-white/20 hover:bg-white/20"
            onClick={() => handleOpenEdit(row)}
          >
            <div className="flex items-center gap-1">
              <Edit size={14} />
              Edit
            </div>
          </button>
          {row.employmentType !== "former" && (
            <button
              className="text-xs px-3 py-1 rounded bg-red-900/30 text-red-200 border border-red-500/30 hover:bg-red-900/50"
              onClick={() => handleMarkFormer(row)}
            >
              <div className="flex items-center gap-1">
                <LogOut size={14} />
                Mark Former
              </div>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Employee Directory
          </h1>
          <p className="text-lightGrey">
            Manage your full employee database: add, edit, and set employment
            type.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="glass-input w-60"
          />
          <Button onClick={handleOpenAdd} className="flex items-center gap-2">
            <Plus size={18} />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-lightGrey text-sm mb-2">Total Employees</p>
          <p className="text-2xl font-bold text-white">{counts.total}</p>
          <p className="text-xs text-green-400 mt-2">Active + former records</p>
        </Card>
        <Card>
          <p className="text-lightGrey text-sm mb-2">Permanent</p>
          <p className="text-2xl font-bold text-white">{counts.permanent}</p>
          <p className="text-xs text-lightGrey mt-2">Full-time employees</p>
        </Card>
        <Card>
          <p className="text-lightGrey text-sm mb-2">Temporary</p>
          <p className="text-2xl font-bold text-white">{counts.temporary}</p>
          <p className="text-xs text-lightGrey mt-2">Contract / interns</p>
        </Card>
        <Card>
          <p className="text-lightGrey text-sm mb-2">Former</p>
          <p className="text-2xl font-bold text-white">{counts.former}</p>
          <p className="text-xs text-lightGrey mt-2">Offboarded</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { id: "all", label: "All" },
          { id: "permanent", label: "Permanent" },
          { id: "temporary", label: "Temporary" },
          { id: "former", label: "Former" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-4 py-2 rounded-lg text-sm border transition-all ${
              filter === id
                ? "bg-white/20 text-white border-white/30"
                : "bg-white/5 text-lightGrey border-white/10 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Employees Table */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">All Employees</h2>
          <p className="text-xs text-lightGrey">
            Click Edit to update employment type or details
          </p>
        </div>
        <Table columns={columns} data={filteredEmployees} />
      </Card>

      {/* Department Breakdown + Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">
            Department Breakdown
          </h2>
          <div className="space-y-4">
            {[
              "Engineering",
              "Sales",
              "Marketing",
              "HR",
              "Product",
              "Operations",
              "Finance",
              "Customer Success",
            ].map((dept) => {
              const count = employeeList.filter(
                (e) => e.department === dept
              ).length;
              return (
                <div key={dept} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-medium">{dept}</span>
                      <span className="text-lightGrey text-sm">
                        {count} employees
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (count / employeeList.length) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-white mb-4">HR Contact</h2>
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
                <p className="text-white">+62 811-2222-0000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-silver mt-1" />
              <div>
                <p className="text-lightGrey text-sm mb-1">Address</p>
                <p className="text-white">Noxt HQ, Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={mode === "add" ? "Add Employee" : "Edit Employee"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white mb-1">Full Name</label>
              <input
                className="glass-input w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Employee name"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">
                Department
              </label>
              <input
                className="glass-input w-full"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                placeholder="e.g., Engineering"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white mb-1">Role</label>
              <input
                className="glass-input w-full"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g., Backend Engineer"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="glass-input w-full"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white mb-1">Email</label>
              <input
                className="glass-input w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">Phone</label>
              <input
                className="glass-input w-full"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+62 ..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white mb-1">
                Employment Type
              </label>
              <select
                className="glass-input w-full"
                value={form.employmentType}
                onChange={(e) =>
                  setForm({ ...form, employmentType: e.target.value })
                }
              >
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
                <option value="former">Former</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white mb-1">
                Current Status
              </label>
              <select
                className="glass-input w-full"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {mode === "add" ? "Add" : "Save"} Employee
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
