(function(){

    function Toast() { }

    const DefaultConfig = {
        init: false,
        duration: 3000,
        type: mdtoast.INFO,
        modal: false,
        interaction: false,
        interactionTimeout: null,
        actionText: 'OK',
        // action: function() {
        //     //TODO: Undo codes here...
        //     this.hide(); // this is the toast instance
        // },
        //callbacks: {} //You can place the callbacks hidden() and shown() in this option if you have some things to do after the toast is shown or hidden.
    };

    Toast.info = function(message, config) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.INFO, duration: 2000 }, config);
        mdtoast(message, config); 
    }

    Toast.success = function(message, config) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.SUCCESS }, config);
        mdtoast(message, config); 
    }

    Toast.warn = function(message, config) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.WARNING }, config);
        mdtoast(message, config); 
    }

    Toast.error = function(message, config) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.ERROR, duration: 8000 }, config);
        mdtoast(message, config); 
    }    

    App.Utils.Namespace.CreateIfNotExists('App.Utils').Toast = Toast;

})();