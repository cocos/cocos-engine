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
import { getError, error, sys, debug } from '../../core';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';

export const B2 = {} as any;
const B2_IMPL_PTR = {};

export function addImplReference (B2Object: any, impl: any): void {
    if (!impl) return;
    if (impl.$$) { B2_IMPL_PTR[impl.$$.ptr] = B2Object; }
}

export function removeImplReference (B2Object: any, impl: any): void {
    if (!impl) return;
    if (impl.$$) {
        B2_IMPL_PTR[impl.$$.ptr] = null;
        delete B2_IMPL_PTR[impl.$$.ptr];
    }
}

export function getB2ObjectFromImpl<T> (impl: any): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return B2_IMPL_PTR[impl.$$.ptr];
}

export function addImplPtrReference (B2Object: any, implPtr: number): void {
    if (implPtr) { B2_IMPL_PTR[implPtr] = B2Object; }
}

export function removeImplPtrReference (B2Object: any, implPtr: number): void {
    if (implPtr) {
        B2_IMPL_PTR[implPtr] = null;
        delete B2_IMPL_PTR[implPtr];
    }
}

export function getB2ObjectFromImplPtr<T> (implPtr: number): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return B2_IMPL_PTR[implPtr];
}

///////////////////////////////////////////////////////////////////////////////////////////////////
function initWasm (wasmUrl): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const errorMessage = (err: any): string => `[box2d]: box2d wasm lib load failed: ${err}`;
        wasmFactory({
            instantiateWasm (importObject: WebAssembly.Imports,
                receiveInstance: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void) {
                // NOTE: the Promise return by instantiateWasm hook can't be caught.
                instantiateWasm(wasmUrl, importObject).then((result: any) => {
                    receiveInstance(result.instance, result.module);
                }).catch((err) => reject(errorMessage(err)));
            },
        }).then((Instance: any) => {
            if (!EDITOR && !TEST) debug('[box2d]:box2d wasm lib loaded.');
            Object.assign(B2, Instance);
            B2.B2_IMPL_PTR = B2_IMPL_PTR;
        }).then(resolve).catch((err: any) => reject(errorMessage(err)));
    });
}

function initAsm (): Promise<void> {
    if (asmFactory != null) {
        return asmFactory().then((instance: any) => {
            if (!EDITOR && !TEST) debug('[box2d]:box2d asm lib loaded.');
            Object.assign(B2, instance);
            B2.B2_IMPL_PTR = B2_IMPL_PTR;
        });
    } else {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
}

export function waitForBox2dWasmInstantiation (): Promise<void> {
    const errorReport = (msg: any): void => { error(msg); };
    if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
        if (sys.hasFeature(sys.Feature.WASM)) {
            return initWasm(box2dWasmUrl).catch(errorReport);
        } else {
            return initAsm().catch(errorReport);
        }
    } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
        return initWasm(box2dWasmUrl).catch(errorReport);
    } else {
        return initAsm().catch(errorReport);
    }
}

game.onPostInfrastructureInitDelegate.add(waitForBox2dWasmInstantiation);
