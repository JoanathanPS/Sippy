/**
 * Sippy - Hydration Engine
 * Smart Chennai-adjusted hydration calculations
 */

const SippyHydration = {
    currentGoal: 2000,
    currentIntake: 0,
    lastReminderTime: Date.now(),
    
    /**
     * Initialize hydration engine
     */
    init() {
        this.calculateDailyGoal();
        this.updateCurrentIntake();
        this.checkStreak();
    },
    
    /**
     * Calculate daily hydration goal
     * Formula: (Weight × 35) + (Temp / 2) + (Humidity × 0.1)
     */
    calculateDailyGoal() {
        const userData = SippyData.getUserData();
        const weight = userData.weight || SIPPY_CONFIG.hydration.defaultWeight;
        
        // Get weather data
        const weather = SippyData.get(SIPPY_CONFIG.storage.weatherCache);
        const temp = weather.temp || SIPPY_CONFIG.weather.fallbackTemp;
        const humidity = weather.humidity || SIPPY_CONFIG.weather.fallbackHumidity;
        
        // Base calculation
        let goal = (weight * SIPPY_CONFIG.hydration.baseMultiplier) + 
                   (temp * SIPPY_CONFIG.hydration.tempFactor) + 
                   (humidity * SIPPY_CONFIG.hydration.humidityFactor);
        
        // Apply seasonal adjustment
        const season = SippyUtils.getChennaiSeason();
        if (season === 'summer') {
            goal *= CHENNAI_SEASONS.summer.goalAdjustment;
        } else if (season === 'monsoon') {
            goal *= CHENNAI_SEASONS.monsoon.goalAdjustment;
        }
        
        // Clamp to min/max
        goal = SippyUtils.clamp(
            Math.round(goal),
            SIPPY_CONFIG.hydration.minGoal,
            SIPPY_CONFIG.hydration.maxGoal
        );
        
        this.currentGoal = goal;
        return goal;
    },
    
    /**
     * Update current intake from today's log
     */
    updateCurrentIntake() {
        this.currentIntake = SippyData.getTotalIntake();
        return this.currentIntake;
    },
    
    /**
     * Get current hydration percentage
     */
    getPercentage() {
        return SippyUtils.percentage(this.currentIntake, this.currentGoal);
    },
    
    /**
     * Get bubble state based on percentage
     */
    getBubbleState() {
        const percent = this.getPercentage();
        const states = SIPPY_CONFIG.bubbleStates;
        
        if (percent >= states.hydrated.min) return 'hydrated';
        if (percent >= states.good.min) return 'good';
        if (percent >= states.moderate.min) return 'moderate';
        if (percent >= states.dehydrated.min) return 'dehydrated';
        return 'critical';
    },
    
    /**
     * Log water intake
     */
    logWater(amount, type = 'water') {
        // Add entry
        const entry = SippyData.addHydrationEntry(amount, type);
        this.updateCurrentIntake();
        
        // Award points
        if (window.SippyPoints) {
            SippyPoints.awardPoints(SIPPY_CONFIG.points.drinkOnTime, 'Drank water! 💧');
        }
        
        // Check achievements
        this.checkAchievements();
        
        // Update UI
        this.updateUI();
        
        // Reset reminder timer
        this.lastReminderTime = Date.now();
        
        // Show celebration
        if (window.SippyBubble) {
            SippyBubble.celebrate();
        }
        
        SippyUtils.showToast(`Logged ${amount}ml! Great job! 💧`);
        
        // Check if goal reached
        if (this.getPercentage() >= 100) {
            this.onGoalReached();
        }
        
        return entry;
    },
    
    /**
     * Goal reached celebration
     */
    onGoalReached() {
        // Award bonus points
        if (window.SippyPoints) {
            SippyPoints.awardPoints(SIPPY_CONFIG.points.dailyGoal, 'Daily goal reached! 🎯');
        }
        
        // Unlock achievement
        SippyData.unlockAchievement('perfect-day');
        
        // Big celebration
        if (window.SippyBubble) {
            SippyBubble.megaCelebrate();
        }
        
        SippyUtils.showToast('🎉 Daily goal reached! You\'re a hydration hero!', 5000);
        SippyUtils.playSound('celebration', 0.7);
    },
    
    /**
     * Check and update streak
     */
    checkStreak() {
        const stats = SippyData.getStats();
        const lastActive = new Date(stats.lastActive);
        const today = new Date();
        
        // Check if new day
        if (SippyUtils.isNewDay(lastActive)) {
            const daysDiff = SippyUtils.daysBetween(today, lastActive);
            
            if (daysDiff === 1) {
                // Consecutive day - increment streak
                stats.currentStreak += 1;
                
                // Award streak points
                if (window.SippyPoints) {
                    const points = SIPPY_CONFIG.points.streakDaily * stats.currentStreak;
                    SippyPoints.awardPoints(points, `${stats.currentStreak} day streak! 🔥`);
                }
            } else if (daysDiff > 1) {
                // Streak broken
                if (stats.currentStreak > 0 && window.SippyPoints) {
                    SippyPoints.losePoints(SIPPY_CONFIG.points.breakStreak, 'Streak broken 😢');
                }
                stats.currentStreak = 0;
            }
            
            // Update longest streak
            if (stats.currentStreak > stats.longestStreak) {
                stats.longestStreak = stats.currentStreak;
            }
            
            SippyData.setStats(stats);
        }
        
        return stats.currentStreak;
    },
    
    /**
     * Check achievements
     */
    checkAchievements() {
        const stats = SippyData.getStats();
        const todayLog = SippyData.getTodayLog();
        const hour = SippyUtils.getCurrentHour();
        const weather = SippyData.get(SIPPY_CONFIG.storage.weatherCache);
        
        // First Drop
        if (stats.totalDrinks >= 1 && !SippyData.isAchievementUnlocked('first-drop')) {
            this.unlockAchievement('first-drop');
        }
        
        // Streaks
        if (stats.currentStreak >= 7 && !SippyData.isAchievementUnlocked('streak-7')) {
            this.unlockAchievement('streak-7');
        }
        if (stats.currentStreak >= 30 && !SippyData.isAchievementUnlocked('streak-30')) {
            this.unlockAchievement('streak-30');
        }
        if (stats.currentStreak >= 100 && !SippyData.isAchievementUnlocked('streak-100')) {
            this.unlockAchievement('streak-100');
        }
        
        // Early Bird (drink before 8 AM)
        if (hour < 8 && !SippyData.isAchievementUnlocked('early-bird')) {
            this.unlockAchievement('early-bird');
        }
        
        // Night Owl (drink after 10 PM)
        if (hour >= 22 && !SippyData.isAchievementUnlocked('night-owl')) {
            this.unlockAchievement('night-owl');
        }
        
        // Chennai Summer Survivor (drink in 35°C+)
        if (weather.temp >= 35 && !SippyData.isAchievementUnlocked('chennai-survivor')) {
            this.unlockAchievement('chennai-survivor');
        }
        
        // Hydration Hero (50 drinks)
        if (stats.totalDrinks >= 50 && !SippyData.isAchievementUnlocked('hydration-hero')) {
            this.unlockAchievement('hydration-hero');
        }
        
        // Points milestones
        if (stats.points >= 100 && !SippyData.isAchievementUnlocked('points-100')) {
            this.unlockAchievement('points-100');
        }
        if (stats.points >= 500 && !SippyData.isAchievementUnlocked('points-500')) {
            this.unlockAchievement('points-500');
        }
        if (stats.points >= 1000 && !SippyData.isAchievementUnlocked('points-1000')) {
            this.unlockAchievement('points-1000');
        }
    },
    
    /**
     * Unlock achievement with celebration
     */
    unlockAchievement(achievementId) {
        if (SippyData.unlockAchievement(achievementId)) {
            const achievement = SIPPY_CONFIG.achievements.find(a => a.id === achievementId);
            if (achievement) {
                SippyUtils.showToast(`🏆 Achievement Unlocked: ${achievement.name}!`, 5000);
                SippyUtils.playSound('gentle-chime', 0.6);
                
                if (window.SippyBubble) {
                    SippyBubble.showMessage(`🏆 ${achievement.name}`);
                }
            }
        }
    },
    
    /**
     * Get motivational message
     */
    getMotivationalMessage() {
        const timeOfDay = SippyUtils.getTimeOfDay();
        const messages = SIPPY_CONFIG.messages[timeOfDay] || SIPPY_CONFIG.messages.encouragement;
        let message = SippyUtils.getRandomMessage(messages);
        
        // Replace variables
        const stats = SippyData.getStats();
        const weather = SippyData.get(SIPPY_CONFIG.storage.weatherCache);
        
        message = SippyUtils.formatMessage(message, {
            streak: stats.currentStreak,
            temp: weather.temp || SIPPY_CONFIG.weather.fallbackTemp,
            points: stats.points
        });
        
        return message;
    },
    
    /**
     * Update UI
     */
    updateUI() {
        // Update progress
        const percent = this.getPercentage();
        const progressCircle = document.getElementById('progressCircle');
        const progressPercent = document.getElementById('progressPercent');
        const currentIntake = document.getElementById('currentIntake');
        const dailyGoal = document.getElementById('dailyGoal');
        
        if (progressCircle) {
            const circumference = 2 * Math.PI * 120;
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
        
        if (progressPercent) progressPercent.textContent = `${percent}%`;
        if (currentIntake) currentIntake.textContent = this.currentIntake;
        if (dailyGoal) dailyGoal.textContent = this.currentGoal;
        
        // Update stats
        const stats = SippyData.getStats();
        const streakValue = document.getElementById('streakValue');
        const weeklyAvg = document.getElementById('weeklyAvg');
        const achievementCount = document.getElementById('achievementCount');
        const totalPoints = document.getElementById('totalPoints');
        
        if (streakValue) streakValue.textContent = stats.currentStreak;
        if (weeklyAvg) weeklyAvg.textContent = SippyData.getWeeklyAverage();
        if (achievementCount) achievementCount.textContent = SippyData.getAchievements().length;
        if (totalPoints) totalPoints.textContent = stats.points;
        
        // Update today's log
        this.updateLogUI();
        
        // Update bubble state
        if (window.SippyBubble) {
            SippyBubble.updateState();
        }
    },
    
    /**
     * Update log UI
     */
    updateLogUI() {
        const logContainer = document.getElementById('todayLog');
        if (!logContainer) return;
        
        const todayLog = SippyData.getTodayLog();
        
        if (todayLog.length === 0) {
            logContainer.innerHTML = '<p class="empty-state">No drinks logged yet. Start drinking water! 💧</p>';
            return;
        }
        
        logContainer.innerHTML = todayLog
            .reverse()
            .map(entry => `
                <div class="log-entry" data-id="${entry.id}">
                    <div>
                        <span class="log-time">${entry.time}</span>
                        <span class="log-amount">${entry.amount}ml</span>
                    </div>
                    <button class="icon-btn" onclick="SippyHydration.deleteEntry('${entry.id}')">🗑️</button>
                </div>
            `)
            .join('');
    },
    
    /**
     * Delete entry
     */
    deleteEntry(id) {
        if (confirm('Delete this entry?')) {
            SippyData.deleteHydrationEntry(id);
            this.updateCurrentIntake();
            this.updateUI();
            SippyUtils.showToast('Entry deleted');
        }
    }
};

// Make available globally
window.SippyHydration = SippyHydration;

