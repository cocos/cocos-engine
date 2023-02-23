/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/
import importMap from './src/<%= importMapUrl%>'
const commonJSModuleMap: Record<string, Function> = {
    '/src/<%= applicationUrl%>'() { require('./src/<%= applicationUrl%>'); },
<% if (chunkBundleUrl) { %>
    '/src/chunks/<%= chunkBundleUrl%>'() { require('./src/chunks/<%= chunkBundleUrl%>') },
<% }  %> 
<% for (var i = 0; i < ccUrls.length; i++) {%>
    '/src/cocos-js/<%=ccUrls[i]%>' () { require('./src/cocos-js/<%=ccUrls[i]%>'); },
<% } %> 
<% for (var j = 0; j < bundleJsList.length; j++) {%> 
    'assets/<%=bundleJsList[j]%>' () { require('./assets/<%=bundleJsList[j]%>'); },
<% } %>
}
export function loadModule (name: string) {
    const moduleExecutor = commonJSModuleMap[name];
    moduleExecutor?.();
}
declare const require: any;
declare const System: any;

// fix undefined console.time and console.timeEnd
const startTimeList = {};
// @ts-ignore
console.time = function (tag) {
    // @ts-ignore
    startTimeList[tag] = Date.now();
};
// @ts-ignore
console.timeEnd = function (tag) {
    // @ts-ignore
    console.log(tag + ' ' + (Date.now() - startTimeList[tag]));
    delete startTimeList[tag];
};

// @ts-ignore
//const onTouch = () => new Promise<void>(resolve => jsb.onTouchStart = function () {
//    log('promise onTouch')
//    resolve();
//})

const onTouch = () => new Promise<void>(resolve => resolve())

export function launchEngine (): Promise<void> {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        window.global = window;
        const systemReady = require('./jsb-adapter/sys-ability-polyfill.js');
        systemReady().then(() => {
            // @ts-ignore
            window.oh.loadModule = loadModule;
            try {
                require("./jsb-adapter/web-adapter.js");
            } catch (e) {
                console.error('error in builtin ', e.stack, e.message);
            }

            require("./src/<%= systemBundleUrl%>");
            System.warmup({
                importMap,
                importMapUrl: './src/<%= importMapUrl%>',
                defaultHandler: (urlNoSchema: string) => {
                    console.info('urlNoSchema ', urlNoSchema);
                    loadModule(urlNoSchema);
                },
            });
            System.import('./src/<%= applicationUrl%>').then(({ Application }) => {
                return new Application();
            }).then((application) => {
                System.import('cc').then((cc) => {
                    require('./jsb-adapter/engine-adapter.js');
                    cc.macro.CLEANUP_IMAGE_CACHE = false;
                    return application.init(cc);
                }).then(() => {
                    return application.start();
                }).catch(e => {
                    console.log('error in importing cc ' + e.stack)
                });
            }).catch((e: any) => {
                console.error('imported failed', e.message, e.stack)
                reject(e);
            })
        });
    })
}


