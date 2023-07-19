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

import { LODGroup } from "../3d/lod/lodgroup-component";
import { Vec3, assertIsTrue } from '../core';
import { Camera, CameraProjection } from '../render-scene/scene';
import { scene } from '../render-scene';

export class LODGroupEditorUtility {
    /**
     * @en Get the lod level used under the current camera, -1 indicates no lod is used.
     * @zh 获取当前摄像机下，使用哪一级的LOD，-1 表示没有lod被使用
     * @param lodGroup current LOD Group component.
     * @param camera current perspective camera.
     * @returns visible LOD index in lodGroup.
     */
    static getVisibleLOD (lodGroup: LODGroup, camera: Camera): number {
        const screenOccupancyPercentage = this.getRelativeHeight(lodGroup, camera) || 0;

        let lodIndex = -1;
        for (let i = 0; i < lodGroup.lodCount; ++i) {
            const lod = lodGroup.getLOD(i);
            if (lod && screenOccupancyPercentage >= lod.screenUsagePercentage) {
                lodIndex = i;
                break;
            }
        }
        return lodIndex;
    }

    /**
     * @en Get the percentage of objects used on the screen under the current camera.
     * @zh 获取当前摄像机下，物体在屏幕上的占用比率
     * @param lodGroup current LOD Group component
     * @param camera current perspective camera
     * @returns height of current lod group relative to camera position in screen space, aka. relativeHeight
     */
    static getRelativeHeight (lodGroup: LODGroup, camera: Camera): number|null {
        if (!lodGroup.node) return null;

        let distance: number | undefined;
        if (camera.projectionType === scene.CameraProjection.PERSPECTIVE) {
            distance =  Vec3.len(lodGroup.localBoundaryCenter.transformMat4(lodGroup.node.worldMatrix).subtract(camera.node.position));
        }
        return this.distanceToRelativeHeight(camera, distance, this.getWorldSpaceSize(lodGroup));
    }

    private static distanceToRelativeHeight (camera: Camera, distance: number | undefined, size: number): number {
        if (camera.projectionType === CameraProjection.PERSPECTIVE) {
            assertIsTrue(typeof distance === 'number', 'distance must be present for perspective projection');
            return (size * camera.matProj.m05) / (distance * 2.0); // note: matProj.m05 is 1 / tan(fov / 2.0)
        } else {
            return size * camera.matProj.m05 * 0.5;
        }
    }

    private static relativeHeightToDistance (camera: Camera, relativeHeight: number, size: number): number {
        assertIsTrue(camera.projectionType === CameraProjection.PERSPECTIVE, 'Camera type must be perspective.');
        return (size * camera.matProj.m05) / (relativeHeight * 2.0); // note: matProj.m05 is 1 / tan(fov / 2.0)
    }

    private static getWorldSpaceSize (lodGroup: LODGroup): number {
        const scale = lodGroup.node.scale;
        const maxScale = Math.max(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));
        return maxScale * lodGroup.objectSize;
    }
}
