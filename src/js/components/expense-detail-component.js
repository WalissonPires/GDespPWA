import { Toast } from "../core/toast.js";
import { ModalComponent } from "./modal-component.js";
import { PopupCategoriesComponent } from "./popup-categories-component.js";
import { MembersApi } from "../services/members-api.js";
import { ExpensesApi } from "../services/expenses-api.js";
export class ExpenseDetailComponentOptions {
}
export class ExpenseDetailComponent {
    constructor(options) {
        this.modalEl = null;
        this.options = options || new ExpenseDetailComponentOptions();
        this.modal = new ModalComponent({
            dataTemplate: '#modal-expense-template',
            onDone: this.modalDone.bind(this)
        });
    }
    modalDone(_modalEl) {
        this.modalEl = _modalEl;
        this.isNewExpense = this.options.expense === undefined;
        if (this.isNewExpense) {
            $(this.modalEl).find('.card-members').css('display', 'none');
        }
        this.initPopupCategories();
        this.loadMembers();
    }
    initPopupCategories() {
        $(this.modalEl).find('.popup-categories .popup-toggle').click(e => {
            new PopupCategoriesComponent({
                target: e.currentTarget,
                onSelected: (category) => {
                    const $popupContent = $(this.modalEl).find('.popup-categories');
                    $popupContent.find('[name="category.id"]').val(category.id);
                    $popupContent.find('[name="category.name"]').val(category.name);
                    $popupContent.find('[name="category.color"]').val(category.color);
                    $popupContent.find('.popup-toggle').empty().append(category.iconCircle);
                }
            });
        });
    }
    loadMembers() {
        let calledMembers = false;
        new MembersApi().getAll()
            .then(promises => {
            promises.forEach(x => {
                x.then(membersList => {
                    if (calledMembers)
                        return;
                    calledMembers = true;
                    this.options.expense && this.loadDataExpense(this.modalEl);
                    this.loadDataMembers(this.modalEl, membersList, this.options.expense && this.options.expense.members);
                    this.bindEvents(this.modalEl);
                    const $m = $(this.modalEl);
                    $m.find('.wrapper-loader').remove();
                    $m.find('.wrapper-body').attr('style', null);
                    $m.find('[name="save"]').attr('disabled', null);
                });
            });
        })
            .catch(() => {
            this.modal.hide();
            Toast.error('Falha ao baixar dados');
        });
    }
    loadDataExpense(modalEl) {
        const $m = $(modalEl);
        const exp = this.options.expense;
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
        exp.totalInstallments > 1 && $m.find('.portion')
            .html(exp.currentInstallment + '/' + exp.totalInstallments);
    }
    loadDataMembers(modalEl, membersList, expenseMembers) {
        const $m = $(modalEl);
        // load members data
        const members = expenseMembers || [];
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
                userGuestId: undefined
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
    bindEvents(modalEl) {
        const $m = $(modalEl);
        $m.find('[name="save"]').click(this.handleSaveData.bind(this));
        $m.find('[name="delete"]').click(this.handleDeleteExpense.bind(this));
        $m.find('.card-members .body .member:not([id])').click(this.handleMemberClick.bind(this));
        $m.find('.card-members .body .member:not([id]) .selecao').change(this.handleMemberSelection.bind(this));
    }
    getExpenseOfDom() {
        const $m = $(this.modal.getRootElement());
        const $cardExp = $m.find('.card-expense');
        const viewExpense = {
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
            dueDate: $cardExp.find('[name="dueDate"]').val(),
            members: []
        };
        const expense = Object.assign(Object.assign({}, this.options.expense), viewExpense);
        $m.find('.card-members .body .member:not([id])').each((i, el) => {
            const $el = $(el);
            if (!$el.find('.selecao')[0].checked)
                return;
            expense.members.push({
                id: parseInt($el.find('[name="id"]').val()) || 0,
                name: $el.find('.name').text(),
                price: parseFloat($el.find('.value').text().replace('R$ ', '').replace(',', '.')),
                guestId: (parseInt($el.find('[name="guestId"]').val()) || null),
                userId: parseInt($el.find('[name="userId"]').val()) || null,
                userGuestId: undefined
            });
        });
        return expense;
    }
    validateExpense(expense) {
        let isValid = true;
        if (!expense.categoryId) {
            Toast.warn('Selecione um categoria');
            return false;
        }
        if (!expense.description) {
            Toast.warn('Informe a descrição');
            return false;
        }
        if (!expense.price) {
            Toast.warn('Informe o valor');
            return false;
        }
        if (!expense.dueDate) {
            Toast.warn('Informe a data de vencimento');
            return false;
        }
        return isValid;
    }
    handleMemberClick(e) {
        const $check = $(e.currentTarget).find('.selecao');
        $check[0].checked = !$check[0].checked;
        $check.change();
    }
    handleMemberSelection() {
        const $m = $(this.modal.getRootElement());
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
    handleSaveData() {
        const $m = $(this.modal.getRootElement());
        const expense = this.getExpenseOfDom();
        const expApi = new ExpensesApi();
        const $btnSave = $m.find('[name="save"]');
        try {
            let promises;
            if (this.isNewExpense) {
                if (!this.validateExpense(expense))
                    return;
                expense.purchaseDate = new Date().toISOString();
                promises = [
                    expApi.create(expense)
                ];
            }
            else {
                promises = [
                    expApi.updatePartial(expense),
                    expApi.updateMembers(expense.id, expense.members)
                ];
            }
            $btnSave.attr('disabled', 'disabled');
            Toast.info('Salvando dados...');
            Promise.all(promises)
                .then((data) => {
                $btnSave.attr('disabled', null);
                Toast.success('Dados salvos');
                if (typeof this.options.onSave === 'function') {
                    const expCreated = (this.isNewExpense ? data[0] : null);
                    const exp = Object.assign({}, this.options.expense, this.getExpenseOfDom(), expCreated);
                    this.options.onSave.call(this, exp, this.isNewExpense);
                    this.modal.hide();
                }
            })
                .catch((error) => {
                console.log('Falha ao salvar dados da despesa', error);
                Toast.error('Falha ao salvar dados da despesa: ' + error.message);
            })
                .finally(() => $btnSave.attr('disabled', null));
        }
        catch (ex) {
            $btnSave.attr('disabled', null);
            Toast.error('Falha ao salvar dados: ' + ex.message);
        }
    }
    handleDeleteExpense() {
        if (!confirm('Tem certeza que deseja excluir essa despesa?'))
            return;
        const $m = $(this.modal.getRootElement());
        const expenseId = $m.find('.card-expense [name="id"]').val();
        const $btnDel = $m.find('[name="delete"]');
        const expApi = new ExpensesApi();
        $btnDel.attr('disabled', 'disabled');
        Toast.info('Deletando despesa...');
        try {
            expApi.delete(expenseId)
                .then(() => {
                //$btnDel.attr('disabled', null);
                Toast.success('Despesa deletada');
                typeof this.options.onDelete === 'function' && this.options.onDelete.call(this, this.getExpenseOfDom());
                this.modal.hide();
            })
                .catch((error) => {
                console.log('Falha ao deletar despesa', error);
                Toast.error('Falha ao deletar despesa: ' + error.message);
            }); //.finally(() => $btnDel.attr('disabled', null)); 
        }
        catch (ex) {
            $btnDel.attr('disabled', null);
            Toast.error('Falha ao deletar despesa: ' + ex.message);
        }
    }
}
//# sourceMappingURL=expense-detail-component.js.map