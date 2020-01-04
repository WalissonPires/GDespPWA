export class CardExpenseComponentOptions {
}
export const CardExpenseComponent = function (options) {
    options = options || new CardExpenseComponentOptions();
    const dom = $(cardHtml(options.expense))[0];
    return dom;
};
function cardHtml(expense) {
    const id = expense.id;
    const categoryLetter = expense.category.name[0];
    const categoryColor = expense.category.color || 'gray';
    const description = expense.description + (expense.totalInstallments > 1
        ? (' ' + expense.currentInstallment + '/' + expense.totalInstallments) : '');
    const info = new Date(expense.purchaseDate).toLocaleDateString();
    const price = 'R$ ' + expense.price.toFixed(2).replace('.', ',');
    const membersLetter = expense.members.map((x) => x.name[0]);
    const makeMembersHtml = (mCharList) => (mCharList.map(mChar => `<span class="icon-circle">${mChar}</span>`).join(''));
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
//# sourceMappingURL=card-expense-component.js.map