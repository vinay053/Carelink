# UI_AND_DESIGN_GUIDE.md — Skill Setu & Kawach Design System Guide

## 1. Visual Language & Philosophy

The CareLink design system is optimized for high-stress clinical environments. It balances high-contrast dark mode legibility with intuitive status color coding:
- **Calm Authority**: Deep navy (`#0D1B2A`) avoids clinical eye strain during night shifts.
- **Teal Focus**: Vibrant teal (`#00BFA6`) directs the eye exclusively to actionable triggers.
- **Risk Triad**:
  - Green (`#2ED573`): Normal / Low Risk / Completed
  - Amber (`#FFA502`): Pending / Moderate Risk / Warning
  - Red (`#FF4757`): Critical / High Risk / SLA Breached

---

## 2. Color Palette Tokens

```css
:root {
  --bg-primary: #0D1B2A;          /* Deep Navy Base */
  --bg-card: #1A2B3C;             /* Elevated Surfaces */
  --bg-elevated: #243447;         /* Inputs & Active Hovers */
  --accent-teal: #00BFA6;         /* Primary Action Brand */
  --accent-teal-hover: #00A896;   /* Darker Teal on Hover */
  --accent-teal-dim: rgba(0, 191, 166, 0.08);
  --text-primary: #F0F4F8;        /* Off-white High Contrast Text */
  --text-secondary: #8892A4;      /* Subdued Metadata & Labels */
  --text-teal: #00BFA6;           /* Highlighted Teal Typography */
  --border-color: #243447;        /* Clean Structure Borders */
  --danger: #FF4757;              /* Critical Indicators */
  --danger-dim: rgba(255, 71, 87, 0.08);
  --warning: #FFA502;             /* Attention Required */
  --warning-dim: rgba(255, 165, 2, 0.08);
  --success: #2ED573;             /* Positive / Resolved */
  --success-dim: rgba(46, 213, 115, 0.08);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.4);
  --radius-card: 12px;
  --radius-btn: 8px;
}
```

---

## 3. UI Component Catalogue

### Button (`src/components/ui/Button.jsx`)
- Supports variants: `primary`, `secondary`, `danger`, `ghost`.
- Sizes: `sm` (px 10, py 6), `md` (px 16, py 10), `lg` (px 20, py 12).
- Micro-interactions: Active scale transform to `0.97`, smooth 200ms ease transition.

### RiskScore Gauge (`src/components/ui/RiskScore.jsx`)
- Custom SVG rendering a half-circle donut with animated stroke dash offset.
- Dynamic color transitions based on score (0–39: Green, 40–69: Yellow, 70–100: Red).

### StatCard (`src/components/ui/StatCard.jsx`)
- Displays KPI values with optional trend badges (`+12%`), status icon, and subtitle.

### Modal (`src/components/ui/Modal.jsx`)
- Accessible dialog overlay with blur backdrop, close button, and Esc key capture.
