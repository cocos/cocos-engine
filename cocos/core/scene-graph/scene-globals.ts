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
import { Node } from './node';

const _up = new Vec3(0, 1, 0);
const _v3 = new Vec3();
const _qt = new Quat();

/**
 * @en Environment lighting information in the Scene
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
     * @en Sky color
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
     * @en Sky illuminance
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
     * @en Ground color
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
 * @en Skybox related information
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
     * @en Whether activate skybox in the scene
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
     * @en Whether use environment lighting
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
     * @en The texture cube used for the skybox
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
     * @en Whether enable RGBE data support in skybox shader
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
 * @en Scene level planar shadow related information
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
     * @en Whether activate planar shadow
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
     * @en The normal of the plane which receives shadow
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
     * @en The distance from coordinate origin to the receiving plane.
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
     * @en Shadow color
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
 * @en All scene related global parameters, it affects all content in the corresponding scene
 * @zh 各类场景级别的渲染参数，将影响全场景的所有物体
 */
@ccclass('cc.SceneGlobals')
export class SceneGlobals {
    /**
     * @en The environment light information
     * @zh 场景的环境光照相关信息
     */
    @property
    public ambient = new AmbientInfo();
    /**
     * @en Scene level planar shadow related information
     * @zh 平面阴影相关信息
     */
    @property
    public planarShadows = new PlanarShadowInfo();
    @property
    private _skybox = new SkyboxInfo();

    /**
     * @en Skybox related information
     * @zh 天空盒相关信息
     */
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
    }
}
cc.SceneGlobals = SceneGlobals;
