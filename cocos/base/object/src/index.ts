/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import *  as RF from './utils/requiring-frame';

export { CCObject } from './object';
export { editorExtrasTag } from './editor-extras-tag';
export type { EditorExtendableObject } from './editor-extras-tag';
export { CCClass, isCCClassOrFastDefined } from './class';
export { BitMask, Enum, ccenum, ValueType } from './value-types';
export { DELIMETER, createAttrsSingle, createAttrs, attr, getClassAttrs, setClassAttr, PrimitiveType, CCInteger, CCFloat, CCBoolean, CCString } from './utils/attribute';
export type { IExposedAttributes, IAcceptableAttributes } from './utils/attribute-defines';
export { getFullFormOfProperty, doValidateMethodWithProps_DEV } from './utils/preprocess-class';
export { RF };
export { PropertyStashInternalFlag } from './class-stash';
export type { ClassStash, PropertyStash } from './class-stash';
export { setPropertyEnumType, setPropertyEnumTypeOnAttrs } from './utils/attribute-internal';
export { isCCObject, isValid } from './object';
