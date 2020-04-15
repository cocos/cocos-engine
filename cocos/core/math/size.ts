/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
 * @category core/math
 */

import CCClass from '../data/class';
import { ValueType } from '../value-types/value-type';
import { ISizeLike } from './type-define';

/**
 * @en Two dimensional size type representing the width and height.
 * @zh 二维尺寸。
 */
export class Size extends ValueType {

    public static ZERO = Object.freeze(new Size(0, 0));
    public static ONE = Object.freeze(new Size(1, 1));

    /**
     * @en Calculate the interpolation result between this size and another one with given ratio
     * @zh 根据指定的插值比率，从当前尺寸到目标尺寸之间做插值。
     * @param out 本方法将插值结果赋值给此参数
     * @param from 起始尺寸。
     * @param to 目标尺寸。
     * @param ratio 插值比率，范围为 [0,1]。
     * @returns 当前尺寸的宽和高到目标尺寸的宽和高分别按指定插值比率进行线性插值构成的向量。
     */
    public static lerp <Out extends ISizeLike> (out: Out, from: Out, to: Out, ratio: number) {
        out.width = from.width + (to.width - from.width) * ratio;
        out.height = from.height + (to.height - from.height) * ratio;
        return out;
    }

    // compatibility with vector interfaces
    set x (val) { this.width = val; }
    get x () { return this.width; }
    set y (val) { this.height = val; }
    get y () { return this.height; }

    public declare width: number;

    public declare height: number;

    /**
     * @en Constructor a size from another one.
     * @zh 构造与指定尺寸相等的尺寸。
     * @param other 相比较的尺寸。
     */
    constructor (other: Size);

    /**
     * @en Constructor a size with specified values.
     * @zh 构造具有指定宽度和高度的尺寸。
     * @param [width=0] 指定的宽度。
     * @param [height=0] 指定的高度。
     */
    constructor (width?: number, height?: number);

    constructor (width?: Size | number, height?: number) {
        super();
        if (width && typeof width === 'object') {
            this.height = width.height;
            this.width = width.width;
        } else {
            this.width = width || 0;
            this.height = height || 0;
        }
    }

    /**
     * @en clone the current `Size`.
     * @zh 克隆当前尺寸。
     */
    public clone () {
        return new Size(this.width, this.height);
    }

    /**
     * @en Set values with another `Size`.
     * @zh 设置当前尺寸使其与指定的尺寸相等。
     * @param other 相比较的尺寸。
     * @returns `this`
     */
    public set (other: Size);

    /**
     * @en Set the value of each component of the current `Size`.
     * @zh 设置当前尺寸的具体参数。
     * @param width 要设置的 width 值
     * @param height 要设置的 height 值
     * @returns `this`
     */
    public set (width?: number, height?: number);

    public set (width?: Size | number, height?: number) {
        if (width && typeof width === 'object') {
            this.height = width.height;
            this.width = width.width;
        } else {
            this.width = width || 0;
            this.height = height || 0;
        }
        return this;
    }

    /**
     * @en Check whether the current `Size` equals another one.
     * @zh 判断当前尺寸是否与指定尺寸的相等。
     * @param other 相比较的尺寸。
     * @returns 两尺寸的宽和高都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Size) {
        return this.width === other.width &&
            this.height === other.height;
    }

    /**
     * @en Calculate the interpolation result between this size and another one with given ratio
     * @zh 根据指定的插值比率，从当前尺寸到目标尺寸之间做插值。
     * @param to 目标尺寸。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Size, ratio: number) {
        this.width = this.width + (to.width - this.width) * ratio;
        this.height = this.height + (to.height - this.height) * ratio;
        return this;
    }

    /**
     * @en Output size informations to string
     * @zh 返回当前尺寸的字符串表示。
     * @returns 当前尺寸的字符串表示。
     */
    public toString () {
        return `(${this.width.toFixed(2)}, ${this.height.toFixed(2)})`;
    }
}

CCClass.fastDefine('cc.Size', Size, { width: 0, height: 0 });

/**
 * @en Constructs a `Size` object.
 * @zh 等价于 `new Size(other)`。
 * @param other 相比较的尺寸。
 * @returns `new Size(other)`
 */
export function size (other: Size): Size;

/**
 * @en Constructs a `Size` object.
 * @zh 等价于 `new Size(x, y)`。
 * @param [x=0] 指定的宽度。
 * @param [y=0] 指定的高度。
 * @returns `new Size(x, y)`
 */
export function size (width?: number, height?: number): Size;

export function size (width: Size | number = 0, height: number = 0) {
    return new Size(width as any, height);
}

cc.size = size;

cc.Size = Size;
