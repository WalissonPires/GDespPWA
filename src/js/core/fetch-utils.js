(function(){

    var FetchUtils = function (){        
    };

    FetchUtils.fetchJson = function(request) {

        return fetch(request)
            .then((response) => {

                const contentType = response.headers.get("content-type");
                if (contentType === null)
                    return null;
                else if(contentType && contentType.indexOf("application/json") !== -1)
                  return response.json();
                else 
                    throw { status: 0, message: 'Servidor respondeu em um formato inválido: ' + contentType };
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