(function(GDespApi){
    'use strict';

    var ExpensesApi = function() {

        const FetchUtils = App.Utils.FetchUtils;
        const BaseUrl = GDespApi.BASE_URL + '/despesas';
        const BaseUrlv2 = GDespApi.BASE_URL + '/v2/despesas';

        this.getByMonth = function (month, year) {

            const date = new Date(year, month - 1, 1);
            const url = BaseUrl + '/mes/' + encodeURIComponent(date.toISOString());

            return FetchUtils.fetchJsonWithCache(new Request(url, {
                method: 'GET'
            }));
        };

        this.update = function(expense) {

            const splitId = expense.id.split('-');

            expense = {
                despesaId: splitId[0],
                parcelaId: splitId[1],
                descricao: expense.description,
                vencimento: expense.dueDate,
                origemId: expense.originId,
                categoriaId: expense.categoryId,                
            };

            return FetchUtils.fetchJson(new Request(BaseUrl, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(expense)
            }));
        };

        this.create = function(expense) {

            expense = {
                descricao: expense.description,
                vencimento: expense.dueDate,
                valor: expense.price,
                origemID: expense.originId,
                totalParcelas: 1,
                parcelaAtual: 1,                
                categoriaID: expense.categoryId,
                isPaga: false,
                isFixa: false
            };

            return FetchUtils.fetchJson(new Request(BaseUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(expense)
            }));
        }
        
        this.updatePartial = function(expense) {

            const splitId = expense.id.split('-');            

            expense = {
                ID: splitId[0],
                Descricao: expense.description,
                Vencimento: expense.dueDate,
                OrigemID: expense.originId,
                CategoriaID: expense.categoryId,
            };

            let expPartial = [];

            for (let key in expense) {

                if (expense[key] !== undefined)
                    expPartial.push({ campo: key, valor: expense[key] });
            }

            const url = BaseUrl + '/' + splitId[0] + '/parcial';

            return FetchUtils.fetchJson(new Request(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(expPartial) //**** */
            }));
        };

        this.updateMembers = function(expenseId, members) {

            const splitId = expenseId.split('-');

            const url = BaseUrl + '/' + splitId[0] + '/parcela/' + splitId[1] + '/devedores/true';

            members = members.map(x => ({
                id: x.id,
                convidadoId: x.guestId,
                usuarioId: x.userId,
                valorPagar: x.price
            }));

            return FetchUtils.fetchJson(new Request(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(members)
            }));
        };

        this.delete = function(expenseId) {

            const splitId = expenseId.split('-');
            const url = BaseUrlv2 + '/' + splitId[0];

            return FetchUtils.fetchJson(new Request(url, {
                method: 'DELETE',                
            }));
        };
    };

    App.Utils.Namespace.CreateIfNotExists('App.Services').ExpensesApi = ExpensesApi;

})(App.Services.GDespApi);