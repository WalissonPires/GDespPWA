import { Datetime } from "../core/datetime.js";
import { PopupMenu } from "./popup-component.js";

export class MonthYear {
    month: number;
    year: number;
}

export class MonthYearComponent {

    private currentMY: MonthYear = null;
    private $monthYearEl = $('[name="monthYearFilter"]');
    private popupMenu: PopupMenu = null;

    constructor() {

        this.currentMY = this.getInitialMonthYear();           
        this.updateMonthYearElement();
        this.createPopup();
    }


    getMonthYear() {
        return this.currentMY;
    };   


    private getInitialMonthYear() {

        const currentDate = new Date();
        const result: MonthYear = {
            month: parseInt(localStorage.monthExpenses) || (currentDate.getMonth() + 1),
            year: parseInt(localStorage.yearExpenses) || currentDate.getFullYear()
        };

        return result;
    }

    private updateMonthYearElement() {         

        const monthName = Datetime.getMonthName(this.currentMY.month);
        this.$monthYearEl.html(`<i class="far fa-calendar-alt mr-1"></i><span>${monthName}/${this.currentMY.year}</span>`);
    }

    private createPopup() {

        this.popupMenu = new PopupMenu({
            target: this.$monthYearEl,
            onPrepare: this.handlePopupPrepare.bind(this),
            onReady: this.handlePopupReady.bind(this)
        });
    }

    private handlePopupPrepare($popup: JQuery, $toggle: JQuery) {            

        const $monthYearList = $popup.find('.month-year-list');
        const $itemModel = $popup.find('.month-year-list-item');
        const currentYear = new Date().getFullYear();

        for (let year = currentYear - 5, len = currentYear + 5; year <= len; year++) {

            for (let month = 1; month <= 12; month++) {  
                const $item = $itemModel.clone().removeAttr('style');
                $item.find('span').html(Datetime.getMonthName(month) + ' / ' + year);
                $item.attr('data-value', month + '/' + year);
                $monthYearList.append($item);
            }
        }            
    }

    private handlePopupReady($popup: JQuery, $toggle: JQuery) {

        const monthYearSelected = this.currentMY.month + '/' + this.currentMY.year;

        const $itemSelected = $popup.find(`.month-year-list-item[data-value="${monthYearSelected}"]`);
        ($itemSelected.find('input')[0] as HTMLInputElement).checked = true;
        $itemSelected[0].scrollIntoView();

        $popup.find('.month-year-list-item').click(e => {

            const monthYearSplit = $(e.currentTarget).attr('data-value').split('/');

            this.currentMY = {                
                month: parseInt(monthYearSplit[0]),
                year: parseInt(monthYearSplit[1])
            };

            localStorage.monthExpenses = this.currentMY.month;
            localStorage.yearExpenses = this.currentMY.year;

            this.updateMonthYearElement()
            
            $(document).trigger('monthYearChange', [ this.currentMY.month, this.currentMY.year ]);

            this.popupMenu.hide();
        });        
    }
}