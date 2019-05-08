(function(){

    /***     
     * @param {any} options 
     * {
     *      expense: Expense
     * }
     */
    var ExpenseDetailComponent = function(options) {

        options = options || {};

        new App.Components.ModalComponent({
            dataTemplate: '#modal-expense-template',
            onDone: modalDone
        });

        function modalDone(modalEl) {

            let called = false;

            new App.Services.MembersApi().getAll().forEach(x => {

                x.then(membersList => {
                
                    if (called)
                        return;
                    
                    called = true;                
                    loadData(modalEl, membersList);
                });
            });

        }

        function loadData(modalEl, membersList) {

            console.log('[CARREGANDO DADOS DA DESPESA NO HTML]');

            const $m = $(modalEl);
            const exp = options.expense;

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

                $memberEl.attr('data-id', x.id);
                $memberEl.attr('data-user-id', x.userId);
                $memberEl.attr('data-guest-id', x.guestId);
                $memberEl.find('.selecao')[0].checked = x.price > 0;
                $memberEl.find('.name').html(x.name);
                $memberEl.find('.value').html('R$ ' + x.price);                

                $membersContent.append($memberEl);
            });

            console.log('loadData', options.expense);
            console.log('modal', modalEl);
        }
    };


    App.Utils.Namespace.CreateIfNotExists('App.Components').ExpenseDetailComponent = ExpenseDetailComponent;
})();