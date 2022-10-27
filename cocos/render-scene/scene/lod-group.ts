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
import { Vec3 } from '../../core';
import { RenderScene } from '..';
import { Device, deviceManager } from '../../gfx';
import { Node } from '../../scene-graph';
import { Camera, CameraProjection } from './camera';
import { assertIsTrue } from '../../core/data/utils/asserts';

/**
 * @engineInternal
 */
export class LODData {
    // Range in [0, 1].
    screenUsagePercentage = 1.0;

    private _models: Model[] = [];

    get models () : readonly Model[] {
        return this._models;
    }

    public addModel (model: Model) {
        this._models.splice(0, 0, model);
    }

    public eraseModel (model: Model) {
        const removeIndex = this._models.indexOf(model);
        if (removeIndex >= 0) {
            this._models.splice(removeIndex, 1);
        }
    }

    public clearModels () {
        this._models.length = 0;
    }
}

/**
 * @engineInternal
 */
export class LODGroup {
    public scene?: RenderScene;

    public node: Node = null!;

    protected _device: Device;

    public enabled = true;

    private _localBoundaryCenter: Vec3 = new Vec3(0, 0, 0);

    /**
     * @en Object Size in local space, may be auto-calculated value from object bounding box or value from user input.
    */
    protected _objectSize = 1;

    /**
     *@en The array of LODs
     */
    protected _LODs: LODData[] = [];

    /**
     * For editor only, users maybe operate several LOD's object
     */
    protected _lockedLODLevelVec : number[] = [];

    constructor () {
        this._device = deviceManager.gfxDevice;
    }

    set localBoundaryCenter (val: Vec3) {  this._localBoundaryCenter.set(val); }

    get localBoundaryCenter () : Readonly<Vec3> { return this._localBoundaryCenter.clone(); }

    get lodCount () { return this._LODs.length; }

    set objectSize (val: number) {
        this._objectSize = val;
    }

    get objectSize () { return this._objectSize; }

    get LODs () : readonly LODData[] { return this._LODs; }

    attachToScene (scene: RenderScene) {
        this.scene = scene;
    }

    detachFromScene () {
        this.scene = null!;
    }

    lockLODLevels (lockLev: number[]) {
        this._lockedLODLevelVec  = lockLev;
    }

    getLockLODLevels (): number[] {
        return this._lockedLODLevelVec;
    }

    clearLODs () {
        this._LODs.length = 0;
    }

    insertLOD (index: number, lod: LODData) {
        this._LODs.splice(index, 0, lod);
    }

    updateLOD (index: number, lod: LODData) {
        this._LODs[index] = lod;
    }

    eraseLOD (index: number) {
        this._LODs.splice(index, 1);
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
            if (relativeHeight >= lod.screenUsagePercentage) {
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
            distance =  Vec3.len(this.localBoundaryCenter.transformMat4(this.node.worldMatrix).subtract(camera.node.position));
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
