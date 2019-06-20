/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import 'systemjs/dist/system';
import { warn } from '../core/platform/CCDebug';
import { loader } from '../load-pipeline';

class CocosSystem extends System.constructor {
    private _registerRegistry: { [url: string]: any };
    private _moduleUrls: { [id: string]: string; };
    private _urlMappings: { [url: string]: string };
    private _nInstantiating = 0;

    constructor () {
        super();
        this._registerRegistry = Object.create(null);
        this._moduleUrls = Object.create(null);
        this._urlMappings = Object.create(null);
        this._registerEngineModule();
    }

    public registerImportMapEntry (moduleId: string, url: string) {
        this._moduleUrls[moduleId] = url;
    }

    public setUrlMapping (url: string, mapped: string) {
        this._urlMappings[url] = mapped;
    }

    public deleteUrlMapping (url: string) {
        delete this._urlMappings[url];
    }

    public register (deps: any, declare?: any): any {
        if (this._nInstantiating === 0) {
            warn(
                `Detected wild module registry. ` +
                `You shall import(load) Cocos3D module only using scripting.topLevelImport()`);
        }
        return super.register(deps, declare);
    }

    public resolve (id: string, parentURL: string): Promise<string> {
        const isRelative = id[0] === '/' || id[0] === '.' && (id[1] === '/' || id[1] === '.' && id[2] === '/');
        if (!isRelative && (id in this._moduleUrls)) {
            return new Promise((resolve) => {
                resolve(this._moduleUrls[id]);
            });
        } else {
            return super.resolve.call(this, id, parentURL);
        }
    }

    protected instantiate (url: string, firstParentUrl: string) {
        const realUrl = (url in this._urlMappings) ? this._urlMappings[url] : url;
        if (realUrl in this._registerRegistry) {
            return this._registerRegistry[realUrl];
        }
        return new Promise((resolve, reject) => {
            ++this._nInstantiating;
            loader.load({ url: realUrl }, (_1, _2, item) => {
                if (item.error) {
                    return; // Fallthrough to complete callback.
                }
                this._registerRegistry[realUrl] = this.getRegister();
                resolve(this._registerRegistry[realUrl]);
                --this._nInstantiating;
            }, (error) => {
                if (error) {
                    reject(new Error(`Failed to instantiate module ${realUrl} because:\n` +
                        `cc.loader.load() failed when load ${realUrl} because:\n` +
                        `${error.errorMessage}`));
                    --this._nInstantiating;
                }
            });
        });
    }

    private _registerEngineModule () {
        ++this._nInstantiating;
        // tslint:disable-next-line:only-arrow-functions
        this.register([], function (_export: (what: Record<string, any>) => any, _context) {
            return {
                setters: [],
                execute () {
                    _export(cc);
                },
            };
        });
        // tslint:disable-next-line:no-string-literal
        this._registerRegistry['Cocos3D'] = this.getRegister();
        --this._nInstantiating;
        this.registerImportMapEntry('Cocos3D', 'Cocos3D');
    }
}

const cocosSystem = new CocosSystem();

export const setUrlMapping = cocosSystem.setUrlMapping.bind(cocosSystem);

export const deleteUrlMapping = cocosSystem.deleteUrlMapping.bind(cocosSystem);

export const registerImportMapEntry = cocosSystem.registerImportMapEntry.bind(cocosSystem);

export function topLevelImport (moduleId: string) {
    return cocosSystem.import(moduleId, '').then((moduleX: any) => {
        return moduleX;
    }).catch((error) => {
        throw new Error(`Failed to import script module ${moduleId} because:\n ${error}`);
    });
}

export function deleteModule (moduleId: string) {
    cocosSystem.delete(moduleId);
}

const typeErasedSystem: any = cocosSystem;
export { typeErasedSystem as System  };
