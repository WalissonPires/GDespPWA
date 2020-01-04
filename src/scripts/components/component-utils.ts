

export interface FunctionComponentConstructor<TOptions> {
    new(options: TOptions): HTMLElement;
}