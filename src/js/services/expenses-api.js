import { GDespApi } from "./gdesp-api-core.js";
import { FetchUtils } from "../core/fetch-utils.js";
import { createUserGuestId } from "../core/entities.js";
export class ExpensesApi {
    constructor() {
        this.baseUrl = GDespApi.BASE_URL + '/despesas';
        this.baseUrlv2 = GDespApi.BASE_URL + '/v2/despesas';
    }
    getByMonth(month, year) {
        const date = new Date(year, month - 1, 1);
        const url = this.baseUrl + '/mes/' + encodeURIComponent(date.toISOString());
        const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
            method: 'GET'
        }));
        return promise.then(promises => {
            const promisesMap = promises.map(x => {
                return x.then(despesas => {
                    return despesas.map(this.parseGDespExpense);
                });
            });
            return promisesMap;
        });
    }
    update(expense) {
        const splitId = expense.id.split('-');
        const expenseMaped = {
            despesaID: parseInt(splitId[0]),
            parcelaID: parseInt(splitId[1]),
            descricao: expense.description,
            vencimento: expense.dueDate,
            origemID: expense.originId,
            categoriaID: expense.categoryId,
            valor: undefined,
            isFixa: undefined,
            isPaga: undefined,
            parcelaAtual: undefined,
            totalParcelas: undefined,
            categoria: undefined,
            origem: undefined,
            dataCompra: undefined,
            devedores: undefined
        };
        return FetchUtils.fetchJson(new Request(this.baseUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseMaped)
        }));
    }
    create(expense) {
        const expenseMaped = {
            despesaID: 0,
            parcelaID: 0,
            criadoEm: undefined,
            descricao: expense.description,
            vencimento: expense.dueDate,
            valor: expense.price,
            origemID: expense.originId,
            totalParcelas: 1,
            parcelaAtual: 1,
            categoriaID: expense.categoryId,
            isPaga: false,
            isFixa: false,
        };
        return FetchUtils.fetchJson(new Request(this.baseUrlv2, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseMaped)
        })).then(expenseCreated => {
            return this.mapDespesaCriacaoToExpense(expenseCreated, expense);
        });
    }
    updatePartial(expense) {
        const splitId = expense.id.split('-');
        // Aqui as propriedades devem ser exatamente iguais ao do servidor
        const expenseMaped = {
            ID: splitId[0],
            Descricao: expense.description,
            Vencimento: expense.dueDate,
            OrigemID: expense.originId,
            CategoriaID: expense.categoryId,
        };
        let expPartial = [];
        for (let key in expenseMaped) {
            if (expenseMaped[key] !== undefined)
                expPartial.push({ campo: key, valor: expenseMaped[key] });
        }
        const url = this.baseUrl + '/' + splitId[0] + '/parcial';
        return FetchUtils.fetchJson(new Request(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expPartial) //**** */
        }));
    }
    updateMembers(expenseId, members) {
        const splitId = expenseId.split('-');
        const url = this.baseUrl + '/' + splitId[0] + '/parcela/' + splitId[1] + '/devedores/true';
        const membersMaped = members.map(x => ({
            id: x.id,
            convidadoId: x.guestId,
            usuarioId: x.userId,
            valorPagar: x.price
        }));
        return FetchUtils.fetchJson(new Request(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membersMaped)
        }));
    }
    delete(expenseId) {
        const splitId = expenseId.split('-');
        const url = this.baseUrlv2 + '/' + splitId[0];
        return FetchUtils.fetchJson(new Request(url, {
            method: 'DELETE',
        }));
    }
    mapDespesaCriacaoToExpense(despesa, expense = null) {
        expense = expense || {};
        expense.id = despesa.despesaID + '-' + despesa.parcelaID;
        expense.description = despesa.descricao;
        expense.createDate = despesa.criadoEm;
        expense.purchaseDate = despesa.criadoEm;
        expense.dueDate = despesa.vencimento;
        expense.originId = despesa.origemID;
        expense.origin && (expense.origin.id = despesa.origemID);
        expense.categoryId = despesa.categoriaID;
        expense.category && (expense.category.id = despesa.categoriaID);
        expense.price = despesa.valor;
        expense.totalInstallments = despesa.totalParcelas;
        expense.currentInstallment = despesa.parcelaAtual;
        expense.members = [{
                id: despesa.devedorId,
                userGuestId: createUserGuestId(despesa.devedorUsId, despesa.devedorConvId),
                guestId: despesa.devedorConvId,
                userId: despesa.devedorUsId,
                name: despesa.devedorNome,
                price: despesa.valor
            }];
        return expense;
    }
    parseGDespExpense(gExp) {
        const exp = {
            id: gExp.despesaID + '-' + gExp.parcelaID,
            description: gExp.descricao,
            currentInstallment: gExp.parcelaAtual,
            totalInstallments: gExp.totalParcelas,
            createDate: gExp.dataCompra,
            purchaseDate: gExp.dataCompra,
            dueDate: gExp.vencimento,
            paidDate: null,
            price: gExp.valor,
            categoryId: gExp.categoriaID,
            category: {
                id: gExp.categoriaID,
                name: gExp.categoria,
                color: gExp.categoriaCor
            },
            originId: gExp.origemID,
            origin: {
                id: gExp.origemID || 0,
                name: gExp.origem
            },
            members: gExp.devedores.map(x => ({
                id: x.id,
                guestId: x.convidadoId,
                userId: x.usuarioId,
                name: x.nome,
                price: x.valor,
                userGuestId: createUserGuestId(x.usuarioId, x.convidadoId)
            }))
        };
        return exp;
    }
}
//# sourceMappingURL=expenses-api.js.map