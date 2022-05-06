/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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



import { errorID } from '../platform/debug';
import * as js from '../utils/js';
import { legacyCC } from '../global-exports';

/**
 * @en The base class of all value types.
 * @zh 所有值类型的基类。
 */
export class ValueType {
    /**
     * @en
     * Clone the current object. The clone result of the object should be equal to the current object, i.e. satisfy `this.equals(this, value.clone())`.
     * The base version of this method do nothing and returns `this'.
     * The derived class **must** rewrite this method and the returned object should not be `this`, i.e. satisfy `this !== this.clone()`.
     * @zh
     * 克隆当前值。克隆的结果值应与当前值相等，即满足 `this.equals(this, value.clone())`。
     * 本方法的基类版本简单地返回 `this`；
     * 派生类**必须**重写本方法，并且返回的对象不应当为 `this`，即满足 `this !== this.clone()`。
     * @returns The cloned object
     */
    public clone (): ValueType {
        errorID(100, `${js.getClassName(this)}.clone`);
        return this;
    }

    /**
     * @en
     * Check whether the current object is equal to the specified object.
     * This check should be interchangeable, i.e. satisfy `this.equals(other) === other.equals(this)`.
     * The base version of this method will returns `false'.
     * @zh
     * 判断当前值是否与指定值相等。此判断应当具有交换性，即满足 `this.equals(other) === other.equals(this)`。
     * 本方法的基类版本简单地返回 `false`。
     * @param other The other object
     * @returns `true` if equal, otherwise returns `false`
     */
    public equals (other: this) {
        // errorID(100, js.getClassName(this) + '.equals');
        return false;
    }

    /**
     * @en
     * Set the property values of the current object with the given object.
     * The base version of this method will returns `this' and the derived class **must** rewrite this method.
     * @zh
     * 赋值当前值使其与指定值相等。
     * 本方法的基类版本简单地返回 `this`，派生类**必须**重写本方法。
     * @param other The other object
     */
    public set (other: this) {
        errorID(100, `${js.getClassName(this)}.set`);
    }

    /**
     * @en
     * Convert the current object to a string.
     * The base version of this method will returns an empty string.
     * @zh
     * 返回当前值的字符串表示。
     * 本方法的基类版本返回空字符串。
     * @returns The string representation of the current object
     */
    public toString () {
        return `${{}}`;
    }
}
js.setClassName('cc.ValueType', ValueType);

legacyCC.ValueType = ValueType;
