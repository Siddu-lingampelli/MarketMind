# MarketAI Suite — Design System Documentation

## Design Philosophy

MarketAI Suite is a **decision intelligence platform**, not a content toy. The interface communicates trust, clarity, speed, and premium enterprise quality—comparable to Stripe, Linear, Vercel, and Notion Enterprise.

**Core Principles:**
- Human-designed, calm, and intentional
- Neutral, light backgrounds with dark, readable typography
- Single confident accent color
- Soft surfaces and subtle borders
- Zero visual noise

---

## Color Palette

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| Primary App Background | `#F9FAFB` | Main page background |
| Card Background | `#FFFFFF` | All cards, forms, results |
| Secondary Surface | `#F3F4F6` | Panels, sidebars |
| Border Color | `#E5E7EB` | All borders, dividers |

### Typography
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Text | `#111827` | Headings, important text |
| Secondary Text | `#6B7280` | Body text, labels |
| Placeholder Text | `#9CA3AF` | Input placeholders |

### Accent Colors
| Token | Hex | Hover | Usage |
|-------|-----|-------|-------|
| Primary Accent | `#2563EB` | `#1D4ED8` | Primary buttons, links, icons |
| Soft Accent BG | `#EFF6FF` | - | Badges, highlights |

### Status Colors (Lead Scoring)
| Category | Text/Indicator | Background | Usage |
|----------|---------------|------------|-------|
| Hot Lead | `#EF4444` | `#FEE2E2` | High-priority leads |
| Warm Lead | `#F59E0B` | `#FEF3C7` | Medium-priority leads |
| Lukewarm Lead | `#3B82F6` | `#DBEAFE` | Low-medium priority |
| Cold Lead | `#6B7280` | `#F3F4F6` | Low-priority leads |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Success | `#16A34A` | Success messages |
| Warning | `#F59E0B` | Warning messages |
| Error | `#DC2626` | Error messages, destructive actions |

---

## Typography Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Page Title | 32px | 600 | Dashboard, page headers |
| Section Title | 20-24px | 600 | Card headers, result sections |
| Body Text | 15px | 400 | Standard body copy |
| Small Labels | 13-14px | 500-600 | Form labels, metadata |

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

---

## Component Library

### Buttons

#### Primary Button
```css
background: #2563EB
color: #FFFFFF
padding: 12px 18px
border-radius: 12px
font-size: 15px
font-weight: 600
height: 48px
```
**Usage:** Generate Campaign, Create Pitch, Score Lead

**Hover:** `background: #1D4ED8`

**Disabled:** `opacity: 0.6; background: #9CA3AF`

#### Secondary Button
```css
background: #FFFFFF
border: 1px solid #E5E7EB
color: #111827
height: 48px
```
**Usage:** Copy All, Cancel, Preview

**Hover:** `background: #F9FAFB; border-color: #D1D5DB`

#### Destructive Button
```css
background: #DC2626
hover: #B91C1C
```
**Usage:** Delete, irreversible actions only

---

### Cards

#### Standard Card
```css
background: #FFFFFF
border: 1px solid #E5E7EB
border-radius: 16px
padding: 24-32px
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04)
```

#### AI Output Card (with accent border)
```css
background: #FFFFFF
border: 1px solid #E5E7EB
border-left: 4px solid #2563EB
border-radius: 14px
padding: 24px
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04)
```

**Purpose:** Structured, authoritative AI responses—not conversational

---

### Form Inputs

#### Text Input / Textarea / Select
```css
padding: 12px 16px
border: 1px solid #E5E7EB
border-radius: 12px
font-size: 15px
height: 48px
color: #111827
background: #FFFFFF
```

**Focus State:**
```css
border-color: #2563EB
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1)
```

**Placeholder:**
```css
color: #9CA3AF
```

---

### Badges & Labels

#### Status Badge (Lead Scoring)
```css
padding: 8px 16px
border-radius: 10px
font-size: 14-18px
font-weight: 600
```

Example (Hot Lead):
```css
color: #EF4444
background: #FEE2E2
```

**Visual Style:** Subtle, analytical—not loud pills

---

### Navigation

#### Navbar
```css
background: #FFFFFF
border-bottom: 1px solid #E5E7EB
height: 64px
padding: 0 32px
```

**Logo:**
```css
font-size: 18px
font-weight: 600
color: #111827
```

**Links:**
```css
color: #6B7280
font-size: 14px
font-weight: 500
padding: 8px 16px
border-radius: 8px
```

**Link Hover:**
```css
color: #111827
background: #F3F4F6
```

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| Card Padding | 24-32px | All cards, forms |
| Input Height | 48px | Buttons, inputs |
| Border Radius | 12-16px | Cards, inputs, buttons |
| Section Gap | 24-48px | Between page sections |

---

## Shadow System

**Rule:** Only soft shadows. Never heavy.

```css
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04-0.06);
```

**If a shadow is noticeable, it is too strong.**

---

## Layout Rules

### Container Widths
```css
max-width: 1200-1400px
padding: 56px 32px
```

### Grid Systems

#### Feature Cards (Dashboard)
```css
grid-template-columns: repeat(auto-fit, minmax(340px, 1fr))
gap: 24px
```

#### Metrics Grid (Lead Scoring)
```css
grid-template-columns: 1fr 1fr
gap: 16px
```

---

## AI Output Presentation

**NEVER:**
- Chat bubbles
- Typing animations
- Assistant avatars
- Conversational tone

**ALWAYS:**
- Structured cards with left accent border
- Business intelligence formatting
- Hierarchical typography
- Professional tone

### Example Structure
```
┌─ AI Output Card ─────────────────┐
│ ┃ Heading (20px, Semi-bold)      │
│ ┃                                 │
│ ┃ Body text (15px, Regular)      │
│ ┃ Line height: 1.6               │
│ ┃                                 │
│ ┃ • List items with left accent  │
│ ┃ • Structured data presentation │
└───────────────────────────────────┘
  ↑ 4px #2563EB accent border
```

---

## Responsive Design

### Breakpoints
- Mobile: `max-width: 768px`
- Desktop: `> 768px`

### Mobile Adjustments
- Padding: 32px → 16px
- Font sizes: 32px → 28px (headings)
- Grid columns: Single column layout
- Button width: Full width on mobile

---

## What to AVOID

❌ **Forbidden Elements:**
- Neon colors
- Multiple accent colors
- Bright green as primary action
- Heavy gradients
- Dark mode by default
- Chat-style UI
- Emojis (unless data-related)
- Over-animated transitions
- Playful design language

**This is a business tool, not a social app.**

---

## Implementation Checklist

✅ **Completed:**
- [x] Neutral color palette implemented
- [x] Single accent color (#2563EB)
- [x] Premium card system with soft shadows
- [x] Professional typography scale
- [x] Structured AI output presentation
- [x] Analytical lead scoring colors
- [x] Clean button system
- [x] Subtle borders and spacing
- [x] Removed all gradients
- [x] Removed emojis
- [x] Professional navbar
- [x] Responsive design
- [x] Premium form inputs
- [x] Status badge system

---

## Design Quality Benchmark

**If someone opens MarketAI Suite for the first time, they should think:**

> "This feels expensive, intentional, and trustworthy."

**If it feels impressive but quiet, you've done it right.**

---

## File Locations

### Stylesheets
- `frontend/src/App.css` - Global styles
- `frontend/src/components/Navbar.css` - Navigation
- `frontend/src/pages/Auth.css` - Login/Register
- `frontend/src/pages/Dashboard.css` - Dashboard
- `frontend/src/pages/Campaign.css` - Campaign & Pitch pages
- `frontend/src/pages/LeadScoring.css` - Lead scoring

### Components
- `frontend/src/pages/Dashboard.js` - Feature cards
- `frontend/src/pages/LeadScoring.js` - Color system logic
- `frontend/src/components/Navbar.js` - Navigation

---

## Version
Design System v1.0 - Premium Enterprise Edition

Last Updated: February 2026
