import { FetchUtils } from "../core/fetch-utils.js";
import { Origin } from "../core/entities.js";
import { Origem } from "./entities/entities.js";
import { GDespApi } from "./gdesp-api-core.js";


export class OriginsApi {
    
    private BaseUrl = GDespApi.BASE_URL + '/origens';

    getAll() {
        
        const url = this.BaseUrl;

        var promise = FetchUtils.fetchJsonWithCache<Origem[]>(new Request(url, {
            method: 'GET'
        }));

        return promise.then(promises => {

            const promisesMap = promises.map(x => {

                return x.then(origins => {

                    return origins.map((x) => ({
                        id: x.id,
                        name: x.nome
                    } as Origin));
                });
            });

            return promisesMap;
        });
    }
}