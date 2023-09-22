/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

import { instantiateWasm, fetchBuffer } from 'pal/wasm';
import { JSB, WASM_SUPPORT_MODE, CULL_ASM_JS_MODULE, EDITOR, TEST } from 'internal:constants';
import { wasmFactory, box2dWasmUrl } from './box2d.wasmjs';
import { asmFactory } from './box2d.asmjs';

import { game } from '../../game';
import { getError, error, sys, debug, IVec2Like } from '../../core';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';

export const B2 = {} as any;

export function getImplPtr (wasmObject: any): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (!wasmObject) return 0;
    return (wasmObject).$$.ptr as number;
}

/**
* mapping wasm-object-ptr to ts-object
*  B2.Fixture pointer -->B2Shape2D
*  B2.Body pointer --> B2RigidBody2D
*  B2.Contact pointer --> PhysicsContact
*  B2.Joint pointer --> B2Joint
*  ...
*/
const WASM_OBJECT_PTR_2_TS_OBJECT = {};
export function addImplPtrReference (TSObject: any, implPtr: number): void {
    if (implPtr) { WASM_OBJECT_PTR_2_TS_OBJECT[implPtr] = TSObject; }
}
export function removeImplPtrReference (implPtr: number): void {
    if (implPtr) {
        delete WASM_OBJECT_PTR_2_TS_OBJECT[implPtr];
    }
}
export function getTSObjectFromWASMObjectPtr<T> (implPtr: number): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return WASM_OBJECT_PTR_2_TS_OBJECT[implPtr];
}
export function getTSObjectFromWASMObject<T> (impl: any): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return WASM_OBJECT_PTR_2_TS_OBJECT[getImplPtr(impl)];
}

/**
* mapping wasm-object-ptr to wasm-object
*  B2.Fixture pointer -->B2.Fixture
*  B2.Body pointer --> B2.Body
*  B2.Contact pointer --> B2.Contact
*  B2.Joint pointer --> B2.Joint
*  ...
*/
const WASM_OBJECT_PTR_2_WASM_OBJECT = {};
export function addImplPtrReferenceWASM (WASMObject: any, implPtr: number): void {
    if (implPtr) { WASM_OBJECT_PTR_2_WASM_OBJECT[implPtr] = WASMObject; }
}

export function removeImplPtrReferenceWASM (implPtr: number): void {
    if (implPtr) {
        delete WASM_OBJECT_PTR_2_WASM_OBJECT[implPtr];
    }
}

export function getWASMObjectFromWASMObjectPtr<T> (implPtr: number): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return WASM_OBJECT_PTR_2_WASM_OBJECT[implPtr];
}

/**
* ts implementation of c++ b2Mul
*/
export function b2Mul (T: any, v: IVec2Like, out: IVec2Like): void {
    out.x = (T.q.c * v.x - T.q.s * v.y) + T.p.x;
    out.y = (T.q.s * v.x + T.q.c * v.y) + T.p.y;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
function initWasm (wasmUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const errorMessage = (err: any): string => `[box2d]: box2d wasm lib load failed: ${err}`;
        wasmFactory({
            instantiateWasm (
                importObject: WebAssembly.Imports,
                receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
            ) {
                // NOTE: the Promise return by instantiateWasm hook can't be caught.
                instantiateWasm(wasmUrl, importObject).then((result: any) => {
                    receiveInstance(result.instance as WebAssembly.Instance, result.module as WebAssembly.Module);
                }).catch((err) => reject(errorMessage(err)));
            },
        }).then((Instance: any) => {
            if (!EDITOR && !TEST) debug('[box2d]:box2d wasm lib loaded.');
            Object.assign(B2, Instance);
        }).then(resolve).catch((err: any) => reject(errorMessage(err)));
    });
}

function initAsm (): Promise<void> {
    if (asmFactory != null) {
        return asmFactory().then((instance: any) => {
            if (!EDITOR && !TEST) debug('[box2d]:box2d asm lib loaded.');
            Object.assign(B2, instance);
        });
    } else {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
}

export function waitForBox2dWasmInstantiation (): Promise<void> {
    const errorReport = (msg: any): void => { error(msg); };
    if ((WASM_SUPPORT_MODE as WebAssemblySupportMode) === WebAssemblySupportMode.MAYBE_SUPPORT) {
        if (sys.hasFeature(sys.Feature.WASM)) {
            return initWasm(box2dWasmUrl).catch(errorReport);
        } else {
            return initAsm().catch(errorReport);
        }
    } else if ((WASM_SUPPORT_MODE as WebAssemblySupportMode) === WebAssemblySupportMode.SUPPORT) {
        return initWasm(box2dWasmUrl).catch(errorReport);
    } else {
        return initAsm().catch(errorReport);
    }
}

game.onPostInfrastructureInitDelegate.add(waitForBox2dWasmInstantiation);
