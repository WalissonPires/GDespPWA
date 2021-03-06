import { CardExpenseComponent } from "./card-expense-component.js";
export class ListExpensesCompoentOptions {
}
export class ListExpensesCompoent {
    constructor(options) {
        this.$root = null;
        this.options = options || new ListExpensesCompoentOptions();
        options.onItemAdded = options.onItemAdded || (() => { });
        this.render();
    }
    addItem(expense) {
        const cardEl = new CardExpenseComponent({ expense: expense });
        const newItemEl = $('<li class="list-item"></li>');
        newItemEl.append(cardEl);
        let $group = this.$root.find(`[data-group-id="${expense.originId}"]`);
        if ($group.length === 0) {
            $group = $(`
                <li class="list-header" data-group-id="${expense.originId}">
                    <span class="title">${expense.origin.name}</span>
                    <span class="total">R$ 0,00</span>
                </li>
            `);
            this.$root.find('.list-card').append($group);
        }
        $(newItemEl).insertAfter($group);
        const $groupTotal = $group.find('.total');
        let total = parseFloat($groupTotal.text().replace('R$ ', '').replace(',', '.'));
        total += expense.price;
        const totalStr = 'R$ ' + total.toFixed(2).replace('.', ',');
        $groupTotal.html(totalStr);
        this.options.onItemAdded.call(this, newItemEl[0], expense);
    }
    updateItem(expense) {
        const cardEl = new CardExpenseComponent({ expense });
        const oldItemEl = this.$root.find(`.card-expense[data-id="${expense.id}"]`).closest('.list-item');
        const newItemEl = $('<li class="list-item"></li>');
        newItemEl.append(cardEl);
        oldItemEl.replaceWith(newItemEl);
        this.options.onItemUpdated.call(this, newItemEl[0], expense);
    }
    removeItem(expense) {
        const oldItemEl = this.$root.find(`.card-expense[data-id="${expense.id}"]`).closest('.list-item');
        oldItemEl.remove();
        const $group = this.$root.find(`[data-group-id="${expense.originId}"]`);
        const $groupTotal = $group.find('.total');
        let total = parseFloat($groupTotal.text().replace('R$ ', '').replace(',', '.'));
        total -= expense.price;
        const totalStr = 'R$ ' + total.toFixed(2).replace('.', ',');
        $groupTotal.html(totalStr);
    }
    getDom() {
        return this.$root[0];
    }
    render() {
        const groupExpenses = {};
        for (let i = 0; i < this.options.expenses.length; i++) {
            const expense = this.options.expenses[i];
            const originId = expense.origin.id;
            if (groupExpenses[originId] === undefined) {
                groupExpenses[originId] = {
                    id: originId,
                    name: expense.origin.name,
                    total: 0,
                    expenses: []
                };
            }
            groupExpenses[originId].expenses.push(expense);
            groupExpenses[originId].total += expense.price;
        }
        const $dom = $('<ul class="list-card"></li>');
        for (var key in groupExpenses) {
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
}
//# sourceMappingURL=list-expense-component.js.map