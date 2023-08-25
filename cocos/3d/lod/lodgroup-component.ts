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
import { EDITOR, JSB } from 'internal:constants';
import { ccclass, editable, executeInEditMode, menu, serializable, type } from 'cc.decorator';
import { Vec3, Mat4, geometry, CCInteger, CCFloat } from '../../core';
import { Node } from '../../scene-graph/node';
import { Component } from '../../scene-graph/component';
import { MeshRenderer } from '../framework/mesh-renderer';
import { Mesh } from '../assets/mesh';
import { scene } from '../../render-scene';
import { NodeEventType } from '../../scene-graph/node-event';
import type { LODData } from '../../render-scene/scene';

// Ratio of objects occupying the screen
const DEFAULT_SCREEN_OCCUPATION: number[] = [0.25, 0.125, 0.01];

export type ModelAddedCallback = () => void;
@ccclass('cc.LOD')
export class LOD {
    // Minimum percentage of screen usage for the current lod in effect, range in [0, 1]
    @serializable
    protected _screenUsagePercentage = 1.0;
    // Mesh renderers components contained in this LOD level.
    @type([MeshRenderer])
    @serializable
    protected _renderers: MeshRenderer[] = [];
    // renderer internal LOD data block.
    /**
     * @engineInternal
     */
    private _LODData: scene.LODData = new scene.LODData();

    /**
     * @engineInternal
     */
    private _modelAddedCallback: ModelAddedCallback | null;

    constructor () {
        this._LODData.screenUsagePercentage = this._screenUsagePercentage;
        this._modelAddedCallback = null;
    }

    /**
     * @en Minimum percentage of screen usage for the current lod in effect, range in [0, 1]
     * @zh 本层级生效时，占用屏幕的最小百分比, 取值范围[0, 1]
     */
    @type(CCFloat)
    get screenUsagePercentage (): number { return this._screenUsagePercentage; }
    set screenUsagePercentage (val: number) {
        this._screenUsagePercentage = val;
        this._LODData.screenUsagePercentage = val;
    }

    /**
     * @en Get the list of [[MeshRenderer]] used by the current lod.
     * @zh 获取当前lod使用的 [[MeshRenderer]] 列表
     */
    @type([MeshRenderer])
    get renderers (): readonly MeshRenderer[]  {
        return this._renderers;
    }

    /**
     * @en reset _renderers to meshList or [], LODData's model will be reset too.
     * @zh 重置 _renderers 为 meshList或空数组, LODData上的model也会被重置
     */
    set renderers (meshList: readonly MeshRenderer[]) {
        if (meshList === this._renderers) return;
        let modelAdded = false;
        this._renderers.length = 0;
        this._LODData.clearModels();
        for (let i = 0; i < meshList.length; i++) {
            this._renderers[i] = meshList[i];
            const model = meshList[i]?.model;
            if (model) {
                modelAdded = true;
                this._LODData.addModel(model);
            }
        }
        if (this._modelAddedCallback && modelAdded) {
            this._modelAddedCallback();
        }
    }

    /**
     * @engineInternal
     * @en Get the total number of all mesh's triangle.
     * @zh 获取所有模型的三角形总数
     */
    @editable
    @type([CCInteger])
    get triangleCount (): number[] {
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
     * @en Get the number of LOD.
     * @zh 获取LOD的数量
     */
    get rendererCount (): number { return this._renderers.length; }

    /**
      * @engineInternal
      * @en Get internal LOD object.
      */
    get lodData (): LODData { return this._LODData; }

    /**
      * @engineInternal
      */
    set modelAddedCallback (callback: ModelAddedCallback) {
        this._modelAddedCallback = callback;
    }

    /**
     * @en Insert a [[MeshRenderer]] before specific index position.
     * @zh 在指定的数组索引处插入一个[[MeshRenderer]]
     * @param index @en The rendering array is indexed from 0. If - 1 is passed, it will be added to the end of the list.
     * @zh renderers数组从0开始索引，若传递-1将会被添加到列表末尾。
     * @param renderer @en The mesh-renderer object. @zh [[MeshRenderer]] 对象
     * @returns @en The inserted [[MeshRenderer]] @zh 返回被插入的 [[MeshRenderer]] 对象
     */
    public insertRenderer (index: number, renderer: MeshRenderer): MeshRenderer {
        // make sure insert at the tail of the list.
        if (index < 0 || index > this._renderers.length) {
            index = this._renderers.length;
        }
        this._renderers.splice(index, 0, renderer);
        let modelAdded = false;
        if (renderer.model) {
            modelAdded = true;
            this._LODData.addModel(renderer.model);
        }
        if (this._modelAddedCallback && modelAdded) {
            this._modelAddedCallback();
        }
        return renderer;
    }

    /**
     * @en Delete the [[MeshRenderer]] at specific index position.
     * @zh 删除指定索引处的[[MeshRenderer]]
     * @param index @en 0 indexed position in renderer array, when -1 is specified, the last element will be deleted.
     * @zh _renderers从0开始索引，传递-1则最后一个元素会被删除。
     * @returns @en The deleted [[MeshRenderer]], or null if the specified index does not exist. @zh 如果指定索引处的对象存在，返回被删除对象否则返回null。
     */
    public deleteRenderer (index: number): MeshRenderer | null {
        const renders = this._renderers.splice(index, 1);
        const model = renders.length > 0 ? renders[0]?.model : null;
        if (model) {
            this._LODData.eraseModel(model);
        }

        return renders[0];
    }

    /**
     * @en Get the [[MeshRenderer]] at specific index position.
     * @zh 获取指定索引处的[[MeshRenderer]]
     * @param index @en Value range from 0 to _renderers's length. @zh 取值范围是[0, _renderers长度]
     * @return @en Returns the [[MeshRenderer]] at the specified index, or null if the specified index does not exist. @zh 返回指定索引处的对象，若不存在则返回null。
     */
    public getRenderer (index: number): MeshRenderer | null {
        return this._renderers[index] || null;
    }

    /**
     * @en Update the [[MeshRenderer]] at specific index position.
     * @zh 更新指定索引处的 [[MeshRenderer]]
     * @param index @en Value range from 0 to _renderers's length @zh 取值范围是 [0, _renderers数组长度]
     */
    public setRenderer (index: number, renderer: MeshRenderer): void {
        if (index < 0 || index >= this.rendererCount) {
            console.error('setRenderer to LOD error, index out of range');
            return;
        }
        this.deleteRenderer(index);
        this.insertRenderer(index, renderer);
    }
}

@ccclass('cc.LODGroup')
@menu('Rendering/LOD Group')
@executeInEditMode
export class LODGroup extends Component {
    /**
     * @en Object reference point in local space, e.g. center of the bound volume for all LODs
     */
    @serializable
    protected _localBoundaryCenter: Vec3 = new Vec3(0, 0, 0);

    /**
     * @en Object Size in local space, may be auto-calculated value from object bounding box or value from user input.
     */
    @serializable
    protected _objectSize = 0;

    /**
     *@en The array of LODs
     */
    @serializable
    protected _LODs: LOD[] = [];

    /**
     * @engineInternal
     */
    protected _lodGroup = new scene.LODGroup();

    private _eventRegistered = false;

    private _forceUsedLevels: number[] = [];

    constructor () {
        super();
    }

    /**
     * @engineInternal
     */
    set localBoundaryCenter (val: Readonly<Vec3>) {
        this._localBoundaryCenter.set(val);
        this._lodGroup.localBoundaryCenter = val;
    }

    /**
     * @en Obtain the center point of AABB composed of all models
     * @zh 获取所有模型组成的AABB的中心点
     */
    get localBoundaryCenter (): Readonly<Vec3> { return this._localBoundaryCenter.clone(); }

    /**
     * @en Obtain LOD level numbers.
     * @zh 获取LOD层级数
     */
    get lodCount (): number { return this._LODs.length; }

    /**
     * @en Set current AABB's size.
     * @zh 设置当前包围盒的大小
     */
    @type(CCFloat)
    set objectSize (val: number) {
        this._objectSize = val;
        this._lodGroup.objectSize = val;
    }

    /**
     * @en Get current AABB's size.
     * @zh 获取当前包围盒的大小
     */
    get objectSize (): number { return this._objectSize; }

    /**
     * @en Get LOD array config.
     * @zh 获取 LOD 数组
     */
    @type([LOD])
    get LODs (): readonly LOD[] {
        return this._LODs;
    }

    /**
     * @en Reset current LODs to new value.
     * @ 重置 LODs 为当前新设置的值。
     */
    set LODs (valArray: readonly LOD[]) {
        if (valArray === this._LODs) {
            //_LODs maybe changed, we need to notify the scene to update.
            this._updateDataToScene();
            return;
        }
        this._LODs.length = 0;
        this.lodGroup.clearLODs();
        valArray.forEach((lod: LOD, index: number) => {
            this.lodGroup.insertLOD(index, lod.lodData);
            this._LODs[index] = lod;
            lod.modelAddedCallback = this.onLodModelAddedCallback.bind(this);
        });
        //_LODs has been changed, we need to notify the scene to update.
        this._updateDataToScene();
    }

    /**
     * @engineInternal
     */
    get lodGroup (): scene.LODGroup { return this._lodGroup; }

    private onLodModelAddedCallback (): void {
        if (this.objectSize === 0) {
            this.recalculateBounds();
        }
    }

    /**
     * @en Insert the [[LOD]] at specific index position, [[LOD]] will be inserted to the last position if index less than 0 or greater than lodCount.
     * @zh 在指定索引处插入 [[LOD]], 若索引为负或超过lodCount，则在末尾添加
     * @param index @en location where lod is added. @zh lod被插入的位置
     * @param screenUsagePercentage @en The minimum screen usage percentage that the currently set lod starts to use, range in[0, 1].
     * @zh lod生效时的最低屏幕显示百分比要求，取值范围[0, 1]
     * @param lod @en If this parameter is not set, it will be created by default. @zh 如果参数没传，则内部创建
     * @returns @en The new lod added. @zh 返回被添加的lod
     */
    public insertLOD (index: number, screenUsagePercentage?: number, lod?: LOD): LOD {
        if (index < 0 || index > this.lodCount) {
            index = this.lodCount;
        }

        if (!lod) {
            lod = new LOD();
        }
        lod.modelAddedCallback = this.onLodModelAddedCallback.bind(this);
        if (!screenUsagePercentage) {
            const preLod = this.getLOD(index - 1);
            const nextLod = this.getLOD(index);
            if (preLod && nextLod) {
                screenUsagePercentage = (preLod.screenUsagePercentage + nextLod.screenUsagePercentage) / 2;
            } else if (preLod && !nextLod) { // insert at last position
                screenUsagePercentage = preLod.screenUsagePercentage / 2;
                if (screenUsagePercentage > 0.01) {
                    screenUsagePercentage = 0.01;
                }
            } else if (nextLod && !preLod) {
                //insert at first position
                screenUsagePercentage = nextLod.screenUsagePercentage;
                const curNextLOD = this.getLOD(index + 1);
                nextLod.screenUsagePercentage = (screenUsagePercentage + (curNextLOD ? curNextLOD.screenUsagePercentage : 0)) / 2;
            } else { //lod count is zero
                screenUsagePercentage = DEFAULT_SCREEN_OCCUPATION[0];
            }
        }
        lod.screenUsagePercentage = screenUsagePercentage;
        this._LODs.splice(index, 0, lod);
        this._lodGroup.insertLOD(index, lod.lodData);
        this._updateDataToScene();
        if (this.node) {
            this._emitChangeNode(this.node);
        }
        return lod;
    }

    /**
     * @en Erase the [[LOD]] at specific index position.
     * @zh 删除指定索引处的 [[LOD]]
     * @param index @en Index of the erased lod, range in [0, lodCount]. @zh 被删除对象索引, 取值范围[0, lodCount]
     * @returns @en Erased lod. @zh 被删除的对象
     */
    public eraseLOD (index: number): LOD | null {
        if (index < 0 || index >= this.lodCount) {
            console.warn('eraseLOD error, index out of range');
            return null;
        }
        const lod = this._LODs[index];
        if (!lod) {
            console.warn('eraseLOD error, LOD not exist at specified index.');
            return null;
        }
        this._LODs.splice(index, 1);
        this._lodGroup.eraseLOD(index);
        this._updateDataToScene();
        this._emitChangeNode(this.node);
        return lod;
    }

    /**
     * @en Get [[LOD]] at specific index position.
     * @zh 获取指定索引处的 [[LOD]]
     * @param index @en Range in [0, lodCount]. @zh 取值范围[0, lodCount]
     * @returns @en Lod at specified index, or null. @zh 返回指定索引的lod或null
     */
    public getLOD (index: number): LOD | null {
        if (index < 0 || index >= this.lodCount) {
            console.warn('getLOD error, index out of range');
            return null;
        }
        return this._LODs[index];
    }

    /**
     * @en Update the [[LOD]] at specific index position.
     * @zh 更新指定索引处的 [[LOD]]
     * @param index, update lod at specified index.
     * @param lod, the updated lod.
     */
    public setLOD (index: number, lod: LOD): void {
        if (index < 0 || index >= this.lodCount) {
            console.warn('setLOD error, index out of range');
            return;
        }
        this._LODs[index] = lod;
        lod.modelAddedCallback = this.onLodModelAddedCallback.bind(this);
        this.lodGroup.updateLOD(index, lod.lodData);
        this._updateDataToScene();
    }

    /**
     * @en Recalculate the bounding box, and the interface will recalculate the localBoundaryCenter and objectSize
     * @zh 重新计算包围盒，该接口会更新 localBoundaryCenter 和 objectSize
     */
    public recalculateBounds (): void {
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

        for (let i = 0; i < this.lodCount; ++i) {
            const lod = this.getLOD(i);
            if (lod) {
                for (let j = 0; j < lod.rendererCount; ++j) {
                    const renderer = lod.getRenderer(j);
                    if (!renderer) {
                        continue;
                    }
                    renderer.model?.updateWorldBound();
                    let worldBounds = renderer.model?.worldBounds;
                    if (worldBounds) {
                        if (JSB) {
                            const center = worldBounds.center;
                            const halfExtents = worldBounds.halfExtents;
                            worldBounds = geometry.AABB.create(center.x, center.y, center.z, halfExtents.x, halfExtents.y, halfExtents.z);
                        }
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
        }

        if (boundsMin) {
            // Transform world bounds to local space bounds
            const boundsMin2 = boundsMin;
            const c = new Vec3((boundsMax.x + boundsMin2.x) * 0.5, (boundsMax.y + boundsMin2.y) * 0.5, (boundsMax.z + boundsMin2.z) * 0.5);
            const e = new Vec3((boundsMax.x - boundsMin2.x) * 0.5, (boundsMax.y - boundsMin2.y) * 0.5, (boundsMax.z - boundsMin2.z) * 0.5);

            const [minPos, maxPos] = getTransformedBoundary(c, e, this.node.worldMatrix.clone().invert());

            // Set bounding volume center and extents in local space
            c.set((maxPos.x + minPos.x) * 0.5, (maxPos.y + minPos.y) * 0.5, (maxPos.z + minPos.z) * 0.5);
            e.set((maxPos.x - minPos.x) * 0.5, (maxPos.y - minPos.y) * 0.5, (maxPos.z - minPos.z) * 0.5);

            // Save the result
            this.localBoundaryCenter = c;
            this.objectSize = Math.max(e.x, e.y, e.z) * 2.0;
        } else {
            // No model exists, reset to default value
            this.localBoundaryCenter = new Vec3(0, 0, 0);
            this.objectSize = 0;
        }
        this._emitChangeNode(this.node);
    }

    /**
     * @en reset current objectSize to 1, and recalculate screenUsagePercentage.
     * @zh 重置 objectSize 的大小为1，该接口会重新计算 screenUsagePercentage
     */
    public resetObjectSize (): void {
        if (this.objectSize === 1.0) return;

        if (this.objectSize === 0) {
            this.objectSize = 1.0;
        }

        // 1 will be new object size
        const scale = 1.0 / this.objectSize;
        // reset object size to 1
        this.objectSize = 1.0;

        for (let i = 0; i < this.lodCount; ++i) {
            const lod = this.getLOD(i);
            if (lod) {
                lod.screenUsagePercentage *= scale;
            }
        }
        this._emitChangeNode(this.node);
    }

    /**
     * @zh 强制使用某一级的LOD
     * @en Force LOD level to use.
     * lodLevel @en The LOD level to use. Passing lodLevel < 0 will return to standard LOD processing. @zh 要使用的LOD层级，为负数时使用标准的处理流程
     */
    public forceLOD (lodLevel: number): void {
        this._forceUsedLevels = lodLevel < 0 ? [] : [lodLevel];
        this.lodGroup.lockLODLevels(this._forceUsedLevels);
    }

    /**
     * @en Force multi LOD level to use, This function is only called in editor.<br/>
     * @zh 强制使用某几级的LOD,该接口只会在编辑器下调用。
     * lodIndexArray @en The LOD level array. Passing [] will return to standard LOD processing. @zh 要使用的LOD层级数组，传[]时将使用标准的处理流程。
     */
    public forceLODs (lodIndexArray: number[]): void {
        if (EDITOR) {
            this._forceUsedLevels = lodIndexArray.slice();
            this.lodGroup.lockLODLevels(this._forceUsedLevels);
        }
    }

    onLoad (): void {
        this._lodGroup.node = this.node;
        // objectSize maybe initialized from deserialize
        this._lodGroup.objectSize = this._objectSize;
        this._lodGroup.localBoundaryCenter = this._localBoundaryCenter;
        if (!this._eventRegistered) {
            this.node.on(NodeEventType.COMPONENT_REMOVED, this._onRemove, this);
            this._eventRegistered = true;
        }
        this._constructLOD();
    }

    _onRemove (comp: Component): void {
        if (comp === this) {
            this.onDisable();
        }
    }

    private _constructLOD (): void {
        // generate default lod for lodGroup
        if (this.lodCount < 1) {
            const size = DEFAULT_SCREEN_OCCUPATION.length;
            for (let i = 0; i < size; i++) {
                this.insertLOD(i, DEFAULT_SCREEN_OCCUPATION[i]);
            }
        }
    }

    // Redo, Undo, Prefab restore, etc.
    onRestore (): void {
        this._constructLOD();
        if (this.enabledInHierarchy) {
            this._attachToScene();
        }
    }

    onEnable (): void {
        this._attachToScene();
        if (this.objectSize === 0) {
            this.recalculateBounds();
        }
        this.lodGroup.lockLODLevels(this._forceUsedLevels);

        // cache lod for scene
        if (this.lodCount > 0 && this._lodGroup.lodCount < 1) {
            this._LODs.forEach((lod: LOD, index) => {
                lod.lodData.screenUsagePercentage = lod.screenUsagePercentage;
                const renderers = lod.renderers;
                if (renderers !== null && renderers.length > 0) {
                    for (let i = 0; i < renderers.length; i++) {
                        const lodInstance = lod.lodData;
                        const renderer = renderers[i];
                        if (lodInstance && renderer && renderer.model) {
                            lodInstance.addModel(renderer.model);
                        }
                    }
                }
                this._lodGroup.insertLOD(index, lod.lodData);
            });
        }
    }

    onDisable (): void {
        this._detachFromScene();
        this.lodGroup.lockLODLevels([]);
    }

    private _attachToScene (): void {
        if (this.node && this.node.scene) {
            const renderScene = this._getRenderScene();
            if (this._lodGroup.scene) {
                this._detachFromScene();
            }
            renderScene.addLODGroup(this._lodGroup);
        }
    }

    private _detachFromScene (): void {
        if (this._lodGroup.scene) { this._lodGroup.scene.removeLODGroup(this._lodGroup); }
    }

    private _emitChangeNode (node: Node): void {
        if (EDITOR) {
            EditorExtends.Node.emit('change', node.uuid, node);
        }
    }

    private _updateDataToScene (): void {
        this._detachFromScene();
        this._attachToScene();
    }
}
