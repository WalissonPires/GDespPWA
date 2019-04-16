window.onload = function(e) {

    downloadExpenses();

    $('[name="monthExpenses"]').change(downloadExpenses);
};

function downloadExpenses() {

    var month = parseInt($('[name="monthExpenses"]').val());

    new App.Services.ExpensesApi().getByMonth(month, 2019).forEach(x => {
        console.log('[DownloadExpenses] Subs in promise');
        x.then(gExpenses => {
            console.log('[DownloadExpenses] Data receveid');
            
            const expenses = gExpenses.map(x => parseGDespExpense(x));

            createListExpensesComponent(expenses);
        })
    });
}

function parseGDespExpense(gExp) {

    /* 
    categoria: "Alimentação"
    categoriaID: 1
    dataCompra: "2019-04-06T16:11:43.049786-03:00"
    descricao: "IOF"
    despesaID: 703
    origem: "LuizaCred"
    parcelaAtual: 1
    parcelaID: 852
    status: "Geilza"
    totalParcelas: 1
    valor: 6.6
    vencimento: "2019-04-15T00:00:00-03:00",
    devedores: [{
        id: 2,
        nome: 'aa',
        valor: 99.99
    }]
    */

    var exp = {
        id: gExp.despesaId + '-' + gExp.parcelaId,
        description: gExp.descricao,
        currentInstallment: gExp.parcelaAtual,
        totalInstallment: gExp.totalParcelas,
        createDate: gExp.dataCompra,
        purchaseDate: gExp.dataCompra,
        paidDate: null,
        price: gExp.valor,
        category: {
            id: gExp.categoriaId,
            name: gExp.categoria
        },
        origin: {
            id: gExp.origem,
            name: gExp.origem
        },
        members: gExp.devedores.map(x => ({ 
            id: x.id,
            name: x.nome,
            price: x.valor
         }))
        // members: [{
        //     id: 'GUID',
        //     name: 'Walisson',
        //     price: 33.33
        // }]
    };

    return exp;
}

function createListExpensesComponent(expenses) {
    
    const $content = $('#AppContent');    
    
    const listDom = new App.Components.ListExpensesCompoent({ expenses: expenses });
    
    $content.empty().append(listDom);
}