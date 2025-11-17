# Frontend Setup Guide

## Project Initialization

This guide covers setting up a React + TypeScript project with Vite and Tailwind CSS.

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Step 1: Create Vite Project

Run the following command in the frontend directory:

```bash
npm create vite@latest . -- --template react-ts
```

This will:

- Initialize a new Vite project with React and TypeScript
- Create the necessary configuration files
- Set up the project structure

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Install Tailwind CSS

Install Tailwind CSS and its dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer
```

## Step 4: Initialize Tailwind Configuration

Generate the Tailwind configuration files:

```bash
npx tailwindcss init -p
```

This creates:

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

## Step 5: Configure Template Paths

Update `tailwind.config.js` with your template paths:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## Step 6: Add Tailwind Directives

Update `src/index.css` with Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 7: Verify Installation

Make sure `src/main.tsx` imports the CSS file:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Step 8: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── public/
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Next Steps

1. Create React components in `src/components/`
2. Set up routing with React Router (optional)
3. Configure state management (Redux, Zustand, Context API, etc.)
4. Set up API client for backend communication
5. Add ESLint and Prettier for code formatting

## Troubleshooting

### Tailwind CSS not applying styles

- Ensure `tailwind.config.js` has the correct content paths
- Verify `index.css` includes all three Tailwind directives
- Check that `index.css` is imported in `main.tsx`
- Restart the development server

### Port already in use

If port 5173 is already in use, Vite will automatically use the next available port, or specify a custom port:

```bash
npm run dev -- --port 3000
```

## References

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
