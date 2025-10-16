/**
 * Sippy - Activity Tracker
 * Monitors user activity without being creepy
 */

const SippyActivity = {
    lastMouseMove: Date.now(),
    lastKeyPress: Date.now(),
    lastScroll: Date.now(),
    mouseVelocity: 0,
    typingSpeed: [],
    isTabVisible: true,
    inMeeting: false,
    idleThreshold: 5 * 60 * 1000, // 5 minutes
    
    /**
     * Initialize activity tracker
     */
    init() {
        const settings = SippyData.getUserData();
        if (!settings.enableActivityTracking) return;
        
        this.setupListeners();
    },
    
    /**
     * Setup event listeners
     */
    setupListeners() {
        // Mouse movement
        document.addEventListener('mousemove', SippyUtils.throttle((e) => {
            this.onMouseMove(e);
        }, 1000));
        
        // Keyboard
        document.addEventListener('keypress', () => {
            this.onKeyPress();
        });
        
        // Scroll
        document.addEventListener('scroll', SippyUtils.throttle(() => {
            this.onScroll();
        }, 1000));
        
        // Tab visibility
        document.addEventListener('visibilitychange', () => {
            this.isTabVisible = !document.hidden;
            this.detectMeeting();
        });
    },
    
    /**
     * Mouse move handler
     */
    onMouseMove(e) {
        const now = Date.now();
        const timeDiff = now - this.lastMouseMove;
        
        if (timeDiff > 0) {
            // Calculate velocity (pixels per second)
            this.mouseVelocity = Math.sqrt(e.movementX ** 2 + e.movementY ** 2) / (timeDiff / 1000);
        }
        
        this.lastMouseMove = now;
    },
    
    /**
     * Key press handler
     */
    onKeyPress() {
        const now = Date.now();
        const timeSinceLastKey = now - this.lastKeyPress;
        
        // Track typing speed
        if (timeSinceLastKey < 2000) {
            this.typingSpeed.push(timeSinceLastKey);
            if (this.typingSpeed.length > 10) {
                this.typingSpeed.shift();
            }
        }
        
        this.lastKeyPress = now;
    },
    
    /**
     * Scroll handler
     */
    onScroll() {
        this.lastScroll = Date.now();
    },
    
    /**
     * Check if user is active
     */
    isUserActive() {
        const now = Date.now();
        const timeSinceActivity = Math.min(
            now - this.lastMouseMove,
            now - this.lastKeyPress,
            now - this.lastScroll
        );
        
        return timeSinceActivity < this.idleThreshold;
    },
    
    /**
     * Detect meeting (tab hidden for extended period)
     */
    detectMeeting() {
        if (!this.isTabVisible) {
            setTimeout(() => {
                if (!this.isTabVisible) {
                    this.inMeeting = true;
                }
            }, 2 * 60 * 1000); // 2 minutes
        } else {
            this.inMeeting = false;
        }
    },
    
    /**
     * Get stress level (based on typing variance)
     */
    getStressLevel() {
        if (this.typingSpeed.length < 5) return 0;
        
        const avg = this.typingSpeed.reduce((a, b) => a + b, 0) / this.typingSpeed.length;
        const variance = this.typingSpeed.reduce((sum, speed) => sum + Math.pow(speed - avg, 2), 0) / this.typingSpeed.length;
        
        // Higher variance = more stress
        return Math.min(variance / 1000, 1);
    }
};

// Make available globally
window.SippyActivity = SippyActivity;

