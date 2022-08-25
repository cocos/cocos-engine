/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

import { assertIsTrue } from '../../core/data/utils/asserts';
import { randomRange } from '../../core/math/utils';
import { Vec3 } from '../../core/math/vec3';
import { Enum } from '../../core/value-types';

export const PlaceMethod = Enum({
    Uniform: 0,
    Adaptive: 1,
});

export interface PlacementInfo {
    method: number;
    nProbesX: number;
    nProbesY: number;
    nProbesZ: number;
    minPos: Vec3;
    maxPos: Vec3;
}

export class AutoPlacement {
    public static generate (info: PlacementInfo) {
        switch (info.method) {
        case PlaceMethod.Uniform:
            return this.doGenerateUniform(info);
        case PlaceMethod.Adaptive:
            return this.doGenerateAdaptive(info);
        default:
            return [];
        }
    }

    private static doGenerateUniform (info: PlacementInfo) {
        if (info.nProbesX < 2 || info.nProbesY < 2 || info.nProbesZ < 2) {
            return [];
        }

        const probes: Vec3[] = [];
        const position = new Vec3(0.0, 0.0, 0.0);
        const gridSize = new Vec3(
            (info.maxPos.x - info.minPos.x) / (info.nProbesX - 1),
            (info.maxPos.y - info.minPos.y) / (info.nProbesY - 1),
            (info.maxPos.z - info.minPos.z) / (info.nProbesZ - 1),
        );

        for (let x = 0; x < info.nProbesX; x++) {
            position.x = x * gridSize.x + info.minPos.x;// + randomRange(0, 6);

            for (let y = 0; y < info.nProbesY; y++) {
                position.y = y * gridSize.y + info.minPos.y;// + randomRange(0, 3);

                for (let z = 0; z < info.nProbesZ; z++) {
                    position.z = z * gridSize.z + info.minPos.z;// + randomRange(0, 8);
                    probes.push(new Vec3(position));
                }
            }
        }

        return probes;
    }

    private static doGenerateAdaptive (info: PlacementInfo) {
        const results: Vec3[] = [];
        return results;
    }
}
