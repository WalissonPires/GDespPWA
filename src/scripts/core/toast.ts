/// <reference path="../../@types/mdtoast.d.ts" />


export class ToastOptions {

}

export class Toast 
{
    static info (message: string, config?: ToastOptions) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.INFO, duration: 2000 }, config);
        mdtoast(message, config); 
    }

    static success (message: string, config?: ToastOptions) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.SUCCESS }, config);
        mdtoast(message, config); 
    }

    static warn (message: string, config?: ToastOptions) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.WARNING }, config);
        mdtoast(message, config); 
    }

    static error (message: string, config?: ToastOptions) {

        config = Object.assign({}, DefaultConfig, { type: mdtoast.ERROR, duration: 8000 }, config);
        mdtoast(message, config); 
    }    

}

const DefaultConfig = {
    init: false,
    duration: 3000,
    type: mdtoast.INFO,
    modal: false,
    interaction: false,
    interactionTimeout: null as number,
    actionText: 'OK',
    // action: function() {
    //     //TODO: Undo codes here...
    //     this.hide(); // this is the toast instance
    // },
    //callbacks: {} //You can place the callbacks hidden() and shown() in this option if you have some things to do after the toast is shown or hidden.
};