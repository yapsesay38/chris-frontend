(function() {
    // Remove any existing banner
    const existingBanner = document.getElementById('offline-banner');
    if (existingBanner) existingBanner.remove();
    
    // Create banner
    const banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.style.cssText = 'display: none; background: #f85149; color: white; text-align: center; padding: 12px; font-size: 14px; position: sticky; top: 0; z-index: 10000; font-weight: 500;';
    banner.innerHTML = '📡 You are offline. Data will be saved locally.';
    document.body.insertBefore(banner, document.body.firstChild);
    
    let lastStatus = navigator.onLine;
    
    function updateOfflineBanner() {
        const isOffline = !navigator.onLine;
        banner.style.display = isOffline ? 'block' : 'none';
        
        // Log only when status changes
        if (lastStatus !== isOffline) {
            console.log('📡 Connection status:', isOffline ? 'OFFLINE' : 'ONLINE');
            lastStatus = isOffline;
        }
    }
    
    // Initial check
    updateOfflineBanner();
    
    // Event listeners
    window.addEventListener('online', updateOfflineBanner);
    window.addEventListener('offline', updateOfflineBanner);
    
    // Periodic check (catches DevTools offline toggle)
    setInterval(updateOfflineBanner, 2000);
})();
