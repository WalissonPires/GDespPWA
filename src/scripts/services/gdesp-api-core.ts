
export const GDespApi = {
    BASE_URL: window.location.hash === '#local' 
        ? 'http://localhost:8082/GDespApi/API'
        : window.location.hash === '#debug'
            ? 'http://localhost:5001/API'
            : 'https://wprm.dlinkddns.com/GDespApi/API'
};

if (window.location.hash && window.location.hash.indexOf('#baseUrl-') >= 0) {

    var baseUrl = window.location.hash.split('-')[1];
    GDespApi.BASE_URL = baseUrl;
}