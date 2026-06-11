function offlineBanner() {
    return {
        isOffline: !navigator.onLine,
        init() {
            const self = this;
            
            window.addEventListener('online', () => {
                self.isOffline = false;
            });
            window.addEventListener('offline', () => {
                self.isOffline = true;
            });
            
            setInterval(() => {
                const currentStatus = !navigator.onLine;
                if (self.isOffline !== currentStatus) {
                    self.isOffline = currentStatus;
                }
            }, 2000);
        },
        hideBanner() {
            this.isOffline = false;
        }
    };
}
