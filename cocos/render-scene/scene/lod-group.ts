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
import { Model } from './model';
import { Vec3 } from '../../core/math';
import { RenderScene } from '..';
import { Device, deviceManager } from '../../gfx';
import { Node } from '../../scene-graph';
import { Camera, CameraProjection } from './camera';
import { assertIsTrue } from '../../core/data/utils/asserts';

export class LOD {
    screenRelativeTransitionHeight = 1;
    models: Model[] = [];
}

export class LODGroup {
    public scene?: RenderScene;

    public node: Node = null!;

    protected _device: Device;

    public enabled = true;

    private _localReferencePoint: Vec3 = new Vec3(0, 0, 0);

    /**
     * @en Object Size in local space, may be auto-calculated value from object bounding box or value from user input.
     */
    protected _objectSize = 1;

    /**
     *@en The array of LODs
     */
    protected _LODs: LOD[] = [];

    constructor () {
        this._device = deviceManager.gfxDevice;
    }

    set localReferencePoint (val: Vec3) {  this._localReferencePoint.set(val); }

    get localReferencePoint () { return this._localReferencePoint.clone(); }

    get lodCount () { return this._LODs.length; }

    set objectSize (val: number) {
        this._objectSize = val;
    }

    get objectSize () { return this._objectSize; }

    set LODs (val: LOD[]) { this._LODs = val; }

    get LODs () { return this._LODs; }

    attachToScene (scene: RenderScene) {
        this.scene = scene;

        for (const lod of this._LODs) {
            for (const m of lod.models) {
                m?.attachToScene(scene);
            }
        }
    }

    detachFromScene () {
        this.scene = null!;
        for (const lod of this._LODs) {
            for (const m of lod.models) {
                m?.detachFromScene();
            }
        }
    }

    /**
     *
     * @param camera current perspective camera
     * @returns visible LOD index in lodGroup
     */
    getVisibleLOD (camera: Camera): number {
        const relativeHeight = this.getRelativeHeight(camera) || 0;

        let lodIndex = -1;
        for (let i = 0; i < this.lodCount; ++i) {
            const lod = this.LODs[i];
            if (relativeHeight >= lod.screenRelativeTransitionHeight) {
                lodIndex = i;
                break;
            }
        }
        return lodIndex;
    }

    /**
     *
     * @param camera current perspective camera
     * @returns height of current lod group relvative to camera position in screen space, aka. relativeHeight
     */
    getRelativeHeight (camera: Camera): number|null {
        if (!this.node) return null;

        let distance: number | undefined;
        if (camera.projectionType === CameraProjection.PERSPECTIVE) {
            distance =  Vec3.len(this.localReferencePoint.transformMat4(this.node.worldMatrix).subtract(camera.node.position));
        }

        return this.distanceToRelativeHeight(camera, distance, this.getWorldSpaceSize());
    }

    private distanceToRelativeHeight (camera: Camera, distance: number | undefined, size: number): number {
        if (camera.projectionType === CameraProjection.PERSPECTIVE) {
            assertIsTrue(typeof distance === 'number', 'distance must be present for perspective projection');
            return (size * camera.matProj.m05) / (distance * 2.0); // note: matProj.m11 is 1 / tan(fov / 2.0)
        } else {
            return size * camera.matProj.m05 * 0.5;
        }
    }

    private getWorldSpaceSize (): number {
        const scale = this.node.scale;
        const maxScale = Math.max(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));
        return maxScale * this.objectSize;
    }
}
