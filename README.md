# Sippy — Your Living Hydration Companion

Sippy is a privacy-first, Chennai‑aware hydration web app. No login. Always-on bubble widget with live points and motivational nudges. Works offline as a PWA.

## Quick start

1. Open `index.html` in a modern browser, or run a static server:
   - Python: `python -m http.server 5500`
   - Node: `npx http-server -p 5500`
2. Allow notifications when prompted.
3. Enter weight and start logging water.

## Features
- Floating bubble widget (live points, animations, quick log)
- Smart reminders (tiered + contextual to Chennai weather)
- Daily goal auto-calculated (Celsius, IST)
- Streaks, achievements, PDF progress report
- 100% local storage (IndexedDB/LocalStorage), PWA offline

## Weather setup (optional)
Set your OpenWeather API key in `js/constants.js`:
- Replace `YOUR_OPENWEATHER_API_KEY` with your key (free tier works)

## Tech
Vanilla HTML/CSS/JS, GSAP, Howler.js, Chart.js, Web Notifications, Service Worker.
