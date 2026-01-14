# API LIST

## Overview

This document summarizes recommended backend APIs for the HR Dashboard front-end (auth, employee management, attendance, payroll, KPI, leave, hiring, dashboard reports, and settings).

1. Authentication & Authorization

---

- POST `/api/auth/login` - Authenticate and return JWT
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - Revoke token
- GET `/api/auth/me` - Get current user info
- RBAC: role checks (Admin / Manager / Employee)

2. Employee Management

---

- GET `/api/employees` - List employees (filters: department, role, status)
- GET `/api/employees/{id}` - Employee details
- POST `/api/employees` - Create employee
- PUT `/api/employees/{id}` - Update employee
- DELETE `/api/employees/{id}` - Remove employee
- GET `/api/departments` - Departments list

3. Attendance

---

- GET `/api/attendance` - Attendance records (query by date range)
- POST `/api/attendance/check-in` - Record check-in
- POST `/api/attendance/check-out` - Record check-out
- GET `/api/attendance/{employeeId}` - Employee attendance history
- GET `/api/attendance/stats` - Monthly/department attendance analytics

4. Payroll

---

- GET `/api/payroll` - List payroll runs
- GET `/api/payroll/{employeeId}` - Employee payroll details
- POST `/api/payroll/generate` - Generate payslips for a period
- GET `/api/payroll/{payslipId}/download` - Download payslip (PDF)
- PUT `/api/payroll/{id}` - Update payroll record
- GET `/api/payroll/stats` - Payroll analytics by department/month

5. KPI Tracking

---

- GET `/api/kpi` - List KPIs
- POST `/api/kpi` - Create KPI entry
- PUT `/api/kpi/{id}` - Update KPI
- GET `/api/kpi/trends` - KPI trend data (time series)
- GET `/api/kpi/department/{dept}` - Department KPIs

6. Leave Management

---

- GET `/api/leave` - Leave requests (filters)
- POST `/api/leave/request` - Submit leave request
- PUT `/api/leave/{id}/approve` - Approve leave
- PUT `/api/leave/{id}/reject` - Reject leave
- GET `/api/leave/balance/{employeeId}` - Leave balance
- GET `/api/leave/policies` - Company leave policies

7. Hiring & Recruitment

---

- GET `/api/positions` - Open positions
- GET `/api/candidates` - Candidate list
- POST `/api/candidates` - Add candidate
- PUT `/api/candidates/{id}` - Update candidate status
- GET `/api/interviews` - Interview schedule
- POST `/api/interviews` - Schedule interview
- GET `/api/hiring/pipeline` - Recruitment pipeline stats

8. Dashboard & Reports

---

- GET `/api/dashboard/stats` - Summary cards (totals)
- GET `/api/dashboard/charts` - Charts payload (attendance, KPI, payroll)
- GET `/api/reports/attendance` - Attendance report (CSV/JSON)
- GET `/api/reports/performance` - Performance reports

9. Settings & Company Info

---

- GET `/api/settings` - App/user settings
- PUT `/api/settings` - Update settings
- GET `/api/company` - Company info
- PUT `/api/company` - Update company info

## Extras / Integrations

- File storage endpoints for payslips (S3 signed URLs)
- Email/webhook endpoints for notifications
- PDF generation endpoint for server-side payslip creation

## Recommended Backend Stack

- Frameworks: Node.js + Express or Fastify; or Python + FastAPI/Django
- Auth: JWT (Passport.js / jsonwebtoken) or external (Auth0)
- Database: PostgreSQL (recommended) or MySQL; Redis for sessions/caching
- File storage: AWS S3 (presigned URLs)
- PDF: PDFKit, Puppeteer, or server-side templates
- Email: SendGrid or SMTP via Nodemailer
- Deployment: Render / Vercel (serverless) / Heroku / AWS

## Usage notes

- Use consistent pagination/filtering for list endpoints.
- Protect write endpoints with RBAC and input validation.
- Version APIs (`/api/v1/...`) if you expect breaking changes.

If you want, I can scaffold a Node.js + Express starter with auth and employee endpoints next.
