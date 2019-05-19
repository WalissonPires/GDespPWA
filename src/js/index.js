if ('serviceWorker' in navigator) {
    navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
}

window.onload = function(e) {    

    App.Layout.instance = new App.Layout();    

    $('[data-page="' + App.Pages.DashboardPage.name + '"]').click();
};