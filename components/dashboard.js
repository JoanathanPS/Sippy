/**
 * Sippy - Dashboard Component
 */

const SippyDashboard = {
    /**
     * Initialize dashboard
     */
    init() {
        this.setupEventListeners();
        this.updateAll();
    },
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Quick action buttons
        document.querySelectorAll('.quick-btn:not(.custom)').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.dataset.amount);
                if (window.SippyHydration) {
                    SippyHydration.logWater(amount);
                }
            });
        });
        
        // Custom amount button
        const customBtn = document.getElementById('customAmountBtn');
        if (customBtn) {
            customBtn.addEventListener('click', () => {
                const amount = prompt('Enter amount in ml:', '250');
                if (amount && !isNaN(amount)) {
                    if (window.SippyHydration) {
                        SippyHydration.logWater(parseInt(amount));
                    }
                }
            });
        }
        
        // View report button
        const reportBtn = document.getElementById('viewReportBtn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                if (window.SippyPDF) {
                    SippyPDF.generateReport();
                }
            });
        }
        
        // Achievements button
        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                location.hash = '#achievements';
                this.renderAchievementsPage();
            });
        }
        
        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                document.getElementById('settingsPanel')?.classList.add('active');
            });
        }
    },
    
    /**
     * Show achievements modal
     */
    renderAchievementsPage() {
        const grid = document.getElementById('achievementsGridPage');
        if (!grid) return;
        const unlocked = SippyData.getAchievements();
        grid.innerHTML = SIPPY_CONFIG.achievements.map(achievement => {
            const isUnlocked = unlocked.includes(achievement.id);
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
            `;
        }).join('');
    },
    
    /**
     * Update all dashboard elements
     */
    updateAll() {
        if (window.SippyHydration) {
            SippyHydration.updateUI();
        }
        if (window.SippyCharts) {
            SippyCharts.updateCharts();
        }
    }
};

window.SippyDashboard = SippyDashboard;

