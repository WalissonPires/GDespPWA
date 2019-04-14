(function(GDespApi){
    'use strict';

    var ExpensesApi = function() {

        const FetchUtils = App.Utils.FetchUtils;
        const BaseUrl = GDespApi.BASE_URL + '/despesas';

        this.getByMonth = function (month, year) {

            const date = new Date(year, month - 1, 1);
            const url = BaseUrl + '/mes/' + encodeURIComponent(date.toISOString());

            return FetchUtils.fetchJsonWithCache(new Request(url, {
                method: 'GET'
            }));
        };
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').ExpensesApi = ExpensesApi;

})(App.Services.GDespApi);