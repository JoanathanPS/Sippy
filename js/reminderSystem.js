/**
 * Sippy - Reminder System
 * 5-Tier escalating reminder system
 */

const SippyReminder = {
    reminderInterval: null,
    lastDrink: Date.now(),
    snoozedUntil: null,
    tier: 0,
    
    /**
     * Initialize reminder system
     */
    init() {
        const settings = SippyData.getUserData();
        const frequency = settings.reminderFrequency || SIPPY_CONFIG.reminders.defaultFrequency;
        
        this.startReminders(frequency);
        
        // Request notification permission
        SippyUtils.requestNotificationPermission();
    },
    
    /**
     * Start reminder timer
     */
    startReminders(frequency) {
        if (this.reminderInterval) {
            clearInterval(this.reminderInterval);
        }
        
        // Check every minute
        this.reminderInterval = setInterval(() => {
            this.checkReminder();
        }, 60 * 1000);
        
        // Check immediately
        setTimeout(() => this.checkReminder(), 5000);
    },
    
    /**
     * Check if reminder should trigger
     */
    checkReminder() {
        // Check if snoozed
        if (this.snoozedUntil && Date.now() < this.snoozedUntil) {
            return;
        }
        
        // Check activity tracking
        if (window.SippyActivity && !SippyActivity.isUserActive()) {
            // User is idle, don't remind
            return;
        }
        
        // Check if in meeting
        if (window.SippyActivity && SippyActivity.inMeeting) {
            return;
        }
        
        const settings = SippyData.getUserData();
        if (!settings.enableNotifications) return;
        
        const minutesSinceLastDrink = (Date.now() - this.lastDrink) / (60 * 1000);
        const reminders = SIPPY_CONFIG.reminders;
        
        // Determine tier
        if (minutesSinceLastDrink >= reminders.tier5) {
            this.triggerReminder(5);
        } else if (minutesSinceLastDrink >= reminders.tier4) {
            this.triggerReminder(4);
        } else if (minutesSinceLastDrink >= reminders.tier3) {
            this.triggerReminder(3);
        } else if (minutesSinceLastDrink >= reminders.tier2) {
            this.triggerReminder(2);
        } else if (minutesSinceLastDrink >= reminders.tier1) {
            this.triggerReminder(1);
        }
    },
    
    /**
     * Trigger reminder by tier
     */
    triggerReminder(tier) {
        if (this.tier === tier) return; // Already at this tier
        
        this.tier = tier;
        
        const message = this.getReminderMessage(tier);
        
        switch (tier) {
            case 1:
                // Subtle bubble pulse
                if (window.SippyBubble) {
                    SippyBubble.element.style.animation = 'pulse 1.5s ease-in-out infinite';
                }
                break;
                
            case 2:
                // Ambient sound cue
                const settings = SippyData.getUserData();
                const volume = (settings.soundVolume || 50) / 100;
                SippyUtils.playSound('water-drip', volume * 0.5);
                break;
                
            case 3:
                // Browser notification
                SippyUtils.showNotification('Time to Hydrate! 💧', message);
                if (window.SippyBubble) {
                    SippyBubble.showMessage(message);
                }
                break;
                
            case 4:
                // Bubble grows, mascot appears
                if (window.SippyBubble) {
                    SippyBubble.showMessage(message, 5000);
                    if (window.gsap) {
                        gsap.to(SippyBubble.element, {
                            scale: 1.3,
                            duration: 0.3,
                            yoyo: true,
                            repeat: 1
                        });
                    }
                }
                SippyUtils.playSound('gentle-chime', 0.6);
                break;
                
            case 5:
                // Urgent alert
                SippyUtils.showNotification('⚠️ Hydration Alert!', message);
                if (window.SippyBubble) {
                    SippyBubble.showMessage('⚠️ ' + message, 8000);
                }
                SippyUtils.playSound('urgent-alert', 0.7);
                
                // Lose points for ignoring
                if (window.SippyPoints) {
                    SippyPoints.losePoints(SIPPY_CONFIG.points.ignoreReminder, 'Reminder ignored');
                }
                break;
        }
    },
    
    /**
     * Get reminder message
     */
    getReminderMessage(tier) {
        const messages = [
            "Time for a sip! 💧",
            "Don't forget to hydrate! 💦",
            window.SippyWeather ? SippyWeather.getWeatherMessage() : "Stay hydrated!",
            "You've been working hard! Take a water break 🚰",
            "⚠️ You haven't hydrated in a while! Your health matters!"
        ];
        
        return messages[tier - 1] || messages[0];
    },
    
    /**
     * Reset reminder (after drinking)
     */
    reset() {
        this.lastDrink = Date.now();
        this.tier = 0;
        
        // Reset bubble animation
        if (window.SippyBubble) {
            SippyBubble.element.style.animation = '';
        }
    },
    
    /**
     * Snooze reminders
     */
    snooze(minutes) {
        this.snoozedUntil = Date.now() + (minutes * 60 * 1000);
        this.tier = 0;
        SippyUtils.showToast(`Snoozed for ${minutes} minutes 😴`);
    },
    
    /**
     * Stop reminders
     */
    stop() {
        if (this.reminderInterval) {
            clearInterval(this.reminderInterval);
            this.reminderInterval = null;
        }
    }
};

// Make available globally
window.SippyReminder = SippyReminder;

