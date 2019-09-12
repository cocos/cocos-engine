import { IBArray } from '../../assets/mesh';
import { aabb, intersect, ray, triangle } from '../../geom-utils';
import { GFXPrimitiveMode } from '../../gfx/define';
import { Mat4, Vec3 } from '../../math';
import { RecyclePool } from '../../memop';
import { Root } from '../../root';
import { Layers } from '../../scene-graph/layers';
import { Node } from '../../scene-graph/node';
import { INode } from '../../utils/interfaces';
import { JointsTexturePool } from '../models/joints-texture-utils';
import { Ambient } from './ambient';
import { Camera, ICameraInfo } from './camera';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { PlanarShadows } from './planar-shadows';
import { Skybox } from './skybox';
import { SphereLight } from './sphere-light';
import { SpotLight } from './spot-light';

export interface IRenderSceneInfo {
    name: string;
}

export interface ISceneNodeInfo {
    name: string;
    isStatic?: boolean;
    // parent: INode;
}

export interface IRaycastResult {
    node: INode;
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

    get skybox (): Skybox {
        return this._skybox;
    }

    get planarShadows (): PlanarShadows {
        return this._planarShadows;
    }

    get defaultMainLightNode (): INode {
        return this._defaultMainLightNode;
    }

    get mainLight (): DirectionalLight {
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

    get texturePool () {
        return this._texturePool;
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
    private _mainLight: DirectionalLight;
    private _defaultMainLightNode: INode;
    private _sphereLights: SphereLight[] = [];
    private _spotLights: SpotLight[] = [];
    private _models: Model[] = [];
    private _modelId: number = 0;
    private _texturePool: JointsTexturePool;

    constructor (root: Root) {
        this._root = root;
        this._ambient = new Ambient(this);
        this._defaultMainLightNode = new Node('Main Light');
        this._mainLight = new DirectionalLight(this, 'Main Light', this._defaultMainLightNode);
        this._mainLight.illuminance = Ambient.SUN_ILLUM;
        this._mainLight.enabled = false; // disabled by default
        this._ambient = new Ambient(this);
        this._skybox = new Skybox(this);
        this._planarShadows = new PlanarShadows(this);
        this._texturePool = new JointsTexturePool(root.device);
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
        this._texturePool.initialize();
        return true;
    }

    public destroy () {
        this.destroyCameras();
        this.destroyPointLights();
        this.destroySpotLights();
        this.destroyModels();
        this._planarShadows.destroy();
        this._texturePool.destroy();
    }

    public createCamera (info: ICameraInfo): Camera {
        const camera = new Camera(this, info);
        this._cameras.push(camera);
        return camera;
    }

    public destroyCamera (camera: Camera) {
        for (let i = 0; i < this._cameras.length; ++i) {
            if (this._cameras[i] === camera) {
                camera.destroy();
                this._cameras.splice(i, 1);
                return;
            }
        }
    }

    public destroyCameras () {
        for (const camera of this._cameras) {
            camera.destroy();
        }
        this._cameras.splice(0);
    }

    public createSphereLight (name: string, node: INode): SphereLight | null {
        const light = new SphereLight(this, name, node);
        this._sphereLights.push(light);
        return light;
    }

    public destroySphereLight (light: SphereLight) {
        for (let i = 0; i < this._sphereLights.length; ++i) {
            if (this._sphereLights[i] === light) {
                this._sphereLights.splice(i, 1);
                return;
            }
        }
    }

    public createSpotLight (name: string, node: INode): SpotLight | null {
        const light = new SpotLight(this, name, node);
        this._spotLights.push(light);
        return light;
    }

    public destroySpotLight (light: SpotLight) {
        for (let i = 0; i < this._spotLights.length; ++i) {
            if (this._spotLights[i] === light) {
                this._spotLights.splice(i, 1);
                return;
            }
        }
    }

    public destroyPointLights () {
        this._sphereLights = [];
    }

    public destroySpotLights () {
        this._spotLights = [];
    }

    public createModel<T extends Model> (clazz: new (scene: RenderScene, node: INode) => T, node: INode): T {
        const model = new clazz(this, node);
        this._models.push(model);
        return model;
    }

    public destroyModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                this._models.splice(i, 1)[0].destroy();
                return;
            }
        }
    }

    public destroyModels () {
        for (const m of this._models) {
            m.destroy();
        }
        this._models = [];
    }

    public onPipelineChange () {
        for (const m of this._models) {
            m.onPipelineChange();
        }
        this._skybox.onPipelineChange();
        this._planarShadows.onPipelineChange();
    }

    public generateModelId (): number {
        return this._modelId++;
    }

    /**
     * @en
     * Cast a ray into the scene, record all the intersected models in the result array     
     * @param worldRay the testing ray
     * @param mask the layer mask to filter the models
     * @param distance the max distance , Infinity by default
     * @zh
     * 传入一条射线检测场景中所有的 3D 模型。
     * @param worldRay 世界射线
     * @param mask 用于标记所有要检测的层，默认为 Default
     * @param distance 射线检测的最大距离, 默认为 Infinity
     * @returns IRaycastResult[]
     */
    public raycastModels (worldRay: ray, mask = Layers.Enum.DEFAULT, distance = Infinity): IRaycastResult[] {
        pool.reset();
        for (const m of this._models) {
            const transform = m.transform;
            if (!transform || !m.enabled || m.node.layer & Layers.Enum.IGNORE_RAYCAST || !(m.node.layer & mask) || !m.modelBounds) { continue; }
            // transform ray back to model space
            Mat4.invert(m4, transform.getWorldMatrix(m4));
            Vec3.transformMat4(modelRay.o, worldRay.o, m4);
            Vec3.normalize(modelRay.d, Vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
            // broadphase
            const d = intersect.ray_aabb(modelRay, m.modelBounds);
            if (d <= 0 || d > distance) { continue; }
            for (let i = 0; i < m.subModelNum; ++i) {
                const subModel = m.getSubModel(i).subMeshData;
                if (subModel && subModel.geometricInfo) {
                    const { positions: vb, indices: ib, doubleSided: sides } = subModel.geometricInfo;
                    narrowphase(vb, ib!, subModel.primitiveMode, sides!, distance);
                }
                if (narrowDis < distance) {
                    const r = pool.add();
                    r.node = m.node;
                    r.distance = narrowDis * Vec3.multiply(v3, modelRay.d, transform.worldScale).length();
                    results[pool.length - 1] = r;
                }
            }
        }
        results.length = pool.length;
        return results;
    }

    /**
     * @en
     * Before you raycast the model, make sure the model is not null
     * @param worldRay the testing ray
     * @param mask the layer mask to filter the models
     * @param distance the max distance , Infinity by default
     * @zh
     * 传入一条射线和一个 3D 模型进行射线检测。
     * @param worldRay 世界射线
     * @param mask 用于标记所有要检测的层，默认为 Default
     * @param distance 射线检测的最大距离, 默认为 Infinity
     * @returns IRaycastResult[]
     */
    public raycastModel (worldRay: ray, model: Model, mask = Layers.Enum.DEFAULT, distance = Infinity): IRaycastResult[] {
        if (CC_PREVIEW) {
            if (model == null) console.error(" 检测前请保证 model 不为 null ");
        }
        pool.reset();
        results.length = 0;
        const m = model;
        const transform = m.transform;
        if (!transform || !m.enabled || m.node.layer & Layers.Enum.IGNORE_RAYCAST || !(m.node.layer & mask) || !m.modelBounds) { return results; }
        // transform ray back to model space
        Mat4.invert(m4, transform.getWorldMatrix(m4));
        Vec3.transformMat4(modelRay.o, worldRay.o, m4);
        Vec3.normalize(modelRay.d, Vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
        // broadphase
        const d = intersect.ray_aabb(modelRay, m.modelBounds);
        if (d <= 0 || d > distance) { return results; }
        for (let i = 0; i < m.subModelNum; ++i) {
            const subModel = m.getSubModel(i).subMeshData;
            if (subModel && subModel.geometricInfo) {
                const { positions: vb, indices: ib, doubleSided: sides } = subModel.geometricInfo;
                narrowphase(vb, ib!, subModel.primitiveMode, sides!, distance);
            }
            if (narrowDis < distance) {
                const r = pool.add();
                r.node = m.node;
                r.distance = narrowDis * Vec3.multiply(v3, modelRay.d, transform.worldScale).length();
                results[pool.length - 1] = r;
            }
        }
        return results;
    }

    /**
     * @en
     * Cast a ray into the scene, record all the intersected ui aabb in the result array
     * @param worldRay the testing ray
     * @param mask the layer mask to filter all ui2d aabb
     * @param distance the max distance , Infinity by default
     * @returns IRaycastResult[]
     * @zh
     * 传入一条射线检测场景中所有的 UI2D Node，mask 标记了要检测的所有的层，默认为 UI2D* 
     * @param worldRay 世界射线
     * @param mask 用于标记所有要检测的层，默认为 UI2D
     * @param distance 射线检测的最大距离, 默认为 Infinity
     * @returns IRaycastResult[]
     */
    public raycastUI2D (worldRay: ray, mask = Layers.Enum.UI_2D, distance = Infinity): IRaycastResult[] {
        poolUI.reset();
        const canvasComs = cc.director.getScene().getComponentsInChildren(cc.CanvasComponent);
        if (canvasComs != null && canvasComs.length > 0) {
            for (let i = 0; i < canvasComs.length; i++) {
                const canvasNode = canvasComs[i].node as Node;
                if (canvasNode != null && canvasNode.active) {
                    this._raycastUI2DNodeRecursiveChildren(worldRay, canvasNode, mask, distance);
                }
            }
        }
        resultUIs.length = poolUI.length;
        return resultUIs;
    }

    /**
     * @en
     * Before you raycast the ui node, make sure the node is not null
     * @param worldRay the testing ray
     * @param ui2dNode the ui2d node
     * @param mask the layer mask to filter the ui2d node aabb
     * @param distance the max distance , Infinity by default
     * @returns IRaycastResult | undefined
     * @zh
     * 传入一条射线和一个 UI2D Node 进行射线检测。
     * @param worldRay 世界射线
     * @param ui2dNode UI2D 的节点
     * @param mask 用于标记所有要检测的层，默认为 UI2D
     * @param distance 射线检测的最大距离, 默认为 Infinity
     */
    public raycastUI2DNode (worldRay: ray, ui2dNode: INode, mask = Layers.Enum.UI_2D, distance = Infinity) {
        if (CC_PREVIEW) {
            if (ui2dNode == null) console.error(" 检测前请保证 uiNode 不为 null ");
        }
        const uiTransfrom = ui2dNode.uiTransfromComp;
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

    // /**
    //  * @en
    //  * Cast a ray into the scene, record all the intersected models and ui2d nodes in the result array
    //  * @param worldRay the testing ray
    //  * @param mask the layer mask to filter the models
    //  * @param distance the max distance , Infinity by default  
    //  * @returns IRaycastResult[]   
    //  * @zh
    //  * 传入一条射线检测场景中所有的 3D 模型和 UI2D Node
    //  * @param worldRay 世界射线
    //  * @param mask mask 用于标记所有要检测的层，默认为 Default | UI2D
    //  * @param distance 射线检测的最大距离, 默认为 Infinity
    //  * @returns IRaycastResult[]
    //  */
    // public raycastAll (worldRay: ray, mask = Layers.Default | Layers.UI2D, distance = Infinity): IRaycastResult[] {
    //     const r_3d = this.raycastModels(worldRay, mask, distance);
    //     const r_ui2d = this.raycastUI2D(worldRay, mask, distance);
    //     return r_3d.concat(r_ui2d);
    // }

    private _raycastUI2DNodeRecursiveChildren (worldRay: ray, parent: INode, mask = Layers.Enum.UI_2D, distance = Infinity) {
        const result = this.raycastUI2DNode(worldRay, parent, mask, distance);
        if (result != null) {
            resultUIs[poolUI.length - 1] = result;
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
const results: IRaycastResult[] = [];
/** UI raycast result pool */
const aabbUI = new aabb();
const poolUI = new RecyclePool<IRaycastResult>(() => {
    return { node: null!, distance: Infinity };
}, 8);
const resultUIs: IRaycastResult[] = [];

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
            if (dist <= 0 || dist > narrowDis) { continue; }
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
            if (dist <= 0 || dist > narrowDis) { continue; }
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
            if (dist <= 0 || dist > narrowDis) { continue; }
            narrowDis = dist;
        }
    }
};
