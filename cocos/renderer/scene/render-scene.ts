import { IBArray } from '../../3d/assets/mesh';
import { aabb, intersect, ray, triangle } from '../../3d/geom-utils';
import { RecyclePool } from '../../3d/memop';
import { Root } from '../../core/root';
import { Mat4, Vec3 } from '../../core/math';
import { GFXPrimitiveMode } from '../../gfx/define';
import { Layers } from '../../scene-graph/layers';
import { Node } from '../../scene-graph/node';
import { JointsTexturePool } from '../models/joints-texture-utils';
import { Ambient } from './ambient';
import { Camera, ICameraInfo } from './camera';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { PlanarShadows } from './planar-shadows';
import { Skybox } from './skybox';
import { SphereLight } from './sphere-light';
import { SpotLight } from './spot-light';
import { INode } from '../../core/utils/interfaces';

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
     * Cast a ray into the scene, record all the intersected models in the result array
     * @param worldRay the testing ray
     * @param mask the layer mask to filter the models
     * @returns the results array
     */
    public raycast (worldRay: ray, mask: number = Layers.RaycastMask): IRaycastResult[] {
        pool.reset();
        for (const m of this._models) {
            const transform = m.transform;
            if (!transform || !m.enabled || !cc.Layers.check(m.node.layer, mask) || !m.modelBounds) { continue; }
            // transform ray back to model space
            Mat4.invert(m4, transform.getWorldMatrix(m4));
            Vec3.transformMat4(modelRay.o, worldRay.o, m4);
            Vec3.normalize(modelRay.d, Vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
            // broadphase
            distance = intersect.ray_aabb(modelRay, m.modelBounds);
            if (distance <= 0) { continue; }
            for (let i = 0; i < m.subModelNum; ++i) {
                const subModel = m.getSubModel(i).subMeshData;
                if (subModel && subModel.geometricInfo) {
                    const { positions: vb, indices: ib, doubleSided: sides } = subModel.geometricInfo;
                    narrowphase(vb, ib, subModel.primitiveMode, sides as boolean);
                }
                if (distance < Infinity) {
                    const r = pool.add();
                    r.node = m.node;
                    r.distance = distance * Vec3.multiply(v3, modelRay.d, transform.worldScale).length();
                    results[pool.length - 1] = r;
                }
            }
        }
        results.length = pool.length;
        return results;
    }

    /**
     * Cast a ray into the scene, record all the intersected ui aabb in the result array
     * @param worldRay the testing ray
     * @param mask the layer mask to filter the ui aabb
     * @returns the results array
     */
    public raycastUI (worldRay: ray, mask: number = Layers.UI): IRaycastResult[] {
        poolUI.reset();
        const canvasComs = cc.director.getScene().getComponentsInChildren(cc.CanvasComponent);
        if (canvasComs != null && canvasComs.length > 0) {
            const canvasNode = canvasComs[0].node as Node;
            if (canvasNode != null && canvasNode.active) {
                this._raycastUINodeRecursiveChildren(worldRay, mask, canvasNode);
            }
        }
        resultUIs.length = poolUI.length;
        return resultUIs;
    }

    /**
     * Before you raycast the ui node, make sure the node is not null
     * @param worldRay the testing ray
     * @param mask the layer mask to filter the models
     * @param uiNode the ui node
     * @returns IRaycastResult | undefined
     */
    public raycastUINode (worldRay: ray, mask: number = Layers.UI, uiNode: INode) {
        const uiTransfrom = uiNode.uiTransfromComp;
        if (uiTransfrom == null || !cc.Layers.check(uiNode.layer, mask)) { return; }
        uiTransfrom.getComputeAABB(aabbUI);
        distance = intersect.ray_aabb(worldRay, aabbUI);

        if (distance <= 0) {
            return;
        } else {
            const r = poolUI.add();
            r.node = uiNode;
            r.distance = distance;
            return r;
        }
    }

    private _raycastUINodeRecursiveChildren (worldRay: ray, mask: number, parent: INode) {
        const result = this.raycastUINode(worldRay, mask, parent);
        if (result != null) {
            resultUIs[poolUI.length - 1] = result;
        }
        for (const node of parent.children) {
            if (node != null && node.active) {
                this._raycastUINodeRecursiveChildren(worldRay, mask, node);
            }
        }
    }
}

const modelRay = ray.create();
const v3 = new Vec3();
const m4 = new Mat4();
let distance = Infinity;
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

const narrowphase = (vb: Float32Array, ib: IBArray, pm: GFXPrimitiveMode, sides: boolean) => {
    distance = Infinity;
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
            if (dist <= 0 || dist > distance) { continue; }
            distance = dist;
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
            if (dist <= 0 || dist > distance) { continue; }
            distance = dist;
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
            if (dist <= 0 || dist > distance) { continue; }
            distance = dist;
        }
    }
};
