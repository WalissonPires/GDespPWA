(function(){

    /***     
     * @param {any} options 
     * {
     *      expenses: Expense[],
     *      onItemAdded: function(domItem, expense) // this is ListExpensesCompoent
     * }
     */
    var ListExpensesCompoent = function(options) {

        const self = this;
        var groupExpenses = {};
        options = options || {};
        options.onItemAdded = options.onItemAdded || function() {};

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

        var $dom = $('<ul class="list-card"></li>');

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

        return $('<div class="card p-0"></div>').append($dom)[0];
    };

    App.Utils.Namespace.CreateIfNotExists('App.Components').ListExpensesCompoent = ListExpensesCompoent;
})();