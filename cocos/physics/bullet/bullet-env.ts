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

// Wasm Memory Page Size is 65536
export const pageSize = 65536; // 64KiB

// How many pages of the wasm memory
// TODO: let this can be canfiguable by user.
export const pageCount = 250;

// How mush memory size of the wasm memory
export const memorySize = pageSize * pageCount; // 16 MiB

// The import function used in c++ code, same as DLL Import
export const importFunc = {
    syncPhysicsToGraphics (id: number) {
        const bt = globalThis.Bullet;
        const body = bt.CACHE.getWrapper(id, bt.BODY_CACHE_NAME);
        body.syncPhysicsToGraphics();
    },
    onShapeHitExt (hit: number, controller: number) {
        const bt = globalThis.Bullet;
        const cct = bt.CACHE.getWrapper(controller, bt.CCT_CACHE_NAME);
        cct.onShapeHitExt(hit);
    },
};
