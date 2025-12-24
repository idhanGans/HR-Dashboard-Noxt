import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./index.css";

// Sidebar Component with Navigation
const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Attendance", path: "/attendance" },
    { name: "Payroll", path: "/payroll" },
    { name: "KPI Tracker", path: "/kpi" },
    { name: "Employees", path: "/employees" },
    { name: "Leave", path: "/leave" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f0f0f, #1a1a1a, #2a2a2a)",
        padding: "24px",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #c0c0c0, #ffffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "4px",
          }}
        >
          Noxt Indonesia
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "12px" }}>
          HR Management System
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              style={{
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                color: isActive ? "white" : "#9ca3af",
                backgroundColor: isActive
                  ? "rgba(192, 192, 192, 0.15)"
                  : "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                borderLeft: isActive
                  ? "3px solid #c0c0c0"
                  : "3px solid transparent",
              }}
            >
              {item.name}
            </div>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "8px",
          color: "#fca5a5",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

// Layout Component
const Layout = ({ children, onLogout }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
      }}
    >
      <Sidebar onLogout={onLogout} />
      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
};

// Glass Card Component
const GlassCard = ({ children, style = {} }) => (
  <div
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      padding: "24px",
      ...style,
    }}
  >
    {children}
  </div>
);

// Login Page
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("admin");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(userRole);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 50%, #c0c0c0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "4px",
            background: "linear-gradient(90deg, #c0c0c0, #ffffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Noxt Indonesia
        </h1>
        <p
          style={{
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "14px",
          }}
        >
          HR Management System
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "white",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "white",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "white",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Login as
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["admin", "employee"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUserRole(role)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border:
                      userRole === role
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor:
                      userRole === role
                        ? "#c0c0c0"
                        : "rgba(255, 255, 255, 0.1)",
                    color: userRole === role ? "black" : "white",
                    fontWeight: userRole === role ? "600" : "400",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(90deg, #c0c0c0, #ffffff)",
              border: "none",
              borderRadius: "8px",
              color: "black",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
          }}
        >
          <p
            style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}
          >
            <strong>Demo Credentials:</strong>
          </p>
          <p style={{ color: "white", fontSize: "12px" }}>
            Username: admin | Password: demo
          </p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page
const DashboardPage = ({ onLogout }) => {
  const stats = [
    {
      label: "Total Employees",
      value: "245",
      change: "+12%",
      color: "#3b82f6",
    },
    {
      label: "Today's Attendance",
      value: "238/245",
      change: "97%",
      color: "#10b981",
    },
    {
      label: "Current Payroll",
      value: "Rp 2.4B",
      change: "+5%",
      color: "#8b5cf6",
    },
    { label: "Average KPI", value: "8.5/10", change: "+0.3", color: "#f59e0b" },
  ];

  return (
    <Layout onLogout={onLogout}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "8px",
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
        Welcome back! Here is your HR overview for Noxt Indonesia.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {stats.map((stat) => (
          <GlassCard key={stat.label}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </p>
            <p style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}>
              {stat.value}
            </p>
            <p style={{ color: "#10b981", fontSize: "12px", marginTop: "8px" }}>
              ↑ {stat.change} from last month
            </p>
          </GlassCard>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}
      >
        <GlassCard style={{ height: "300px" }}>
          <h3
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Monthly Attendance
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "12px",
              height: "200px",
            }}
          >
            {[60, 75, 85, 90, 80, 95].map((height, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: height + "%",
                    backgroundColor: "#10b981",
                    borderRadius: "4px",
                  }}
                />
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard style={{ height: "300px" }}>
          <h3
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Department Distribution
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {[
              { name: "Engineering", count: 85, color: "#3b82f6" },
              { name: "Marketing", count: 45, color: "#10b981" },
              { name: "Finance", count: 35, color: "#f59e0b" },
              { name: "HR", count: 25, color: "#8b5cf6" },
              { name: "Operations", count: 55, color: "#ef4444" },
            ].map((dept) => (
              <div
                key={dept.name}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: dept.color,
                  }}
                />
                <span style={{ color: "white", flex: 1 }}>{dept.name}</span>
                <span style={{ color: "#9ca3af" }}>{dept.count}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
};

// Attendance Page
const AttendancePage = ({ onLogout }) => {
  const [myCheckIn, setMyCheckIn] = useState(null);
  const [myCheckOut, setMyCheckOut] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      name: "Ahmad Rizki",
      department: "Engineering",
      checkIn: "08:00",
      checkOut: "17:00",
      status: "Present",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      department: "Marketing",
      checkIn: "08:15",
      checkOut: "17:30",
      status: "Present",
    },
    {
      id: 3,
      name: "Budi Santoso",
      department: "Finance",
      checkIn: "09:00",
      checkOut: "-",
      status: "Late",
    },
    {
      id: 4,
      name: "Dewi Lestari",
      department: "HR",
      checkIn: "-",
      checkOut: "-",
      status: "Absent",
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      department: "Operations",
      checkIn: "07:45",
      checkOut: "16:30",
      status: "Present",
    },
    {
      id: 6,
      name: "Fitri Handayani",
      department: "Engineering",
      checkIn: "08:30",
      checkOut: "-",
      status: "Late",
    },
  ]);

  // Update current time every second
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatTimeShort = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCheckIn = () => {
    const now = new Date();
    setMyCheckIn(now);
    const isLate = now.getHours() >= 9;

    // Add current user to attendance list
    const newEntry = {
      id: attendanceData.length + 1,
      name: "You (Current User)",
      department: "Engineering",
      checkIn: formatTimeShort(now),
      checkOut: "-",
      status: isLate ? "Late" : "Present",
    };
    setAttendanceData([newEntry, ...attendanceData]);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setMyCheckOut(now);

    // Update current user's checkout time
    setAttendanceData(
      attendanceData.map((row) =>
        row.name === "You (Current User)"
          ? { ...row, checkOut: formatTimeShort(now) }
          : row
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return { bg: "rgba(16, 185, 129, 0.2)", text: "#10b981" };
      case "Late":
        return { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" };
      case "Absent":
        return { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444" };
      default:
        return { bg: "rgba(156, 163, 175, 0.2)", text: "#9ca3af" };
    }
  };

  const getMyStatus = () => {
    if (!myCheckIn) return "Not Checked In";
    if (myCheckIn && !myCheckOut) return "Working";
    return "Completed";
  };

  const getMyStatusColor = () => {
    if (!myCheckIn) return "#9ca3af";
    if (myCheckIn && !myCheckOut) return "#10b981";
    return "#3b82f6";
  };

  return (
    <Layout onLogout={onLogout}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "8px",
        }}
      >
        Attendance
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
        Track employee attendance records
      </p>

      {/* Employee Check In/Out Card */}
      <GlassCard
        style={{
          marginBottom: "32px",
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h3
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              My Attendance
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              December 24, 2025 • Current Time:{" "}
              <span style={{ color: "#10b981", fontWeight: "600" }}>
                {formatTime(currentTime)}
              </span>
            </p>
            <p
              style={{
                color: getMyStatusColor(),
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Status: {getMyStatus()}
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {/* Check In Section */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                Check In
              </p>
              {myCheckIn ? (
                <div
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "#10b981",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {formatTimeShort(myCheckIn)}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCheckIn}
                  style={{
                    padding: "12px 32px",
                    background: "linear-gradient(90deg, #10b981, #059669)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Check In
                </button>
              )}
            </div>

            {/* Check Out Section */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                Check Out
              </p>
              {myCheckOut ? (
                <div
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "#3b82f6",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {formatTimeShort(myCheckOut)}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCheckOut}
                  disabled={!myCheckIn}
                  style={{
                    padding: "12px 32px",
                    background: myCheckIn
                      ? "linear-gradient(90deg, #3b82f6, #2563eb)"
                      : "rgba(255, 255, 255, 0.1)",
                    border: myCheckIn
                      ? "none"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: myCheckIn ? "white" : "#6b7280",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: myCheckIn ? "pointer" : "not-allowed",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    myCheckIn && (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Check Out
                </button>
              )}
            </div>

            {/* Work Duration */}
            {myCheckIn && (
              <div style={{ textAlign: "center", marginLeft: "16px" }}>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Work Duration
                </p>
                <div
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "rgba(139, 92, 246, 0.2)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "#8b5cf6",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {(() => {
                      const end = myCheckOut || currentTime;
                      const diff = Math.floor((end - myCheckIn) / 1000);
                      const hours = Math.floor(diff / 3600);
                      const minutes = Math.floor((diff % 3600) / 60);
                      return `${hours}h ${minutes}m`;
                    })()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "Present Today", value: "238", color: "#10b981" },
          { label: "Late", value: "5", color: "#f59e0b" },
          { label: "Absent", value: "2", color: "#ef4444" },
          { label: "On Leave", value: "7", color: "#3b82f6" },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                color: stat.color,
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {stat.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h3
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Today Attendance - December 24, 2025
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {[
                "Employee",
                "Department",
                "Check In",
                "Check Out",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#9ca3af",
                    fontWeight: "500",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((row) => {
              const statusStyle = getStatusColor(row.status);
              const isCurrentUser = row.name === "You (Current User)";
              return (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    backgroundColor: isCurrentUser
                      ? "rgba(16, 185, 129, 0.1)"
                      : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      color: "white",
                      fontWeight: isCurrentUser ? "600" : "400",
                    }}
                  >
                    {row.name}{" "}
                    {isCurrentUser && (
                      <span style={{ color: "#10b981", fontSize: "12px" }}>
                        ●
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af" }}>
                    {row.department}
                  </td>
                  <td style={{ padding: "12px", color: "white" }}>
                    {row.checkIn}
                  </td>
                  <td style={{ padding: "12px", color: "white" }}>
                    {row.checkOut}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        fontSize: "12px",
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </Layout>
  );
};

// Payroll Page
const PayrollPage = ({ onLogout }) => {
  const payrollData = [
    {
      id: 1,
      name: "Ahmad Rizki",
      position: "Senior Engineer",
      baseSalary: "Rp 25,000,000",
      bonus: "Rp 5,000,000",
      total: "Rp 30,000,000",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      position: "Marketing Manager",
      baseSalary: "Rp 20,000,000",
      bonus: "Rp 3,000,000",
      total: "Rp 23,000,000",
    },
    {
      id: 3,
      name: "Budi Santoso",
      position: "Finance Analyst",
      baseSalary: "Rp 18,000,000",
      bonus: "Rp 2,000,000",
      total: "Rp 20,000,000",
    },
    {
      id: 4,
      name: "Dewi Lestari",
      position: "HR Specialist",
      baseSalary: "Rp 15,000,000",
      bonus: "Rp 1,500,000",
      total: "Rp 16,500,000",
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      position: "Operations Lead",
      baseSalary: "Rp 22,000,000",
      bonus: "Rp 4,000,000",
      total: "Rp 26,000,000",
    },
  ];

  return (
    <Layout onLogout={onLogout}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "8px",
        }}
      >
        Payroll
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
        Manage employee salaries and compensation
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "Total Payroll", value: "Rp 2.4B", sub: "December 2025" },
          { label: "Average Salary", value: "Rp 18M", sub: "Per employee" },
          { label: "Total Bonus", value: "Rp 180M", sub: "This month" },
          { label: "Pending", value: "12", sub: "Approvals" },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </p>
            <p style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}>
              {stat.value}
            </p>
            <p style={{ color: "#9ca3af", fontSize: "12px", marginTop: "4px" }}>
              {stat.sub}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
            Payroll List
          </h3>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#c0c0c0",
              border: "none",
              borderRadius: "8px",
              color: "black",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Run Payroll
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {["Employee", "Position", "Base Salary", "Bonus", "Total"].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      color: "#9ca3af",
                      fontWeight: "500",
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {payrollData.map((row) => (
              <tr
                key={row.id}
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <td style={{ padding: "12px", color: "white" }}>{row.name}</td>
                <td style={{ padding: "12px", color: "#9ca3af" }}>
                  {row.position}
                </td>
                <td style={{ padding: "12px", color: "white" }}>
                  {row.baseSalary}
                </td>
                <td style={{ padding: "12px", color: "#10b981" }}>
                  {row.bonus}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </Layout>
  );
};

// KPI Tracker Page
const KPIPage = ({ onLogout }) => {
  const kpiData = [
    {
      id: 1,
      name: "Ahmad Rizki",
      department: "Engineering",
      q1: 8.5,
      q2: 9.0,
      q3: 8.8,
      q4: 9.2,
      avg: 8.9,
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      department: "Marketing",
      q1: 7.8,
      q2: 8.2,
      q3: 8.5,
      q4: 8.8,
      avg: 8.3,
    },
    {
      id: 3,
      name: "Budi Santoso",
      department: "Finance",
      q1: 8.0,
      q2: 8.0,
      q3: 8.2,
      q4: 8.5,
      avg: 8.2,
    },
    {
      id: 4,
      name: "Dewi Lestari",
      department: "HR",
      q1: 9.0,
      q2: 9.2,
      q3: 9.0,
      q4: 9.5,
      avg: 9.2,
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      department: "Operations",
      q1: 7.5,
      q2: 8.0,
      q3: 8.5,
      q4: 8.8,
      avg: 8.2,
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 9) return "#10b981";
    if (score >= 8) return "#3b82f6";
    if (score >= 7) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <Layout onLogout={onLogout}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "8px",
        }}
      >
        KPI Tracker
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
        Monitor employee performance metrics
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "Company Average", value: "8.5", color: "#10b981" },
          { label: "Top Performer", value: "9.5", color: "#3b82f6" },
          { label: "Needs Improvement", value: "12", color: "#f59e0b" },
          { label: "Reviews Pending", value: "23", color: "#8b5cf6" },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                color: stat.color,
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {stat.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h3
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Employee KPI Scores - 2025
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {[
                "Employee",
                "Department",
                "Q1",
                "Q2",
                "Q3",
                "Q4",
                "Average",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#9ca3af",
                    fontWeight: "500",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpiData.map((row) => (
              <tr
                key={row.id}
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <td style={{ padding: "12px", color: "white" }}>{row.name}</td>
                <td style={{ padding: "12px", color: "#9ca3af" }}>
                  {row.department}
                </td>
                <td style={{ padding: "12px", color: getScoreColor(row.q1) }}>
                  {row.q1}
                </td>
                <td style={{ padding: "12px", color: getScoreColor(row.q2) }}>
                  {row.q2}
                </td>
                <td style={{ padding: "12px", color: getScoreColor(row.q3) }}>
                  {row.q3}
                </td>
                <td style={{ padding: "12px", color: getScoreColor(row.q4) }}>
                  {row.q4}
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      backgroundColor: getScoreColor(row.avg) + "20",
                      color: getScoreColor(row.avg),
                      fontWeight: "bold",
                    }}
                  >
                    {row.avg}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </Layout>
  );
};

// Employees Page with Full CRUD
const EmployeesPage = ({ onLogout }) => {
  const initialEmployees = [
    {
      id: 1,
      employeeId: "NXT-001",
      name: "Ahmad Rizki",
      nickname: "Rizki",
      gender: "Male",
      dateOfBirth: "1990-05-15",
      email: "ahmad@noxt.id",
      phone: "081234567890",
      npwp: "12.345.678.9-012.000",
      ktp: "3171234567890001",
      domicile: "Jakarta Selatan",
      typeOfWork: "Full-time",
      workStatus: "Active",
      division: "Engineering",
      position: "Senior Engineer",
      level: "Senior",
      dateOfJoin: "2020-03-15",
      dateOfResign: "-",
      maritalStatus: "Married",
      children: 2,
      bankName: "BCA",
      accountNumber: "1234567890",
      validFrom: "2020-03-15",
      validUntil: "2026-03-15",
      salary: 25000000,
    },
    {
      id: 2,
      employeeId: "NXT-002",
      name: "Siti Nurhaliza",
      nickname: "Siti",
      gender: "Female",
      dateOfBirth: "1988-08-20",
      email: "siti@noxt.id",
      phone: "081234567891",
      npwp: "12.345.678.9-013.000",
      ktp: "3171234567890002",
      domicile: "Jakarta Pusat",
      typeOfWork: "Full-time",
      workStatus: "Active",
      division: "Marketing",
      position: "Marketing Manager",
      level: "Manager",
      dateOfJoin: "2019-08-01",
      dateOfResign: "-",
      maritalStatus: "Single",
      children: 0,
      bankName: "Mandiri",
      accountNumber: "1234567891",
      validFrom: "2019-08-01",
      validUntil: "2025-08-01",
      salary: 20000000,
    },
    {
      id: 3,
      employeeId: "NXT-003",
      name: "Budi Santoso",
      nickname: "Budi",
      gender: "Male",
      dateOfBirth: "1992-01-10",
      email: "budi@noxt.id",
      phone: "081234567892",
      npwp: "12.345.678.9-014.000",
      ktp: "3171234567890003",
      domicile: "Tangerang",
      typeOfWork: "Full-time",
      workStatus: "Active",
      division: "Finance",
      position: "Finance Analyst",
      level: "Junior",
      dateOfJoin: "2021-01-10",
      dateOfResign: "-",
      maritalStatus: "Married",
      children: 1,
      bankName: "BNI",
      accountNumber: "1234567892",
      validFrom: "2021-01-10",
      validUntil: "2027-01-10",
      salary: 18000000,
    },
    {
      id: 4,
      employeeId: "NXT-004",
      name: "Dewi Lestari",
      nickname: "Dewi",
      gender: "Female",
      dateOfBirth: "1995-06-20",
      email: "dewi@noxt.id",
      phone: "081234567893",
      npwp: "12.345.678.9-015.000",
      ktp: "3171234567890004",
      domicile: "Bekasi",
      typeOfWork: "Full-time",
      workStatus: "On Leave",
      division: "HR",
      position: "HR Specialist",
      level: "Mid",
      dateOfJoin: "2020-06-20",
      dateOfResign: "-",
      maritalStatus: "Married",
      children: 0,
      bankName: "BCA",
      accountNumber: "1234567893",
      validFrom: "2020-06-20",
      validUntil: "2026-06-20",
      salary: 15000000,
    },
    {
      id: 5,
      employeeId: "NXT-005",
      name: "Eko Prasetyo",
      nickname: "Eko",
      gender: "Male",
      dateOfBirth: "1985-11-05",
      email: "eko@noxt.id",
      phone: "081234567894",
      npwp: "12.345.678.9-016.000",
      ktp: "3171234567890005",
      domicile: "Depok",
      typeOfWork: "Full-time",
      workStatus: "Active",
      division: "Operations",
      position: "Operations Lead",
      level: "Lead",
      dateOfJoin: "2018-11-05",
      dateOfResign: "-",
      maritalStatus: "Married",
      children: 3,
      bankName: "Mandiri",
      accountNumber: "1234567894",
      validFrom: "2018-11-05",
      validUntil: "2024-11-05",
      salary: 22000000,
    },
    {
      id: 6,
      employeeId: "NXT-006",
      name: "Fitri Handayani",
      nickname: "Fitri",
      gender: "Female",
      dateOfBirth: "1996-02-14",
      email: "fitri@noxt.id",
      phone: "081234567895",
      npwp: "12.345.678.9-017.000",
      ktp: "3171234567890006",
      domicile: "Jakarta Barat",
      typeOfWork: "Full-time",
      workStatus: "Active",
      division: "Engineering",
      position: "Frontend Developer",
      level: "Junior",
      dateOfJoin: "2022-02-14",
      dateOfResign: "-",
      maritalStatus: "Single",
      children: 0,
      bankName: "BRI",
      accountNumber: "1234567895",
      validFrom: "2022-02-14",
      validUntil: "2028-02-14",
      salary: 12000000,
    },
  ];

  const [employees, setEmployees] = useState(initialEmployees);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyEmployee = {
    employeeId: "",
    name: "",
    nickname: "",
    gender: "Male",
    dateOfBirth: "",
    email: "",
    phone: "",
    npwp: "",
    ktp: "",
    domicile: "",
    typeOfWork: "Full-time",
    workStatus: "Active",
    division: "",
    position: "",
    level: "Junior",
    dateOfJoin: "",
    dateOfResign: "-",
    maritalStatus: "Single",
    children: 0,
    bankName: "",
    accountNumber: "",
    validFrom: "",
    validUntil: "",
    salary: 0,
  };

  const [formData, setFormData] = useState(emptyEmployee);

  const generateEmployeeId = () => {
    const maxId = Math.max(
      ...employees.map((e) => parseInt(e.employeeId.split("-")[1])),
      0
    );
    return `NXT-${String(maxId + 1).padStart(3, "0")}`;
  };

  const handleAddNew = () => {
    setFormData({ ...emptyEmployee, employeeId: generateEmployeeId() });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleViewDetail = (emp) => {
    setSelectedEmployee(emp);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (emp) => {
    setSelectedEmployee(emp);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    setEmployees(employees.filter((e) => e.id !== selectedEmployee.id));
    setShowDeleteConfirm(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setEmployees(
        employees.map((emp) => (emp.id === formData.id ? formData : emp))
      );
    } else {
      setEmployees([...employees, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
    setFormData(emptyEmployee);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "6px",
    color: "white",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    color: "#9ca3af",
    marginBottom: "6px",
    fontSize: "12px",
  };

  const activeCount = employees.filter((e) => e.workStatus === "Active").length;
  const onLeaveCount = employees.filter(
    (e) => e.workStatus === "On Leave"
  ).length;
  const resignedCount = employees.filter(
    (e) => e.workStatus === "Resigned"
  ).length;

  return (
    <Layout onLogout={onLogout}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "8px",
        }}
      >
        Employee Management
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
        Complete employee database with full CRUD operations
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Total Employees",
            value: employees.length,
            color: "#3b82f6",
          },
          { label: "Active", value: activeCount, color: "#10b981" },
          { label: "On Leave", value: onLeaveCount, color: "#f59e0b" },
          { label: "Resigned", value: resignedCount, color: "#ef4444" },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                color: stat.color,
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {stat.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h3 style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
            Employee Database
          </h3>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                width: "250px",
              }}
            />
            <button
              onClick={handleAddNew}
              style={{
                padding: "8px 16px",
                backgroundColor: "#10b981",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              + Register Employee
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1200px",
            }}
          >
            <thead>
              <tr
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                {[
                  "ID",
                  "Name",
                  "Division",
                  "Position",
                  "Level",
                  "Status",
                  "Join Date",
                  "Salary",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      color: "#9ca3af",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      color: "#c0c0c0",
                      fontWeight: "500",
                    }}
                  >
                    {emp.employeeId}
                  </td>
                  <td style={{ padding: "12px", color: "white" }}>
                    {emp.name}
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af" }}>
                    {emp.division}
                  </td>
                  <td style={{ padding: "12px", color: "white" }}>
                    {emp.position}
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af" }}>
                    {emp.level}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        backgroundColor:
                          emp.workStatus === "Active"
                            ? "rgba(16, 185, 129, 0.2)"
                            : emp.workStatus === "On Leave"
                            ? "rgba(245, 158, 11, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                        color:
                          emp.workStatus === "Active"
                            ? "#10b981"
                            : emp.workStatus === "On Leave"
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {emp.workStatus}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af" }}>
                    {emp.dateOfJoin}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "#10b981",
                      fontWeight: "500",
                    }}
                  >
                    {formatCurrency(emp.salary)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleViewDetail(emp)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "rgba(59, 130, 246, 0.2)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          borderRadius: "6px",
                          color: "#3b82f6",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(emp)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "rgba(245, 158, 11, 0.2)",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                          borderRadius: "6px",
                          color: "#f59e0b",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(emp)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "rgba(239, 68, 68, 0.2)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "6px",
                          color: "#ef4444",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "900px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              {isEditing ? "Edit Employee" : "Register New Employee"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label style={labelStyle}>Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    disabled
                    style={{ ...inputStyle, opacity: 0.6 }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nickname</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option value="Male" style={{ backgroundColor: "#1a1a1a" }}>
                      Male
                    </option>
                    <option
                      value="Female"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Female
                    </option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>NPWP</label>
                  <input
                    type="text"
                    value={formData.npwp}
                    onChange={(e) =>
                      setFormData({ ...formData, npwp: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>KTP</label>
                  <input
                    type="text"
                    value={formData.ktp}
                    onChange={(e) =>
                      setFormData({ ...formData, ktp: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Domicile</label>
                  <input
                    type="text"
                    value={formData.domicile}
                    onChange={(e) =>
                      setFormData({ ...formData, domicile: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Type of Work</label>
                  <select
                    value={formData.typeOfWork}
                    onChange={(e) =>
                      setFormData({ ...formData, typeOfWork: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option
                      value="Full-time"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Full-time
                    </option>
                    <option
                      value="Part-time"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Part-time
                    </option>
                    <option
                      value="Contract"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Contract
                    </option>
                    <option
                      value="Internship"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Internship
                    </option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Work Status</label>
                  <select
                    value={formData.workStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, workStatus: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option
                      value="Active"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Active
                    </option>
                    <option
                      value="On Leave"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      On Leave
                    </option>
                    <option
                      value="Resigned"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Resigned
                    </option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Division *</label>
                  <select
                    value={formData.division}
                    onChange={(e) =>
                      setFormData({ ...formData, division: e.target.value })
                    }
                    style={inputStyle}
                    required
                  >
                    <option value="" style={{ backgroundColor: "#1a1a1a" }}>
                      Select Division
                    </option>
                    <option
                      value="Engineering"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Engineering
                    </option>
                    <option
                      value="Marketing"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Marketing
                    </option>
                    <option
                      value="Finance"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Finance
                    </option>
                    <option value="HR" style={{ backgroundColor: "#1a1a1a" }}>
                      HR
                    </option>
                    <option
                      value="Operations"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Operations
                    </option>
                    <option
                      value="Sales"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Sales
                    </option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option
                      value="Intern"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Intern
                    </option>
                    <option
                      value="Junior"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Junior
                    </option>
                    <option value="Mid" style={{ backgroundColor: "#1a1a1a" }}>
                      Mid
                    </option>
                    <option
                      value="Senior"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Senior
                    </option>
                    <option value="Lead" style={{ backgroundColor: "#1a1a1a" }}>
                      Lead
                    </option>
                    <option
                      value="Manager"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Manager
                    </option>
                    <option
                      value="Director"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Director
                    </option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date of Join *</label>
                  <input
                    type="date"
                    value={formData.dateOfJoin}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfJoin: e.target.value })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date of Resign</label>
                  <input
                    type="date"
                    value={
                      formData.dateOfResign === "-" ? "" : formData.dateOfResign
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfResign: e.target.value || "-",
                      })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maritalStatus: e.target.value,
                      })
                    }
                    style={inputStyle}
                  >
                    <option
                      value="Single"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Single
                    </option>
                    <option
                      value="Married"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Married
                    </option>
                    <option
                      value="Divorced"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Divorced
                    </option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Number of Children</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        children: parseInt(e.target.value) || 0,
                      })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Bank Name</label>
                  <select
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    style={inputStyle}
                  >
                    <option value="" style={{ backgroundColor: "#1a1a1a" }}>
                      Select Bank
                    </option>
                    <option value="BCA" style={{ backgroundColor: "#1a1a1a" }}>
                      BCA
                    </option>
                    <option
                      value="Mandiri"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      Mandiri
                    </option>
                    <option value="BNI" style={{ backgroundColor: "#1a1a1a" }}>
                      BNI
                    </option>
                    <option value="BRI" style={{ backgroundColor: "#1a1a1a" }}>
                      BRI
                    </option>
                    <option
                      value="CIMB Niaga"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      CIMB Niaga
                    </option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Account Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumber: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Salary (IDR) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: parseInt(e.target.value) || 0,
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#10b981",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {isEditing ? "Update Employee" : "Register Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}
              >
                Employee Details - {selectedEmployee.employeeId}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {[
                { label: "Employee ID", value: selectedEmployee.employeeId },
                { label: "Full Name", value: selectedEmployee.name },
                { label: "Nickname", value: selectedEmployee.nickname },
                { label: "Gender", value: selectedEmployee.gender },
                { label: "Date of Birth", value: selectedEmployee.dateOfBirth },
                { label: "Email", value: selectedEmployee.email },
                { label: "Phone", value: selectedEmployee.phone },
                { label: "NPWP", value: selectedEmployee.npwp },
                { label: "KTP", value: selectedEmployee.ktp },
                { label: "Domicile", value: selectedEmployee.domicile },
                { label: "Type of Work", value: selectedEmployee.typeOfWork },
                { label: "Work Status", value: selectedEmployee.workStatus },
                { label: "Division", value: selectedEmployee.division },
                { label: "Position", value: selectedEmployee.position },
                { label: "Level", value: selectedEmployee.level },
                { label: "Date of Join", value: selectedEmployee.dateOfJoin },
                {
                  label: "Date of Resign",
                  value: selectedEmployee.dateOfResign,
                },
                {
                  label: "Marital Status",
                  value: selectedEmployee.maritalStatus,
                },
                { label: "Children", value: selectedEmployee.children },
                { label: "Bank Name", value: selectedEmployee.bankName },
                {
                  label: "Account Number",
                  value: selectedEmployee.accountNumber,
                },
                { label: "Valid From", value: selectedEmployee.validFrom },
                { label: "Valid Until", value: selectedEmployee.validUntil },
                {
                  label: "Salary",
                  value: formatCurrency(selectedEmployee.salary),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {item.value || "-"}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedEmployee);
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "rgba(245, 158, 11, 0.2)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "8px",
                  color: "#f59e0b",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Edit Employee
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#c0c0c0",
                  border: "none",
                  borderRadius: "8px",
                  color: "black",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEmployee && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <span style={{ fontSize: "32px" }}>⚠️</span>
            </div>
            <h3
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              Delete Employee?
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "white" }}>
                {selectedEmployee.name}
              </strong>
              ? This action cannot be undone.
            </p>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ef4444",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// Leave Page
const LeavePage = ({ onLogout }) => {
  const leaveRequests = [
    {
      id: 1,
      name: "Ahmad Rizki",
      type: "Annual Leave",
      startDate: "2025-12-26",
      endDate: "2025-12-31",
      days: 4,
      status: "Pending",
      reason: "Family vacation",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      type: "Sick Leave",
      startDate: "2025-12-20",
      endDate: "2025-12-21",
      days: 2,
      status: "Approved",
      reason: "Medical checkup",
    },
    {
      id: 3,
      name: "Budi Santoso",
      type: "Annual Leave",
      startDate: "2025-12-28",
      endDate: "2026-01-03",
      days: 5,
      status: "Pending",
      reason: "New Year holiday",
    },
    {
      id: 4,
      name: "Dewi Lestari",
      type: "Maternity",
      startDate: "2025-12-15",
      endDate: "2026-03-15",
      days: 90,
      status: "Approved",
      reason: "Maternity leave",
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      type: "Annual Leave",
      startDate: "2025-12-25",
      endDate: "2025-12-25",
      days: 1,
      status: "Rejected",
      reason: "Personal matters",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return { bg: "rgba(16, 185, 129, 0.2)", text: "#10b981" };
      case "Pending":
        return { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" };
      case "Rejected":
        return { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444" };
      default:
        return { bg: "rgba(156, 163, 175, 0.2)", text: "#9ca3af" };
    }
  };

  return (
    <Layout onLogout={onLogout}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "8px",
        }}
      >
        Leave Management
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
        Manage employee leave requests and approvals
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "Pending Requests", value: "8", color: "#f59e0b" },
          { label: "Approved Today", value: "3", color: "#10b981" },
          { label: "On Leave Now", value: "7", color: "#3b82f6" },
          { label: "Rejected", value: "2", color: "#ef4444" },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                color: stat.color,
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {stat.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
            Leave Requests
          </h3>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#c0c0c0",
              border: "none",
              borderRadius: "8px",
              color: "black",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + New Request
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              {[
                "Employee",
                "Type",
                "Start Date",
                "End Date",
                "Days",
                "Status",
                "Reason",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#9ca3af",
                    fontWeight: "500",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => {
              const statusStyle = getStatusStyle(req.status);
              return (
                <tr
                  key={req.id}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <td style={{ padding: "12px", color: "white" }}>
                    {req.name}
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af" }}>
                    {req.type}
                  </td>
                  <td style={{ padding: "12px", color: "white" }}>
                    {req.startDate}
                  </td>
                  <td style={{ padding: "12px", color: "white" }}>
                    {req.endDate}
                  </td>
                  <td style={{ padding: "12px", color: "white" }}>
                    {req.days}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        fontSize: "12px",
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "#9ca3af",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {req.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </Layout>
  );
};

// Settings Page
const SettingsPage = ({ onLogout }) => {
  const [settings, setSettings] = useState({
    companyName: "Noxt Indonesia",
    email: "hr@noxt.id",
    timezone: "Asia/Jakarta",
    language: "Indonesian",
    notifications: true,
    emailAlerts: true,
    darkMode: true,
  });

  return (
    <Layout onLogout={onLogout}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "8px",
        }}
      >
        Settings
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "32px" }}>
        Configure your HR system preferences
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}
      >
        <GlassCard>
          <h3
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Company Information
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#9ca3af",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#9ca3af",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                HR Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#9ca3af",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) =>
                  setSettings({ ...settings, timezone: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option
                  value="Asia/Jakarta"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  Asia/Jakarta (WIB)
                </option>
                <option
                  value="Asia/Makassar"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  Asia/Makassar (WITA)
                </option>
                <option
                  value="Asia/Jayapura"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  Asia/Jayapura (WIT)
                </option>
              </select>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Preferences
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {[
              {
                key: "notifications",
                label: "Push Notifications",
                desc: "Receive push notifications for important updates",
              },
              {
                key: "emailAlerts",
                label: "Email Alerts",
                desc: "Get email alerts for leave requests and approvals",
              },
              {
                key: "darkMode",
                label: "Dark Mode",
                desc: "Use dark theme for the dashboard",
              },
            ].map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ color: "white", marginBottom: "4px" }}>
                    {item.label}
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: "12px" }}>
                    {item.desc}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      [item.key]: !settings[item.key],
                    })
                  }
                  style={{
                    width: "50px",
                    height: "28px",
                    borderRadius: "14px",
                    border: "none",
                    backgroundColor: settings[item.key]
                      ? "#10b981"
                      : "rgba(255, 255, 255, 0.2)",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      position: "absolute",
                      top: "4px",
                      left: settings[item.key] ? "26px" : "4px",
                      transition: "all 0.3s",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard style={{ gridColumn: "span 2" }}>
          <h3
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            About
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Version
              </p>
              <p style={{ color: "white" }}>1.0.0</p>
            </div>
            <div>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Last Updated
              </p>
              <p style={{ color: "white" }}>December 24, 2025</p>
            </div>
            <div>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Support
              </p>
              <p style={{ color: "#c0c0c0" }}>support@noxt.id</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "#c0c0c0",
            border: "none",
            borderRadius: "8px",
            color: "black",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </Layout>
  );
};

// Main App component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("admin");

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/attendance"
          element={
            isLoggedIn ? (
              <AttendancePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/payroll"
          element={
            isLoggedIn ? (
              <PayrollPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/kpi"
          element={
            isLoggedIn ? (
              <KPIPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/employees"
          element={
            isLoggedIn ? (
              <EmployeesPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leave"
          element={
            isLoggedIn ? (
              <LeavePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isLoggedIn ? (
              <SettingsPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
