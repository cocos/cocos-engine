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

import { Component } from '../../components/component';
import { ccclass, property } from '../../data/class-decorator';
import { Color } from '../../math';
import { Enum } from '../../value-types';

import { DirectionalLight } from '../../renderer/scene/directional-light';
import { Light, LightType } from '../../renderer/scene/light';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { SpotLight } from '../../renderer/scene/spot-light';
import { Root } from '../../root';
import { legacyCC } from '../../global-exports';

export const PhotometricTerm = Enum({
    LUMINOUS_POWER: 0,
    LUMINANCE: 1,
});

/**
 * @en static light settings.
 * @zh 静态灯光设置
 */
@ccclass('cc.ModelLightmapSettings')
class StaticLightSettings {
    @property
    protected _editorOnly: boolean = false;
    @property
    protected _bakeable: boolean = false;
    @property
    protected _castShadow: boolean = false;

    /**
     * @en editor only.
     * @zh 是否只在编辑器里生效。
     */
    @property
    get editorOnly () {
        return this._editorOnly;
    }
    set editorOnly (val) {
       this._editorOnly = val;
    }

    /**
     * @en bakeable.
     * @zh 是否可烘培。
     */
    @property
    get bakeable () {
        return this._bakeable;
    }

    set bakeable (val) {
        this._bakeable = val;
    }

    /**
     * @en cast shadow.
     * @zh 是否投射阴影。
     */
    @property
    get castShadow () {
        return this._castShadow;
    }

    set castShadow (val) {
        this._castShadow = val;
    }
}

@ccclass('cc.LightComponent')
export class LightComponent extends Component {
    public static Type = LightType;
    public static PhotometricTerm = PhotometricTerm;

    @property
    protected _color = Color.WHITE.clone();
    @property
    protected _useColorTemperature = false;
    @property
    protected _colorTemperature = 6550;
    @property
    protected _staticSettings: StaticLightSettings = new StaticLightSettings();

    protected _type = LightType.UNKNOWN;
    protected _lightType: typeof Light;
    protected _light: Light | null = null;

    /**
     * @en
     * Color of the light.
     * @zh
     * 光源颜色。
     */
    @property({
        tooltip: 'i18n:lights.color',
    })
    // @constget
    get color (): Readonly<Color> {
        return this._color;
    }
    set color (val) {
        this._color = val;
        if (this._light) {
            this._light.color.x = val.r / 255.0;
            this._light.color.y = val.g / 255.0;
            this._light.color.z = val.b / 255.0;
        }
    }

    /**
     * @en
     * Whether to enable light color temperature.
     * @zh
     * 是否启用光源色温。
     */
    @property({
        tooltip: 'i18n:lights.use_color_temperature',
    })
    get useColorTemperature () {
        return this._useColorTemperature;
    }
    set useColorTemperature (enable) {
        this._useColorTemperature = enable;
        if (this._light) { this._light.useColorTemperature = enable; }
    }

    /**
     * @en
     * The light color temperature.
     * @zh
     * 光源色温。
     */
    @property({
        slide: true,
        range: [1000, 15000, 1],
        tooltip: 'i18n:lights.color_temperature',
    })
    get colorTemperature () {
        return this._colorTemperature;
    }

    set colorTemperature (val) {
        this._colorTemperature = val;
        if (this._light) { this._light.colorTemperature = val; }
    }

    /**
     * @en
     * static light setttings.
     * @zh
     * 静态灯光设置。
     */
    @property({
        type: StaticLightSettings,
    })
    get staticSettings () {
        return this._staticSettings;
    }

    set staticSettings (val) {
        this._staticSettings = val;
    }

    /**
     * @en
     * The light type.
     * @zh
     * 光源类型。
     */
    get type () {
        return this._type;
    }

    constructor () {
        super();
        this._lightType = Light;
    }

    public onLoad (){
        this._createLight();
    }

    public onEnable () {
        this._attachToScene();
    }

    public onDisable () {
        this._detachFromScene();
    }

    public onDestroy () {
        this._destroyLight();
    }

    protected _createLight () {
        if (!this._light) {
            this._light = (legacyCC.director.root as Root).createLight(this._lightType);
        }
        this.color = this._color;
        this.useColorTemperature = this._useColorTemperature;
        this.colorTemperature = this._colorTemperature;
        this._light.node = this.node;
    }

    protected _destroyLight () {
        if (this._light) {
            legacyCC.director.root.destroyLight(this);
            this._light = null;
        }
    }

    protected _attachToScene () {
        this._detachFromScene();
        if (this._light && !this._light.scene && this.node.scene) {
            switch (this._type) {
                case LightType.DIRECTIONAL:
                    this._getRenderScene().setMainLight(this._light as DirectionalLight);
                    break;
                case LightType.SPHERE:
                    this._getRenderScene().addSphereLight(this._light as SphereLight);
                    break;
                case LightType.SPOT:
                    this._getRenderScene().addSpotLight(this._light as SpotLight);
                    break;
            }
        }
    }

    protected _detachFromScene () {
        if (this._light && this._light.scene) {
            switch (this._type) {
                case LightType.DIRECTIONAL:
                    this._light.scene.unsetMainLight(this._light as DirectionalLight);
                    break;
                case LightType.SPHERE:
                    this._light.scene.removeSphereLight(this._light as SphereLight);
                    break;
                case LightType.SPOT:
                    this._light.scene.removeSpotLight(this._light as SpotLight);
                    break;
            }
        }
    }
}
