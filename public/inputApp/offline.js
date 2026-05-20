// offline.js - Persistent across navigation
(function() {
    const OFFLINE_OVERRIDE_KEY = 'offline_override_mode';
    
    function createBanner() {
        let banner = document.getElementById('offline-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'offline-banner';
            banner.style.cssText = 'display: none; background: #f85149; color: white; text-align: center; padding: 12px; font-size: 14px; position: sticky; top: 0; z-index: 10000; font-weight: 500;';
            banner.innerHTML = '📡 You are offline. Data will be saved locally.';
            document.body.insertBefore(banner, document.body.firstChild);
        }
        return banner;
    }
    
    function updateBanner() {
        const banner = createBanner();
        
        // Check for manual override first (for testing)
        const manualOverride = sessionStorage.getItem('manual_offline_demo') === 'true';
        
        let isOffline;
        if (manualOverride) {
            isOffline = true;
            console.log('Manual override: showing offline banner');
        } else {
            isOffline = !navigator.onLine;
        }
        
        banner.style.display = isOffline ? 'block' : 'none';
        
        // Also add a small status indicator in corner
        updateStatusDot(isOffline);
    }
    
    function updateStatusDot(isOffline) {
        let dot = document.getElementById('offline-status-dot');
        if (isOffline && !dot) {
            dot = document.createElement('div');
            dot.id = 'offline-status-dot';
            dot.style.cssText = 'position: fixed; bottom: 10px; right: 10px; width: 10px; height: 10px; background: #f85149; border-radius: 50%; z-index: 9999;';
            dot.title = 'Offline mode active';
            document.body.appendChild(dot);
        } else if (!isOffline && dot) {
            dot.remove();
        }
    }
    
    // Expose manual toggle for testing
    window.toggleOfflineDemo = function(enable) {
        if (enable) {
            sessionStorage.setItem('manual_offline_demo', 'true');
            console.log('Demo offline mode ENABLED - banner will show until you disable');
        } else {
            sessionStorage.removeItem('manual_offline_demo');
            console.log('Demo offline mode DISABLED - banner follows actual connection');
        }
        updateBanner();
    };
    
    // Initialize
    createBanner();
    updateBanner();
    
    // Listen for real online/offline events
    window.addEventListener('online', () => {
        console.log('Browser reports ONLINE');
        updateBanner();
    });
    window.addEventListener('offline', () => {
        console.log('Browser reports OFFLINE');
        updateBanner();
    });
    
    // Poll for DevTools changes
    let lastOnline = navigator.onLine;
    setInterval(() => {
        const currentOnline = navigator.onLine;
        if (currentOnline !== lastOnline) {
            console.log('Poll detected change:', lastOnline, '->', currentOnline);
            lastOnline = currentOnline;
            updateBanner();
        }
    }, 1000);
    
    console.log('offline.js loaded - use window.toggleOfflineDemo(true/false) to manually control banner');
})();
