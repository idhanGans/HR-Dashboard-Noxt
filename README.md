# 🏢 HR Dashboard - Noxt

<div align="center">

![HR Dashboard](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A Modern, Professional HR Information System Dashboard with Glassmorphism Design**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 📋 Overview

HR Dashboard - Noxt is a fully functional front-end mockup of a comprehensive Human Resources Information System (HRIS). Built with React and featuring a stunning dark theme with glassmorphism effects, this dashboard provides a complete UI/UX experience for HR management operations.

> **Note**: This is a front-end only project with no backend integration. All data is simulated using dummy data for demonstration purposes.

### ✨ What's Included

- ✅ **8 Complete Pages** - Login, Dashboard, Attendance, Payroll, KPI, Employees, Leave, and Settings
- ✅ **Reusable Component Library** - Professional, well-structured components
- ✅ **Interactive Charts** - Real-time data visualizations using Recharts
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile
- ✅ **Glassmorphism UI** - Modern frosted glass design aesthetic
- ✅ **Dark Theme** - Professional black, silver, and grey color scheme
- ✅ **Smooth Animations** - Polished transitions and interactions
- ✅ **Client-Side Routing** - Fast navigation with React Router

### ❌ What's NOT Included

- ❌ Backend API or Server
- ❌ Database Integration
- ❌ Real Authentication System
- ❌ Data Persistence
- ❌ Email/SMS Integration
- ❌ External API Calls

---

## 🎨 Features

### 🔐 Authentication

- Modern glassmorphism login interface
- Role-based demo (Admin/Employee views)
- Demo credentials for easy testing

### 📊 Dashboard Analytics

- **4 Summary Cards** - Key metrics at a glance
- **Bar Chart** - Monthly attendance tracking (6 months)
- **Line Chart** - KPI performance trends
- **Pie Chart** - Payroll distribution by department
- **Quick Actions** - Fast access to common tasks

### 📅 Attendance Management

- Interactive check-in/check-out system
- Real-time status tracking
- Comprehensive attendance history table
- Filter and search capabilities

### 💰 Payroll System

- Detailed salary breakdown
- Downloadable salary slips
- Tax and deduction calculations
- Monthly payroll history

### 📈 KPI Tracking

- Individual performance metrics
- Department comparison charts
- Historical trend analysis
- Goal tracking and progress indicators

### 👥 Employee Directory

- Searchable employee database
- Department-wise organization
- Employee profiles with details
- Quick contact actions

### 🗓️ Leave Management

- Available leave balance visualization
- Leave request submission system
- Approval status tracking
- Leave history with filters

### ⚙️ Settings & Preferences

- Profile management
- Notification preferences
- Theme customization options
- Personal information updates

---

## 🚀 Demo

### Login Credentials

```
Username: any (no validation)
Password: any (no validation)
Role: Admin or Employee (toggle switch)
```

### Live Preview

```bash
npm run dev
# Navigate to http://localhost:5174
```

### Screenshots

<details>
<summary>Click to view screenshots</summary>

**Login Page**

- Glassmorphism design with gradient background

**Dashboard**

- Comprehensive analytics and charts

**Attendance Page**

- Check-in/out interface with data table

**Payroll Page**

- Detailed salary breakdown

</details>

---

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Quick Setup

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd hr-dashboard-noxt

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
hr-dashboard-noxt/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, icons, etc.
│   ├── components/           # Reusable UI components
│   │   ├── Button.jsx       # Custom button component
│   │   ├── Card.jsx         # Glassmorphism card
│   │   ├── DashboardLayout.jsx  # Main layout wrapper
│   │   ├── Modal.jsx        # Modal dialog component
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── StatusBadge.jsx  # Status indicator
│   │   ├── Table.jsx        # Data table component
│   │   ├── Topbar.jsx       # Top navigation bar
│   │   └── index.js         # Component exports
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx   # Authentication page
│   │   ├── DashboardPage.jsx  # Main dashboard
│   │   ├── AttendancePage.jsx # Attendance management
│   │   ├── PayrollPage.jsx    # Payroll & salary
│   │   ├── KPIPage.jsx        # Performance tracking
│   │   ├── EmployeesPage.jsx  # Employee directory
│   │   ├── LeavePage.jsx      # Leave management
│   │   ├── SettingsPage.jsx   # User settings
│   │   └── index.js           # Page exports
│   ├── utils/
│   │   ├── dummyData.js    # Mock data for all pages
│   │   └── format.js       # Formatting utilities
│   ├── App.jsx             # Main app with routing
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles & Tailwind
│   └── main.jsx            # Application entry point
├── .gitignore
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies & scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
├── README.md               # This file
├── DOCUMENTATION.md        # Complete documentation
├── QUICK_START.md          # Quick start guide
└── IMPLEMENTATION_SUMMARY.md  # Implementation details
```

---

## 💻 Tech Stack

### Core

- **React 19.2** - UI library
- **React Router DOM 7.11** - Client-side routing
- **Vite 7.2** - Build tool and dev server

### Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom Glassmorphism** - Frosted glass effects

### Charts & Visualization

- **Recharts 3.6** - React charting library
- **Chart.js 4.5** - Chart visualizations
- **react-chartjs-2 5.3** - React wrapper for Chart.js

### Icons

- **Lucide React 0.562** - Modern icon library

### Development

- **ESLint 9.39** - Code linting
- **Autoprefixer** - CSS vendor prefixes

---

## 🎨 Design System

### Color Palette

```css
Primary:   #0f0f0f (Black)
Accent:    #c0c0c0 (Silver)
Secondary: #2a2a2a, #3a3a3a (Grey)
Text:      #ffffff, #9ca3af (White & Light Grey)
```

### Design Principles

- **Glassmorphism** - Semi-transparent elements with backdrop blur
- **Dark Mode** - Professional dark theme throughout
- **Gradients** - Subtle directional gradients for depth
- **Smooth Transitions** - All interactions have fluid animations
- **Responsive** - Mobile-first approach with breakpoints

---

## 📖 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete project documentation
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details
- **[FILE_INVENTORY.md](./FILE_INVENTORY.md)** - File inventory

---

## 🔧 Customization

### Modify Dashboard Data

Edit dummy data in:

```javascript
src / utils / dummyData.js;
```

### Update Color Scheme

Modify Tailwind configuration:

```javascript
tailwind.config.js;
```

### Add New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Sidebar.jsx`

### Customize Components

All components are located in `src/components/` and are fully customizable.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/idhanGans)

---

## 🌟 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Charts by Recharts
- Icons by Lucide React
- Inspired by modern HR management systems

---

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact via email: your.email@example.com

---

<div align="center">

**[⬆ Back to Top](#-hr-dashboard---noxt)**

Made by IdhanZarkasyah

</div>
