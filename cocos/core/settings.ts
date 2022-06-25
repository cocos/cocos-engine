/*
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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
*/
import { HTML5 } from 'internal:constants';
import { legacyCC } from './global-exports';

declare const fsUtils: any;

enum Category {
    ENGINE = 'engine',
    ASSETS = 'assets',
    SCRIPTING = 'scripting',
    PHYSICS = 'physics',
    RENDERING = 'rendering',
    LAUNCH = 'launch',
    SCREEN = 'screen',
    SPLASH_SCREEN = 'splashScreen',
    ANIMATION = 'animation',
    PROFILING = 'profiling',
}

export class Settings {
    static Category = Category;

    init (path = '', overrides: Record<string, any> = {}): Promise<void> {
        this._override = overrides;
        if (!path) return Promise.resolve();
        return new Promise((resolve, reject) => {
            if (!HTML5) {
                const result = fsUtils.readJsonSync(path);
                if (result instanceof Error) {
                    reject(result);
                } else {
                    this._settings = result;
                    resolve();
                }
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path);
                xhr.responseType = 'text';
                xhr.onload = () => {
                    this._settings = JSON.parse(xhr.response);
                    resolve();
                };
                xhr.onerror = () => {
                    reject(new Error('request settings failed!'));
                };
                xhr.send(null);
            }
        });
    }

    querySettings<T = any> (category: Category | string, name?: string): T | null {
        if (category in this._override) {
            if (name) {
                const categorySettings = this._override[category];
                if (typeof categorySettings === 'object' && categorySettings && name in categorySettings) {
                    return categorySettings[name] as T;
                }
            } else {
                return this._override[category] as T;
            }
        }
        if (category in this._settings) {
            if (name) {
                const categorySettings = this._settings[category];
                if (typeof categorySettings === 'object' && categorySettings && name in categorySettings) {
                    return categorySettings[name] as T;
                }
            } else {
                return this._settings[category] as T;
            }
        }
        return null;
    }

    private _settings: Record<string, any> = {};
    private _override: Record<string, any> = {};
}

export declare namespace Settings {
    export type Category = typeof Category;
}

export const settings = new Settings();
legacyCC.internal.settings = settings;
