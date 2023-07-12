/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ensureWasmModuleReady, instantiateWasm } from 'pal/wasm';
import { CULL_ASM_JS_MODULE, FORCE_BANNING_BULLET_WASM, WASM_SUPPORT_MODE } from 'internal:constants';
import { game } from '../../game';
import { debug, error, getError, sys } from '../../core';
import { pageSize, pageCount, importFunc } from './bullet-env';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';

//corresponds to bulletType in bullet-compile
export enum EBulletType{
    EBulletTypeVec3 = 0,
    EBulletTypeQuat,
    EBulletTypeTransform,
    EBulletTypeMotionState,
    EBulletTypeCollisionObject,
    EBulletTypeCollisionShape,
    EBulletTypeCharacterController,
    EBulletTypeStridingMeshInterface,
    EBulletTypeTriangleMesh,
    EBulletTypeCollisionDispatcher,
    EBulletTypeDbvtBroadPhase,
    EBulletTypeSequentialImpulseConstraintSolver,
    EBulletTypeCollisionWorld,
    EBulletTypeTypedConstraint
}

//corresponds to btTriangleRaycastCallback::EFlags
export enum EBulletTriangleRaycastFlag {
    NONE                            = 0,
    FilterBackfaces                 = 1 << 0,
    KeepUnflippedNormal             = 1 << 1, //Prevents returned face normal getting flipped when a ray hits a back-facing triangle
    UseSubSimplexConvexCastRaytest  = 1 << 2, //default, uses an approximate but faster ray versus convex intersection algorithm
    UseGjkConvexCastRaytest         = 1 << 3
}

interface instanceExt extends Bullet.instance {
    CACHE: any,
    BODY_CACHE_NAME: string,
    CCT_CACHE_NAME: string,
}

export const bt: instanceExt = {} as any;
globalThis.Bullet = bt;
bt.BODY_CACHE_NAME = 'body';
bt.CCT_CACHE_NAME = 'cct';

function initWasm (wasmUrl: string, importObject: WebAssembly.Imports) {
    debug('[Physics][Bullet]: Using wasm Bullet libs.');
    return instantiateWasm(wasmUrl, importObject).then((results) => {
        const btInstance = results.instance.exports as Bullet.instance;
        Object.assign(bt, btInstance);
    });
}

function initAsmJS (asmFactory): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (CULL_ASM_JS_MODULE) {
            reject(getError(4601));
            return;
        }
        debug('[Physics][Bullet]: Using asmjs Bullet libs.');
        const env: any = importFunc;
        const wasmMemory: any = {};
        wasmMemory.buffer = new ArrayBuffer(pageSize * pageCount);
        env.memory = wasmMemory;
        const btInstance = asmFactory(env, wasmMemory);
        Object.assign(bt, btInstance);
        resolve();
    });
}

function getImportObject (): WebAssembly.Imports {
    const infoReport = (msg: any) => { debug(msg); };
    const memory = new WebAssembly.Memory({ initial: pageCount });
    const importObject = {
        cc: importFunc,
        wasi_snapshot_preview1: { fd_close: infoReport, fd_seek: infoReport, fd_write: infoReport },
        env: { memory },
    };
    return importObject;
}

// HACK: on iOS Wechat 8.0.9 with Wechat lib version 2.19.2
// we cannot declare importObject in waitForAmmoInstantiation function, or the importObject would be auto released by GC,
// which may cause the app crashing. I guess it's a BUG on their js runtime.
let importObject: WebAssembly.Imports;
if (!FORCE_BANNING_BULLET_WASM) {
    if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
        if (sys.hasFeature(sys.Feature.WASM)) {
            importObject = getImportObject();
        }
    } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
        importObject = getImportObject();
    }
}

function shouldUseWasmModule () {
    if (FORCE_BANNING_BULLET_WASM) {
        return false;
    } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
        return sys.hasFeature(sys.Feature.WASM);
    } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
        return true;
    } else {
        return false;
    }
}

export function waitForAmmoInstantiation () {
    const errorReport = (msg: any) => { error(msg); };
    return ensureWasmModuleReady().then(() => Promise.all([
        import('external:emscripten/bullet/bullet.wasm'),
        import('external:emscripten/bullet/bullet.asm.js'),
    ]).then(([
        { default: bulletWasmUrl },
        { default: asmFactory  },
    ]) => {
        if (shouldUseWasmModule()) {
            return initWasm(bulletWasmUrl, importObject);
        } else {
            return initAsmJS(asmFactory);
        }
    })).catch(errorReport);
}

game.onPostInfrastructureInitDelegate.add(waitForAmmoInstantiation);
