export class ModalComponentOptions {
}
export class ModalComponent {
    constructor(options) {
        this.modalId = 'modal-' + new Date().getTime();
        this.options = options || new ModalComponentOptions();
        this.createModal();
    }
    hide() {
        $('#' + this.modalId).remove();
    }
    getRootElement() {
        return $('#' + this.modalId).find('.x-modal');
    }
    createModal() {
        const $template = $('#modal-template').clone();
        $template.attr('id', this.modalId).attr('style', null);
        const zindex = $('.x-modal').length * 10;
        $template.css('z-index', zindex);
        $template.find('.x-close').click((e) => $(e.target).closest('.x-modal-overlay').remove());
        const $userTemplate = $(this.options.dataTemplate);
        if ($userTemplate.length > 0)
            this.fillUsingUserTemplate($template, $userTemplate);
        else
            this.fillUsingOptionsData($template);
        $('body').append($template);
        typeof this.options.onDone === 'function' && this.options.onDone.call(this, $template[0]);
    }
    fillUsingOptionsData($template) {
        $template.find('.x-title').html(this.options.title || '');
        const bodyHtml = typeof this.options.body === 'function' ? this.options.body.call(this) : this.options.body || '';
        if (typeof bodyHtml === 'string')
            $template.find('.x-body').html(bodyHtml);
        else
            $template.find('.x-body').append(bodyHtml);
        const footerHtml = typeof this.options.footer === 'function' ? this.options.footer.call(this) : this.options.footer || '';
        if (typeof footerHtml === 'string')
            $template.find('.x-footer').html(footerHtml);
        else
            $template.find('.x-footer').append(footerHtml);
        const actionsHtml = typeof this.options.actions === 'function' ? this.options.actions.call(this) : this.options.actions || '';
        if (typeof actionsHtml === 'string')
            $template.find('.x-actions').html(actionsHtml);
        else
            $template.find('.x-actions').append(actionsHtml);
    }
    fillUsingUserTemplate($template, $userTemplate) {
        $template.find('.x-title').html($userTemplate.children('.title').html());
        $template.find('.x-actions').html($userTemplate.children('.actions').html());
        $template.find('.x-body').html($userTemplate.children('.body').html());
        $template.find('.x-footer').html($userTemplate.children('.footer').html());
    }
}
//# sourceMappingURL=modal-component.js.map