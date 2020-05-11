import { IBArray } from '../../assets/mesh';
import { aabb, intersect, ray, triangle } from '../../geometry';
import { GFXPrimitiveMode } from '../../gfx/define';
import { Mat4, Vec3 } from '../../math';
import { RecyclePool } from '../../memop';
import { Root } from '../../root';
import { Node } from '../../scene-graph';
import { Layers } from '../../scene-graph/layers';
import { Ambient } from './ambient';
import { Camera } from './camera';
import { DirectionalLight } from './directional-light';
import { Model, ModelType } from './model';
import { PlanarShadows } from './planar-shadows';
import { Skybox } from './skybox';
import { SphereLight } from './sphere-light';
import { SpotLight } from './spot-light';
import { PREVIEW } from 'internal:constants';
import { Fog } from './fog';

export interface IRenderSceneInfo {
    name: string;
}

export interface ISceneNodeInfo {
    name: string;
    isStatic?: boolean;
    // parent: Node;
}

export interface IRaycastResult {
    node: Node;
    distance: number;
}

export class RenderScene {

    get root (): Root {
        return this._root;
    }

    get name (): string {
        return this._name;
    }

    get cameras (): Camera[] {
        return this._cameras;
    }

    get ambient (): Ambient {
        return this._ambient;
    }

    get fog (): Fog {
        return this._fog;
    }

    get skybox (): Skybox {
        return this._skybox;
    }

    get planarShadows (): PlanarShadows {
        return this._planarShadows;
    }

    get mainLight (): DirectionalLight | null {
        return this._mainLight;
    }

    get sphereLights (): SphereLight[] {
        return this._sphereLights;
    }

    get spotLights (): SpotLight[] {
        return this._spotLights;
    }

    get models (): Model[] {
        return this._models;
    }

    /**
     * @zh
     * 获取 raycastAllCanvas 后的检测结果
     */
    get rayResultCanvas () {
        return resultCanvas;
    }

    /**
     * @zh
     * 获取 raycastAllModels 后的检测结果
     */
    get rayResultModels () {
        return resultModels;
    }

    /**
     * @zh
     * 获取 raycastAll 后的检测结果
     */
    get rayResultAll () {
        return resultAll;
    }

    /**
     * @zh
     * 获取 raycastSingleModel 后的检测结果
     */
    get rayResultSingleModel () {
        return resultSingleModel;
    }

    public static registerCreateFunc (root: Root) {
        root._createSceneFun = (_root: Root): RenderScene => new RenderScene(_root);
    }

    private _root: Root;
    private _name: string = '';
    private _cameras: Camera[] = [];
    private _ambient: Ambient;
    private _skybox: Skybox;
    private _planarShadows: PlanarShadows;
    private _models: Model[] = [];
    private _sphereLights: SphereLight[] = [];
    private _spotLights: SpotLight[] = [];
    private _mainLight: DirectionalLight | null = null;
    private _modelId: number = 0;
    private _fog: Fog;

    constructor (root: Root) {
        this._root = root;
        this._ambient = new Ambient(this);
        this._skybox = new Skybox(this);
        this._planarShadows = new PlanarShadows(this);
        this._fog = new Fog(this);
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
        return true;
    }

    public destroy () {
        this.removeCameras();
        this.removeSphereLights();
        this.removeSpotLights();
        this.removeModels();
        this._skybox.destroy();
        this._planarShadows.destroy();
    }

    public addCamera (cam: Camera) {
        cam.attachToScene(this);
        this._cameras.push(cam);
    }

    public removeCamera (camera: Camera) {
        for (let i = 0; i < this._cameras.length; ++i) {
            if (this._cameras[i] === camera) {
                this._cameras.splice(i, 1);
                camera.detachFromScene();
                return;
            }
        }
    }

    public removeCameras () {
        for (const camera of this._cameras) {
            camera.detachFromScene();
        }
        this._cameras.splice(0);
    }

    public setMainLight (dl: DirectionalLight) {
        dl.attachToScene(this);
        this._mainLight = dl;
    }

    public unsetMainLight (dl: DirectionalLight) {
        dl.detachFromScene();
        this._mainLight = null;
    }

    public addSphereLight (pl: SphereLight) {
        pl.attachToScene(this);
        this._sphereLights.push(pl);
    }

    public removeSphereLight (pl: SphereLight) {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            if (this._sphereLights[i] === pl) {
                pl.detachFromScene();
                this._sphereLights.splice(i, 1);
                return;
            }
        }
    }

    public addSpotLight (sl: SpotLight) {
        sl.attachToScene(this);
        this._spotLights.push(sl);
    }

    public removeSpotLight (sl: SpotLight) {
        for (let i = 0; i < this._spotLights.length; ++i) {
            if (this._spotLights[i] === sl) {
                sl.detachFromScene();
                this._spotLights.splice(i, 1);
                return;
            }
        }
    }

    public removeSphereLights () {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            this._sphereLights[i].detachFromScene();
        }
        this._sphereLights.length = 0;
    }

    public removeSpotLights () {
        for (let i = 0; i < this._spotLights.length; ++i) {
            this._spotLights[i].detachFromScene();
        }
        this._spotLights = [];
    }

    public addModel (m: Model) {
        m.attachToScene(this);
        this._models.push(m);
    }

    public removeModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                this._planarShadows.destroyShadowData(model);
                model.detachFromScene();
                this._models.splice(i, 1);
                return;
            }
        }
    }

    public removeModels () {
        for (const m of this._models) {
            this._planarShadows.destroyShadowData(m);
            m.detachFromScene();
        }
        this._models.length = 0;
    }

    public onGlobalPipelineStateChanged () {
        for (const m of this._models) {
            m.onGlobalPipelineStateChanged();
        }
        this._skybox.onGlobalPipelineStateChanged();
        this._planarShadows.onGlobalPipelineStateChanged();
    }

    public generateModelId (): number {
        return this._modelId++;
    }

    /**
     * @en
     * Cast a ray into the scene, record all the intersected models and ui2d nodes in the result array
     * @param worldRay the testing ray
     * @param mask the layer mask to filter the models
     * @param distance the max distance , Infinity by default
     * @returns boolean , ray is hit or not
     * @note getter of this.rayResultAll can get recently result
     * @zh
     * 传入一条射线检测场景中所有的 3D 模型和 UI2D Node
     * @param worldRay 世界射线
     * @param mask mask 用于标记所有要检测的层，默认为 Default | UI2D
     * @param distance 射线检测的最大距离, 默认为 Infinity
     * @returns boolean , 射线是否有击中
     * @note 通过 this.rayResultAll 可以获取到最近的结果
     */
    public raycastAll (worldRay: ray, mask = Layers.Enum.DEFAULT | Layers.Enum.UI_2D, distance = Infinity): boolean {
        const r_3d = this.raycastAllModels(worldRay, mask, distance);
        const r_ui2d = this.raycastAllCanvas(worldRay, mask, distance);
        const isHit = r_3d || r_ui2d;
        resultAll.length = 0;
        if (isHit) {
            Array.prototype.push.apply(resultAll, resultModels);
            Array.prototype.push.apply(resultAll, resultCanvas);
        }
        return isHit;
    }

    /**
     * @en
     * Cast a ray into the scene, record all the intersected models in the result array
     * @param worldRay the testing ray
     * @param mask the layer mask to filter the models
     * @param distance the max distance , Infinity by default
     * @returns boolean , ray is hit or not
     * @note getter of this.rayResultModels can get recently result
     * @zh
     * 传入一条射线检测场景中所有的 3D 模型。
     * @param worldRay 世界射线
     * @param mask 用于标记所有要检测的层，默认为 Default
     * @param distance 射线检测的最大距离, 默认为 Infinity
     * @returns boolean , 射线是否有击中
     * @note 通过 this.rayResultModels 可以获取到最近的结果
     */
    public raycastAllModels (worldRay: ray, mask = Layers.Enum.DEFAULT, distance = Infinity): boolean {
        pool.reset();
        for (const m of this._models) {
            const transform = m.transform;
            if (!transform || !m.enabled || !(m.node.layer & (mask & ~Layers.Enum.IGNORE_RAYCAST)) || !m.worldBounds) { continue; }
            // broadphase
            let d = intersect.ray_aabb(worldRay, m.worldBounds);
            if (d <= 0 || d >= distance) { continue; }
            if (m.type === ModelType.DEFAULT) {
                // transform ray back to model space
                Mat4.invert(m4, transform.getWorldMatrix(m4));
                Vec3.transformMat4(modelRay.o, worldRay.o, m4);
                Vec3.normalize(modelRay.d, Vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
                d = Infinity;
                for (let i = 0; i < m.subModelNum; ++i) {
                    const subModel = m.getSubModel(i).subMeshData;
                    if (subModel && subModel.geometricInfo) {
                        const { positions: vb, indices: ib, doubleSided: sides } = subModel.geometricInfo;
                        narrowphase(vb, ib!, subModel.primitiveMode, sides!, distance);
                        d = Math.min(d, narrowDis * Vec3.multiply(v3, modelRay.d, transform.worldScale).length());
                    }
                }
            }
            if (d < distance) {
                const r = pool.add();
                r.node = m.node;
                r.distance = d;
                resultModels[pool.length - 1] = r;
            }
        }
        resultModels.length = pool.length;
        return resultModels.length > 0;
    }

    /**
     * @en
     * Before you raycast the model, make sure the model is not null
     * @param worldRay the testing ray
     * @param model the testing model
     * @param mask the layer mask to filter the models
     * @param distance the max distance , Infinity by default
     * @returns boolean , ray is hit or not
     * @zh
     * 传入一条射线和一个 3D 模型进行射线检测。
     * @param worldRay 世界射线
     * @param model 进行检测的模型
     * @param mask 用于标记所有要检测的层，默认为 Default
     * @param distance 射线检测的最大距离, 默认为 Infinity
     * @returns boolean , 射线是否有击中
     */
    public raycastSingleModel (worldRay: ray, model: Model, mask = Layers.Enum.DEFAULT, distance = Infinity): boolean {
        if (PREVIEW) {
            if (model == null) { console.error(' 检测前请保证 model 不为 null '); }
        }
        pool.reset();
        const m = model;
        const transform = m.transform;
        if (!transform || !m.enabled || !(m.node.layer & (mask & ~Layers.Enum.IGNORE_RAYCAST)) || !m.worldBounds) { return false; }
        // broadphase
        let d = intersect.ray_aabb(worldRay, m.worldBounds);
        if (d <= 0 || d >= distance) { return false; }
        if (m.type === ModelType.DEFAULT) {
            // transform ray back to model space
            Mat4.invert(m4, transform.getWorldMatrix(m4));
            Vec3.transformMat4(modelRay.o, worldRay.o, m4);
            Vec3.normalize(modelRay.d, Vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
            d = Infinity;
            for (let i = 0; i < m.subModelNum; ++i) {
                const subModel = m.getSubModel(i).subMeshData;
                if (subModel && subModel.geometricInfo) {
                    const { positions: vb, indices: ib, doubleSided: sides } = subModel.geometricInfo;
                    narrowphase(vb, ib!, subModel.primitiveMode, sides!, distance);
                    d = Math.min(d, narrowDis * Vec3.multiply(v3, modelRay.d, transform.worldScale).length());
                }
            }
        }
        if (d < distance) {
            const r = pool.add();
            r.node = m.node;
            r.distance = d;
            resultSingleModel[pool.length - 1] = r;
        }
        resultSingleModel.length = pool.length;
        return resultSingleModel.length > 0;
    }

    /**
     * @en
     * Cast a ray into the scene, detect all canvas and its children
     * @param worldRay the testing ray
     * @param mask the layer mask to filter all ui2d aabb
     * @param distance the max distance , Infinity by default
     * @returns boolean , ray is hit or not
     * @note getter of this.rayResultCanvas can get recently result
     * @zh
     * 传入一条射线检测场景中所有的 Canvas 以及 Canvas 下的 Node
     * @param worldRay 世界射线
     * @param mask 用于标记所有要检测的层，默认为 UI_2D
     * @param distance 射线检测的最大距离, 默认为 Infinity
     * @returns boolean , 射线是否有击中
     * @note 通过 this.rayResultCanvas 可以获取到最近的结果
     */
    public raycastAllCanvas (worldRay: ray, mask = Layers.Enum.UI_2D, distance = Infinity): boolean {
        poolUI.reset();
        const canvasComs = cc.director.getScene().getComponentsInChildren(cc.CanvasComponent);
        if (canvasComs != null && canvasComs.length > 0) {
            for (let i = 0; i < canvasComs.length; i++) {
                const canvasNode = canvasComs[i].node;
                if (canvasNode != null && canvasNode.active) {
                    this._raycastUI2DNodeRecursiveChildren(worldRay, canvasNode, mask, distance);
                }
            }
        }
        resultCanvas.length = poolUI.length;
        return resultCanvas.length > 0;
    }

    private _raycastUI2DNode (worldRay: ray, ui2dNode: Node, mask = Layers.Enum.UI_2D, distance = Infinity) {
        if (PREVIEW) {
            if (ui2dNode == null) { console.error('make sure UINode is not null'); }
        }
        const uiTransfrom = ui2dNode._uiProps.uiTransformComp;
        if (uiTransfrom == null || ui2dNode.layer & Layers.Enum.IGNORE_RAYCAST || !(ui2dNode.layer & mask)) { return; }
        uiTransfrom.getComputeAABB(aabbUI);
        const d = intersect.ray_aabb(worldRay, aabbUI);

        if (d <= 0) {
            return;
        } else if (d < distance) {
            const r = poolUI.add();
            r.node = ui2dNode;
            r.distance = d;
            return r;
        }
    }

    private _raycastUI2DNodeRecursiveChildren (worldRay: ray, parent: Node, mask = Layers.Enum.UI_2D, distance = Infinity) {
        const result = this._raycastUI2DNode(worldRay, parent, mask, distance);
        if (result != null) {
            resultCanvas[poolUI.length - 1] = result;
        }
        for (const node of parent.children) {
            if (node != null && node.active) {
                this._raycastUI2DNodeRecursiveChildren(worldRay, node, mask, distance);
            }
        }
    }
}

const modelRay = ray.create();
const v3 = new Vec3();
const m4 = new Mat4();
let narrowDis = Infinity;
const tri = triangle.create();
const pool = new RecyclePool<IRaycastResult>(() => {
    return { node: null!, distance: Infinity };
}, 8);
const resultModels: IRaycastResult[] = [];
/** Canavas raycast result pool */
const aabbUI = new aabb();
const poolUI = new RecyclePool<IRaycastResult>(() => {
    return { node: null!, distance: Infinity };
}, 8);
const resultCanvas: IRaycastResult[] = [];
/** raycast all */
const resultAll: IRaycastResult[] = [];
/** raycast single model */
const resultSingleModel: IRaycastResult[] = [];

const narrowphase = (vb: Float32Array, ib: IBArray, pm: GFXPrimitiveMode, sides: boolean, distance = Infinity) => {
    narrowDis = distance;
    if (pm === GFXPrimitiveMode.TRIANGLE_LIST) {
        const cnt = ib.length;
        for (let j = 0; j < cnt; j += 3) {
            const i0 = ib[j] * 3;
            const i1 = ib[j + 1] * 3;
            const i2 = ib[j + 2] * 3;
            Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
            Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
            Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
            const dist = intersect.ray_triangle(modelRay, tri, sides);
            if (dist <= 0 || dist >= narrowDis) { continue; }
            narrowDis = dist;
        }
    } else if (pm === GFXPrimitiveMode.TRIANGLE_STRIP) {
        const cnt = ib.length - 2;
        let rev = 0;
        for (let j = 0; j < cnt; j += 1) {
            const i0 = ib[j - rev] * 3;
            const i1 = ib[j + rev + 1] * 3;
            const i2 = ib[j + 2] * 3;
            Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
            Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
            Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
            rev = ~rev;
            const dist = intersect.ray_triangle(modelRay, tri, sides);
            if (dist <= 0 || dist >= narrowDis) { continue; }
            narrowDis = dist;
        }
    } else if (pm === GFXPrimitiveMode.TRIANGLE_FAN) {
        const cnt = ib.length - 1;
        const i0 = ib[0] * 3;
        Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
        for (let j = 1; j < cnt; j += 1) {
            const i1 = ib[j] * 3;
            const i2 = ib[j + 1] * 3;
            Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
            Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
            const dist = intersect.ray_triangle(modelRay, tri, sides);
            if (dist <= 0 || dist >= narrowDis) { continue; }
            narrowDis = dist;
        }
    }
};
