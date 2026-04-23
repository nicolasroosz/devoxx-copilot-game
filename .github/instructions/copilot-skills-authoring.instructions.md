---
description: 'Guide for creating domain-specific Copilot skills (e.g., Phaser 4, React, tooling) with structured SKILL.md files.'
applyTo: '**/.github/skills/*/SKILL.md'
---

# Copilot Skills Authoring

Guide for writing focused, reusable skill files that teach Copilot about domain-specific patterns, libraries, or workflows.

## SKILL.md Structure and Frontmatter

Every skill file should follow this structure:

```markdown
---
name: 'Skill Name'
description: 'One-sentence purpose of this skill'
keywords: ['tag1', 'tag2', 'tag3']
references:
  - title: 'Resource Title'
    url: 'https://example.com'
  - path: 'src/path/to/example'
---

# Skill Name

[Content structured below...]
```

### Frontmatter Fields

- **name**: Display name for the skill (max 50 chars)
- **description**: Single sentence describing what the skill teaches
- **keywords**: 3-5 tags for discovery (e.g., 'phaser', 'graphics', 'rendering')
- **references**: Mix of external URLs and repository examples
  - External: Use `title` + `url` for official docs or tutorials
  - Internal: Use `path` for concrete code examples in the project

**Example**:
```yaml
---
name: 'Particle Effects in Phaser 4'
description: 'Create and configure particle emitters for explosions, fire, smoke, and visual effects.'
keywords: ['particles', 'emitter', 'effects', 'animation']
references:
  - title: 'Phaser 4 ParticleEmitter Docs'
    url: 'https://newdocs.phaser.io/docs/latest/Phaser.GameObjects.ParticleEmitter'
  - path: 'src/scenes/effects/particle-emitter.example.ts'
---
```

## Content Sections

### 1. Overview

- One paragraph stating the purpose and scope
- When to use this skill (e.g., "Use when creating visual effects...")
- What problem it solves

**Example**: "Particle effects add visual feedback and polish to games. Use this skill when you need explosions, smoke trails, rain, or other dynamic effects composed of many small moving objects."

### 2. Core Concept

- Explain the main idea in 2-3 sentences
- Use a simple diagram or ASCII chart if helpful
- Link to the reference docs

**Example**:
```
## Core Concept

Particle effects in Phaser 4 use an emitter that spawns many small particles. 
Each particle follows physics (gravity, velocity, lifespan) and visual rules (texture, tint, alpha). 
The emitter manages the lifecycle—creation, animation, and cleanup.
```

### 3. Common Patterns (2-4 patterns)

For each pattern, show:
- **Name**: What this pattern does
- **When to use**: Specific scenario
- **Code example**: Runnable snippet (40-60 lines max)
- **Key points**: 3-4 bullets on what makes it work

**Pattern template**:
```markdown
### Pattern: [Name]

**When to use**: [Scenario where this pattern applies]

**Example**:
\`\`\`typescript
// Code showing the pattern in action
\`\`\`

**Key points**:
- Point 1 about how the pattern works
- Point 2: common mistake to avoid
- Point 3: how to customize for your use case
```

### 4. Advanced / Edge Cases (optional)

If there are non-obvious uses or gotchas, add a section:

- **When to break the pattern**: Legitimate exceptions
- **Performance considerations**: If relevant (e.g., number of particles, update frequency)
- **Debugging tips**: Common issues and how to diagnose them

**Example**:
```markdown
## Advanced: Large Particle Counts

For effects with >1000 particles, consider:
- Pooling emitters to reuse them
- Reducing update frequency with `active: false`
- Using sprite atlases to reduce draw calls
```

### 5. References and Related Skills

- Link to Phaser docs (via frontmatter references)
- Mention related skills (e.g., "See Animation Skill for frame-based effects")
- Point to code examples in `references` directory

## File Organization

### Placeholder vs Full Scaffolding

Choose based on maturity:

**Placeholder skill** (minimal, starter template):
- Use for new or experimental skills
- Include core concept + 1-2 basic patterns
- Mark gaps with `[TODO: Add X pattern]`
- Target size: 1-2 KB

**Full skill** (comprehensive, ready for reuse):
- Use for battle-tested, widely needed skills
- Include 3-4 common patterns + edge cases
- Well-sourced with reference links
- Target size: 3-5 KB

**Example TODO placeholder**:
```markdown
## Additional Patterns

[TODO: Add pattern for stateful particles (health bars, name tags)]
[TODO: Add performance optimization guide for 1000+ particles]
```

## Phaser 4 Skill Content Patterns

For Phaser 4-specific skills, follow this structure:

### 1. API Overview

Show the main Phaser 4 class/component:

```typescript
// Phaser 4 API signature (simplified)
const emitter = this.add.particles(textureKey, {
  speed: { min: -200, max: 200 },
  gravityY: 300,
  lifespan: 1000,
  emitZone: { type: 'circle', source: new Phaser.Geom.Circle(0, 0, 50) }
});
```

### 2. Scene Integration

Show how the skill fits into the scene lifecycle:

```typescript
// In your Scene's create()
const emitter = this.add.particles(...)
  .createEmitter({ ... })
  .emitParticles(10);

// In update()
emitter.killAll();
```

### 3. Real-World Example

Provide a mini-scene or component showing the skill in practice:

- Size: 50-80 lines of runnable code
- Include setup, usage, and cleanup
- Show event binding if applicable (e.g., emitting on collision)

**Example**:
```typescript
// Explosion effect on collision
scene.physics.add.overlap(projectile, enemy, () => {
  const emitter = scene.add.particles('smoke')
    .createEmitter({ speed: 100, gravityY: -200, lifespan: 800 });
  emitter.emitParticles(20, projectile.x, projectile.y);
  projectile.destroy();
});
```

## Linking to Reference Code

When referencing examples in the repository:

- Use relative paths: `src/scenes/effects/particle-emitter.example.ts`
- Keep examples small and focused (one skill per file)
- Add comments explaining what the skill demonstrates
- Keep examples updated when API changes occur

## Skill Discoverability

Each skill should be discoverable in two ways:

1. **By name**: Obvious in the filename and title
2. **By keyword**: Listed in frontmatter keywords
   - Use words a developer would search for
   - Include both nouns and actions (e.g., "particle", "emit", "effect")

**Example keywords for particle skill**:
```yaml
keywords: ['particles', 'emitter', 'effects', 'explosion', 'animation', 'visual']
```

## Markdown Economy

Skills should be concise and scannable; follow these guidelines to keep them efficient:

- **File size targets**: Aim for 1-2 KB for starter skills, 3-5 KB for comprehensive skills; split if exceeding 5 KB
- **Use structured sections**: Replace narrative prose with code examples, bullet points, and tables
- **Link for references**: Use frontmatter `references` to link to external docs and internal examples rather than duplicating content
- **Minimize redundancy**: Do not repeat content from other skills or documentation; link instead

See `.github/markdown-economy.md` for the full guide on context efficiency.

## Maintenance and Evolution

- Review annually for Phaser version compatibility
- Update examples when API or best practices change
- Track skill usage; consolidate skills that are never referenced
- Expand patterns when new use cases emerge
- Split skills that exceed 5 KB into substills
