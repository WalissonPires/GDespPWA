(function(){
    'use strict';    

    var GDespApi = {
        BASE_URL: window.location.hash === '#local' 
            ? 'http://localhost:8082/GDespApi/API'
            : window.location.hash === '#debug'
                ? 'http://localhost:5001/API'
                : 'https://wprm.dlinkddns.com/GDespApi/API'
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').GDespApi = GDespApi;
})();