---
name: animations
description: 'Use this skill when creating or controlling sprite animations in Phaser 4. Covers AnimationManager vs AnimationState, spritesheet and atlas setup, playback, chaining, reverse, events, and frame callbacks. Triggers on: sprite animation, spritesheet, play animation, animationcomplete.'
---

# Phaser 4 -- Sprite Animations

## When to Use
- Create global animations with `this.anims.create()`.
- Play, pause, stop, chain, or reverse animations on a sprite.
- Respond to animation events such as start, repeat, complete, or stop.
- Work with spritesheets, atlases, or Aseprite exports.

## Core Concepts
- `this.anims` manages global animation definitions shared across scenes.
- `sprite.anims` controls playback on one sprite instance.
- Prefer global animations for reusable motion and local animation state for per-sprite control.

## Common Patterns
- Load sprite sheets or atlases before creating animations.
- Use `this.anims.generateFrameNumbers()` for spritesheets.
- Use `this.anims.generateFrameNames()` for atlases.
- Use `sprite.play()` for the standard playback path.
- Use `sprite.chain()` when one animation should follow another.
- Use `sprite.playReverse()` or `sprite.anims.reverse()` for reverse playback.

## Completion Checks
- Confirm the animation key exists before creating it again.
- Verify the sprite is using the expected global or local animation source.
- Check that event handlers use the correct callback signature.
- Prefer the simplest playback config that matches the behavior.
