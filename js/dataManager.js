/**
 * Sippy - Data Manager
 * Handles all data storage (LocalStorage + IndexedDB fallback)
 */

const SippyData = {
    /**
     * Initialize data storage
     */
    init() {
        this.ensureStorage();
    },
    
    /**
     * Ensure storage exists
     */
    ensureStorage() {
        const keys = Object.values(SIPPY_CONFIG.storage);
        keys.forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(this.getDefaultData(key)));
            }
        });
    },
    
    /**
     * Get default data structure
     */
    getDefaultData(key) {
        switch (key) {
            case SIPPY_CONFIG.storage.userData:
                return SIPPY_CONFIG.defaultSettings;
            case SIPPY_CONFIG.storage.hydrationLog:
                return {};
            case SIPPY_CONFIG.storage.achievements:
                return [];
            case SIPPY_CONFIG.storage.stats:
                return {
                    totalIntake: 0,
                    totalDrinks: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    points: 0,
                    memoryGamesWon: 0,
                    lastActive: Date.now()
                };
            default:
                return {};
        }
    },
    
    /**
     * Get data from storage
     */
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : this.getDefaultData(key);
        } catch (error) {
            console.error('Error reading from storage:', error);
            return this.getDefaultData(key);
        }
    },
    
    /**
     * Set data in storage
     */
    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    },
    
    /**
     * Get user data
     */
    getUserData() {
        return this.get(SIPPY_CONFIG.storage.userData);
    },
    
    /**
     * Update user data
     */
    updateUserData(data) {
        const current = this.getUserData();
        return this.set(SIPPY_CONFIG.storage.userData, { ...current, ...data });
    },
    
    /**
     * Get hydration log
     */
    getHydrationLog() {
        return this.get(SIPPY_CONFIG.storage.hydrationLog);
    },
    
    /**
     * Get today's hydration log
     */
    getTodayLog() {
        const dateKey = SippyUtils.getDateKey();
        const allLogs = this.getHydrationLog();
        return allLogs[dateKey] || [];
    },
    
    /**
     * Add hydration entry
     */
    addHydrationEntry(amount, type = 'water') {
        const dateKey = SippyUtils.getDateKey();
        const allLogs = this.getHydrationLog();
        
        if (!allLogs[dateKey]) {
            allLogs[dateKey] = [];
        }
        
        const entry = {
            id: SippyUtils.generateId(),
            amount,
            type,
            timestamp: Date.now(),
            time: SippyUtils.formatTime()
        };
        
        allLogs[dateKey].push(entry);
        this.set(SIPPY_CONFIG.storage.hydrationLog, allLogs);
        
        // Update stats
        this.updateStats('totalIntake', amount);
        this.updateStats('totalDrinks', 1);
        
        return entry;
    },
    
    /**
     * Delete hydration entry
     */
    deleteHydrationEntry(id) {
        const dateKey = SippyUtils.getDateKey();
        const allLogs = this.getHydrationLog();
        
        if (allLogs[dateKey]) {
            const entry = allLogs[dateKey].find(e => e.id === id);
            if (entry) {
                allLogs[dateKey] = allLogs[dateKey].filter(e => e.id !== id);
                this.set(SIPPY_CONFIG.storage.hydrationLog, allLogs);
                
                // Update stats
                this.updateStats('totalIntake', -entry.amount);
                this.updateStats('totalDrinks', -1);
                return true;
            }
        }
        return false;
    },
    
    /**
     * Get total intake for date
     */
    getTotalIntake(dateKey = SippyUtils.getDateKey()) {
        const allLogs = this.getHydrationLog();
        const dayLog = allLogs[dateKey] || [];
        return dayLog.reduce((sum, entry) => sum + entry.amount, 0);
    },
    
    /**
     * Get stats
     */
    getStats() {
        return this.get(SIPPY_CONFIG.storage.stats);
    },
    
    /**
     * Update stats
     */
    updateStats(key, value) {
        const stats = this.getStats();
        if (typeof value === 'number' && typeof stats[key] === 'number') {
            stats[key] += value;
        } else {
            stats[key] = value;
        }
        stats.lastActive = Date.now();
        this.set(SIPPY_CONFIG.storage.stats, stats);
    },
    
    /**
     * Set stats
     */
    setStats(data) {
        const stats = this.getStats();
        this.set(SIPPY_CONFIG.storage.stats, { ...stats, ...data });
    },
    
    /**
     * Get achievements
     */
    getAchievements() {
        return this.get(SIPPY_CONFIG.storage.achievements);
    },
    
    /**
     * Unlock achievement
     */
    unlockAchievement(achievementId) {
        const unlocked = this.getAchievements();
        if (!unlocked.includes(achievementId)) {
            unlocked.push(achievementId);
            this.set(SIPPY_CONFIG.storage.achievements, unlocked);
            return true;
        }
        return false;
    },
    
    /**
     * Check if achievement is unlocked
     */
    isAchievementUnlocked(achievementId) {
        return this.getAchievements().includes(achievementId);
    },
    
    /**
     * Get 7-day history
     */
    getWeekHistory() {
        const history = [];
        const allLogs = this.getHydrationLog();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = SippyUtils.getDateKey(date);
            const total = allLogs[dateKey] ? 
                allLogs[dateKey].reduce((sum, e) => sum + e.amount, 0) : 0;
            
            history.push({
                date: dateKey,
                label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
                total
            });
        }
        
        return history;
    },
    
    /**
     * Get hourly breakdown for today
     */
    getTodayHourly() {
        const hourly = new Array(24).fill(0);
        const todayLog = this.getTodayLog();
        
        todayLog.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            hourly[hour] += entry.amount;
        });
        
        return hourly;
    },
    
    /**
     * Calculate weekly average
     */
    getWeeklyAverage() {
        const history = this.getWeekHistory();
        const total = history.reduce((sum, day) => sum + day.total, 0);
        return Math.round(total / 7);
    },
    
    /**
     * Export all data
     */
    exportData() {
        const data = {
            userData: this.getUserData(),
            hydrationLog: this.getHydrationLog(),
            stats: this.getStats(),
            achievements: this.getAchievements(),
            exportDate: new Date().toISOString(),
            appVersion: '1.0.0'
        };
        
        SippyUtils.downloadJSON(data, `sippy-backup-${SippyUtils.getDateKey()}.json`);
    },
    
    /**
     * Wipe all data
     */
    wipeAllData() {
        if (confirm('⚠️ This will delete ALL your data. This cannot be undone! Are you sure?')) {
            const keys = Object.values(SIPPY_CONFIG.storage);
            keys.forEach(key => localStorage.removeItem(key));
            this.ensureStorage();
            location.reload();
        }
    },
    
    /**
     * Get storage size
     */
    getStorageSize() {
        let total = 0;
        Object.values(SIPPY_CONFIG.storage).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                total += item.length;
            }
        });
        return (total / 1024).toFixed(2); // KB
    }
};

// Initialize on load
window.SippyData = SippyData;

