(function(){
    'use strict';

    var ExpensesPage = function(pageEl) {

        var $context = $(pageEl);
        var categories = [];
        var listComp = null;

        function init() {

            $context.append(App.Layout.LOADING_HTML);

            $(document).on('monthYearChange', (e, month, year) => {
            
                downloadExpenses();
            });

            downloadExpenses();

            App.Utils.Pages.activePage(ExpensesPage.name);
        }

        function downloadExpenses() {

            var date = App.Layout.getMonthYear();
        
            const promiseExpenses = new App.Services.ExpensesApi().getByMonth(date.month, date.year);
            const promiseCategories = new App.Services.CategoriesApi().getAll();

            const treatCategories = (promises) => {

                promises.forEach(x => {
        
                    console.log('[DownloadExpenses] Subs in promise');
                    x.then(categoriesList => {
                        
                        categories = categoriesList;
                    })

                    x.catch(() => App.Utils.Toast.error('Falha ao baixar despesas'));
                });          
            };

            const treatExpenses = (promises) => {
                              
                promises.forEach(x => {
        
                    console.log('[DownloadExpenses] Subs in promise');
                    x.then(gExpenses => {
                        console.log('[DownloadExpenses] Data receveid');
                        
                        const expenses = gExpenses.map(x => {
                            
                            const exp = parseGDespExpense(x);
                            const cat = categories.find(a => a.id === exp.category.id);
                            exp.category.color = (cat && cat.color) || null;

                            return exp;
                        });
        
                        createListExpensesComponent(expenses);
                    })

                    x.catch(() => App.Utils.Toast.error('Falha ao baixar despesas'));
                });                                
            };

            
            Promise.all([promiseExpenses, promiseCategories])
                .then(results => {

                    treatCategories(results[1]);
                    setTimeout(() => treatExpenses(results[0]), 200);                    
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
            
            const listOptions = {
                expenses: expenses,
                onItemAdded: handleItemAddOrUpdatedListComp,
                onItemUpdated: handleItemAddOrUpdatedListComp
            };
             
            listComp = new App.Components.ListExpensesCompoent(listOptions);
            
            $context.empty().append(listComp.getDom());            
            $context.append(App.Layout.PAGE_BOTTOM_SPACE);
            $context.append('<button name="addExpense" class="btn-main-add" title="Adicionar despesa"><i class="fa fa-plus"></i></button>');

            $context.find('[name="addExpense"]').click(handleAddExpense);
        }

        function showExpenseDetail(exp, domItem) {

            new App.Components.ExpenseDetailComponent({ 
                expense: exp,
                onSave: (expense, isNewExpense) => {

                    if (isNewExpense)                               
                        listComp.addItem(expense);
                    else
                        listComp.updateItem(expense);
                },
                onDelete: () => domItem.remove()
            });
        }

        function handleAddExpense(e) {

            showExpenseDetail();
        }   

        function handleItemAddOrUpdatedListComp(domItem, expense) {
        
            $(domItem).click((function(exp) {
                
                return (e) => {
                   
                    const $target = $(e.target);
                    const isCategoryIcon = $target.is('.icon,.icon-circle');                    
                    if (isCategoryIcon)
                        return;

                    showExpenseDetail(exp, domItem);                    
                };

            })(expense));

            $(domItem).find('.icon').click((function(exp) {

                return (e) => {   
                
                    new App.Components.PopupCategoriesComponent({
                        target: e.currentTarget,
                        onSelected: (cat) => {

                            exp.categoryId = cat.id;
                            exp.category = cat;

                            new App.Services.ExpensesApi().updatePartial({
                                id: exp.id,
                                categoryId: exp.categoryId
                            })
                                .then(() => {

                                    listComp.updateItem(exp);
                                })
                                .catch(error => App.Utils.Toast.error('Falha ao alterar categoria: ' + error.message));                                                       
                        }
                    });
                
                };

            })(expense));
        }
        

        init();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Pages').ExpensesPage = ExpensesPage;
})();