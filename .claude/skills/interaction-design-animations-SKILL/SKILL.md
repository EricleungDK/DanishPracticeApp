---
name: interaction-design-animations
description: Design purposeful micro-interactions, transitions, loading states, and animations that enhance usability without overwhelming users. Use for feedback, state changes, and UI polish.
---

# Interaction Design & Animations

## Overview

Create delightful, purposeful interactions that provide clear feedback and guide users through interfaces smoothly.

**Keywords**: micro-interactions, animations, transitions, hover states, loading states, feedback, motion design, UI animation, state changes, interaction patterns

## Core Principles

### Purpose Over Decoration

**Animations Should:**
- ✓ Provide feedback for user actions
- ✓ Show relationships between elements
- ✓ Guide attention to important changes
- ✓ Indicate system status
- ✗ Not distract or slow down users
- ✗ Not be purely decorative

### Timing & Easing

**Speed:**
```
Quick: 150-200ms - Hover states, toggles
Standard: 200-300ms - Most transitions
Moderate: 300-500ms - Page transitions, modals
Slow: 500ms+ - Complex animations (rare)
```

**Easing Functions:**
```
Ease-out: Start fast, end slow - Entering elements
Ease-in: Start slow, end fast - Exiting elements
Ease-in-out: Smooth both ends - Moving/transforming
Linear: Constant speed - Progress bars, loaders
```

**CSS:**
```css
transition: all 200ms ease-out;
transition: transform 300ms ease-in-out;
```

## Hover States

### Interactive Elements

**Buttons:**
```css
Default: Background color
Hover: Darken 10-15%, lift 2px (shadow)
Active: Darken 20%, scale 0.98
Transition: 150-200ms ease-out
```

**Links:**
```css
Default: Underline (optional)
Hover: Underline appears, color change
Transition: color 150ms ease-out
```

**Cards:**
```css
Default: Subtle shadow
Hover: Increase shadow, lift 4px
Active: Reduce shadow, lower 2px
Transition: box-shadow 200ms ease-out
```

### Visual Feedback

**Color Change:**
- Subtle shift, not jarring
- 5-10% lightness change
- Maintain accessibility contrast

**Transform:**
```css
scale(1.05) - Slight grow
translateY(-2px) - Lift effect
rotate(5deg) - Playful tilt (sparingly)
```

**Cursor:**
```css
cursor: pointer - Clickable
cursor: grab - Draggable
cursor: not-allowed - Disabled
cursor: text - Editable
```

## Active & Focus States

### Active (Click/Press)

**Buttons:**
```css
transform: scale(0.98)
box-shadow: inset 0 2px 4px rgba(0,0,0,0.1)
transition: 100ms ease-out
```

**Press Effect:**
- Immediate feedback (100ms)
- Slight scale down or darken
- Restore on release

### Focus (Keyboard)

**Focus Ring:**
```css
outline: 2-3px solid brand-color
outline-offset: 2px
border-radius: same as element
```

**Styles:**
- Visible and high-contrast
- Never remove `:focus` styles
- Use `:focus-visible` for keyboard-only focus

```css
button:focus-visible {
  outline: 3px solid #0066FF;
  outline-offset: 2px;
}
```

## Disabled States

### Visual Treatment

**Opacity:**
```css
opacity: 0.4-0.6
cursor: not-allowed
pointer-events: none
```

**Color:**
- Desaturated/grayed out
- Reduce contrast
- Clear distinction from enabled

**Never:**
- Completely invisible
- Unclear why disabled
- Allow interaction with disabled elements

## Loading States

### Spinners

**Design:**
```
Size: 16px (inline), 24px (button), 48px (page)
Style: Circular, rotating
Color: Brand or gray
Animation: Smooth 1s linear infinite
```

**Usage:**
- Button actions (inline, replace text)
- Page loading (center)
- Section loading (local)

### Skeleton Screens

**For Page/Section Loading:**
```
┌──────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓         │ ← Heading placeholder
│ ░░░░░░░░░░░░░      │ ← Text placeholder
│ ░░░░░░░░           │
│                    │
│ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓    │ ← Card placeholders
└──────────────────────┘
```

**Style:**
- Gray shapes matching content layout
- Subtle shimmer animation (optional)
- Smooth fade-out when content loads

**Shimmer Effect:**
```css
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
animation: shimmer 1.5s infinite linear;
```

### Progress Bars

**Linear Progress:**
```
Width: 100% container
Height: 4-8px
Background: Light gray
Fill: Brand color, animated left-to-right
Radius: Full (pill shape)
```

**Circular Progress:**
```
Size: 48-64px
Stroke: 4-6px
Color: Brand color
Animation: Circular wipe
```

**Determinate:** Show exact progress (0-100%)
**Indeterminate:** Unknown duration (pulsing/sliding)

## Transitions

### Page Transitions

**Fade:**
```css
.page-enter {
  opacity: 0;
}
.page-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}
```

**Slide:**
```css
.page-enter {
  transform: translateX(100%);
}
.page-enter-active {
  transform: translateX(0);
  transition: transform 300ms ease-out;
}
```

### Modal Appearance

**Overlay:**
```css
Fade in: 200ms ease-out
Background: rgba(0,0,0,0) → rgba(0,0,0,0.5)
```

**Modal:**
```css
Scale + fade: 300ms ease-out
transform: scale(0.9) → scale(1)
opacity: 0 → 1
```

### Dropdown Menus

**Appearance:**
```css
Height: 0 → auto
Opacity: 0 → 1
Transform: translateY(-8px) → translateY(0)
Duration: 200ms ease-out
```

**Direction:** Slide from trigger element

## Micro-Interactions

### Toggle Switch

**Animation:**
```
Knob slides: 200ms ease-in-out
Track color: 200ms ease-in-out
Smooth transform: translateX(0) → translateX(20px)
```

### Checkbox

**Check Animation:**
```
Checkmark draws in: 150ms ease-out
Background fills: 150ms ease-out
Scale slightly on check: scale(1.1) → scale(1)
```

### Like/Favorite

**Heart Animation:**
```
1. Scale up (1.2) - 100ms
2. Scale down (0.9) - 100ms
3. Return to normal (1.0) - 100ms
4. Color change throughout
Total: 300ms
```

### Form Submission

**Button States:**
```
1. Normal: "Submit"
2. Loading: Spinner + "Submitting..."
3. Success: Checkmark + "Submitted!"
4. Return to normal after 2s
```

### Notification Toast

**Enter:**
```
Slide in from right: 300ms ease-out
transform: translateX(100%) → translateX(0)
```

**Exit:**
```
Slide out to right: 300ms ease-in
Auto-dismiss after 3-4s
Pause on hover
```

### Delete Confirmation

**Shake Animation:**
```
When error or to grab attention:
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
Duration: 400ms
```

## State Changes

### Status Changes

**Badge Updates:**
```
Pending → Approved:
1. Scale pulse (1.0 → 1.1 → 1.0) - 300ms
2. Color transition (yellow → green) - 300ms
3. Icon change
```

**Count Updates:**
```
Number changes:
1. Fade out old (100ms)
2. Update number
3. Fade in new (100ms)
Or: Slide up transition
```

### Content Updates

**List Item Added:**
```
New item slides in from top
Push existing items down
Height: 0 → auto (300ms)
Opacity: 0 → 1 (300ms)
```

**List Item Removed:**
```
Item fades out (200ms)
Height collapses (200ms)
Items slide up to fill gap
```

## Scroll Interactions

### Sticky Headers

**On Scroll:**
```
Add shadow: 300ms ease-out
Reduce height: 300ms ease-out (optional)
Background: More opaque
```

### Parallax

**Use Sparingly:**
- Hero sections only
- Subtle movement (0.5x scroll speed)
- Don't break usability

### Infinite Scroll

**Loading Indicator:**
```
Appears at 80% scroll
Spinner or "Loading more..."
Smooth content append
```

### Scroll Reveal

**Elements Fade In:**
```
On scroll into viewport:
opacity: 0 → 1 (300ms)
translateY(20px) → translateY(0) (300ms)
Stagger: 100ms between elements
```

Use `IntersectionObserver` API

## Performance

### Optimize Animations

**Use Transform & Opacity:**
```
✓ transform: translateX, translateY, scale, rotate
✓ opacity
✗ left, top, width, height (trigger reflow)
```

**GPU Acceleration:**
```css
transform: translateZ(0); /* Force GPU */
will-change: transform; /* Hint to browser */
```

**Reduce Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Best Practices

- Keep animations under 300ms
- Avoid animating too many elements at once
- Use `requestAnimationFrame` for JS animations
- Test on lower-end devices
- Respect user preferences (prefers-reduced-motion)

## Accessibility

### Motion Sensitivity

**Respect Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
  .modal {
    animation: none;
  }
}
```

**Alternative Feedback:**
- Provide non-motion feedback options
- Status text for screen readers
- Color/icon changes alongside motion

### Focus Management

**Modals:**
```javascript
// Trap focus inside modal
// Return focus to trigger on close
// Announce to screen readers
```

**Live Regions:**
```html
<div role="status" aria-live="polite">
  Item added to cart
</div>
```

## Examples

### Button Hover
```css
.button {
  transition: all 200ms ease-out;
}
.button:hover {
  background-color: darken(10%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Loading Button
```jsx
<Button disabled={loading}>
  {loading ? (
    <>
      <Spinner size="small" />
      Submitting...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Toast Notification
```jsx
<Toast
  show={showToast}
  onClose={() => setShowToast(false)}
  duration={3000}
  animation="slide-right"
>
  ✓ Settings saved successfully
</Toast>
```

### Modal Animation
```css
.modal-overlay {
  animation: fadeIn 200ms ease-out;
}

.modal-content {
  animation: slideUp 300ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

## Quality Checklist

- [ ] All hover states implemented
- [ ] Focus states visible and accessible
- [ ] Disabled states clearly indicated
- [ ] Loading states for async actions
- [ ] Smooth transitions (200-300ms)
- [ ] Appropriate easing functions
- [ ] Animations have purpose
- [ ] Performance optimized (transform/opacity)
- [ ] Reduced motion respected
- [ ] Animations don't block interaction
- [ ] Success/error feedback provided
- [ ] Focus management in modals
- [ ] Screen reader announcements
- [ ] Tested on mobile devices
