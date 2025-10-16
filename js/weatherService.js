/**
 * Sippy - Weather Service
 * Chennai weather integration for context-aware hydration
 */

const SippyWeather = {
    lastUpdate: 0,
    currentWeather: null,
    
    /**
     * Initialize weather service
     */
    init() {
        this.loadCachedWeather();
        this.fetchWeather();
        
        // Update every 30 minutes
        setInterval(() => this.fetchWeather(), SIPPY_CONFIG.weather.updateInterval);
    },
    
    /**
     * Load cached weather
     */
    loadCachedWeather() {
        const cached = SippyData.get(SIPPY_CONFIG.storage.weatherCache);
        if (cached && cached.temp) {
            this.currentWeather = cached;
            this.updateUI();
        }
    },
    
    /**
     * Fetch weather from OpenWeather API
     */
    async fetchWeather() {
        const apiKey = SIPPY_CONFIG.weather.apiKey;
        
        // Check if API key is set
        if (!apiKey || apiKey === 'YOUR_OPENWEATHER_API_KEY') {
            console.warn('OpenWeather API key not set. Using fallback data.');
            this.useFallbackWeather();
            return;
        }
        
        try {
            const { lat, lon } = SIPPY_CONFIG.location;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather API request failed');
            
            const data = await response.json();
            
            this.currentWeather = {
                temp: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                emoji: this.getWeatherEmoji(data.weather[0].id),
                timestamp: Date.now()
            };
            
            // Save to cache
            SippyData.set(SIPPY_CONFIG.storage.weatherCache, this.currentWeather);
            SippyData.set(SIPPY_CONFIG.storage.lastWeatherUpdate, Date.now());
            
            // Update UI and recalculate goal
            this.updateUI();
            if (window.SippyHydration) {
                SippyHydration.calculateDailyGoal();
                SippyHydration.updateUI();
            }
            
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.useFallbackWeather();
        }
    },
    
    /**
     * Use fallback weather data
     */
    useFallbackWeather() {
        this.currentWeather = {
            temp: SIPPY_CONFIG.weather.fallbackTemp,
            feelsLike: SIPPY_CONFIG.weather.fallbackTemp,
            humidity: SIPPY_CONFIG.weather.fallbackHumidity,
            description: 'partly cloudy',
            emoji: '⛅',
            timestamp: Date.now()
        };
        
        SippyData.set(SIPPY_CONFIG.storage.weatherCache, this.currentWeather);
        this.updateUI();
    },
    
    /**
     * Get weather emoji from code
     */
    getWeatherEmoji(code) {
        if (code >= 200 && code < 300) return '⛈️'; // Thunderstorm
        if (code >= 300 && code < 400) return '🌦️'; // Drizzle
        if (code >= 500 && code < 600) return '🌧️'; // Rain
        if (code >= 600 && code < 700) return '❄️'; // Snow
        if (code >= 700 && code < 800) return '🌫️'; // Atmosphere
        if (code === 800) return '☀️'; // Clear
        if (code > 800) return '☁️'; // Clouds
        return '⛅';
    },
    
    /**
     * Update weather UI
     */
    updateUI() {
        if (!this.currentWeather) return;
        
        const widget = document.getElementById('weatherWidget');
        if (!widget) return;
        
        const icon = widget.querySelector('.weather-icon');
        const temp = widget.querySelector('.weather-temp');
        
        if (icon) icon.textContent = this.currentWeather.emoji;
        if (temp) temp.textContent = `${this.currentWeather.temp}°C`;
    },
    
    /**
     * Get current temperature
     */
    getTemp() {
        return this.currentWeather ? this.currentWeather.temp : SIPPY_CONFIG.weather.fallbackTemp;
    },
    
    /**
     * Get current humidity
     */
    getHumidity() {
        return this.currentWeather ? this.currentWeather.humidity : SIPPY_CONFIG.weather.fallbackHumidity;
    },
    
    /**
     * Get contextual weather message
     */
    getWeatherMessage() {
        const temp = this.getTemp();
        const messages = SIPPY_CONFIG.messages.weather;
        const message = SippyUtils.getRandomMessage(messages);
        
        return SippyUtils.formatMessage(message, {
            temp: temp,
            humidity: this.getHumidity()
        });
    }
};

// Make available globally
window.SippyWeather = SippyWeather;

