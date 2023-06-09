/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
import { MacroRecord, MaterialProperty } from "./pass-utils";
import { EffectAsset } from '../../asset/assets/effect-asset';
import type { Pass as JsbPass } from './pass';
import { Mat3, Mat4, Quat, Vec2, Vec3, Vec4 } from '../../core';
import { MathType } from '../../core/math/math-native-ext';

declare const jsb: any;

export interface IPassInfoFull extends EffectAsset.IPassStates {
    // generated part
    passIndex: number;
    defines: MacroRecord;
    stateOverrides?: PassOverrides;
}
export type PassOverrides = RecursivePartial<EffectAsset.IPassStates>;

export interface IMacroPatch {
    name: string;
    value: boolean | number | string;
}

export enum BatchingSchemes {
    NONE = 0,
    INSTANCING = 1,
}

export const Pass: typeof JsbPass = jsb.Pass;
export type Pass = JsbPass;

const proto = Pass.prototype;

proto.getUniform = function getUniform<T extends MaterialProperty>(handle: number, out: T): T {
    const val = (this as any)._getUniform(handle);
    
    if (typeof val === 'object') {
        if (val.type) {
            switch (val.type) {
                case MathType.VEC2:
                    Vec2.copy(out, val);
                    break;
                case MathType.VEC3:
                    Vec3.copy(out as Vec3, val);
                    break;
                case MathType.VEC4:
                    Vec4.copy(out, val);
                    break;
                case MathType.COLOR:
                    (out as any).x = val.x;
                    (out as any).y = val.y;
                    (out as any).z = val.z;
                    (out as any).w = val.w;
                    break;
                case MathType.MAT3:
                    Mat3.copy(out, val);
                    break;
                case MathType.MAT4:
                    Mat4.copy(out, val);
                    break;
                case MathType.QUATERNION:
                    Quat.copy(out as Quat, val);
                    break;
                default:
                    console.error(`getUniform, unknown object type: ${val.type}`);
                    break;
            }
        } else {
            console.error(`getUniform, unknown object: ${val}`);
        }
    } else if (typeof val === 'number') {
        (out as number) = val;
    } else {
        console.error(`getUniform, not supported: ${val}`);
    }

    return out;
}