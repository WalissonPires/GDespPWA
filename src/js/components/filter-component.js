(function(){

    /**
     * 
     * @param {*} options
     * {
     *      id: string,
     *      selected: number,
     *      members: Member[],
     *      onChange: function (selectedValue) {}
     * }
     */
    var FilterComponent = function(options) {

        options = options || {};
        let $select = null;
        let _members = [];

        if (typeof options.id !== 'string' && options.id.trim().length === 0)
            throw new Error('ID is not valid');

        if (options.selected === undefined) {
            options.selected = loadSavedSeletion(options.id);
        }

        const dom = $(filterHtml(options))[0];
        $select = $(dom).find('select');

        $select.change(function(e) { 

            const value =  $(e.target).val();
            saveSelection(value);

            if (typeof this === 'function') {

                if (value === '-1')
                    this.call(null, null);
                else {
                    const splitedIds = value.split('-').map(x => parseInt(x));
                    const userId = isNaN(splitedIds[0]) ? null : splitedIds[0];
                    const guestId = isNaN(splitedIds[1]) ? null : splitedIds[1];

                    const selected = _members.filter(x => x.userId === userId && x.guestId === guestId)[0];

                    this.call(null, selected);
                }
            }

        }.bind(options.onChange));
        
        if (options.members === undefined) {

            const membersApi = new App.Services.MembersApi();

            const promise = membersApi.getAll();

            App.Utils.FetchUtils.treatEachResponse(promise,
                (members) => {

                    _members = (members || []).sort((a,b) => a.name > b.name ? 1 : a.name < b.nome ? -1 : 0);

                    const firstLoad = $select.find('option').length === 1;
                    const selected = firstLoad 
                        ? loadSavedSeletion()
                        : $select.val();

                    $select.find('option:not([value="-1"])').remove();

                    _members.forEach(x => $select.append(new Option(x.name,  x.userId + '-' + x.guestId)));
                    
                    $select.val(selected);

                    if (firstLoad)
                        $select.change();
                });
        }

            
        function loadSavedSeletion() {

            return localStorage.getItem('FilterComponent-' + options.id) || -1;
        }

        function saveSelection(value) {

            localStorage.setItem('FilterComponent-' + options.id, value);
        }


        return dom;
    };

    function filterHtml(options) {

        let selectOptions = '';
        let selected = '';

        if (Array.isArray(options.members)) {

            for (let member of options.members) {

                selected = options.selected === member.id ? 'selected' : '';
                selectOptions += `<option value="${member.id}" ${selected}>${member.name}</option>`;
            }
        }

        selected = options.selected === -1 ? 'selected' : '';

        return `
        <div class="page-filter card mb-2">
            <div>
                <span class="icon-circle2">Exibindo dados de</span>
                <select class="select-text">
                    <option value="-1" ${selected}>Todos</option>
                    ${selectOptions}
                </select>
            </div>
            <div hidden=""><i class="fas fa-filter"></i></div>    
        </div>`;
    };

    App.Utils.Namespace.CreateIfNotExists('App.Components').FilterComponent = FilterComponent;
})();