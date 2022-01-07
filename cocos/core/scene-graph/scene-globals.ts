/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.
 http://www.cocos.com
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.
 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
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
 * @module scene-graph
 */

import { ccclass, visible, type, displayOrder, readOnly, slide, range, rangeStep, editable, serializable, rangeMin, tooltip, formerlySerializedAs, displayName, help } from 'cc.decorator';
import { BAIDU, EDITOR } from 'internal:constants';
import { TextureCube } from '../assets/texture-cube';
import { CCFloat, CCBoolean, CCInteger } from '../data/utils/attribute';
import { Color, Quat, Vec3, Vec2, Vec4 } from '../math';
import { Ambient } from '../renderer/scene/ambient';
import { Shadows, ShadowType, PCFType, ShadowSize } from '../renderer/scene/shadows';
import { Skybox } from '../renderer/scene/skybox';
import { Octree } from '../renderer/scene/octree';
import { Fog, FogType } from '../renderer/scene/fog';
import { Node } from './node';
import { legacyCC } from '../global-exports';
import { Root } from '../root';

const _up = new Vec3(0, 1, 0);
const _v3 = new Vec3();
const _v4 = new Vec4();
const _col = new Color();
const _qt = new Quat();

// Normalize HDR color
const normalizeHDRColor = (color : Vec4) => {
    const intensity = 1.0 / Math.max(Math.max(Math.max(color.x, color.y), color.z), 0.0001);
    if (intensity < 1.0) {
        color.x *= intensity;
        color.y *= intensity;
        color.z *= intensity;
    }
};
/**
 * @en Environment lighting information in the Scene
 * @zh 场景的环境光照相关信息
 */
@ccclass('cc.AmbientInfo')
@help('i18n:cc.Ambient')
export class AmbientInfo {
    @serializable
    @formerlySerializedAs('_skyColor')
    protected _skyColorHDR = new Vec4(0.2, 0.5, 0.8, 1.0);
    @serializable
    @formerlySerializedAs('_skyIllum')
    protected _skyIllumHDR = Ambient.SKY_ILLUM;
    @serializable
    @formerlySerializedAs('_groundAlbedo')
    protected _groundAlbedoHDR = new Vec4(0.2, 0.2, 0.2, 1.0);

    @serializable
    protected _skyColorLDR = new Vec4(0.2, 0.5, 0.8, 1.0);
    @serializable
    protected _skyIllumLDR = Ambient.SKY_ILLUM;
    @serializable
    protected _groundAlbedoLDR = new Vec4(0.2, 0.2, 0.2, 1.0);

    protected _resource: Ambient | null = null;

    get skyColorHDR () : Readonly<Vec4> {
        return this._skyColorHDR;
    }

    get groundAlbedoHDR () : Readonly<Vec4> {
        return this._groundAlbedoHDR;
    }

    get skyIllumHDR () {
        return this._skyIllumHDR;
    }

    get skyColorLDR () : Readonly<Vec4> {
        return this._skyColorLDR;
    }

    get groundAlbedoLDR () : Readonly<Vec4> {
        return this._groundAlbedoLDR;
    }

    get skyIllumLDR () {
        return this._skyIllumLDR;
    }

    /**
     * @en Sky lighting color configurable in editor with color picker
     * @zh 编辑器中可配置的天空光照颜色（通过颜色拾取器）
     */
    @visible(() => {
        const scene = legacyCC.director.getScene();
        const skybox = scene.globals.skybox;
        if (skybox.useIBL && skybox.applyDiffuseMap) {
            return false;
        } else {
            return true;
        }
    })
    @editable
    @tooltip('i18n:ambient.skyLightingColor')
    set skyLightingColor (val: Color) {
        _v4.set(val.x, val.y, val.z, val.w);
        if ((legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR) {
            this._skyColorHDR.set(_v4);
        } else {
            this._skyColorLDR.set(_v4);
        }
        if (this._resource) { this._resource.skyColor.set(_v4); }
    }
    get skyLightingColor () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        _v4.set(isHDR ? this._skyColorHDR : this._skyColorLDR);
        normalizeHDRColor(_v4);
        return _col.set(_v4.x * 255, _v4.y * 255, _v4.z * 255, 255);
    }

    set skyColor (val: Vec4) {
        if ((legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR) {
            this._skyColorHDR.set(val);
        } else {
            this._skyColorLDR.set(val);
        }
        if (this._resource) { this._resource.skyColor.set(val); }
    }

    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    @editable
    @type(CCFloat)
    @tooltip('i18n:ambient.skyIllum')
    set skyIllum (val: number) {
        if ((legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR) {
            this._skyIllumHDR = val;
        } else {
            this._skyIllumLDR = val;
        }

        if (this._resource) { this._resource.skyIllum = val; }
    }
    get skyIllum () {
        if ((legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR) {
            return this._skyIllumHDR;
        } else {
            return this._skyIllumLDR;
        }
    }

    /**
     * @en Ground lighting color configurable in editor with color picker
     * @zh 编辑器中可配置的地面光照颜色（通过颜色拾取器）
     */
    @visible(() => {
        const scene = legacyCC.director.getScene();
        const skybox = scene.globals.skybox;
        if (skybox.useIBL && skybox.applyDiffuseMap) {
            return false;
        } else {
            return true;
        }
    })
    @editable
    @tooltip('i18n:ambient.groundLightingColor')
    set groundLightingColor (val: Color) {
        _v4.set(val.x, val.y, val.z, val.w);
        if ((legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR) {
            this._groundAlbedoHDR.set(_v4);
        } else {
            this._groundAlbedoLDR.set(_v4);
        }
        if (this._resource) { this._resource.groundAlbedo.set(_v4); }
    }
    get groundLightingColor () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        _v4.set(isHDR ? this._groundAlbedoHDR : this._groundAlbedoLDR);
        normalizeHDRColor(_v4);
        return _col.set(_v4.x * 255, _v4.y * 255, _v4.z * 255, 255);
    }

    set groundAlbedo (val: Vec4) {
        if ((legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR) {
            this._groundAlbedoHDR.set(val);
        } else {
            this._groundAlbedoLDR.set(val);
        }
        if (this._resource) { this._resource.groundAlbedo.set(val); }
    }

    public activate (resource: Ambient) {
        this._resource = resource;
        this._resource.initialize(this);
    }
}
legacyCC.AmbientInfo = AmbientInfo;

/**
 * @en Skybox related information
 * @zh 天空盒相关信息
 */
@ccclass('cc.SkyboxInfo')
@help('i18n:cc.Skybox')
export class SkyboxInfo {
    @serializable
    protected _applyDiffuseMap = false;
    @serializable
    @type(TextureCube)
    @formerlySerializedAs('_envmap')
    protected _envmapHDR: TextureCube | null = null;
    @serializable
    @type(TextureCube)
    protected _envmapLDR: TextureCube | null = null;
    @serializable
    @type(TextureCube)
    protected _diffuseMapHDR: TextureCube | null = null;
    @serializable
    @type(TextureCube)
    protected _diffuseMapLDR: TextureCube | null = null;
    @serializable
    protected _enabled = false;
    @serializable
    protected _useIBL = false;
    @serializable
    protected _useHDR = true;

    protected _resource: Skybox | null = null;

    /**
     * @en Whether to use diffuse convolution map. Enabled -> Will use map specified. Disabled -> Will revert to hemispheric lighting
     * @zh 是否为IBL启用漫反射卷积图？不启用的话将使用默认的半球光照
     */
    @visible(function (this : SkyboxInfo) {
        if (this.useIBL) {
            return true;
        }
        return false;
    })
    @editable
    @tooltip('i18n:skybox.applyDiffuseMap')
    set applyDiffuseMap (val) {
        this._applyDiffuseMap = val;

        if (this._resource) {
            this._resource.useDiffuseMap = val;
        }
    }
    get applyDiffuseMap () {
        return this._applyDiffuseMap;
    }

    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    @editable
    @tooltip('i18n:skybox.enabled')
    set enabled (val) {
        if (this._enabled === val) return;
        this._enabled = val;

        if (this._resource) {
            this._resource.enabled = this._enabled;
        }
    }
    get enabled () {
        return this._enabled;
    }

    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    @editable
    @tooltip('i18n:skybox.useIBL')
    set useIBL (val) {
        this._useIBL = val;

        if (this._resource) {
            this._resource.useIBL = this._useIBL;
        }
    }
    get useIBL () {
        return this._useIBL;
    }

    /**
     * @en Toggle HDR (TODO: This SHOULD be moved into it's own subgroup away from skybox)
     * @zh 是否启用HDR？
     */
    @editable
    @tooltip('i18n:skybox.useHDR')
    set useHDR (val) {
        (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR = val;
        this._useHDR = val;

        // Switch UI to and from LDR/HDR textures depends on HDR state
        if (this._resource) {
            this.envmap = this._resource.envmap;
            this.diffuseMap = this._resource.diffuseMap;

            if (this.diffuseMap == null) {
                this.applyDiffuseMap = false;
            }
        }

        if (this._resource) { this._resource.useHDR = this._useHDR; }
    }
    get useHDR () {
        (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR = this._useHDR;
        return this._useHDR;
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    @editable
    @type(TextureCube)
    @tooltip('i18n:skybox.envmap')
    set envmap (val) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._envmapHDR = val;
        } else {
            this._envmapLDR = val;
        }

        if (!this._envmapHDR) {
            this._diffuseMapHDR = null;
            this._applyDiffuseMap = false;
            this.useIBL = false;
        }

        if (this._resource) {
            this._resource.setEnvMaps(this._envmapHDR, this._envmapLDR);
            this._resource.setDiffuseMaps(this._diffuseMapHDR, this._diffuseMapLDR);
            this._resource.useDiffuseMap = this._applyDiffuseMap;
            this._resource.envmap = val;
        }
    }
    get envmap () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._envmapHDR;
        } else {
            return this._envmapLDR;
        }
    }

    /**
     * @en The optional diffusion convolution map used in tandem with IBL
     * @zh 使用的漫反射卷积图
     */
    @visible(function (this : SkyboxInfo) {
        if (this.useIBL) {
            return true;
        }
        return false;
    })
    @editable
    @readOnly
    @type(TextureCube)
    set diffuseMap (val : TextureCube | null) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._diffuseMapHDR = val;
        } else {
            this._diffuseMapLDR = val;
        }

        if (this._resource) {
            this._resource.setDiffuseMaps(this._diffuseMapHDR, this._diffuseMapLDR);
        }
    }
    get diffuseMap () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._diffuseMapHDR;
        } else {
            return this._diffuseMapLDR;
        }
    }

    public activate (resource: Skybox) {
        this._resource = resource;
        this._resource.initialize(this);
        this._resource.setEnvMaps(this._envmapHDR, this._envmapLDR);
        this._resource.setDiffuseMaps(this._diffuseMapHDR, this._diffuseMapLDR);
        this._resource.activate(); // update global DS first
    }
}
legacyCC.SkyboxInfo = SkyboxInfo;

/**
 * @zh 全局雾相关信息
 * @en Global fog info
 */
@ccclass('cc.FogInfo')
@help('i18n:cc.Fog')
export class FogInfo {
    public static FogType = FogType;
    @serializable
    protected _type = FogType.LINEAR;
    @serializable
    protected _fogColor = new Color('#C8C8C8');
    @serializable
    protected _enabled = false;
    @serializable
    protected _fogDensity = 0.3;
    @serializable
    protected _fogStart = 0.5;
    @serializable
    protected _fogEnd = 300;
    @serializable
    protected _fogAtten = 5;
    @serializable
    protected _fogTop = 1.5;
    @serializable
    protected _fogRange = 1.2;
    @serializable
    protected _accurate = false;
    protected _resource: Fog | null = null;
    /**
     * @zh 是否启用全局雾效
     * @en Enable global fog
     */
    @editable
    @tooltip('i18n:fog.enabled')
    set enabled (val: boolean) {
        if (this._enabled === val) return;
        this._enabled = val;
        if (this._resource) {
            this._resource.enabled = val;
            if (val) {
                this._resource.type = this._type;
            }
        }
    }

    get enabled () {
        return this._enabled;
    }

    /**
     * @zh 是否启用精确雾效(像素雾)计算
     * @en Enable accurate fog (pixel fog)
     */
    @editable
    @tooltip('i18n:fog.accurate')
    set accurate (val: boolean) {
        if (this._accurate === val) return;
        this._accurate = val;
        if (this._resource) {
            this._resource.accurate = val;
            if (val) {
                this._resource.type = this._type;
            }
        }
    }

    get accurate () {
        return this._accurate;
    }

    /**
     * @zh 全局雾颜色
     * @en Global fog color
     */
    @editable
    @tooltip('i18n:fog.fogColor')
    set fogColor (val: Color) {
        this._fogColor.set(val);
        if (this._resource) { this._resource.fogColor = this._fogColor; }
    }

    get fogColor () : Readonly<Color> {
        return this._fogColor;
    }

    /**
     * @zh 全局雾类型
     * @en Global fog type
     */
    @editable
    @type(FogType)
    @tooltip('i18n:fog.type')
    get type () {
        return this._type;
    }

    set type (val) {
        this._type = val;
        if (this._resource) { this._resource.type = val; }
    }

    /**
     * @zh 全局雾浓度
     * @en Global fog density
     */
    @visible(function (this: FogInfo) {
        return this._type !== FogType.LAYERED && this._type !== FogType.LINEAR;
    })
    @type(CCFloat)
    @range([0, 1])
    @rangeStep(0.01)
    @slide
    @displayOrder(3)
    @tooltip('i18n:fog.fogDensity')
    get fogDensity () {
        return this._fogDensity;
    }

    set fogDensity (val) {
        this._fogDensity = val;
        if (this._resource) { this._resource.fogDensity = val; }
    }

    /**
     * @zh 雾效起始位置
     * @en Global fog start position
     */
    @visible(function (this: FogInfo) { return this._type !== FogType.LAYERED; })
    @type(CCFloat)
    @rangeStep(0.01)
    @displayOrder(4)
    @tooltip('i18n:fog.fogStart')
    get fogStart () {
        return this._fogStart;
    }

    set fogStart (val) {
        this._fogStart = val;
        if (this._resource) { this._resource.fogStart = val; }
    }

    /**
     * @zh 雾效结束位置，只适用于线性雾
     * @en Global fog end position, only for linear fog
     */
    @visible(function (this: FogInfo) { return this._type === FogType.LINEAR; })
    @type(CCFloat)
    @rangeStep(0.01)
    @displayOrder(5)
    @tooltip('i18n:fog.fogEnd')
    get fogEnd () {
        return this._fogEnd;
    }

    set fogEnd (val) {
        this._fogEnd = val;
        if (this._resource) { this._resource.fogEnd = val; }
    }

    /**
     * @zh 雾效衰减
     * @en Global fog attenuation
     */
    @visible(function (this: FogInfo) { return this._type !== FogType.LINEAR; })
    @type(CCFloat)
    @rangeMin(0.01)
    @rangeStep(0.01)
    @displayOrder(6)
    @tooltip('i18n:fog.fogAtten')
    get fogAtten () {
        return this._fogAtten;
    }

    set fogAtten (val) {
        this._fogAtten = val;
        if (this._resource) { this._resource.fogAtten = val; }
    }

    /**
     * @zh 雾效顶部范围，只适用于层级雾
     * @en Global fog top range, only for layered fog
     */
    @visible(function (this: FogInfo) { return this._type === FogType.LAYERED; })
    @type(CCFloat)
    @rangeStep(0.01)
    @displayOrder(7)
    @tooltip('i18n:fog.fogTop')
    get fogTop () {
        return this._fogTop;
    }

    set fogTop (val) {
        this._fogTop = val;
        if (this._resource) { this._resource.fogTop = val; }
    }

    /**
     * @zh 雾效范围，只适用于层级雾
     * @en Global fog range, only for layered fog
     */
    @visible(function (this: FogInfo) { return this._type === FogType.LAYERED; })
    @type(CCFloat)
    @rangeStep(0.01)
    @displayOrder(8)
    @tooltip('i18n:fog.fogRange')
    get fogRange () {
        return this._fogRange;
    }

    set fogRange (val) {
        this._fogRange = val;
        if (this._resource) { this._resource.fogRange = val; }
    }

    public activate (resource: Fog) {
        this._resource = resource;
        this._resource.initialize(this);
        this._resource.activate();
    }
}

/**
 * @en Scene level planar shadow related information
 * @zh 平面阴影相关信息
 */
@ccclass('cc.ShadowsInfo')
@help('i18n:cc.Shadow')
export class ShadowsInfo {
    @serializable
    protected _type = ShadowType.Planar;
    @serializable
    protected _enabled = false;
    @serializable
    protected _normal = new Vec3(0, 1, 0);
    @serializable
    protected _distance = 0;
    @serializable
    protected _shadowColor = new Color(0, 0, 0, 76);
    @serializable
    protected _firstSetCSM = false;
    @serializable
    protected _fixedArea = false;
    @serializable
    protected _pcf = PCFType.HARD;
    @serializable
    protected _bias = 0.00001;
    @serializable
    protected _normalBias = 0.0;
    @serializable
    protected _near = 0.1;
    @serializable
    protected _far = 10.0;
    @serializable
    protected _shadowDistance = 100;
    @serializable
    protected _invisibleOcclusionRange = 200;
    @serializable
    protected _orthoSize = 5;
    @serializable
    protected _maxReceived = 4;
    @serializable
    protected _size = new Vec2(512, 512);
    @serializable
    protected _saturation = 0.75;

    protected _resource: Shadows | null = null;

    /**
     * @en Whether activate planar shadow
     * @zh 是否启用平面阴影？
     */
    @editable
    @tooltip('i18n:shadow.enabled')
    set enabled (val: boolean) {
        if (this._enabled === val) return;
        this._enabled = val;
        if (this._resource) {
            this._resource.enabled = val;
            if (val) {
                this._resource.type = this._type;
            }
        }
    }
    get enabled () {
        if (BAIDU) {
            if (this._type !== ShadowType.Planar) {
                this._enabled = false;
            }
        }
        return this._enabled;
    }

    @editable
    @type(ShadowType)
    set type (val) {
        this._type = val;
        if (this._resource) { this._resource.type = val; }
    }
    get type () {
        return this._type;
    }

    /**
     * @en Shadow color
     * @zh 阴影颜色
     */
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.Planar; })
    set shadowColor (val: Color) {
        this._shadowColor.set(val);
        if (this._resource) { this._resource.shadowColor = val; }
    }
    get shadowColor () : Readonly<Color> {
        return this._shadowColor;
    }

    /**
     * @en The normal of the plane which receives shadow
     * @zh 阴影接收平面的法线
     */
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.Planar; })
    @tooltip('i18n:shadow.normal')
    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
        if (this._resource) { this._resource.normal = val; }
    }
    get normal () : Readonly<Vec3> {
        return this._normal;
    }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离
     */
    @type(CCFloat)
    @tooltip('i18n:shadow.distance')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.Planar; })
    set distance (val: number) {
        this._distance = val;
        if (this._resource) { this._resource.distance = val; }
    }
    get distance () {
        return this._distance;
    }

    /**
     * @en Shadow color saturation
     * @zh 阴影颜色饱和度
     */
    @editable
    @range([0.0, 1.0, 0.01])
    @slide
    @type(CCFloat)
    @tooltip('i18n:shadow.saturation')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap; })
    set saturation (val: number) {
        if (val > 1.0) {
            this._saturation = val / val;
            if (this._resource) { this._resource.saturation = val / val; }
        } else {
            this._saturation = val;
            if (this._resource) { this._resource.saturation = val; }
        }
    }
    get saturation () {
        return this._saturation;
    }

    /**
     * @en The normal of the plane which receives shadow
     * @zh 阴影接收平面的法线
     */
    @type(PCFType)
    @tooltip('i18n:shadow.pcf')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap; })
    set pcf (val) {
        this._pcf = val;
        if (this._resource) { this._resource.pcf = val; }
    }
    get pcf () {
        return this._pcf;
    }

    /**
     * @en get or set shadow max received
     * @zh 获取或者设置阴影接收的最大光源数量
     */
    @type(CCInteger)
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap; })
    set maxReceived (val: number) {
        this._maxReceived = val;
        if (this._resource) { this._resource.maxReceived = val; }
    }
    get maxReceived () {
        return this._maxReceived;
    }

    /**
     * @en get or set shadow map sampler offset
     * @zh 获取或者设置阴影纹理偏移值
     */
    @type(CCFloat)
    @tooltip('i18n:shadow.bias')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap; })
    set bias (val: number) {
        this._bias = val;
        if (this._resource) { this._resource.bias = val; }
    }
    get bias () {
        return this._bias;
    }

    /**
     * @en on or off Self-shadowing.
     * @zh 打开或者关闭自阴影。
     */
    @type(CCFloat)
    @tooltip('i18n:shadow.normalBias')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap; })
    set normalBias (val: number) {
        this._normalBias = val;
        if (this._resource) { this._resource.normalBias = val; }
    }
    get normalBias () {
        return this._normalBias;
    }

    /**
     * @en get or set shadow map size
     * @zh 获取或者设置阴影纹理大小
     */
    @type(ShadowSize)
    @tooltip('i18n:shadow.shadowMapSize')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap; })
    set shadowMapSize (value: number) {
        this._size.set(value, value);
        if (this._resource) {
            this._resource.size.set(value, value);
            this._resource.shadowMapDirty = true;
        }
    }
    get shadowMapSize () {
        return this._size.x;
    }
    get size () : Readonly<Vec2> {
        return this._size;
    }

    /**
     * @en get or set fixed area shadow
     * @zh 是否是固定区域阴影
     */
    @type(CCBoolean)
    @tooltip('i18n:shadow.fixedArea')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap; })
    set fixedArea (val) {
        this._fixedArea = val;
        if (this._resource) { this._resource.fixedArea = val; }
    }
    get fixedArea () {
        return this._fixedArea;
    }

    /**
     * @en get or set shadow camera near
     * @zh 获取或者设置阴影相机近裁剪面
     */
    @type(CCFloat)
    @tooltip('i18n:shadow.near')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap && this._fixedArea === true; })
    set near (val: number) {
        this._near = val;
        if (this._resource) { this._resource.near = val; }
    }
    get near () {
        return this._near;
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置阴影相机远裁剪面
     */
    @type(CCFloat)
    @tooltip('i18n:shadow.far')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap && this._fixedArea === true; })
    set far (val: number) {
        this._far = Math.min(val, Shadows.MAX_FAR);
        if (this._resource) { this._resource.far = this._far; }
    }
    get far () {
        return this._far;
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置潜在阴影产生的范围
     */
    @editable
    @range([0.0, 2000.0, 0.1])
    @slide
    @type(CCFloat)
    @tooltip('i18n:shadow.invisibleOcclusionRange')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap && this._fixedArea === false; })
    set invisibleOcclusionRange (val: number) {
        this._invisibleOcclusionRange = Math.min(val, Shadows.MAX_FAR);
        if (this._resource) {
            this._resource.invisibleOcclusionRange = this._invisibleOcclusionRange;
        }
    }
    get invisibleOcclusionRange () {
        return this._invisibleOcclusionRange;
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置潜在阴影产生的范围
     */
    @editable
    @range([0.0, 2000.0, 0.1])
    @slide
    @type(CCFloat)
    @tooltip('i18n:shadow.shadowDistance')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap && this._fixedArea === false; })
    set shadowDistance (val: number) {
        this._shadowDistance = Math.min(val, Shadows.MAX_FAR);
        if (this._resource) {
            this._resource.shadowDistance = this._shadowDistance;
        }
    }
    get shadowDistance () {
        return this._shadowDistance;
    }

    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影相机正交大小
     */
    @type(CCFloat)
    @tooltip('i18n:shadow.orthoSize')
    @visible(function (this: ShadowsInfo) { return this._type === ShadowType.ShadowMap && this._fixedArea === true; })
    set orthoSize (val: number) {
        this._orthoSize = val;
        if (this._resource) { this._resource.orthoSize = val; }
    }
    get orthoSize () {
        return this._orthoSize;
    }

    /**
     * @en Set plane which receives shadow with the given node's world transformation
     * @zh 根据指定节点的世界变换设置阴影接收平面的信息
     * @param node The node for setting up the plane
     */
    public setPlaneFromNode (node: Node) {
        node.getWorldRotation(_qt);
        this.normal = Vec3.transformQuat(_v3, _up, _qt);
        node.getWorldPosition(_v3);
        this.distance = Vec3.dot(this._normal, _v3);
    }

    public activate (resource: Shadows) {
        this.pcf = Math.min(this._pcf, PCFType.SOFT_2X);

        this._resource = resource;
        if (EDITOR && this._firstSetCSM) {
            this._resource.firstSetCSM = this._firstSetCSM;
            // Only the first time render in editor will trigger the auto calculation of shadowDistance
            legacyCC.director.once(legacyCC.Director.EVENT_AFTER_DRAW, () => {
                // Sync automatic calculated shadowDistance in renderer
                this._firstSetCSM = false;
                if (this._resource) {
                    this.shadowDistance = Math.min(this._resource.shadowDistance, Shadows.MAX_FAR);
                }
            });
        }
        this._resource.initialize(this);
        this._resource.activate();
    }
}
legacyCC.ShadowsInfo = ShadowsInfo;

/**
 * @en Scene level octree related information
 * @zh 场景八叉树相关信息
 */

export const DEFAULT_WORLD_MIN_POS = new Vec3(-1024.0, -1024.0, -1024.0);
export const DEFAULT_WORLD_MAX_POS = new Vec3(1024.0, 1024.0, 1024.0);
export const DEFAULT_OCTREE_DEPTH = 8;

@ccclass('cc.OctreeInfo')
@help('i18n:cc.OctreeCulling')
export class OctreeInfo {
    @serializable
    protected _enabled = false;
    @serializable
    protected _minPos = new Vec3(DEFAULT_WORLD_MIN_POS);
    @serializable
    protected _maxPos = new Vec3(DEFAULT_WORLD_MAX_POS);
    @serializable
    protected _depth = DEFAULT_OCTREE_DEPTH;

    protected _resource: Octree | null = null;

    /**
     * @en Whether activate octree
     * @zh 是否启用八叉树加速剔除？
     */
    @editable
    @tooltip('i18n:octree_culling.enabled')
    set enabled (val: boolean) {
        if (this._enabled === val) return;
        this._enabled = val;
        if (this._resource) {
            this._resource.enabled = val;
        }
    }
    get enabled () {
        return this._enabled;
    }

    @editable
    @tooltip('i18n:octree_culling.minPos')
    @displayName('World MinPos')
    set minPos (val: Vec3) {
        this._minPos = val;
        if (this._resource) { this._resource.minPos = val; }
    }
    get minPos () {
        return this._minPos;
    }

    @editable
    @tooltip('i18n:octree_culling.maxPos')
    @displayName('World MaxPos')
    set maxPos (val: Vec3) {
        this._maxPos = val;
        if (this._resource) { this._resource.maxPos = val; }
    }
    get maxPos () {
        return this._maxPos;
    }

    @editable
    @range([4, 12, 1])
    @type(CCInteger)
    @tooltip('i18n:octree_culling.depth')
    set depth (val: number) {
        this._depth = val;
        if (this._resource) { this._resource.depth = val; }
    }
    get depth () {
        return this._depth;
    }

    public activate (resource: Octree) {
        this._resource = resource;
        this._resource.initialize(this);
    }
}

/**
 * @en All scene related global parameters, it affects all content in the corresponding scene
 * @zh 各类场景级别的渲染参数，将影响全场景的所有物体
 */
@ccclass('cc.SceneGlobals')
export class SceneGlobals {
    /**
     * @en The environment light information
     * @zh 场景的环境光照相关信息
     */
    @serializable
    @editable
    public ambient = new AmbientInfo();
    /**
     * @en Scene level planar shadow related information
     * @zh 平面阴影相关信息
     */
    @serializable
    @editable
    public shadows = new ShadowsInfo();
    /**
     * @legacyPublic
     */
    @serializable
    public _skybox = new SkyboxInfo();
    @editable
    @serializable
    public fog = new FogInfo();

    /**
     * @en Skybox related information
     * @zh 天空盒相关信息
     */
    @editable
    @type(SkyboxInfo)
    get skybox () {
        return this._skybox;
    }
    set skybox (value) {
        this._skybox = value;
    }

    /**
     * @en Octree related information
     * @zh 八叉树相关信息
     */
    @editable
    @serializable
    public octree = new OctreeInfo();

    public activate () {
        const sceneData = legacyCC.director.root.pipeline.pipelineSceneData;
        this.skybox.activate(sceneData.skybox);
        this.ambient.activate(sceneData.ambient);

        this.shadows.activate(sceneData.shadows);
        this.fog.activate(sceneData.fog);
        this.octree.activate(sceneData.octree);
    }
}
legacyCC.SceneGlobals = SceneGlobals;
