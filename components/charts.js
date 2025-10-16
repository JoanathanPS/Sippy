/**
 * Sippy - Charts Component
 */

const SippyCharts = {
    weeklyChart: null,
    hourlyChart: null,
    
    /**
     * Initialize charts
     */
    init() {
        this.createWeeklyChart();
        this.createHourlyChart();
    },
    
    /**
     * Create weekly chart
     */
    createWeeklyChart() {
        const canvas = document.getElementById('weeklyChart');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        const weekHistory = SippyData.getWeekHistory();
        
        this.weeklyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weekHistory.map(d => d.label),
                datasets: [{
                    label: 'Hydration (ml)',
                    data: weekHistory.map(d => d.total),
                    borderColor: '#0077BE',
                    backgroundColor: 'rgba(0, 119, 190, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    },
    
    /**
     * Create hourly chart
     */
    createHourlyChart() {
        const canvas = document.getElementById('hourlyChart');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        const hourlyData = SippyData.getTodayHourly();
        const currentHour = SippyUtils.getCurrentHour();
        
        this.hourlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'Intake (ml)',
                    data: hourlyData,
                    backgroundColor: hourlyData.map((_, i) => 
                        i === currentHour ? '#00BCD4' : '#4FC3F7'
                    )
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 10 },
                scales: {
                    x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    },
    
    /**
     * Update charts
     */
    updateCharts() {
        if (this.weeklyChart) {
            const weekHistory = SippyData.getWeekHistory();
            this.weeklyChart.data.datasets[0].data = weekHistory.map(d => d.total);
            this.weeklyChart.update();
        }
        
        if (this.hourlyChart) {
            const hourlyData = SippyData.getTodayHourly();
            this.hourlyChart.data.datasets[0].data = hourlyData;
            this.hourlyChart.update();
        }
    }
};

window.SippyCharts = SippyCharts;

