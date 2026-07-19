---
name: skill-creator
description: "Use when creating new skills, improving existing skills, or when user asks 'create a skill', 'make a skill', 'skill development', 'skill format'"
---

# Skill Creator - Build Claude Code Skills

## When to Use
- User asks to create a new skill
- Improving existing skills
- Skill format questions
- Skill structure guidance

## Portuguese Triggers
- "criar skill"
- "desenvolver skill"
- "skill para [tema]"
- "como fazer skill"

## Skill Structure

### Required Files
```
skill-name/
├── SKILL.md          # Main skill file
├── .skills/          # Optional subdirectories
│   └── scripts/      # Optional scripts
└── README.md         # Optional documentation
```

### SKILL.md Frontmatter
```markdown
---
name: [skill-name-slug]
description: "Use when [situation]. Triggers: 'trigger1', 'trigger2'"
---
```

### Content Sections
```markdown
# [Skill Name]

## When to Use
[When this skill activates]

## Portuguese Triggers
[List of Portuguese phrases that trigger this skill]

## [Main Section]
[Content with examples]

## CLI Commands
[If applicable]
```bash
[specific command]
```

## Related Skills
[Other skills that complement this one]
```

## Skill Quality Checklist

### Must Have
- [ ] Clear frontmatter (name + triggers)
- [ ] When to Use section
- [ ] At least one complete example
- [ ] Related skills list

### Should Have
- [ ] Portuguese triggers
- [ ] CLI commands if applicable
- [ ] Edge cases handled
- [ ] Error handling guidance

### Good to Have
- [ ] Visual aids/diagrams
- [ ] Alternative approaches
- [ ] Anti-patterns section
- [ ] Performance notes

## Progressive Disclosure Rule

### Structure Content by Complexity
```
1. Quick reference (most common case)
2. Basic usage
3. Intermediate variations
4. Advanced / edge cases
```

## Example: Creating a Simple Skill

```markdown
---
name: my-new-skill
description: "Use when [specific situation]. Triggers: 'trigger phrase'"
---

# My New Skill

## When to Use
[Explain when this skill should activate]

## Portuguese Triggers
- "[situation]"

## Basic Usage
[Simple example]

## Advanced
[More complex variations]

## Related Skills
- existing-skill: [how it relates]
```

## Skill Review Criteria

### 1. Does it have clear triggers?
- User knows when to invoke
- Claude knows when to activate

### 2. Is content actionable?
- Specific steps
- Real examples
- Verifiable outcomes

### 3. Is Portuguese included?
- Brazilian Portuguese context
- Localized examples

### 4. Does it follow conventions?
- Frontmatter format
- Section structure
- Naming convention

## Related Skills
- skill-writer: Writing skills
- skill-check: Validating skills
- skill-developer: Full skill development guide