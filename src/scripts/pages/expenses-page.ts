import { PageBase } from "./page-utils.js";
import { ListExpensesCompoent } from "../components/list-expense-component.js";
import { Layout } from "../core/layout.js";
import { Pages } from "../core/page.js";
import { ExpensesApi } from "../services/expenses-api.js";
import { CategoriesApi } from "../services/categories-api.js";
import { Category, Expense, Member, createUserGuestId } from "../core/entities.js";
import { Toast } from "../core/toast.js";
import { Categoria, Despesa } from "../services/entities/entities.js";
import { ExpenseDetailComponent } from "../components/expense-detail-component.js";
import { PopupCategoriesComponent } from "../components/popup-categories-component.js";

export class ExpensesPage extends PageBase {

    private $context: JQuery;
    private categories: Category[] = [];
    private listComp: ListExpensesCompoent = null;

    constructor(pageEl: HTMLElement) {
        super(pageEl);

        this.$context = $(pageEl);
        this.$context.append(Layout.LOADING_HTML);

        $(document).on('monthYearChange', (e: JQuery.EventBase, month: number, year: number) => {
        
            this.downloadExpenses();
        });

        this.downloadExpenses();

        Pages.activePage(ExpensesPage.name);
    }

    private downloadExpenses() {

        const date = Layout.getMonthYear();

        new ExpensesApi().getByMonth(date.month, date.year)
            .then(promises => {

                promises.forEach(x => {
    
                    console.log('[DownloadExpenses] Subs in promise');

                    x.then(expenses => {
                        console.log('[DownloadExpenses] Data receveid');                                                
        
                        this.createListExpensesComponent(expenses);
                    })
    
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
    
    private createListExpensesComponent(expenses: Expense[]) {       
        
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

    private showExpenseDetail(exp?: Expense, domItem?: HTMLElement) {

        const expDetail = new ExpenseDetailComponent({ 
            expense: exp,
            onSave: (expense, isNewExpense) => {

                if (isNewExpense) {                
                    
                    const monthYear = Layout.getMonthYear();
                    const dueDate = new Date(expense.dueDate);

                    if (dueDate.getFullYear() == monthYear.year && (dueDate.getMonth() + 1) == monthYear.month) {
                    
                        this.listComp.addItem(expense);
                    }

                } else {

                    const oldExp = expDetail.getOptions().expense;

                    if (oldExp && oldExp.origin.id !== expense.origin.id) {

                        this.listComp.removeItem(oldExp);
                        this.listComp.addItem(expense);
                    }
                    else
                        this.listComp.updateItem(expense);
                }
            },
            onDelete: (expense) => this.listComp.removeItem(expense)
        });
    }

    private handleAddExpense(e: JQuery.ClickEvent) {

        this.showExpenseDetail();
    }   

    private handleItemAddOrUpdatedListComp(domItem: HTMLElement, expense: Expense) {
    
        $(domItem).click(((exp) => {
            
            return (e: JQuery.ClickEvent) => {
                
                const $target = $(e.target);
                const isCategoryIcon = $target.is('.icon,.icon-circle');                    
                if (isCategoryIcon)
                    return;

                this.showExpenseDetail(exp, domItem);                    
            };

        })(expense));

        $(domItem).find('.icon').click(((exp) => {

            return (e: JQuery.ClickEvent) => {   
            
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