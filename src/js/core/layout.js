(function(){

    var Layout = function() {

        const $monthYearEl = $('[name="monthYearFilter"]');

        function init () {

            var currentDate = new Date();
            var month = localStorage.monthExpenses || (currentDate.getMonth() + 1);
            var year = localStorage.yearExpenses || currentDate.getFullYear();

            $monthYearEl.data('month', month);
            $monthYearEl.data('year', year);

            var monthName = getMonthName(parseInt(month));
            updateMonthYearText(monthName, year);

            bindEvents();
        }

        function bindEvents() {

            $('.btn-menu').click(() => $('.main').toggleClass('nav-show'));
            $('[name="addExpense"]').click(handleAddExpense);
            $('.bkgd-overlay,[data-page]').click(() =>  $('.main').removeClass('nav-show'));
            $('[data-page]').click(handleMenuPage);            

            const popupMenu = new App.Components.PopupMenu({
                target: $monthYearEl,
                onPrepare: ($popup, $toggle) => {

                    $popup.addClass('monthYear');

                    const $selMonthYear = $popup.find('[name="monthYearList"]');
                    const currentYear = new Date().getFullYear();

                    for (let year = currentYear - 5, len = currentYear + 5; year <= len; year++) {

                        for (let month = 1; month <= 12; month++) {                            
                            $selMonthYear.append(new Option(getMonthName(month) + ' / ' + year, month + '/' + year));
                        }
                    }
                },
                onReady: ($popup, $toggle) => {                            

                    const monthYearSelected = localStorage.monthExpenses + '/' + localStorage.yearExpenses;

                    $popup.find('[name="monthYearList"]').val(monthYearSelected);

                    $popup.find('select').change(function(e) {

                        const $content = $(e.target).parent();
                        const monthYearSplit = $content.find('[name="monthYearList"]').val().split('/');

                        const month = monthYearSplit[0];
                        const year = monthYearSplit[1];

                        localStorage.monthExpenses = month;
                        localStorage.yearExpenses = year;

                        $monthYearEl.data('month', month);
                        $monthYearEl.data('year', year);

                        var monthName = getMonthName(parseInt(month));
                        updateMonthYearText(monthName, year);   
                        
                        $(document).trigger('monthYearChange', [ month, year ]);

                        popupMenu.hide();
                    });
                }/*,
                onClose: () => {

                    var month = $monthYearEl.data('month');            
                    var year = $monthYearEl.data('year');

                    $(document).trigger('monthYearChange', [ month, year ]);
                }*/
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

        function handleAddExpense(e) {

            alert('Adicionar');
        }

        function getMonthName(month) {

            switch(month) {
                case 1: return 'JAN';
                case 2: return 'FEV';
                case 3: return 'MAR';
                case 4: return 'ABR';
                case 5: return 'MAI';
                case 6: return 'JUN';
                case 7: return 'JUL';
                case 8: return 'AGO';
                case 9: return 'SET';
                case 10: return 'OUT';
                case 11: return 'NOV';
                case 12: return 'DEZ';
            }
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