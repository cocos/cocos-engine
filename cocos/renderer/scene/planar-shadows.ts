import { Material } from '../../3d/assets/material';
import { CachedArray } from '../../core/memop/cached-array';
import { Color, Mat4, Quat, Vec3 } from '../../core/value-types';
import { color4 } from '../../core/vmath';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType } from '../../gfx/define';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { IInternalBindingInst, UBOShadow } from '../../pipeline/define';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { RenderScene } from './render-scene';
import { SphereLight } from './sphere-light';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();

export class PlanarShadows {

    set enabled (enable: boolean) {
        this._enabled = enable;
        this.updateDirLight();
        this._cmdBuffs.clear();
    }

    get enabled (): boolean {
        return this._enabled;
    }

    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
        this.updateDirLight();
    }
    get normal () {
        return this._normal;
    }

    set distance (val: number) {
        this._distance = val;
        this.updateDirLight();
    }
    get distance () {
        return this._distance;
    }

    set shadowColor (color: Color) {
        color4.array(this._data, color, UBOShadow.SHADOW_COLOR_OFFSET);
        this._globalBindings.buffer!.update(this.data);
    }

    get matLight () {
        return this._matLight;
    }

    get data () {
        return this._data;
    }

    get cmdBuffs () {
        return this._cmdBuffs;
    }

    get cmdBuffCount () {
        return this._cmdBuffs.length;
    }

    protected _scene: RenderScene;
    protected _enabled: boolean = false;
    protected _normal = new Vec3(0, 1, 0);
    protected _distance = 0;
    protected _matLight = new Mat4();
    protected _data = Float32Array.from([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // matLightPlaneProj
        0.0, 0.0, 0.0, 0.3, // shadowColor
    ]);
    protected _globalBindings: IInternalBindingInst;
    protected _cmdBuffs: CachedArray<GFXCommandBuffer>;
    protected _cmdBuffCount = 0;
    protected _material = new Material();
    protected _psoRecord = new Map<Model, GFXPipelineState>();
    protected _cbRecord = new Map<GFXInputAssembler, GFXCommandBuffer>();

    constructor (scene: RenderScene) {
        this._scene = scene;
        this._globalBindings = scene.root.pipeline.globalBindings.get(UBOShadow.BLOCK.name)!;
        this._cmdBuffs = new CachedArray<GFXCommandBuffer>(64);
        this._material.initialize({ effectName: 'pipeline/planar-shadow' });
    }

    // tslint:disable: one-variable-per-declaration
    public updateSphereLight (light: SphereLight) {
        light.node.getWorldPosition(_v3);
        const n = this._normal, d = this._distance;
        const NdL = Vec3.dot(n, _v3);
        const lx = _v3.x, ly = _v3.y, lz = _v3.z;
        const nx = n.x, ny = n.y, nz = n.z;
        const m = this._matLight;
        m.m00 = NdL - d - lx * nx;
        m.m01 = -ly * nx;
        m.m02 = -lz * nx;
        m.m03 = -nx;
        m.m04 = -lx * ny;
        m.m05 = NdL - d - ly * ny;
        m.m06 = -lz * ny;
        m.m07 = -ny;
        m.m08 = -lx * nz;
        m.m09 = -ly * nz;
        m.m10 = NdL - d - lz * nz;
        m.m11 = -nz;
        m.m12 = lx * d;
        m.m13 = ly * d;
        m.m14 = lz * d;
        m.m15 = NdL;
        Mat4.array(this.data, this._matLight);
        this._globalBindings.buffer!.update(this.data);
    }

    public updateDirLight (light: DirectionalLight = this._scene.mainLight) {
        light.node.getWorldRotation(_qt);
        Vec3.transformQuat(_v3, _forward, _qt);
        const n = this._normal, d = this._distance;
        const NdL = Vec3.dot(n, _v3), scale = 1 / NdL;
        const lx = _v3.x * scale, ly = _v3.y * scale, lz = _v3.z * scale;
        const nx = n.x, ny = n.y, nz = n.z;
        const m = this._matLight;
        m.m00 = 1 - nx * lx;
        m.m01 = -nx * ly;
        m.m02 = -nx * lz;
        m.m03 = 0;
        m.m04 = -ny * lx;
        m.m05 = 1 - ny * ly;
        m.m06 = -ny * lz;
        m.m07 = 0;
        m.m08 = -nz * lx;
        m.m09 = -nz * ly;
        m.m10 = 1 - nz * lz;
        m.m11 = 0;
        m.m12 = lx * d;
        m.m13 = ly * d;
        m.m14 = lz * d;
        m.m15 = 1;
        Mat4.array(this.data, this._matLight, UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET);
        this._globalBindings.buffer!.update(this.data);
    }
    // tslint:enable: one-variable-per-declaration

    public updateCommandBuffers () {
        this._cmdBuffs.clear();
        if (!this._scene.mainLight.enabled) { return; }
        for (const model of this._scene.models) {
            if (!model.enabled || !model.node || !model.castShadow) { continue; }
            let pso = this._psoRecord.get(model);
            if (!pso) { pso = this._createPSO(model); this._psoRecord.set(model, pso); }
            if (!model.UBOUpdated) { model.updateUBOs(); } // for those outside the frustum
            for (let i = 0; i < model.subModelNum; i++) {
                const ia = model.getSubModel(i).inputAssembler;
                if (!ia) { continue; }
                let cb = this._cbRecord.get(ia);
                if (!cb) {
                    cb = this._createCommandBuffer();
                    cb.begin();
                    cb.bindPipelineState(pso);
                    cb.bindBindingLayout(pso.pipelineLayout.layouts[0]);
                    cb.bindInputAssembler(ia);
                    cb.draw(ia);
                    cb.end();
                    this._cbRecord.set(ia, cb);
                }
                this.cmdBuffs.push(cb);
            }
        }
    }

    public onPipelineChange () {
        const cbs = this._cbRecord.values();
        let cbRes = cbs.next();
        while (!cbRes.done) {
            cbRes.value.destroy();
            cbRes = cbs.next();
        }
        this._cbRecord.clear();
        const pass = this._material.passes[0];
        const psos = this._psoRecord.values();
        let psoRes = psos.next();
        while (!psoRes.done) {
            pass.destroyPipelineState(psoRes.value);
            psoRes = psos.next();
        }
        this._psoRecord.clear();
    }

    public destroy () {
        this.onPipelineChange();
        this._material.destroy();
    }

    protected _createPSO (model: Model) {
        // @ts-ignore
        const pso = model._doCreatePSO(this._material.passes[0]);
        pso.pipelineLayout.layouts[0].update();
        return pso;
    }

    protected _createCommandBuffer () {
        const device = this._scene.root.device;
        return device.createCommandBuffer({
            allocator: device.commandAllocator,
            type: GFXCommandBufferType.SECONDARY,
        });
    }
}
