function offlineBanner() {
    return {
        isOffline: !navigator.onLine,
        init() {
            const self = this;
            
            window.addEventListener('online', () => {
                self.isOffline = false;
                console.log('Online - banner hidden');
            });
            window.addEventListener('offline', () => {
                self.isOffline = true;
                console.log('Offline - banner shown');
            });
            
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
