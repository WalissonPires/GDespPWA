import { PageBase } from "./page-utils.js";
import { ListExpensesCompoent } from "../components/list-expense-component.js";
import { Layout } from "../core/layout.js";
import { Pages } from "../core/page.js";
import { ExpensesApi } from "../services/expenses-api.js";
import { Toast } from "../core/toast.js";
import { ExpenseDetailComponent } from "../components/expense-detail-component.js";
import { PopupCategoriesComponent } from "../components/popup-categories-component.js";
export class ExpensesPage extends PageBase {
    constructor(pageEl) {
        super(pageEl);
        this.categories = [];
        this.listComp = null;
        this.$context = $(pageEl);
        this.$context.append(Layout.LOADING_HTML);
        $(document).on('monthYearChange', (e, month, year) => {
            this.downloadExpenses();
        });
        this.downloadExpenses();
        Pages.activePage(ExpensesPage.name);
    }
    downloadExpenses() {
        const date = Layout.getMonthYear();
        new ExpensesApi().getByMonth(date.month, date.year)
            .then(promises => {
            promises.forEach(x => {
                console.log('[DownloadExpenses] Subs in promise');
                x.then(expenses => {
                    console.log('[DownloadExpenses] Data receveid');
                    this.createListExpensesComponent(expenses);
                });
                x.catch(() => Toast.error('Falha ao baixar despesas'));
            });
        });
        // const date = Layout.getMonthYear();
        // const promiseExpenses = new ExpensesApi().getByMonth(date.month, date.year);
        // const promiseCategories = new CategoriesApi().getAll();
        // const treatCategories = (promises: Promise<Category[]>[]) => {
        //     promises.forEach(x => {
        //         console.log('[DownloadExpenses] Subs in promise');
        //         x.then(categoriesList => {
        //             this.categories = categoriesList;
        //         })
        //         x.catch(() => Toast.error('Falha ao baixar despesas'));
        //     });          
        // };
        // const treatExpenses = (promises: Promise<Expense[]>[]) => {
        //     promises.forEach(x => {
        //         console.log('[DownloadExpenses] Subs in promise');
        //         x.then(expenses => {
        //             console.log('[DownloadExpenses] Data receveid');                                                
        //             this.createListExpensesComponent(expenses);
        //         })
        //         x.catch(() => Toast.error('Falha ao baixar despesas'));
        //     });                                
        // };
        // Promise.all([promiseExpenses, promiseCategories])
        //     .then(results => {
        //         treatCategories(results[1] as any);
        //         setTimeout(() => treatExpenses(results[0] as any), 200);                    
        //     })
        //     .catch(() => Toast.error('Falha ao baixar despesas'));            
    }
    createListExpensesComponent(expenses) {
        const listOptions = {
            expenses: expenses,
            onItemAdded: this.handleItemAddOrUpdatedListComp.bind(this),
            onItemUpdated: this.handleItemAddOrUpdatedListComp.bind(this)
        };
        this.listComp = new ListExpensesCompoent(listOptions);
        this.$context.empty().append(this.listComp.getDom());
        this.$context.append(Layout.PAGE_BOTTOM_SPACE);
        this.$context.append('<button name="addExpense" class="btn-main-add" title="Adicionar despesa"><i class="fa fa-plus"></i></button>');
        this.$context.find('[name="addExpense"]').click(this.handleAddExpense.bind(this));
    }
    showExpenseDetail(exp, domItem) {
        new ExpenseDetailComponent({
            expense: exp,
            onSave: (expense, isNewExpense) => {
                if (isNewExpense)
                    this.listComp.addItem(expense);
                else
                    this.listComp.updateItem(expense);
            },
            onDelete: () => domItem.remove()
        });
    }
    handleAddExpense(e) {
        this.showExpenseDetail();
    }
    handleItemAddOrUpdatedListComp(domItem, expense) {
        $(domItem).click(((exp) => {
            return (e) => {
                const $target = $(e.target);
                const isCategoryIcon = $target.is('.icon,.icon-circle');
                if (isCategoryIcon)
                    return;
                this.showExpenseDetail(exp, domItem);
            };
        })(expense));
        $(domItem).find('.icon').click(((exp) => {
            return (e) => {
                new PopupCategoriesComponent({
                    target: e.currentTarget,
                    onSelected: (cat) => {
                        exp.categoryId = cat.id;
                        exp.category = cat;
                        new ExpensesApi().updatePartial({
                            id: exp.id,
                            categoryId: exp.categoryId
                        })
                            .then(() => {
                            this.listComp.updateItem(exp);
                        })
                            .catch(error => Toast.error('Falha ao alterar categoria: ' + error.message));
                    }
                });
            };
        })(expense));
    }
}
Pages.constructos[ExpensesPage.name] = ExpensesPage;
//# sourceMappingURL=expenses-page.js.map