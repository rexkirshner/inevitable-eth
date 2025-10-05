# Command Documentation

This folder contains detailed documentation for slash commands. The commands themselves (in `.claude/commands/`) are kept lean with just execution steps, while comprehensive explanations live here.

## Structure

**Commands** (`.claude/commands/*.md`)
- Brief description
- Execution steps (bash code blocks)
- Links to detailed docs

**Documentation** (`.claude/docs/*.md`)
- When to use
- Philosophy and principles
- Detailed examples
- Error handling strategies
- Success criteria

## Documentation Files

### command-philosophy.md
Core principles that guide all commands:
- Simplicity first
- User approval for destructive actions
- Session continuity
- No broken promises

### save-context-guide.md
Comprehensive guide for `/save-context`:
- When to save
- What gets captured
- Update philosophy
- WIP capture strategies

### review-context-guide.md
Deep dive into `/review-context`:
- Confidence scoring explained
- Verification strategies
- Gap analysis
- Loading context into memory

### code-review-guide.md
Complete code review methodology:
- Review categories
- Grading rubric
- Issue categorization
- "No changes" rule explained

### usage-examples.md
Real-world usage patterns:
- Daily workflow
- New project setup
- Team handoff
- Quality checks

## Checklists

Specialized checklists extracted from commands:
- `.claude/checklists/seo-review.md` - SEO audit checklist
- `.claude/checklists/accessibility.md` - A11Y checklist
- `.claude/checklists/security.md` - Security review checklist

## Benefits

**For Commands:**
- Scannable (200-300 lines max)
- Fast to load
- Easy to execute
- Clear action steps

**For Documentation:**
- Detailed explanations
- Examples and philosophy
- Reusable across commands
- Easy to update independently

## Reading Order

1. Start with `command-philosophy.md` for core principles
2. Read specific guide when learning a command
3. Reference checklists during reviews
4. Consult usage examples for workflows
