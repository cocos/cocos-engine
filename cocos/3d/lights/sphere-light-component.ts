/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
/**
 * @packageDocumentation
 * @module component/light
 */

import { ccclass, help, executeInEditMode, menu, tooltip, type, unit, serializable } from 'cc.decorator';
import { scene } from '../../core/renderer';
import { Light, PhotometricTerm } from './light-component';
import { legacyCC } from '../../core/global-exports';

@ccclass('cc.SphereLight')
@help('i18n:cc.SphereLight')
@menu('Light/SphereLight')
@executeInEditMode
export class SphereLight extends Light {
    @serializable
    protected _size = 0.15;
    @serializable
    protected _luminance = 1700 / scene.nt2lm(0.15);
    @serializable
    protected _luminance_ldr = 1.0;
    @serializable
    protected _term = PhotometricTerm.LUMINOUS_FLUX;
    @serializable
    protected _range = 1;

    protected _type = scene.LightType.SPHERE;
    protected _light: scene.SphereLight | null = null;

    /**
     * @en Luminous flux of the light.
     * @zh 光通量。
     */
    @tooltip('i18n:lights.luminous_flux')
    get luminousFlux () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if(isHDR)
        {
            return this._luminance * scene.nt2lm(this._size);
        } else {
            return this._luminance_ldr;
        }
    }
    set luminousFlux (val) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        let result = 0;
        if(isHDR)
        {
            this._luminance = val / scene.nt2lm(this._size);
            result = this._luminance_ldr;
        } else {
            this._luminance = val;
            result = this._luminance;
        }

        if (this._light) { this._light.luminance = result; }
    }

    /**
     * @en Luminance of the light.
     * @zh 光亮度。
     */
    @unit('cd/m²')
    @tooltip('i18n:lights.luminance')
    get luminance () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if(isHDR) {
            return this._luminance;
        } else {
            return this._luminance_ldr;
        }
    }
    set luminance (val) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if(isHDR) {
            this._luminance = val;
        } else {
            this._luminance_ldr = val;
        }
        if (this._light) { this._light.luminance = val; }
    }

    /**
     * @en The photometric term currently being used.
     * @zh 当前使用的光度学计量单位。
     */
    @type(PhotometricTerm)
    @tooltip('i18n:lights.term')
    get term (): number {
        return this._term;
    }
    set term (val) {
        this._term = val;
    }

    /**
     * @en
     * Size of the light.
     * @zh
     * 光源大小。
     */
    @tooltip('i18n:lights.size')
    get size () {
        return this._size;
    }
    set size (val) {
        this._size = val;
        if (this._light) { this._light.size = val; }
    }

    /**
     * @en
     * Range of the light.
     * @zh
     * 光源范围。
     */
    @tooltip('i18n:lights.range')
    get range () {
        return this._range;
    }
    set range (val) {
        this._range = val;
        if (this._light) { this._light.range = val; }
    }

    constructor () {
        super();
        this._lightType = scene.SphereLight;
    }

    protected _createLight () {
        super._createLight();
        if (!this._light) { return; }
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        this.luminance = isHDR ? this._luminance : this._luminance_ldr;
        this.size = this._size;
        this.range = this._range;
    }
}
