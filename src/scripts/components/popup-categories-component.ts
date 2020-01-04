import { Category } from "../core/entities.js";
import { PopupMenu } from "./popup-component.js";
import { FetchUtils } from "../core/fetch-utils.js";
import { Toast } from "../core/toast.js";
import { CategoriesApi } from "../services/categories-api.js";


export class PopupCategoriesComponentOptions {
    target: string | JQuery | HTMLElement;
     onSelected: (category: CategoryModel) => void;
}

export class CategoryModel extends Category {
    iconCircle: JQuery;
}


export class PopupCategoriesComponent {

    private opcoes: PopupCategoriesComponentOptions;
    private _popup: PopupMenu = null;
    private _popupEl: JQuery = null;


    constructor(opcoes: PopupCategoriesComponentOptions) {

        this.opcoes = opcoes || new PopupCategoriesComponentOptions();

        this.createPopupContent();
        this.createPopup();
        this.downloadCategories();
    }

    private createPopupContent() {

        const $toggle = $(this.opcoes.target as any);

        if ($toggle.length === 0)
            throw new Error('Target não encontrado');            

        this._popupEl = $(`
        <div class="popup-content popup-categories">                                            
            <button class="popup-toggle"></button>
            <div class="popup-menu"></div>
        </div>   
        `);
        
        this._popupEl
            .css('position', 'absolute')
            .css('top', $toggle[0].offsetHeight)
            .css('left', $toggle[0].offsetWidth);
    }


    private createPopup() {

        this._popup = new PopupMenu({
            target: this._popupEl.find('.popup-toggle'),
            onPrepare: ($popup) => $popup.addClass('popup-list'),
            onReady: $popup => {

                const popupComp = this;

                $popup.find('.popup-item').click((e) => {

                    const $item = $(e.currentTarget);

                    const category: CategoryModel = {
                        id: parseInt($item.find('[data-id]').attr('data-id')),
                        name: $item.find('[name="category.name"]').text(),
                        color: $item.find('[data-color]').attr('data-color'),
                        iconCircle: $item.find('.icon-circle').clone().removeClass('mr-3')
                    };

                    if (typeof this.opcoes.onSelected === 'function')
                        this.opcoes.onSelected(category);
                    
                    this._popup.hide();
                });
            }                
        });
    }


    private downloadCategories() {

        //let calledCategories = false;

        const categoriesPromises = new CategoriesApi().getAll();
            FetchUtils.treatEachResponse(categoriesPromises, 
                (categories: Category[]) => {

                    // if (calledCategories) 
                    //     return;

                    // calledCategories = true;
                    
                    const $popupContent = this._popupEl.find('.popup-menu');                        

                    for(const cat of categories) {

                        $popupContent.append(`<span class="popup-item"><span class="icon-circle mr-3" style="font-size: .9em; background-color: ${cat.color}">${cat.name[0]}</span><span name="category.name" data-id="${cat.id}" data-color="${cat.color}">${cat.name}</span></span>`);
                    }  
                    
                    this._popupEl.find('.popup-toggle').click();
                },
                (error) => {

                    Toast.error('Falha ao baixar categorias. ' + error.message);
                });
    }
}