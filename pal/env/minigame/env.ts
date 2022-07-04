import { BAIDU, XIAOMI } from 'internal:constants';

declare const require: (path: string) =>  Promise<void>;
declare const __baiduRequire: (path: string) =>  Promise<void>;

export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const container = document.createElement('div');
    return { frame: container, canvas: window.canvas, container };
}

export function loadJsFile (path: string): Promise<void> {
    // eslint-disable-next-line import/no-dynamic-require
    if (XIAOMI) {
        return require(`../../${path}`);
    }
    if (BAIDU) {
        return __baiduRequire(`./${path}`);
    }
    return require(`../${path}`);
}
