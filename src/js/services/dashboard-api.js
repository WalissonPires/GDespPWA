import { GDespApi } from "./gdesp-api-core.js";
import { FetchUtils } from "../core/fetch-utils.js";
import { parseUserGuestId } from "../core/entities.js";
export class DashboardApi {
    constructor() {
        this.BaseUrl = GDespApi.BASE_URL + '/despesas';
    }
    getTotalMonthPerPerson(month, year) {
        const date = new Date(year, month - 1, 1);
        const url = this.BaseUrl + '/devedores/' + encodeURIComponent(date.toISOString());
        const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
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
                    }));
                });
            });
            return promisesMap;
        });
    }
    getTotalMonthByCategory(month, year, userGuestId) {
        const date = new Date(year, month - 1, 1);
        let url = this.BaseUrl + '/categorias/' + encodeURIComponent(date.toISOString());
        if (userGuestId !== undefined) {
            const { userId, guestId } = parseUserGuestId(userGuestId);
            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }
        const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
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
                    }));
                });
            });
            return promisesMap;
        });
    }
    getTotalMonthByOrigin(month, year, userGuestId) {
        const date = new Date(year, month - 1, 1);
        let url = this.BaseUrl + '/origens/' + encodeURIComponent(date.toISOString());
        if (userGuestId !== undefined) {
            const { userId, guestId } = parseUserGuestId(userGuestId);
            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }
        const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
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
                    }));
                });
            });
            return promisesMap;
        });
    }
    getTotalMonthInYearByCategory(userGuestId) {
        let url = this.BaseUrl + '/categorias/ano';
        if (userGuestId !== undefined) {
            const { userId, guestId } = parseUserGuestId(userGuestId);
            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }
        const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
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
                    }));
                });
            });
            return promisesMap;
        });
    }
    getTotalMonthInYear(userGuestId) {
        let url = this.BaseUrl + '/total/mes/ano';
        if (userGuestId !== undefined) {
            const { userId, guestId } = parseUserGuestId(userGuestId);
            url += '?devedorId=' + (userId != null ? userId : guestId);
            url += '&isUs=' + (userId != null);
        }
        const promise = FetchUtils.fetchJsonWithCache(new Request(url, {
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
                    }));
                });
            });
            return promisesMap;
        });
    }
}
//# sourceMappingURL=dashboard-api.js.map