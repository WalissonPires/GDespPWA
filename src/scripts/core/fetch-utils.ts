
    export class ResponseError<T = any> {
        status: number;
        message: string;
        detail?: T;
    }

    export class FetchState {        
        index?: number;
        total?: number;
        isCache: boolean;
        isNetwork: boolean;
        error: any;
        fnThen?: FetchStateThenCallback;
        fnCatch?: FetchStateCatchCallback;
        fnAlways?: FetchStateAlwaysCallback;            
    }

    export interface FetchStateThenCallback {
        (this: FetchState, data: any): void;
    }

    export interface FetchStateCatchCallback {
        (this: FetchState, error: { message: string }): void;
    }

    export interface FetchStateAlwaysCallback {
        (this: FetchState): void;
    }

    export class FetchUtils {

    static fetchJson<TResult>(request: Request) {

        return fetch(request)
            .then((response) => {

                const isSuccess = Math.trunc(response.status / 100) === 2;
                const contentType = (response.headers.get("content-type") || '').toLowerCase();

                if (contentType === '') {

                    if (isSuccess) 
                        return null;
                    else
                        throw { 
                            status: response.status, 
                            message: '[Falha] Servidor respondeu com status: ' + response.status 
                        } as ResponseError;

                }
                else if (contentType && contentType.indexOf('text/plan') !== -1) {

                    return response.text().then((data) => {
                        
                        if (isSuccess)
                            return data;
                        else
                            throw {
                                status: response.status,
                                message: data,
                                detail: null
                            } as ResponseError;
                    });
                }  
                else if (contentType && contentType.indexOf("application/json") !== -1) {

                    return response.json().then((data) => {

                            if (isSuccess)
                                return data;
                            else
                                throw { 
                                    status: response.status, 
                                    message: '[Falha] Servidor respondeu com status: ' + response.status, 
                                    detail: data 
                                } as ResponseError;
                    });

                } else { 

                    throw { 
                        status: 0, 
                        message: 'Servidor respondeu em um formato inválido: ' + contentType 
                    } as ResponseError;
                }
            })
            .catch(error => {

                if (error instanceof TypeError) {

                    throw {
                        status: 0,
                        message: error.message
                    } as ResponseError
                }

                throw error;
            });

    }

    static fetchJsonWithCache<TResult> (request: Request) {

        const promiseWrapper = new Promise<Promise<TResult>[]>((resolve, reject) => {

            const promises: Promise<TResult>[] = [];
            
            promises.push(FetchUtils.fetchJson(request));
            
            if ('caches' in window) {
                
                caches.match(request.url).then(function(response) {
                    if (response) {
                        promises.push(response.json());                        
                    }
                    resolve(promises);
                });
            }          
            else
                resolve(promises);
        });

        return promiseWrapper;
    }

    static treatEachResponse (promiseWrapper: Promise<Promise<any>[]>, theThen: FetchStateThenCallback, 
        theCatch: FetchStateCatchCallback, theAlways?: FetchStateAlwaysCallback) {
        
        promiseWrapper.then(promises => {

            const promisesState: FetchState[] = [];

            const fnCatch = function bindedThis(error: any) {

                promisesState.push({ error: error, isCache: this.isCache, isNetwork: this.isNetwork });

                if (promisesState.length < promises.length)
                    return;        

                let networkError = promisesState[0].isNetwork 
                    ? promisesState[0].error 
                    : promisesState.length === 2 && promisesState[1].isNetwork 
                    ? promisesState[1].error
                    : null;
                
                const data = {
                    message: null as string
                };

                if (!networkError && error.message)
                    data.message = error.message;
                else if (networkError && networkError.status === 0)
                    data.message = 'Falha ao executar operação. Verifique sua conexão com a internet';
                else {
                    data.message = 'Uma falha desconhecida ocorreu. Contacte o suporte técnico';  

                    console.error({ error, networkError });
                }
                                  

                typeof this.fnCatch === 'function' && this.fnCatch.call(null, data);
            };


            promises.forEach((p, i) => {

                const state = {
                    index: i,
                    total: promises.length,
                    isCache: i == 1,
                    isNetwork: i == 0,
                    fnThen: theThen,
                    fnCatch: theCatch,
                    fnAlways: theAlways,
                    // promise: p
                };

                p
                .then(data => typeof theThen === 'function' && theThen.call(state, data))
                .catch(fnCatch.bind(state))
                .finally(() => typeof theAlways === 'function' && theAlways.call(state));
            });
        });
    }
}