# Quick Start Guide - HR Dashboard

## 🚀 Get Started in 3 Steps

### Step 1: Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:5174**

### Step 2: Login to Dashboard

Use any credentials (just click Login):

- **Username**: admin
- **Password**: demo
- **Role**: Select "Admin" or "Employee"

### Step 3: Explore the Dashboard

Navigate using the sidebar menu:

- 📊 **Dashboard** - Overview and charts
- 📅 **Attendance** - Check-in/out tracking
- 💰 **Payroll** - Salary slip information
- 📈 **KPI Tracker** - Performance metrics
- 👥 **Employees** - Employee directory
- 🗓️ **Leave** - Leave management
- ⚙️ **Settings** - User preferences

---

## 📝 File Structure Quick Reference

```
src/
  components/     - Reusable UI components
  pages/          - Page components (8 pages)
  utils/          - dummyData.js (all mock data)
  App.jsx         - Main app with routing
  index.css       - Tailwind + global styles
```

---

## 🎨 Key Features

✨ **Glassmorphism Design** - Modern frosted glass effect
🌙 **Dark Mode** - Professional dark theme
📱 **Responsive** - Works on all screen sizes
📊 **Interactive Charts** - Recharts visualizations
🎯 **Clean Navigation** - Intuitive sidebar menu
⚡ **Smooth Animations** - Professional transitions

---

## 🛠️ Customization

### Change Dashboard Data

Edit: `src/utils/dummyData.js`

### Update Colors

Edit: `tailwind.config.js`

### Modify Menu Items

Edit: `src/components/Sidebar.jsx`

### Add New Page

1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add menu item in `Sidebar.jsx`

---

## 📊 Pages Overview

| Page           | Features                                   |
| -------------- | ------------------------------------------ |
| **Login**      | Glassmorphism card, role toggle            |
| **Dashboard**  | Stats, bar chart, line chart, pie chart    |
| **Attendance** | Check-in/out modals, data table            |
| **Payroll**    | Salary slip, breakdown, download button    |
| **KPI**        | Trend chart, department comparison         |
| **Employees**  | Employee list, department stats            |
| **Leave**      | Balance visualization, request history     |
| **Settings**   | Profile editor, notifications, preferences |

---

## 💡 Tips

- All data is dummy data in `dummyData.js` - easy to modify
- Components are reusable and well-structured
- Tailwind classes used for all styling
- No backend required - 100% frontend
- No database - all data is hardcoded
- Charts are interactive with tooltips

---

## 🔧 Build for Production

```bash
npm run build
```

Output goes to `dist/` folder

---

## 📚 Learn More

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind**: https://tailwindcss.com
- **Recharts**: https://recharts.org
- **React Router**: https://reactrouter.com
- **Lucide Icons**: https://lucide.dev

---

**Happy coding! 🎉**
