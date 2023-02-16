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

import { IExposedAttributes } from './utils/attribute-defines';

/**
 * Class slash stores information collected from decorators.
 * Once the class decorator entered, the class definition begins. It processes the stash and removes it.
 */
export interface ClassStash {
    /**
     * When extracting default values under the TypeScript environment,
     * We have to construct an object of the current class and get its member values.
     * This field stores the create-once object.
     */
    default?: unknown;

    /**
     * Just a kind of organization.
     */
    proto?: {
        /**
         * The property stashes.
         */
        properties?: Record<PropertyKey, PropertyStash>;
    };

    /**
     * The error properties.
     * We record them here to ensure only once an error report is given to each property.
     */
    errorProps?: Record<PropertyKey, true>;
}

export interface PropertyStash extends IExposedAttributes {
    /**
     * The property's default value.
     */
    default?: unknown;

    /**
     * The property's getter, if it's an accessor.
     */
    get?: () => unknown;

    /**
     * The property's setter, if it's an accessor.
     */
    set?: (value: unknown) => void;

    /**
     * Reserved for deprecated usage.
     */
    _short?: unknown;

    /**
     * Some decorators may write this internal slot. See `PropertyStashInternalFlag`.
     */
    __internalFlags: number;
}

export enum PropertyStashInternalFlag {
    /**
     * Indicates this property is reflected using "standalone property decorators" such as
     * `@editable`, `@visible`, `serializable`.
     * All standalone property decorators would set this flag;
     * non-standalone property decorators won't set this flag.
     */
    STANDALONE = 1 << 0,

    /**
     * Indicates this property is visible, if no other explicit visibility decorators(`@visible`s) are attached.
     */
    IMPLICIT_VISIBLE = 1 << 1,

    /**
     * Indicates this property is serializable, if no other explicit visibility decorators(`@serializable`s) are attached.
     */
    IMPLICIT_SERIALIZABLE = 1 << 2,
}
