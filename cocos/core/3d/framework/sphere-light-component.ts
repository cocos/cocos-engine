/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category component/light
 */

import { ccclass, help, executeInEditMode, menu, property } from '../../data/class-decorator';
import { LightType, nt2lm } from '../../renderer/scene/light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { LightComponent, PhotometricTerm } from './light-component';

@ccclass('cc.SphereLightComponent')
@help('i18n:cc.SphereLightComponent')
@menu('Light/SphereLight')
@executeInEditMode
export class SphereLightComponent extends LightComponent {

    @property
    protected _size = 0.15;
    @property
    protected _luminance = 1700 / nt2lm(0.15);
    @property
    protected _term = PhotometricTerm.LUMINOUS_POWER;
    @property
    protected _range = 1;

    protected _type = LightType.SPHERE;
    protected _light: SphereLight | null = null;

    /**
     * @en Luminous power of the light.
     * @zh 光通量。
     */
    @property({
        unit: 'lm',
        tooltip: 'i18n:lights.luminous_power',
    })
    get luminousPower () {
        return this._luminance * nt2lm(this._size);
    }
    set luminousPower (val) {
        this._luminance = val / nt2lm(this._size);
        if (this._light) { this._light.luminance = this._luminance; }
    }

    /**
     * @en Luminance of the light.
     * @zh 光亮度。
     */
    @property({
        unit: 'cd/m²',
        tooltip: 'i18n:lights.luminance',
    })
    get luminance () {
        return this._luminance;
    }
    set luminance (val) {
        this._luminance = val;
        if (this._light) { this._light.luminance = val; }
    }

    /**
     * @en The photometric term currently being used.
     * @zh 当前使用的光度学计量单位。
     */
    @property({
        type: PhotometricTerm,
        tooltip: 'i18n:lights.term',
    })
    get term () {
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
    @property({
        tooltip: 'i18n:lights.size',
    })
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
    @property({
        tooltip: 'i18n:lights.range',
    })
    get range () {
        return this._range;
    }
    set range (val) {
        this._range = val;
        if (this._light) { this._light.range = val; }
    }

    constructor () {
        super();
        this._lightType = SphereLight;
    }

    protected _createLight () {
        super._createLight();
        if (!this._light) { return; }
        this.luminance = this._luminance;
        this.size = this._size;
        this.range = this._range;
    }
}
