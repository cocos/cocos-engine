/****************************************************************************
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
 ****************************************************************************/

import * as js from '../utils/js';

/**
 * !#en The base class of all value types.
 * !#zh 所有值类型的基类。
 * @class ValueType
 *
 */
export class ValueType {
    /**
     * !#en This method returns an exact copy of current value.
     * !#zh 克隆当前值，该方法返回一个新对象，新对象的值和原对象相等。
     * @method clone
     */
    public clone (): this {
        cc.errorID('0100', js.getClassName(this) + '.clone');
        return this;
    }

    /**
     * !#en Compares this object with the other one.
     * !#zh 当前对象是否等于指定对象。
     * @param other
     */
    public equals (other: this) {
        cc.errorID('0100', js.getClassName(this) + '.equals');
        return false;
    }

    /**
     * !#en
     * Linearly interpolates between this value to to value by ratio which is in the range [0, 1].
     * When ratio = 0 returns this. When ratio = 1 return to. When ratio = 0.5 returns the average of this and to.
     * !#zh
     * 线性插值。<br/>
     * 当 ratio = 0 时返回自身，ratio = 1 时返回目标，ratio = 0.5 返回自身和目标的平均值。。
     * @param to - the to value
     * @param ratio - the interpolation coefficient
     * @returns
     */
    public lerp (to: this, ratio: this) {
        cc.errorID('0100', js.getClassName(this) + '.lerp');
        return this.clone();
    }

    /**
     * !#en
     * Copys all the properties from another given object to this value.
     * !#zh
     * 从其它对象把所有属性复制到当前对象。
     * @param source - the source to copy
     */
    public set (source: this) {
        cc.errorID('0100', js.getClassName(this) + '.set');
    }

    /**
     * !#en TODO
     * !#zh 转换为方便阅读的字符串。
     */
    public toString () {
        return '' + {};
    }
}
js.setClassName('cc.ValueType', ValueType);

cc.ValueType = ValueType;
