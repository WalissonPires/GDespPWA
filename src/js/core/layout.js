(function(){

    var Layout = function() {

        const $monthEl = $('[name="monthExpenses"]');

        function init () {

            $monthEl.val(localStorage.monthExpenses || '1');

            bindEvents();
        }

        function bindEvents() {

            $('.btn-menu').click(() => $('.main').toggleClass('nav-show'));
            $('.bkgd-overlay,[data-page]').click(() =>  $('.main').removeClass('nav-show'));
            $('[data-page]').click(handleMenuPage);
        
            $monthEl.change((e) => {
        
                localStorage.monthExpenses = $(e.target).val();                       
            });
        }

        function handleMenuPage(e) {

            var $item = $(e.target).is('[data-page]') ? $(e.target) : $(e.target).closest('[data-page]');

            var pageName = $item.attr('data-page');

            if (pageName === undefined || pageName === '') {
                console.warn('Could not get page name');
                return;
            }

            if (App.Utils.Pages.instances[pageName] === undefined)
                App.Utils.Pages.createPage(pageName);
            else
                App.Utils.Pages.activePage(pageName);
        }

        init();
    };    

    Layout.getMonthYear = function() {

        return {
            month: parseInt($('[name="monthExpenses"]').val()),
            year: 2019
        };
    };        


    Layout.LOADING_HTML = '<div class="wrapper-loader"><div class="loader"></div></div>';
    Layout.LOADING_SELECTOR = '.wrapper-loader';

    Layout.LOADING_BAR_HTML = '<div class="loading-bar"><div class="x-bar"></div></div>';
    Layout.LOADING_BAR_SELECTOR = '.loading-bar';

    Layout.NETWORK_ERROR = '<p class="danger__color p-3">Falha ao carregar dados. Verifique sua conexão com a internet</p>';

    App.Layout = Layout;    
})();