import { FetchUtils } from "../core/fetch-utils.js";
import { Category } from "../core/entities.js";
import { Categoria } from "./entities/entities.js";
import { GDespApi } from "./gdesp-api-core.js";


    export class CategoriesApi {
        
        private BaseUrl = GDespApi.BASE_URL + '/categorias';

        getAll() {
         
            const url = this.BaseUrl;

            var promise = FetchUtils.fetchJsonWithCache<Categoria[]>(new Request(url, {
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
                            //criadoPor: null
                        } as Category));
                    });
                });

                return promisesMap;
            });
        }
    }