
import { Material } from '../../assets/material';
import { aabb, frustum, intersect } from '../../geometry';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Color, Mat4, Quat, Vec3 } from '../../math';
import { UBOShadow, SetIndex } from '../../pipeline/define';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { RenderScene } from './render-scene';
import { SphereLight } from './sphere-light';
import { GFXCommandBuffer, GFXDevice, GFXRenderPass, GFXDescriptorSet, GFXShader } from '../../gfx';
import { InstancedBuffer } from '../../pipeline/instanced-buffer';
import { PipelineStateManager } from '../../pipeline/pipeline-state-manager';
import { DSPool, ShaderPool, PassPool, PassView } from '../core/memory-pools';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _ab = new aabb();
const _qt = new Quat();

interface IShadowRenderData {
    model: Model;
    shaders: GFXShader[];
    instancedBuffer: InstancedBuffer | null;
}

export class PlanarShadows {

    set enabled (enable: boolean) {
        this._enabled = enable;
        if (this._scene.mainLight) { this.updateDirLight(this._scene.mainLight); }
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
        this._globalDescriptorSet.getBuffer(UBOShadow.BLOCK.binding).update(this.data);
    }

    get matLight () {
        return this._matLight;
    }

    get data () {
        return this._data;
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
    protected _globalDescriptorSet: GFXDescriptorSet;
    protected _record = new Map<Model, IShadowRenderData>();
    protected _pendingModels: IShadowRenderData[] = [];
    protected _material: Material;
    protected _instancingMaterial: Material;
    protected _device: GFXDevice | null = null;

    constructor (scene: RenderScene) {
        this._scene = scene;
        this._globalDescriptorSet = scene.root.pipeline.descriptorSet;
        this._material = new Material();
        this._material.initialize({ effectName: 'pipeline/planar-shadow' });
        this._instancingMaterial = new Material();
        this._instancingMaterial.initialize({ effectName: 'pipeline/planar-shadow', defines: { USE_INSTANCING: true } });
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
        this._globalDescriptorSet.getBuffer(UBOShadow.BLOCK.binding).update(this.data);
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
        this._globalDescriptorSet.getBuffer(UBOShadow.BLOCK.binding).update(this.data);
    }

    public updateShadowList (frstm: frustum, stamp: number, shadowVisible = false) {
        this._pendingModels.length = 0;
        if (!this._scene.mainLight || !shadowVisible) { return; }
        const models = this._scene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (!model.enabled || !model.node || !model.castShadow) { continue; }
            if (model.worldBounds) {
                aabb.transform(_ab, model.worldBounds, this._matLight);
                if (!intersect.aabb_frustum(_ab, frstm)) { continue; }
            }
            let data = this._record.get(model);
            if (data && (!!data.instancedBuffer !== model.isInstancingEnabled)) { this.destroyShadowData(model); data = undefined; }
            if (!data) { data = this.createShadowData(model); this._record.set(model, data); }
            if (model.updateStamp !== stamp) { model.updateUBOs(stamp); } // for those outside the frustum
            this._pendingModels.push(data);
        }
    }

    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        this._device = device;
        const models = this._pendingModels;
        const modelLen = models.length;
        if (!modelLen) { return; }
        const buffer = InstancedBuffer.get(this._instancingMaterial.passes[0]);
        if (buffer) { buffer.clear(); }
        const hPass = this._material.passes[0].handle;
        let descriptorSet = DSPool.get(PassPool.get(hPass, PassView.DESCRIPTOR_SET));
        cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
        for (let i = 0; i < modelLen; i++) {
            const { model, shaders, instancedBuffer } = models[i];
            for (let j = 0; j < shaders.length; j++) {
                const subModel = model.subModels[j];
                const shader = shaders[j];
                if (instancedBuffer) {
                    instancedBuffer.merge(subModel, model.instancedAttributes, 0);
                } else {
                    const ia = subModel.inputAssembler!;
                    const pso = PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, ia);
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
                    cmdBuff.bindInputAssembler(ia);
                    cmdBuff.draw(ia);
                }
            }
        }
        if (buffer && buffer.hasPendingModels) {
            buffer.uploadBuffers();
            descriptorSet = DSPool.get(PassPool.get(buffer.hPass, PassView.DESCRIPTOR_SET));
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
            let lastPSO: GFXPipelineState | null = null;
            for (let b = 0; b < buffer.instances.length; ++b) {
                const instance = buffer.instances[b];
                if (!instance.count) { continue; }
                const shader = ShaderPool.get(instance.hShader);
                const pso = PipelineStateManager.getOrCreatePipelineState(device, buffer.hPass, shader, renderPass, instance.ia);
                if (lastPSO !== pso) {
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindDescriptorSet(SetIndex.LOCAL, DSPool.get(instance.hDescriptorSet));
                    lastPSO = pso;
                }
                cmdBuff.bindInputAssembler(instance.ia);
                cmdBuff.draw(instance.ia);
            }
        }
    }

    public createShadowData (model: Model): IShadowRenderData {
        const shaders: GFXShader[] = [];
        const material = model.isInstancingEnabled ? this._instancingMaterial : this._material;
        const instancedBuffer = model.isInstancingEnabled ? InstancedBuffer.get(material.passes[0]) : null;
        const subModels = model.subModels;
        for (let i = 0; i < subModels.length; i++) {
            const hShader = material.passes[0].getShaderVariant(model.getMacroPatches(i));
            shaders.push(ShaderPool.get(hShader));
        }
        return { model, shaders, instancedBuffer };
    }

    public destroyShadowData (model: Model) {
        this._record.delete(model);
    }

    public destroy () {
        this._record.clear();
        this._material.destroy();
    }
}
