# Avatar Upload Feature Documentation

## Overview

The HR Dashboard now includes a comprehensive avatar management system that allows employees to upload and manage their profile pictures, and enables managers/admins to manage avatars for all employees.

## Features Implemented

### 1. **User Avatar Upload (Settings Page)**

- Located in: Settings > Profile Settings
- Employees can upload their own avatar
- Supports drag-and-drop functionality
- File validation (max 5MB, JPEG/PNG/GIF/WebP only)
- Real-time preview before saving
- Automatic persistence to localStorage

### 2. **Employee Avatar Manager (Employees Page)**

- Located in: Employees Page > Avatar Management Section
- Managers/Admins can upload avatars for any employee
- Select employee from list to manage their avatar
- Upload or remove employee avatars
- Bulk avatar management capability

### 3. **Avatar Display Components**

Avatars are now displayed in multiple locations:

- **Topbar**: Logged-in user's avatar in top navigation
- **Employee Table**: Each employee row shows their avatar
- **Top Performers Card**: Dashboard's top performers display with avatars
- **Settings Profile**: User profile settings with avatar preview

## Technical Implementation

### Components Created

#### `AvatarDisplay.tsx`

Reusable component for displaying avatars throughout the dashboard.

- **Props**:
  - `src`: Image URL or base64 data
  - `name`: Employee/user name (for initials fallback)
  - `size`: 'sm' | 'md' | 'lg' | 'xl'
  - `className`: Additional CSS classes
- **Features**:
  - Displays image if available
  - Falls back to colored initials if no image
  - Gradient background colors based on name hash
  - Multiple size options (8x8, 10x10, 16x16, 24x24)

#### `AvatarUpload.tsx`

Interactive avatar upload component with validation.

- **Features**:
  - Drag-and-drop upload area
  - Click to browse file selection
  - File type validation (JPEG, PNG, GIF, WebP)
  - File size validation (max 5MB)
  - Real-time error messages
  - Image preview with remove option
  - Initials fallback when no avatar uploaded

#### `EmployeeAvatarManager.tsx`

Admin interface for managing all employee avatars.

- **Features**:
  - Employee list with avatar preview
  - Search/filter employees
  - Select employee to manage
  - Upload avatar for selected employee
  - Remove avatar for selected employee
  - Real-time updates across dashboard

### Utility Functions (`avatarUtils.ts`)

#### User Avatar Management

```typescript
saveUserAvatar(avatarData: string): void
getUserAvatar(): string | null
removeUserAvatar(): void
```

#### Employee Avatar Management

```typescript
saveEmployeeAvatar(employeeId: number, avatarData: string): void
getEmployeeAvatar(employeeId: number): string | null
removeEmployeeAvatar(employeeId: number): void
```

#### Helper Functions

```typescript
getInitials(name: string): string          // Gets 2-letter initials from name
getAvatarColor(name: string): string       // Generates gradient color from name
clearAllAvatars(): void                    // Removes all stored avatars
```

## Storage

### localStorage Keys

- **User Avatar**: `hrdash-user-avatar`
- **Employee Avatars**: `hrdash-employee-avatars` (JSON object with employeeId as key)

### Data Format

Avatars are stored as base64-encoded strings:

```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...
```

## User Guide

### For Employees: Uploading Your Avatar

1. **Navigate to Settings**
   - Click your profile in the top-right corner
   - Select "Settings" from the menu

2. **Upload Avatar**
   - Go to the "Profile" tab
   - Find the "Profile Avatar" section at the top
   - Option 1: Drag and drop an image file onto the upload area
   - Option 2: Click "Choose file" to browse your computer
   - Wait for preview to appear
   - Avatar is automatically saved

3. **Remove Avatar**
   - Click the "X" button in the top-right of the avatar preview
   - Confirm removal
   - Your initials will be displayed instead

### For Managers/Admins: Managing Employee Avatars

1. **Navigate to Employees Page**
   - Click "Employees" in the sidebar

2. **Scroll to Avatar Management Section**
   - Located below the employee table

3. **Select Employee**
   - Click on an employee from the list
   - Their current avatar (or initials) will be displayed

4. **Upload/Update Avatar**
   - Drag and drop an image or click "Choose file"
   - Avatar is automatically saved to that employee's profile

5. **Remove Avatar**
   - Select the employee
   - Click the "X" button on their avatar preview
   - Confirm removal

## File Specifications

### Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Size Limits

- Maximum file size: **5MB**
- Recommended dimensions: **512x512 pixels** or higher
- Images are displayed at:
  - Small (sm): 32x32px
  - Medium (md): 40x40px
  - Large (lg): 64x64px
  - Extra Large (xl): 96x96px

### Image Processing

- Images are converted to base64 for storage
- No server upload required (client-side only)
- Automatic aspect ratio preservation
- Border radius applied for circular display

## Integration Points

### Updated Components

1. **EmployeeTable** (`src/components/employees/EmployeeTable.tsx`)
   - Now uses `AvatarDisplay` component
   - Retrieves avatar from localStorage via `getEmployeeAvatar()`
   - Shows avatar in employee name column

2. **Topbar** (`src/components/Topbar.tsx`)
   - Displays logged-in user's avatar
   - Uses `getUserAvatar()` to retrieve current user avatar
   - Falls back to initials if no avatar set

3. **TopPerformersCard** (`src/components/dashboard/TopPerformersCard.tsx`)
   - Shows avatars for top performing employees
   - Enhanced visual hierarchy with avatars + rank badges

4. **ProfileSettings** (`src/components/settings/ProfileSettings.tsx`)
   - Includes `AvatarUpload` component
   - Integrated with settings state management
   - Persists changes to localStorage

5. **EmployeesPage** (`src/pages/EmployeesPage.tsx`)
   - Added `EmployeeAvatarManager` section
   - Allows bulk avatar management for admins

## Browser Compatibility

- Chrome 76+
- Firefox 69+
- Safari 12.1+
- Edge 79+

All modern browsers support:

- localStorage API
- FileReader API
- Base64 encoding
- Drag and drop events

## Known Limitations

1. **Storage**: Avatar data is stored in localStorage, which has a limit of ~5-10MB per domain
2. **No server sync**: Avatars are stored client-side only and won't sync across devices
3. **No compression**: Images are stored as-is (base64), which increases storage size by ~33%
4. **Single browser**: Avatar data is specific to each browser/device combination

## Future Enhancements

### Potential Improvements

- [ ] Server-side storage for avatar persistence across devices
- [ ] Image compression before storage
- [ ] Cropping tool for better avatar framing
- [ ] Avatar history/versioning
- [ ] Default avatar themes/templates
- [ ] Integration with external avatar services (Gravatar, etc.)
- [ ] Bulk upload for multiple employees
- [ ] Avatar approval workflow for managers
- [ ] Analytics on avatar adoption rate

## Troubleshooting

### Avatar Not Displaying

1. **Check localStorage**: Open browser DevTools > Application > localStorage
   - Look for `hrdash-user-avatar` or `hrdash-employee-avatars`
2. **Clear and re-upload**: Remove avatar and upload again
3. **Check file format**: Ensure file is JPEG, PNG, GIF, or WebP
4. **Check file size**: Must be under 5MB

### Upload Errors

- **"File size must be less than 5MB"**: Resize or compress image before uploading
- **"Only JPEG, PNG, GIF, and WebP images are allowed"**: Convert image to supported format
- **Drag-and-drop not working**: Use "Choose file" button instead

### Avatar Not Updating

1. Refresh the page after upload
2. Check browser console for JavaScript errors
3. Verify localStorage is enabled in browser settings
4. Try clearing browser cache and re-uploading

## Technical Notes

### Performance Considerations

- Base64 encoding increases file size by approximately 33%
- localStorage has a total limit of 5-10MB
- Large avatars may impact page load times
- Consider implementing lazy loading for avatar-heavy pages

### Security

- All avatar processing happens client-side
- No server upload = no server-side vulnerabilities
- File type validation prevents script injection
- Size limits prevent storage exhaustion

### Accessibility

- All avatars have alt text with employee names
- Initials provide text fallback
- Color contrast ratios meet WCAG AA standards
- Keyboard navigation supported in upload component

## Code Examples

### Using AvatarDisplay Component

```tsx
import { AvatarDisplay } from "../components/AvatarDisplay";
import { getEmployeeAvatar } from "../utils/avatarUtils";

function EmployeeCard({ employee }) {
  const avatar = getEmployeeAvatar(employee.id);

  return (
    <div>
      <AvatarDisplay src={avatar} name={employee.name} size="lg" />
      <h3>{employee.name}</h3>
    </div>
  );
}
```

### Saving an Avatar

```typescript
import { saveEmployeeAvatar } from "./utils/avatarUtils";

function handleAvatarUpload(employeeId: number, file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Data = e.target?.result as string;
    saveEmployeeAvatar(employeeId, base64Data);
  };
  reader.readAsDataURL(file);
}
```

### Retrieving an Avatar

```typescript
import { getEmployeeAvatar, getInitials, getAvatarColor } from './utils/avatarUtils';

const avatar = getEmployeeAvatar(employeeId);
if (avatar) {
  // Display image
  return <img src={avatar} alt={employeeName} />;
} else {
  // Display initials with color
  const initials = getInitials(employeeName);
  const color = getAvatarColor(employeeName);
  return <div className={color}>{initials}</div>;
}
```

## Version History

### v1.0.0 (Current)

- Initial avatar feature implementation
- User avatar upload in settings
- Employee avatar manager for admins
- Avatar display in multiple components
- localStorage persistence
- Drag-and-drop support
- File validation and error handling

---

**Last Updated**: January 2025
**Maintained By**: HR Dashboard Development Team
