/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { Mat4, Quat, Vec3, geometry, cclegacy } from '../../core';
import { Light, LightType, nt2lm } from './light';
import { PCFType } from './shadows';

const _forward = new Vec3(0, 0, -1);
const _qt = new Quat();
const _matView = new Mat4();
const _matProj = new Mat4();
const _matViewProj = new Mat4();
const _matViewProjInv = new Mat4();

/**
 * @en The spot light representation in the render scene, it will light up a cone area in the direction of the light, it supports shadow generation.
 * @zh 渲染场景中的聚光灯抽象，可以照亮光源方向上的一个锥形区域，支持生成阴影。
 */
export class SpotLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);

    protected _range = 5.0;

    protected _spotAngle: number = Math.cos(Math.PI / 6);

    protected _pos: Vec3;

    protected _aabb: geometry.AABB;

    protected _frustum: geometry.Frustum;

    /**
     * @en User-specified full-angle radians.
     * @zh 用户指定的全角弧度。
     */
    protected _angle = 0;

    protected _needUpdate = false;

    protected _size = 0.15;

    protected _luminanceHDR = 0;

    protected _luminanceLDR = 0;

    // Shadow map properties
    protected _shadowEnabled = false;
    protected _shadowPcf = PCFType.HARD;
    protected _shadowBias = 0.00001;
    protected _shadowNormalBias = 0.0;

    /**
     * @en The world position of the light source
     * @zh 光源的世界坐标
     */
    get position () {
        return this._pos;
    }

    /**
     * @en The size of the spot light source
     * @zh 聚光灯的光源尺寸
     */
    set size (size: number) {
        this._size = size;
    }

    get size (): number {
        return this._size;
    }

    /**
     * @en The lighting range of the spot light
     * @zh 聚光灯的光照范围
     */
    set range (range: number) {
        this._range = range;

        this._needUpdate = true;
    }

    get range (): number {
        return this._range;
    }

    /**
     * @en The luminance of the light source
     * @zh 光源的亮度
     */
    get luminance (): number {
        const isHDR = (cclegacy.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._luminanceHDR;
        } else {
            return this._luminanceLDR;
        }
    }
    set luminance (value: number) {
        const isHDR = (cclegacy.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this.luminanceHDR = value;
        } else {
            this.luminanceLDR = value;
        }
    }

    /**
     * @en The luminance of the light source in HDR mode
     * @zh HDR 模式下光源的亮度
     */
    get luminanceHDR () {
        return this._luminanceHDR;
    }
    set luminanceHDR (value: number) {
        this._luminanceHDR = value;
    }

    /**
     * @en The luminance of the light source in LDR mode
     * @zh LDR 模式下光源的亮度
     */
    get luminanceLDR () {
        return this._luminanceLDR;
    }
    set luminanceLDR (value: number) {
        this._luminanceLDR = value;
    }

    /**
     * @en The direction of the spot light
     * @zh 聚光灯的照明方向
     */
    get direction (): Vec3 {
        return this._dir;
    }

    /**
     * @en The setter will take the value as the cone angle,
     * but the getter will give you the cosine value of the half cone angle: `cos(angle / 2)`.
     * As the in-consistence is not acceptable for a property, please do not use it.
     * @zh 赋值时这个属性会把输入值当做聚光灯光照区域的锥角，但是获取时返回的是 cos(angle / 2)。
     * 由于这种不一致性，请不要使用这个属性。
     * @internal
     */
    get spotAngle () {
        return this._spotAngle;
    }
    set spotAngle (val: number) {
        this._angle = val;
        this._spotAngle = Math.cos(val * 0.5);

        this._needUpdate = true;
    }

    /**
     * @en The cone angle of the lighting area
     * @zh 聚光灯锥角
     */
    get angle () {
        return this._angle;
    }

    get aabb () {
        return this._aabb;
    }

    /**
     * @en The frustum of the lighting area
     * @zh 受光源影响范围的截椎体
     */
    get frustum () {
        return this._frustum;
    }

    /**
     * @en Whether shadow casting is enabled
     * @zh 是否启用阴影？
     */
    get shadowEnabled () {
        return this._shadowEnabled;
    }
    set shadowEnabled (val) {
        this._shadowEnabled = val;
    }

    /**
     * @en The pcf level of the shadow generation.
     * @zh 获取或者设置阴影 pcf 等级。
     */
    get shadowPcf () {
        return this._shadowPcf;
    }
    set shadowPcf (val) {
        this._shadowPcf = val;
    }

    /**
     * @en The depth offset of shadow to avoid moire pattern artifacts
     * @zh 阴影的深度偏移, 可以减弱跨像素导致的条纹状失真
     */
    get shadowBias () {
        return this._shadowBias;
    }
    set shadowBias (val) {
        this._shadowBias = val;
    }

    /**
      * @en The normal bias of the shadow map.
      * @zh 设置或者获取法线偏移。
      */
    get shadowNormalBias () {
        return this._shadowNormalBias;
    }
    set shadowNormalBias (val: number) {
        this._shadowNormalBias = val;
    }

    constructor () {
        super();
        this._aabb = geometry.AABB.create();
        this._frustum = geometry.Frustum.create();
        this._pos = new Vec3();
        this._type = LightType.SPOT;
    }

    public initialize () {
        super.initialize();

        const size = 0.15;
        this.size = size;
        this.luminanceHDR = 1700 / nt2lm(size);
        this.luminanceLDR = 1.0;
        this.range = Math.cos(Math.PI / 6);
        this._dir.set(new Vec3(1.0, -1.0, -1.0));
    }

    public update () {
        if (this._node && (this._node.hasChangedFlags || this._needUpdate)) {
            this._node.getWorldPosition(this._pos);
            Vec3.transformQuat(this._dir, _forward, this._node.getWorldRotation(_qt));
            Vec3.normalize(this._dir, this._dir);

            geometry.AABB.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range);

            // view matrix
            this._node.getWorldRT(_matView);
            Mat4.invert(_matView, _matView);

            Mat4.perspective(_matProj, this._angle, 1.0, 0.001, this._range);

            // view-projection
            Mat4.multiply(_matViewProj, _matProj, _matView);
            // Mat4.invert(_matViewProjInv, _matViewProj);

            this._frustum.update(_matViewProj, _matViewProjInv);

            this._needUpdate = false;
        }
    }
}
