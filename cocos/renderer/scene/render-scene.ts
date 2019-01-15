import { intersect, ray, triangle } from '../../3d/geom-utils';
import { RecyclePool } from '../../3d/memop';
import { _createSceneFun, Root } from '../../core/root';
import { mat4, vec3 } from '../../core/vmath';
import { GFXPrimitiveMode } from '../../gfx/define';
import { Layers } from '../../scene-graph/layers';
import { Camera, ICameraInfo } from './camera';
import { Light } from './light';
import { Model } from './model';

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

    public get root (): Root {
        return this._root;
    }

    public get name (): string {
        return this._name;
    }

    public get cameras (): Camera[] {
        return this._cameras;
    }

    public get lights (): Light[] {
        return this._lights;
    }

    public get models (): Model[] {
        return this._models;
    }

    public static registerCreateFunc (root: Root) {
        root._createSceneFun = (_root: Root): RenderScene => new RenderScene(_root);
    }

    private _root: Root;
    private _name: string = '';
    private _cameras: Camera[] = [];
    private _lights: Light[] = [];
    private _models: Model[] = [];
    private _modelId: number = 0;

    private constructor (root: Root) {
        this._root = root;
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;

        return true;
    }

    public destroy () {
        this.destroyCameras();
        this.destroyLights();
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
                this._cameras.slice(i);
                return;
            }
        }
    }

    public destroyCameras () {
        this._cameras = [];
    }

    public getCamera (name: string): Camera | null {
        for (const camera of this._cameras) {
            if (camera.name === name) {
                return camera;
            }
        }

        return null;
    }

    public createLight (name: string): Light {
        const light = new Light(this, name);
        this._lights.push(light);
        return light;
    }

    public destroyLight (light: Light) {
        for (let i = 0; i < this._lights.length; ++i) {
            if (this._lights[i] === light) {
                this._lights.slice(i);
                return;
            }
        }
    }

    public destroyLights () {
        this._lights = [];
    }

    public getLight (name: string): Light | null {
        for (const light of this._lights) {
            if (light.getName() === name) {
                return light;
            }
        }

        return null;
    }

    public createModel<T extends Model> (clazz: new () => T): Model {
        const model = new clazz();
        model.initialize();
        model.scene = this;
        this._models.push(model);
        return model;
    }

    public destroyModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                this._models.splice(i, 1);
                return;
            }
        }
    }

    public destroyModels () {
        this._models = [];
    }

    public generateModelId (): number {
        return this._modelId++;
    }

    /**
     * Cast a ray into the scene, record all the intersected models in the result array
     * @param worldRay - the testing ray
     * @param mask - the layer mask to filter the models
     * @return the results array
     */
    public raycast (worldRay: ray, mask: number = Layers.RaycastMask): IRaycastResult[] {
        pool.reset();
        for (const m of this._models) {
          const node = m.node;
          if (!cc.Layers.check(node.layer, mask) || !m.modelBounds) { continue; }
          // transform ray back to model space
          mat4.invert(m4, node.getWorldMatrix(m4));
          vec3.transformMat4(modelRay.o, worldRay.o, m4);
          vec3.normalize(modelRay.d, vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
          // broadphase
          distance = intersect.ray_aabb(modelRay, m.modelBounds);
          if (distance <= 0) { continue; }
          const subModel = m.subMeshData;
          if (!subModel || subModel.primitiveMode !== GFXPrimitiveMode.TRIANGLE_LIST) { continue; }
          const vbuffer = subModel.inputAssembler.getVertexBuffer(0);
          const ibuffer = subModel.inputAssembler.indexBuffer;
          if (!vbuffer || !vbuffer.buffer || !ibuffer || !ibuffer.buffer) { continue; }
          // narrowphase
          distance = Infinity;
          const vb = new Float32Array(vbuffer.buffer as ArrayBuffer);
          const ib = new Uint16Array(ibuffer.buffer as ArrayBuffer);
          const sides = subModel.doubleSided;
          for (let j = 0; j < ib.length; j += 3) {
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
          if (distance < Infinity) {
            const r = pool.add();
            r.node = node;
            r.distance = distance * vec3.magnitude(vec3.mul(v3, modelRay.d, node._scale));
            results[pool.length - 1] = r;
          }
        }
        results.length = pool.length;
        return results;
    }
}

const modelRay = ray.create();
const v3 = vec3.create();
const m4 = mat4.create();
let distance = Infinity;
const tri = triangle.create();
const pool = new RecyclePool(() => {
  return { node: null, distance: Infinity };
}, 8);
const results: IRaycastResult[] = [];
