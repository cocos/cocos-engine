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

import { ccclass, range, slide, type, editable, help, executeInEditMode,
    menu, tooltip, serializable, formerlySerializedAs, visible } from 'cc.decorator';
import { toRadian } from '../../core/math';
import { scene } from '../../core/renderer';
import { Light, PhotometricTerm } from './light-component';
import { legacyCC } from '../../core/global-exports';
import { Root } from '../../core/root';
import { Camera, PCFType, ShadowType } from '../../core/renderer/scene';
import { property } from '../../core/data/class-decorator';
import { CCBoolean, CCFloat } from '../../core/data/utils/attribute';

@ccclass('cc.SpotLight')
@help('i18n:cc.SpotLight')
@menu('Light/SpotLight')
@executeInEditMode
export class SpotLight extends Light {
    @serializable
    protected _size = 0.15;

    @serializable
    @formerlySerializedAs('_luminance')
    protected _luminanceHDR = 1700 / scene.nt2lm(0.15);

    @serializable
    protected _luminanceLDR = 1.0;

    @serializable
    protected _term = PhotometricTerm.LUMINOUS_FLUX;

    @serializable
    protected _range = 1;

    @serializable
    protected _spotAngle = 60;

    // Shadow map properties
    @serializable
    protected _shadowEnabled = false;
    @serializable
    protected _shadowPcf = PCFType.HARD;
    @serializable
    protected _shadowBias = 0.00001;
    @serializable
    protected _shadowNormalBias = 0.0;

    protected _type = scene.LightType.SPOT;

    protected _light: scene.SpotLight | null = null;

    /**
     * @en Luminous flux of the light.
     * @zh 光通量。
     */
    @tooltip('i18n:lights.luminous_flux')
    get luminousFlux () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._luminanceHDR * scene.nt2lm(this._size);
        } else {
            return this._luminanceLDR;
        }
    }

    set luminousFlux (val) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        let result = 0;
        if (isHDR) {
            this._luminanceHDR = val / scene.nt2lm(this._size);
            result = this._luminanceHDR;
        } else {
            this._luminanceLDR = val;
            result = this._luminanceLDR;
        }
        this._light && (this._light.luminance = result);
    }

    /**
      * @en Luminance of the light.
      * @zh 光亮度。
      */
    @tooltip('i18n:lights.luminance')
    get luminance () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._luminanceHDR;
        } else {
            return this._luminanceLDR;
        }
    }

    set luminance (val) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._luminanceHDR = val;
            this._light && (this._light.luminanceHDR = this._luminanceHDR);
        } else {
            this._luminanceLDR = val;
            this._light && (this._light.luminanceLDR = this._luminanceLDR);
        }
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

    /**
     * @en
     * The spot light cone angle.
     * @zh
     * 聚光灯锥角。
     */
    @slide
    @range([2, 180, 1])
    @tooltip('The spot light cone angle')
    get spotAngle () {
        return this._spotAngle;
    }

    set spotAngle (val) {
        this._spotAngle = val;
        if (this._light) { this._light.spotAngle = toRadian(val); }
    }

    /**
     * @en Whether activate shadow
     * @zh 是否启用阴影？
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 1 } })
    @editable
    @type(CCBoolean)
    get shadowEnabled () {
        return this._shadowEnabled;
    }
    set shadowEnabled (val) {
        this._shadowEnabled = val;
        if (this._light) {
            this._light.shadowEnabled = val;
        }
    }

    /**
     * @en get or set shadow pcf.
     * @zh 获取或者设置阴影pcf等级。
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 2  } })
    @editable
    @type(PCFType)
    get shadowPcf () {
        return this._shadowPcf;
    }
    set shadowPcf (val) {
        this._shadowPcf = val;
        if (this._light) {
            this._light.shadowPcf = val;
        }
    }

    /**
     * @en get or set shadow map sampler offset
     * @zh 获取或者设置阴影纹理偏移值
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 3 } })
    @editable
    @type(CCFloat)
    get shadowBias () {
        return this._shadowBias;
    }
    set shadowBias (val) {
        this._shadowBias = val;
        if (this._light) {
            this._light.shadowBias = val;
        }
    }

    /**
     * @en get or set normal bias.
     * @zh 设置或者获取法线偏移。
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 4 } })
    @editable
    @type(CCFloat)
    get shadowNormalBias () {
        return this._shadowNormalBias;
    }
    set shadowNormalBias (val) {
        this._shadowNormalBias = val;
        if (this._light) {
            this._light.shadowNormalBias = val;
        }
    }

    constructor () {
        super();
        this._lightType = scene.SpotLight;
    }

    protected _createLight () {
        super._createLight();
        this.size = this._size;
        this.range = this._range;
        this.spotAngle = this._spotAngle;
        if ((legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR) {
            this._luminanceLDR = this._luminanceHDR * Camera.standardExposureValue * Camera.standardLightMeterScale;
        } else {
            this._luminanceHDR = this._luminanceLDR / Camera.standardExposureValue / Camera.standardLightMeterScale;
        }

        if (this._light) {
            this._light.luminanceHDR = this._luminanceHDR;
            this._light.luminanceLDR = this._luminanceLDR;
            // shadow info
            this._light.shadowEnabled = this._shadowEnabled;
            this._light.shadowPcf = this._shadowPcf;
            this._light.shadowBias = this._shadowBias;
            this._light.shadowNormalBias = this._shadowNormalBias;
        }
    }
}
