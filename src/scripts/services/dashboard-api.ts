import { GDespApi } from "./gdesp-api-core.js";
import { FetchUtils } from "../core/fetch-utils.js";
import { DashboadDados } from "./entities/entities.js";
import { DashboardData, parseUserGuestId } from "../core/entities.js";

export class DashboardApi {
    
    private BaseUrl = GDespApi.BASE_URL + '/despesas';


    getTotalMonthPerPerson(month: number, year: number) {

        const date = new Date(year, month - 1, 1);
        const url = this.BaseUrl + '/devedores/' + encodeURIComponent(date.toISOString());

        const promise = FetchUtils.fetchJsonWithCache<DashboadDados[]>(new Request(url, {
            method: 'GET'
        }));

        return promise.then(promises => {

            const promisesMap = promises.map(x => {

                return x.then(data => {

                    return data.map(x => ({
                        date: x.data,
                        name: x.nome,
                        photoUrl: x.urlFotoPerfil,
                        value: x.valor
                    } as DashboardData));
                });
            });

            return promisesMap;
        });                        
    }

    getTotalMonthByCategory(month: number, year: number, userGuestId: string) {

        const date = new Date(year, month - 1, 1);
        let url = this.BaseUrl + '/categorias/' + encodeURIComponent(date.toISOString());

        if (userGuestId !== undefined) {

            const { userId, guestId } = parseUserGuestId(userGuestId);

            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }

        const promise = FetchUtils.fetchJsonWithCache<DashboadDados[]>(new Request(url, {
            method: 'GET'
        }));
        
        return promise.then(promises => {

            const promisesMap = promises.map(x => {

                return x.then(data => {

                    return data.map(x => ({
                        date: x.data,
                        name: x.nome,
                        photoUrl: x.urlFotoPerfil,
                        value: x.valor
                    } as DashboardData));
                });
            });

            return promisesMap;
        });          
    }

    getTotalMonthByOrigin(month: number, year: number, userGuestId: string) {

        const date = new Date(year, month - 1, 1);
        let url = this.BaseUrl + '/origens/' + encodeURIComponent(date.toISOString());

        if (userGuestId !== undefined) {

            const { userId, guestId } = parseUserGuestId(userGuestId);

            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }

        const promise = FetchUtils.fetchJsonWithCache<DashboadDados[]>(new Request(url, {
            method: 'GET'
        }));
        
        return promise.then(promises => {

            const promisesMap = promises.map(x => {

                return x.then(data => {

                    return data.map(x => ({
                        date: x.data,
                        name: x.nome,
                        photoUrl: x.urlFotoPerfil,
                        value: x.valor
                    } as DashboardData));
                });
            });

            return promisesMap;
        });          
    }

    getTotalMonthInYearByCategory(userGuestId: string) {
        
        let url = this.BaseUrl + '/categorias/ano';

        if (userGuestId !== undefined) {

            const { userId, guestId } = parseUserGuestId(userGuestId);

            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }

        const promise = FetchUtils.fetchJsonWithCache<DashboadDados[]>(new Request(url, {
            method: 'GET'
        }));
        
        return promise.then(promises => {

            const promisesMap = promises.map(x => {

                return x.then(data => {

                    return data.map(x => ({
                        date: x.data,
                        name: x.nome,
                        photoUrl: x.urlFotoPerfil,
                        value: x.valor,
                        color: x.cor
                    } as DashboardData));
                });
            });

            return promisesMap;
        });          
    }

    getTotalMonthInYear(userGuestId: string) {
        
        let url = this.BaseUrl + '/total/mes/ano';

        if (userGuestId !== undefined) {

            const { userId, guestId } = parseUserGuestId(userGuestId);

            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }

        const promise = FetchUtils.fetchJsonWithCache<DashboadDados[]>(new Request(url, {
            method: 'GET'
        }));
        
        return promise.then(promises => {

            const promisesMap = promises.map(x => {

                return x.then(data => {

                    return data.map(x => ({
                        date: x.data,
                        name: x.nome,
                        photoUrl: x.urlFotoPerfil,
                        value: x.valor,
                        color: x.cor
                    } as DashboardData));
                });
            });

            return promisesMap;
        });          
    }
}