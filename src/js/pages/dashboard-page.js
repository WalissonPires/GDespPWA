(function(){

    var DashboardPage = function(pageEl) {

        const dashApi = new App.Services.DashboardApi();
        const $context = $(pageEl);
        const $monthEl = $('[name="monthExpenses"]');
        let $cardPeople = null;
        let $cardCategories = null; 
        
        function init() {

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
                <div class="card p-0 mb-3">
                    <div class="title">Resumo por categoria</div>
                    <div class="body">
                        ${App.Layout.LOADING_HTML}
                    </div>
                </div>
            </div>`);

            $context.append($cardPeople);
            $context.append($cardCategories);

            $monthEl.change(handleMonthChange);

            downloadCardsData();

            App.Utils.Pages.activePage(DashboardPage.name);
        }

        function handleMonthChange(e) {

            downloadCardsData();
        }

        function downloadCardsData() {

            var date = App.Layout.getMonthYear();
            downloadPeopleData(date);
            downloadCategoriesData(date);
        }

        function downloadPeopleData(date) {            

            var promise = dashApi.getTotalMonthPerPerson(date.month, date.year);
            
            promise.then(promises => { 
                
                promises.forEach(p => {

                    p.then(data => {

                        $cardPeople.find('.body').empty().append(createCardList(data));
                    });
                });
            });            
        }

        function downloadCategoriesData(date) {            

            var promise = dashApi.getTotalMonthByCategory(date.month, date.year);
            
            promise.then(promises => { 
                
                promises.forEach(p => {

                    p.then(data => {

                        $cardCategories.find('.body').empty().append(createCardList(data));
                    });
                });
            });                                          
        }

        function createCardList(data) {

            const $list = $('<ul class="x-list"></ul>');

            data.forEach(x => {

                const $item = $(`
                <li class="x-item x-flex flex-jc-sb">
                    <span class="name">${x.name}</span><span class="value danger__color">R$ ${x.value.toFixed(2).replace('.', ',')}</span>
                </li>
                `);

                $list.append($item);
            });

            return $list[0];
        }
        

        init();
    };

    App.Utils.Namespace.CreateIfNotExists('App.Pages').DashboardPage = DashboardPage;
})();