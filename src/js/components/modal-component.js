(function(){

    /***     
     * @param {any} options
     * {
     *      title: string,
     *      body: string | HTMLElement | function() { return string | HTMLElement },
     *      footer: string | HTMLElement | function() { return string | HTMLElement },
     *      actions: string | HTMLElement | function() { return string | HTMLElement },
     *      dataTemplate: selector | HTMLElement,
     *      onDone: function(modalElement) {}
     * } 
     */
    var ModalComponent = function(options) {

        options = options || {};
        const modalId = 'modal-' + new Date().getTime();


        function createModal() {

            var $template = $('#modal-template').clone();
            $template.attr('id', modalId).attr('style', null);

            const zindex = $('.x-modal').length * 10;
            $template.css('z-index', zindex);

            $template.find('.x-close').click((e) => $(e.target).closest('.x-modal-overlay').remove());

            const $userTemplate = $(options.dataTemplate);
            if ($userTemplate.length > 0)
                fillUsingUserTemplate($template, $userTemplate);
            else
                fillUsingOptionsData($template);

            $('body').append($template);

            typeof options.onDone === 'function' && options.onDone.call(this, $template[0]);
        }
        
        function fillUsingOptionsData($template) {

            $template.find('.x-title').html(options.title || '');
            

            const bodyHtml = typeof options.body === 'function' ? options.body.call(this) : options.body || '';
            if (typeof bodyHtml === 'string')
                $template.find('.x-body').html(bodyHtml);
            else
                $template.find('.x-body').append(bodyHtml);

            const footerHtml = typeof options.footer === 'function' ? options.footer.call(this) : options.footer || '';
            if (typeof footerHtml === 'string')
                $template.find('.x-footer').html(footerHtml);
            else
                $template.find('.x-footer').append(footerHtml);

            const actionsHtml = typeof options.actions === 'function' ? options.actions.call(this) : options.actions || '';
            if (typeof actionsHtml === 'string')
                $template.find('.x-actions').html(actionsHtml);
            else
                $template.find('.x-actions').append(actionsHtml);

        }

        function fillUsingUserTemplate($template, $userTemplate) {

            $template.find('.x-title').html($userTemplate.children('.title').html());
            $template.find('.x-actions').html($userTemplate.children('.actions').html());
            $template.find('.x-body').html($userTemplate.children('.body').html());
            $template.find('.x-footer').html($userTemplate.children('.footer').html());
        }        


        this.hide = function() {

            $('#' + modalId).remove();
        }

        this.getRootElement = function() {

            return $('#' + modalId).find('.x-modal');
        }


        createModal();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Components').ModalComponent = ModalComponent;

})();