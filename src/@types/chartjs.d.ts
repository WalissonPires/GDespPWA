declare class Chart {
    constructor(ctx: CanvasRenderingContext2D, options: ChartOptions);

    static defaults: {
        [prop: string]: any;
        global: {
            [prop: string]: any;
        }
    }
}

declare interface ChartOptions {
    type: 'line' | 'bar',
    data: {
        labels: string[];
        datasets: any[];
    },
    options: ChartSettings;
}

declare interface ChartSettings {
    [prop: string]: any;
}