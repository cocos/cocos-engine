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
import { ccclass, editable, executeInEditMode, menu, serializable, type } from 'cc.decorator';
import { Vec3, Mat4 } from '../core/math';
import { Node } from '../scene-graph/node';
import { Component } from '../scene-graph/component';
import { Camera, CameraProjection } from '../render-scene/scene';
import { Mesh, MeshRenderer } from '../3d';
import { assertIsTrue } from '../core/data/utils/asserts';
import { scene } from '../render-scene';
import { NodeEventType } from '../scene-graph/node-event';

const _DEFAULT_SCREEN_OCCUPATION: number[] = [0.5, 0.25, 0.125];
@ccclass('cc.LOD')
export class LOD {
    // The relative minimum transition height in screen space.
    @serializable
    protected _screenRelativeTransitionHeight = 1;
    // Mesh renderers components contained in this LOD level.
    @type([MeshRenderer])
    @serializable
    protected _renderers: (MeshRenderer | null)[] = [];
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

    @type([MeshRenderer])
    get renderers () {
        return this._renderers;
    }

    set renderers (meshList) {
        this._renderers = meshList;
    }

    @editable
    @type([Number])
    get triangles () {
        const tris: number[] = [];
        this._renderers.forEach((meshRenderer: MeshRenderer | null) => {
            let count = 0;
            if (meshRenderer && meshRenderer.mesh) {
                const primitives = meshRenderer.mesh.struct.primitives;
                primitives?.forEach((subMesh: Mesh.ISubMesh) => {
                    if (subMesh && subMesh.indexView) {
                        count += subMesh.indexView.count;
                    }
                });
            }
            tris.push(count / 3);
        });
        return tris;
    }

    /**
     * @en Insert a [[MeshRenderer]] before specific index position.
     * @zh 在指定的数组索引处插入一个[[MeshRenderer]]
     * @param index 0 indexed position in renderer array, when -1 is specified, append to the tail of the list
     * @param renderer the mesh-renderer object
     * @returns The renderer inserted
     */
    insertRenderer (index: number, renderer: MeshRenderer | null): MeshRenderer {
        if (!renderer) {
            renderer = new MeshRenderer();
        }
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
    deleteRenderer (index: number): MeshRenderer | null {
        const renderer = this._renderers[index];
        this._renderers.splice(index, 1);
        this._LOD.models.splice(index, 1);
        return renderer;
    }

    getRenderer (index: number): MeshRenderer | null {
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
    protected _objectSize = 1;

    /**
     *@en The array of LODs
     */
    @serializable
    protected _LODs: LOD[] = [];

    protected _lodGroup = new scene.LODGroup();

    private _eventRegistered = false;

    constructor () {
        super();
        this._lodGroup.objectSize = this._objectSize;
    }

    set localReferencePoint (val: Vec3) {
        this._localReferencePoint.set(val);
        this._lodGroup.localReferencePoint = val;
    }

    get localReferencePoint () { return this._localReferencePoint.clone(); }

    get lodCount () { return this._LODs.length; }

    @type(Number)
    set objectSize (val: number) {
        this._objectSize = val;
        this._lodGroup.objectSize = val;
    }

    get objectSize () { return this._objectSize; }

    @type([LOD])
    get LODs () {
        return this._LODs;
    }

    set LODs (LODs: LOD[]) {
        this._LODs = LODs;
    }

    insertLOD (index: number, screenSize: number, lod: LOD | null): LOD {
        if (!lod) {
            lod = new LOD();
        }
        lod.screenRelativeTransitionHeight = screenSize;
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

    recalculateBounds () {
        LODGroupEditorUtility.recalculateBounds(this);
    }

    resetObjectSize () {
        LODGroupEditorUtility.resetObjectSize(this);
    }

    get lodGroup () { return this._lodGroup; }

    onLoad () {
        this._lodGroup.node = this.node;
        if (!this._eventRegistered) {
            // this.node.on(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, this._removeUnneededModel, this);
            this.node.on(NodeEventType.COMPONENT_REMOVED, this._onRemove, this);
            this._eventRegistered = true;
        }
        // generate default lod for lodGroup
        if (this.lodCount < 1) {
            const size = _DEFAULT_SCREEN_OCCUPATION.length;
            for (let i = 0; i < size; i++) {
                const lod = new LOD();
                lod.screenRelativeTransitionHeight = _DEFAULT_SCREEN_OCCUPATION[i];
                this.insertLOD(i, lod);
            }
        }
    }

    _onRemove (comp: Component) {
        if (comp === this) {
            this.onDisable();
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
        //   LODGroupEditorUtility.recalculateBounds(this);

        // cache lod for scene
        if (this.lodCount > 0 && this._lodGroup.lodCount < 1) {
            this._LODs.forEach((lod: LOD, index) => {
                lod.lod.screenRelativeTransitionHeight = lod.screenRelativeTransitionHeight;
                const renderers = lod.renderers;
                if (renderers !== null && renderers.length > 0) {
                    for (let i = 0; i < renderers.length; i++) {
                        const lodInstance = lod.lod;
                        const renderer = renderers[i];
                        if (lodInstance && renderer && renderer.model) {
                            lodInstance.models[i] = renderer.model;
                        }
                    }
                }
                this._lodGroup.LODs[index] = lod.lod;
            });
        }
    }

    onDisable () {
        this._detachFromScene();
    }

    // lod's model will be enabled while execute culling
    private _removeUnneededModel () {
        LODGroupEditorUtility.setLODVisibility(this, -1);
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
    /**
     *
     * @param lodGroup current LOD Group component
     * @param camera current perspective camera
     * @returns visible LOD index in lodGroup
     */
    static getVisibleLOD (lodGroup: LODGroup, camera: Camera): number {
        const relativeHeight = this.getRelativeHeight(lodGroup, camera) || 0;

        let lodIndex = -1;
        for (let i = 0; i < lodGroup.lodCount; ++i) {
            const lod = lodGroup.getLOD(i);
            if (relativeHeight >= lod.screenRelativeTransitionHeight) {
                lodIndex = i;
                break;
            }
        }
        return lodIndex;
    }

    /**
         *
         * @param lodGroup current LOD Group component
         * @param camera current perspective camera
         * @returns height of current lod group relvative to camera position in screen space, aka. relativeHeight
         */
    static getRelativeHeight (lodGroup: LODGroup, camera: Camera): number|null {
        if (!lodGroup.node) return null;

        let distance: number | undefined;
        if (camera.projectionType === scene.CameraProjection.PERSPECTIVE) {
            distance =  Vec3.len(lodGroup.localReferencePoint.transformMat4(lodGroup.node.worldMatrix).subtract(camera.node.position));
        }
        return this.distanceToRelativeHeight(camera, distance, this.getWorldSpaceSize(lodGroup));
    }

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
                if (!renderer) {
                    continue;
                }
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
            lodGroup.objectSize = Math.max(e.x, e.y, e.z) * 2.0;
        }
        this.emitChangeNode(lodGroup.node);
    }

    static emitChangeNode (node:Node) {
        if (EDITOR) {
            // @ts-expect-error Because EditorExtends is Editor only
            EditorExtends.Node.emit('change', node.uuid, node);
        }
    }
    static resetObjectSize (lodGroup: LODGroup): void {
        if (lodGroup.objectSize === 1.0) return;

        // 1 will be new object size
        const scale = 1.0 / lodGroup.objectSize;
        // reset object size to 1
        lodGroup.objectSize = 1.0;

        for (let i = 0; i < lodGroup.lodCount; ++i) {
            lodGroup.getLOD(i).screenRelativeTransitionHeight *= scale;
        }
        this.emitChangeNode(lodGroup.node);
    }

    static setLODVisibility (lodGroup: LODGroup, visibleIndex: number) {
        lodGroup.lodGroup.lockLODLevels(visibleIndex < 0 ? [] : [visibleIndex]);
        lodGroup.LODs.forEach((lod: LOD, index) => {
            for (const renderer of lod.renderers) {
                if (!renderer) {
                    continue;
                }
                const renderScene = lodGroup.node.scene?.renderScene;
                if (renderScene && renderer.model) {
                    if (visibleIndex === index) {
                        renderScene.removeModel(renderer.model);
                        renderScene.addModel(renderer.model);
                    } else {
                        renderScene.removeModel(renderer.model);
                    }
                }
            }
        });
    }

    static setLODsVisibility (lodGroup: LODGroup, visibleArray: number[]) {
        lodGroup.lodGroup.lockLODLevels(visibleArray);
        lodGroup.LODs.forEach((lod: LOD, index) => {
            for (const renderer of lod.renderers) {
                if (!renderer) {
                    continue;
                }
                const renderScene = lodGroup.node.scene?.renderScene;
                if (renderScene && renderer.model) {
                    let visible = false;
                    for (let i = 0; i < visibleArray.length; i++) {
                        const lodLev = visibleArray[i];
                        if (index === lodLev) {
                            visible = true;
                            // model maybe exist at multiple LODGroup
                            renderScene.removeModel(renderer.model);
                            renderScene.addModel(renderer.model);
                        }
                    }
                    if (!visible) {
                        renderScene.removeModel(renderer.model);
                    }
                }
            }
        });
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
