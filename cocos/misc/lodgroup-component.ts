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

import { EDITOR } from 'internal:constants';
import { ccclass, executeInEditMode, menu, serializable, type } from 'cc.decorator';
import { Vec3, Vec4, Mat4 } from '../core/math';
import { Node } from '../scene-graph/node';
import { Component } from '../scene-graph/component';
import { Renderer } from './renderer';
import { Camera, CameraProjection, Model } from '../render-scene/scene';
import { Layers } from '../scene-graph/layers';
import { ModelRenderer } from './model-renderer';
import { Mesh, MeshRenderer } from '../3d';
import { AABB } from '../core/geometry';
import { assertIsTrue } from '../core/data/utils/asserts';
import { scene } from '../render-scene';

const _DEFAULT_SCREEN_OCCUPATION: number[] = [0.5, 0.2, 0.07];
@ccclass
export class LOD {
    // The relative minimum transition height in screen space.
    @serializable
    protected _screenRelativeTransitionHeight = 1;
    // Mesh renderers components contained in this LOD level.
    @type([MeshRenderer])
    @serializable
    protected _renderers: MeshRenderer[] = [];
    // renderer internal LOD data block.
    protected _LOD: scene.LOD = new scene.LOD();

    constructor () {
        this._LOD.screenRelativeTransitionHeight = this._screenRelativeTransitionHeight;
    }

    /**
     * @en The relvative (minimum) transition height of this LOD level in screen space
     * @zh 本层级（最小）相对屏幕区域的过渡高度
     */
    @type(Number)
    get screenRelativeTransitionHeight () { return this._screenRelativeTransitionHeight; }
    set screenRelativeTransitionHeight (val) {
        this._screenRelativeTransitionHeight = val;
        this._LOD.screenRelativeTransitionHeight = val;
    }

    @type(MeshRenderer)
    get renderers () {
        return this._renderers;
    }

    set renderers (meshList: MeshRenderer[]) {
        this._renderers = meshList;
    }

    /**
     * @en Insert a [[MeshRenderer]] before specific index position.
     * @zh 在指定的数组索引处插入一个[[MeshRenderer]]
     * @param index 0 indexed position in renderer array, when -1 is specified, append to the tail of the list
     * @param renderer the mesh-renderer object
     * @returns The renderer inserted
     */
    insertRenderer (index: number, renderer: MeshRenderer): MeshRenderer {
        this._renderers.splice(index, 0, renderer);
        this._LOD.models.splice(index, 0, renderer.model!);
        return renderer;
    }

    /**
     * @en Delete the [[MeshRenderer]] at specific index position.
     * @zh 删除指定索引处的[[MeshRenderer]]
     * @param index 0 indexed position in renderer array, when -1 is specified, the last element will be deleted
     * @returns The renderer deleted
     */
    deleteRenderer (index: number): MeshRenderer {
        const renderer = this._renderers[index];
        this._renderers.splice(index, 1);
        this._LOD.models.splice(index, 1);
        return renderer;
    }

    getRenderer (index: number): MeshRenderer {
        return this._renderers[index];
    }

    setRenderer (index: number, renderer: MeshRenderer) {
        this._renderers[index] = renderer;
        this._LOD.models[index] = renderer.model!;
    }

    get rendererCount () { return this._renderers.length; }

    get lod () { return this._LOD; }
}

@ccclass('cc.LODGroup')
@menu('Rendering/LOD Group')
@executeInEditMode
export class LODGroup extends Component {
    /**
     * @en Object reference point in local space, e.g. center of the bound volume for all LODs
     */
    @serializable
    protected _localReferencePoint: Vec3 = new Vec3(0, 0, 0);

    /**
     * @en Object Size in local space, may be auto-calculated value from object bounding box or value from user input.
     */
    @serializable
    protected _size = 1;

    /**
     *@en The array of LODs
     */
    @serializable
    protected _LODs: LOD[] = [];

    protected _lodGroup = new scene.LODGroup();

    constructor () {
        super();
        this._lodGroup.size = this._size;
    }

    set localReferencePoint (val: Vec3) {
        this._localReferencePoint.set(val);
        this._lodGroup.localReferencePoint = val;
    }

    get localReferencePoint () { return this._localReferencePoint.clone(); }

    get lodCount () { return this._LODs.length; }

    @type(Number)
    set size (val: number) {
        this._size = val;
        this._lodGroup.size = val;
    }

    get size () { return this._size; }

    @type([LOD])
    get LODs () {
        return this._LODs;
    }

    set LODs (LODs: LOD[]) {
        this._LODs = LODs;
    }

    insertLOD (index: number, lod: LOD): LOD {
        this._LODs.splice(index, 0, lod);
        this._lodGroup.LODs.splice(index, 0, lod.lod);
        return lod;
    }

    deleteLOD (index: number) : LOD {
        const lod = this._LODs[index];
        this._LODs.splice(index, 1);
        this._lodGroup.LODs.splice(index, 1);
        return lod;
    }

    getLOD (index: number): LOD {
        return this._LODs[index];
    }

    setLOD (index: number, lod: LOD) {
        this._LODs[index] = lod;
    }

    get lodGroup () { return this._lodGroup; }

    onLoad () {
        this._createLODGroup();
        // generate default lod for lodGroup
        if (this._lodGroup.lodCount < 1) {
            const size = _DEFAULT_SCREEN_OCCUPATION.length;
            for (let i = 0; i < size; i++) {
                this._LODs[i] = new LOD();
                this._LODs[i].screenRelativeTransitionHeight = _DEFAULT_SCREEN_OCCUPATION[i];
            }
        }
    }

    // Redo, Undo, Prefab restore, etc.
    onRestore () {
        if (this.enabledInHierarchy) {
            this._attachToScene();
        }
    }

    onEnable () {
        this._attachToScene();

        // if (EDITOR) {
        //     // Detach all mesh renderers from scene
        //     const scene = this._getRenderScene();
        //     if (scene) {
        //         for (const lod of this._LODs) {
        //             for (let j = 0; j < lod.rendererCount; ++j) {
        //                 const renderer = lod.getRenderer(j);
        //                 if (renderer && renderer.model && renderer.enabled) { scene.removeModel(renderer.model); }
        //             }
        //         }
        //     }
        // }
    }

    onDisable () {
        this._detachFromScene();

        // if (EDITOR) {
        //     // Detach all mesh renderers from scene
        //     const scene = this._getRenderScene();
        //     if (scene) {
        //         for (const lod of this._LODs) {
        //             for (let j = 0; j < lod.rendererCount; ++j) {
        //                 const renderer = lod.getRenderer(j);
        //                 if (renderer && renderer.model && renderer.enabled) { scene.addModel(renderer.model); }
        //             }
        //         }
        //     }
        // }
    }

    onDestroy () {

    }

    /**
     * ==============================================
     * Internal members
     * ==============================================
     */
    protected _createLODGroup () {
        this._lodGroup.node = this.node;

        // Engine unit test case.
        // const renderers = LODGroupEditorUtility.getAvailableRenderers(this);

        // const step = 1.0 / (1 + renderers.length);
        // let levelCount = 1;
        // for (const renderer of renderers) {
        //     const lod = new LOD();
        //     lod.screenRelativeTransitionHeight = 1.0 - step * levelCount;
        //     lod.insertRenderer(-1, renderer);
        //     this.insertLOD(-1, lod);

        //     // const renderScene = renderer._getRenderScene();
        //     // if (renderScene && renderer.model) renderScene.removeModel(renderer.model);

        //     ++levelCount;
        // }

        LODGroupEditorUtility.recalculateBounds(this);
        // lod's model will be enabled while execute culling
        for (const lod of this._LODs) {
            for (const renderer of lod.renderers) {
                const renderScene = renderer._getRenderScene();
                if (renderScene && renderer.model) {
                    renderScene.removeModel(renderer.model);
                }
            }
        }
    }

    protected _attachToScene () {
        if (!this.node.scene) { return; }

        const renderScene = this._getRenderScene();
        if (this._lodGroup.scene) {
            this._detachFromScene();
        }
        renderScene.addLODGroup(this._lodGroup);
    }

    protected _detachFromScene () {
        if (this._lodGroup.scene) { this._lodGroup.scene.removeLODGroup(this._lodGroup); }
    }
}

export class LODGroupEditorUtility {
    static recalculateBounds (lodGroup: LODGroup): void {
        function getTransformedBoundary (c: /* center */Vec3, e: /*extents*/Vec3, transform: Mat4): [Vec3, Vec3] {
            let minPos: Vec3;
            let maxPos: Vec3;

            const pts = new Array<Vec3>(
                new Vec3(c.x - e.x, c.y - e.y, c.z - e.z),
                new Vec3(c.x - e.x, c.y + e.y, c.z - e.z),
                new Vec3(c.x + e.x, c.y + e.y, c.z - e.z),
                new Vec3(c.x + e.x, c.y - e.y, c.z - e.z),
                new Vec3(c.x - e.x, c.y - e.y, c.z + e.z),
                new Vec3(c.x - e.x, c.y + e.y, c.z + e.z),
                new Vec3(c.x + e.x, c.y + e.y, c.z + e.z),
                new Vec3(c.x + e.x, c.y - e.y, c.z + e.z),
            );

            minPos = pts[0].transformMat4(transform);
            maxPos = minPos.clone();
            for (let i = 1; i < 8; ++i) {
                const pt = pts[i].transformMat4(transform);
                minPos = Vec3.min(minPos, minPos, pt);
                maxPos = Vec3.max(maxPos, maxPos, pt);
            }
            return [minPos, maxPos];
        }

        const minPos = new Vec3();
        const maxPos = new Vec3();
        let boundsMin: Vec3 | null = null;
        let boundsMax: Vec3 = new Vec3();

        for (let i = 0; i < lodGroup.lodCount; ++i) {
            const lod = lodGroup.getLOD(i);
            for (let j = 0; j < lod.rendererCount; ++j) {
                const renderer = lod.getRenderer(j);
                const worldBounds = renderer.model?.worldBounds;
                if (worldBounds) {
                    worldBounds.getBoundary(minPos, maxPos);

                    if (boundsMin) {
                        Vec3.min(boundsMin, boundsMin, minPos);
                        Vec3.max(boundsMax, boundsMax, maxPos);
                    } else {
                        boundsMin = minPos.clone();
                        boundsMax = maxPos.clone();
                    }
                }
            }
        }

        if (boundsMin) {
            // Transform world bounds to local space bounds
            const boundsMin2 = boundsMin;
            const c = new Vec3((boundsMax.x + boundsMin2.x) * 0.5, (boundsMax.y + boundsMin2.y) * 0.5, (boundsMax.z + boundsMin2.z) * 0.5);
            const e = new Vec3((boundsMax.x - boundsMin2.x) * 0.5, (boundsMax.y - boundsMin2.y) * 0.5, (boundsMax.z - boundsMin2.z) * 0.5);

            const [minPos, maxPos] = getTransformedBoundary(c, e, lodGroup.node.worldMatrix.clone().invert());

            // Set bounding volume center and extents in local space
            c.set((maxPos.x + minPos.x) * 0.5, (maxPos.y + minPos.y) * 0.5, (maxPos.z + minPos.z) * 0.5);
            e.set((maxPos.x - minPos.x) * 0.5, (maxPos.y - minPos.y) * 0.5, (maxPos.z - minPos.z) * 0.5);

            // Save the result
            lodGroup.localReferencePoint = c;
            lodGroup.size = Math.max(e.x, e.y, e.z) * 2.0;
        }
    }

    static resetObjectSize (lodgroup: LODGroup): void {
        if (lodgroup.size === 1.0) return;

        // 1 will be new object size
        const scale = 1.0 / lodgroup.size;
        // reset object size to 1
        lodgroup.size = 1.0;

        for (let i = 0; i < lodgroup.lodCount; ++i) {
            lodgroup.getLOD(i).screenRelativeTransitionHeight *= scale;
        }
    }
}
