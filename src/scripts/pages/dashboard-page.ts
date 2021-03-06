/// <reference path="../../@types/chartjs.d.ts" />

import { PageBase } from "./page-utils.js";
import { DashboardApi } from "../services/dashboard-api.js";
import { Member, DashboardData } from "../core/entities.js";
import { FilterComponent } from "../components/filter-component.js";
import { Layout } from "../core/layout.js";
import { Pages } from "../core/page.js";
import { MonthYear } from "../components/month-year-component.js";
import { FetchUtils } from "../core/fetch-utils.js"; 
import { Datetime } from "../core/datetime.js";


type MonthValue = { 
    month: number,
    value?: any 
};

class MonthsInYear {                

    private meses: { [prop: string]: MonthValue };

    constructor() {

        const d = new Date();
        this.meses = {};
    
        for (var i = 0; i < 12; i++) {
    
            const key = this.dateKey(d.getFullYear(), d.getMonth());
            this.meses[key] = { month: d.getMonth() + 1 };
    
            d.setMonth(d.getMonth() - 1);
        }
    }

    private dateKey(year: number, month: number) {

        return year + '_' + (month < 10 ? '0': '') + month;
    }

    private monthsKeysSorted() {

        return Object.keys(this.meses).sort();
    }

    setValue(year: number, month: number, value: any) {

        const key = this.dateKey(year, month);
        if (this.meses[key] !== undefined)
            this.meses[key].value = value;
    }

    getMonths() {

        return this.monthsKeysSorted().map(x => this.meses[x].month);
    }

    getValues() {

        return this.monthsKeysSorted().map(x => this.meses[x].value);
    }

    setAll(value: any) {

        Object.keys(this.meses).forEach(x => {
            this.meses[x].value = value; 
        });
    }
}


export class DashboardPage implements PageBase {

    private dashApi = new DashboardApi();
    private $context: JQuery;

    private $cardPeople: JQuery = null;
    private $cardCategories: JQuery = null;
    private $cardCategoriesInYear: JQuery = null;
    private $cardTotalInYear: JQuery = null;
    private $cardOrigins: JQuery = null;
    private $filter: JQuery = null;
    private member: Member = null;
    
    constructor(pageEl: HTMLElement) {

        this.$context = $(pageEl);

        this.loadSavedMember();

        console.log(DashboardPage.name + '> member', this.member);

        this.$filter = $(new FilterComponent({
            id: DashboardPage.name,
            onChange: this.handleFilterChange.bind(this)
        }));

        this.$cardPeople = $(`
        <div name="dashCardPeople">
            <div class="card p-0 mt-3">
                <div class="title">Resumo do mês por pessoa</div>
                <div class="body">
                    ${Layout.LOADING_HTML}
                </div>
            </div>
        </div>`);

        this.$cardCategories = $(`
        <div name="dashCardCategories">
            <div class="card p-0 mt-3">
                <div class="title">Resumo do mês por categoria</div>
                <div class="body">
                    ${Layout.LOADING_HTML}
                </div>
            </div>
        </div>`);

        this.$cardCategoriesInYear = $(`
        <div name="dashCardCategoriesInYear">
            <div class="card p-0 mt-3">
                <div class="title">Despesas ano por categorias/mes</div>
                <div class="body">
                    ${Layout.LOADING_HTML}
                </div>
            </div>
        </div>`);

        this.$cardTotalInYear = $(`
        <div name="dashCardTotalInYear">
            <div class="card p-0 mt-3">
                <div class="title">Total Despesas/mes</div>
                <div class="body">
                    ${Layout.LOADING_HTML}
                </div>
            </div>
        </div>`);

        this.$cardOrigins = $(`
        <div name="dashCardOrigins">
            <div class="card p-0 mt-3">
                <div class="title">Resumo do mês por origens</div>
                <div class="body">
                    ${Layout.LOADING_HTML}
                </div>
            </div>
        </div>`);

        //$context.append(App.Layout.LOADING_BAR_HTML);
        this.$context.append(this.$filter);            
        this.$context.append(this.$cardPeople);
        this.$context.append(this.$cardCategories);
        this.$context.append(this.$cardOrigins);
        this.$context.append(this.$cardCategoriesInYear);
        this.$context.append(this.$cardTotalInYear);
        this.$context.append(Layout.PAGE_BOTTOM_SPACE);

        $(document).on('monthYearChange', this.handleMonthChange.bind(this));

        this.downloadCardsData();

        Pages.activePage(DashboardPage.name);
    }

    private handleMonthChange(e: JQuery.ChangeEvent) {

        this.downloadCardsData();
    }

    private handleFilterChange(m: Member) {

        this.member = m;
        this.saveMember();

        this.downloadCardsData();
    }

    private downloadCardsData() {

        const date = Layout.getMonthYear();
        this.downloadPeopleData(date);
        this.downloadCategoriesData(date);
        this.downloadOriginsData(date);
        this.downloadCategoriesInYearData();
        this.downloadTotalInYearData();
    }

    private downloadPeopleData(date: MonthYear) {            

        const promise = this.dashApi.getTotalMonthPerPerson(date.month, date.year);
        
        FetchUtils.treatEachResponse(promise, 
            data => {

                this.$cardPeople.find('.body').empty().append(this.createCardList(data));
            },
            erro => {

                this.$cardPeople.find('.body').empty().append(Layout.NETWORK_ERROR);
            }
        );            
    }

    private downloadCategoriesData(date: MonthYear) {            

        const promise = this.dashApi.getTotalMonthByCategory(date.month, date.year,
            this.member != null ? this.member.userGuestId : undefined);
        

        FetchUtils.treatEachResponse(promise, 
            data => {

                this.$cardCategories.find('.body').empty().append(this.createCardList(data));
            },
            erro => {

                this.$cardCategories.find('.body').empty().append(Layout.NETWORK_ERROR);
            }
        );                                         
    }

    private downloadOriginsData(date: MonthYear) {            

        const promise = this.dashApi.getTotalMonthByOrigin(date.month, date.year,
            this.member != null ? this.member.userGuestId : undefined);
        

        FetchUtils.treatEachResponse(promise, 
            data => {

                this.$cardOrigins.find('.body').empty().append(this.createCardList(data));
            },
            erro => {

                this.$cardOrigins.find('.body').empty().append(Layout.NETWORK_ERROR);
            }
        );                                         
    }

    private downloadCategoriesInYearData() {

        const promise = this.dashApi.getTotalMonthInYearByCategory(
            this.member != null ? this.member.userGuestId : undefined);
        

        FetchUtils.treatEachResponse(promise, 
            data => {
                
                if (data.length === 0) {

                    // criar mensagem informando que não há dados
                    this.$cardCategoriesInYear.find('.body').empty().append(this.createCardList(data));
                    return;
                }

                const categoryMap: { [prop: string]: CategoryMap; } = {};
                for (let i = 0; i < data.length; i++) {
        
                    const categ = data[i];
    
                    if (categoryMap[categ.name] === undefined) {
                        categoryMap[categ.name] = {
                            name: categ.name,
                            color: categ.color,
                            monthsYear: new MonthsInYear(),
                        };

                        categoryMap[categ.name].monthsYear.setAll(undefined);
                    }
    
                    const date = new Date(categ.date);
                    categoryMap[categ.name].monthsYear.setValue(date.getFullYear(), date.getMonth(), categ.value.toFixed(2));
                }
                        
                const chartData: CategoryMap[] = [];                    
                Object.keys(categoryMap).forEach(key => {
                
                    categoryMap[key].months = categoryMap[key].monthsYear.getValues();
                    chartData.push(categoryMap[key]);
                });

                const canvas = $('<canvas></canvas>')[0] as HTMLCanvasElement;
                this.$cardCategoriesInYear.find('.body').empty().append(canvas);
                
                this.createExpensesInYearChart(canvas, chartData);
            },
            erro => {

                this.$cardCategoriesInYear.find('.body').empty().append(Layout.NETWORK_ERROR);
            }
        );                                         
    }

    private downloadTotalInYearData() {            

        var promise = this.dashApi.getTotalMonthInYear(
            this.member != null ? this.member.userGuestId : undefined);
        

        FetchUtils.treatEachResponse(promise, 
            data => {                                        

                if (data.length === 0) {

                    // criar mensagem informando que não há dados
                    this.$cardTotalInYear.find('.body').empty().append(this.createCardList(data));
                    return;
                }

                const dataMap: { [prop: string]: CategoryMap } = {};
                for (let i = 0; i < data.length; i++) {
    
                    const categ = data[i];
                            
                    if (dataMap['Total'] === undefined) {
                        dataMap['Total'] = {
                            name: 'Despesas',
                            color: 'red',
                            monthsYear: new MonthsInYear(),                               
                        };

                        dataMap['Total'].monthsYear.setAll(undefined);
                    }
    
                    const date = new Date(categ.date);
                    dataMap['Total'].monthsYear.setValue(date.getFullYear(), date.getMonth(), categ.value.toFixed(2));
                }
    
                const chartData: CategoryMap[] = [];                    
                Object.keys(dataMap).forEach(key => {
                
                    dataMap[key].months = dataMap[key].monthsYear.getValues();
                    chartData.push(dataMap[key]);
                });

                const canvas = $('<canvas></canvas>')[0] as HTMLCanvasElement;
                this.$cardTotalInYear.find('.body').empty().append(canvas);
                
                this.createExpensesInYearChart(canvas, chartData);
            },
            erro => {

                this.$cardTotalInYear.find('.body').empty().append(Layout.NETWORK_ERROR);
            }
        );                                         
    }

    private createExpensesInYearChart(canvas: HTMLCanvasElement, data: CategoryMap[]) {

        const ctx = canvas.getContext('2d');

        const labels = new MonthsInYear().getMonths().map(month => Datetime.getMonthName(month));

        const chartData = {
            labels: labels,
            datasets: data.map((x, i) => {                    

                return {
                    label: x.name,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: x.color,
                    borderColor: x.color, 
                    borderCapStyle: 'square',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "black",
                    pointBackgroundColor: "white",
                    pointBorderWidth: 1,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: x.color,
                    pointHoverBorderColor: "brown",
                    pointHoverBorderWidth: 2,
                    pointRadius: 4,
                    pointHitRadius: 10,
                    // notice the gap in the data and the spanGaps: true
                    data: x.months,
                    spanGaps: true
                };
            })
        };

        // Notice the scaleLabel at the same level as Ticks
        var options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Valor (R$)',
                        fontSize: 20
                    }
                }]
            }
        };
        
        const myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: options
        });
    }

    private createCardList(data: DashboardData[]) {

        const $list = $('<ul class="x-list"></ul>');

        if (data.length === 0) {

            const $item = $(`
            <li class="x-item x-flex flex-jc-sb">
                <span class="name hint-color">Nada para mostrar aqui</span>
            </li>
            `);

            $list.append($item);
        }
        else {
            data.forEach(x => {

                const $item = $(`
                <li class="x-item x-flex flex-jc-sb">
                    <span class="name">${x.name}</span><span class="value danger__color">R$ ${x.value.toFixed(2).replace('.', ',')}</span>
                </li>
                `);

                $list.append($item);
            });
        }

        return $list[0];
    }
    
    private loadSavedMember() {

        this.member = JSON.parse(localStorage.getItem(DashboardPage.name + '-Member') || 'null');
    }

    private saveMember() {
        
        localStorage.setItem(DashboardPage.name + '-Member', JSON.stringify(this.member));
    }        
}

class CategoryMap {         
    name: string;
    color: string;
    monthsYear: MonthsInYear;  
    months?: any[];      
}

Pages.constructos[DashboardPage.name] = DashboardPage;