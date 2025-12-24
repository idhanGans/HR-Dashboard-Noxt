// Dummy data for dashboard mockup

export const dashboardStats = {
  totalEmployees: 245,
  todayAttendance: 238,
  currentPayroll: 542000,
  averageKPI: 8.5,
};

export const attendanceData = [
  { month: "Jan", present: 200, absent: 25, late: 20 },
  { month: "Feb", present: 210, absent: 20, late: 15 },
  { month: "Mar", present: 220, absent: 15, late: 10 },
  { month: "Apr", present: 225, absent: 12, late: 8 },
  { month: "May", present: 230, absent: 10, late: 5 },
  { month: "Jun", present: 238, absent: 5, late: 2 },
];

export const kpiTrendData = [
  { month: "Jan", value: 7.2 },
  { month: "Feb", value: 7.5 },
  { month: "Mar", value: 7.8 },
  { month: "Apr", value: 8.0 },
  { month: "May", value: 8.3 },
  { month: "Jun", value: 8.5 },
];

export const payrollByDepartment = {
  labels: ["Engineering", "Sales", "HR", "Marketing", "Operations"],
  data: [150000, 120000, 80000, 95000, 97000],
};

export const attendanceRecords = [
  {
    date: "2024-12-24",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    status: "present",
  },
  {
    date: "2024-12-23",
    checkIn: "08:55 AM",
    checkOut: "05:45 PM",
    status: "present",
  },
  {
    date: "2024-12-22",
    checkIn: "10:15 AM",
    checkOut: "06:00 PM",
    status: "late",
  },
  {
    date: "2024-12-21",
    checkIn: "09:05 AM",
    checkOut: "05:30 PM",
    status: "present",
  },
  { date: "2024-12-20", checkIn: "-", checkOut: "-", status: "absent" },
  {
    date: "2024-12-19",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    status: "present",
  },
];

export const salaryBreakdown = {
  basicSalary: 50000,
  allowances: 12000,
  bonus: 8000,
  deductions: 5000,
  totalSalary: 65000,
};

export const employees = [
  {
    id: 1,
    name: "Alice Johnson",
    department: "Engineering",
    status: "present",
    avatar: "AJ",
  },
  {
    id: 2,
    name: "Bob Smith",
    department: "Sales",
    status: "present",
    avatar: "BS",
  },
  {
    id: 3,
    name: "Carol White",
    department: "HR",
    status: "late",
    avatar: "CW",
  },
  {
    id: 4,
    name: "David Brown",
    department: "Marketing",
    status: "absent",
    avatar: "DB",
  },
  {
    id: 5,
    name: "Eve Davis",
    department: "Operations",
    status: "present",
    avatar: "ED",
  },
];

export const userProfile = {
  name: "John Doe",
  role: "Administrator",
  department: "HR",
  email: "john.doe@company.com",
  phone: "+1 (555) 123-4567",
};
