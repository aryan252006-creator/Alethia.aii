# Project History & Changelog

This document tracks all changes, feature implementations, and architectural decisions made throughout the development of the Financial Intelligence Platform.

## [2026-01-15] Frontend Architecture & Core Features Implementation

### Summary
Initial setup of the frontend application, including project structure, routing, authentication infrastructure, and core role-based dashboards.

### 1. Infrastructure & Dependencies
- **Dependencies Installed**:
  - `react-router-dom`: For client-side routing.
  - `lucide-react`: For UI icons.
  - `clsx`, `tailwind-merge`: For dynamic class name management.
  - `tailwindcss`: configured via Vite plugin.
- **Project Structure Created**:
  - `src/components`: Reusable UI components.
  - `src/pages`: Top-level page components.
  - `src/pages/dashboard`: Role-specific dashboard views.
  - `src/context`: State management (Auth).
  - `src/layouts`: Layout wrappers.
  - `src/lib`: Utility functions.

### 2. Core Components Implemented
- **Navbar (`src/components/Navbar.jsx`)**: Responsive navigation bar with handling for unauthenticated and authenticated states (Startup vs Investor functionality).
- **Layout (`src/layouts/Layout.jsx`)**: Main application wrapper ensuring consistent structure.
- **ProtectedRoute (`src/components/ProtectedRoute.jsx`)**: Higher-order component to separate public routes from protected routes and enforce role-based access control (Startup vs Investor).
- **AuthContext (`src/context/AuthContext.jsx`)**: Context provider managing user session state (login, signup, logout) using `localStorage` for simplified persistence during development.
- **Utils (`src/lib/utils.js`)**: `cn` utility for Tailwind class merging.

### 3. Feature: Authentication
- **Login Page (`src/pages/LoginPage.jsx`)**: User login interface.
- **Signup Page (`src/pages/SignupPage.jsx`)**: Registration interface allowing users to self-select their role (Startup or Investor).

### 4. Feature: Landing Page
- **Landing Page (`src/pages/LandingPage.jsx`)**: Public-facing marketing page explaining the platform's value proposition ("Financial intelligence that tells you when insights can’t be trusted"). Includes "Hero", "Problem Snapshot", "How It Works", and "Who Is It For" sections.

### 5. Feature: Dashboards
- **Startup Dashboard (`src/pages/dashboard/StartupDashboard.jsx`)**:
  - Displays reliability score and submission stats.
  - UI for uploading financial data.
- **Investor Dashboard (`src/pages/dashboard/InvestorDashboard.jsx`)**:
  - Displays market overview with mock companies.
  - Features specific "Trust/Reliability" indicators and regime-shift alerts.

### 6. Routing Configuration
- **App Router (`src/App.jsx`)**: Configured all routes:
  - Public: `/`, `/login`, `/signup`.
  - Protected (Startup): `/dashboard/startup`.
  - Protected (Investor): `/dashboard/investor`.

### 7. UX Improvements
- **Navigation**: Added "Back to Home" buttons to `LoginPage` and `SignupPage` to improve user flow from auth screens back to the landing page.
