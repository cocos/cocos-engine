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
import { JSB, WASM_SUPPORT_MODE } from 'internal:constants';
import spineWasmUrl from 'external:emscripten/spine/spine.wasm';
import asmFactory from 'external:emscripten/spine/spine.asm.js';
import { game } from '../../game';
import { sys } from '../../core';
import { WebAssemblySupportMode } from '../../misc/webassembly-support';

const PAGESIZE = 65536; // 64KiB

// How many pages of the wasm memory
// TODO: let this can be canfiguable by user.
const PAGECOUNT = 64 * 16;

// How mush memory size of the wasm memory
const MEMORYSIZE = PAGESIZE * PAGECOUNT; // 64 MiB

let btInstance: SpineWasm.instance = {} as any;

/**
 * @engineInternal
 */
export class FileResource {
    private fileList = new Map<string, Uint8Array>();
    public addTextRes (name: string, data: string) {
        const encoder = new TextEncoder();
        const array = encoder.encode(data);
        this.fileList.set(name, array);
    }
    public addRawRes (name: string, data: Uint8Array) {
        const encoder = new TextEncoder();
        this.fileList.set(name, data);
    }

    public RequireFileBuffer (name: string): Uint8Array {
        if (!this.fileList.has(name)) return new Uint8Array(0);
        const array = this.fileList.get(name);
        return array!;
    }
}
/**
 * @engineInternal
 */
export const wasmResourceInstance = new FileResource();

let _HEAPU8: Uint8Array = null!;

function _reportError () {
    console.error('invalid operation');
}

function _assert_fail () {
    console.error('_assert_fail');
}

function _emscripten_memcpy_big (dest, src, num) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    _HEAPU8.copyWithin(dest, src, src + num);
}

function _emscripten_resize_heap (requestedSize) {
    console.error('no support _emscripten_resize_heap');
    return false;
}

function _abort (err) {
    console.error(err);
}

function _abortOnCannotGrowMemory (err) {
    console.error(`abortOnCannotGrowMemory${err}`);
}

function _cxa_throw (ptr, type, destructor) {
    console.error(`cxa_throw: throwing an exception, ${[ptr, type, destructor]}`);
}

function _cxa_allocate_exception (size) {
    console.error(`cxa_allocate_exception${size}`);
    return false; // always fail
}

function _consoleInfo (start: number, length: number) {
    const decoder = new TextDecoder();
    const source = _HEAPU8.subarray(start, start + length);
    const result = decoder.decode(source);
    console.log(result);
}
function _syscall_openat (dirfd, path, flags, varargs) {
    console.log(`syscall_openat eeror.`);
}
function _syscall_fcntl64 (fd, cmd, varargs) {
    console.log(`syscall_fcntl64 eeror.`);
}
function _syscall_ioctl (fd, op, varargs) {
    console.log(`syscall_ioctl eeror.`);
}

function _jsReadFile (start: number, length: number): number {
    const decoder = new TextDecoder();
    const source = _HEAPU8.subarray(start, start + length);
    const filePath = decoder.decode(source);
    const arrayData = wasmResourceInstance.RequireFileBuffer(filePath);
    const dataSize = arrayData.length;
    const address = btInstance.queryStoreMemory();
    const storeArray = _HEAPU8.subarray(address, address + dataSize);
    storeArray.set(arrayData);
    return dataSize;
}

const asmLibraryArg = {
    __assert_fail: _assert_fail,
    consoleInfo: _consoleInfo,
    abortOnCannotGrowMemory: _abortOnCannotGrowMemory,
    __cxa_allocate_exception: _cxa_allocate_exception,
    __cxa_throw: _cxa_throw,
    __syscall_fcntl64: _syscall_fcntl64,
    __syscall_ioctl: _syscall_ioctl,
    __syscall_openat: _syscall_openat,
    abort: _abort,
    emscripten_memcpy_big: _emscripten_memcpy_big,
    emscripten_resize_heap: _emscripten_resize_heap,
    fd_close: _reportError,
    fd_seek: _reportError,
    fd_read: _reportError,
    fd_write: _reportError,
    jsReadFile: _jsReadFile,
};

function initWasm (wasmUrl: string) {
    console.log('[Spine]: Using wasm libs.');
    const importObject = {
        wasi_snapshot_preview1: asmLibraryArg,
        env: asmLibraryArg,
    };

    return instantiateWasm(wasmUrl, importObject).then((results) => {
        const bt = results.instance.exports as SpineWasm.instance;
        Object.assign(btInstance, bt);
        btInstance.spineWasmInstanceInit();
        _HEAPU8 = new Uint8Array(btInstance.memory.buffer);
    });
}

function initAsm (resolve) {
    console.log('[Spine]: Using asmjs libs.');
    const wasmMemory: any = {};
    wasmMemory.buffer = new ArrayBuffer(MEMORYSIZE);
    const asmLibraryArg2 = { memory: wasmMemory };
    const module = {
        asmLibraryArg1: { ...asmLibraryArg, ...asmLibraryArg2 },
        wasmMemory,
    };
    return asmFactory(module).then((instance: any) => {
        btInstance = (instance).asm;
        btInstance.spineWasmInstanceInit();
        _HEAPU8 = instance.HEAPU8;
    });
}

export function waitForSpineWasmInstantiation () {
    return new Promise<void>((resolve) => {
        const errorReport = (msg: any) => { console.error(msg); };
        if (WASM_SUPPORT_MODE === WebAssemblySupportMode.MAYBE_SUPPORT) {
            if (sys.hasFeature(sys.Feature.WASM)) {
                initWasm(spineWasmUrl).then(resolve).catch(errorReport);
            } else {
                initAsm(resolve).then(resolve).catch(errorReport);
            }
        } else if (WASM_SUPPORT_MODE === WebAssemblySupportMode.SUPPORT) {
            initWasm(spineWasmUrl).then(resolve).catch(errorReport);
        } else {
            initAsm(resolve).then(resolve).catch(errorReport);
        }
    });
}

if (!JSB) {
    game.onPostInfrastructureInitDelegate.add(waitForSpineWasmInstantiation);
}

export function getSpineWasmInstance (): SpineWasm.instance {
    return btInstance;
}
export function getSpineWasmMemory (): Uint8Array {
    return _HEAPU8;
}
