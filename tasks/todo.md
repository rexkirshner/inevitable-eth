# Todo List - Inevitable Ethereum

**Current Session:** 2025-10-02
**Status:** Continuing from Phase 3 complete

## Completed ✅

- [x] Phase 1: Content migration (141 articles, 624 images)
- [x] Phase 2: Wikipedia design system
- [x] Phase 3: Layout components (Header, Sidebar, TOC, Footer)
- [x] Create article page route with three-column layout
- [x] Set up markdown rendering with marked
- [x] Enhance world-computer.mdx frontmatter

## Current Tasks 🚧

### Critical Path Items (Before Phase 4)

- [ ] **Add ThemeProvider to root layout** (5 mins)
  - Install/configure next-themes in app/layout.tsx
  - Wrap children with ThemeProvider
  - Enable system/light/dark mode support

- [ ] **Add theme toggle button to Header** (10 mins)
  - Create client component for theme switcher
  - Use useTheme() hook
  - Add Sun/Moon icons with smooth transition
  - Position in header utilities area

### Phase 4: MDX Content Components

- [ ] **Create Infobox component** (HIGH priority)
  - Wikipedia-style right-aligned box
  - Key-value pairs from frontmatter.infobox
  - Responsive (moves to top on mobile)
  - Styled with border and background

- [ ] **Create Callout component** (HIGH priority)
  - Note/Warning/Tip/Info variants
  - Color-coded borders and backgrounds
  - Icon support (lucide-react)
  - Used inline in MDX content

- [ ] **Create Figure component** (HIGH priority)
  - Centered image with border
  - Caption support from alt text
  - Responsive sizing
  - next/image optimization

- [ ] **Create References component** (MEDIUM priority)
  - Footnote-style citations
  - Auto-numbering
  - Render from frontmatter.sources
  - Clickable links with external indicator

- [ ] **Wire up MDX components**
  - Update mdx-components.tsx
  - Export all custom components
  - Test in world-computer article

### Phase 5: Additional Pages

- [ ] **Create Category page** (app/[category]/page.tsx)
  - List all articles in category
  - Filter by difficulty/tags
  - Article cards with previews
  - Sorting options

- [ ] **Revamp Homepage**
  - Wikipedia Main Page inspired
  - Featured article (world-computer)
  - Category overviews with counts
  - Recent updates section

### Future Phases (Not started)

- [ ] Phase 6: Performance & SEO
- [ ] Phase 7: Quality assurance

---

## Notes

**Priority Order:**
1. ThemeProvider + toggle (complete dark mode support)
2. MDX components (enrich article pages)
3. Category pages (navigation)
4. Homepage revamp

**Testing Strategy:**
- Use world-computer article as test case
- Add components incrementally
- Verify responsive behavior
- Check dark mode compatibility
