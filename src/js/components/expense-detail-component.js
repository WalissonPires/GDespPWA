(function(){

    /***     
     * @param {any} options 
     * {
     *      expense: Expense
     * }
     */
    var ExpenseDetailComponent = function(options) {

        options = options || {};

        const modal = new App.Components.ModalComponent({
            dataTemplate: '#modal-expense-template',
            onDone: modalDone
        });

        function modalDone(modalEl) {

            let called = false;

            new App.Services.MembersApi().getAll()            
            .then(promises => { 
                
                promises.forEach(x => {

                    x.then(membersList => {
                    
                        if (called)
                            return;
                        
                        called = true;                
                        loadData(modalEl, membersList);
                        bindEvents(modalEl);
                    });
                })
            })            
            .catch(() => {

                modal.hide();
                alert('Falha ao baixar dados');
            });

        }

        function loadData(modalEl, membersList) {

            console.log('[CARREGANDO DADOS DA DESPESA NO HTML]');

            const $m = $(modalEl);
            const exp = options.expense;

            $m.find('[name="id"]').val(exp.id);
            $m.find('[name="categoryId"]').val(exp.category && exp.category.id);
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

            console.log('loadData', options.expense);
            console.log('modal', modalEl);
        }

        function bindEvents(modalEl) {

            const $m = $(modalEl);

            $m.find('[name="save"]').click(handleSaveData);
            $m.find('.card-members .body .member:not([id]) .selecao').change(handleMemberSelection);
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
            
            var expense = {
                id: $m.find('[name="id"]').val(),
                categoryId: $m.find('[name="categoryId"]').val(),
                originId: $m.find('[name="originId"]').val(),
                description: $m.find('[name="description"]').val(),
                price: $m.find('[name="price"]').val().replace(',', '.'),
                members: []
            };

            $m.find('.card-members .body .member:not([id])').each((i, el) => {

                const $el = $(el);

                if (!$el.find('.selecao')[0].checked)
                    return;

                expense.members.push({
                    id: $el.find('[name="id"]').val() || 0,
                    price: $el.find('.value').text().replace('R$ ', '').replace(',', '.'),
                    guestId: $el.find('[name="guestId"]').val() || null,
                    userId: $el.find('[name="userId"]').val() || null
                });
            });

            const expApi = new App.Services.ExpensesApi();
            const $btnSave = $m.find('[name="save"]');

            $btnSave.attr('disabled', 'disabled');

            try {
                expApi.updatePartial(expense)
                    .then((data) => {
                        
                        $btnSave.attr('disabled', null);
                    })
                    .catch((error) => {
                        console.log('Falha ao salvar dados da despesa', error);
                        alert('Falha ao salvar dados da despesa');
                    })
                    .finally(() => $btnSave.attr('disabled', null));

                expApi.updateMembers(expense.id, expense.members)
                    .then((data) => {
                        
                        $btnSave.attr('disabled', null);
                    })
                    .catch((error) => {
                        console.log('Falha ao salvar dados dos membros', error);
                        alert('Falha ao salvar dados dos membros');
                    })
                    .finally(() => $btnSave.attr('disabled', null));
            }
            catch (ex) {
                $btnSave.attr('disabled', null);
                alert('Falha ao salvar dados: ' + ex.message)
            }
        }
    };


    App.Utils.Namespace.CreateIfNotExists('App.Components').ExpenseDetailComponent = ExpenseDetailComponent;
})();