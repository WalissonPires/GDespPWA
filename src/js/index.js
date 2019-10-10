if ('serviceWorker' in navigator) {
    navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
}

window.onload = function(e) {    

    // Global Options:
    Chart.defaults.global.defaultFontColor = '#444';
    Chart.defaults.global.defaultFontSize = 16;

    App.Layout.instance = new App.Layout();    

    $('[data-page="' + App.Pages.DashboardPage.name + '"]').click();
};