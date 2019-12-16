
import { EffectAsset } from '../../assets/effect-asset';
import { aabb, frustum, intersect } from '../../geom-utils';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from '../../gfx/command-buffer';
import { GFXCommandBufferType, GFXStatus } from '../../gfx/define';
import { GFXInputAssembler } from '../../gfx/input-assembler';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Color, Mat4, Quat, Vec3 } from '../../math';
import { CachedArray } from '../../memop/cached-array';
import { IInternalBindingInst, UBOShadow } from '../../pipeline/define';
import { Pass } from '../core/pass';
import { selectJointsMediumType } from '../models/skeletal-animation-utils';
import { SkinningModel } from '../models/skinning-model';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { RenderScene } from './render-scene';
import { SphereLight } from './sphere-light';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _ab = new aabb();
const _qt = new Quat();
const _info: IGFXCommandBufferInfo = {
    allocator: null!,
    type: GFXCommandBufferType.SECONDARY,
};

export class PlanarShadows {

    set enabled (enable: boolean) {
        this._enabled = enable;
        if (this._scene.mainLight) { this.updateDirLight(this._scene.mainLight); }
        this._cmdBuffs.clear();
    }

    get enabled (): boolean {
        return this._enabled;
    }

    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
        if (this._scene.mainLight) { this.updateDirLight(this._scene.mainLight); }
    }
    get normal () {
        return this._normal;
    }

    set distance (val: number) {
        this._distance = val;
        if (this._scene.mainLight) { this.updateDirLight(this._scene.mainLight); }
    }
    get distance () {
        return this._distance;
    }

    set shadowColor (color: Color) {
        Color.toArray(this._data, color, UBOShadow.SHADOW_COLOR_OFFSET);
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
    protected _psoRecord = new Map<Model, GFXPipelineState>();
    protected _cbRecord = new Map<GFXInputAssembler, GFXCommandBuffer>();
    protected _passNormal: Pass;
    protected _passSkinning: Pass;

    constructor (scene: RenderScene) {
        this._scene = scene;
        this._globalBindings = scene.root.pipeline.globalBindings.get(UBOShadow.BLOCK.name)!;
        this._cmdBuffs = new CachedArray<GFXCommandBuffer>(64);
        const effectAsset = EffectAsset.get('pipeline/planar-shadow')!;
        const defines = { CC_USE_SKINNING: selectJointsMediumType(scene.root.device) };
        this._passNormal = Pass.createPasses(effectAsset, { techIdx: 0, defines: [], states: [] })[0];
        this._passSkinning = Pass.createPasses(effectAsset, { techIdx: 0, defines: [ defines ], states: [] })[0];
    }

    public updateSphereLight (light: SphereLight) {
        light.node!.getWorldPosition(_v3);
        const n = this._normal; const d = this._distance + 0.001; // avoid z-fighting
        const NdL = Vec3.dot(n, _v3);
        const lx = _v3.x; const ly = _v3.y; const lz = _v3.z;
        const nx = n.x; const ny = n.y; const nz = n.z;
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
        Mat4.toArray(this.data, this._matLight);
        this._globalBindings.buffer!.update(this.data);
    }

    public updateDirLight (light: DirectionalLight) {
        light.node!.getWorldRotation(_qt);
        Vec3.transformQuat(_v3, _forward, _qt);
        const n = this._normal; const d = this._distance + 0.001; // avoid z-fighting
        const NdL = Vec3.dot(n, _v3); const scale = 1 / NdL;
        const lx = _v3.x * scale; const ly = _v3.y * scale; const lz = _v3.z * scale;
        const nx = n.x; const ny = n.y; const nz = n.z;
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
        Mat4.toArray(this.data, this._matLight, UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET);
        this._globalBindings.buffer!.update(this.data);
    }

    public updateCommandBuffers (frstm: frustum) {
        this._cmdBuffs.clear();
        if (!this._scene.mainLight) { return; }
        for (const model of this._scene.models) {
            if (!model.enabled || !model.node || !model.castShadow) { continue; }
            if (model.worldBounds) {
                aabb.transform(_ab, model.worldBounds, this._matLight);
                if (!intersect.aabb_frustum(_ab, frstm)) { continue; }
            }
            let pso = this._psoRecord.get(model); let newOne = false;
            if (!pso) { pso = this._createPSO(model); this._psoRecord.set(model, pso); newOne = true; }
            if (!model.UBOUpdated) { model.updateUBOs(); } // for those outside the frustum
            for (let i = 0; i < model.subModelNum; i++) {
                const ia = model.getSubModel(i).inputAssembler;
                if (!ia) { continue; }
                let cb = this._cbRecord.get(ia);
                if (newOne || !cb) {
                    cb = this._createOrReuseCommandBuffer(cb);
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

    public destroyShadowModel (model: Model) {
        const pso = this._psoRecord.get(model);
        if (pso) { this._destroyPSO(model, pso); this._psoRecord.delete(model); }
        for (let i = 0; i < model.subModelNum; i++) {
            const ia = model.getSubModel(i).inputAssembler;
            const cb = this._cbRecord.get(ia!);
            if (!ia || !cb) { continue; }
            cb.destroy(); this._cbRecord.delete(ia);
        }
    }

    public onGlobalPipelineStateChanged () {
        const cbs = this._cbRecord.values();
        let cbRes = cbs.next();
        while (!cbRes.done) {
            cbRes.value.destroy();
            cbRes = cbs.next();
        }
        this._cbRecord.clear();
        const models = this._psoRecord.keys();
        let modelRes = models.next();
        while (!modelRes.done) {
            this._destroyPSO(modelRes.value, this._psoRecord.get(modelRes.value)!);
            modelRes = models.next();
        }
        this._psoRecord.clear();
    }

    public destroy () {
        this.onGlobalPipelineStateChanged();
        this._passNormal.destroy();
        this._passSkinning.destroy();
    }

    protected _createPSO (model: Model) {
        const pass = model instanceof SkinningModel ? this._passSkinning : this._passNormal;
        // @ts-ignore TS2445
        const pso = model.createPipelineState(pass);
        model.insertImplantPSO(pso); // add back to model to sync binding layouts
        pso.pipelineLayout.layouts[0].update();
        return pso;
    }

    protected _destroyPSO (model: Model, pso: GFXPipelineState) {
        const pass = model instanceof SkinningModel ? this._passSkinning : this._passNormal;
        model.removeImplantPSO(pso); pass.destroyPipelineState(pso);
    }

    protected _createOrReuseCommandBuffer (cb?: GFXCommandBuffer) {
        const device = this._scene.root.device;
        _info.allocator = device.commandAllocator;
        if (cb) {
            if (cb.status === GFXStatus.SUCCESS) { cb.destroy(); }
            cb.initialize(_info);
        } else {
            cb = device.createCommandBuffer(_info);
        }
        return cb;
    }
}
