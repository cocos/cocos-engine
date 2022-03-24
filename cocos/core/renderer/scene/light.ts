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
import { Vec3 } from '../../math';
import { TransformBit } from '../../scene-graph/node-enum';
import { RenderScene } from './render-scene';
import { Node } from '../../scene-graph';
import { NativeDirectionalLight, NativeLight, NativeSphereLight, NativeSpotLight } from './native-scene';

// Color temperature (in Kelvin) to RGB
export function ColorTemperatureToRGB (rgb: Vec3, kelvin: number) {
    if (kelvin < 1000.0) {
        kelvin = 1000.0;
    } else if (kelvin > 15000.0) {
        kelvin = 15000.0;
    }

    // Approximate Planckian locus in CIE 1960 UCS
    const kSqr = kelvin * kelvin;
    const u = (0.860117757 + 1.54118254e-4 * kelvin + 1.28641212e-7 * kSqr) / (1.0 + 8.42420235e-4 * kelvin + 7.08145163e-7 * kSqr);
    const v = (0.317398726 + 4.22806245e-5 * kelvin + 4.20481691e-8 * kSqr) / (1.0 - 2.89741816e-5 * kelvin + 1.61456053e-7 * kSqr);

    const d = (2.0 * u - 8.0 * v + 4.0);
    const x = (3.0 * u) / d;
    const y = (2.0 * v) / d;
    const z = (1.0 - x) - y;

    const X = (1.0 / y) * x;
    const Z = (1.0 / y) * z;

    // XYZ to RGB with BT.709 primaries
    rgb.x =  3.2404542 * X + -1.5371385 + -0.4985314 * Z;
    rgb.y = -0.9692660 * X +  1.8760108 +  0.0415560 * Z;
    rgb.z =  0.0556434 * X + -0.2040259 +  1.0572252 * Z;
}

export enum LightType {
    DIRECTIONAL,
    SPHERE,
    SPOT,
    UNKNOWN,
}

export const nt2lm = (size: number) => 4 * Math.PI * Math.PI * size * size;

export class Light {
    protected declare _nativeObj: NativeLight | null;
    protected _init (): void {
        if (JSB) {
            switch (this._type) {
            case LightType.DIRECTIONAL:
                this._nativeObj = new NativeDirectionalLight();
                break;
            case LightType.SPHERE:
                this._nativeObj = new NativeSphereLight();
                break;
            case LightType.SPOT:
                this._nativeObj = new NativeSpotLight();
                break;
            default:
                break;
            }
            this._nativeObj!.setType(this._type);
        }
    }
    protected _destroy (): void {
        if (JSB) {
            this._nativeObj = null;
        }
    }

    get baked () {
        return this._baked;
    }

    set baked (val) {
        this._baked = val;
        if (JSB) {
            this._nativeObj!.setBaked(val);
        }
    }

    set color (color: Vec3) {
        this._color.set(color);
        if (JSB) {
            this._nativeObj!.setColor(color);
        }
    }

    get color (): Vec3 {
        return this._color;
    }

    set useColorTemperature (enable: boolean) {
        this._useColorTemperature = enable;
        if (JSB) {
            this._nativeObj!.setUseColorTemperature(enable);
        }
    }

    get useColorTemperature (): boolean {
        return this._useColorTemperature;
    }

    set colorTemperature (val: number) {
        this._colorTemp = val;
        ColorTemperatureToRGB(this._colorTempRGB, this._colorTemp);
        if (JSB) {
            this._nativeObj!.setColorTemperatureRGB(this._colorTempRGB);
        }
    }

    get colorTemperature (): number {
        return this._colorTemp;
    }

    get colorTemperatureRGB (): Vec3 {
        return this._colorTempRGB;
    }

    set node (n) {
        this._node = n;
        if (this._node) {
            this._node.hasChangedFlags |= TransformBit.ROTATION;
            if (JSB) {
                this._nativeObj!.setNode(n ? n.native : null);
            }
        }
    }

    get node () {
        return this._node;
    }

    get type () : LightType {
        return this._type;
    }

    get name () {
        return this._name;
    }

    set name (n) {
        this._name = n;
    }

    get scene () {
        return this._scene;
    }

    get native (): NativeLight {
        return this._nativeObj!;
    }

    protected _baked = false;

    protected _color: Vec3 = new Vec3(1, 1, 1);

    protected _colorTemp = 6550.0;

    protected _colorTempRGB: Vec3 = new Vec3(1, 1, 1);

    protected _scene: RenderScene | null = null;

    protected _node: Node | null = null;

    protected _name: string | null = null;

    protected _useColorTemperature = false;

    protected _type: LightType = LightType.UNKNOWN;

    public initialize () {
        this._init();
        this.color = new Vec3(1, 1, 1);
        this.colorTemperature = 6550.0;
    }

    public attachToScene (scene: RenderScene) {
        this._scene = scene;
    }

    public detachFromScene () {
        this._scene = null;
    }

    public destroy () {
        this._name = null;
        this._node = null;
        this._destroy();
    }

    public update () {}
}
