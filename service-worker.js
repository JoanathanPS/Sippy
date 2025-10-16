/**
 * Sippy - Service Worker
 * Offline support for PWA
 */

const CACHE_NAME = 'sippy-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './css/main.css',
    './css/themes.css',
    './css/animations.css',
    './css/components.css',
    './css/responsive.css',
    './js/app.js',
    './js/constants.js',
    './js/utils.js',
    './js/dataManager.js',
    './js/weatherService.js',
    './js/hydrationEngine.js',
    './js/activityTracker.js',
    './js/reminderSystem.js',
    './js/focusEconomy.js',
    './js/memoryTest.js',
    './js/pdfGenerator.js',
    './components/bubbleWidget.js',
    './components/mascot.js',
    './components/chatInterface.js',
    './components/dashboard.js',
    './components/charts.js',
    './components/settings.js',
    './components/privacyDashboard.js',
    './components/notifications.js',
    './manifest.json'
];

// Install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
    );
});

// Activate
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

