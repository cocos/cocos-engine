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

import { instantiateWasm } from 'pal/wasm';
import { WASM_SUPPORT_MODE } from 'internal:constants';
import bulletWasmUrl from 'external:emscripten/bullet/bullet.wasm';
import asmFactory from 'external:emscripten/bullet/bullet.asm.js';
import { game } from '../../game';
import { sys } from '../../core';
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

function initWasm (wasmUrl: string) {
    console.debug('[Physics][Bullet]: Using wasm Bullet libs.');
    const infoReport = (msg: any) => { console.info(msg); };
    const memory = new WebAssembly.Memory({ initial: pageCount });
    const importObject = {
        cc: importFunc,
        wasi_snapshot_preview1: { fd_close: infoReport, fd_seek: infoReport, fd_write: infoReport },
        env: { memory },
    };

    return instantiateWasm(wasmUrl, importObject).then((results) => {
        const btInstance = results.instance.exports as Bullet.instance;
        Object.assign(bt, btInstance);
    });
}

function initAsm (resolve) {
    console.debug('[Physics][Bullet]: Using asmjs Bullet libs.');
    const env: any = importFunc;
    const wasmMemory: any = {};
    wasmMemory.buffer = new ArrayBuffer(pageSize * pageCount);
    env.memory = wasmMemory;
    const btInstance = asmFactory(env, wasmMemory);
    Object.assign(bt, btInstance);
    resolve();
}

export function waitForAmmoInstantiation () {
    return new Promise<void>((resolve) => {
        const errorReport = (msg: any) => { console.error(msg); };
        if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
            if (sys.hasFeature(sys.Feature.WASM)) {
                initWasm(bulletWasmUrl).then(resolve).catch(errorReport);
            } else {
                initAsm(resolve);
            }
        } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
            initWasm(bulletWasmUrl).then(resolve).catch(errorReport);
        } else {
            initAsm(resolve);
        }
    });
}

game.onPostInfrastructureInitDelegate.add(waitForAmmoInstantiation);
