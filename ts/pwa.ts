if ('serviceWorker' in navigator) {
    window.addEventListener('load', (): void => {
        navigator.serviceWorker.register('service-worker.js').then((reg: ServiceWorkerRegistration): void => {
            console.log(`Service worker registered: ${reg}`);
        });
    });
}