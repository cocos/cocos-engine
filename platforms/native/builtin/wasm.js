/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

// fix: WebAssembly.instantiate not working well on V8.
(function injectWebAssembly() {
    if (!globalThis.WebAssembly) {
        console.warn('WebAssembly is not supported!');
        return;
    }

    console.info('injectWebAssembly ...');

    const oldWebAssemblyInstantiate = WebAssembly.instantiate;
    const oldWebAssemblyCompile = WebAssembly.compile;

    WebAssembly.compile = function(bufferSource) {
        return new Promise((resolve, reject)=>{
            if (!bufferSource) {
                reject('WebAssembly.compile: Invalid buffer source!');
            } else if (CC_EDITOR) {
                // FIX EDITOR ERROR: WebAssembly.Compile is disallowed on the main thread, if the buffer size is larger than 4KB. Use WebAssembly.compile, or compile on a worker thread.
                resolve(oldWebAssemblyCompile.call(WebAssembly, bufferSource));
            } else {
                resolve(new WebAssembly.Module(bufferSource));
            }
        });
    }

    WebAssembly.instantiate = function(bufferSourceOrModule, importObject) {
        let ret;
        if (bufferSourceOrModule instanceof WebAssembly.Module) {
            ret = oldWebAssemblyInstantiate(bufferSourceOrModule, importObject);
        }
        else {
            ret = new Promise((resolve, reject)=>{
                WebAssembly.compile(bufferSourceOrModule)
                .then((mod)=>{
                    oldWebAssemblyInstantiate(mod, importObject)
                    .then((instance)=>{
                        resolve({
                            instance: instance,
                            module: mod
                        });
                    })
                    .catch(reject);
                })
                .catch(reject);
            });
        }

        return ret;
    };
})();
