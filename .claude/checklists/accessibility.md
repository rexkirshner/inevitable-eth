# Accessibility (A11Y) Review Checklist

Comprehensive accessibility audit for web applications and UI components.

**When to use:** During `/code-review` for any project with user interface.

## Quick Check (5 minutes)

Essential accessibility items:

- [ ] **Semantic HTML** - header, nav, main, article, aside, footer tags used correctly
- [ ] **Form labels** - All inputs have associated `<label>` elements
- [ ] **Keyboard navigation** - Can navigate entire app with keyboard only
- [ ] **Color contrast** - Text meets WCAG AA standards (4.5:1 for normal text)
- [ ] **Alt text** - All meaningful images have descriptive alt attributes

## Keyboard Navigation

- [ ] **Tab order** - Logical tab sequence through interactive elements
- [ ] **Focus visible** - Clear visual indicator when element has focus
- [ ] **No keyboard traps** - Can tab in and out of all components
- [ ] **Skip links** - "Skip to main content" link for screen readers
- [ ] **All functionality accessible** - No mouse-only interactions
- [ ] **Escape to close** - Modals/dialogs close with Escape key
- [ ] **Arrow keys** - Dropdowns/menus navigable with arrow keys

## Screen Reader Support

- [ ] **Semantic structure** - Proper heading hierarchy (H1→H2→H3)
- [ ] **Landmarks** - header, nav, main, aside, footer for navigation
- [ ] **ARIA labels** - aria-label or aria-labelledby where needed
- [ ] **ARIA roles** - Appropriate roles for custom components
- [ ] **ARIA states** - aria-expanded, aria-selected, aria-hidden used correctly
- [ ] **Live regions** - aria-live for dynamic content updates
- [ ] **Form errors** - Errors announced to screen readers

## Form Accessibility

- [ ] **Associated labels** - Every input has `<label for="id">` or aria-label
- [ ] **Required fields** - Marked with required attribute and visual indicator
- [ ] **Error messages** - Clear, descriptive, associated with field
- [ ] **Fieldset/legend** - Related form controls grouped with fieldset
- [ ] **Autocomplete** - autocomplete attribute for common fields
- [ ] **Input types** - Proper type (email, tel, url) for better mobile experience
- [ ] **Placeholder not label** - Placeholders complement labels, don't replace them

## Visual Design

### Color Contrast

**WCAG AA Standards:**
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or 14pt bold): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

- [ ] **Body text** - Meets 4.5:1 minimum
- [ ] **Headings** - Meets 4.5:1 or 3:1 if large
- [ ] **Links** - Distinguishable from surrounding text (underline or 3:1 contrast + indicator)
- [ ] **Buttons** - Background/text contrast meets standards
- [ ] **Icons** - Sufficient contrast or text alternative
- [ ] **Focus indicators** - 3:1 contrast with background

### Color Reliance

- [ ] **Not color-only** - Don't rely solely on color to convey information
- [ ] **Error states** - Use icons or text in addition to red color
- [ ] **Success states** - Use icons or text in addition to green color
- [ ] **Chart legends** - Patterns or labels in addition to colors
- [ ] **Links** - Underlined or otherwise distinguished beyond just color

## Images and Media

### Images

- [ ] **Meaningful images** - Descriptive alt text
- [ ] **Decorative images** - alt="" (empty alt, not missing)
- [ ] **Complex images** - Detailed description in surrounding text or longdesc
- [ ] **Image buttons** - Alt text describes action, not image
- [ ] **SVGs** - title and desc elements or aria-label

### Video/Audio

- [ ] **Captions** - All video has captions for deaf/hard-of-hearing
- [ ] **Transcripts** - Text transcripts available for audio/video
- [ ] **Audio descriptions** - Descriptions for visual content (or text alternative)
- [ ] **Controls accessible** - Play/pause/volume accessible via keyboard
- [ ] **No autoplay** - Or provide easy way to stop

## Interactive Components

### Buttons and Links

- [ ] **Semantic elements** - `<button>` for actions, `<a>` for navigation
- [ ] **Descriptive text** - "Download report" not "Click here"
- [ ] **Disabled state** - Properly marked with disabled attribute
- [ ] **Icon buttons** - aria-label when no visible text
- [ ] **Button vs link** - Buttons for actions, links for navigation

### Modals and Dialogs

- [ ] **Focus trap** - Focus stays within modal when open
- [ ] **Focus management** - Focus moves to modal on open, returns on close
- [ ] **Escape to close** - ESC key closes modal
- [ ] **role="dialog"** - Or role="alertdialog" for urgent messages
- [ ] **aria-modal="true"** - Indicates modal behavior
- [ ] **aria-labelledby** - References modal title

### Dropdowns and Menus

- [ ] **role="menu"** - Or role="listbox" for appropriate pattern
- [ ] **Arrow key navigation** - Up/down arrows navigate items
- [ ] **Home/End keys** - Jump to first/last item
- [ ] **Type-ahead** - Typing letter jumps to matching item
- [ ] **aria-expanded** - Indicates open/closed state
- [ ] **aria-haspopup** - Indicates submenu presence

### Custom Components

- [ ] **Appropriate role** - tab, tabpanel, slider, etc.
- [ ] **Keyboard support** - Full keyboard interaction
- [ ] **ARIA states** - All relevant states communicated
- [ ] **Focus management** - Focus handled appropriately
- [ ] **Native when possible** - Use native HTML controls instead of custom

## Dynamic Content

- [ ] **aria-live regions** - For content that updates without page reload
- [ ] **Loading states** - Announced to screen readers (aria-busy or live region)
- [ ] **Client-side routing** - Focus management on route change
- [ ] **Infinite scroll** - Keyboard accessible, announces new content
- [ ] **Animations** - Respect prefers-reduced-motion setting

## Mobile Accessibility

- [ ] **Touch targets** - Minimum 48x48px (Apple: 44x44pt)
- [ ] **Spacing** - Adequate spacing between touch targets
- [ ] **Orientation** - Works in both portrait and landscape
- [ ] **Zoom** - Content accessible at 200% zoom
- [ ] **Touch gestures** - Alternative for complex gestures

## Tables

- [ ] **Table structure** - `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- [ ] **Header cells** - `<th>` with scope attribute
- [ ] **Caption** - `<caption>` describes table purpose
- [ ] **Complex tables** - id/headers association for complex layouts
- [ ] **Responsive** - Accessible on mobile (scrolling or layout change)

## Common Issues

### Critical

**Missing form labels:**
```markdown
**Issue:** Inputs lack associated labels
**Impact:** Screen reader users can't use form
**Severity:** Critical
**Fix:** Add proper <label> elements or aria-label
```

**Keyboard traps:**
```markdown
**Issue:** Can't tab out of modal/component
**Impact:** Keyboard users stuck
**Severity:** Critical
**Fix:** Implement proper focus management
```

**Color-only information:**
```markdown
**Issue:** Error states indicated only by red color
**Impact:** Color-blind users can't identify errors
**Severity:** High
**Fix:** Add icons or text indicators
```

### High Priority

**Missing alt text:**
```markdown
**Issue:** Images missing alt attributes
**Impact:** Screen readers can't convey image meaning
**Severity:** High
**Fix:** Add descriptive alt text for meaningful images, alt="" for decorative
```

**Poor focus indicators:**
```markdown
**Issue:** No visible focus indicator or low contrast
**Impact:** Keyboard users can't see where they are
**Severity:** High
**Fix:** Add clear focus styles (outline or box-shadow)
```

**Missing ARIA labels on icon buttons:**
```markdown
**Issue:** Buttons with only icons, no text or aria-label
**Impact:** Screen readers announce "button" with no context
**Severity:** High
**Fix:** Add aria-label describing button action
```

## Testing Tools

### Browser Extensions
- **axe DevTools** - Automated accessibility testing
- **WAVE** - Visual feedback of accessibility issues
- **Lighthouse** - Built into Chrome DevTools
- **IBM Equal Access** - Comprehensive checker

### Screen Readers
- **NVDA** - Free screen reader for Windows
- **JAWS** - Popular commercial screen reader (Windows)
- **VoiceOver** - Built into macOS and iOS
- **TalkBack** - Built into Android

### Testing Checklist
1. **Keyboard only** - Navigate site without mouse
2. **Screen reader** - Test with actual screen reader
3. **Zoom to 200%** - Ensure content still accessible
4. **Automated tools** - Run axe/WAVE/Lighthouse
5. **Color contrast** - Check with contrast checker

## WCAG Levels

### Level A (Minimum)
Must meet for basic accessibility:
- Keyboard accessible
- Text alternatives for non-text content
- Captions for video
- Logical heading structure

### Level AA (Standard)
Target for most websites:
- 4.5:1 color contrast (normal text)
- 3:1 color contrast (large text, UI components)
- Multiple ways to find pages
- Consistent navigation
- Resize text to 200%

### Level AAA (Enhanced)
Enhanced accessibility:
- 7:1 color contrast (normal text)
- 4.5:1 color contrast (large text)
- Sign language for video
- Extended audio descriptions

**Recommendation:** Target Level AA for most projects.

## Documentation Format

When documenting accessibility issues:

```markdown
### Accessibility Issues

**A11Y1: Missing form labels**
- **Severity:** Critical
- **Location:** components/LoginForm.tsx
- **Issue:** Inputs lack associated labels
- **Impact:** Screen reader users can't use form
- **WCAG:** 3.3.2 Labels or Instructions (Level A)
- **Suggestion:** Add proper <label> elements with for attribute

**A11Y2: Poor keyboard navigation**
- **Severity:** High
- **Location:** components/Navigation.tsx
- **Issue:** Dropdown menu not accessible via keyboard
- **Impact:** Keyboard users can't access menu items
- **WCAG:** 2.1.1 Keyboard (Level A)
- **Suggestion:** Add keyboard event handlers for arrow keys and Enter
```

## Quick Wins

High-impact, low-effort fixes:

1. **Add alt text to images** - 30 seconds per image
2. **Fix form labels** - 1 minute per form field
3. **Add focus styles** - Global CSS rule
4. **Use semantic HTML** - header/nav/main instead of divs
5. **Increase contrast** - Adjust color values

## Priority Guidelines

**Critical (Block Launch):**
- Forms unusable with screen reader
- Keyboard traps
- Essential functionality inaccessible

**High (Fix Before Launch):**
- Missing alt text on key images
- Poor focus indicators
- Color-only information
- Heading hierarchy issues

**Medium (Fix Post-Launch):**
- Minor contrast issues
- Missing ARIA labels on less-used features
- Suboptimal mobile touch targets

**Low (Nice to Have):**
- Level AAA enhancements
- Additional keyboard shortcuts
- Enhanced screen reader announcements

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)
