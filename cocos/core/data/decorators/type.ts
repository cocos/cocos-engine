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

import { LegacyPropertyDecorator } from './utils';
import { property } from './property';
import { CCString, CCInteger, CCFloat, CCBoolean, PrimitiveType } from '../utils/attribute';

/**
 * @en Declare the property as integer
 * @zh 将该属性标记为整数。
 */
export const integer = type(CCInteger);

/**
 * @en Declare the property as float
 * @zh 将该属性标记为浮点数。
 */
export const float = type(CCFloat);

/**
 * @en Declare the property as boolean
 * @zh 将该属性标记为布尔值。
 */
export const boolean = type(CCBoolean);

/**
 * @en Declare the property as string
 * @zh 将该属性标记为字符串。
 */
export const string = type(CCString);

/**
 * @en Declare the property as the given type
 * @zh 标记该属性的类型。
 * @param type
 */
export function type (type: Function | [Function] | any): PropertyDecorator;

export function type<T> (type: PrimitiveType<T> | [PrimitiveType<T>]): PropertyDecorator;

export function type<T> (type: PrimitiveType<T> | Function | [PrimitiveType<T>] | [Function]): LegacyPropertyDecorator {
    return property({
        type,
    });
}
