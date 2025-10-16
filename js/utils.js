/**
 * Sippy - Utility Functions
 */

const SippyUtils = {
    /**
     * Format time in IST
     */
    formatTime(date = new Date()) {
        return date.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Format date in IST
     */
    formatDate(date = new Date()) {
        return date.toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    /**
     * Get date string for storage (YYYY-MM-DD in IST)
     */
    getDateKey(date = new Date()) {
        const offset = 5.5 * 60 * 60 * 1000; // IST offset
        const istDate = new Date(date.getTime() + offset);
        return istDate.toISOString().split('T')[0];
    },
    
    /**
     * Get current hour in IST (0-23)
     */
    getCurrentHour() {
        const date = new Date();
        return parseInt(date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            hour12: false
        }));
    },
    
    /**
     * Check if it's a new day
     */
    isNewDay(lastDate) {
        return this.getDateKey() !== this.getDateKey(new Date(lastDate));
    },
    
    /**
     * Calculate days between dates
     */
    daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    },
    
    /**
     * Get greeting based on time
     */
    getGreeting() {
        const hour = this.getCurrentHour();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        if (hour < 21) return 'Good evening';
        return 'Good night';
    },
    
    /**
     * Get time of day
     */
    getTimeOfDay() {
        const hour = this.getCurrentHour();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        if (hour < 21) return 'evening';
        return 'night';
    },
    
    /**
     * Get current Chennai season
     */
    getChennaiSeason() {
        const month = new Date().getMonth();
        if (CHENNAI_SEASONS.summer.months.includes(month)) return 'summer';
        if (CHENNAI_SEASONS.monsoon.months.includes(month)) return 'monsoon';
        return 'normal';
    },
    
    /**
     * Generate random message from array
     */
    getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    },
    
    /**
     * Replace variables in message
     */
    formatMessage(message, vars = {}) {
        return message.replace(/{(\w+)}/g, (match, key) => {
            return vars[key] !== undefined ? vars[key] : match;
        });
    },
    
    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Show notification toast
     */
    showToast(message, duration = 3000) {
        const toast = document.getElementById('notificationToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    },
    
    /**
     * Play sound
     */
    playSound(soundName, volume = 0.5) {
        if (window.Howl) {
            const sound = new Howl({
                src: [`assets/sounds/${soundName}.mp3`],
                volume: volume
            });
            sound.play();
        }
    },
    
    /**
     * Request notification permission
     */
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            return await Notification.requestPermission();
        }
        return Notification.permission;
    },
    
    /**
     * Show browser notification
     */
    showNotification(title, body, icon = 'assets/icons/icon-192.png') {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon,
                badge: icon,
                tag: 'sippy-reminder'
            });
        }
    },
    
    /**
     * Animate element with GSAP
     */
    animateElement(element, animation, duration = 0.5) {
        if (window.gsap) {
            gsap.to(element, { ...animation, duration });
        }
    },
    
    /**
     * Create confetti effect
     */
    createConfetti(x, y, count = 20) {
        const colors = ['#0077BE', '#4FC3F7', '#00BCD4', '#FF6B6B', '#FFA726'];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 0.3}s`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 2000);
        }
    },
    
    /**
     * Calculate percentage
     */
    percentage(current, total) {
        return Math.min(Math.round((current / total) * 100), 100);
    },
    
    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * Download data as JSON
     */
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    /**
     * Get distance between two points
     */
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    /**
     * Check if mobile device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Make available globally
window.SippyUtils = SippyUtils;

