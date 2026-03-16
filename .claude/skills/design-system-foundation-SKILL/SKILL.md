---
name: design-system-foundation
description: Create consistent color palettes, typography, spacing, and core UI components with WCAG AA+ accessibility. Use for design systems, component libraries, and establishing visual standards.
---

# Design System Foundation

## Overview

Build comprehensive design systems with consistent tokens, accessible components, and unified visual language.

**Keywords**: design tokens, color palette, typography scale, spacing system, UI components, design system, component library, accessibility, WCAG, brand consistency

## Core Design Tokens

### Color System

**Palette Structure:**
- Primary brand color (user-specified)
- Neutrals: 5-7 gray shades (Gray-50 to Gray-900)
- Semantic: Success (green), Error (red), Warning (amber), Info (blue)
- Dark mode variants

**Accessibility:**
- Text on background: 4.5:1 minimum contrast
- Large text: 3:1 minimum
- UI elements: 3:1 minimum
- Test all combinations in both light and dark modes

### Typography

**Font Stack:**
```
Primary: Inter, Manrope, system-ui
Fallback: -apple-system, "Segoe UI", Roboto, Arial, sans-serif
```

**Scale:**
```
H1: 32px (2rem) - Bold
H2: 24px (1.5rem) - SemiBold
H3: 20px (1.25rem) - SemiBold
H4: 18px (1.125rem) - Medium
Body: 14px (0.875rem) - Regular
Small: 12px (0.75rem) - Regular
```

**Line Heights:**
- Headings: 1.2-1.3
- Body: 1.5-1.7

### Spacing

**8px Base Unit:**
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

### Border Radii

```
Small: 4-6px (inputs, buttons)
Medium: 8-12px (cards, modals)
Large: 16-24px (hero elements)
```

## Core Components

### Buttons

**Types:**
- Primary: Solid brand color
- Secondary: Outlined or light background  
- Tertiary/Ghost: Minimal styling
- Destructive: Red for dangerous actions

**Sizes:** Small (32px), Medium (40px), Large (48px)

**States:** Default, hover, active, focus (visible ring), disabled

### Inputs

**Structure:**
- Label above (14px, medium weight)
- Input field (40px height, 12px padding)
- Helper text below (12px, muted)
- Error message (12px, red, with icon)

**States:** Default, focus (brand border + ring), error (red), disabled, success

### Cards

```
Border: 1px solid Gray-200
Radius: 8-12px
Padding: 16-24px
Shadow: Optional (0 2px 4px rgba(0,0,0,0.06))
```

### Modals

```
Overlay: rgba(0,0,0,0.5)
Container: 400-600px width, 12px radius
Header: Title + close button
Body: Scrollable content
Footer: Right-aligned actions
```

### Tables

**Header:** Bold, Gray-50 background, 2px bottom border
**Rows:** 48-60px height, 1px borders, hover state
**Features:** Sorting, filtering, pagination, row actions

### Navigation

**Sidebar:** 240-280px, icons + text, active indicator
**Tabs:** Horizontal, 2-3px bottom border on active

## Implementation

### CSS Architecture Options

**Utility-First (Tailwind):**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      brand: '#0066FF',
      gray: { 50: '#F9FAFB', /* ... */ },
    },
    spacing: { 1: '4px', 2: '8px', /* ... */ },
  }
}
```

**CSS Variables:**
```css
:root {
  --color-brand: #0066FF;
  --spacing-2: 8px;
  --radius-md: 8px;
}
```

## Examples

### Button Component
```html
<button class="btn btn-primary">
  Save Changes
</button>
```

### Input Field
```html
<div class="form-field">
  <label for="email">Email Address</label>
  <input id="email" type="email" 
         placeholder="name@example.com" />
  <span class="helper">We'll never share your email</span>
</div>
```

### Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
  <button>Action</button>
</div>
```

## Quality Checklist

- [ ] WCAG AA contrast ratios met
- [ ] All interactive elements keyboard accessible
- [ ] Focus states visible (2-3px rings)
- [ ] Typography scale consistent
- [ ] Spacing follows 8px grid
- [ ] Component states defined (hover, active, focus, disabled)
- [ ] Dark mode tested
- [ ] Documentation complete
