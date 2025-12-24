# HR Dashboard - Integrated HRIS Management System

A modern, professional front-end UI/UX mockup for a comprehensive Human Resources (HR) Dashboard built with React, Vite, Tailwind CSS, and Recharts.

## 🎯 Project Overview

This is a **UI/UX focused** front-end mockup with:

- ✅ Complete dashboard layouts for both Admin and Employee views
- ✅ Multiple pages: Dashboard, Attendance, Payroll, KPI Tracker, Employees, Leave, Settings
- ✅ Glassmorphism design with dark mode theme
- ✅ Interactive charts and visualizations
- ✅ Responsive design for desktop and tablet
- ✅ Dummy data throughout (no backend/database)
- ❌ No authentication logic (UI only)
- ❌ No backend API integration

## 📋 Tech Stack

- **React 19** - UI library
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Interactive charts and visualizations
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **PostCSS & Autoprefixer** - CSS processing

## 🎨 Design System

### Color Palette

- **Black**: `#0f0f0f` - Primary background
- **White**: `#ffffff` - Text and highlights
- **Silver**: `#c0c0c0` - Accent color
- **Dark Grey**: `#2a2a2a` - Secondary background
- **Light Grey**: `#9ca3af` - Text secondary

### Features

- Modern gradient backgrounds (black → dark grey → silver)
- Glassmorphism effect with backdrop blur
- Smooth animations and hover effects
- Dark mode default with professional aesthetics
- Soft shadows and subtle transitions

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Card.jsx        # Glass-effect card wrapper
│   ├── Button.jsx      # Multi-variant button
│   ├── StatusBadge.jsx # Status indicator badges
│   ├── Modal.jsx       # Modal dialog component
│   ├── Table.jsx       # Data table component
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Topbar.jsx      # Top navigation bar
│   ├── DashboardLayout.jsx # Main layout wrapper
│   └── index.js        # Component exports
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login with role toggle
│   ├── DashboardPage.jsx # Admin dashboard
│   ├── AttendancePage.jsx # Attendance tracking
│   ├── PayrollPage.jsx  # Salary slip view
│   ├── KPIPage.jsx      # KPI tracking
│   ├── EmployeesPage.jsx # Employee directory
│   ├── LeavePage.jsx    # Leave management
│   ├── SettingsPage.jsx # User settings
│   └── index.js         # Page exports
├── utils/              # Utility functions
│   └── dummyData.js     # Mock data for entire app
├── App.jsx             # Main app with routing
├── main.jsx            # App entry point
└── index.css           # Global styles & Tailwind
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5174
   ```

### Build for Production

```bash
npm run build
```

## 📖 Features & Pages

### 1. **Login Page**

- Glassmorphism login card
- Username & password inputs
- Role toggle (Admin / Employee) for demo purposes
- Gradient background

### 2. **Admin Dashboard**

- Summary cards (Total Employees, Attendance, Payroll, KPI)
- Monthly attendance bar chart
- KPI trend line chart
- Payroll by department pie chart
- Quick action buttons

### 3. **Attendance Page**

- Check-in / Check-out buttons with modals
- Attendance records table
- Status indicators (Present, Late, Absent)
- Date-based filtering

### 4. **Payroll Page**

- Detailed salary slip card
- Earnings breakdown (Basic, Allowances, Bonus)
- Deductions section
- Net salary summary
- Download payslip button
- Payment information

### 5. **KPI Tracker**

- Overall company KPI score
- 6-month KPI trend line chart
- Department KPI comparison bar chart
- Performance insights cards
- Top performer highlights

### 6. **Employee Directory**

- Employee list with status indicators
- Department breakdown with charts
- Company contact information
- Employee statistics

### 7. **Leave Management**

- Leave balance visualization
- Leave request history table
- Leave policy information
- Recent approvals list

### 8. **Settings**

- Profile information editor
- Notification preferences toggles
- Theme and language selection
- Preference settings

## 🎮 Usage

### Login Credentials (Demo)

- **Username:** admin
- **Password:** demo
- Select **Admin** or **Employee** role to see different dashboard views

### Dummy Data

All data throughout the app is hardcoded in `src/utils/dummyData.js`. Modify this file to change:

- Dashboard statistics
- Chart data
- Employee information
- Attendance records
- Payroll information

### Adding New Pages

1. Create a new page in `src/pages/`
2. Wrap content with `<DashboardLayout>` component
3. Add route in `src/App.jsx`
4. Add menu item in `src/components/Sidebar.jsx`

### Customizing Components

All reusable components are in `src/components/`:

- Modify `Card.jsx` for card styling
- Update `Button.jsx` for button variants
- Edit `Sidebar.jsx` for navigation items
- Customize `Topbar.jsx` for header elements

## 🔧 Configuration

### Tailwind CSS

- Configuration: `tailwind.config.js`
- Custom utilities and components defined in `src/index.css`
- Dark mode enabled by default

### Vite

- Configuration: `vite.config.js`
- React plugin for Fast Refresh enabled

## 📊 Chart Components

The project uses **Recharts** for all visualizations:

- Bar Charts (Attendance, KPI Comparison)
- Line Charts (KPI Trends)
- Pie Charts (Payroll Distribution)

All charts use dummy data and are fully interactive.

## 🎯 Next Steps

To convert this mockup to a production app:

1. **Add Backend API Integration**

   - Replace dummy data with API calls
   - Use `fetch` or `axios` for data fetching

2. **Implement Authentication**

   - Add real login/logout logic
   - Integrate with auth provider (JWT, OAuth, etc.)

3. **Add Database**

   - Connect to backend database
   - Implement CRUD operations

4. **Add Form Validation**

   - Implement form libraries (React Hook Form, Formik)
   - Add error handling

5. **Deploy**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or other hosting

## 📝 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Customization Guide

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  black: "#your-color",
  silver: "#your-color",
  // ... etc
}
```

### Update Logo

Replace "HR Dashboard" text in `src/components/Sidebar.jsx`

### Modify Menu Items

Edit menu items array in `src/components/Sidebar.jsx`

### Change Chart Data

Update dummy data in `src/utils/dummyData.js`

---

**Built with ❤️ using React + Vite + Tailwind CSS**
