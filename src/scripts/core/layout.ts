import { Pages } from "./page.js";
import { MonthYearComponent } from "../components/month-year-component.js";
    
class LayoutComponent {

    private monthYearComp: MonthYearComponent = null;

    constructor() {

        this.monthYearComp = new MonthYearComponent();

        this.bindEvents();
    }


    getMonthYear() {

        return this.monthYearComp.getMonthYear();
    }


    public LOADING_HTML = '<div class="wrapper-loader"><div class="loader"></div></div>';
    public LOADING_SELECTOR = '.wrapper-loader';

    public LOADING_BAR_HTML = '<div class="loading-bar"><div class="x-bar"></div></div>';
    public LOADING_BAR_SELECTOR = '.loading-bar';

    public PAGE_BOTTOM_SPACE = '<div class="page-bottom-space"></div>';

    public NETWORK_ERROR = '<p class="danger__color p-3">Falha ao carregar dados. Verifique sua conexão com a internet</p>';


    private bindEvents() {

        $('.btn-menu').click(() => $('.main').toggleClass('nav-show'));
        //$('[name="addExpense"]').click(handleAddExpense);
        $('.bkgd-overlay,[data-page]').click(() =>  $('.main').removeClass('nav-show'));
        $('[data-page]').click(this.handleMenuPage.bind(this));
    }

    private handleMenuPage(e: JQuery.ClickEvent) {

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