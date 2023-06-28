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

import { SkinInfo } from '../../scene-graph';

/**
 * @en Global skin in the render scene.
 * The initial data is setup in [[SceneGlobals.skip]].
 * @zh 渲染场景中的全局皮肤后处理设置。
 * 初始值是由 [[SceneGlobals.skin]] 设置的。
 */
export class Skin {
    /**
     * @en Enable skip.
     * @zh 是否开启皮肤后效。
     */
    set enabled (val: boolean) {
        this._enabled = val;
    }
    get enabled (): boolean {
        return this._enabled;
    }

    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    set blurRadius (val: number) {
        this._blurRadius = val;
    }
    get blurRadius (): number {
        return this._blurRadius;
    }

    /**
     * @en Getter/Setter depth unit scale.
     * @zh 设置或者获取深度单位比例。
     */
    set sssIntensity (val: number) {
        this._sssIntensity = val;
    }
    get sssIntensity (): number {
        return this._sssIntensity;
    }

    protected _enabled = true;
    protected _blurRadius = 0.01;
    protected _sssIntensity = 3.0;

    public initialize (skinInfo: SkinInfo): void {
        this._enabled = skinInfo.enabled;
        this._blurRadius = skinInfo.blurRadius;
        this._sssIntensity = skinInfo.sssIntensity;
    }
}
