(function(GDespApi){
    'use strict';

    var CategoriesApi = function() {

        const FetchUtils = App.Utils.FetchUtils;
        const BaseUrl = GDespApi.BASE_URL + '/categorias';

        this.getAll = function () {
         
            const url = BaseUrl;

            var promise = FetchUtils.fetchJsonWithCache(new Request(url, {
                method: 'GET'
            }));

            return promise.then(promises => {

                var promises = promises.map(x => {

                    return x.then(categories => {
    
                        return categories.map((x) => ({
                            id: x.id,
                            createAtId: x.criadoPorID,
                            name: x.nome,
                            color: x.cor,
                            //criadoPor: null
                        }));
                    });
                });

                return promises;
            });
        };
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').CategoriesApi = CategoriesApi;

})(App.Services.GDespApi);