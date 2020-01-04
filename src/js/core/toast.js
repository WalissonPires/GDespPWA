/// <reference path="../../@types/mdtoast.d.ts" />
export class ToastOptions {
}
export class Toast {
    static info(message, config) {
        config = Object.assign({}, DefaultConfig, { type: mdtoast.INFO, duration: 2000 }, config);
        mdtoast(message, config);
    }
    static success(message, config) {
        config = Object.assign({}, DefaultConfig, { type: mdtoast.SUCCESS }, config);
        mdtoast(message, config);
    }
    static warn(message, config) {
        config = Object.assign({}, DefaultConfig, { type: mdtoast.WARNING }, config);
        mdtoast(message, config);
    }
    static error(message, config) {
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
    interactionTimeout: null,
    actionText: 'OK',
};
//# sourceMappingURL=toast.js.map