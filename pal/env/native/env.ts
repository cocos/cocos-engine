declare const require: (path: string) =>  Promise<void>;

const ccwindow = typeof globalThis.jsb !== 'undefined' ? (typeof jsb.window !== 'undefined' ? jsb.window : window) : window;
const ccdocument = ccwindow.document;

export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const container = ccdocument.createElement('div');
    const frame = ccdocument.documentElement as HTMLDivElement;
    const canvas = ccwindow.__canvas;
    return { frame, canvas, container };
}

export function loadJsFile (path: string): Promise<void> {
    // eslint-disable-next-line import/no-dynamic-require
    return require(`${path}`);
}
