window.onload = function(e) {    

    $('[name="monthExpenses"]').val(localStorage.monthExpenses || '1')
    .change((e) => {

        localStorage.monthExpenses = $(e.target).val();

        downloadExpenses();
    });

    downloadExpenses();
};

function downloadExpenses() {

    var month = parseInt($('[name="monthExpenses"]').val());

    new App.Services.ExpensesApi().getByMonth(month, 2019)
    .then(promises => { 
        
        promises.forEach(x => {

            console.log('[DownloadExpenses] Subs in promise');
            x.then(gExpenses => {
                console.log('[DownloadExpenses] Data receveid');
                
                const expenses = gExpenses.map(x => parseGDespExpense(x));

                createListExpensesComponent(expenses);
            })
        })
    })
    .catch(() => App.Utils.Toast.error('Falha ao baixar despesas'));
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
        usuarioId,
        nome: 'aa',
        valor: 99.99
    }]
    */

    var exp = {
        id: gExp.despesaID + '-' + gExp.parcelaID,
        description: gExp.descricao,
        currentInstallment: gExp.parcelaAtual,
        totalInstallment: gExp.totalParcelas,
        createDate: gExp.dataCompra,
        purchaseDate: gExp.dataCompra,
        dueDate: gExp.vencimento,
        paidDate: null,
        price: gExp.valor,
        category: {
            id: gExp.categoriaID,
            name: gExp.categoria
        },
        origin: {
            id: gExp.origemID || 0,
            name: gExp.origem
        },
        members: gExp.devedores.map(x => ({ 
            id: x.id,
            guestId: x.convidadoId,
            userId: x.usuarioId,
            name: x.nome,
            price: x.valor
         }))        
    };

    return exp;
}

function createListExpensesComponent(expenses) {
    
    const $content = $('#AppContent');    
    
    const listOptions = {
        expenses: expenses,
        onItemAdded: (domItem, expense) => {

            $(domItem).click((function(exp) {

                return (e) => {
                   
                    new App.Components.ExpenseDetailComponent({ 
                        expense: exp,
                        //onSave: () => ;
                        onDelete: () => domItem.remove()
                    });
                };

            })(expense));
        }
    };
    const listDom = new App.Components.ListExpensesCompoent(listOptions);
    
    $content.empty().append(listDom);
}