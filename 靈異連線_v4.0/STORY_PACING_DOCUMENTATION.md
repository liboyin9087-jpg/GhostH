# Story Pacing & Difficulty System Documentation

## Version 4.0 Feature Update
Date: December 19, 2025

## Overview
This document describes the story pacing improvements and difficulty system added to enhance the narrative flow and user experience of 靈異連線 (Spectral Link).

## Feature 1: Safe Zone System

### Purpose
Provide tension relief after intense moments, preventing player burnout and allowing for better story pacing.

### Implementation

#### Safe Zone Triggers
Safe zones can be activated when:
- Entering certain scenes (e.g., B1 Corridor has 15-second safe zone)
- Completing major objectives
- Using talismans (automatic recovery)

#### Behavior
When in a safe zone:
- Phase changes to "safe"
- VHS intensity drops to 0.05 (minimal effects)
- Pressure automatically reduced by 30 points
- No pressure accumulation from player actions
- Anomaly events suppressed
- Visual feedback: Calmer atmosphere, less distortion

#### Scene Configuration
```typescript
{
  hasSafeZone: true,          // Enable safe zone for this scene
  safeZoneDuration: 15,       // Duration in seconds
  storyBeat: 'intro'          // Narrative position
}
```

## Feature 2: Difficulty System

### Difficulty Levels

#### Easy Mode
**Target Audience**: First-time players, those seeking story over scares

**Modifiers**:
- Pressure Accumulation: 70% of normal (30% slower)
- Safe Zone Duration: 150% of normal (50% longer)
- Jumpscare Probability: 60% of normal (40% reduction)
- Anomaly Frequency: 130% of normal interval (23% less frequent)
- Talisman Effectiveness: 140% of normal (40% stronger)
- Pressure Recovery: 130% of normal (30% faster)

**Experience**: More breathing room, fewer sudden scares, easier to manage pressure

#### Normal Mode
**Target Audience**: Standard horror experience

**Modifiers**: All at 100% (1.0x multipliers)

**Experience**: Balanced tension and relief, as originally designed

#### Hard Mode
**Target Audience**: Experienced players seeking maximum fear

**Modifiers**:
- Pressure Accumulation: 130% of normal (30% faster)
- Safe Zone Duration: 60% of normal (40% shorter)
- Jumpscare Probability: 140% of normal (40% increase)
- Anomaly Frequency: 75% of normal interval (25% more frequent)
- Talisman Effectiveness: 80% of normal (20% weaker)
- Pressure Recovery: 70% of normal (30% slower)

**Experience**: Relentless tension, frequent scares, requires skillful pressure management

### How Difficulty Affects Gameplay

#### Pressure System
```typescript
// Easy: Scan adds +8.4 pressure (12 × 0.7)
// Normal: Scan adds +12 pressure
// Hard: Scan adds +15.6 pressure (12 × 1.3)
```

#### Safe Zones
```typescript
// Easy: 15s safe zone becomes 22.5s
// Normal: 15s safe zone stays 15s
// Hard: 15s safe zone becomes 9s
```

#### Jumpscare Frequency
```typescript
// Easy: 15% base chance becomes 9%
// Normal: 15% base chance stays 15%
// Hard: 15% base chance becomes 21%
```

## Feature 3: Enhanced Haptic Feedback

### New Setting: Auto-Haptic on Scan
When enabled, device vibrates when scanning detects anomalies or paranormal activity.

### Haptic Patterns Available
- **tap**: Light touch (8ms)
- **click**: Standard button (15ms)
- **success**: Two short pulses
- **warning**: Escalating pattern
- **error**: Strong single pulse (100ms)
- **scare**: Jump scare sequence (50-200ms escalation)
- **heartbeat**: Lub-dub pattern
- **ghostNear**: Irregular pulses
- **talismanActivate**: Energy build-up
- **talismanSeal**: Release burst
- **sceneChange**: Transition effect
- **scan**: Continuous pulse

### Integration Points
Haptic feedback triggers on:
- Scanning paranormal hotspots (if autoHapticOnScan enabled)
- Ghost proximity warnings
- Talisman activation/sealing
- Jump scare events
- Scene transitions
- Critical discoveries

## Feature 4: Story Beat System

### Story Structure
The game now follows a classic narrative arc:

#### Title Archive (Intro)
- **Story Beat**: Introduction
- **Safe Zone**: Always safe (tutorial/setup)
- **Purpose**: Set atmosphere, establish lore
- **Danger Level**: 0

#### B1 Corridor (Intro/Rising)
- **Story Beat**: Intro transitioning to rising action
- **Safe Zone**: 15 seconds on entry
- **Purpose**: Ease player into gameplay, teach mechanics
- **Danger Level**: 0.45

#### Nurse Station (Rising Action)
- **Story Beat**: Rising action
- **Safe Zone**: None (maintains tension)
- **Purpose**: Increase stakes, build pressure
- **Danger Level**: 0.65

#### Morgue (Climax)
- **Story Beat**: Climax
- **Safe Zone**: None (maximum tension)
- **Purpose**: Peak horror experience, resolve main conflict
- **Danger Level**: 0.85

### Pacing Design Philosophy
1. **Start Gentle**: Title + B1 safe zone allows orientation
2. **Build Tension**: Nurse station removes safety net
3. **Peak Intensity**: Morgue delivers climactic experience
4. **Reward Mastery**: Hard difficulty for experienced players

## Technical Implementation

### File Structure
```
src/
├── game/
│   ├── difficultyModifiers.ts   # Difficulty calculation utilities
│   └── useHauntDirector.ts      # Updated with safe zone support
├── components/
│   └── SettingsMenu.tsx         # UI for difficulty selection
└── scenesEvents.ts              # Scene metadata with story beats
```

### API Usage

#### Setting Difficulty
```typescript
import { useGameSettings } from './components/SettingsMenu';

const { settings, updateSettings } = useGameSettings();
// settings.difficulty: 'easy' | 'normal' | 'hard'
updateSettings({ difficulty: 'hard' });
```

#### Triggering Safe Zones
```typescript
import { useHauntDirector } from './game/useHauntDirector';

const director = useHauntDirector({ 
  fearLevel, 
  signalStrength, 
  spiritPower,
  difficulty: settings.difficulty 
});

// Trigger safe zone for 15 seconds
director.startSafeZone(15);

// Check if in safe zone
if (director.inSafeZone) {
  // Player is safe, suppress scares
}
```

#### Applying Difficulty Modifiers
```typescript
import { 
  applyDifficultyToPressure,
  applySafeZoneDuration,
  applyJumpscareChance 
} from './game/difficultyModifiers';

const difficulty = settings.difficulty;

// Modify pressure delta
const modifiedPressure = applyDifficultyToPressure(12, difficulty);

// Modify safe zone duration
const safeDuration = applySafeZoneDuration(15, difficulty);

// Modify jumpscare chance
const scareChance = applyJumpscareChance(0.15, difficulty);
```

## User Interface

### Settings Menu Updates
The settings menu now includes:

1. **Difficulty Selection** (top of settings)
   - Three options: 簡單 / 普通 / 困難
   - Descriptive text below showing current difficulty effects
   
2. **Haptic Options**
   - Enable/Disable haptics toggle
   - Auto-haptic on scan toggle (only visible when haptics enabled)

3. **Version Update**
   - Updated to v4.0.0 DEMO

### Visual Indicators
- Safe zone active: Minimal VHS effects, calmer atmosphere
- Difficulty setting: Shown in settings menu with descriptions
- Haptic feedback: Physical vibration on mobile devices

## Performance Impact

### Build Size
- Previous: 207.51 kB (65.44 kB gzipped)
- Current: 208.45 kB (65.75 kB gzipped)
- Increase: +0.94 kB (+0.31 kB gzipped) - negligible

### Runtime Performance
- Difficulty calculations: O(1) lookups
- Safe zone timers: Single setTimeout per activation
- No impact on frame rate or game loop

## Testing Recommendations

### Test Scenarios

1. **Easy Mode Playthrough**
   - Verify extended safe zones
   - Confirm reduced jumpscare frequency
   - Check pressure builds more slowly

2. **Hard Mode Playthrough**
   - Verify shortened safe zones
   - Confirm increased anomaly frequency
   - Check pressure builds rapidly

3. **Safe Zone Transitions**
   - Enter B1 corridor → Verify 15s safe period
   - Confirm pressure reduction on entry
   - Verify VHS effects minimize during safe zone

4. **Haptic Feedback**
   - Enable auto-haptic on scan
   - Scan paranormal hotspot
   - Verify device vibrates (mobile only)

## Future Enhancements

### Potential Additions
1. **Dynamic Difficulty**: Auto-adjust based on player performance
2. **Extended Safe Zones**: Unlockable safe rooms in each scene
3. **Story Mode**: No jumpscares, focus on narrative
4. **Nightmare Mode**: Even harder than hard mode
5. **Custom Difficulty**: Player-adjustable modifiers

### Feedback Integration
The system is designed to be data-driven, making it easy to:
- Adjust multipliers based on player feedback
- Add new difficulty tiers
- Fine-tune safe zone durations
- Modify story beat pacing

## Conclusion

These additions significantly enhance the story pacing and accessibility of 靈異連線 while maintaining its core horror experience. Players can now:
- Choose their preferred intensity level
- Experience well-paced tension and relief cycles
- Enjoy enhanced immersion through haptic feedback
- Progress through a properly structured narrative arc

The modular design ensures future expansions and adjustments can be made easily without disrupting the core game systems.
