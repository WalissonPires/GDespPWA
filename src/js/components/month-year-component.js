(function(){

    var MonthYearComponent = function(){

        let currentMY = null;
        const $monthYearEl = $('[name="monthYearFilter"]');
        let popupMenu = null;

        function constructor() {

            currentMY = getInitialMonthYear();           
            updateMonthYearElement();
            createPopup();
        }


        this.getMonthYear = function() {
            return currentMY;
        };   


        function getInitialMonthYear() {

            const currentDate = new Date();
            const result = {};
            result.month = parseInt(localStorage.monthExpenses) || (currentDate.getMonth() + 1);
            result.year = parseInt(localStorage.yearExpenses) || currentDate.getFullYear();

            return result;
        }

        function updateMonthYearElement() {         

            const monthName = App.Utils.Datetime.getMonthName(currentMY.month);
            $monthYearEl.html(`<i class="far fa-calendar-alt mr-1"></i><span>${monthName}/${currentMY.year}</span>`);
        }

        function createPopup() {

            popupMenu = new App.Components.PopupMenu({
                target: $monthYearEl,
                onPrepare: handlePopupPrepare,
                onReady: handlePopupReady
            });
        }

        function handlePopupPrepare($popup, $toggle) {            

            const $monthYearList = $popup.find('.month-year-list');
            const $itemModel = $popup.find('.month-year-list-item');
            const currentYear = new Date().getFullYear();

            for (let year = currentYear - 5, len = currentYear + 5; year <= len; year++) {

                for (let month = 1; month <= 12; month++) {  
                    const $item = $itemModel.clone().removeAttr('style');
                    $item.find('span').html(App.Utils.Datetime.getMonthName(month) + ' / ' + year);
                    $item.attr('data-value', month + '/' + year);
                    $monthYearList.append($item);
                }
            }            
        }

        function handlePopupReady($popup, $toggle) {

            const monthYearSelected = currentMY.month + '/' + currentMY.year;

            const $itemSelected = $popup.find(`.month-year-list-item[data-value="${monthYearSelected}"]`);
            $itemSelected.find('input')[0].checked = true;
            $itemSelected[0].scrollIntoView();

            $popup.find('.month-year-list-item').click(function(e) {

                const monthYearSplit = $(e.currentTarget).attr('data-value').split('/');

                currentMY = {                
                    month: parseInt(monthYearSplit[0]),
                    year: parseInt(monthYearSplit[1])
                };

                localStorage.monthExpenses = currentMY.month;
                localStorage.yearExpenses = currentMY.year;

                updateMonthYearElement()
                
                $(document).trigger('monthYearChange', [ currentMY.month, currentMY.year ]);

                popupMenu.hide();
            });
            
        }

        constructor();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Components').MonthYearComponent = MonthYearComponent;
})();