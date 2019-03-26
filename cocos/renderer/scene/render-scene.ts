import { IBArray } from '../../3d/assets/mesh';
import { intersect, ray, triangle } from '../../3d/geom-utils';
import { RecyclePool } from '../../3d/memop';
import { Root } from '../../core/root';
import { Mat4, Vec3 } from '../../core/value-types';
import { mat4, vec3 } from '../../core/vmath';
import { GFXPrimitiveMode } from '../../gfx/define';
import { Layers } from '../../scene-graph/layers';
import { Node } from '../../scene-graph/node';
import { Ambient } from './ambient';
import { Camera, ICameraInfo } from './camera';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { PlanarShadow } from './planar-shadow';
import { Skybox } from './skybox';
import { SphereLight } from './sphere-light';
import { SpotLight } from './spot-light';

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

    get skybox (): Skybox {
        return this._skybox;
    }

    get planarShadow (): PlanarShadow {
        return this._planarShadow;
    }

    get defaultMainLightNode (): Node {
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

    public static registerCreateFunc (root: Root) {
        root._createSceneFun = (_root: Root): RenderScene => new RenderScene(_root);
    }

    private _root: Root;
    private _name: string = '';
    private _cameras: Camera[] = [];
    private _ambient: Ambient;
    private _skybox: Skybox;
    private _planarShadow: PlanarShadow;
    private _mainLight: DirectionalLight;
    private _defaultMainLightNode: Node;
    private _sphereLights: SphereLight[] = [];
    private _spotLights: SpotLight[] = [];
    private _models: Model[] = [];
    private _modelId: number = 0;

    constructor (root: Root) {
        this._root = root;
        this._ambient = new Ambient (this);
        this._defaultMainLightNode = new Node('Main Light');
        this._mainLight = new DirectionalLight(this, 'Main Light', this._defaultMainLightNode);
        this._mainLight.illuminance = Ambient.SUN_ILLUM;
        this._ambient = new Ambient(this);
        this._skybox = new Skybox(this);
        this._planarShadow = new PlanarShadow(this);
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
        return true;
    }

    public destroy () {
        this.destroyCameras();
        this.destroyPointLights();
        this.destroySpotLights();
        this.destroyModels();
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

    public createSphereLight (name: string, node: Node): SphereLight | null {
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

    public createSpotLight (name: string, node: Node): SpotLight | null {
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

    public createModel<T extends Model> (clazz: new (scene: RenderScene, node: Node) => T, node: Node): T {
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
    }

    public generateModelId (): number {
        return this._modelId++;
    }

    /**
     * Cast a ray into the scene, record all the intersected models in the result array
     * @param worldRay - the testing ray
     * @param mask - the layer mask to filter the models
     * @returns the results array
     */
    public raycast (worldRay: ray, mask: number = Layers.RaycastMask): IRaycastResult[] {
        pool.reset();
        for (const m of this._models) {
            const node = m.node;
            if (!node || !m.enabled || !cc.Layers.check(node.layer, mask) || !m.modelBounds) { continue; }
            // transform ray back to model space
            mat4.invert(m4, node.getWorldMatrix(m4));
            vec3.transformMat4(modelRay.o, worldRay.o, m4);
            vec3.normalize(modelRay.d, vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
            // broadphase
            distance = intersect.ray_aabb(modelRay, m.modelBounds);
            if (distance <= 0) { continue; }
            for (let i = 0; i < m.subModelNum; ++i) {
                const subModel = m.getSubModel(i).subMeshData;
                if (subModel && subModel.geometricInfo) {
                    const { positions: vb, indices: ib, doubleSided: sides } = subModel.geometricInfo;
                    narrowphase(vb, ib, subModel.primitiveMode, sides);
                }
                if (distance < Infinity) {
                    const r = pool.add();
                    r.node = node;
                    r.distance = distance * vec3.magnitude(vec3.mul(v3, modelRay.d, node._scale));
                    results[pool.length - 1] = r;
                }
            }
        }
        results.length = pool.length;
        return results;
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

const narrowphase = (vb: Float32Array, ib: IBArray, pm: GFXPrimitiveMode, sides?: boolean) => {
    distance = Infinity;
    if (pm === GFXPrimitiveMode.TRIANGLE_LIST) {
        const cnt = ib.length;
        for (let j = 0; j < cnt; j += 3) {
            const i0 = ib[j] * 3;
            const i1 = ib[j + 1] * 3;
            const i2 = ib[j + 2] * 3;
            vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
            vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
            vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
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
            vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
            vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
            vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
            rev = ~rev;
            const dist = intersect.ray_triangle(modelRay, tri, sides);
            if (dist <= 0 || dist > distance) { continue; }
            distance = dist;
        }
    } else if (pm === GFXPrimitiveMode.TRIANGLE_FAN) {
        const cnt = ib.length - 1;
        const i0 = ib[0] * 3;
        vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
        for (let j = 1; j < cnt; j += 1) {
            const i1 = ib[j] * 3;
            const i2 = ib[j + 1] * 3;
            vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
            vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
            const dist = intersect.ray_triangle(modelRay, tri, sides);
            if (dist <= 0 || dist > distance) { continue; }
            distance = dist;
        }
    }
};
