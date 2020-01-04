import { Expense } from "../core/entities.js";
import { CardExpenseComponent } from "./card-expense-component.js";


export class ListExpensesCompoentOptions {    
    expenses: Expense[];
    onItemAdded: (this: ListExpensesCompoent, domItem: HTMLElement, expense: Expense) => void;
    onItemUpdated: (this: ListExpensesCompoent, domItem: HTMLElement, expense: Expense) => void;
}
    
export class ListExpensesCompoent {
    
    private options: ListExpensesCompoentOptions;        
    private $root: JQuery = null;


    constructor(options: ListExpensesCompoentOptions) {

        this.options = options || new ListExpensesCompoentOptions();
        options.onItemAdded = options.onItemAdded || (() => {});

        this.render();
    }

    
    addItem(expense: Expense) {
        
        const cardEl = new CardExpenseComponent({ expense: expense});
        const newItemEl = $('<li class="list-item"></li>');
        newItemEl.append(cardEl);

        const $group = this.$root.find(`[data-group-id="${expense.originId}"]`);
        $(newItemEl).insertAfter($group);

        const $groupTotal = $group.find('.total');
        let total = parseFloat($groupTotal.text().replace('R$ ', '').replace(',', '.'));
        total += expense.price;

        const totalStr = 'R$ ' + total.toFixed(2).replace('.', ',');
        $groupTotal.html(totalStr);

        this.options.onItemAdded.call(this, newItemEl[0], expense); 
    }

    updateItem(expense: Expense) {

        const cardEl = new CardExpenseComponent({expense});
        const oldItemEl = this.$root.find(`.card-expense[data-id="${expense.id}"]`).closest('.list-item');
        
        const newItemEl = $('<li class="list-item"></li>');
        newItemEl.append(cardEl);

        oldItemEl.replaceWith(newItemEl);
        this.options.onItemUpdated.call(this, newItemEl[0], expense);
    }

    getDom() {

        return this.$root[0];
    }


    render() {

        const groupExpenses: { [prop: number]: GroupExpense } = {};

        for (let i = 0; i < this.options.expenses.length; i++) {

            const expense = this.options.expenses[i];
            const originId = expense.origin.id;

            if (groupExpenses[originId] === undefined) {
                groupExpenses[originId] = {
                    id: originId,
                    name: expense.origin.name,
                    total: 0,
                    expenses: []
                } as GroupExpense;
            }

            groupExpenses[originId].expenses.push(expense);
            groupExpenses[originId].total += expense.price;
        }

        const $dom = $('<ul class="list-card"></li>');

        for(var key in groupExpenses) {

            const group = groupExpenses[key];
            const groupPrice = 'R$ ' + group.total.toFixed(2).replace('.', ',');

            $dom.append(`
            <li class="list-header" data-group-id="${group.id}">
                <span class="title">${group.name}</span>
                <span class="total">${groupPrice}</span>
            </li>
            `);

            for (let i = 0; i < group.expenses.length; i++) {

                const expense = group.expenses[i];

                const $item = $('<li class="list-item"></li>');
                $item.append(new CardExpenseComponent({ expense: expense }));
                $dom.append($item);

                this.options.onItemAdded.call(this, $item[0], expense);
            }
        }

        this.$root = $('<div class="card p-0"></div>').append($dom);
    }

}

class GroupExpense {
    id: number;
    name: string;
    total: number;
    expenses: Expense[];
}