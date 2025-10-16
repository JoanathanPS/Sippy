/**
 * Sippy - Constants and Configuration
 * Chennai-focused hydration companion
 */

const SIPPY_CONFIG = {
    // Chennai Location
    location: {
        name: 'Chennai',
        lat: 13.0827,
        lon: 80.2707,
        timezone: 'Asia/Kolkata'
    },
    
    // OpenWeather API (User should add their own key)
    weather: {
        apiKey: 'YOUR_OPENWEATHER_API_KEY', // Users need to get their own free key from openweathermap.org
        updateInterval: 30 * 60 * 1000, // 30 minutes
        fallbackTemp: 30, // Default Chennai temperature in Celsius
        fallbackHumidity: 70
    },
    
    // Hydration Calculation
    hydration: {
        baseMultiplier: 35, // ml per kg body weight
        tempFactor: 0.5, // Additional ml per degree Celsius
        humidityFactor: 0.1, // Additional ml per humidity percentage
        minGoal: 1500, // Minimum daily goal in ml
        maxGoal: 5000, // Maximum daily goal in ml
        defaultWeight: 70 // Default weight in kg
    },
    
    // Reminder System (in minutes)
    reminders: {
        tier1: 20, // Subtle bubble pulse
        tier2: 35, // Ambient sound cue
        tier3: 50, // Browser notification
        tier4: 65, // Bubble grows, mascot appears
        tier5: 80, // Urgent alert
        defaultFrequency: 45,
        snoozeOptions: [5, 10, 15]
    },
    
    // Points System
    points: {
        drinkOnTime: 10,
        dailyGoal: 50,
        streakDaily: 5,
        memoryGame: 20,
        perfectWeek: 100,
        ignoreReminder: -5,
        breakStreak: -20
    },
    
    // Bubble States
    bubbleStates: {
        hydrated: { min: 80, emoji: '😊', class: 'state-hydrated' },
        good: { min: 60, emoji: '🙂', class: 'state-good' },
        moderate: { min: 40, emoji: '😐', class: 'state-moderate' },
        dehydrated: { min: 20, emoji: '😟', class: 'state-dehydrated' },
        critical: { min: 0, emoji: '😰', class: 'state-critical' }
    },
    
    // Achievements
    achievements: [
        { id: 'first-drop', name: 'First Drop', desc: 'Log your first glass', icon: '💧', points: 0 },
        { id: 'week-warrior', name: 'Week Warrior', desc: '7-day streak', icon: '🔥', points: 7 },
        { id: 'month-master', name: 'Month Master', desc: '30-day streak', icon: '👑', points: 30 },
        { id: 'perfect-day', name: 'Perfect Day', desc: 'Hit 100% goal', icon: '🎯', points: 0 },
        { id: 'chennai-survivor', name: 'Chennai Summer Survivor', desc: 'Stay hydrated in 35°C+', icon: '🔥', points: 0 },
        { id: 'early-bird', name: 'Early Bird', desc: 'Drink before 8 AM', icon: '🌅', points: 0 },
        { id: 'night-owl', name: 'Night Owl', desc: 'Drink after 10 PM', icon: '🌙', points: 0 },
        { id: 'streak-7', name: '7-Day Champion', desc: '7 days streak', icon: '🏅', points: 7 },
        { id: 'streak-30', name: '30-Day Champion', desc: '30 days streak', icon: '🏆', points: 30 },
        { id: 'streak-100', name: '100-Day Legend', desc: '100 days streak', icon: '👑', points: 100 },
        { id: 'hydration-hero', name: 'Hydration Hero', desc: 'Log 50 drinks', icon: '🦸', points: 0 },
        { id: 'memory-master', name: 'Memory Master', desc: 'Win 10 memory games', icon: '🧠', points: 0 },
        { id: 'points-100', name: 'Century', desc: 'Earn 100 points', icon: '💯', points: 100 },
        { id: 'points-500', name: 'Points Champion', desc: 'Earn 500 points', icon: '⭐', points: 500 },
        { id: 'points-1000', name: 'Points Legend', desc: 'Earn 1000 points', icon: '🌟', points: 1000 }
    ],
    
    // Themes
    themes: ['ocean', 'forest', 'sunset', 'midnight', 'chennai'],
    
    // Motivational Messages (Chennai-focused)
    messages: {
        morning: [
            "Good morning! Chennai's heating up. Let's hydrate! ☀️",
            "Rise and shine! Start your day with a glass of water 💧",
            "Morning in Chennai! Time for your first sip 🌅"
        ],
        afternoon: [
            "Chennai heat is at its peak! Drink up! 🔥",
            "Midday hydration check! How are you doing? 💧",
            "Traffic was rough, right? Refresh with water! 🚗"
        ],
        evening: [
            "Evening in Chennai! Don't forget to hydrate 🌆",
            "Winding down? Keep that water bottle close! 💧",
            "Marina Beach sunset time! But first, hydrate! 🌊"
        ],
        milestone: [
            "You're crushing it! 💪",
            "Hydration hero! Keep going! 🦸",
            "Amazing progress! You're on fire! 🔥",
            "{streak} days strong! You're unstoppable! 💎"
        ],
        encouragement: [
            "Your body will thank you! 💙",
            "Stay hydrated, stay focused! 🎯",
            "One sip at a time! You got this! 💪",
            "Sippy is proud of you! 😊"
        ],
        weather: [
            "It's {temp}°C in Chennai - hydrate more! 🌞",
            "High humidity today! Drink extra water! 💦",
            "Chennai summer is tough. You're tougher! 🔥",
            "Perfect weather for staying hydrated! ⛅"
        ]
    },
    
    // Storage Keys
    storage: {
        userData: 'sippy_user_data',
        hydrationLog: 'sippy_hydration_log',
        settings: 'sippy_settings',
        achievements: 'sippy_achievements',
        stats: 'sippy_stats',
        lastWeatherUpdate: 'sippy_last_weather',
        weatherCache: 'sippy_weather_cache'
    },
    
    // Default Settings
    defaultSettings: {
        name: '',
        weight: 70,
        reminderFrequency: 45,
        soundVolume: 50,
        enableNotifications: true,
        enableActivityTracking: true,
        theme: 'ocean',
        bubbleSize: 'medium',
        language: 'en'
    }
};

// Seasonal adjustments for Chennai
const CHENNAI_SEASONS = {
    summer: { months: [3, 4, 5], goalAdjustment: 1.25 }, // Apr-Jun: +25%
    monsoon: { months: [9, 10, 11], goalAdjustment: 0.9 } // Oct-Dec: -10%
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SIPPY_CONFIG, CHENNAI_SEASONS };
}

