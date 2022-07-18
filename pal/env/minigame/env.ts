/* eslint-disable import/no-dynamic-require */
import { BAIDU, WECHAT, XIAOMI } from 'internal:constants';

declare const require: (path: string) => any;
declare const __baiduRequire: (path: string) => any;
declare const __wxRequire: (path: string) => any;

export function findCanvas (): { frame: HTMLDivElement, container: HTMLDivElement, canvas: HTMLCanvasElement } {
    const container = document.createElement('div');
    return { frame: container, canvas: window.canvas, container };
}

export function loadJsFile (path: string): any {
    if (XIAOMI) {
        return require(`../../${path}`);
    }
    if (BAIDU) {
        return __baiduRequire(`./${path}`);
    }
    if (WECHAT) {
        return __wxRequire(path);
    }
    return require(`../${path}`);
}
