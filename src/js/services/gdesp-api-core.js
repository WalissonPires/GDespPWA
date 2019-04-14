(function(){
    'use strict';

    var GDespApi = {
        BASE_URL: 'http://wprm.dlinkddns.com:8082/GDespApi/API'
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').GDespApi = GDespApi;
})();