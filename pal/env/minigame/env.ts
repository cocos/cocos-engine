import { BYTEDANCE, WECHAT } from 'internal:constants';

declare const require: (path: string) =>  Promise<void>;

export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const container = document.createElement('div');
    return { frame: container, canvas: window.canvas, container };
}

export function loadJsFile (path: string): Promise<void> {
    if (BYTEDANCE || WECHAT) {
        // eslint-disable-next-line import/no-dynamic-require
        return require(`${path}`);
    }
    // eslint-disable-next-line import/no-dynamic-require
    return require(`./${path}`);
}
