---
name: code-review-accessibility
description: WCAG 2.1 accessibility audit - semantic HTML, ARIA, keyboard navigation, color contrast, screen readers
---

# /code-review-accessibility Command

Conduct a thorough WCAG 2.1 accessibility audit. This command **NEVER makes changes** - it only identifies accessibility barriers and suggests fixes. Fixes happen in a separate session after review.

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Test with actual tools** - Use axe, Lighthouse, manual keyboard testing
3. **Cover all user groups** - Visual, motor, cognitive, hearing impairments
4. **Follow WCAG 2.1 AA** - This is the standard compliance level

## Framework Note

This audit uses `.tsx/.jsx` in grep patterns. **Adjust for your framework:**
- **React/Next.js**: `--include="*.tsx" --include="*.jsx"` (default)
- **Svelte/SvelteKit**: `--include="*.svelte"`
- **Vue/Nuxt**: `--include="*.vue"`
- **Astro**: `--include="*.astro"`

## When to Use This Command

**Good times:**
- Before launching public-facing applications
- After major UI redesigns
- When adding new interactive components
- Before compliance audits (ADA, Section 508)
- When accessibility complaints are received

**Bad times:**
- Internal CLI tools
- API-only services
- Early prototypes not yet user-facing

## WCAG 2.1 Framework

This audit covers all four WCAG principles (POUR):

1. **Perceivable** - Information must be presentable to all senses
2. **Operable** - Interface must be navigable by all input methods
3. **Understandable** - Content and interface must be clear
4. **Robust** - Content must work with assistive technologies

### Success Criteria Levels

| Level | Description | Required |
|-------|-------------|----------|
| A | Minimum accessibility | Yes |
| AA | Addresses major barriers | Yes (target) |
| AAA | Highest level, optional | Nice to have |

## Execution Steps

### Step 0: Set Expectations

```
Accessibility Audit (WCAG 2.1 AA)

Scope: Semantic HTML, ARIA, keyboard, color contrast, screen readers
Framework: [detected]
UI Library: [detected]

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...

Testing will include:
- Automated scans (simulated axe-core analysis)
- Manual code review
- Keyboard navigation patterns
- Screen reader compatibility
```

### Step 1: Component Inventory

**Identify all interactive components:**

```bash
# Find buttons
grep -rn "<button\|<Button\|role=\"button\"" --include="*.tsx" --include="*.jsx"

# Find links
grep -rn "<a\s\|<Link\s" --include="*.tsx" --include="*.jsx"

# Find form elements
grep -rn "<input\|<select\|<textarea\|<form" --include="*.tsx" --include="*.jsx"

# Find custom interactive components
grep -rn "onClick\|onKeyDown\|tabIndex" --include="*.tsx" --include="*.jsx"

# Find modals and dialogs
grep -rn "modal\|dialog\|Dialog\|Modal" --include="*.tsx" --include="*.jsx"
```

**Create component inventory:**

| Component | Type | Interactive | ARIA Role | Issues |
|-----------|------|-------------|-----------|--------|
| NavButton | Button | Yes | button | None |
| ProductCard | Card | Yes | - | Missing role |
| SearchModal | Dialog | Yes | dialog | Focus trap needed |

### Step 2: Perceivable (WCAG 1.x)

#### 2.1: Images and Non-Text Content

**Check for missing alt text:**

```bash
# Find images without alt
grep -rn "<img" --include="*.tsx" --include="*.jsx" | grep -v "alt="

# Find decorative images (should have alt="")
grep -rn "alt=\"\"" --include="*.tsx"

# Find background images with meaning
grep -rn "background-image\|backgroundImage" --include="*.tsx" --include="*.css"

# Find icons without labels
grep -rn "<Icon\|<svg" --include="*.tsx" | grep -v "aria-label\|aria-hidden"
```

**Check for:**
- [ ] **All images have alt text** - Meaningful description or alt=""
- [ ] **Decorative images hidden** - aria-hidden="true" or alt=""
- [ ] **Icons have labels** - aria-label or visually hidden text
- [ ] **Complex images have descriptions** - longdesc or aria-describedby
- [ ] **Charts/graphs have text alternatives** - Data tables or descriptions

**Common patterns:**

```tsx
// BAD: Missing alt text
<img src="/product.jpg" />

// GOOD: Informative alt
<img src="/product.jpg" alt="Red leather handbag with gold clasp" />

// GOOD: Decorative (hidden from AT)
<img src="/decorative-line.svg" alt="" aria-hidden="true" />

// BAD: Icon button without label
<button><SearchIcon /></button>

// GOOD: Icon button with label
<button aria-label="Search products"><SearchIcon /></button>
```

#### 2.2: Color Contrast

**Check contrast ratios:**

```bash
# Find color definitions
grep -rn "color:\|background:" --include="*.css" --include="*.scss"

# Find inline colors
grep -rn "style={{.*color" --include="*.tsx"

# Find Tailwind color classes
grep -rn "text-\|bg-" --include="*.tsx"

# Find potential contrast issues
grep -rn "text-gray-400\|text-gray-300" --include="*.tsx"
```

**Required contrast ratios (WCAG AA):**

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text (< 18px) | 4.5:1 |
| Large text (18px+ bold, 24px+) | 3:1 |
| UI components & graphics | 3:1 |
| Incidental/logos | No requirement |

**Check for:**
- [ ] **Text meets 4.5:1** - Normal body text
- [ ] **Large text meets 3:1** - Headings, large UI text
- [ ] **Focus indicators visible** - Not relying on color alone
- [ ] **Links distinguishable** - Not by color alone (underline, icon)
- [ ] **Error states visible** - Not color-only indication

#### 2.3: Content Structure

**Check semantic structure:**

```bash
# Find heading hierarchy
grep -rn "<h1\|<h2\|<h3\|<h4\|<h5\|<h6" --include="*.tsx"

# Find landmark regions
grep -rn "<main\|<nav\|<aside\|<header\|<footer\|role=\"" --include="*.tsx"

# Find lists
grep -rn "<ul\|<ol\|<dl" --include="*.tsx"

# Find tables
grep -rn "<table\|<th\|<td" --include="*.tsx"
```

**Check for:**
- [ ] **Heading hierarchy correct** - No skipped levels (h1 -> h3)
- [ ] **Single h1 per page** - Clear page title
- [ ] **Landmark regions used** - main, nav, footer, aside
- [ ] **Lists properly marked up** - ul/ol for lists
- [ ] **Tables have headers** - th elements with scope

### Step 3: Operable (WCAG 2.x)

#### 3.1: Keyboard Navigation

**Check keyboard accessibility:**

```bash
# Find interactive elements with onClick but no keyboard
grep -rn "onClick" --include="*.tsx" | grep -v "onKeyDown\|onKeyPress\|<button\|<a\s\|<input\|<select"

# Find tabIndex usage
grep -rn "tabIndex" --include="*.tsx"

# Find focus management
grep -rn "focus\(\)\|\.focus\|autoFocus\|useFocus" --include="*.tsx"

# Find skip links
grep -rn "skip.*main\|skip.*content\|#main" --include="*.tsx"
```

**Check for:**
- [ ] **All interactive elements keyboard accessible** - Tab navigable
- [ ] **Visible focus indicator** - Clear focus ring/outline
- [ ] **Focus order logical** - Matches visual order
- [ ] **Skip links present** - Skip to main content
- [ ] **No keyboard traps** - Can tab away from any element
- [ ] **Modals trap focus** - Focus stays within modal

**Common patterns:**

```tsx
// BAD: Click-only handler
<div onClick={handleClick}>Click me</div>

// GOOD: Button element (keyboard accessible)
<button onClick={handleClick}>Click me</button>

// GOOD: If div required, add keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>

// BAD: Hidden focus indicator
button:focus { outline: none; }

// GOOD: Visible custom focus
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}
```

#### 3.2: Focus Management

**Check modals and dialogs:**

```bash
# Find modal implementations
grep -rn "Dialog\|Modal\|Drawer\|Sheet" --include="*.tsx"

# Check for focus trap
grep -rn "FocusTrap\|focus-trap\|trapFocus" --include="*.tsx"

# Check for return focus
grep -rn "previousFocus\|returnFocus\|restoreFocus" --include="*.tsx"
```

**Modal requirements:**
- [ ] **Focus moves to modal** - On open
- [ ] **Focus trapped in modal** - Tab cycles within
- [ ] **Escape closes modal** - Keyboard dismissal
- [ ] **Focus returns on close** - Back to trigger element
- [ ] **Background is inert** - aria-hidden on content behind

#### 3.3: Timing and Motion

**Check for motion and timing issues:**

```bash
# Find animations
grep -rn "animation\|transition\|@keyframes" --include="*.css" --include="*.scss"

# Find auto-playing content
grep -rn "autoPlay\|autoplay" --include="*.tsx"

# Find timeouts that affect users
grep -rn "setTimeout\|setInterval" --include="*.tsx"

# Check for prefers-reduced-motion
grep -rn "prefers-reduced-motion" --include="*.css" --include="*.tsx"
```

**Check for:**
- [ ] **Respects prefers-reduced-motion** - Disable/reduce animations
- [ ] **No auto-playing video with sound** - Or has controls
- [ ] **Time limits adjustable** - Session timeouts, etc.
- [ ] **No content flashes > 3/second** - Seizure prevention

### Step 4: Understandable (WCAG 3.x)

#### 4.1: Forms and Input

**Check form accessibility:**

```bash
# Find form fields without labels
grep -rn "<input" --include="*.tsx" | grep -v "id=\|aria-label"

# Find labels
grep -rn "<label" --include="*.tsx"

# Check for error messaging
grep -rn "error\|Error\|invalid\|Invalid" --include="*.tsx"

# Find required fields
grep -rn "required\|aria-required" --include="*.tsx"
```

**Check for:**
- [ ] **All inputs have labels** - Visible or aria-label
- [ ] **Labels associated with inputs** - htmlFor/id or wrapping
- [ ] **Required fields indicated** - aria-required="true"
- [ ] **Error messages clear** - Not just red border
- [ ] **Error messages associated** - aria-describedby
- [ ] **Input purpose identified** - autocomplete attribute

**Common patterns:**

```tsx
// BAD: Input without label
<input type="email" placeholder="Email" />

// GOOD: Visible label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// GOOD: Visually hidden label (when design requires)
<label htmlFor="email" className="sr-only">Email</label>
<input id="email" type="email" placeholder="email@example.com" />

// BAD: Error with no association
<input id="email" type="email" />
{error && <span className="text-red-500">Invalid email</span>}

// GOOD: Associated error
<input id="email" type="email" aria-describedby="email-error" aria-invalid={!!error} />
{error && <span id="email-error" className="text-red-500">Invalid email</span>}
```

#### 4.2: Navigation Consistency

**Check navigation patterns:**

```bash
# Find navigation components
grep -rn "<nav\|role=\"navigation\"" --include="*.tsx"

# Find breadcrumbs
grep -rn "breadcrumb\|Breadcrumb" --include="*.tsx"

# Check for consistent naming
grep -rn "aria-label=" --include="*.tsx" | grep -i "nav\|menu"
```

**Check for:**
- [ ] **Navigation consistent** - Same order across pages
- [ ] **Current page indicated** - aria-current="page"
- [ ] **Breadcrumbs labeled** - aria-label="Breadcrumb"
- [ ] **Multiple navigation areas labeled** - Distinguish main/footer nav

### Step 5: Robust (WCAG 4.x)

#### 5.1: Valid HTML and ARIA

**Check markup validity:**

```bash
# Find invalid ARIA usage
grep -rn "aria-label\|aria-labelledby\|aria-describedby" --include="*.tsx"

# Find duplicate IDs (potential)
grep -rn "id=\"" --include="*.tsx" | cut -d'"' -f2 | sort | uniq -d

# Find ARIA roles
grep -rn "role=\"" --include="*.tsx"

# Check for aria-hidden on focusable elements (invalid)
grep -rn "aria-hidden=\"true\"" --include="*.tsx" | grep -v "tabIndex=\"-1\""
```

**Common ARIA issues:**
- [ ] **No duplicate IDs** - All IDs unique
- [ ] **Valid ARIA roles** - Correct role for component
- [ ] **Required ARIA properties** - role="checkbox" needs aria-checked
- [ ] **ARIA references exist** - aria-describedby points to real ID
- [ ] **No ARIA on wrong elements** - aria-hidden not on focusable

#### 5.2: Name and Role

**Check assistive technology compatibility:**

```bash
# Find custom interactive elements
grep -rn "onClick" --include="*.tsx" | grep "div\|span"

# Check for accessible names
grep -rn "aria-label=\|aria-labelledby=" --include="*.tsx"

# Find live regions
grep -rn "aria-live\|role=\"alert\"\|role=\"status\"" --include="*.tsx"
```

**Check for:**
- [ ] **All elements have accessible names** - Label or aria-label
- [ ] **Custom components have roles** - role="button", etc.
- [ ] **State communicated** - aria-expanded, aria-selected
- [ ] **Dynamic content announced** - aria-live regions

### Step 6: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "accessibility" "docs/audits"

# Option 2: Manual check - list existing accessibility audits
ls docs/audits/accessibility-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/accessibility-audit-NN.md`:

```markdown
# Accessibility Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | Accessibility |
| Framework | [WCAG 2.1 AA] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**WCAG 2.1 AA Compliance:** [Pass/Partial/Fail]

**Critical Issues:** [N]
**High Priority:** [N]
**Medium Priority:** [N]
**Low Priority:** [N]

**Top 3 Accessibility Barriers:**
1. [Most critical issue]
2. [Second most critical]
3. [Third most critical]

---

## WCAG Principle Scores

| Principle | Score | Critical Issues |
|-----------|-------|-----------------|
| Perceivable | [0-100%] | [N] |
| Operable | [0-100%] | [N] |
| Understandable | [0-100%] | [N] |
| Robust | [0-100%] | [N] |

---

## Component Audit

| Component | Keyboard | Focus | ARIA | Color | Grade |
|-----------|----------|-------|------|-------|-------|
| Navigation | Pass | Pass | Pass | Pass | A |
| Modal | Fail | Fail | Pass | Pass | D |
| Form | Pass | Partial | Fail | Pass | C |

---

## Detailed Findings

### Critical (WCAG A/AA Violations)

#### A11Y-C1: [Issue Title]
- **WCAG:** 2.1.1 Keyboard (Level A)
- **Impact:** Users who cannot use a mouse cannot access [feature]
- **Location:** `components/Dropdown.tsx:45`
- **Current Code:**
```tsx
<div onClick={handleOpen}>Open Menu</div>
```
- **Remediation:**
```tsx
<button onClick={handleOpen} aria-expanded={isOpen}>
  Open Menu
</button>
```
- **Testing:** Tab to element, press Enter/Space

### High Priority

[Same format]

### Medium Priority

[Same format]

### Low Priority

[Same format]

---

## Testing Checklist

### Keyboard Testing Results

| Test | Result | Notes |
|------|--------|-------|
| Tab through all elements | [Pass/Fail] | |
| Focus visible at all times | [Pass/Fail] | |
| Logical focus order | [Pass/Fail] | |
| Modal focus trap | [Pass/Fail] | |
| Skip link works | [Pass/Fail] | |
| No keyboard traps | [Pass/Fail] | |

### Screen Reader Testing (Simulated)

| Test | Result | Notes |
|------|--------|-------|
| Page title announced | [Pass/Fail] | |
| Headings navigable | [Pass/Fail] | |
| Links make sense out of context | [Pass/Fail] | |
| Form labels announced | [Pass/Fail] | |
| Error messages announced | [Pass/Fail] | |
| Dynamic content announced | [Pass/Fail] | |

---

## Color Contrast Analysis

| Element | Foreground | Background | Ratio | Required | Status |
|---------|------------|------------|-------|----------|--------|
| Body text | #374151 | #FFFFFF | 10.89:1 | 4.5:1 | Pass |
| Link text | #3B82F6 | #FFFFFF | 4.03:1 | 4.5:1 | **FAIL** |
| Button text | #FFFFFF | #10B981 | 3.12:1 | 4.5:1 | **FAIL** |

---

## ARIA Usage Audit

**Valid ARIA:** [N] / [Total]

| Issue | Count | Impact |
|-------|-------|--------|
| Missing aria-label | [N] | High |
| Invalid aria-describedby reference | [N] | High |
| aria-hidden on focusable | [N] | Critical |
| Missing required ARIA properties | [N] | High |

---

## Prioritized Remediation

### Immediate (Block Deployment)

1. **[A11Y-C1]** Add keyboard support to dropdown
   - Effort: 1 hour
   - Impact: Blocks keyboard users

### This Sprint

1. **[A11Y-H1]** Fix form label associations
   - Effort: 2 hours
   - Impact: Screen reader users can't complete forms

### This Month

1. **[A11Y-M1]** Improve focus indicators
   - Effort: 1 hour
   - Impact: Keyboard users can't track focus

---

## Testing Recommendations

### Automated Testing
- [ ] Add axe-core to CI pipeline
- [ ] Use eslint-plugin-jsx-a11y
- [ ] Run Lighthouse accessibility audits

### Manual Testing
- [ ] Keyboard-only navigation test
- [ ] Screen reader testing (VoiceOver, NVDA)
- [ ] Zoom to 200% test
- [ ] Reduced motion test

### User Testing
- [ ] Test with actual assistive technology users
- [ ] Include users with various disabilities

---

## Metrics

- **Components Audited:** [N]
- **Interactive Elements:** [N]
- **Forms Analyzed:** [N]
- **Images Checked:** [N]
- **Total Issues Found:** [N]

---

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessible Rich Internet Applications (ARIA)](https://www.w3.org/TR/wai-aria-1.2/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Generated by:** Claude Code
**Audit Type:** Accessibility (WCAG 2.1 AA)
**Version:** 4.0.1
```

### Step 7: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "Accessibility" "accessibility-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | Accessibility | [accessibility-audit-NN.md](./accessibility-audit-NN.md) | [Grade] | [N critical WCAG failures] |
```

### Step 8: Report Completion

```
Accessibility Audit Complete

Report saved to: docs/audits/accessibility-audit-NN.md

Summary:
- Grade: C
- WCAG 2.1 AA Compliance: Partial
- Critical: 3 (keyboard, focus, labels)
- High: 8
- Medium: 12
- Low: 5

Principle Scores:
- Perceivable: 75%
- Operable: 60%
- Understandable: 85%
- Robust: 70%

Critical Issues (Fix Immediately):
1. Dropdown not keyboard accessible - Use <button> element
2. Modal has no focus trap - Add focus-trap library
3. Form inputs missing labels - Add htmlFor associations

High Priority:
- Color contrast fails on 4 elements
- Skip link missing
- Focus indicators invisible on custom buttons

Next Steps:
1. Review full report at docs/audits/accessibility-audit-NN.md
2. Fix critical keyboard issues immediately
3. Add axe-core to CI pipeline
4. Test with screen reader
5. Re-run audit after fixes

No changes were made during this audit.
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | WCAG 2.1 AA compliant, keyboard accessible, well-structured |
| B | Minor issues, mostly accessible, good keyboard support |
| C | Some barriers, requires fixes before public launch |
| D | Major barriers, blocks significant user groups |
| F | Critical issues, likely ADA/Section 508 non-compliant |

## Common Accessibility Patterns

### Accessible Button

```tsx
// Full accessible button
<button
  type="button"
  onClick={handleAction}
  aria-pressed={isActive}  // if toggle
  aria-expanded={isOpen}   // if controls expandable
  disabled={isDisabled}
>
  <IconComponent aria-hidden="true" />
  <span>Action Label</span>
</button>
```

### Accessible Modal

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Description of the modal purpose.</p>

  {/* Focus trap wrapper */}
  <FocusTrap>
    <div>{/* Modal content */}</div>
    <button onClick={onClose}>Close</button>
  </FocusTrap>
</div>

{/* Inert background */}
<div aria-hidden="true" inert>{/* Rest of page */}</div>
```

### Accessible Form

```tsx
<form onSubmit={handleSubmit} aria-describedby="form-instructions">
  <p id="form-instructions">All fields marked with * are required.</p>

  <div>
    <label htmlFor="email">
      Email <span aria-hidden="true">*</span>
      <span className="sr-only">(required)</span>
    </label>
    <input
      id="email"
      type="email"
      required
      aria-required="true"
      aria-invalid={!!errors.email}
      aria-describedby={errors.email ? "email-error" : undefined}
      autoComplete="email"
    />
    {errors.email && (
      <p id="email-error" role="alert" className="error">
        {errors.email}
      </p>
    )}
  </div>

  <button type="submit">Submit</button>
</form>
```

### Skip Link

```tsx
// Add at very top of layout
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>

{/* Later in layout */}
<main id="main-content" tabIndex={-1}>
  {/* Main content */}
</main>
```

### Screen Reader Only Class

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project](https://www.a11yproject.com/)
- [Deque University](https://dequeuniversity.com/)
- [WebAIM](https://webaim.org/)

---

**Version:** 4.0.1
