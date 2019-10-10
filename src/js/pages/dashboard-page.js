(function(){

    var DashboardPage = function(pageEl) {

        const dashApi = new App.Services.DashboardApi();
        const $context = $(pageEl);

        let $cardPeople = null;
        let $cardCategories = null;
        let $cardCategoriesInYear = null;
        let $cardTotalInYear = null;
        let $filter = null;
        let member = null;
        
        function init() {

            loadSavedMember();

            console.log(DashboardPage.name + '> member', member);

            $filter = $(new App.Components.FilterComponent({
                id: DashboardPage.name,
                onChange: handleFilterChange
            }));

            $cardPeople = $(`
            <div name="dashCardPeople">
                <div class="card p-0 mb-3">
                    <div class="title">Resumo por pessoa</div>
                    <div class="body">
                        ${App.Layout.LOADING_HTML}
                    </div>
                </div>
            </div>`);

            $cardCategories = $(`
            <div name="dashCardCategories">
                <div class="card p-0 mt-3">
                    <div class="title">Resumo por categoria</div>
                    <div class="body">
                        ${App.Layout.LOADING_HTML}
                    </div>
                </div>
            </div>`);

            $cardCategoriesInYear = $(`
            <div name="dashCardCategoriesInYear">
                <div class="card p-0 mt-3">
                    <div class="title">Despesas por categorias/mes</div>
                    <div class="body">
                        ${App.Layout.LOADING_HTML}
                    </div>
                </div>
            </div>`);

            $cardTotalInYear = $(`
            <div name="dashCardTotalInYear">
                <div class="card p-0 mt-3">
                    <div class="title">Total Despesas/mes</div>
                    <div class="body">
                        ${App.Layout.LOADING_HTML}
                    </div>
                </div>
            </div>`);


            //$context.append(App.Layout.LOADING_BAR_HTML);
            $context.append($filter);
            $context.append($cardPeople);
            $context.append($cardCategories);
            $context.append($cardCategoriesInYear);
            $context.append($cardTotalInYear);
            $context.append(App.Layout.PAGE_BOTTOM_SPACE);

            $(document).on('monthYearChange', handleMonthChange);

            downloadCardsData();

            App.Utils.Pages.activePage(DashboardPage.name);
        }

        function handleMonthChange(e) {

            downloadCardsData();
        }
  
        function handleFilterChange(m) {

            member = m;
            saveMember();

            downloadCardsData();
        }

        function downloadCardsData() {

            var date = App.Layout.getMonthYear();
            downloadPeopleData(date);
            downloadCategoriesData(date);
            downloadCategoriesInYearData();
            downloadTotalInYearData();
        }

        function downloadPeopleData(date) {            

            var promise = dashApi.getTotalMonthPerPerson(date.month, date.year);
            
            App.Utils.FetchUtils.treatEachResponse(promise, 
                data => {

                    $cardPeople.find('.body').empty().append(createCardList(data));
                },
                erro => {

                    $cardPeople.find('.body').empty().append(App.Layout.NETWORK_ERROR);
                }
            );            
        }

        function downloadCategoriesData(date) {            

            var promise = dashApi.getTotalMonthByCategory(date.month, date.year,
                member != null ? member.userGuestId : undefined);
            

            App.Utils.FetchUtils.treatEachResponse(promise, 
                data => {

                    $cardCategories.find('.body').empty().append(createCardList(data));
                },
                erro => {

                    $cardCategories.find('.body').empty().append(App.Layout.NETWORK_ERROR);
                }
            );                                         
        }

        function downloadCategoriesInYearData(date) {            

            var promise = dashApi.getTotalMonthInYearByCategory(
                member != null ? member.userGuestId : undefined);
            

            App.Utils.FetchUtils.treatEachResponse(promise, 
                data => {
                    
                    const categoryMap = {};
                    for (let i = 0; i < data.length; i++) {
        
                        const categ = data[i];
        
                        if (categoryMap[categ.name] === undefined) {
                            categoryMap[categ.name] = {
                                name: categ.name,
                                color: categ.color,
                                months: new Array(12).fill(undefined)
                            };
                        }
        
                        const date = new Date(categ.date);
                        categoryMap[categ.name].months[date.getMonth()] = categ.value.toFixed(2);
                    }
        
                    const chartData = Object.keys(categoryMap).map(key => categoryMap[key]);                    

                    const canvas = $('<canvas></canvas>')[0];
                    $cardCategoriesInYear.find('.body').empty().append(canvas);
                    
                    createExpensesInYearChart(canvas, chartData);
                },
                erro => {

                    $cardCategoriesInYear.find('.body').empty().append(App.Layout.NETWORK_ERROR);
                }
            );                                         
        }

        function downloadTotalInYearData(date) {            

            var promise = dashApi.getTotalMonthInYear(
                member != null ? member.userGuestId : undefined);
            

            App.Utils.FetchUtils.treatEachResponse(promise, 
                data => {                                        

                    const dataMap = {};
                    for (let i = 0; i < data.length; i++) {
        
                        const categ = data[i];
        
                        if (dataMap['Total'] === undefined) {
                            dataMap['Total'] = {
                                name: categ.name,
                                color: 'red',
                                months: new Array(12).fill(undefined)
                            };
                        }
        
                        const date = new Date(categ.date);
                        dataMap['Total'].months[date.getMonth()] = categ.value.toFixed(2);
                    }
        
                    const chartData = Object.keys(dataMap).map(key => dataMap[key]);                    

                    const canvas = $('<canvas></canvas>')[0];
                    $cardTotalInYear.find('.body').empty().append(canvas);
                    
                    createExpensesInYearChart(canvas, chartData);
                },
                erro => {

                    $cardTotalInYear.find('.body').empty().append(App.Layout.NETWORK_ERROR);
                }
            );                                         
        }

        function createExpensesInYearChart(canvas, data) {

            const ctx = canvas.getContext('2d');

            const chartData = {
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
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

        function createCardList(data) {

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
        
        function loadSavedMember() {

            member = JSON.parse(localStorage.getItem(DashboardPage.name + '-Member') || 'null');
        }

        function saveMember() {
         
            localStorage.setItem(DashboardPage.name + '-Member', JSON.stringify(member));
        }

        init();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Pages').DashboardPage = DashboardPage;
})();