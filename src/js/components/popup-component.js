export class PopupMenuOptions {
}
export class PopupMenu {
    constructor(options) {
        this.options = options || {};
        if (options.target === undefined)
            throw new Error('Informe o elemento target');
        $(this.options.target).click(this.handlePopupToggleClick.bind(this));
    }
    hide() {
        $('.popup-overlay').remove();
        if (typeof this.options.onClose === 'function')
            this.options.onClose.call(this);
    }
    handlePopupToggleClick(e) {
        console.log('toggle', e);
        const $toggle = $(e.target);
        const $popup = $toggle.closest('.popup-content').find('.popup-menu').clone();
        if ($popup.length === 0)
            return;
        if (typeof this.options.onPrepare === 'function')
            this.options.onPrepare.call(this, $popup, $toggle);
        const $popupOverlay = $('<div class="popup-overlay"></div>');
        $popupOverlay.click(this.handleOverlayClick.bind(this));
        $popupOverlay.append($popup);
        $popupOverlay.appendTo(document.body);
        $popup.css('display', 'block'); //exibir aqui para obter as dimensões corretas
        const popupOffsetWidth = $popup[0].offsetWidth;
        const popupOffsetHeight = $toggle[0].offsetHeight;
        let posX = e.pageX;
        let posY = e.pageY + popupOffsetHeight;
        const windowWidth = $(window).width();
        if (isNaN(parseFloat(posX)) || isNaN(parseFloat(posY))) {
            posX = windowWidth / 2 - $popup.width() / 2;
            posY = 100;
        }
        if (posX + popupOffsetWidth > windowWidth)
            posX = windowWidth - popupOffsetWidth - 5 /*space free*/;
        $popup.css('top', posY);
        $popup.css('left', posX);
        //$popup.css('display', 'block');
        if (typeof this.options.onReady === 'function')
            this.options.onReady.call(this, $popup, $toggle);
    }
    handleOverlayClick(e) {
        if (!$(e.target).is('.popup-overlay'))
            return;
        $(e.target).remove();
        if (typeof this.options.onClose === 'function')
            this.options.onClose.call(this);
    }
}
//# sourceMappingURL=popup-component.js.map