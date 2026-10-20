# FILE_STRUCTURE.md — Complete Codebase Directory & File Manifest

```text
Carelink/
├── AGENTS.md                          # Autonomous agent & dev protocols
├── CHANGELOG.md                       # Version changelog
├── CONTRIBUTING.md                    # Developer contribution guidelines
├── DEVELOPMENT_LOG.md                 # Chronological troubleshooting & dev log
├── docker-compose.yml                 # Local MongoDB container configuration
├── package.json                       # Root workspace package file (if applicable)
├── PROJECT_STATUS.md                  # Comprehensive operational matrix
├── README.md                          # Executive project documentation & demo flow
├── Roadmap.md                         # Product vision & multi-quarter roadmap
├── Technical.md                       # Technical architecture & schema specifications
├── TODO.md                            # Prioritized backlog & future tasks
│
├── carelink-backend/                  # Express REST API Server
│   ├── .env                           # Local environment config (PORT, HOST, MONGODB_URI)
│   ├── .env.example                   # Template environment variables
│   ├── package.json                   # Backend dependencies & test scripts
│   ├── src/
│   │   ├── app.js                     # Express app, middleware, & route mounting
│   │   ├── server.js                  # HTTP server entrypoint bound to 127.0.0.1:5000
│   │   ├── controllers/               # Business logic controllers
│   │   │   ├── alert.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── carebot.controller.js
│   │   │   ├── diagnostic.controller.js
│   │   │   ├── hospital.controller.js
│   │   │   ├── medication.controller.js
│   │   │   ├── patient.controller.js
│   │   │   └── referral.controller.js
│   │   ├── middlewares/               # JWT authentication & validation middleware
│   │   │   └── auth.middleware.js
│   │   ├── models/                    # Mongoose Data Models
│   │   │   ├── Alert.js
│   │   │   ├── ChatMessage.js
│   │   │   ├── DiagnosticResult.js
│   │   │   ├── Hospital.js
│   │   │   ├── Medication.js
│   │   │   ├── Patient.js
│   │   │   ├── Referral.js
│   │   │   ├── User.js
│   │   │   └── index.js
│   │   ├── routes/                    # API Route endpoints (/api/*)
│   │   │   ├── alert.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── carebot.routes.js
│   │   │   ├── diagnostic.routes.js
│   │   │   ├── hospital.routes.js
│   │   │   ├── medication.routes.js
│   │   │   ├── patient.routes.js
│   │   │   └── referral.routes.js
│   │   ├── services/                  # Business services
│   │   │   ├── careGap.service.js     # Scheduled cron checking SLA violations
│   │   │   ├── carebot.service.js     # Multi-model AI coordinator (Gemini/OpenAI)
│   │   │   ├── drugSafety.service.js  # Cross-provider medication conflict engine
│   │   │   ├── openfda.service.js     # Drug interaction lookup
│   │   │   ├── riskScore.service.js   # Dropout risk scoring formula (0–100)
│   │   │   └── twilio.service.js      # SMS & notification dispatch
│   │   └── utils/                     # Database utilities & seeder
│   │       ├── database.js            # Mongoose connection with fallback
│   │       └── seed.js                # MP Clinical Cohort seeder script
│   └── tests/                         # Backend test verification suite
│       ├── verifyApiRoutes.js
│       ├── verifyAuth.js
│       ├── verifyModels.js
│       └── verifyServices.js
│
├── carelink-frontend/                 # React 18 / Vite 6 Single Page Application
│   ├── .env                           # Frontend env (VITE_API_BASE_URL)
│   ├── .env.example
│   ├── index.html                     # HTML5 entrypoint with Inter font prefetch
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite config with /api proxy to 127.0.0.1:5000
│   ├── tailwind.config.js             # Tailwind design tokens matching CSS variables
│   ├── src/
│   │   ├── main.jsx                   # React root mount with AuthProvider & Toaster
│   │   ├── index.css                  # Design system tokens, variables & scrollbars
│   │   ├── components/
│   │   │   ├── common/                # Route guards
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── PublicRoute.jsx
│   │   │   ├── layout/                # Main application layout shells
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── MobileNav.jsx
│   │   │   │   ├── PageContainer.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── ui/                    # Reusable Skill Setu design system components
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── RiskScore.jsx      # Animated SVG semicircle risk gauge
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   └── carebot/               # CareBot AI Chat widgets
│   │   │       ├── ChatInput.jsx
│   │   │       └── ChatMessageItem.jsx
│   │   ├── context/                   # Global React Context
│   │   │   ├── AuthContext.jsx        # Login/Register/Token state
│   │   │   └── NotificationContext.jsx
│   │   ├── pages/                     # Full page views
│   │   │   ├── Analytics.jsx
│   │   │   ├── CareBot.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DiagnosticTracker.jsx
│   │   │   ├── HospitalMap.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MedicationReconcile.jsx
│   │   │   ├── Patients.jsx
│   │   │   ├── PatientTimeline.jsx
│   │   │   ├── ReferralCreate.jsx
│   │   │   ├── ReferralDetail.jsx
│   │   │   ├── Referrals.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Settings.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx          # Declarative React Router v6 definitions
│   │   └── utils/
│   │       └── api.js                 # Axios instance with normalization & interceptors
│
└── docs/                              # Dedicated Knowledge Base Suite
    ├── AGENTS.md
    ├── AI_HANDOVER.md
    ├── API_AND_INTEGRATIONS.md
    ├── ARCHITECTURE.md
    ├── BUSINESS_LOGIC.md
    ├── DATABASE_AND_DATA.md
    ├── DECISIONS_AND_RATIONALE.md
    ├── ENVIRONMENT_CONFIGURATION.md
    ├── FEATURES_AND_WORKFLOWS.md
    ├── FILE_STRUCTURE.md
    ├── FUTURE_ROADMAP.md
    ├── KNOWN_ISSUES.md
    ├── NEXT_SESSION_ACTION_PLAN.md
    ├── PROJECT_OVERVIEW.md
    ├── RECOVERY_GUIDE.md
    ├── RUN_AND_BUILD.md
    ├── SETUP_AND_INSTALLATION.md
    ├── TESTING_AND_VALIDATION.md
    └── UI_AND_DESIGN_GUIDE.md
```
