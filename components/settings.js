/**
 * Sippy - Settings Component
 */

const SippySettings = {
    /**
     * Initialize settings
     */
    init() {
        this.loadSettings();
        this.setupEventListeners();
    },
    
    /**
     * Load settings from storage
     */
    loadSettings() {
        const userData = SippyData.getUserData();
        
        // Populate form fields
        const fields = {
            'settingsName': userData.name || '',
            'settingsWeight': userData.weight || 70,
            'settingsGoal': window.SippyHydration?.currentGoal || 2000,
            'reminderFrequency': userData.reminderFrequency || 45,
            'soundVolume': userData.soundVolume || 50,
            'enableNotifications': userData.enableNotifications !== false,
            'enableActivityTracking': userData.enableActivityTracking !== false,
            'themeSelect': userData.theme || 'ocean',
            'bubbleSize': userData.bubbleSize || 'medium'
        };
        
        Object.entries(fields).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                if (el.type === 'checkbox') {
                    el.checked = value;
                } else {
                    el.value = value;
                }
            }
        });
        
        // Update display values
        document.getElementById('frequencyValue').textContent = fields.reminderFrequency;
        document.getElementById('volumeValue').textContent = fields.soundVolume;
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close button
        document.getElementById('closeSettings')?.addEventListener('click', () => {
            document.getElementById('settingsPanel')?.classList.remove('active');
        });
        
        // Name
        document.getElementById('settingsName')?.addEventListener('change', (e) => {
            SippyData.updateUserData({ name: e.target.value });
        });
        
        // Weight
        document.getElementById('settingsWeight')?.addEventListener('change', (e) => {
            SippyData.updateUserData({ weight: parseInt(e.target.value) });
            if (window.SippyHydration) {
                SippyHydration.calculateDailyGoal();
                SippyHydration.updateUI();
            }
        });
        
        // Reminder frequency
        const freqSlider = document.getElementById('reminderFrequency');
        if (freqSlider) {
            freqSlider.addEventListener('input', (e) => {
                document.getElementById('frequencyValue').textContent = e.target.value;
                SippyData.updateUserData({ reminderFrequency: parseInt(e.target.value) });
                if (window.SippyReminder) {
                    SippyReminder.startReminders(parseInt(e.target.value));
                }
            });
        }
        
        // Sound volume
        const volumeSlider = document.getElementById('soundVolume');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                document.getElementById('volumeValue').textContent = e.target.value;
                SippyData.updateUserData({ soundVolume: parseInt(e.target.value) });
            });
        }
        
        // Enable notifications
        document.getElementById('enableNotifications')?.addEventListener('change', (e) => {
            SippyData.updateUserData({ enableNotifications: e.target.checked });
            if (e.target.checked) {
                SippyUtils.requestNotificationPermission();
            }
        });
        
        // Enable activity tracking
        document.getElementById('enableActivityTracking')?.addEventListener('change', (e) => {
            SippyData.updateUserData({ enableActivityTracking: e.target.checked });
        });
        
        // Theme
        document.getElementById('themeSelect')?.addEventListener('change', (e) => {
            const theme = e.target.value;
            if (window.SippyPoints && !SippyPoints.isThemeUnlocked(theme)) {
                alert('🔒 This theme is locked! Earn more points to unlock it.');
                e.target.value = SippyData.getUserData().theme || 'ocean';
                return;
            }
            SippyData.updateUserData({ theme });
            document.body.setAttribute('data-theme', theme);
        });
        
        // Bubble size
        document.getElementById('bubbleSize')?.addEventListener('change', (e) => {
            const size = e.target.value;
            SippyData.updateUserData({ bubbleSize: size });
            if (window.SippyBubble) {
                SippyBubble.applySize(size);
            }
        });
        
        // Export data
        document.getElementById('exportDataBtn')?.addEventListener('click', () => {
            SippyData.exportData();
        });
        
        // Wipe data
        document.getElementById('wipeDataBtn')?.addEventListener('click', () => {
            SippyData.wipeAllData();
        });
    }
};

window.SippySettings = SippySettings;

