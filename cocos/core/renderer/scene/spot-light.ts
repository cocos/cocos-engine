/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { JSB } from 'internal:constants';
import { AABB, Frustum } from '../../geometry';
import { legacyCC } from '../../global-exports';
import { Mat4, Quat, Vec3 } from '../../math';
import { Light, LightType, nt2lm } from './light';
import { NativeSpotLight } from './native-scene';
import { PCFType } from './shadows';

const _forward = new Vec3(0, 0, -1);
const _qt = new Quat();
const _matView = new Mat4();
const _matProj = new Mat4();
const _matViewProj = new Mat4();
const _matViewProjInv = new Mat4();

export class SpotLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);

    protected _range = 5.0;

    /**
     * @en Cached uniform variables.
     * @zh 缓存下来的 uniform 变量。
     */
    protected _spotAngle: number = Math.cos(Math.PI / 6);

    protected _pos: Vec3;

    protected _aabb: AABB;

    protected _frustum: Frustum;

    /**
     * @en User-specified full-angle radians.
     * @zh 用户指定的全角弧度。
     */
    protected _angle = 0;

    protected _needUpdate = false;

    protected _size = 0.15;

    protected _luminanceHDR = 0;

    protected _luminanceLDR = 0;

    protected _aspect = 0;

    protected _shadowEnabled = false;
    protected _shadowPcf = PCFType.HARD;
    protected _shadowBias = 0.00001;
    protected _shadowNormalBias = 0.0;

    protected _init (): void {
        super._init();
        if (JSB) {
            const nativeSpotLight = this._nativeObj! as NativeSpotLight;
            nativeSpotLight.setAABB(this._aabb.native);
            nativeSpotLight.setFrustum(this._frustum);
            nativeSpotLight.setDirection(this._dir);
            nativeSpotLight.setPosition(this._pos);
        }
    }

    protected _destroy (): void {
        super._destroy();
    }

    protected _setDirection (dir: Vec3): void {
        this._dir.set(dir);
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setDirection(dir);
        }
    }

    get position () {
        return this._pos;
    }

    set size (size: number) {
        this._size = size;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setSize(size);
        }
    }

    get size (): number {
        return this._size;
    }

    set range (range: number) {
        this._range = range;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setRange(range);
        }

        this._needUpdate = true;
    }

    get range (): number {
        return this._range;
    }

    get luminance (): number {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._luminanceHDR;
        } else {
            return this._luminanceLDR;
        }
    }
    set luminance (value: number) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this.luminanceHDR = value;
        } else {
            this.luminanceLDR = value;
        }
    }

    get luminanceHDR () {
        return this._luminanceHDR;
    }
    set luminanceHDR (value: number) {
        this._luminanceHDR = value;

        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setLuminanceHDR(value);
        }
    }

    get luminanceLDR () {
        return this._luminanceLDR;
    }
    set luminanceLDR (value: number) {
        this._luminanceLDR = value;

        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setLuminanceLDR(value);
        }
    }

    get direction (): Vec3 {
        return this._dir;
    }

    // 获取 cache 下来的 cos(angle / 2) 属性值，uniform 里需要
    get spotAngle () {
        return this._spotAngle;
    }

    // 设置用户指定的全角弧度，同时计算 cache 下来的 cos(angle / 2) 属性值，uniform 里需要。
    set spotAngle (val: number) {
        this._angle = val;
        this._spotAngle = Math.cos(val * 0.5);
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setAngle(this._spotAngle);
        }

        this._needUpdate = true;
    }

    get angle () {
        return this._angle;
    }

    set aspect (val: number) {
        this._aspect = val;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setAspect(val);
        }

        this._needUpdate = true;
    }

    get aspect (): number {
        return this._aspect;
    }

    get aabb () {
        return this._aabb;
    }

    get frustum () {
        return this._frustum;
    }

    /**
     * @en Whether activate shadow
     * @zh 是否启用阴影？
     */
    get shadowEnabled () {
        return this._shadowEnabled;
    }
    set shadowEnabled (val) {
        this._shadowEnabled = val;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setShadowEnabled(val);
        }
    }

    /**
      * @en get or set shadow pcf.
      * @zh 获取或者设置阴影pcf等级。
      */
    get shadowPcf () {
        return this._shadowPcf;
    }
    set shadowPcf (val) {
        this._shadowPcf = val;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setShadowPcf(val);
        }
    }

    /**
      * @en get or set shadow map sampler offset
      * @zh 获取或者设置阴影纹理偏移值
      */
    get shadowBias () {
        return this._shadowBias;
    }
    set shadowBias (val) {
        this._shadowBias = val;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setShadowBias(val);
        }
    }

    /**
      * @en get or set normal bias.
      * @zh 设置或者获取法线偏移。
      */
    get shadowNormalBias () {
        return this._shadowNormalBias;
    }
    set shadowNormalBias (val: number) {
        this._shadowNormalBias = val;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setShadowNormalBias(val);
        }
    }

    constructor () {
        super();
        this._aabb = AABB.create();
        this._frustum = Frustum.create();
        this._pos = new Vec3();
        this._type = LightType.SPOT;
    }

    public initialize () {
        super.initialize();

        const size = 0.15;
        this.size = size;
        this.aspect = 1.0;
        this.luminance = 1700 / nt2lm(size);
        this.luminanceLDR = 1.0;
        this.range = Math.cos(Math.PI / 6);
        this._setDirection(new Vec3(1.0, -1.0, -1.0));
    }

    public update () {
        if (this._node && (this._node.hasChangedFlags || this._needUpdate)) {
            this._node.getWorldPosition(this._pos);
            Vec3.transformQuat(this._dir, _forward, this._node.getWorldRotation(_qt));
            Vec3.normalize(this._dir, this._dir);

            AABB.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range);

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
