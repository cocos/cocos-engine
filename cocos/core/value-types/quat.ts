/*
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
 * @category core/value-types
 */

import CCClass from '../data/class';
import { quat as xquat } from '../vmath/quat';
import { ValueType } from './value-type';
import Vec3 from './vec3';

/**
 * 四元数。
 */
export default class Quat extends ValueType {

    /**
     * 根据指定的插值比率，从当前四元数到目标四元数之间做插值。
     * @param from 起始四元数。
     * @param to 目标四元数。
     * @param ratio 插值比率，范围为 [0,1]。
     * @param out 当此参数定义时，本方法将插值结果赋值给此参数并返回此参数。
     */
    public static lerp (out: Quat, from: Quat, to: Quat, ratio: number) {
        xquat.slerp(out, from, to, ratio);
    }

    /**
     * x 分量。
     */
    public x: number;

    /**
     * y 分量。
     */
    public y: number;

    /**
     * z 分量。
     */
    public z: number;

    /**
     * w 分量。
     */
    public w: number;

    /**
     * 构造与指定四元数相等的四元数。
     * @param other 相比较的四元数。
     */
    constructor (other: Quat);

    /**
     * 构造具有指定分量的四元数。
     * @param [x=0] 指定的 x 分量。
     * @param [y=0] 指定的 y 分量。
     * @param [z=0] 指定的 z 分量。
     * @param [w=1] 指定的 w 分量。
     */
    constructor (x?: number, y?: number, z?: number, w?: number);

    constructor (x?: number | Quat, y?: number, z?: number, w?: number) {
        super();
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;
        }
    }

    /**
     * 克隆当前四元数。
     */
    public clone () {
        return new Quat(this.x, this.y, this.z, this.w);
    }

    /**
     * 设置当前四元数使其与指定四元数相等。
     * @param other 相比较的四元数。
     * @returns `this`
     */
    public set (other: Quat) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    }

    /**
     * 判断当前四元数是否与指定四元数相等。
     * @param other 相比较的四元数。
     * @returns 两四元数的各分量都相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Quat) {
        return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    /**
     * 将当前四元数转化为欧拉角（x-y-z）并赋值给出口向量。
     * @param out [out] 出口向量，当未指定时将创建为新的向量。
     */
    public getEulerAngles (out: Vec3) {
        xquat.toEuler(out, this);
    }

    /**
     * 根据指定的插值比率，从当前四元数到目标四元数之间做插值。
     * @param out 出口四元数
     * @param to 目标四元数。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (out: Quat, to: Quat, ratio: number) {
        xquat.slerp(out, this, to, ratio);
    }
}

CCClass.fastDefine('cc.Quat', Quat, { x: 0, y: 0, z: 0, w: 1 });

/**
 * 构造与指定四元数相等的四元数。等价于 `new Quat(other)`。
 * @param other 相比较的四元数。
 * @returns `new Quat(other)`
 */
export function quat (other: Quat): Quat;

/**
 * 构造具有指定分量的四元数。等价于 `new Quat(x, y, z, w)`。
 * @param [x=0] 指定的 x 分量。
 * @param [y=0] 指定的 y 分量。
 * @param [z=0] 指定的 z 分量。
 * @param [w=0] 指定的 w 分量。
 * @returns `new Quat(x, y, z)`
 */
export function quat (x?: number, y?: number, z?: number, w?: number): Quat;

export function quat (x: number | Quat = 0, y: number = 0, z: number = 0, w: number = 1) {
    return new Quat(x as any, y, z, w);
}

cc.quat = quat;

cc.Quat = Quat;
