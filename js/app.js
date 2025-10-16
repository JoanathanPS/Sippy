/**
 * Sippy - Main Application
 * Your Living Hydration Companion
 */

const SippyApp = {
    initialized: false,
    
    /**
     * Initialize the app
     */
    async init() {
        if (this.initialized) return;
        
        console.log('💧 Sippy - Your Living Hydration Companion');
        console.log('Initializing...');
        
        // Initialize data manager first
        SippyData.init();
        
        // Check if first time user
        const userData = SippyData.getUserData();
        if (!userData.weight || userData.weight === SIPPY_CONFIG.hydration.defaultWeight) {
            this.showWelcomeScreen();
        } else {
            this.startApp();
        }
        
        this.initialized = true;
    },
    
    /**
     * Show welcome screen for first-time users
     */
    showWelcomeScreen() {
        const welcomeModal = document.getElementById('welcomeModal');
        if (!welcomeModal) {
            this.startApp();
            return;
        }
        
        welcomeModal.classList.remove('hidden');
        
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const name = document.getElementById('userName')?.value || '';
                const weight = parseInt(document.getElementById('userWeight')?.value) || 70;
                
                // Save user data
                SippyData.updateUserData({ name, weight });
                
                // Hide welcome, start app
                welcomeModal.classList.add('hidden');
                this.startApp();
                
                // Show celebration
                SippyUtils.showToast(`Welcome ${name || 'friend'}! Let's start your hydration journey! 💧`, 5000);
            }, { once: true });
        }
    },
    
    /**
     * Start the main app
     */
    startApp() {
        // Show dashboard
        const dashboard = document.getElementById('mainDashboard');
        if (dashboard) {
            dashboard.classList.remove('hidden');
        }
        
        // Initialize all modules
        this.initializeModules();
        
        // Apply saved theme
        const userData = SippyData.getUserData();
        if (userData.theme) {
            document.body.setAttribute('data-theme', userData.theme);
        }
        
        // Show welcome message
        setTimeout(() => {
            const greeting = SippyUtils.getGreeting();
            const name = userData.name ? `, ${userData.name}` : '';
            if (window.SippyBubble) {
                SippyBubble.showMessage(`${greeting}${name}! 💧`, 4000);
            }
        }, 1000);
        
        // Start memory game after some time
        setTimeout(() => {
            if (window.SippyMemory) {
                SippyMemory.startGame();
            }
        }, 10 * 60 * 1000); // 10 minutes
    },
    
    /**
     * Initialize all modules
     */
    initializeModules() {
        try {
            // Core modules
            console.log('Initializing core modules...');
            
            // Hydration engine
            if (window.SippyHydration) {
                SippyHydration.init();
                console.log('✓ Hydration Engine');
            }
            
            // Weather service
            if (window.SippyWeather) {
                SippyWeather.init();
                console.log('✓ Weather Service');
            }
            
            // Activity tracker
            if (window.SippyActivity) {
                SippyActivity.init();
                console.log('✓ Activity Tracker');
            }
            
            // Reminder system
            if (window.SippyReminder) {
                SippyReminder.init();
                console.log('✓ Reminder System');
            }
            
            // Bubble widget (THE STAR!)
            if (window.SippyBubble) {
                SippyBubble.init();
                console.log('✓ Bubble Widget (⭐ STAR FEATURE)');
            }
            
            // Dashboard
            if (window.SippyDashboard) {
                SippyDashboard.init();
                console.log('✓ Dashboard');
            }
            
            // Charts
            if (window.SippyCharts) {
                setTimeout(() => {
                    SippyCharts.init();
                    console.log('✓ Charts');
                }, 1000);
            }
            
            // Settings
            if (window.SippySettings) {
                SippySettings.init();
                console.log('✓ Settings');
            }

            // Start proactive chat loop
            if (window.SippyChat) {
                SippyChat.startLoop();
                console.log('✓ Chat Motivation Loop');
            }
            
            console.log('🎉 Sippy is ready!');
            
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    },
    
    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page hidden
            console.log('App paused');
        } else {
            // Page visible again
            console.log('App resumed');
            
            // Check for new day
            if (window.SippyHydration) {
                SippyHydration.checkStreak();
                SippyHydration.updateUI();
            }
            
            // Update weather if stale
            if (window.SippyWeather) {
                const lastUpdate = SippyData.get(SIPPY_CONFIG.storage.lastWeatherUpdate);
                const timeSinceUpdate = Date.now() - (lastUpdate || 0);
                if (timeSinceUpdate > SIPPY_CONFIG.weather.updateInterval) {
                    SippyWeather.fetchWeather();
                }
            }
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SippyApp.init());
} else {
    SippyApp.init();
}

// Handle page visibility
document.addEventListener('visibilitychange', () => SippyApp.handleVisibilityChange());

// Handle window resize (for bubble repositioning)
window.addEventListener('resize', () => {
    if (window.SippyBubble && SippyBubble.element) {
        SippyBubble.snapToEdge();
    }
});

// Make app available globally
window.SippyApp = SippyApp;

// Log app info
console.log('%c💧 Sippy v1.0.0', 'color: #0077BE; font-size: 20px; font-weight: bold;');
console.log('%cYour Living Hydration Companion', 'color: #4FC3F7; font-size: 14px;');
console.log('%cChennai-focused | Privacy-first | No login required', 'color: #00BCD4; font-size: 12px;');

