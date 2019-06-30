(function(){
    'use strict';

    var GDespApi = {
        //BASE_URL: 'https://wprm.dlinkddns.com/GDespApi/API'
        BASE_URL: 'http://localhost:5001/API'
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').GDespApi = GDespApi;
})();