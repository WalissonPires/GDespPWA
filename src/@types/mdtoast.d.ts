declare interface MaterialDesignToast {
    (m: string, c: Object): void;
    INFO: number;
    SUCCESS: number;
    WARNING: number;
    ERROR: number;
}

declare var mdtoast: MaterialDesignToast;