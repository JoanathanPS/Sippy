<!-- 7e2e9cf2-7ef0-4f41-9acb-5bdb8355cccd 0b155ac2-0c53-4496-a1b6-761c61e67819 -->
# Sippy - Your Living Hydration Companion

## Core Philosophy

**No Login. No Authentication. Just Start Using.**

- Guest user mode by default - instant access
- All data stored locally (IndexedDB + LocalStorage)
- Optional: User can set a nickname for personalization
- Privacy-first: No servers, no tracking, no accounts

**The Bubble is the Star** 🫧

- The floating bubble widget is the MAIN feature
- It's alive, reactive, and brings ENERGY to the user
- Shows points, animations, and motivational moments
- Designed to awaken the user during long desk work sessions

## Product Specifications

**Type:** Publishing-ready web application (alive, not a demo)

**Target Market:** Chennai, India (expandable)

**Standards:** Indian (Celsius, IST timezone)

**Design Theme:** Clean blue water aesthetic

- Primary: #0077BE (Deep Ocean Blue)
- Accent: #4FC3F7 (Sky Blue)
- Light: #E3F2FD (Ice Blue)
- Success: #00BCD4 (Cyan)
- Energy: #FF6B6B (For enthusiastic moments)

## Tech Stack

- **Frontend:** Vanilla HTML5/CSS3/ES6+ JavaScript
- **Data:** IndexedDB (primary) + LocalStorage (fallback)
- **APIs:** OpenWeather API (Chennai: 13.0827°N, 80.2707°E)
- **Animation:** GSAP 3.x for smooth 60fps animations
- **Audio:** Howler.js for motivational sounds
- **PWA:** Full offline support
- **No build tools:** Direct browser deployment

## Core Features

### 1. **THE BUBBLE** - Main Hero Feature (`components/bubbleWidget.js`)

**Always Visible, Always Alive:**

- Floats on screen while user works (draggable, stays on top)
- Magnetic snap to screen edges, smooth physics
- **NEVER BORING** - constantly animated with personality

**5 Hydration States (Visual Feedback):**

1. **Fully Hydrated:** Clear sparkly blue, gentle breathing animation, happy face
2. **Good:** Light blue with soft ripples, content expression
3. **Moderate:** Blue-orange gradient, stronger pulse, concerned look
4. **Dehydrated:** Orange-red, urgent shake animation, worried face
5. **Critical:** Red glow, attention-grabbing bounce, desperate expression

**Interactive & Alive:**

- Hover near it → ripple effects and eye-tracking
- Click → Quick actions menu (log water, view stats, snooze)
- Responds to user activity:
  - Working hard → cheers you on
  - Idle too long → gentle nudge
  - Just drank water → celebrates! 🎉
- Proximity awareness (reacts when mouse gets close)

**Point System Integration (THE KEY FEATURE):**

- **Shows live points counter on the bubble itself**
- Points animate UP when earned (+10, +50 flash animation)
- Points flash DOWN when lost (-5 warning shake)
- Bubble gets MORE ENERGETIC as you earn points
- Special celebratory explosion animation at milestones (100, 500, 1000 points)

**Motivational Moments:**

- Random enthusiastic messages pop from bubble:
  - "You're crushing it! 💪"
  - "Stay hydrated, stay focused!"
  - "Chennai heat = 31°C! Drink up! 🔥"
  - "10 glasses today! You're a hydration hero!"
- Motivational sounds (gentle chime, celebration sound)
- Mini-animations: confetti burst, sparkle trail, victory dance

**Gamification Visual Feedback:**

- Progress ring around bubble shows daily goal
- Color shifts based on performance
- Unlocked themes change bubble appearance
- Unlocked skins immediately visible on bubble

### 2. Activity Tracker (`js/activityTracker.js`)

**Monitors User Without Being Creepy:**

- Mouse movement tracking (velocity, patterns)
- Keyboard activity (typing speed, pauses)
- Scroll behavior (engagement level)
- Tab visibility (meeting detection)
- Idle time calculation
- Focus pattern analysis
- All processing happens locally, no external reporting

**Smart Features:**

- Detects when user is in "deep work" mode → gentle reminders
- Detects stress (rapid typing) → calming messages
- Detects meetings (tab inactive + muted) → postpone reminders
- Detects break time → encouragement to hydrate

### 3. Hydration Engine (`js/hydrationEngine.js`)

**Smart Chennai-Adjusted Formula:**

```
Daily Goal (ml) = (Weight_kg × 35) + (Temp_C / 2) + (Humidity × 0.1)
```

**Features:**

- Real-time goal calculation based on Chennai weather
- Summer boost (Apr-Jun): +25% to goal
- Monsoon adjustment (Oct-Dec): -10% from goal
- One-tap water logging: 50ml, 100ml, 250ml, 500ml, custom
- Tracks beverage types: water, juice, tea, coffee
- Streak counter (resets at midnight IST)
- Weekly/monthly analytics
- Dehydration risk scoring
- Historical comparison

### 4. Reminder System (`js/reminderSystem.js`)

**5-Tier Escalating Reminders:**

1. **20 min:** Bubble starts gentle pulse
2. **35 min:** Soft water drop sound + bubble animation
3. **50 min:** Browser notification with Chennai weather context
4. **65 min:** Bubble grows larger, mascot appears with message
5. **80+ min:** Full attention mode - bubble bounces urgently, health warning

**Smart Contextual Messages:**

- "It's 34°C in Chennai - your body needs more water! 🌞"
- "Focus session detected - quick water break boosts memory!"
- "You've been typing for 2 hours. Sip + stretch! 💧"
- "Traffic was bad today, right? Hydrate the stress away 🚗"

**Smart Postponement:**

- Meeting detected → auto-snooze
- Snooze options: 5, 10, 15 minutes
- DND schedule (user-configurable work hours)

### 5. Point System - Focus Economy (`js/focusEconomy.js`)

**THE BUBBLE SHOWS EVERYTHING LIVE:**

**Earn Points (Animated on Bubble):**

- Drink on time: **+10 points** (bubble sparkles)
- Hit daily goal: **+50 points** (bubble celebrates)
- Maintain streak: **+5 × streak days** (bubble glows)
- Memory game win: **+20 points** (bubble dances)
- Perfect week: **+100 points** (confetti explosion)

**Lose Points (Bubble reacts sadly):**

- Ignore reminder: **-5 points** (bubble shakes, worried face)
- Break streak: **-20 points** (bubble dims)

**Unlockables (Visible Progress on Bubble):**

- **Themes (5):** Ocean Breeze, Forest, Sunset, Midnight, Chennai Marina
- **Sounds (6):** Rain, Waves, Stream, Cafe, Birds, Silence
- **Bubble Skins (10):** Classic, Galaxy, Fire, Ice, Rainbow, Gold, Crystal, Neon, Marble, Chennai Flora
- **Mascot Moods (8):** Different expressions and accessories

**Achievement Badges (25+):**

- First Drop, Week Warrior, Month Master
- Perfect Day, Chennai Summer Survivor
- Streak Champion (7, 30, 100 days)
- Hydration Hero, Memory Master, Early Bird
- *Each achievement triggers special bubble celebration*

### 6. Main Dashboard (`index.html`)

**Clean, Modern Interface:**

- Large circular progress ring (animated SVG)
- Quick water logging buttons (50, 100, 250, 500ml)
- Daily timeline with all drinks logged
- Stats cards:
  - Today's progress percentage
  - Current streak
  - Weekly average
  - Live Chennai weather
- 7-day line chart
- Hourly intake bar chart
- Goal adjuster slider
- Current points display with leaderboard feel
- "View My Report" button

**Guest User Welcome:**

- First visit: "Welcome! Let's start tracking your hydration 💧"
- Optional: "What should we call you?" (nickname input, skippable)
- No passwords, no emails, just start using

### 7. Animated Mascot "Sippy" (`components/mascot.js`)

**SVG Water Drop Character:**

- 8 emotion states: happy, excited, worried, tired, celebrating, sleeping, thinking, urgent
- Appears in bubble during important moments
- Smooth GSAP transitions
- Idle breathing animation
- Speech bubbles with contextual messages
- Unlockable accessories (hat, sunglasses, scarf)
- Click interactions (pet, high-five triggers animation)

### 8. Conversational Interface (`components/chatInterface.js`)

**Friendly, Encouraging Personality:**

- 150+ message templates
- Variables: {name}, {time}, {weather}, {streak}, {points}
- Categories:
  - Morning greetings with Chennai weather
  - Milestone celebrations
  - Gentle hydration nudges
  - Health tips
  - Chennai-specific references
- Typing animation effect
- Quick action buttons (Drink Now, Snooze, Stats)

### 9. Hydra-Memory Mini-Game (`js/memoryTest.js`)

**Optional Cognitive Test:**

- Shows random word (Tamil/English mix)
- Tests recall after 4 hours
- Multiple choice validation
- Correlates performance with hydration
- Insights: "Your memory is 18% better when hydrated!"
- Earns +20 points for correct answers
- Can be disabled in settings

### 10. Weather Service (`js/weatherService.js`)

**Chennai Live Weather:**

- Hardcoded location: 13.0827°N, 80.2707°E
- Fetches temperature, humidity, UV index
- Updates every 30 minutes
- Heat wave alerts
- Adjusts hydration goals automatically
- Contextual messages in reminders
- Fallback to cached data if offline

### 11. Settings Panel (`components/settings.js`)

**Simple Configuration:**

- **Profile:** Nickname (optional), Weight (kg), Age
- **Hydration:** Manual goal override, preferred container sizes
- **Reminders:** Frequency (20-120 min), sound volume, DND schedule
- **Appearance:** Theme picker, bubble size, animation speed
- **Privacy:** Toggle tracking features, export data, wipe all data
- **Language:** English/Tamil (extensible)

### 12. Privacy Dashboard (`components/privacyDashboard.js`)

**Transparency:**

- Shows what data is collected (all local)
- Storage usage display
- Activity log (last 100 events)
- One-click export (JSON format)
- One-click complete wipe
- Privacy policy (simple, readable)

### 13. PDF Report Generator (`js/pdfGenerator.js`)

**User's Happy Report:**

- Simple 1-page beautiful summary
- "Great job! You drank 12 glasses today! 🎉"
- Visual weekly chart
- Current streak: X days
- Total liters this week/month
- Motivational message: "You're doing amazing!"
- Fun stat: "You avoided 5 dehydration headaches!"
- Clean blue design, friendly tone
- Download as "My_Hydration_Report.pdf"
- Button in dashboard: "View My Progress"

### 14. PWA Configuration (`manifest.json`, `service-worker.js`)

**Installable App:**

- Works offline
- Add to home screen (mobile/desktop)
- Custom app icon
- Splash screen
- Background sync for weather
- Push notifications (optional)
- Chennai-themed branding colors

## File Structure

```
Sippy/
├── index.html                      # Main app
├── README.md                       
├── manifest.json                   # PWA config
├── service-worker.js               # Offline support
├── css/
│   ├── main.css                    # Core styles
│   ├── themes.css                  # 5 themes
│   ├── animations.css              # GSAP animations
│   ├── components.css              
│   └── responsive.css              
├── js/
│   ├── app.js                      # Init
│   ├── activityTracker.js          
│   ├── hydrationEngine.js          
│   ├── reminderSystem.js           
│   ├── weatherService.js           # Chennai weather
│   ├── focusEconomy.js             # Points system
│   ├── memoryTest.js               
│   ├── dataManager.js              # IndexedDB
│   ├── pdfGenerator.js             # User report
│   ├── utils.js                    
│   └── constants.js                # Chennai defaults
├── components/
│   ├── bubbleWidget.js             # ⭐ MAIN FEATURE
│   ├── chatInterface.js            
│   ├── mascot.js                   # Sippy
│   ├── privacyDashboard.js         
│   ├── settings.js                 
│   ├── dashboard.js                
│   ├── charts.js                   
│   └── notifications.js            
├── assets/
│   ├── sounds/
│   │   ├── water-drip.mp3
│   │   ├── celebration.mp3
│   │   ├── gentle-chime.mp3
│   │   └── ambient/
│   ├── images/
│   │   ├── mascot/                 # Sippy states
│   │   ├── badges/                 # Achievement icons
│   │   └── icons/                  
│   └── icons/
│       ├── favicon.ico
│       └── [PWA icons]
└── lib/
    ├── gsap.min.js                 
    ├── howler.min.js               
    ├── jspdf.min.js                
    └── chart.min.js                # For PDF charts
```

## Key Differentiators

✅ **No Login Required** - Instant access, guest user by default

✅ **The Bubble is Alive** - Main feature, always visible, reactive, energetic

✅ **Live Point System** - Points displayed and animated on bubble in real-time

✅ **Motivational Moments** - Enthusiastic celebrations trigger dopamine

✅ **Chennai-Specific** - Weather-aware, local references, IST timezone

✅ **Privacy-First** - All data local, no servers, transparent controls

✅ **Production-Ready** - Not a demo, fully functional, polished

## Implementation Focus

**Priority 1 - The Bubble (MAIN ATTRACTION):**

- Floating widget with all 5 states
- Live point counter integration
- Celebration animations
- Interactive click actions
- Proximity reactions
- Always-on-top positioning

**Priority 2 - Core Functionality:**

- Water intake logging
- Chennai weather integration
- Smart reminder system
- Activity tracking
- Point earning/losing logic

**Priority 3 - Engagement:**

- Motivational messages
- Achievement system
- Theme unlocking
- Mascot animations
- Sound effects

**Priority 4 - Polish:**

- Settings panel
- Privacy controls
- PDF report generation
- PWA configuration
- Mobile responsiveness

## Success Metrics

✅ Bubble is mesmerizing and alive

✅ Points system feels rewarding (dopamine hits)

✅ No friction to start (no login)

✅ Chennai weather integration works

✅ Motivational moments feel genuine

✅ All animations smooth (60fps)

✅ Works offline perfectly

✅ Mobile responsive

✅ Production-quality code

This is a **living, breathing hydration companion** that makes desk work more energetic and healthy!

### To-dos

- [ ] Create project structure with all folders and base HTML/CSS files
- [ ] Build activity tracking module with mouse/keyboard monitoring and focus detection
- [ ] Implement hydration calculator, intake logger, and goal tracking system
- [ ] Create floating bubble widget with draggable functionality and state animations
- [ ] Build hybrid reminder system with notifications, sounds, and contextual messages
- [ ] Integrate OpenWeather API for context-aware hydration adjustments
- [ ] Build main dashboard UI with progress bars, logs, and statistics
- [ ] Implement Focus Economy points system with unlockables and themes
- [ ] Create animated mascot and conversational chat interface
- [ ] Build Hydra-Memory mini-game for focus testing
- [ ] Create privacy dashboard and settings panel with data controls
- [ ] Implement PDF generation feature for hackathon documentation
- [ ] Add GSAP animations, sound effects, and final UI polish
- [ ] Write README with setup instructions, screenshots, and feature descriptions