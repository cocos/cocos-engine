/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category scene-graph
 */

import { TextureCube } from '../assets/texture-cube';
import { ccclass, float, property } from '../data/class-decorator';
import { CCBoolean, CCFloat } from '../data/utils/attribute';
import { Color, Quat, Vec3 } from '../math';
import { Ambient } from '../renderer/scene/ambient';
import { PlanarShadows } from '../renderer/scene/planar-shadows';
import { RenderScene } from '../renderer/scene/render-scene';
import { Skybox } from '../renderer/scene/skybox';
import { Fog, FogType } from '../renderer/scene/fog';
import { Node } from './node';

const _up = new Vec3(0, 1, 0);
const _v3 = new Vec3();
const _qt = new Quat();

/**
 * @zh 场景的环境光照相关信息
 */
@ccclass('cc.AmbientInfo')
export class AmbientInfo {
    @property
    protected _skyColor = new Color(51, 128, 204, 1.0);
    @property
    protected _skyIllum = Ambient.SKY_ILLUM;
    @property
    protected _groundAlbedo = new Color(51, 51, 51, 255);

    protected _resource: Ambient | null = null;

    /**
     * @zh 天空颜色
     */
    @property({ type: Color })
    set skyColor (val: Color) {
        this._skyColor.set(val);
        if (this._resource) { Color.toArray(this._resource.skyColor, this.skyColor); }
    }
    get skyColor () {
        return this._skyColor;
    }

    /**
     * @zh 天空亮度
     */
    @float
    set skyIllum (val: number) {
        this._skyIllum = val;
        if (this._resource) { this._resource.skyIllum = this.skyIllum; }
    }
    get skyIllum () {
        return this._skyIllum;
    }

    /**
     * @zh 地面颜色
     */
    @property({ type: Color })
    set groundAlbedo (val: Color) {
        this._groundAlbedo.set(val);
        // only RGB channels are used, alpha channel are intensionally left unchanged here
        if (this._resource) { Vec3.toArray(this._resource.groundAlbedo, this.groundAlbedo); }
    }
    get groundAlbedo () {
        return this._groundAlbedo;
    }

    set renderScene (rs: RenderScene) {
        this._resource = rs.ambient;
        this.skyColor = this._skyColor;
        this.skyIllum = this._skyIllum;
        this.groundAlbedo = this._groundAlbedo;
    }
}
cc.AmbientInfo = AmbientInfo;

/**
 * @zh 天空盒相关信息
 */
@ccclass('cc.SkyboxInfo')
export class SkyboxInfo {
    @property(TextureCube)
    protected _envmap: TextureCube | null = null;
    @property
    protected _isRGBE = false;
    @property
    protected _enabled = false;
    @property
    protected _useIBL = false;

    protected _resource: Skybox | null = null;

    /**
     * @zh 是否启用天空盒？
     */
    @property({ type: CCBoolean })
    set enabled (val) {
        this._enabled = val;
        if (this._resource) { this._resource.enabled = this._enabled; }
    }
    get enabled () {
        return this._enabled;
    }

    /**
     * @zh 是否启用环境光照？
     */
    @property({ type: CCBoolean })
    set useIBL (val) {
        this._useIBL = val;
        if (this._resource) { this._resource.useIBL = this._useIBL; }
    }
    get useIBL () {
        return this._useIBL;
    }

    /**
     * @zh 使用的立方体贴图
     */
    @property({ type: TextureCube })
    set envmap (val) {
        this._envmap = val;
        if (this._resource) { this._resource.envmap = this._envmap; }
    }
    get envmap () {
        return this._envmap;
    }

    /**
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    @property({ type: CCBoolean })
    set isRGBE (val) {
        this._isRGBE = val;
        if (this._resource) { this._resource.isRGBE = this._isRGBE; }
    }
    get isRGBE () {
        return this._isRGBE;
    }

    set renderScene (val: RenderScene) {
        this._resource = val.skybox;
        this.isRGBE = this._isRGBE;
        this.envmap = this._envmap;
        this.enabled = this._enabled;
        this.useIBL = this._useIBL;
    }
}
cc.SkyboxInfo = SkyboxInfo;

/**
 * @zh 全局雾相关信息
 * @en Global fog info
 */
@ccclass('cc.FogInfo')
export class FogInfo {
    public static FogType = FogType;
    @property
    protected _type = FogType.LINEAR;
    @property
    protected _fogColor = new Color('#C8C8C8');
    @property
    protected _enabled = false;
    @property
    protected _fogDensity = 0.3;
    @property
    protected _fogStart = 0.5;
    @property
    protected _fogEnd = 5;
    @property
    protected _fogAtten = 5;
    @property
    protected _fogTop = 1.5;
    @property
    protected _fogRange = 1.2;
    protected _resource: Fog | null = null;
    /**
     * @zh 是否启用全局雾效
     * @en Enable global fog
     */
    @property({ type: CCBoolean })
    set enabled (val: boolean) {
        this._enabled = val;
        if (this._resource) { this._resource.enabled = val; }
    }
    
    get enabled () {
        return this._enabled;
    }
    
    /**
     * @zh 全局雾颜色
     * @en Global fog color
     */
    @property({ type: Color })
    set fogColor (val: Color) {
        this._fogColor.set(val);
        if (this._resource) { Color.toArray(this._resource.fogColor, this.fogColor); }
    }
    
    get fogColor () {
        return this._fogColor;
    }

    /**
     * @zh 全局雾类型
     * @en Global fog type
     */
    @property({
        type: FogType,
        tooltip: '全局雾类型',
    })
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
    @property({
        type: CCFloat,
        tooltip: '全局雾浓度',
    })
    get fogDensity () {
        return this._fogDensity;
    }

    set fogDensity (val) {
        this._fogDensity = val;
        if (this._resource) { this._resource.fogDensity = val; }
    }

    /**
     * @zh 雾效起始位置，只适用于线性雾
     * @en Global fog start position, only for linear fog
     */
    @property({
        type: CCFloat,
        tooltip: '雾效起始位置',
        visible: function (this: FogInfo){ 
            return this._type === FogType.LINEAR;
        }
    })
    get fogStart() {
        return this._fogStart;
    }

    set fogStart(val) {
        this._fogStart = val;
        if (this._resource) { this._resource.fogStart = val; }
    }

    /**
     * @zh 雾效结束位置，只适用于线性雾
     * @en Global fog end position, only for linear fog
     */
    @property({
        type: CCFloat,
        tooltip: '雾效结束位置',
        visible: function (this: FogInfo){ 
            return this._type === FogType.LINEAR;
        }
    })
    get fogEnd() {
        return this._fogEnd;
    }

    set fogEnd(val) {
        this._fogEnd = val;
        if (this._resource) { this._resource.fogEnd = val; }
    }

    /**
     * @zh 雾效衰减
     * @en Global fog attenuation
     */
    @property({
        type: CCFloat,
        tooltip: '雾效衰减',
        visible: function (this: FogInfo){ 
            return this._type !== FogType.LINEAR;
        }
    })
    get fogAtten() {
        return this._fogAtten;
    }

    set fogAtten(val) {
        this._fogAtten = val;
        if (this._resource) { this._resource.fogAtten = val; }
    }

    /**
     * @zh 雾效顶部范围，只适用于层级雾
     * @en Global fog top range, only for layered fog
     */
    @property({
        type: CCFloat,
        tooltip: '雾效顶部范围',
        visible: function (this: FogInfo){ 
            return this._type === FogType.LAYERED;
        }
    })
    get fogTop() {
        return this._fogTop;
    }

    set fogTop(val) {
        this._fogTop = val;
        if (this._resource) { this._resource.fogTop = val; }
    }

    /**
     * @zh 雾效范围，只适用于层级雾
     * @en Global fog range, only for layered fog
     */
    @property({
        type: CCFloat,
        tooltip: '雾效范围',
        visible: function (this: FogInfo){ 
            return this._type === FogType.LAYERED;
        }
    })
    get fogRange() {
        return this._fogRange;
    }

    set fogRange(val) {
        this._fogRange = val;
        if (this._resource) { this._resource.fogRange = val; }
    }

    set renderScene (val: RenderScene) {
        this._resource = val.fog;
        this.enabled = this._enabled;
        this.fogColor = this._fogColor;
        this.type = this._type;
        this.fogDensity = this._fogDensity;
        this.fogStart = this._fogStart;
        this.fogEnd = this._fogEnd;
        this.fogAtten = this._fogAtten;
        this.fogTop = this._fogTop;
        this.fogRange = this._fogRange;
    }
}
cc.FogInfo = FogInfo;

/**
 * @zh 平面阴影相关信息
 */
@ccclass('cc.PlanarShadowInfo')
export class PlanarShadowInfo {
    @property
    protected _enabled = false;
    @property
    protected _normal = new Vec3(0, 1, 0);
    @property
    protected _distance = 0;
    @property
    protected _shadowColor = new Color(0, 0, 0, 76);

    protected _resource: PlanarShadows | null = null;

    /**
     * @zh 是否启用平面阴影？
     */
    @property({ type: CCBoolean })
    set enabled (val: boolean) {
        this._enabled = val;
        if (this._resource) { this._resource.enabled = val; }
    }
    get enabled () {
        return this._enabled;
    }

    /**
     * @zh 阴影接收平面的法线
     */
    @property({ type: Vec3 })
    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
        if (this._resource) { this._resource.normal = val; }
    }
    get normal () {
        return this._normal;
    }

    /**
     * @zh 阴影接收平面与原点的距离
     */
    @property({ type: CCFloat })
    set distance (val: number) {
        this._distance = val;
        if (this._resource) { this._resource.distance = val; }
    }
    get distance () {
        return this._distance;
    }

    /**
     * @zh 阴影颜色
     */
    @property({ type: Color })
    set shadowColor (val: Color) {
        this._shadowColor.set(val);
        if (this._resource) { this._resource.shadowColor = val; }
    }
    get shadowColor () {
        return this._shadowColor;
    }

    /**
     * @zh 根据指定节点的世界变换设置阴影接收平面的信息
     * @param node 阴影接收平面的世界变换
     */
    public setPlaneFromNode (node: Node) {
        node.getWorldRotation(_qt);
        this.normal = Vec3.transformQuat(_v3, _up, _qt);
        node.getWorldPosition(_v3);
        this.distance = Vec3.dot(this._normal, _v3);
    }

    set renderScene (val: RenderScene) {
        this._resource = val.planarShadows;
        this.normal = this._normal;
        this.distance = this._distance;
        this.shadowColor = this._shadowColor;
        this.enabled = this._enabled;
    }
}
cc.PlanarShadowInfo = PlanarShadowInfo;

/**
 * @zh 各类场景级别的渲染参数，将影响全场景的所有物体
 */
@ccclass('cc.SceneGlobals')
export class SceneGlobals {
    @property
    public ambient = new AmbientInfo();
    @property
    public planarShadows = new PlanarShadowInfo();
    @property
    private _skybox = new SkyboxInfo();
    @property
    public fog = new FogInfo();
    
    @property({ type: SkyboxInfo })
    get skybox () {
        return this._skybox;
    }

    set skybox (value) {
        this._skybox = value;
    }

    set renderScene (rs: RenderScene) {
        this.ambient.renderScene = rs;
        this.skybox.renderScene = rs;
        this.planarShadows.renderScene = rs;
        this.fog.renderScene = rs;
    }
}
cc.SceneGlobals = SceneGlobals;
