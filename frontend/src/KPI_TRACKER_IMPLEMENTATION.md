# KPI Tracker - Enhanced Implementation Guide

## Overview

A fully functional, **local-state-only** KPI Tracker system for the HR Dashboard. This implementation uses **React**, **TypeScript**, **TailwindCSS**, **Recharts**, and **Zustand** for state management with **localStorage persistence**.

### Key Features

✅ **Local Data Management** - No backend required, all data stored locally  
✅ **Persistent Storage** - localStorage auto-saves evaluations and periods  
✅ **Real-time Filtering** - Search, department, period, and status filters  
✅ **6-Month Trends** - Interactive line chart with Recharts  
✅ **SuperAdmin Controls** - Add, edit, delete KPI evaluations  
✅ **Responsive Design** - Dark theme with smooth transitions  
✅ **Mock Data** - Pre-populated with sample employees, metrics, and periods

---

## Architecture

### File Structure

```
frontend/src/
├── types/
│   └── kpi.ts                          # KPI type definitions & utilities
├── stores/
│   └── useKpiStore.ts                  # Zustand store with localStorage
├── components/kpi/
│   ├── ManageKpiModal.tsx              # Add/edit KPI evaluations
│   ├── KpiFilters.tsx                  # Filter section
│   ├── KpiTable.tsx                    # KPI data table
│   └── KpiTrendChart.tsx               # 6-month trend chart
└── pages/
    └── KPIPage.tsx                     # Main KPI page (enhanced)
```

---

## Data Models

### Core Types

```typescript
// Period - Evaluation time frame
interface Period {
  id: string; // Unique ID
  name: string; // e.g., "January 2026"
  startDate: string; // ISO date
  endDate: string; // ISO date
  isActive: boolean; // Is this the current period?
}

// Metric - Performance measurement
interface Metric {
  id: string;
  title: string; // e.g., "Code Quality Score"
  description?: string;
  weight?: number; // 0-100 for weighted calculations
}

// Employee - Team member
interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  email?: string;
}

// MetricScore - Single metric evaluation
interface MetricScore {
  metricId: string;
  score: number; // 1-10 scale
  target?: number; // Optional target score
}

// KpiEvaluation - Complete assessment
interface KpiEvaluation {
  id: string;
  employeeId: string;
  periodId: string;
  metrics: MetricScore[]; // Array of scored metrics
  averageScore: number; // Auto-calculated
  status: "Excellent" | "Good" | "Warning" | "Critical";
}
```

---

## Data Status Mapping

```
Average Score → Status Label (Color)
≥ 8.0        → Excellent (green)
6.0 - 7.9    → Good (blue)
4.0 - 5.9    → Warning (yellow)
< 4.0        → Critical (red)
```

---

## Store API (useKpiStore)

### State Properties

```typescript
const {
  // Data collections
  periods, // Array of Period
  metrics, // Array of Metric (4 pre-loaded)
  employees, // Array of Employee (5 pre-loaded)
  evaluations, // Array of KpiEvaluation

  // UI State
  activePeriodId, // Current selected period
  filters, // Current filters {search, department, periodId, status}
  manageModalOpen, // Is modal open?
  editingEvaluationId, // ID being edited
} = useKpiStore();
```

### Actions

#### Period Management

```typescript
// Set which period is currently active for evaluation
setActivePeriod(periodId: string) → void

// Add a new evaluation period
addPeriod(period: Period) → void
```

#### KPI Management

```typescript
// Create new KPI evaluation
addKpiEvaluation(evaluation: KpiEvaluation) → void

// Update existing KPI
updateKpiEvaluation(evaluation: KpiEvaluation) → void

// Delete KPI
deleteKpiEvaluation(evaluationId: string) → void
```

#### Filtering

```typescript
// Update any filter (search, department, status, periodId)
setFilters(filters: Partial<KpiFilters>) → void

// Clear all filters
resetFilters() → void
```

#### Modal Control

```typescript
// Open manage modal (optionally for editing specific evaluation)
openManageModal(evaluationId?: string) → void

// Close modal
closeManageModal() → void
```

#### Computed Data

```typescript
// Get filtered evaluations based on current filters
getFilteredEvaluations() → KpiEvaluation[]

// Calculate company-wide average
getCompanyAverage() → number (0-10)

// Get 6-month trend points
getTrendData() → TrendDataPoint[]

// Get table display rows
getKpiTableRows() → KpiTableRow[]

// Get specific evaluation by ID
getEvaluationById(id: string) → KpiEvaluation | undefined

// Get period by ID
getPeriodById(id: string) → Period | undefined
```

---

## Component Usage

### ManageKpiModal

**Purpose**: Add or edit KPI evaluations  
**Props**:

```typescript
interface ManageKpiModalProps {
  userRole?: string; // "SUPERADMIN" to enable
  isOpen?: boolean; // External control
  onClose?: () => void;
}
```

**Features**:

- Employee selection dropdown
- Period dropdown with active indicator
- 4 performance metric sliders (1-10 scale)
- Target score sliders for each metric
- Real-time average score calculation
- Status display
- Save/Cancel buttons
- Warning if no active period

**Usage**:

```tsx
<ManageKpiModal userRole="SUPERADMIN" />
```

### KpiFilters

**Purpose**: Filter results by multiple criteria  
**Props**:

```typescript
interface KpiFiltersProps {
  onFilterChange?: () => void; // Callback when filters change
}
```

**Features**:

- Search by employee name (debounced)
- Department filter dropdown
- Period filter dropdown
- Status filter dropdown
- Visual active filter badges
- Reset button

**Usage**:

```tsx
<KpiFilters onFilterChange={() => console.log("filtered")} />
```

### KpiTable

**Purpose**: Display filtered KPI evaluations  
**Props**:

```typescript
interface KpiTableProps {
  userRole?: string; // "SUPERADMIN" for edit/delete buttons
  onEditClick?: (id: string) => void;
  isLoading?: boolean;
}
```

**Columns**:

- Employee Name
- Department
- Period
- Average Score (/10)
- Status Badge
- Actions (Edit/Delete for SuperAdmins)

**Features**:

- Responsive table with hover effects
- Status color-coded badges
- No data empty state
- Loading skeleton
- Delete confirmation dialog

**Usage**:

```tsx
<KpiTable
  userRole="SUPERADMIN"
  onEditClick={(id) => openModal(id)}
  isLoading={false}
/>
```

### KpiTrendChart

**Purpose**: Visualize KPI performance over time  
**Props**:

```typescript
interface KpiTrendChartProps {
  isLoading?: boolean;
  height?: number; // Default: 400px
}
```

**Features**:

- 6-month trend line chart (Recharts)
- Interactive tooltips
- Animated on mount
- Latest/Highest/Lowest stats
- No data state
- Responsive

**Usage**:

```tsx
<KpiTrendChart isLoading={false} height={350} />
```

---

## Mock Data

### Pre-loaded Data

The store initializes with:

**Periods**: 6 months (August 2025 - January 2026)

- Only January 2026 is marked as active

**Metrics**: 4 standard performance metrics

- Team Collaboration (weight: 25)
- Code Quality Score (weight: 25)
- Project Completion Rate (weight: 25)
- Customer Satisfaction (weight: 25)

**Employees**: 5 sample employees

- departments: Engineering, Product, Design, Marketing
- roles: Senior Dev, Frontend Dev, PM, UX Designer, Marketing Manager

**Evaluations**: Empty initially (users add via modal)

---

## Local Storage Persistence

### Stored Fields

```typescript
// localStorage key: "kpi-store"
{
  "state": {
    "periods": [...],
    "evaluations": [...],
    "activePeriodId": "p1",
    "filters": {...}
  }
}
```

The store automatically persists the following on every change:

- Periods (after adding new)
- Evaluations (add/update/delete)
- Active period
- Current filters

**Note**: Metrics and employees are NOT persisted (reset on page reload). To persist these, modify the store's `partialize` option.

---

## How to Use

### Create a KPI Evaluation

1. Click **"Add KPI"** button (SuperAdmins only)
2. Select an employee
3. Confirm period (must be active)
4. Adjust metric score sliders (1-10)
5. Optionally set target scores
6. Review average score
7. Click **"Save KPI"**

### Filter Results

1. Use **Search** field to find by employee name
2. Select **Department** from dropdown
3. Select **Period** to view different time periods
4. Filter by **Status** (Excellent/Good/Warning/Critical)
5. Click **"Reset Filters"** to clear all

### Edit KPI

1. SuperAdmin clicks **"Edit"** button on table row
2. Modal opens with existing evaluation data
3. Adjust scores as needed
4. Click **"Save KPI"** (overwrites existing)

### Delete KPI

1. SuperAdmin clicks **"Delete"** button on table row
2. Confirm in dialog
3. Evaluation is removed immediately

### Monitor Trends

- **Overall Company KPI** card shows real-time average
- **Trend Chart** displays 6-month performance line
- Filter by department/period to drill down

---

## Utility Functions

Available in `types/kpi.ts`:

```typescript
// Get status label from score
getKpiStatus(score: number) → "Excellent" | "Good" | "Warning" | "Critical"

// Get Tailwind classes for status styling
getStatusColor(status: string) → string
getStatusBadgeColor(status: string) → string

// Calculate averages
calculateAverageScore(metrics: MetricScore[]) → number
calculateCompanyAverage(evaluations: KpiEvaluation[]) → number
```

---

## Styling

### Dark Theme

- **Background**: `bg-gray-800/50`
- **Borders**: `border-gray-700`
- **Text**: `text-gray-300` (labels), `text-white` (primary)
- **Accent Colors**:
  - Blue (default): `bg-blue-500/10`, `text-blue-400`
  - Green (excellent): `bg-green-500/10`, `text-green-400`
  - Yellow (warning): `bg-yellow-500/10`, `text-yellow-400`
  - Red (critical): `bg-red-500/10`, `text-red-400`

### Responsive Breakpoints

- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3-4 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)

---

## Performance Optimizations

✓ **Memoization**: Uses `useMemo` for computed values  
✓ **Debouncing**: Search input debounced to 300ms  
✓ **Lazy Evaluation**: Chart animation only on mount  
✓ **Efficient Filters**: Indexing and early returns

---

## Future Enhancements

- [ ] Export evaluations to CSV/PDF
- [ ] Batch import evaluations
- [ ] Email notifications for low performers
- [ ] Department-level KPI analysis
- [ ] Year-over-year comparison
- [ ] Custom metric weights
- [ ] Performance benchmarking
- [ ] Backend API integration (replace localStorage)

---

## Troubleshooting

### Modal doesn't open

- Ensure `userRole === "SUPERADMIN"`
- Check browser console for errors
- Verify `openManageModal()` is being called

### Data not persisting

- Check browser's localStorage quota
- Verify "kpi-store" key in DevTools > Application > LocalStorage
- Clear cache if needed: `localStorage.clear()`

### Chart not showing

- Ensure evaluations exist for the period
- Check that `companyAverageScore > 0` in trend data
- Verify Recharts is installed: `npm list recharts`

### Filters not working

- Try resetting filters
- Check browser console for filter logic errors
- Verify employee/department names match exactly

---

## Development Notes

### Adding New Metrics

Edit `MOCK_METRICS` in `useKpiStore.ts`:

```typescript
const MOCK_METRICS: Metric[] = [
  {
    id: "m1",
    title: "Your Metric",
    description: "Description",
    weight: 20,
  },
  // ...
];
```

### Adding New Employees

Edit `MOCK_EMPLOYEES` in `useKpiStore.ts`:

```typescript
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "e1",
    name: "Jane Doe",
    department: "Engineering",
    role: "DevOps Engineer",
    email: "jane@example.com",
  },
  // ...
];
```

### Customizing Status Thresholds

Edit `getKpiStatus()` in `types/kpi.ts`:

```typescript
export function getKpiStatus(score: number) {
  if (score >= 8) return "Excellent"; // Adjust 8
  if (score >= 6) return "Good"; // Adjust 6
  if (score >= 4) return "Warning"; // Adjust 4
  return "Critical";
}
```

---

## Testing

### Manual Test Cases

- [x] Add KPI with all metrics
- [x] Edit existing KPI
- [x] Delete KPI with confirmation
- [x] Filter by employee name (debounce)
- [x] Filter by department
- [x] Filter by period
- [x] Filter by status
- [x] Reset filters
- [x] View trend chart
- [x] Overall company KPI updates correctly
- [x] Data persists on page reload
- [x] SuperAdmin access control

---

## License

Part of HR Dashboard © 2026. All rights reserved.
