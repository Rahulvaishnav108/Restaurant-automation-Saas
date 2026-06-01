# Rebuilt KDS Kitchen Panel SPA

A premium, custom-crafted, single page application (SPA) built completely from scratch using **React 18**, **Babel**, **Webpack**, and **Styled-Components**. This codebase is fully independent of Vite or Tailwind and adheres strictly to a clean modular project architecture.

---

## Key Features

1. **Independent Build Chain**: Handcrafted Webpack 5 configuration with Babel transpilation and optimized TypeScript settings under `/config`.
2. **Design Tokens & System**: Core styled theme containing exact Figma Obsidian backgrounds, Orange glow branding, Inter/Outfit typography, and responsive breakpoints in `/src/core/theme`.
3. **Advanced Responsiveness**: Dynamic layout shifts:
   - **Mobile viewport**: Single column Kanban panel with bottom and top tab navigation filters.
   - **Tablet viewport (768px - 1279px)**: Compact 2x2 grid layout maximizing display density.
   - **Desktop viewport (1280px+)**: High efficiency 4-column board (New, Preparing, Ready, Delayed).
4. **Stateful API Placeholders**: Emulated endpoints with custom latency simulation, Live auto-polling, and LocalStorage state preservation inside `/src/core/api`.
5. **No Placeholders**: Real interactive loaders, live ticking timers since order creation, and fully responsive layouts.

---

## Technical Stack

- **Core Framework**: React 18 & ReactDOM
- **Bundler & Compiler**: Webpack 5, Webpack Dev Server, Babel
- **Styles**: Styled-Components (CSS-in-JS)
- **Icons**: Lucide React
- **Configuration**: custom TypeScript compiler rules

---

## Getting Started

Follow these clean, handcrafted commands to install, compile, and spin up the rebuilt kitchen panel project:

### 1. Installation
Run inside the project root:
```bash
cd kitchen-panel-rebuilt
npm install
```

### 2. Live Development Server
Start the handcrafted dev server on port `3000`:
```bash
npm run dev
```

### 3. Production Compilation
Bundle assets into a single optimized static output bundle (`/dist` directory):
```bash
npm run build
```

### 4. TypeScript Validation Check
Verify all custom typings and contract specifications are 100% sound:
```bash
npm run typecheck
```
