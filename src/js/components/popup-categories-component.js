(function(){

    /*** 
     * @param {any} opcoes
     * {
     *      target: string | JQuery | HTMLElement;
     *      onSelected: (category) => void;
     * }
     */
    var PopupCategoriesComponent = function(opcoes) {

        opcoes = opcoes || {};
        let _popup = null;
        let _popupEl = null;


        function constructor() {

            createPopupContent();
            createPopup();
            downloadCategories();
        }

        function createPopupContent() {

            const $toggle = $(opcoes.target);

            if ($toggle.length === 0)
                throw new Error('Target não encontrado');            

            _popupEl = $(`
            <div class="popup-content popup-categories">                                            
                <button class="popup-toggle"></button>
                <div class="popup-menu"></div>
            </div>   
            `);
            
            _popupEl
                .css('position', 'absolute')
                .css('top', $toggle[0].offsetHeight)
                .css('left', $toggle[0].offsetWidth);
        }


        function createPopup() {

            _popup = new App.Components.PopupMenu({
                target: _popupEl.find('.popup-toggle'),
                onPrepare: ($popup) => $popup.addClass('popup-list'),
                onReady: function bindedThis($popup) {

                    const popupComp = this;

                    $popup.find('.popup-item').click((e) => {

                        const $item = $(e.currentTarget);

                        const category = {
                            id: $item.find('[data-id]').attr('data-id'),
                            name: $item.find('[name="category.name"]').text(),
                            color: $item.find('[data-color]').attr('data-color'),
                            iconCircle: $item.find('.icon-circle').clone().removeClass('mr-3')
                        }

                        if (typeof opcoes.onSelected === 'function')
                            opcoes.onSelected(category);
                        
                        popupComp.hide();
                    });
                }                
            });
        }


        function downloadCategories() {

            //let calledCategories = false;

            const categoriesPromises = new App.Services.CategoriesApi().getAll();
                App.Utils.FetchUtils.treatEachResponse(categoriesPromises, 
                    function bindedThis(categories) {

                        // if (calledCategories) 
                        //     return;

                        // calledCategories = true;
                       
                        const $popupContent = _popupEl.find('.popup-menu');                        

                        for(const cat of categories) {

                            $popupContent.append(`<span class="popup-item"><span class="icon-circle mr-3" style="font-size: .9em; background-color: ${cat.color}">${cat.name[0]}</span><span name="category.name" data-id="${cat.id}" data-color="${cat.color}">${cat.name}</span></span>`);
                        }  
                        
                        _popupEl.find('.popup-toggle').click();
                    },
                    (error) => {

                        App.Utils.Toast.error('Falha ao baixar categorias. ' + error.message);
                    });
        }


        constructor();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Components').PopupCategoriesComponent = PopupCategoriesComponent;
})();