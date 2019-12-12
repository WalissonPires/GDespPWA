(function(){

    /***     
     * @param {any} options 
     * {
     *      expenses: Expense[],
     *      onItemAdded: function(domItem, expense) // this is ListExpensesCompoent
     *      onItemUpdated: function(domItem, expense) // this is ListExpensesCompoent
     * }
     */
    var ListExpensesCompoent = function(options) {

        const self = this;
        const groupExpenses = {};
        let $root = null;


        function constructor() {

            options = options || {};
            options.onItemAdded = options.onItemAdded || function() {};

            render();
        }

        this.addItem = function(expense) {
            
            const cardEl = new App.Components.CardExpenseComponent({expense});
            const newItemEl = $('<li class="list-item"></li>');
            newItemEl.append(cardEl);

            const $group = $root.find(`[data-group-id="${expense.originId}"]`);
            $(newItemEl).insertAfter($group);

            const $groupTotal = $group.find('.total');
            let total = parseFloat($groupTotal.text().replace('R$ ', '').replace(',', '.'));
            total += expense.price;

            total = 'R$ ' + total.toFixed(2).replace('.', ',');
            $groupTotal.html(total);
        };

        this.updateItem = function(expense) {

            const cardEl = new App.Components.CardExpenseComponent({expense});
            const oldItemEl = $root.find(`.card-expense[data-id="${expense.id}"]`).closest('.list-item');
            
            const newItemEl = $('<li class="list-item"></li>');
            newItemEl.append(cardEl);

            oldItemEl.replaceWith(newItemEl);
            options.onItemAdded.call(self, newItemEl[0], expense);
        }

        this.getDom = function() {

            return $root[0];
        };


        function render() {

            for (let i = 0; i < options.expenses.length; i++) {

                const expense = options.expenses[i];
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

            $dom = $('<ul class="list-card"></li>');

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
                    $item.append(new App.Components.CardExpenseComponent({ expense: expense }));
                    $dom.append($item);

                    options.onItemAdded.call(self, $item[0], expense);
                }
            }

            $root = $('<div class="card p-0"></div>').append($dom);
        }


        constructor();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Components').ListExpensesCompoent = ListExpensesCompoent;
})();