(function(){

    var Layout = function() {

        const $monthYearEl = $('[name="monthYearFilter"]');

        function init () {

            var currentDate = new Date();
            var month = localStorage.monthExpenses || (currentDate.getMonth() + 1);
            var year = localStorage.yearExpenses || currentDate.getFullYear();

            $monthYearEl.data('month', month);
            $monthYearEl.data('year', year);

            var monthName = $monthYearEl.closest('.popup-content').find('[name="monthExpenses"] option[value="' + month + '"]').text();
            updateMonthYearText(monthName, year);

            bindEvents();
        }

        function bindEvents() {

            $('.btn-menu').click(() => $('.main').toggleClass('nav-show'));
            $('.bkgd-overlay,[data-page]').click(() =>  $('.main').removeClass('nav-show'));
            $('[data-page]').click(handleMenuPage);            

            new App.Components.PopupMenu({
                target: $monthYearEl,
                onPrepare: ($popup, $toggle) => {

                    $popup.addClass('monthYear');

                    var $selYear = $popup.find('[name="yearExpenses"]')
                    var currentYear = new Date().getFullYear();
                    for (let i = currentYear - 5, len = currentYear + 5; i <= len; i++) {

                        $selYear.append(new Option(i, i));
                    }
                },
                onReady: ($popup, $toggle) => {
        
                    $popup.find('[name="monthExpenses"]').val(localStorage.monthExpenses);
                    $popup.find('[name="yearExpenses"]').val(localStorage.yearExpenses);                    

                    $popup.find('select').change(function(e) {

                        var $content = $(e.target).parent();

                        var month = $content.find('[name="monthExpenses"]').val();
                        var year = $content.find('[name="yearExpenses"]').val();

                        localStorage.monthExpenses = month;
                        localStorage.yearExpenses = year;

                        $monthYearEl.data('month', month);
                        $monthYearEl.data('year', year);

                        var monthName = $content.find('[name="monthExpenses"] option[value="' + month + '"]').text();
                        updateMonthYearText(monthName, year);                        
                    });
                },
                onClose: () => {

                    var month = $monthYearEl.data('month');            
                    var year = $monthYearEl.data('year');

                    $(document).trigger('monthYearChange', [ month, year ]);
                }
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

        function updateMonthYearText(month, year) {
         
            $monthYearEl.html(`<i class="far fa-calendar-alt mr-1"></i><span>${month}/${year}</span>`);
        }

        init();
    };    

    Layout.getMonthYear = function() {

        return {
            month: parseInt($('[name="monthYearFilter"]').data('month')),
            year: parseInt($('[name="monthYearFilter"]').data('year'))
        };
    };        


    Layout.LOADING_HTML = '<div class="wrapper-loader"><div class="loader"></div></div>';
    Layout.LOADING_SELECTOR = '.wrapper-loader';

    Layout.LOADING_BAR_HTML = '<div class="loading-bar"><div class="x-bar"></div></div>';
    Layout.LOADING_BAR_SELECTOR = '.loading-bar';

    Layout.NETWORK_ERROR = '<p class="danger__color p-3">Falha ao carregar dados. Verifique sua conexão com a internet</p>';

    App.Layout = Layout;    
})();