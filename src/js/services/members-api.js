(function(GDespApi){
    'use strict';

    var MembersApi = function() {

        const FetchUtils = App.Utils.FetchUtils;
        const BaseUrl = GDespApi.BASE_URL + '/convidados';

        this.getAll = function () {
         
            const url = BaseUrl;

            var promise = FetchUtils.fetchJsonWithCache(new Request(url, {
                method: 'GET'
            }));

            return promise.then(promises => {

                var promises = promises.map(x => {

                    return x.then(members => {
    
                        return members.map((x) => ({                                                
                            id: 0,
                            name: x.nome,                        
                            userId: x.usuarioID,
                            guestId: x.id > 0 ? x.id : null
                        }));
                    });
                });

                return promises;
            });
        };
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').MembersApi = MembersApi;

})(App.Services.GDespApi);