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
import { Component } from '../../components/component';
import { ccclass, executeInEditMode, menu, property } from '../../core/data/class-decorator';
import { Color, Enum } from '../../core/value-types';
import { toRadian } from '../../core/vmath';
import { Light, LightType } from '../../renderer/scene/light';
import { PointLight } from '../../renderer/scene/point-light';
import { SpotLight } from '../../renderer/scene/spot-light';

/**
 * !#en The light source type
 *
 * !#ch 光源类型
 * @static
 * @enum LightComponent.Type
 */
const Type = Enum({
    /**
     * !#en The direction of light
     *
     * !#ch 平行光
     * @property Directional
     * @readonly
     * @type {Number}
     */
    DIRECTIONAL: LightType.DIRECTIONAL,
    /**
     * !#en The point of light
     *
     * !#ch 点光源
     * @property Point
     * @readonly
     * @type {Number}
     */
    POINT: LightType.POINT,
    /**
     * !#en The spot of light
     *
     * !#ch 聚光灯
     * @property Spot
     * @readonly
     * @type {Number}
     */
    SPOT: LightType.SPOT,
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
 * @extends Component
 */
@ccclass('cc.LightComponent')
@menu('Components/LightComponent')
@executeInEditMode
export default class LightComponent extends Component {

    public static Type = Type;
    public static ShadowType = LightShadowType;

    @property
    protected _type = Type.DIRECTIONAL;
    @property
    protected _color = Color.WHITE;
    @property
    protected _intensity = 1;
    @property
    protected _range = 10;
    @property
    protected _spotAngle = 60;

    // @property
    // protected _shadowType = LightShadowType.None;
    // @property
    // protected _shadowResolution = 1024;
    // @property
    // protected _shadowDarkness = 0.5;
    // @property
    // protected _shadowMinDepth = 1;
    // @property
    // protected _shadowMaxDepth = 1000;
    // @property
    // protected _shadowDepthScale = 250;
    // @property
    // protected _shadowFrustumSize = 50;
    // @property
    // protected _shadowBias = 0.0005;

    protected _light: Light | null = null;
    protected _colorData = [1, 1, 1];

    /**
     * !#en The light source type
     *
     * !#ch 光源类型
     *
     * @type {Number}
     */
    @property({
        type: Type,
    })
    get type () {
        return this._type;
    }

    set type (val) {
        this._destroyLight();
        this._type = parseInt(val);
        this._createLight();
    }

    /**
     * !#en The light source color
     *
     * !#ch 光源颜色
     * @type {Color}
     */
    @property
    get color () {
        return this._color;
    }

    set color (val) {
        this._color = val;
        const scale = this._intensity / 255;
        this._colorData[0] = val.r * scale;
        this._colorData[1] = val.g * scale;
        this._colorData[2] = val.b * scale;
        if (this._light) {
            this._light.color = this._colorData;
        }
    }

    /**
     * !#en The light source intensity
     *
     * !#ch 光源强度
     * @type {Number}
     */
    @property
    get intensity () {
        return this._intensity;
    }

    set intensity (val) {
        this._intensity = val;
        const scale = val / 255;
        this._colorData[0] = this._color.r * scale;
        this._colorData[1] = this._color.g * scale;
        this._colorData[2] = this._color.b * scale;
        if (this._light) {
            this._light.color = this._colorData;
        }
    }

    /**
     * !#en The light range, used for spot and point light
     *
     * !#ch 针对聚光灯和点光源设置光源范围
     * @type {Number}
     */
    @property
    get range () {
        return this._range;
    }

    set range (val) {
        this._range = val;
        if (this._light && this._light instanceof PointLight || this._light instanceof SpotLight) {
            this._light.range = val;
        }
    }

    /**
     * !#en The spot light cone angle
     *
     * !#ch 聚光灯锥角
     * @type {Number}
     */
    @property
    get spotAngle () {
        return this._spotAngle;
    }

    set spotAngle (val) {
        this._spotAngle = val;
        if (this._light && this._light instanceof SpotLight) {
            this._light.spotAngle = toRadian(val);
        }
    }

    public onEnable () {
        this._createLight();
        if (this._light) { this._light.enabled = true; return; }
    }

    public onDisable () {
        if (this._light) { this._light.enabled = false; }
    }

    public onDestroy () {
        this._destroyLight();
    }

    protected _createLight () {
        if (!this.node._scene || this._light) { return; }
        const scene = this._getRenderScene();
        switch (this._type) {
        case Type.DIRECTIONAL:
            this._light = scene.createDirectionalLight(this.name, this.node);
            break;
        case Type.POINT:
            this._light = scene.createPointLight(this.name, this.node);
            this.range = this._range;
            break;
        case Type.SPOT:
            this._light = scene.createSpotLight(this.name, this.node);
            this.range = this._range;
            this.spotAngle = this._spotAngle;
            break;
        default:
            console.warn(`illegal light type ${this._type}`);
            return;
        }
        if (!this._light) { console.warn('we don\'t support this many lights in forward pipeline.'); }
        this.color = this._color;
    }

    protected _destroyLight () {
        if (!this.node._scene || !this._light) { return; }
        const scene = this._getRenderScene();
        switch (this._type) {
        case Type.DIRECTIONAL:
            scene.destroyDirectionalLight(this._light);
            break;
        case Type.POINT:
            scene.destroyPointLight(this._light);
            break;
        case Type.SPOT:
            scene.destroySpotLight(this._light);
            break;
        }
        this._light = null;
    }
}
