# ATS (Applicant Tracking System)

A modern web application built with **React 19**, **Vite**, **Redux Toolkit**, **Tailwind CSS**, and **PrimeReact**. This project supports environment-based configurations (development, staging, production) and includes linting, testing, and internationalization support.

---

## 📦 Project Setup

> Make sure you have **Node.js v18+** and **npm** installed.

## Install dependencies:

```bash
npm install             # Insatll dependencies
```

## 🚀 Development Server

## Start the app with the development configuration:

```bash
npm run dev             # Uses development config
```

## Run in other environments (uses .env.staging or .env.production):

```bash
npm run dev:staging     # Uses staging config
npm run dev:prod        # Uses production config
```

## 🏗️ Build for Deployment

## Build the app for your desired environment:

```bash
npm run build           # Uses development config
npm run build:staging   # Uses staging config
npm run build:prod      # Uses production config
```

## 🔍 Preview the Production Build

## Run a local server to preview the built app:

```bash
npm run preview         # Preview development build
npm run preview:staging # Preview development build
npm run preview:prod    # Preview production build
```

## Local development server: http://localhost:5173

## Default preview URL: http://localhost:4173

## Development server URL: https://pats-fe-dev.mypits.org

## Stage server URL: https://pats-fe-stage.mypits.org

## ✅ Lint the Code

## Check for linting issues using ESLint:

```bash
npm run lint
```

## 🧪 Run Tests

## Run all unit and integration tests with Vitest:

```bash
npm run test
```
