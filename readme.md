# 99Tech Code Challenge Solutions

> **Live Demo**: [https://konyan.github.io/challenge-tech/](https://konyan.github.io/challenge-tech/)
> **GitHub Repository**: [https://github.com/konyan/challenge-tech](https://github.com/konyan/challenge-tech)

This repository contains my solutions to the 99Tech Code Challenge, built as a modern web application using Vite's Multi-Page App (MPA) architecture with React Router for seamless navigation.

## 🏗️ Architecture: Vite Multi-Page App (MPA)

### Why MPA?

This project demonstrates a unique approach combining the best of both worlds:

1. **Unified Navigation**: A single React application with React Router provides seamless client-side routing
2. **Independent Entry Points**: Each problem can also be accessed as a standalone page
3. **Optimal Code Splitting**: Dynamic imports ensure each problem loads only when needed
4. **Build Flexibility**: Supports both integrated and standalone deployment modes

### Implementation Details

**Vite Configuration** (`vite.config.js`):
```javascript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/challenge-tech/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),           // Main app
        problem1: resolve(__dirname, 'src/problem1/index.html'),
        problem2: resolve(__dirname, 'src/problem2/index.html'),
        problem3: resolve(__dirname, 'src/problem3/index.html'),
      },
    },
  },
});
```

**Benefits**:
- 📦 **Code Splitting**: Each problem is a separate chunk, loaded on demand
- 🔄 **Lazy Loading**: React.lazy() with dynamic imports (`lazy(() => import('./problem1/Problem1'))`)
- 🎯 **Dual Mode**: Problems can run as React components OR standalone HTML pages
- ⚡ **Fast Builds**: Vite's lightning-fast HMR and optimized production builds

**Router Setup**: Using `HashRouter` for GitHub Pages compatibility
```typescript
// main.tsx
<HashRouter>
  <App />
</HashRouter>

// App.tsx - Dynamic imports with Suspense
const Problem1 = lazy(() => import('./problem1/Problem1'));
const Problem3 = lazy(() => import('./problem3/Problem3'));

<Suspense fallback={<div className="loading">Loading...</div>}>
  <Routes>
    <Route path="/problem1" element={<Problem1 />} />
    <Route path="/problem2" element={<Problem2 />} />
    <Route path="/problem3" element={<Problem3 />} />
  </Routes>
</Suspense>
```

## 📝 Problem Solutions

### Problem 1: Sum to N

**Challenge**: Provide 3 ways to compute the sum of numbers from 1 to n.

**Solutions**:

1. **Iterative Approach** (`sum_to_n_a`):
   - Uses a for loop to accumulate sum
   - Time: O(n), Space: O(1)
   - Handles both positive and negative numbers

2. **Mathematical Formula** (`sum_to_n_b`):
   - Uses Gauss's formula: `n * (n + 1) / 2`
   - Time: O(1), Space: O(1)
   - Most efficient approach

3. **Recursive Approach** (`sum_to_n_c`):
   - Recursively adds n to sum of (n-1)
   - Time: O(n), Space: O(n) due to call stack
   - Demonstrates functional programming

**UI Features**:
- ✅ Interactive input to test any number
- ✅ Real-time results from all three implementations
- ✅ Automated test suite with 6 test cases
- ✅ Line-by-line test execution log with color coding
- ✅ Visual test case display before running

**Tech Stack**: React + TypeScript, Dynamic class-based styling for log output

**Access**:
- Via Router: `/#/problem1`
- Standalone: `/src/problem1/index.html`

---

### Problem 2: Currency Swap

**Challenge**: Build a functional currency swap interface using vanilla HTML, CSS, and JavaScript.

**Solution**:

A complete currency exchange interface with real-time price fetching and validation.

**Features**:
- 💱 Real-time currency prices from API
- 🔍 Searchable token dropdown
- ↕️ Swap direction toggle
- ✅ Form validation (amount, token selection)
- 💰 Automatic conversion calculation
- 📊 USD value and fee estimation
- 🎨 Modern dark theme UI with glassmorphism

**Implementation Highlights**:
- Pure vanilla JavaScript (no frameworks)
- Fetch API for price data
- Event delegation for optimal performance
- Accessible ARIA attributes
- Responsive design

**Tech Stack**: HTML5, CSS3, Vanilla JavaScript (ES6+)

**Integration**: Embedded in React app via iframe to preserve vanilla implementation

**Access**:
- Via Router: `/#/problem2`
- Standalone: `/src/problem2/index.html`

---

### Problem 3: [Add your problem 3 solution description]

**Access**:
- Via Router: `/#/problem3`
- Standalone: `/src/problem3/index.html`

---

## 🛠️ Tech Stack

- **Build Tool**: Vite 5.4
- **Framework**: React 19 + TypeScript
- **Router**: React Router v7 (HashRouter for GitHub Pages)
- **Code Quality**: Biome (formatting + linting)
- **Git Workflow**: Commitizen (Conventional Commits)
- **Deployment**: GitHub Actions → GitHub Pages
- **Styling**: CSS3 with modern features (Grid, Flexbox, Custom Properties)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ or Bun

### Installation

```bash
# Clone the repository
git clone https://github.com/konyan/challenge-tech.git
cd challenge-tech

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Format code
npm run format

# Lint and fix
npm run lint

# Format + Lint
npm run check
```

### Production Build

```bash
# Build for production
npm run build

# Build for GitHub Pages
npm run build:github

# Preview production build
npm run preview
```

## 📂 Project Structure

```
challenge-tech/
├── src/
│   ├── problem1/          # Problem 1: Sum to N
│   │   ├── index.ts       # Three implementations
│   │   ├── Problem1.tsx   # React UI component
│   │   ├── Problem1.css   # Styles
│   │   ├── index.html     # Standalone entry
│   │   └── standalone.tsx # Standalone React mount
│   │
│   ├── problem2/          # Problem 2: Currency Swap
│   │   ├── index.html     # Vanilla HTML
│   │   ├── script.js      # Vanilla JavaScript
│   │   └── style.css      # Vanilla CSS
│   │
│   ├── problem3/          # Problem 3
│   │   ├── Problem3.tsx
│   │   ├── index.html
│   │   └── standalone.tsx
│   │
│   ├── App.tsx            # Main React app with router
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
│
├── .github/
│   └── workflows/
│       ├── deploy.yml     # GitHub Pages deployment
│       └── ci.yml         # CI checks (lint, build)
│
├── vite.config.js         # Vite MPA configuration
├── biome.json             # Biome configuration
├── package.json           # Dependencies & scripts
└── tsconfig.json          # TypeScript config
```

## 🎯 Key Features

### 1. Multi-Page Architecture
- Each problem is independently accessible
- Shared navigation through React Router
- Optimized code splitting and lazy loading

### 2. Dual Deployment Modes
- **Integrated**: Single React app with all problems
- **Standalone**: Each problem as separate HTML page

### 3. Developer Experience
- ⚡ Lightning-fast HMR with Vite
- 🎨 Biome for consistent code style
- 📝 Commitizen for standardized commits
- 🔄 Automatic deployment via GitHub Actions

### 4. Production Ready
- Optimized builds with tree-shaking
- Asset optimization and minification
- Automatic deployment to GitHub Pages
- CI/CD pipeline with quality checks

## 🌐 Live Demo

**Main Application**: [https://konyan.github.io/challenge-tech/](https://konyan.github.io/challenge-tech/)

**Direct Access**:
- Problem 1: [https://konyan.github.io/challenge-tech/#/problem1](https://konyan.github.io/challenge-tech/#/problem1)
- Problem 2: [https://konyan.github.io/challenge-tech/#/problem2](https://konyan.github.io/challenge-tech/#/problem2)
- Problem 3: [https://konyan.github.io/challenge-tech/#/problem3](https://konyan.github.io/challenge-tech/#/problem3)

## 📚 Documentation

- [MPA Setup Guide](MPA_SETUP.md) - Detailed Multi-Page App architecture
- [Deployment Guide](DEPLOYMENT.md) - GitHub Pages deployment instructions
- [Biome & Commitizen](BIOME_COMMITIZEN.md) - Code quality tools setup

## 🤝 Git Workflow

This project uses Commitizen for standardized commits:

```bash
# Instead of git commit, use:
npm run commit

# Follow the interactive prompts for conventional commits
```

## 📄 License

This is a code challenge submission. Please refer to the original challenge repository for terms.

---

**Author**: konyan
**Challenge**: 99Tech Code Challenge
**Built with**: ❤️ and lots of ☕
