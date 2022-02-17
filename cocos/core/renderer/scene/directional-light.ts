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
import { legacyCC } from '../../global-exports';
import { Vec2, Vec3 } from '../../math';
import { Ambient } from './ambient';
import { Light, LightType } from './light';
import { NativeDirectionalLight } from './native-scene';
import { CSMLevel, PCFType, Shadows } from './shadows';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();

export class DirectionalLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);
    protected _illuminanceHDR: number = Ambient.SUN_ILLUM;
    protected _illuminanceLDR = 1.0;

    // Public properties of shadow
    protected _shadowEnabled = false;

    // Shadow map properties
    protected _shadowPcf = PCFType.HARD;
    protected _shadowBias = 0.00001;
    protected _shadowNormalBias = 0.0;
    protected _shadowSaturation = 1.0;
    protected _shadowDistance = 100;
    protected _shadowInvisibleOcclusionRange = 200;
    protected _shadowCSMLevel = CSMLevel.level_3;
    protected _shadowCSMLambda = 0.75;
    protected _shadowFrustumItem: Vec2[] = [];

    // fixed area properties
    protected _shadowFixedArea = false;
    protected _shadowNear = 0.1;
    protected _shadowFar = 10.0;
    protected _shadowOrthoSize = 5;

    set direction (dir: Vec3) {
        Vec3.normalize(this._dir, dir);
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setDirection(dir);
        }
    }

    get direction (): Vec3 {
        return this._dir;
    }

    // in Lux(lx)
    get illuminance (): number {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._illuminanceHDR;
        } else {
            return this._illuminanceLDR;
        }
    }
    set illuminance (value: number) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this.illuminanceHDR = value;
        } else {
            this.illuminanceLDR = value;
        }
    }

    get illuminanceHDR () {
        return this._illuminanceHDR;
    }
    set illuminanceHDR (value: number) {
        this._illuminanceHDR = value;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setIlluminanceHDR(value);
        }
    }

    get illuminanceLDR () {
        return this._illuminanceLDR;
    }
    set illuminanceLDR (value: number) {
        this._illuminanceLDR = value;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setIlluminanceLDR(value);
        }
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
            (this._nativeObj as NativeDirectionalLight).setShadowEnabled(val);
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
            (this._nativeObj as NativeDirectionalLight).setShadowPcf(val);
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
            (this._nativeObj as NativeDirectionalLight).setShadowBias(val);
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
            (this._nativeObj as NativeDirectionalLight).setShadowNormalBias(val);
        }
    }

    /**
      * @en Shadow color saturation
      * @zh 阴影颜色饱和度
      */
    get shadowSaturation () {
        return this._shadowSaturation;
    }
    set shadowSaturation (val: number) {
        this._shadowSaturation = val;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowSaturation(this._shadowSaturation);
        }
    }

    /**
      * @en get or set shadow camera far
      * @zh 获取或者设置潜在阴影产生的范围
      */
    get shadowDistance () {
        return this._shadowDistance;
    }
    set shadowDistance (val) {
        this._shadowDistance = Math.min(val, Shadows.MAX_FAR);
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowDistance(val);
        }
    }

    /**
      * @en get or set shadow camera far
      * @zh 获取或者设置潜在阴影产生的范围
     */
    get shadowInvisibleOcclusionRange () {
        return this._shadowInvisibleOcclusionRange;
    }
    set shadowInvisibleOcclusionRange (val) {
        this._shadowInvisibleOcclusionRange = Math.min(val, Shadows.MAX_FAR);
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowInvisibleOcclusionRange(val);
        }
    }

    /**
      * @en get or set shadow CSM weighted average coefficient
      * @zh 获取或者设置级联阴影的加权平均系数
     */
    get shadowCSMLambda () {
        return this._shadowCSMLambda;
    }
    set shadowCSMLambda (val) {
        this._shadowCSMLambda = val;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowCSMLevel(val);
        }
    }

    /**
      * @en get or set shadow CSM level
      * @zh 获取或者设置级联阴影层数
     */
    get shadowCSMLevel () {
        return this._shadowCSMLevel;
    }
    set shadowCSMLevel (val) {
        this._shadowCSMLevel = val;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowCSMLambda(val);
        }
    }

    /**
      * @en get or set shadow CSM level
      * @zh 获取或者设置级联阴影层数
     */
    get shadowFrustumItem () {
        return this._shadowFrustumItem;
    }
    set shadowFrustumItem (val) {
        this._shadowFrustumItem = val;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowFrustumItem(
                this._shadowFrustumItem[0],
                this._shadowFrustumItem[1],
                this._shadowFrustumItem[2],
                this._shadowFrustumItem[3],
            );
        }
    }

    /**
      * @en get or set fixed area shadow
      * @zh 是否是固定区域阴影
      */
    get fixedArea () {
        return this._shadowFixedArea;
    }
    set fixedArea (val) {
        this._shadowFixedArea = val;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowFixedArea(val);
        }
    }

    /**
      * @en get or set shadow camera near
      * @zh 获取或者设置阴影相机近裁剪面
      */
    get fixedNear () {
        return this._shadowNear;
    }
    set fixedNear (val) {
        this._shadowNear = val;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowNear(val);
        }
    }

    /**
      * @en get or set shadow camera far
      * @zh 获取或者设置阴影相机远裁剪面
      */
    get fixedFar () {
        return this._shadowFar;
    }
    set fixedFar (val) {
        this._shadowFar = Math.min(val, Shadows.MAX_FAR);
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowFar(val);
        }
    }

    /**
      * @en get or set shadow camera orthoSize
      * @zh 获取或者设置阴影相机正交大小
      */
    get fixedOrthoSize () {
        return this._shadowOrthoSize;
    }
    set fixedOrthoSize (val) {
        this._shadowOrthoSize = val;
        if (JSB) {
            (this._nativeObj as NativeDirectionalLight).setShadowOrthoSize(val);
        }
    }

    constructor () {
        super();
        this._type = LightType.DIRECTIONAL;
    }

    public initialize () {
        super.initialize();

        this.illuminance = Ambient.SUN_ILLUM;
        this.direction = new Vec3(1.0, -1.0, -1.0);
    }

    public update () {
        if (this._node && this._node.hasChangedFlags) {
            this.direction = Vec3.transformQuat(_v3, _forward, this._node.worldRotation);
        }
    }
}
