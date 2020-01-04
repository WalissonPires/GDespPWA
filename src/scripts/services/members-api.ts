import { GDespApi } from "./gdesp-api-core.js";
import { FetchUtils } from "../core/fetch-utils.js";
import { Membro } from "./entities/entities.js";
import { Member, createUserGuestId } from "../core/entities.js";

export class MembersApi {

    private BaseUrl = GDespApi.BASE_URL + '/convidados';

    getAll() {
        
        const url = this.BaseUrl;

        var promise = FetchUtils.fetchJsonWithCache<Membro[]>(new Request(url, {
            method: 'GET'
        }));

        return promise.then(promises => {

            const promisesMap = promises.map(x => {

                return x.then(members => {

                    return members.map((x) => { 
                        
                        const m: Member = { 
                            id: 0,
                            name: x.nome,                        
                            userId: x.usuarioID,
                            guestId: x.id > 0 ? x.id : null,
                            price: 0,
                            userGuestId: null
                        };

                        m.userGuestId = createUserGuestId(m.userId, m.guestId);

                        return m;
                    });
                });
            });

            return promisesMap;
        });
    }
}