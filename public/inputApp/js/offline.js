// js/offline.js - Reusable offline banner component
function offlineBanner() {
    return {
        isOffline: !navigator.onLine,
        init() {
            // Store reference to component
            const self = this;
            
            // Update when online/offline events fire
            window.addEventListener('online', () => {
                self.isOffline = false;
                console.log('Online - banner hidden');
            });
            window.addEventListener('offline', () => {
                self.isOffline = true;
                console.log('Offline - banner shown');
            });
            
            // Poll for DevTools offline toggle
            setInterval(() => {
                const currentStatus = !navigator.onLine;
                if (self.isOffline !== currentStatus) {
                    self.isOffline = currentStatus;
                    console.log('Poll detected change:', currentStatus ? 'OFFLINE' : 'ONLINE');
                }
            }, 2000);
        },
        hideBanner() {
            this.isOffline = false;
        }
    };
}
