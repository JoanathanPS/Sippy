/**
 * Sippy - Focus Economy (Points System)
 * Gamification engine for engagement
 */

const SippyPoints = {
    /**
     * Award points
     */
    awardPoints(points, reason = '') {
        const stats = SippyData.getStats();
        const oldPoints = stats.points;
        stats.points += points;
        SippyData.setStats(stats);
        
        // Update UI
        if (window.SippyBubble) {
            SippyBubble.updatePoints();
            SippyBubble.animatePoints(points);
        }
        
        if (window.SippyHydration) {
            SippyHydration.updateUI();
        }
        
        // Check for unlocks
        this.checkUnlocks(stats.points);
        
        // Show toast
        if (reason) {
            SippyUtils.showToast(`+${points} points! ${reason}`);
        }
        
        return stats.points;
    },
    
    /**
     * Lose points
     */
    losePoints(points, reason = '') {
        const stats = SippyData.getStats();
        stats.points = Math.max(0, stats.points - points);
        SippyData.setStats(stats);
        
        // Update UI
        if (window.SippyBubble) {
            SippyBubble.updatePoints();
            SippyBubble.animatePoints(-points);
        }
        
        if (window.SippyHydration) {
            SippyHydration.updateUI();
        }
        
        // Show toast
        if (reason) {
            SippyUtils.showToast(`-${points} points. ${reason}`, 3000);
        }
        
        return stats.points;
    },
    
    /**
     * Check for theme/skin unlocks
     */
    checkUnlocks(points) {
        // Themes unlock at certain point milestones
        const unlocks = {
            0: 'ocean',
            100: 'forest',
            250: 'sunset',
            500: 'midnight',
            1000: 'chennai'
        };
        
        // Check what's newly unlocked
        Object.entries(unlocks).forEach(([threshold, theme]) => {
            if (points >= threshold) {
                const key = `theme_${theme}_unlocked`;
                if (!localStorage.getItem(key)) {
                    localStorage.setItem(key, 'true');
                    SippyUtils.showToast(`🎨 New theme unlocked: ${theme}!`, 4000);
                }
            }
        });
    },
    
    /**
     * Check if theme is unlocked
     */
    isThemeUnlocked(theme) {
        if (theme === 'ocean') return true; // Default theme
        const key = `theme_${theme}_unlocked`;
        return localStorage.getItem(key) === 'true';
    },
    
    /**
     * Get points
     */
    getPoints() {
        return SippyData.getStats().points;
    }
};

// Make available globally
window.SippyPoints = SippyPoints;

