/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
                require("./jsb-adapter/jsb-builtin.js");
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
            System.import('./src/<%= applicationUrl%>').then(({ createApplication }) => {
                console.info('imported createApplication', createApplication)
                return createApplication({
                    loadJsListFile: (url: string) => loadModule(url),
                    fetchWasm: (url: string) => url,
                }).then((application) => {
                    return onTouch().then(() => {
                        application.import('cc').then((cc) => {
                            require('./jsb-adapter/jsb-engine.js');
                            cc.macro.CLEANUP_IMAGE_CACHE = false;
                        }).then(() => {
                            return application.start({
                                // @ts-ignore
                                settings: window._CCSettings,
                                findCanvas: () => {
                                    // @ts-ignore
                                    var container = document.createElement('div');
                                    // @ts-ignore
                                    var frame = document.documentElement;
                                    // @ts-ignore
                                    var canvas = window.__canvas;
                                    // @ts-ignore
                                    return { frame, canvas, container };
                                },
                            });
                        }).catch(e => {
                            console.log('error in importing cc ' + e.stack)
                        });

                    })
                });
            }).catch((e: any) => {
                console.error('imported failed', e.message, e.stack)
                reject(e);
            })
        });
    })
}


