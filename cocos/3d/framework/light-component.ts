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
import { RenderScene } from '../../renderer/scene/render-scene';
import { SpotLight } from '../../renderer/scene/spot-light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { DirectionalLight } from '../../renderer/scene/directional-light';

/**
 * !#en The light source type
 *
 * !#ch 光源类型
 */
const Type = Enum({
    /**
     * !#en Drectional Light
     *
     * !#ch 平行光
     */
    DIRECTIONAL: LightType.DIRECTIONAL,
    /**
     * !#en Sphere Light
     *
     * !#ch 球面光源
     */
    SPHERE: LightType.SPHERE,
    /**
     * !#en Spot Light
     *
     * !#ch 聚光灯
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
     */
    None: 0,
    /**
     * !#en Soft shadows
     *
     * !#ch 软阴影
     */
    Soft: 1,
    /**
     * !#en Hard shadows
     *
     * !#ch 阴硬影
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
export class LightComponent extends Component {

    public static Type = Type;
    public static ShadowType = LightShadowType;

    @property
    protected _type = Type.DIRECTIONAL;
    @property
    protected _color = Color.WHITE;
    @property
    protected _useColorTemperature = false;
    @property
    protected _colorTemperature = 6550;
    @property
    protected _intensity = 10000;
    @property
    protected _size = 15;
    @property
    protected _range = 1;
    @property
    protected _spotAngle = 60;

    protected _light: Light | null = null;

    /**
     * !#en The light source type
     *
     * !#ch 光源类型
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
     */
    @property
    get color () {
        return this._color;
    }

    set color (val) {
        this._color = val;
        if (this._light) {
            this._light.color[0] = val.r / 255.0;
            this._light.color[1] = val.g / 255.0;
            this._light.color[2] = val.b / 255.0;
        }
    }

    /**
     * !#en Whether to enable light color temperature
     *
     * !#ch 是否启用光源色温
     */
    @property
    get useColorTemperature () {
        return this._useColorTemperature;
    }

    set useColorTemperature (enable) {
        this._useColorTemperature = enable;
        if (this._light) {
            this._light.useColorTemperature = enable;
        }
    }

    /**
     * !#en The light color temperature
     *
     * !#ch 光源色温
     */
    @property
    get colorTemperature () {
        return this._colorTemperature;
    }

    set colorTemperature (val) {
        this._colorTemperature = val;
        if (this._light) {
            this._light.colorTemperature = val;
        }
    }

    /**
     * !#en The light source intensity
     *
     * !#ch 光源强度
     */
    @property
    get intensity () {
        return this._intensity;
    }

    set intensity (val) {
        this._intensity = val;
        if (this._light) {
            switch (this._light.type) {
            case LightType.DIRECTIONAL:
                (this._light as DirectionalLight).illuminance = this.intensity;
                break;
            case LightType.SPHERE:
                (this._light as SphereLight).luminousPower = this.intensity;
                break;
            case LightType.SPOT:
                (this._light as SpotLight).luminousPower = this.intensity;
                break;
            }
        }
    }

    /**
     * !#en The light size, used for spot and point light
     *
     * !#ch 针对聚光灯和点光源设置光源大小
     */
    @property
    get size () {
        return this._size;
    }

    set size (val) {
        this._size = val;
        if (this._light && this._light instanceof SphereLight || this._light instanceof SpotLight) {
            this._light.size = val;
        }
    }

    /**
     * !#en The light range, used for spot and point light
     *
     * !#ch 针对聚光灯和点光源设置光源范围
     */
    @property
    get range () {
        return this._range;
    }

    set range (val) {
        this._range = val;
        if (this._light && this._light instanceof SphereLight || this._light instanceof SpotLight) {
            this._light.range = val;
        }
    }

    /**
     * !#en The spot light cone angle
     *
     * !#ch 聚光灯锥角
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
        if (this._light) { this._light.enabled = true; return; }
        this._createLight();
    }

    public onDisable () {
        if (this._light) { this._light.enabled = false; }
    }

    public onDestroy () {
        this._destroyLight();
    }

    protected _createLight (scene?: RenderScene) {
        if (!this.node.scene) { return; }
        if (!scene) { scene = this._getRenderScene(); }
        switch (this._type) {
        case Type.DIRECTIONAL:
            {
                const light = scene.mainLight;
                this._light = light;
                this._light.node = this.node;
                this.intensity = light.illuminance;
            }
            break;
        case Type.SPHERE:
            {
                if (this._light && scene.sphereLights.find((c) => c === this._light)) { break; }
                const light = scene.createSphereLight(this.name, this.node);
                if (light) {
                    this._light = light;
                    this.intensity = light.luminousPower;
                    this.size = light.size;
                    this.range = light.range;
                }
            }
            break;
        case Type.SPOT:
            {
                if (this._light && scene.spotLights.find((c) => c === this._light)) { break; }
                const light = scene.createSpotLight(this.name, this.node);
                if (light) {
                    this._light = light;
                    this.intensity = light.luminousPower;
                    this.size = light.size;
                    this.range = light.range;
                    this.spotAngle = light.spotAngle;
                }
            }
            break;
        default:
            console.warn(`illegal light type ${this._type}`);
            return;
        }
        if (!this._light) {
            console.warn('we don\'t support this many lights in forward pipeline.');
            return;
        }
        this.color = this._color;
        this._light.enabled = this.enabledInHierarchy;
    }

    protected _destroyLight (scene?: RenderScene) {
        if (!this.node.scene || !this._light) { return; }
        if (!scene) { scene = this._getRenderScene(); }
        switch (this._type) {
        case Type.DIRECTIONAL:
            break;
        case Type.SPHERE:
            scene.destroySphereLight(this._light as SphereLight);
            this._light = null;
            break;
        case Type.SPOT:
            scene.destroySpotLight(this._light as SpotLight);
            this._light = null;
            break;
        }
    }
}
