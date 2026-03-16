---
name: layout-n-visual-hierarchy
description: Structure interfaces with responsive grids, strategic white space, clear hierarchy, and consistent alignment. Use for dashboard layouts, page structure, and content organization.
---

# Layout & Visual Hierarchy

## Overview

Create well-structured, scannable interfaces that guide users naturally through content with clear visual organization.

**Keywords**: layout, visual hierarchy, responsive grid, white space, spacing, alignment, dashboard layout, page structure, information architecture, content organization

## Responsive Grid System

### 12-Column Grid

```
Desktop (1440px): 12 columns, 24px gutters
Tablet (768px): 8-12 columns, 20px gutters
Mobile (375px): 4 columns, 16px gutters
```

**Container Max Widths:**
- XL: 1280px
- L: 1024px
- M: 768px
- S: 640px

### Grid Usage

**Full-width:** Span all 12 columns (headers, footers)
**Main content:** 8-10 columns, centered
**Sidebar + content:** 3-4 cols sidebar, 8-9 cols content
**Card grid:** 4 cols × 3 cards, 3 cols × 4 cards

## Dashboard Layouts

### Sidebar + Content (Recommended)

```
┌──────┬─────────────────────────┐
│      │  Top Bar (optional)     │
│      ├─────────────────────────┤
│ Side │                         │
│ bar  │  Main Content Area      │
│      │                         │
│ 240  │      600-1200px         │
│ -280 │                         │
│  px  │                         │
└──────┴─────────────────────────┘
```

**Sidebar:**
- Width: 240-280px
- Position: Fixed or sticky
- Background: Slightly darker (Gray-50)
- Navigation items: 40-48px height

**Content:**
- Padding: 32-48px
- Max-width: 1200px (for readability)
- Background: White or light gray

### Top Bar

```
Height: 56-64px
Content: [Logo] [Search] [spacer] [User] [Notifications]
Position: Fixed top
Z-index: 100
Shadow: Subtle when scrolled
```

### Card Layouts

**2-Column:**
```
┌──────────────┬──────────────┐
│   Card 1     │   Card 2     │
│              │              │
└──────────────┴──────────────┘
```
Gap: 24px

**3-Column (Desktop):**
```
┌─────────┬─────────┬─────────┐
│ Card 1  │ Card 2  │ Card 3  │
└─────────┴─────────┴─────────┘
```
Responsive: 2 cols tablet, 1 col mobile

**Masonry Layout:**
Variable height cards, Pinterest-style
Use for image galleries, mixed content

## Strategic White Space

### Spacing Scale

```
Micro (within elements): 4-12px
Small (between related items): 16-24px
Medium (between sections): 32-48px
Large (major sections): 64-96px
```

### Rules

**Breathing Room:**
- Don't fill every pixel
- More space = better focus
- Group related elements with proximity

**Margins:**
- Page margins: 24px mobile, 48px desktop
- Section padding: 32-48px
- Card padding: 16-24px

**Line Length:**
- Max 75 characters per line for readability
- Use max-width on text containers

## Visual Hierarchy

### Size & Scale

**Heading Sizes:**
```
H1 (Hero): 32-48px - Page title
H2 (Section): 24-32px - Major sections
H3 (Subsection): 20-24px - Components
H4 (Card): 18-20px - Card titles
Body: 14-16px - Default text
Small: 12-14px - Metadata, captions
```

**Scale Ratio:** 1.25 (Major Third) or 1.33 (Perfect Fourth)

### Weight & Color

**Create Emphasis:**
```
Primary: Bold (700), Gray-900
Secondary: Medium (500), Gray-700
Tertiary: Regular (400), Gray-600
Disabled: Regular (400), Gray-400
```

**Hierarchy Through Weight:**
- Bold for important actions
- Medium for labels
- Regular for body text

### Positioning

**Z-Pattern (Western):**
```
1. Top-left → Top-right (header)
2. Diagonal
3. Bottom-left → Bottom-right (footer)
```

**F-Pattern (Content):**
```
Users scan:
1. Horizontally across top
2. Vertically down left
3. Horizontally again (shorter)
```

**Place Important Content:**
- Top-left for primary info
- Right for actions
- Bottom for secondary actions

## Alignment

### Consistent Alignment

**Left-Align (Default):**
- Body text
- Form labels
- Navigation items
- List items

**Right-Align:**
- Numbers in tables
- Actions/buttons in modals
- Secondary info (dates, metadata)

**Center-Align:**
- Hero sections
- Empty states
- Modal content (sparingly)

### Grid Alignment

- Align elements to grid columns
- Maintain vertical rhythm
- Use consistent baseline grid (8px)

## Content Organization

### Chunking

**Group Related Items:**
```
┌─────────────────────┐
│ Account Settings    │ ← Section
│ ┌─────────────────┐ │
│ │ Email           │ │ ← Related
│ │ Password        │ │   group
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Notifications   │ │ ← Separate
│ │ Privacy         │ │   group
│ └─────────────────┘ │
└─────────────────────┘
```

**5±2 Rule:** Humans remember 5-9 items
- Limit menu items
- Group settings into 5-7 categories
- Break long lists into pages

### Progressive Disclosure

**Show What's Needed:**
- Essential content first
- Hide advanced options
- "Show more" for additional details
- Accordion for lengthy content

### Visual Weight

**Heavy Elements:**
- Filled buttons
- Dark backgrounds
- Large images
- Bold text

**Light Elements:**
- Ghost buttons
- Light backgrounds
- Small text
- Thin borders

**Balance:** Mix heavy and light for visual interest

## Responsive Breakpoints

### Standard Breakpoints

```
Mobile:  < 640px  (1 column)
Tablet:  640-1024px (2 columns)
Desktop: 1024-1440px (3-4 columns)
Wide:    > 1440px (4+ columns)
```

### Responsive Patterns

**Reflow:**
- 3 columns → 2 → 1
- Side-by-side → stacked

**Hide/Show:**
- Hide less important content on mobile
- Collapse navigation to hamburger
- Show full data on desktop

**Resize:**
- Scale images proportionally
- Adjust font sizes (but not too much)
- Maintain touch targets (44px min)

## Mobile-First Considerations

### Design Approach

1. Start with mobile layout
2. Add complexity for larger screens
3. Use progressive enhancement

### Mobile Priorities

**Essential First:**
- Primary actions prominent
- Core content accessible
- Navigation simplified

**Touch Targets:**
- Minimum 44×44px (48×48px better)
- 8px spacing between targets
- Larger buttons for primary actions

**Thumb Zones:**
```
┌─────────────┐
│   Hard      │ Top corners
│ Easy  Easy  │ Bottom thirds (natural)
│   Hard      │ Bottom center
└─────────────┘
```

Place important actions in easy-to-reach zones.

## Accessibility

### Semantic Structure

```html
<header> - Site/page header
<nav> - Navigation
<main> - Primary content
<article> - Self-contained content
<aside> - Sidebar content
<footer> - Site/page footer
```

### Heading Hierarchy

```
H1 - One per page, page title
  H2 - Major sections
    H3 - Subsections
      H4 - Components
```

Don't skip levels (H1 → H3)

### Landmarks

```html
<nav aria-label="Main navigation">
<main role="main">
<aside aria-label="Related articles">
```

### Focus Order

- Logical tab order (top to bottom, left to right)
- Skip links: "Skip to main content"
- Modal: Trap focus inside when open

## Examples

### Dashboard Layout
```jsx
<DashboardLayout>
  <Sidebar>
    <Logo />
    <Nav items={navItems} />
  </Sidebar>
  <Main>
    <TopBar>
      <Search />
      <UserMenu />
    </TopBar>
    <Content>
      <PageHeader title="Dashboard" />
      <CardGrid cols={3}>
        <MetricCard />
        <MetricCard />
        <MetricCard />
      </CardGrid>
    </Content>
  </Main>
</DashboardLayout>
```

### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.main-content {
  grid-column: 1 / 9; /* 8 columns */
}

.sidebar {
  grid-column: 9 / 13; /* 4 columns */
}

@media (max-width: 768px) {
  .main-content,
  .sidebar {
    grid-column: 1 / -1; /* Full width */
  }
}
```

### Visual Hierarchy
```jsx
<Section spacing="large">
  <Heading level={2} weight="bold" color="primary">
    Section Title
  </Heading>
  <Text size="large" color="secondary" spacing="medium">
    Section introduction paragraph.
  </Text>
  <CardGrid gap="medium">
    <Card>
      <Heading level={3}>Card Title</Heading>
      <Text size="body">Card content</Text>
      <Button variant="primary">Action</Button>
    </Card>
  </CardGrid>
</Section>
```

## Quality Checklist

- [ ] Grid system implemented
- [ ] Consistent spacing scale used
- [ ] Visual hierarchy clear (size, weight, color)
- [ ] Alignment consistent throughout
- [ ] White space used strategically
- [ ] Content logically grouped
- [ ] Responsive on all screen sizes
- [ ] Mobile-first approach
- [ ] Touch targets ≥44px
- [ ] Semantic HTML structure
- [ ] Heading hierarchy logical
- [ ] Focus order makes sense
- [ ] Skip links provided
- [ ] Landmarks defined
