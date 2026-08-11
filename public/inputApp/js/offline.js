document.addEventListener('alpine:init', () => {
    // Global offline store
    Alpine.store('offline', {
        isOffline: !navigator.onLine,
    });
});

// Update store on network changes
window.addEventListener('online', () => {
    if (Alpine.store('offline')) {
        Alpine.store('offline').isOffline = false;
    }
});
window.addEventListener('offline', () => {
    if (Alpine.store('offline')) {
        Alpine.store('offline').isOffline = true;
    }
});

// Offline banner component (wraps the store)
function offlineBanner() {
    return {
        get isOffline() {
            return Alpine.store('offline').isOffline;
        },
        hideBanner() {
            Alpine.store('offline').isOffline = false;
        }
    };
}
