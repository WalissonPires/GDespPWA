(function () {

    /***     
     * @param {any} options 
     * {
     *      expense: Expense,
     *      onSave: function(data) {},
     *      onDelete: function (data) {}
     * }
     */
    var ExpenseDetailComponent = function (options) {

        options = options || {};
        const self = this;      
        let modalEl = null;
        
        const modal = new App.Components.ModalComponent({
            dataTemplate: '#modal-expense-template',
            onDone: modalDone
        });

        function modalDone(_modalEl) {

            modalEl = _modalEl;               

            initPopupCategories();
            loadMembers();
        }
    
        function initPopupCategories() {

            $(modalEl).find('.popup-categories .popup-toggle').click(e => {

                new App.Components.PopupCategoriesComponent({
                    target: e.currentTarget,
                    onSelected: (category) => {

                        const $popupContent = $(modalEl).find('.popup-categories');
                            
                        $popupContent.find('[name="category.id"]').val(category.id);
                        $popupContent.find('[name="category.name"]').val(category.name);
                        $popupContent.find('[name="category.color"]').val(category.color);
                        $popupContent.find('.popup-toggle').html(category.iconCircle);
                    }
                });

            });   
        }

        function loadMembers() {

            let calledMembers = false;

            new App.Services.MembersApi().getAll()
                .then(promises => {

                    promises.forEach(x => {

                        x.then(membersList => {

                            if (calledMembers)
                                return;

                            calledMembers = true;
                            loadData(modalEl, membersList);
                            bindEvents(modalEl);

                            const $m = $(modalEl);
                            $m.find('.wrapper-loader').remove();
                            $m.find('.wrapper-body').attr('style', null);
                            $m.find('[name="save"]').attr('disabled', null);
                        });
                    })
                })
                .catch(() => {

                    modal.hide();
                    App.Utils.Toast.error('Falha ao baixar dados');
                });
        }

        function loadData(modalEl, membersList) {

            const $m = $(modalEl);
            const exp = options.expense;

            $m.find('[name="id"]').val(exp.id);
            if (exp.category) {
                $m.find('[name="category.id"]').val(exp.category.id);
                $m.find('[name="category.name"]').val(exp.category.name);
                $m.find('[name="category.color"]').val(exp.category.color);
                $m.find('.popup-categories .popup-toggle .icon-circle')
                    .css('background-color', exp.category.color).html(exp.category.name[0]);
            }
            $m.find('[name="originId"]').val(exp.origin && exp.origin.id);
            $m.find('[name="description"]').val(exp.description);
            $m.find('[name="price"]').val(exp.price);
            $m.find('[name="dueDate"]').val(exp.dueDate.split('T')[0]);
            exp.totalInstallment > 1 && $m.find('.portion')
                .html(exp.currentInstallment + '/' + exp.totalInstallment);

            const members = exp.members.slice();
            membersList.forEach(x => {

                if (members.find(y => (y.guestId !== null && y.guestId === x.guestId)
                    || (y.userId !== null && y.userId === x.userId)))
                    return;

                members.push({
                    id: x.id,
                    name: x.name,
                    price: 0,
                    userId: x.userId,
                    guestId: x.guestId,
                });
            });
            members.sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1);

            const $memberTemplate = $('#expense-member-template');
            const $membersContent = $m.find('.card-members > .body');

            members.forEach((x) => {

                const $memberEl = $memberTemplate.clone().attr('id', null).attr('style', null);

                $memberEl.find('[name="id"]').val(x.id);
                $memberEl.find('[name="userId"]').val(x.userId);
                $memberEl.find('[name="guestId"]').val(x.guestId);
                $memberEl.find('.selecao')[0].checked = x.price > 0;
                $memberEl.find('.name').html(x.name);
                $memberEl.find('.value').html('R$ ' + x.price);

                $membersContent.append($memberEl);
            });
        }

        function bindEvents(modalEl) {

            const $m = $(modalEl);

            $m.find('[name="save"]').click(handleSaveData);
            $m.find('[name="delete"]').click(handleDeleteExpense);
            $m.find('.card-members .body .member:not([id])').click(handleMemberClick);
            $m.find('.card-members .body .member:not([id]) .selecao').change(handleMemberSelection);
        }

        function getExpenseOfDom() {

            const $m = $(modal.getRootElement());
            const $cardExp = $m.find('.card-expense');

            const expense = {
                id: $cardExp.find('[name="id"]').val(),
                categoryId: $cardExp.find('[name="category.id"]').val(),
                category: {
                    id: $cardExp.find('[name="category.id"]').val(),
                    name: $cardExp.find('[name="category.name"]').val(),
                    color: $cardExp.find('[name="category.color"]').val()
                },
                originId: $cardExp.find('[name="originId"]').val(),
                description: $cardExp.find('[name="description"]').val(),
                price: parseFloat($cardExp.find('[name="price"]').val().replace(',', '.')),
                members: []
            };

            $m.find('.card-members .body .member:not([id])').each((i, el) => {

                const $el = $(el);

                if (!$el.find('.selecao')[0].checked)
                    return;

                expense.members.push({
                    id: parseInt($el.find('[name="id"]').val()) || 0,
                    name: $el.find('.name').text(),
                    price: parseFloat($el.find('.value').text().replace('R$ ', '').replace(',', '.')),
                    guestId: parseInt($el.find('[name="guestId"]').val()) || null,
                    userId: parseInt($el.find('[name="userId"]').val()) || null
                });
            });

            return expense;
        }

        function handleMemberClick(e) {

            const $check = $(e.currentTarget).find('.selecao');
            $check[0].checked = !$check[0].checked;
            $check.change();
        }

        function handleMemberSelection() {

            const $m = $(modal.getRootElement());

            const selecteds = $m.find('.card-members .body .member:not([id]) .selecao:checked').length;

            if (selecteds === 0) {
                $m.find('.card-members .body .member:not([id]) .value').html('R$ 0');
                return;
            }

            const price = parseFloat($m.find('[name="price"]').val().replace(',', '.'));
            const partial = price / selecteds;

            $m.find('.card-members .body .member:not([id])').each((i, el) => {

                const $el = $(el);
                if ($el.find('.selecao')[0].checked)
                    $el.find('.value').html('R$ ' + partial.toFixed(2).replace('.', ','));
                else
                    $el.find('.value').html('R$ 0');
            });
        }

        function handleSaveData() {

            const $m = $(modal.getRootElement());
            const expense = getExpenseOfDom();
            const expApi = new App.Services.ExpensesApi();
            const $btnSave = $m.find('[name="save"]');

            $btnSave.attr('disabled', 'disabled');
            App.Utils.Toast.info('Salvando dados...');
            try {

                const promises = [
                    expApi.updatePartial(expense),
                    expApi.updateMembers(expense.id, expense.members)
                ];

                Promise.all(promises)
                    .then((data) => {

                        $btnSave.attr('disabled', null);
                        App.Utils.Toast.success('Dados salvos');

                        if (typeof options.onSave === 'function') {
                            const exp = Object.assign({}, options.expense, getExpenseOfDom());

                            options.onSave.call(self, exp);
                            modal.hide();
                        }
                    })
                    .catch((error) => {
                        console.log('Falha ao salvar dados da despesa', error);
                        App.Utils.Toast.error('Falha ao salvar dados da despesa: ' + error.message);
                    })
                    .finally(() => $btnSave.attr('disabled', null));
            }
            catch (ex) {
                $btnSave.attr('disabled', null);
                App.Utils.Toast.error('Falha ao salvar dados: ' + ex.message)
            }
        }

        function handleDeleteExpense() {

            if (!confirm('Tem certeza que deseja excluir essa despesa?'))
                return;

            const $m = $(modal.getRootElement());
            const expenseId = $m.find('.card-expense [name="id"]').val();
            const $btnDel = $m.find('[name="delete"]');
            const expApi = new App.Services.ExpensesApi();

            $btnDel.attr('disabled', 'disabled');
            App.Utils.Toast.info('Deletando despesa...');

            try {

                expApi.delete(expenseId)
                    .then((data) => {

                        //$btnDel.attr('disabled', null);
                        App.Utils.Toast.success('Despesa deletada');

                        typeof options.onDelete === 'function' && options.onDelete.call(self, getExpenseOfDom());
                        modal.hide();
                    })
                    .catch((error) => {
                        console.log('Falha ao deletar despesa', error);
                        App.Utils.Toast.error('Falha ao deletar despesa: ' + error.message);
                    })
                    ;//.finally(() => $btnDel.attr('disabled', null)); 
            }
            catch (ex) {
                $btnDel.attr('disabled', null);
                App.Utils.Toast.error('Falha ao deletar despesa: ' + ex.message)
            }
        }
    };


    App.Utils.Namespace.CreateIfNotExists('App.Components').ExpenseDetailComponent = ExpenseDetailComponent;
})();