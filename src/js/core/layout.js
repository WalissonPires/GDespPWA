import { Pages } from "./page.js";
import { MonthYearComponent } from "../components/month-year-component.js";
class LayoutComponent {
    constructor() {
        this.monthYearComp = null;
        this.LOADING_HTML = '<div class="wrapper-loader"><div class="loader"></div></div>';
        this.LOADING_SELECTOR = '.wrapper-loader';
        this.LOADING_BAR_HTML = '<div class="loading-bar"><div class="x-bar"></div></div>';
        this.LOADING_BAR_SELECTOR = '.loading-bar';
        this.PAGE_BOTTOM_SPACE = '<div class="page-bottom-space"></div>';
        this.NETWORK_ERROR = '<p class="danger__color p-3">Falha ao carregar dados. Verifique sua conexão com a internet</p>';
        this.monthYearComp = new MonthYearComponent();
        this.bindEvents();
    }
    getMonthYear() {
        return this.monthYearComp.getMonthYear();
    }
    bindEvents() {
        $('.btn-menu').click(() => $('.main').toggleClass('nav-show'));
        //$('[name="addExpense"]').click(handleAddExpense);
        $('.bkgd-overlay,[data-page]').click(() => $('.main').removeClass('nav-show'));
        $('[data-page]').click(this.handleMenuPage.bind(this));
    }
    handleMenuPage(e) {
        var $item = $(e.target).is('[data-page]') ? $(e.target) : $(e.target).closest('[data-page]');
        var pageName = $item.attr('data-page');
        if (pageName === undefined || pageName === '') {
            console.warn('Could not get page name');
            return;
        }
        if (Pages.instances[pageName] === undefined)
            Pages.createPage(pageName);
        else
            Pages.activePage(pageName);
    }
}
export const Layout = new LayoutComponent();
//# sourceMappingURL=layout.js.map