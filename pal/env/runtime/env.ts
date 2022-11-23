import { COCOSPLAY, HUAWEI, OPPO, VIVO } from 'internal:constants';

declare const require: (path: string) =>  Promise<void>;
declare const ral: any;

export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const container = document.createElement('div');
    let frame;
    if (COCOSPLAY) {
        frame = {
            clientWidth: window.innerWidth,
            clientHeight: window.innerHeight,
        } as any;
    } else {
        frame = container.parentNode === document.body ? document.documentElement : container.parentNode as any;
    }
    let canvas;
    if (VIVO) {
        canvas = window.mainCanvas;
        window.mainCanvas = undefined;
    } else {
        canvas = ral.createCanvas();
    }
    return { frame, canvas, container };
}

export function loadJsFile (path: string): Promise<void> {
    // eslint-disable-next-line import/no-dynamic-require
    return require(`${path}`);
}
