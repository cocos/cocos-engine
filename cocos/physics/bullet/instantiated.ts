/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import bulletModule from '@cocos/bullet';
import { WECHAT } from 'internal:constants';
import { physics } from '../../../exports/physics-framework';
import { pageSize, pageCount, importFunc } from './bullet-env';

let bulletLibs: any = bulletModule;
if (globalThis.BULLET) {
    console.log('[Physics][Bullet]: Using the external Bullet libs.');
    bulletLibs = globalThis.BULLET;
}

if (!physics.selector.runInEditor) bulletLibs = () => ({});

interface instanceExt extends Bullet.instance {
    CACHE: any,
    BODY_CACHE_NAME: string,
}

export const bt: instanceExt = {} as any;
globalThis.Bullet = bt;
bt.BODY_CACHE_NAME = 'body';

export function waitForAmmoInstantiation (dirRoot: string) {
    if (typeof bulletModule === 'string') {
        console.info('[Physics][Bullet]: Using wasm Bullet libs.');
        const infoReport = (msg: any) => { console.info(msg); };
        const errorReport = (msg: any) => { console.error(msg); };
        const memory = new WebAssembly.Memory({ initial: pageCount });
        const importObject = {
            cc: importFunc,
            wasi_snapshot_preview1: { fd_close: infoReport, fd_seek: infoReport, fd_write: infoReport },
            env: { memory },
        };
        return new Promise<void>((resolve, reject) => {
            function instantiateWasm (buff: any) {
                WebAssembly.instantiate(buff, importObject).then((results) => {
                    const btInstance = results.instance.exports as unknown as Bullet.instance;
                    Object.assign(bt, btInstance);
                    resolve();
                }, errorReport);
            }

            if (WECHAT) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                const wasmFilePath = `${dirRoot}${bulletModule}` as any;
                instantiateWasm(wasmFilePath);
            } else {
                fetch(bulletModule as any).then((response) => {
                    response.arrayBuffer().then((buff) => {
                        instantiateWasm(buff);
                    }, errorReport);
                }, errorReport);
            }
        });
    } else {
        console.info('[Physics][Bullet]: Using asmjs Bullet libs.');
        const env: any = importFunc;
        const wasmMemory: any = {};
        wasmMemory.buffer = new ArrayBuffer(pageSize * pageCount);
        env.memory = wasmMemory;
        const btInstance = bulletLibs(env, wasmMemory);
        Object.assign(bt, btInstance);
        return new Promise<void>((resolve, reject) => { resolve(); });
    }
}
