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

import cylinder, { ICylinderOptions } from './cylinder';
import { IGeometry } from './define';

type IConeOptions = ICylinderOptions;

/**
 * @en
 * Generate a cone with radius 0.5, height 1, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个圆锥。
 * @param radius 圆锥半径。
 * @param height 圆锥高度。
 * @param opts 圆锥参数选项。
 */
export default function cone (
    radius = 0.5,
    height = 1,
    opts: RecursivePartial<IConeOptions> = {},
): IGeometry /* TODO: Explicit since ISSUE https://github.com/microsoft/TypeScript/issues/31280 , changes required once the issue is fixed. */ {
    return cylinder(0, radius, height, opts);
}
