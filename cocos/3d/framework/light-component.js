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
import RenderSystemActor from './renderSystemActor';
import renderer from '../../renderer/index';
import { Color, Enum } from '../../core/value-types';
import { toRadian } from '../../core/vmath';
import { ccclass, menu, property, executeInEditMode } from "../../core/data/class-decorator";

/**
 * !#en The light source type
 *
 * !#ch 光源类型
 * @static
 * @enum LightComponent.Type
 */
const LightType = Enum({
    /**
     * !#en The direction of light
     *
     * !#ch 平行光
     * @property Directional
     * @readonly
     * @type {Number}
     */
    Directional: 0,
    /**
     * !#en The point of light
     *
     * !#ch 点光源
     * @property Point
     * @readonly
     * @type {Number}
     */
    Point: 1,
    /**
     * !#en The spot of light
     *
     * !#ch 聚光灯
     * @property Spot
     * @readonly
     * @type {Number}
     */
    Spot: 2,
});

/**
 * !#en The shadow type
 *
 * !#ch 阴影类型
 * @static
 * @enum LightComponent.ShadowType
 */
const LightShadowType = Enum({
    /**
     * !#en No shadows
     *
     * !#ch 阴影关闭
     * @property None
     * @readonly
     * @type {Number}
     */
    None: 0,
    /**
     * !#en Soft shadows
     *
     * !#ch 软阴影
     * @property Soft
     * @readonly
     * @type {Number}
     */
    Soft: 1,
    /**
     * !#en Hard shadows
     *
     * !#ch 阴硬影
     * @property Hard
     * @readonly
     * @type {Number}
     */
    Hard: 2,
});

/**
 * !#en The Light Component
 *
 * !#ch 光源组件
 * @class LightComponent
 * @extends RenderSystemActor
 */
@ccclass('cc.LightComponent')
@menu('Components/LightComponent')
@executeInEditMode
export default class LightComponent extends RenderSystemActor {
    @property
    _type = LightType.Directional;

    @property
    _color = Color.WHITE;

    @property
    _intensity = 1;

    @property
    _range = 1;

    @property
    _spotAngle = 60;

    @property
    _spotExp = 1;

    @property
    _shadowType = LightShadowType.None;

    @property
    _shadowResolution = 1024;

    @property
    _shadowDarkness = 0.5;

    @property
    _shadowMinDepth = 1;

    @property
    _shadowMaxDepth = 1000;

    @property
    _shadowDepthScale = 250;

    @property
    _shadowFrustumSize = 50;

    @property
    _shadowBias = 0.0005;

    /**
     * !#en The light source type
     *
     * !#ch 光源类型
     *
     * @type {Number}
     */
    @property({
        type: LightType
    })
    get type() {
        return this._type;
    }

    set type(val) {
        this._type = val;

        let type = renderer.LIGHT_DIRECTIONAL;
        if (this._type === LightType.Point) {
            type = renderer.LIGHT_POINT;
        } else if (this._type === LightType.Spot) {
            type = renderer.LIGHT_SPOT;
        }
        this._light.setType(type);
    }

    /**
     * !#en The light source color
     *
     * !#ch 光源颜色
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
     * !#ch 光源强度
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
     * !#ch 针对聚光灯和点光源设置光源范围
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
     * !#ch 聚光灯锥角
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
     * !#ch 聚光灯指数
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
     * !#ch 阴影类型
     * @type {Number} shadowType
     */
    // @property({
    //     type: LightShadowType
    // })
    get shadowType() {
        return this._shadowType;
    }

    set shadowType(val) {
        this._shadowType = val;

        let type = renderer.SHADOW_NONE;
        if (val === LightShadowType.Hard) {
            type = renderer.SHADOW_HARD;
        } else if (val === LightShadowType.Soft) {
            type = renderer.SHADOW_SOFT;
        }
        this._light.setShadowType(type);
    }

    /**
     * !#en The shadow resolution
     *
     * !#ch 阴影分辨率
     *
     * @type {Number}
     */
    // @property
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
     * !#ch 阴影灰度值
     *
     * @type {Number}
     */
    // @property
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
     * !#ch 阴影最小深度
     *
     * @type {Number}
     */
    // @property
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
     * !#ch 阴影最大深度
     *
     * @type {Number}
     */
    // @property
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
     * !#ch 阴影深度比例
     *
     * @type {Number}
     */
    // @property
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
     * !#ch 阴影截锥体大小
     *
     * @type {Number}
     */
    // @property
    get shadowFrustumSize() {
        return this._shadowFrustumSize;
    }

    set shadowFrustumSize(val) {
        this._shadowFrustumSize = val;
        this._light.setShadowFrustumSize(val);
    }

    /**
     * !#en The shadow bias
     *
     * !#ch 阴影偏移量
     *
     * @type {Number}
     */
    // @property
    get shadowBias() {
        return this._shadowBias;
    }

    set shadowBias(val) {
        this._shadowBias = val;
        this._light.setShadowBias(val);
    }

    static Type = LightType;

    static ShadowType = LightShadowType;

    constructor() {
        super();

        this._light = new renderer.Light();
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
        this.scene.addLight(this._light);
    }

    onDisable() {
        this.scene.removeLight(this._light);
    }
}
