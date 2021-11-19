/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @hidden
 */

import { AttributeName, Format, FormatInfos, Attribute } from '../../core/gfx';
import { legacyCC } from '../../core/global-exports';

export const vfmt = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
];

export const vfmtPosColor = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),
];

export const vfmtPosUvColor = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),
];

export const vfmtPosUvTwoColor = [
    new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
    new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F),
    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),
    new Attribute(AttributeName.ATTR_COLOR2, Format.RGBA8, true),
];

export function getByteLengthPerVertex (attrs: Attribute[]) {
    let size = 0;
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        const info = FormatInfos[attr.format];
        size += info.size;
    }

    return size;
}

export function getAttributeStride (attrs: Attribute[]) {
    let count = 0;
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        const info = FormatInfos[attr.format];
        count += info.size;
    }

    return count;
}

export function getAttributeFloatCount (attrs: Attribute[] = vfmtPosUvColor) {
    let count = 0;
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        const info = FormatInfos[attr.format];
        const floatCount = info.size / 4;
        count += floatCount;
    }

    return count;
}

legacyCC.internal.vfmtPosUvColor = vfmtPosUvColor;
legacyCC.internal.vfmtPosUvTwoColor = vfmtPosUvTwoColor;
