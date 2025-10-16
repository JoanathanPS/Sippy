/**
 * Sippy - Memory Test Mini-Game
 * Optional cognitive assessment
 */

const SippyMemory = {
    currentWord: null,
    showTime: null,
    testScheduled: false,
    
    words: [
        'Water', 'Hydrate', 'Chennai', 'Focus', 'Energy', 'Health', 'Wellness', 'Marine', 'Beach', 'Summer',
        'தண்ணீர்', 'நீர்', 'சென்னை', 'கடல்', 'வெயில்' // Tamil words
    ],
    
    /**
     * Start memory game
     */
    startGame() {
        if (this.testScheduled) return;
        
        // Show random word
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.showTime = Date.now();
        
        if (window.SippyBubble) {
            SippyBubble.showMessage(`Remember this word: ${this.currentWord}`, 5000);
        }
        
        // Schedule test in 4 hours
        setTimeout(() => {
            this.conductTest();
        }, 4 * 60 * 60 * 1000);
        
        this.testScheduled = true;
    },
    
    /**
     * Conduct memory test
     */
    conductTest() {
        if (!this.currentWord) return;
        
        const answer = prompt(`Memory Test! 🧠\nWhat word did Sippy show you earlier?`);
        
        if (answer && answer.toLowerCase() === this.currentWord.toLowerCase()) {
            // Correct!
            SippyUtils.showToast('🧠 Correct! +20 points!', 3000);
            if (window.SippyPoints) {
                SippyPoints.awardPoints(SIPPY_CONFIG.points.memoryGame, 'Memory game win!');
            }
            
            // Update stats
            const stats = SippyData.getStats();
            stats.memoryGamesWon = (stats.memoryGamesWon || 0) + 1;
            SippyData.setStats(stats);
            
            // Check achievement
            if (stats.memoryGamesWon >= 10) {
                SippyData.unlockAchievement('memory-master');
            }
        } else {
            SippyUtils.showToast('❌ Wrong answer. The word was: ' + this.currentWord, 4000);
        }
        
        this.currentWord = null;
        this.testScheduled = false;
        
        // Schedule next game in 4 hours
        setTimeout(() => this.startGame(), 4 * 60 * 60 * 1000);
    }
};

// Make available globally
window.SippyMemory = SippyMemory;

