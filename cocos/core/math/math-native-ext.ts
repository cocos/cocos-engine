/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.
 http://www.cocos.com
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

import { NATIVE } from 'internal:constants';
import { Mat4 } from './mat4';
import { Mat3 } from './mat3';
import { Vec3 } from './vec3';
import { Vec2 } from './vec2';
import { Vec4 } from './vec4';
import { Quat } from './quat';
import { Color } from './color';

const defineAttr = (proto, name, offset): void => {
    Object.defineProperty(proto, name, {
        configurable: true,
        enumerable: true,
        get (): any {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this._data()[offset];
        },
        set (v: number): void {
            this._data()[offset] = v;
        },
    });
};

export enum MathType {
    VEC2 = 0,
    VEC3,
    VEC4,
    QUATERNION,
    MAT3,
    MAT4,
    SIZE,
    RECT,
    COLOR,
}

function extendType (proto: any, parentProto: any, typ: MathType): void {
    proto._data = function (): Float32Array {
        if (!this.__data) {
            this.__data = new Float32Array(this.underlyingData());
        }
        return this.__data as Float32Array;
    };
    Object.setPrototypeOf(proto, parentProto);
    Object.defineProperty(proto, 'type', { configurable: true, enumerable: true, writable: false, value: typ });
}

function inheritCCClass (ctor: Constructor, parentCtor: Constructor): void {
    for (const attrName of ['__cid__', '__classname__']) {
        Object.defineProperty(ctor.prototype, attrName, {
            value: parentCtor.prototype[attrName],
            writable: false,
            enumerable: false,
            configurable: true,
        });
    }
    for (const staticKey of ['__attrs__', '__props__', '__values__']) {
        ctor[staticKey] = parentCtor[staticKey];
    }
}

if (NATIVE) {
    extendType(jsb.Mat4.prototype, Mat4.prototype, MathType.MAT4);

    for (let i = 0; i < 16; i++) {
        const numb = `0${i}`;
        defineAttr(jsb.Mat4.prototype, `m${numb.substring(numb.length - 2)}`, i);
    }

    for (let i = 0; i < 9; i++) {
        const numb = `0${i}`;
        defineAttr(jsb.Mat3.prototype, `m${numb.substring(numb.length - 2)}`, i);
    }
    extendType(jsb.Mat3.prototype, Mat3.prototype, MathType.MAT3);

    defineAttr(jsb.Vec2.prototype, 'x', 0);
    defineAttr(jsb.Vec2.prototype, 'y', 1);
    extendType(jsb.Vec2.prototype, Vec2.prototype, MathType.VEC2);

    defineAttr(jsb.Vec3.prototype, 'x', 0);
    defineAttr(jsb.Vec3.prototype, 'y', 1);
    defineAttr(jsb.Vec3.prototype, 'z', 2);

    extendType(jsb.Vec3.prototype, Vec3.prototype, MathType.VEC3);

    defineAttr(jsb.Vec4.prototype, 'x', 0);
    defineAttr(jsb.Vec4.prototype, 'y', 1);
    defineAttr(jsb.Vec4.prototype, 'z', 2);
    defineAttr(jsb.Vec4.prototype, 'w', 3);

    extendType(jsb.Vec4.prototype, Vec4.prototype, MathType.VEC4);

    defineAttr(jsb.Quat.prototype, 'x', 0);
    defineAttr(jsb.Quat.prototype, 'y', 1);
    defineAttr(jsb.Quat.prototype, 'z', 2);
    defineAttr(jsb.Quat.prototype, 'w', 3);

    extendType(jsb.Quat.prototype, Quat.prototype, MathType.QUATERNION);

    Object.setPrototypeOf(jsb.Color.prototype, Color.prototype);
    Object.defineProperty(jsb.Color.prototype, 'type', { configurable: true, enumerable: true, writable: false, value: MathType.COLOR });

    inheritCCClass(jsb.Vec4, Vec4);
    inheritCCClass(jsb.Vec3, Vec3);
    inheritCCClass(jsb.Vec2, Vec2);
    inheritCCClass(jsb.Mat4, Mat4);
    inheritCCClass(jsb.Mat3, Mat3);
    inheritCCClass(jsb.Color, Color);
    inheritCCClass(jsb.Quat, Quat);
}
