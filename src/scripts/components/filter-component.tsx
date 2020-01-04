import { Member } from "../core/entities.js";
import { MembersApi } from "../services/members-api.js";
import { FetchUtils } from "../core/fetch-utils.js";
import { Toast } from "../core/toast.js";
import { FunctionComponentConstructor } from "./component-utils.js";


export class FilterComponentOptions {
    id: string;
    selected?: string;
    members?: Member[];
    onChange: (selectedValue: string) => void;
}
    
export const FilterComponent = function (options: FilterComponentOptions) {
    
    options = options || new FilterComponentOptions();
    let $select: JQuery = null;
    let _members: Member[] = [];

    function render() {
        
        if (typeof options.id !== 'string' || options.id.trim().length === 0)
            throw new Error('ID is not valid');

        if (options.selected === undefined) {
            options.selected = loadSavedSeletion();
        }

        const dom = $(filterHtml());
        $select = dom.find('select');

        $select.change(handleMemberChange);
        
        if (options.members === undefined)
            loadMembers();      
        
        return dom;
    }

    function loadMembers() {

        const membersApi = new MembersApi();

            const promise = membersApi.getAll();

            FetchUtils.treatEachResponse(promise,
                (members: Member[]) => {

                    _members = (members || []).sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);

                    const firstLoad = $select.find('option').length === 1;
                    const selected = firstLoad 
                        ? loadSavedSeletion()
                        : $select.val() as string;

                        $select.find('option:not([value="-1"])').remove();

                        _members.forEach(x => {
                            $select.append(new Option(x.name,  x.userId + '-' + x.guestId));
                        });
                    
                        $select.val(selected);

                    if (firstLoad)
                        $select.change();
                },
                error => {
                    Toast.error('Falha ao baixar lista de membros');
                });
    }

    function handleMemberChange(e: JQuery.ChangeEvent) {

        const value =  $(e.target).val() as string;
        saveSelection(value);

        if (typeof options.onChange === 'function') {

            if (value === '-1')
                options.onChange.call(null, null);
            else {
                const splitedIds = value.split('-').map(x => parseInt(x));
                const userId = isNaN(splitedIds[0]) ? null : splitedIds[0];
                const guestId = isNaN(splitedIds[1]) ? null : splitedIds[1];

                const selected = _members.filter(x => x.userId === userId && x.guestId === guestId)[0];

                options.onChange.call(null, selected);
            }
        }
    }

        
    function loadSavedSeletion() {

        return localStorage.getItem('FilterComponent-' + options.id) || '-1';
    }

    function saveSelection(value: string) {

        localStorage.setItem('FilterComponent-' + options.id, value);
    }

    function filterHtml() {

        let selectOptions = '';
        let selected = '';

        if (Array.isArray(options.members)) {

            for (let member of options.members) {

                selected = parseInt(options.selected) === member.id ? 'selected' : '';
                selectOptions += `<option value="${member.id}" ${selected}>${member.name}</option>`;
            }
        }

        selected = options.selected === '-1' ? 'selected' : '';

        return (`<div class="page-filter card mb-2">
                    <div>
                        <span class="icon-circle2">Exibindo dados de</span>
                        <select class="select-text">
                            <option value="-1" ${selected}>Todos</option>
                            ${selectOptions}
                        </select>
                    </div>
                    <div hidden=""><i class="fas fa-filter"></i></div>    
                </div>`);
    }

    return render();
} as any as FunctionComponentConstructor<FilterComponentOptions>

   
