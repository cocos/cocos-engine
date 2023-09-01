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

import { Line } from './line';
import { Plane } from './plane';
import { Ray } from './ray';
import { Triangle } from './triangle';
import { Sphere } from './sphere';
import { AABB } from './aabb';
import { Capsule } from './capsule';
import { Frustum } from './frustum';
import { assert } from '../platform/debug';

/**
 * cache jsb attributes in js, reduce cross language invokations.
 */
function cacheProperty (ctor: Constructor, property: string): void {
    const propDesc = Object.getOwnPropertyDescriptor(ctor.prototype, property);
    const propCacheKey = `_$cache_${property}`;
    const propRealKey = `_$_${property}`;
    Object.defineProperty(ctor.prototype, propRealKey, propDesc!);
    Object.defineProperty(ctor.prototype, property, {
        get () {
            if (this[propCacheKey] === undefined) {
                this[propCacheKey] = this[propRealKey];
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this[propCacheKey];
        },
        set (value) {
            // this[propCacheKey] = value;
            this[propRealKey] = value;
        },
        configurable: true,
        enumerable: true,
    });
}

/**
 * cache native object's `underlyingData()` result in __data
 */
function cacheUnderlyingData (ctor: Constructor): void {
    // eslint-disable-next-line func-names
    ctor.prototype._arraybuffer = function (): ArrayBuffer {
        if (!this.__data) {
            this.__data = this.underlyingData();
        }
        return this.__data as ArrayBuffer;
    };
}

/**
 * linear layout info of JSB attributes
 *   stored at static field `__nativeFields__`
 * see: `DESC_UNDERLINE_DATA_*` in file jsb_geometry_manual.cpp
 */
interface FieldDesc {
    fieldName: string;
    fieldOffset: number; // offsetof(JSBTYPE, field)
    fieldSize: number;  // sizeof(jsbinstance.field)
}

/**
 * define accessor for attr, read/write directly to the underlyingData as Float32Array[1]
 */
const defineAttrFloat = (kls: Constructor, attr: string): void => {
    // __nativeFields__ is defined in jsb_geometry_manual.cpp
    const desc: FieldDesc = (kls as any).__nativeFields__[attr];
    const cacheKey = `_$_${attr}`;

    assert(desc.fieldSize === 4, `field ${attr} size ${desc.fieldSize}`);

    Object.defineProperty(kls.prototype, desc.fieldName, {
        configurable: true,
        enumerable: true,
        get () {
            if (this[cacheKey] === undefined) {
                this[cacheKey] = new Float32Array(this._arraybuffer(), desc.fieldOffset, 1);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this[cacheKey][0];
        },
        set (v: number) {
            if (this[cacheKey] === undefined) {
                this[cacheKey] = new Float32Array(this._arraybuffer(), desc.fieldOffset, 1);
            }
            this[cacheKey][0] = v;
        },
    });
};

/**
 *  define accessor for attr, read/write directly to the underlyingData as Int32Array[1]
 */
const defineAttrInt = (kls: Constructor, attr: string): void => {
    // __nativeFields__ is defined in jsb_geometry_manual.cpp
    const desc: FieldDesc = (kls as any).__nativeFields__[attr];
    if (!desc) {
        console.error(`attr ${attr} not defined in class ${kls.toString()}`);
    }
    const cacheKey = `_$_${attr}`;

    assert(desc.fieldSize === 4, `field ${attr} size ${desc.fieldSize}`);

    Object.defineProperty(kls.prototype, desc.fieldName, {
        configurable: true,
        enumerable: true,
        get () {
            if (this[cacheKey] === undefined) {
                this[cacheKey] = new Int32Array(this._arraybuffer(), desc.fieldOffset, 1);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this[cacheKey][0];
        },
        set (v: number) {
            if (this[cacheKey] === undefined) {
                this[cacheKey] = new Int32Array(this._arraybuffer(), desc.fieldOffset, 1);
            }
            this[cacheKey][0] = v;
        },
    });
};

if (NATIVE) {
    // Line
    cacheProperty(ns.Line, 's');
    cacheProperty(ns.Line, 'e');
    Object.setPrototypeOf(ns.Line.prototype, Line.prototype);

    // Plane
    cacheUnderlyingData(ns.Plane);
    cacheProperty(ns.Plane, 'n');
    defineAttrFloat(ns.Plane, 'd');
    Object.setPrototypeOf(ns.Plane.prototype, Plane.prototype);

    // Ray
    cacheUnderlyingData(ns.Ray);
    cacheProperty(ns.Ray, 'o');
    cacheProperty(ns.Ray, 'd');
    Object.setPrototypeOf(ns.Ray.prototype, Ray.prototype);

    // Triangle
    cacheUnderlyingData(ns.Triangle);
    cacheProperty(ns.Triangle, 'a');
    cacheProperty(ns.Triangle, 'b');
    cacheProperty(ns.Triangle, 'c');
    Object.setPrototypeOf(ns.Triangle.prototype, Triangle.prototype);

    // Sphere
    cacheUnderlyingData(ns.Sphere);
    cacheProperty(ns.Sphere, '_center');
    defineAttrFloat(ns.Sphere, '_radius');
    Object.setPrototypeOf(ns.Sphere.prototype, Sphere.prototype);

    // AABB
    cacheUnderlyingData(ns.AABB);
    cacheProperty(ns.AABB, 'center');
    cacheProperty(ns.AABB, 'halfExtents');
    Object.setPrototypeOf(ns.AABB.prototype, AABB.prototype);

    // Capsule
    cacheUnderlyingData(ns.Capsule);
    defineAttrFloat(ns.Capsule, 'radius');
    defineAttrFloat(ns.Capsule, 'halfHeight');
    defineAttrInt(ns.Capsule, 'axis');
    cacheProperty(ns.Capsule, 'center');
    cacheProperty(ns.Capsule, 'rotation');
    cacheProperty(ns.Capsule, 'ellipseCenter0');
    cacheProperty(ns.Capsule, 'ellipseCenter1');
    Object.setPrototypeOf(ns.Capsule.prototype, Capsule.prototype);

    // Frustum
    // cacheUnderlyingData(ns.Frustum); // no needed
    cacheProperty(ns.Frustum, 'vertices');
    cacheProperty(ns.Frustum, 'planes');
    Object.setPrototypeOf(ns.Frustum.prototype, Frustum.prototype);

    // fix `_type`
    const descOf_type = Object.getOwnPropertyDescriptor((ns as any).ShapeBase.prototype, '_type');
    for (const kls of [ns.Line, ns.Plane, ns.Ray, ns.Triangle, ns.Sphere, ns.AABB, ns.Capsule, ns.Frustum]) {
        Object.defineProperty(kls.prototype, '_type', descOf_type!);
    }
}
