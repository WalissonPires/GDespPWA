(function(){

    var FetchUtils = function (){        
    };

    FetchUtils.fetchJson = function(request) {

        return fetch(request)
            .then((response) => {

                const isSuccess = Math.trunc(response.status / 100) === 2;
                const contentType = response.headers.get("content-type");

                if (contentType === null) {

                    if (isSuccess) 
                        return null;
                    else
                        throw { 
                            status: response.status, 
                            message: '[Falha] Servidor respondeu com status: ' + response.status 
                        };

                } else if (contentType && contentType.indexOf("application/json") !== -1) {

                    return response.json().then((data) => {

                            if (isSuccess)
                                return data;
                            else
                                throw { 
                                    status: response.status, 
                                    message: '[Falha] Servidor respondeu com status: ' + response.status, 
                                    detail: data 
                                };
                    });

                } else { 

                    throw { 
                        status: 0, 
                        message: 'Servidor respondeu em um formato inválido: ' + contentType 
                    };
                }
            });

    };

    FetchUtils.fetchJsonWithCache = function (request) {

        var _promise = new Promise((resolve, reject) => {

            var promises = [];
            
            promises.push(FetchUtils.fetchJson(request));
            
            if ('caches' in window) {
                
                caches.match(request.url).then(function(response) {
                    if (response) {
                        promises.push(response.json());                        
                    }
                    resolve(promises);
                });
            }          
            else
                resolve(promises);
        });

        return _promise;
    }

    App.Utils.Namespace.CreateIfNotExists('App.Utils').FetchUtils = FetchUtils;
})();