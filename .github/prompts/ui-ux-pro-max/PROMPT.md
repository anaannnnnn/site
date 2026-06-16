---
name: ui-ux-pro-max
description: Comprehensive design guide for web and mobile applications. Contains 67 styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 16 technology stacks. Searchable database with priority-based recommendations.
---

# ui-ux-pro-max

Comprehensive design guide for web and mobile applications. Contains 67 styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 16 technology stacks. Searchable database with priority-based recommendations.

# Prerequisites

Check if Python is installed:

```bash
python3 --version || python --version
```

If Python is not installed, install it based on user's OS:

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3
```

**Windows:**
```powershell
winget install Python.Python.3.12
```

---

## How to Use This Skill

Use this skill when the user requests any of the following:

| Scenario | Trigger Examples | Start From |
|----------|-----------------|------------|
| **New project / page** | "Build a landing page", "Build a dashboard" | Step 1 → Step 2 (design system) |
| **New component** | "Create a pricing card", "Add a modal" | Step 3 (domain search: style, ux) |
| **Choose style / color / font** | "What style fits a fintech app?", "Recommend color palette" | Step 2 (design system) |
| **Review existing UI** | "Review this page for UX issues", "Check accessibility" | Quick Reference checklist above |
| **Fix a UI bug** | "Button hover is broken", "Layout shifts on load" | Quick Reference → relevant section |
| **Improve / optimize** | "Make this faster", "Improve mobile experience" | Step 3 (domain search: ux, react) |
| **Implement dark mode** | "Add dark mode support" | Step 3 (domain: style "dark mode") |
| **Add charts / data viz** | "Add an analytics dashboard chart" | Step 3 (domain: chart) |
| **Stack best practices** | "React performance tips", "HTML/Tailwind navigation" | Step 4 (stack search) |

Follow this workflow:

### Step 1: Analyze User Requirements

Extract key information from user request:
- **Product type**: Entertainment (social, video, music, gaming), Tool (scanner, editor, converter), Productivity (task manager, notes, calendar), or hybrid
- **Target audience**: Consider age group, usage context
- **Style keywords**: playful, vibrant, minimal, dark mode, content-first, immersive, etc.
- **Stack**: HTML/Tailwind (this project's tech stack)

### Step 2: Generate Design System (REQUIRED)

**Always start with `--design-system`** to get comprehensive recommendations with reasoning:

```bash
python3 .github/prompts/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

### Step 3: Supplement with Detailed Searches (as needed)

```bash
python3 .github/prompts/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**Available domains:** `product`, `style`, `color`, `typography`, `landing`, `chart`, `ux`, `react`, `web`, `prompt`

### Step 4: Stack Guidelines

```bash
python3 .github/prompts/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

---

## Search Reference

### Available Domains

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | Product type recommendations | SaaS, e-commerce, portfolio, healthcare, beauty, service |
| `style` | UI styles, colors, effects | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | Font pairings, Google Fonts | elegant, playful, professional, modern |
| `color` | Color palettes by product type | saas, ecommerce, healthcare, beauty, fintech, service |
| `landing` | Page structure, CTA strategies | hero, hero-centric, testimonial, pricing, social-proof |
| `chart` | Chart types, library recommendations | trend, comparison, timeline, funnel, pie |
| `ux` | Best practices, anti-patterns | animation, accessibility, z-index, loading |
| `react` | React/Next.js performance | waterfall, bundle, suspense, memo, rerender, cache |
| `web` | App interface guidelines | accessibilityLabel, touch targets, safe areas |
| `prompt` | AI prompts, CSS keywords | (style name) |

### Available Stacks

| Stack | Focus |
|-------|-------|
| `html-tailwind` | HTML, Tailwind CSS, vanilla JS |
| `react` | React components, hooks |
| `nextjs` | Next.js app router, SSR |
| `vue` | Vue 3, composition API |

---

## Pre-Delivery Checklist

Before delivering UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from a consistent icon family
- [ ] Pressed/hover states provide clear visual feedback
- [ ] Touch targets meet minimum size (≥44×44px)
- [ ] Micro-interaction timing stays in 150–300ms range
- [ ] Primary text contrast ≥4.5:1
- [ ] Secondary text contrast ≥3:1
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Reduced-motion respected
- [ ] Keyboard navigation supported
