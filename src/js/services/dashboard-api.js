(function(GDespApi){
    'use strict';

    var DashboardApi = function() {

        const FetchUtils = App.Utils.FetchUtils;
        const BaseUrl = GDespApi.BASE_URL + '/despesas';

        this.getTotalMonthPerPerson = function(month, year) {

            const date = new Date(year, month - 1, 1);
            const url = BaseUrl + '/devedores/' + encodeURIComponent(date.toISOString());

            const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
                method: 'GET'
            }));

            return promise.then(promises => {

                var promises = promises.map(x => {

                    return x.then(data => {
    
                        return data.map(x => ({
                            date: x.data,
                            name: x.nome,
                            photoUrl: x.urlFotoPerfil,
                            value: x.valor
                        }));
                    });
                });

                return promises;
            });                        
        };

        this.getTotalMonthByCategory = function(month, year, personId) {

            const date = new Date(year, month - 1, 1);
            let url = BaseUrl + '/categorias/' + encodeURIComponent(date.toISOString());

            if (personId !== undefined) {

                url += '?devedorId=' + encodeURIComponent(personId);
            }

            const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
                method: 'GET'
            }));
            
            return promise.then(promises => {

                var promises = promises.map(x => {

                    return x.then(data => {
    
                        return data.map(x => ({
                            date: x.data,
                            name: x.nome,
                            photoUrl: x.urlFotoPerfil,
                            value: x.valor
                        }));
                    });
                });

                return promises;
            });          
        };
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').DashboardApi = DashboardApi;

})(App.Services.GDespApi);