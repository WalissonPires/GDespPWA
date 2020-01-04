import { FetchUtils } from "../core/fetch-utils.js";
import { GDespApi } from "./gdesp-api-core.js";
export class CategoriesApi {
    constructor() {
        this.BaseUrl = GDespApi.BASE_URL + '/categorias';
    }
    getAll() {
        const url = this.BaseUrl;
        var promise = FetchUtils.fetchJsonWithCache(new Request(url, {
            method: 'GET'
        }));
        return promise.then(promises => {
            const promisesMap = promises.map(x => {
                return x.then(categories => {
                    return categories.map((x) => ({
                        id: x.id,
                        createAtId: x.criadoPorID,
                        name: x.nome,
                        color: x.cor,
                    }));
                });
            });
            return promisesMap;
        });
    }
}
//# sourceMappingURL=categories-api.js.map