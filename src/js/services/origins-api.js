import { FetchUtils } from "../core/fetch-utils.js";
import { GDespApi } from "./gdesp-api-core.js";
export class OriginsApi {
    constructor() {
        this.BaseUrl = GDespApi.BASE_URL + '/origens';
    }
    getAll() {
        const url = this.BaseUrl;
        var promise = FetchUtils.fetchJsonWithCache(new Request(url, {
            method: 'GET'
        }));
        return promise.then(promises => {
            const promisesMap = promises.map(x => {
                return x.then(origins => {
                    return origins.map((x) => ({
                        id: x.id,
                        name: x.nome
                    }));
                });
            });
            return promisesMap;
        });
    }
}
//# sourceMappingURL=origins-api.js.map