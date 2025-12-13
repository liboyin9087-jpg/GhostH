# v2.3 UI/UX Enhanced Pack (Drop-in)

What’s improved (the “most complete” version of the three UI/UX upgrades):

1) LINK_STATUS HUD language
- STABLE: before start (IntroOverlay)
- UNSTABLE: normal countdown
- BREACH: scripted ghost message window (2–4s random)
- CURSED: tab switch punishment (3s)
- CHANNEL_OPEN: timeLeft === 0

2) Punishment is now a readable warning, not a full-screen block
- Red wash kept but reduced intensity
- Central “security console” modal
- Explicit reason: TAB SWITCH DETECTED — TIMER RESET

3) CRT noise feels alive (smooth + micro-jitter)
- Smooth easing towards target intensity (no sudden jumps)
- During BREACH, intensity jitters subtly ±0.03 to mimic signal instability
- Jitter is disabled during CURSED and CHANNEL_OPEN to avoid chaos

How to integrate:
- Use GhostAppExample.tsx as reference.
- Ensure tailwind animations exist: animate-text-shiver, animate-burn, etc.
- Place your sound files in public/sounds (or change SOUND_PATHS).