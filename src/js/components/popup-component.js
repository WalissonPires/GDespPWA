(function(){

    /**
    * options
    {
            target: string | JQuery | HtmlElement,
            onPrepare: ($popup, $toggle) => void,
            onReady: ($popupMenuElement) => void,
            onClose: () => void,
    }

    *  sample:
        new PopupMenu({
            target: '.popup-toggle',        
            onReady: ($popup, $toggle) => {

                $popup.click(() => alert('click'));
            }
        })
    */
    var PopupMenu = function (options) {

        var _this = this;

        function constructor() {

            options = options || {};

            if (options.target === undefined)
                throw new Error('Informe o elemento target');
            
            $(options.target).on('click', handlePopupToggleClick);
        }

        function handlePopupToggleClick(e) {

            console.log('toggle', e);

            var $toggle = $(e.target);
            var $popup = $toggle.closest('.popup-content').find('.popup-menu').clone();
            if ($popup.length === 0)
                return;

            if (typeof options.onPrepare === 'function')
                options.onPrepare.call(_this, $popup, $toggle);
                
            var $popupOverlay = $('<div class="popup-overlay"></div>');
            $popupOverlay.click(handleOverlayClick); 
            $popupOverlay.append($popup);
            $popupOverlay.appendTo(document.body);    

            var posX = e.pageX;
            var posY = e.pageY + $toggle[0].offsetHeight ;

            if (posX + $popup[0].offsetWidth > $(window).width())
                posX = $(window).width() - $popup[0].offsetWidth - 5/*space free*/;	

            $popup.css('top', posY);
            $popup.css('left', posX);
            $popup.css('display', 'block');

            if (typeof options.onReady === 'function')
                options.onReady.call(_this, $popup, $toggle);
        }

        function handleOverlayClick(e) {

            if (!$(e.target).is('.popup-overlay'))
                return;

            $(e.target).remove();

            if (typeof options.onClose === 'function')
                options.onClose.call(_this);
        }


        this.hide = function() {

            $('.popup-overlay').remove();

            if (typeof options.onClose === 'function')
                options.onClose.call(_this);
        };


        constructor();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Components').PopupMenu = PopupMenu;
})();