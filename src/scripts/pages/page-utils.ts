
export interface IPageConstructor {
    new(pagaElement: HTMLElement): PageBase;
}

export abstract class PageBase {
    constructor (pageEl: HTMLElement) {}
}