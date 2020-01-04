import { Datetime } from "../core/datetime.js";
import { PopupMenu } from "./popup-component.js";
export class MonthYear {
}
export class MonthYearComponent {
    constructor() {
        this.currentMY = null;
        this.$monthYearEl = $('[name="monthYearFilter"]');
        this.popupMenu = null;
        this.currentMY = this.getInitialMonthYear();
        this.updateMonthYearElement();
        this.createPopup();
    }
    getMonthYear() {
        return this.currentMY;
    }
    ;
    getInitialMonthYear() {
        const currentDate = new Date();
        const result = {
            month: parseInt(localStorage.monthExpenses) || (currentDate.getMonth() + 1),
            year: parseInt(localStorage.yearExpenses) || currentDate.getFullYear()
        };
        return result;
    }
    updateMonthYearElement() {
        const monthName = Datetime.getMonthName(this.currentMY.month);
        this.$monthYearEl.html(`<i class="far fa-calendar-alt mr-1"></i><span>${monthName}/${this.currentMY.year}</span>`);
    }
    createPopup() {
        this.popupMenu = new PopupMenu({
            target: this.$monthYearEl,
            onPrepare: this.handlePopupPrepare.bind(this),
            onReady: this.handlePopupReady.bind(this)
        });
    }
    handlePopupPrepare($popup, $toggle) {
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
    handlePopupReady($popup, $toggle) {
        const monthYearSelected = this.currentMY.month + '/' + this.currentMY.year;
        const $itemSelected = $popup.find(`.month-year-list-item[data-value="${monthYearSelected}"]`);
        $itemSelected.find('input')[0].checked = true;
        $itemSelected[0].scrollIntoView();
        $popup.find('.month-year-list-item').click(e => {
            const monthYearSplit = $(e.currentTarget).attr('data-value').split('/');
            this.currentMY = {
                month: parseInt(monthYearSplit[0]),
                year: parseInt(monthYearSplit[1])
            };
            localStorage.monthExpenses = this.currentMY.month;
            localStorage.yearExpenses = this.currentMY.year;
            this.updateMonthYearElement();
            $(document).trigger('monthYearChange', [this.currentMY.month, this.currentMY.year]);
            this.popupMenu.hide();
        });
    }
}
//# sourceMappingURL=month-year-component.js.map