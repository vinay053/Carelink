# CONTRIBUTING.md — Guidelines for Contributing to CareLink

Thank you for your interest in contributing to **CareLink**! We welcome improvements, bug fixes, and feature additions that help strengthen public and private healthcare referral continuity.

---

## 1. Development Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vinay053/Carelink.git
   cd Carelink
   ```

2. **Backend Setup**:
   ```bash
   cd carelink-backend
   cp .env.example .env
   npm install
   npm run seed    # Seeds sample facilities, doctors, patients & referrals
   npm run dev     # Starts Express server at http://127.0.0.1:5000
   ```

3. **Frontend Setup**:
   ```bash
   cd ../carelink-frontend
   cp .env.example .env
   npm install
   npm run dev     # Starts Vite dev server at http://localhost:5173
   ```

---

## 2. Coding Standards & Conventions

- **Design System**: Use CSS variables defined in `src/index.css` (e.g., `var(--bg-card)`, `var(--accent-teal)`). Avoid hardcoded arbitrary color hex values in components.
- **Components**: Place reusable visual elements in `src/components/ui/` and layout structures in `src/components/layout/`.
- **API Communication**: Always import and use the configured Axios instance from `src/utils/api.js`. Do not instantiate raw `axios` instances directly in pages.
- **Error Handling**: Use `react-hot-toast` for user-facing feedback and meaningful try/catch blocks for API mutations.

---

## 3. Pull Request Workflow

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Verify that frontend builds without errors:
   ```bash
   cd carelink-frontend && npm run build
   ```
3. Commit with clear, descriptive messages following conventional commits (`feat:`, `fix:`, `docs:`, `style:`).
4. Push to your fork and submit a Pull Request against `main`.
