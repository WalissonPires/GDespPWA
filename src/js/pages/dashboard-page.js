(function(){

    var DashboardPage = function(pageEl) {

        const dashApi = new App.Services.DashboardApi();
        const $context = $(pageEl);
        const $monthEl = $('[name="monthExpenses"]');

        let $cardPeople = null;
        let $cardCategories = null;
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

            //$context.append(App.Layout.LOADING_BAR_HTML);
            $context.append($filter);
            $context.append($cardPeople);
            $context.append($cardCategories);

            $monthEl.change(handleMonthChange);

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

            // promise.then(promises => { 
                
            //     promises.forEach(p => {

            //         p.then(data => {

            //             $cardPeople.find('.body').empty().append(createCardList(data));
            //         });
            //     });
            // });            
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

            // promise.then(promises => { 
                
            //     promises.forEach(p => {

            //         p.then(data => {

            //             $cardCategories.find('.body').empty().append(createCardList(data));
            //         });
            //     });
            // });                                          
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