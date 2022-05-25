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

import { PrimitiveMode } from '../core/gfx';
import { applyDefaultGeometryOptions, IGeometry, IGeometryOptions } from './define';

/**
 * @en
 * The definition of the parameter for building a circle.
 * @zh
 * 圆形参数选项。
 */
interface ICircleOptions extends IGeometryOptions {
    // The segments. Default to 64.
    segments: number;
}

/**
 * @zh
 * 应用默认圆参数。
 * @param options 圆参数。
 */
function applyDefaultCircleOptions (options?: RecursivePartial<ICircleOptions>): ICircleOptions {
    options = applyDefaultGeometryOptions<ICircleOptions>(options);
    options.segments = 64;
    return options as ICircleOptions;
}

/**
 * @en
 * Generate a circle with radius 1, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个圆，其半径是单位1，中心点在原点。
 * @param options @zh 参数选项。 @en The optional creation parameters of the circle
 */
export default function circle (options?: RecursivePartial<ICircleOptions> | ICircleOptions): IGeometry {
    const normalizedOptions = applyDefaultCircleOptions(options);
    const segments = normalizedOptions.segments;

    const positions = new Array<number>(3 * (segments + 1));
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    const indices = new Array<number>(1 + segments * 2);
    indices[0] = 0;
    const step = Math.PI * 2 / segments;
    for (let iSegment = 0; iSegment < segments; ++iSegment) {
        const angle = step * iSegment;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const p = (iSegment + 1) * 3;
        positions[p + 0] = x;
        positions[p + 1] = y;
        positions[p + 2] = 0;
        const i = iSegment * 2;
        indices[1 + (i)] = iSegment + 1;
        indices[1 + (i + 1)] = iSegment + 2;
    }
    if (segments > 0) {
        indices[indices.length - 1] = 1;
    }

    const result: IGeometry = {
        positions,
        indices,
        minPos: { x: 1, y: 1, z: 0 },
        maxPos: { x: -1, y: -1, z: 0 },
        boundingRadius: 1,
        primitiveMode: PrimitiveMode.TRIANGLE_FAN,
    };

    return result;
}
