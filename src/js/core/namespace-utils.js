window.App = window.App || {};
window.App.Utils = window.App.Utils = {};
window.App.Utils.Namespace = {}; 

window.App.Utils.Namespace.CreateIfNotExists = function(namespace) {

    let root = window;
    let paths = (namespace || '').split('.');

    for(let i = 0; i < paths.length; i++) {
    
        if (paths[i] === '')
            continue;

        if (root[paths[i]] === undefined)
            root[paths[i]] = {};

        root = root[paths[i]];
    }

    return root;
};