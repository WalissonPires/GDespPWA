import { DashboardPage } from "./pages/dashboard-page.js";
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () { console.log('Service Worker Registered'); });
}
window.onload = function (e) {
    // Global Options:
    Chart.defaults.global.defaultFontColor = '#444';
    Chart.defaults.global.defaultFontSize = 16;
    $('[data-page="' + DashboardPage.name + '"]').click();
};
//# sourceMappingURL=index.js.map