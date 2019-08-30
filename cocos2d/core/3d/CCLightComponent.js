/****************************************************************************
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
 ****************************************************************************/
// @ts-check
import enums from '../../renderer/enums';
let RendererLight = null;
if (CC_JSB && CC_NATIVERENDERER) {
    RendererLight = window.renderer.Light;
} else {
    RendererLight = require('../../renderer/scene/light');
}

import { Color } from '../value-types';
import { toRadian } from '../vmath';
import mat4 from '../vmath/mat4';

const renderer = require('../renderer/index');
const Enum = require('../platform/CCEnum');
const CCComponent = require('../components/CCComponent');
const { ccclass, menu, inspector, property, executeInEditMode } = require('../platform/CCClassDecorator');

let _mat4_temp = mat4.create();

/**
 * !#en The light source type
 *
 * !#zh 光源类型
 * @static
 * @enum Light.Type
 */
const LightType = Enum({
    /**
     * !#en The direction of light
     *
     * !#zh 平行光
     * @property {Number} DIRECTIONAL
     * @readonly
     */
    DIRECTIONAL: 0,
    /**
     * !#en The point of light
     *
     * !#zh 点光源
     * @property {Number} POINT
     * @readonly
     */
    POINT: 1,
    /**
     * !#en The spot of light
     *
     * !#zh 聚光灯
     * @property {Number} SPOT
     * @readonly
     */
    SPOT: 2,

    /**
     * !#en The ambient light
     * !#zh 环境光
     * @property {Number} AMBIENT
     * @readonly
     */
    AMBIENT: 3
});

/**
 * !#en The shadow type
 *
 * !#zh 阴影类型
 * @static
 * @enum Light.ShadowType
 */
const LightShadowType = Enum({
    /**
     * !#en No shadows
     *
     * !#zh 阴影关闭
     * @property NONE
     * @readonly
     * @type {Number}
     */
    NONE: 0,
    // /**
    //  * !#en Soft shadows
    //  *
    //  * !#zh 软阴影
    //  * @property SOFT
    //  * @readonly
    //  * @type {Number}
    //  */
    // SOFT: 1,
    /**
     * !#en Hard shadows
     *
     * !#zh 阴硬影
     * @property HARD
     * @readonly
     * @type {Number}
     */
    HARD: 2,
});

/**
 * !#en The Light Component
 *
 * !#zh 光源组件
 * @class Light
 * @extends Component
 */
@ccclass('cc.Light')
@menu('i18n:MAIN_MENU.component.renderers/Light')
@executeInEditMode
@inspector('packages://inspector/inspectors/comps/light.js')
export default class Light extends CCComponent {
    @property
    _type = LightType.DIRECTIONAL;

    @property
    _color = Color.WHITE;

    @property
    _intensity = 1;

    @property
    _range = 1000;

    @property
    _spotAngle = 60;

    @property
    _spotExp = 1;

    @property
    _shadowType = LightShadowType.NONE;

    @property
    _shadowResolution = 1024;

    @property
    _shadowDarkness = 0.5;

    @property
    _shadowMinDepth = 1;

    @property
    _shadowMaxDepth = 4096;

    @property
    _shadowDepthScale = 250;

    @property
    _shadowFrustumSize = 1024;

    @property
    _shadowBias = 0.0005;

    /**
     * !#en The light source type，currently we have directional, point, spot three type.
     * !#zh 光源类型，目前有 平行光，聚光灯，点光源 三种类型
     * @type {LightType}
     */
    @property({
        type: LightType
    })
    get type() {
        return this._type;
    }

    set type(val) {
        this._type = val;

        let type = enums.LIGHT_DIRECTIONAL;
        if (val === LightType.POINT) {
            type = enums.LIGHT_POINT;
        } else if (val === LightType.SPOT) {
            type = enums.LIGHT_SPOT;
        }
        else if (val === LightType.AMBIENT) {
            type = enums.LIGHT_AMBIENT;
        }
        this._light.setType(type);
    }

    /**
     * !#en The light source color
     * !#zh 光源颜色
     * @type {Color}
     */
    @property
    get color() {
        return this._color;
    }

    set color(val) {
        this._color = val;
        this._light.setColor(val.r / 255, val.g / 255, val.b / 255);
    }

    /**
     * !#en The light source intensity
     *
     * !#zh 光源强度
     * @type {Number}
     */
    @property
    get intensity() {
        return this._intensity;
    }

    set intensity(val) {
        this._intensity = val;
        this._light.setIntensity(val);
    }

    /**
     * !#en The light range, used for spot and point light
     *
     * !#zh 针对聚光灯和点光源设置光源范围
     * @type {Number}
     */
    @property
    get range() {
        return this._range;
    }

    set range(val) {
        this._range = val;
        this._light.setRange(val);
    }

    /**
     * !#en The spot light cone angle
     *
     * !#zh 聚光灯锥角
     * @type {Number}
     */
    @property
    get spotAngle() {
        return this._spotAngle;
    }

    set spotAngle(val) {
        this._spotAngle = val;
        this._light.setSpotAngle(toRadian(val));
    }

    /**
     * !#en The spot light exponential
     *
     * !#zh 聚光灯指数
     * @type {Number}
     */
    @property
    get spotExp() {
        return this._spotExp;
    }

    set spotExp(val) {
        this._spotExp = val;
        this._light.setSpotExp(val);
    }

    /**
     * !#en The shadow type
     *
     * !#zh 阴影类型
     * @type {Number} shadowType
     */
    @property({
        type: LightShadowType
    })
    get shadowType() {
        return this._shadowType;
    }

    set shadowType(val) {
        this._shadowType = val;

        let type = enums.SHADOW_NONE;
        if (val === LightShadowType.HARD) {
            type = enums.SHADOW_HARD;
        } else if (val === LightShadowType.SOFT) {
            type = enums.SHADOW_SOFT;
        }
        this._light.setShadowType(type);
    }

    /**
     * !#en The shadow resolution
     *
     * !#zh 阴影分辨率
     *
     * @type {Number}
     */
    @property
    get shadowResolution() {
        return this._shadowResolution;
    }

    set shadowResolution(val) {
        this._shadowResolution = val;
        this._light.setShadowResolution(val);
    }

    /**
     * !#en The shadow darkness
     *
     * !#zh 阴影灰度值
     *
     * @type {Number}
     */
    @property
    get shadowDarkness() {
        return this._shadowDarkness;
    }

    set shadowDarkness(val) {
        this._shadowDarkness = val;
        this._light.setShadowDarkness(val);
    }

    /**
     * !#en The shadow min depth
     *
     * !#zh 阴影最小深度
     *
     * @type {Number}
     */
    @property
    get shadowMinDepth() {
        return this._shadowMinDepth;
    }

    set shadowMinDepth(val) {
        this._shadowMinDepth = val;
        this._light.setShadowMinDepth(val);
    }

    /**
     * !#en The shadow max depth
     *
     * !#zh 阴影最大深度
     *
     * @type {Number}
     */
    @property
    get shadowMaxDepth() {
        return this._shadowMaxDepth;
    }

    set shadowMaxDepth(val) {
        this._shadowMaxDepth = val;
        this._light.setShadowMaxDepth(val);
    }

    /**
     * !#en The shadow depth scale
     *
     * !#zh 阴影深度比例
     *
     * @type {Number}
     */
    @property
    get shadowDepthScale() {
        return this._shadowDepthScale;
    }

    set shadowDepthScale(val) {
        this._shadowDepthScale = val;
        this._light.setShadowDepthScale(val);
    }

    /**
     * !#en The shadow frustum size
     *
     * !#zh 阴影截锥体大小
     *
     * @type {Number}
     */
    @property
    get shadowFrustumSize() {
        return this._shadowFrustumSize;
    }

    set shadowFrustumSize(val) {
        this._shadowFrustumSize = val;
        this._light.setShadowFrustumSize(val);
    }

    // /**
    //  * !#en The shadow bias
    //  *
    //  * !#zh 阴影偏移量
    //  *
    //  * @type {Number}
    //  */
    // @property
    // get shadowBias() {
    //     return this._shadowBias;
    // }

    // set shadowBias(val) {
    //     this._shadowBias = val;
    //     this._light.setShadowBias(val);
    // }

    static Type = LightType;

    static ShadowType = LightShadowType;

    constructor() {
        super();

        this._light = new RendererLight();
    }

    onLoad() {
        this._light.setNode(this.node);
        this.type = this._type;
        this.color = this._color;
        this.intensity = this._intensity;
        this.range = this._range;
        this.spotAngle = this._spotAngle;
        this.spotExp = this._spotExp;
        this.shadowType = this._shadowType;
        this.shadowResolution = this._shadowResolution;
        this.shadowDarkness = this._shadowDarkness;
        this.shadowMaxDepth = this._shadowMaxDepth;
        this.shadowDepthScale = this._shadowDepthScale;
        this.shadowFrustumSize = this._shadowFrustumSize;
        this.shadowBias = this._shadowBias;
    }

    onEnable() {
        renderer.scene.addLight(this._light);
    }

    onDisable() {
        renderer.scene.removeLight(this._light);
    }
}

cc.Light = Light;
