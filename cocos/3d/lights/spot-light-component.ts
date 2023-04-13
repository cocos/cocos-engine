/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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
import { toRadian, cclegacy,  CCBoolean, CCFloat, _decorator } from '../../core';
import { scene } from '../../render-scene';
import { Light, PhotometricTerm } from './light-component';
import { Root } from '../../root';
import { Camera, PCFType, ShadowType } from '../../render-scene/scene';

const { ccclass, range, slide, type, editable, displayOrder, help, executeInEditMode,
    menu, tooltip, serializable, formerlySerializedAs, visible, property } = _decorator;

/**
 * @en The spot light component, multiple spot lights can be added to one scene.
 * @zh 聚光灯光源组件，场景中可以添加多个聚光灯光源。
 */
@ccclass('cc.SpotLight')
@help('i18n:cc.SpotLight')
@menu('Light/SpotLight')
@executeInEditMode
export class SpotLight extends Light {
    @serializable
    private _size = 0.15;

    @serializable
    @formerlySerializedAs('_luminance')
    private _luminanceHDR = 1700 / scene.nt2lm(0.15);

    @serializable
    private _luminanceLDR = 1700 / scene.nt2lm(0.15) * Camera.standardExposureValue * Camera.standardLightMeterScale;

    @serializable
    private _term = PhotometricTerm.LUMINOUS_FLUX;

    @serializable
    private _range = 1;

    @serializable
    private _spotAngle = 60;

    // Shadow map properties
    @serializable
    private _shadowEnabled = false;
    @serializable
    private _shadowPcf = PCFType.HARD;
    @serializable
    private _shadowBias = 0.00001;
    @serializable
    private _shadowNormalBias = 0.0;

    /**
     * @en Luminous flux of the light.
     * @zh 光通量。
     */
    @tooltip('i18n:lights.luminous_flux')
    @displayOrder(-1)
    get luminousFlux () {
        const isHDR = (cclegacy.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._luminanceHDR * scene.nt2lm(this._size);
        } else {
            return this._luminanceLDR;
        }
    }

    set luminousFlux (val) {
        const isHDR = (cclegacy.director.root as Root).pipeline.pipelineSceneData.isHDR;
        let result = 0;
        if (isHDR) {
            this._luminanceHDR = val / scene.nt2lm(this._size);
            result = this._luminanceHDR;
        } else {
            this._luminanceLDR = val;
            result = this._luminanceLDR;
        }
        this._light && ((this._light as scene.SpotLight).luminance = result);
    }

    /**
      * @en Luminance of the light.
      * @zh 光亮度。
      */
    @tooltip('i18n:lights.luminance')
    @displayOrder(-1)
    get luminance () {
        const isHDR = (cclegacy.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._luminanceHDR;
        } else {
            return this._luminanceLDR;
        }
    }

    set luminance (val) {
        const isHDR = (cclegacy.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._luminanceHDR = val;
            this._light && ((this._light as scene.SpotLight).luminanceHDR = this._luminanceHDR);
        } else {
            this._luminanceLDR = val;
            this._light && ((this._light as scene.SpotLight).luminanceLDR = this._luminanceLDR);
        }
    }

    /**
     * @en The photometric term currently being used.
     * @zh 当前使用的光度学计量单位。
     */
    @type(PhotometricTerm)
    @displayOrder(-2)
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
        if (this._light) { (this._light as scene.SpotLight).size = val; }
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
        if (this._light) { (this._light as scene.SpotLight).range = val; }
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
        if (this._light) { (this._light as scene.SpotLight).spotAngle = toRadian(val); }
    }

    /**
     * @en Whether activate shadow
     * @zh 是否启用阴影？
     */
    @tooltip('i18n:lights.shadowEnabled')
    @visible(() => (cclegacy.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 1 } })
    @editable
    @type(CCBoolean)
    get shadowEnabled () {
        return this._shadowEnabled;
    }
    set shadowEnabled (val) {
        this._shadowEnabled = val;
        if (this._light) {
            (this._light as scene.SpotLight).shadowEnabled = val;
        }
    }

    /**
     * @en The pcf level of the shadow generation.
     * @zh 获取或者设置阴影 pcf 等级。
     */
    @tooltip('i18n:lights.shadowPcf')
    @visible(() => (cclegacy.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 2  } })
    @editable
    @type(PCFType)
    get shadowPcf () {
        return this._shadowPcf;
    }
    set shadowPcf (val) {
        this._shadowPcf = val;
        if (this._light) {
            (this._light as scene.SpotLight).shadowPcf = val;
        }
    }

    /**
     * @en The depth offset of shadow to avoid moire pattern artifacts
     * @zh 阴影的深度偏移, 可以减弱跨像素导致的条纹状失真
     */
    @tooltip('i18n:lights.shadowBias')
    @visible(() => (cclegacy.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 3 } })
    @editable
    @type(CCFloat)
    get shadowBias () {
        return this._shadowBias;
    }
    set shadowBias (val) {
        this._shadowBias = val;
        if (this._light) {
            (this._light as scene.SpotLight).shadowBias = val;
        }
    }

    /**
     * @en The normal bias of the shadow map.
     * @zh 设置或者获取法线偏移。
     */
    @tooltip('i18n:lights.shadowNormalBias')
    @visible(() => (cclegacy.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'DynamicShadowSettings', displayOrder: 4 } })
    @editable
    @type(CCFloat)
    get shadowNormalBias () {
        return this._shadowNormalBias;
    }
    set shadowNormalBias (val) {
        this._shadowNormalBias = val;
        if (this._light) {
            (this._light as scene.SpotLight).shadowNormalBias = val;
        }
    }

    constructor () {
        super();
        this._lightType = scene.SpotLight;
    }

    protected _createLight () {
        super._createLight();
        this._type = scene.LightType.SPOT;
        this.size = this._size;
        this.range = this._range;
        this.spotAngle = this._spotAngle;

        if (this._light) {
            const spotLight = this._light as scene.SpotLight;
            spotLight.luminanceHDR = this._luminanceHDR;
            spotLight.luminanceLDR = this._luminanceLDR;
            // shadow info
            spotLight.shadowEnabled = this._shadowEnabled;
            spotLight.shadowPcf = this._shadowPcf;
            spotLight.shadowBias = this._shadowBias;
            spotLight.shadowNormalBias = this._shadowNormalBias;
        }
    }
}
