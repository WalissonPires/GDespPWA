import { Expense } from "../core/entities.js";
import { FunctionComponentConstructor } from "./component-utils.js";


export class CardExpenseComponentOptions {
    expense: Expense;
}

export const  CardExpenseComponent = function (options: CardExpenseComponentOptions) {
    
    options = options || new CardExpenseComponentOptions();
    const dom = $(cardHtml(options.expense))[0];
    return dom;
} as any as FunctionComponentConstructor<CardExpenseComponentOptions>;


function cardHtml(expense: Expense) {             
    
    const id = expense.id;
    const categoryLetter = expense.category.name[0];
    const categoryColor = expense.category.color || 'gray';
    const description = expense.description + (expense.totalInstallments > 1 
        ? (' ' + expense.currentInstallment + '/' + expense.totalInstallments) : '');
    const info = new Date(expense.purchaseDate).toLocaleDateString();
    const price = 'R$ ' + expense.price.toFixed(2).replace('.', ',');
    const membersLetter = expense.members.map((x) => x.name[0]);

    const makeMembersHtml = (mCharList: string[]) => 
        (mCharList.map(mChar => `<span class="icon-circle">${mChar}</span>`).join(''));

    return `
    <div class="card-expense" data-id="${id}">
        <div class="content">
            <div class="icon">
            <span class="icon-circle" style="background-color: ${categoryColor}">${categoryLetter}</span>
            </div>
            <div class="detail">
                <p class="description">${description}</p>
                <p class="info hint-color">${info}</p>
            </div>
            <div class="price">
                <span>${price}</span>
            </div>                        
        </div>
        <div class="footer">
            <div class="info hint-color"><span>Membros: </span></div>
            <div class="members">  
                ${makeMembersHtml(membersLetter)}                                                        
            </div>
        </div>
    </div>
    `;        
}