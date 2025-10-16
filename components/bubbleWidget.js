/**
 * Sippy - Bubble Widget (THE STAR FEATURE!)
 * Always-visible, living, reactive hydration companion
 */

const SippyBubble = {
    element: null,
    isDragging: false,
    currentState: 'good',
    currentPoints: 0,
    position: { x: window.innerWidth - 140, y: window.innerHeight - 140 },
    dragOffset: { x: 0, y: 0 },
    proximityThreshold: 100,
    
    /**
     * Initialize bubble widget
     */
    init() {
        this.element = document.getElementById('bubbleWidget');
        if (!this.element) return;
        
        // Load saved position
        const saved = localStorage.getItem('sippy_bubble_position');
        if (saved) {
            this.position = JSON.parse(saved);
        }
        
        // Set initial position
        this.updatePosition();
        
        // Show bubble
        this.element.classList.remove('hidden');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update state
        this.updateState();
        
        // Start proximity detection
        this.startProximityDetection();
        
        // Animate entrance
        this.animateEntrance();
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse events for dragging
        this.element.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        
        // Touch events for mobile
        this.element.addEventListener('touchstart', this.onDragStart.bind(this));
        document.addEventListener('touchmove', this.onDragMove.bind(this));
        document.addEventListener('touchend', this.onDragEnd.bind(this));
        
        // Click event (when not dragging)
        this.element.addEventListener('click', this.onClick.bind(this));
        
        // Bubble menu buttons
        const menuButtons = document.querySelectorAll('.bubble-menu-btn');
        menuButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                this.handleMenuAction(action);
            });
        });
    },
    
    /**
     * Drag start
     */
    onDragStart(e) {
        e.preventDefault();
        this.isDragging = true;
        this.wasDragged = false;
        
        const touch = e.touches ? e.touches[0] : e;
        this.dragOffset.x = touch.clientX - this.position.x;
        this.dragOffset.y = touch.clientY - this.position.y;
        
        this.element.style.cursor = 'grabbing';
        this.hideMenu();
    },
    
    /**
     * Drag move
     */
    onDragMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.wasDragged = true;
        
        const touch = e.touches ? e.touches[0] : e;
        this.position.x = touch.clientX - this.dragOffset.x;
        this.position.y = touch.clientY - this.dragOffset.y;
        
        // Clamp to screen bounds
        this.position.x = SippyUtils.clamp(this.position.x, 0, window.innerWidth - this.element.offsetWidth);
        this.position.y = SippyUtils.clamp(this.position.y, 0, window.innerHeight - this.element.offsetHeight);
        
        this.updatePosition();
    },
    
    /**
     * Drag end
     */
    onDragEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.element.style.cursor = 'grab';
        
        // Snap to nearest edge
        this.snapToEdge();
        
        // Save position
        localStorage.setItem('sippy_bubble_position', JSON.stringify(this.position));
    },
    
    /**
     * Click handler
     */
    onClick(e) {
        // Don't trigger if was dragging
        if (this.wasDragged) {
            this.wasDragged = false;
            return;
        }
        
        this.toggleMenu();
    },
    
    /**
     * Update position
     */
    updatePosition() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    },
    
    /**
     * Snap to nearest edge
     */
    snapToEdge() {
        const threshold = 50;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Snap to left or right
        if (this.position.x < threshold) {
            this.position.x = 20;
        } else if (this.position.x > width - this.element.offsetWidth - threshold) {
            this.position.x = width - this.element.offsetWidth - 20;
        }
        
        // Snap to top or bottom
        if (this.position.y < threshold) {
            this.position.y = 20;
        } else if (this.position.y > height - this.element.offsetHeight - threshold) {
            this.position.y = height - this.element.offsetHeight - 20;
        }
        
        // Animate to position
        if (window.gsap) {
            gsap.to(this.element, {
                left: this.position.x,
                top: this.position.y,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            this.updatePosition();
        }
    },
    
    /**
     * Toggle menu
     */
    toggleMenu() {
        const menu = document.getElementById('bubbleMenu');
        if (!menu) return;
        
        menu.classList.toggle('hidden');
    },
    
    /**
     * Hide menu
     */
    hideMenu() {
        const menu = document.getElementById('bubbleMenu');
        if (menu) menu.classList.add('hidden');
    },
    
    /**
     * Handle menu action
     */
    handleMenuAction(action) {
        this.hideMenu();
        
        switch (action) {
            case 'log':
                this.quickLogWater();
                break;
            case 'stats':
                this.showStats();
                break;
            case 'snooze':
                this.snooze();
                break;
        }
    },
    
    /**
     * Quick log water (250ml default)
     */
    quickLogWater() {
        if (window.SippyHydration) {
            SippyHydration.logWater(250);
        }
    },
    
    /**
     * Show stats
     */
    showStats() {
        const mainDashboard = document.getElementById('mainDashboard');
        if (mainDashboard) {
            mainDashboard.scrollIntoView({ behavior: 'smooth' });
        }
    },
    
    /**
     * Snooze reminders
     */
    snooze() {
        if (window.SippyReminder) {
            SippyReminder.snooze(15);
        }
        this.showMessage('Snoozed for 15 minutes 😴');
    },
    
    /**
     * Update bubble state
     */
    updateState() {
        if (!window.SippyHydration) return;
        
        const state = SippyHydration.getBubbleState();
        const stateData = SIPPY_CONFIG.bubbleStates[state];
        
        this.currentState = state;
        
        // Update class
        Object.values(SIPPY_CONFIG.bubbleStates).forEach(s => {
            this.element.classList.remove(s.class);
        });
        this.element.classList.add(stateData.class);
        
        // Update face
        const face = document.getElementById('bubbleFace');
        if (face) {
            face.textContent = stateData.emoji;
        }
        
        // Update points
        this.updatePoints();
    },
    
    /**
     * Update points display
     */
    updatePoints() {
        const stats = SippyData.getStats();
        this.currentPoints = stats.points;
        
        const pointsEl = document.getElementById('bubblePoints');
        if (pointsEl) {
            pointsEl.textContent = this.currentPoints;
        }
        
        const headerPoints = document.querySelector('#headerPoints .points-value');
        if (headerPoints) {
            headerPoints.textContent = this.currentPoints;
        }
    },
    
    /**
     * Show message from bubble
     */
    showMessage(message, duration = 3000) {
        const messageEl = document.getElementById('bubbleMessage');
        if (!messageEl) return;
        
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, duration);
    },
    
    /**
     * Celebrate (earned points)
     */
    celebrate() {
        this.element.classList.add('points-earned');
        
        // Create confetti
        const rect = this.element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        SippyUtils.createConfetti(x, y, 15);
        
        // Animate
        if (window.gsap) {
            gsap.to(this.element, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        }
        
        setTimeout(() => {
            this.element.classList.remove('points-earned');
        }, 500);
    },
    
    /**
     * Mega celebrate (goal reached)
     */
    megaCelebrate() {
        const rect = this.element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Lots of confetti!
        SippyUtils.createConfetti(x, y, 50);
        
        // Bigger animation
        if (window.gsap) {
            gsap.timeline()
                .to(this.element, {
                    scale: 1.5,
                    rotation: 360,
                    duration: 0.5,
                    ease: 'power2.out'
                })
                .to(this.element, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'bounce.out'
                });
        }
        
        this.showMessage('🎉 GOAL REACHED! 🎉', 5000);
    },
    
    /**
     * Sad animation (lost points)
     */
    sadReaction() {
        this.element.classList.add('points-lost');
        
        if (window.gsap) {
            gsap.to(this.element, {
                x: -10,
                duration: 0.1,
                yoyo: true,
                repeat: 3,
                ease: 'power2.inOut'
            });
        }
        
        setTimeout(() => {
            this.element.classList.remove('points-lost');
        }, 400);
    },
    
    /**
     * Start proximity detection
     */
    startProximityDetection() {
        document.addEventListener('mousemove', SippyUtils.throttle((e) => {
            if (this.isDragging) return;
            
            const rect = this.element.getBoundingClientRect();
            const bubbleX = rect.left + rect.width / 2;
            const bubbleY = rect.top + rect.height / 2;
            
            const distance = SippyUtils.getDistance(e.clientX, e.clientY, bubbleX, bubbleY);
            
            if (distance < this.proximityThreshold) {
                this.element.classList.add('proximity-active');
            } else {
                this.element.classList.remove('proximity-active');
            }
        }, 100));
    },
    
    /**
     * Animate entrance
     */
    animateEntrance() {
        if (window.gsap) {
            gsap.from(this.element, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        }
    },
    
    /**
     * Points animation (when points change)
     */
    animatePoints(change) {
        const pointsEl = document.getElementById('bubblePoints');
        if (!pointsEl) return;
        
        // Create floating text
        const floater = document.createElement('div');
        floater.style.position = 'fixed';
        floater.style.left = this.position.x + 'px';
        floater.style.top = this.position.y + 'px';
        floater.style.color = change > 0 ? '#00BCD4' : '#EF5350';
        floater.style.fontWeight = 'bold';
        floater.style.fontSize = '1.5rem';
        floater.style.pointerEvents = 'none';
        floater.style.zIndex = '10000';
        floater.textContent = (change > 0 ? '+' : '') + change;
        
        document.body.appendChild(floater);
        
        if (window.gsap) {
            gsap.to(floater, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => floater.remove()
            });
        } else {
            setTimeout(() => floater.remove(), 1000);
        }
        
        // Trigger appropriate animation
        if (change > 0) {
            this.celebrate();
        } else {
            this.sadReaction();
        }
    },
    
    /**
     * Apply size from settings
     */
    applySize(size) {
        this.element.classList.remove('size-small', 'size-medium', 'size-large');
        this.element.classList.add(`size-${size}`);
    }
};

// Make available globally
window.SippyBubble = SippyBubble;

