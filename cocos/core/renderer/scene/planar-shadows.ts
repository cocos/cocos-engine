
import { Material } from '../../assets/material';
import { aabb, frustum, intersect } from '../../geometry';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Color, Mat4, Quat, Vec3 } from '../../math';
import { IInternalBindingInst, UBOShadow } from '../../pipeline/define';
import { DirectionalLight } from './directional-light';
import { Model } from './model';
import { SphereLight } from './sphere-light';
import { GFXCommandBuffer, GFXDevice, GFXRenderPass } from '../../gfx';
import { InstancedBuffer } from '../../pipeline/instanced-buffer';
import { PipelineStateManager } from '../../pipeline/pipeline-state-manager';
import { BindingLayoutPool, PSOCIPool, PSOCIView } from '../core/memory-pools';
import { ccclass, property } from '../../data/class-decorator';
import { CCFloat, CCBoolean } from '../../data/utils/attribute';
import { Node } from '../../scene-graph';
import { legacyCC } from '../../global-exports';
import { RenderScene } from './render-scene';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _ab = new aabb();
const _qt = new Quat();
const _up = new Vec3(0, 1, 0);

interface IShadowRenderData {
    model: Model;
    psoCIs: number[];
    instancedBuffer: InstancedBuffer | null;
}

@ccclass('cc.PlanarShadows')
export class PlanarShadows {
    /**
     * @en Whether activate planar shadow
     * @zh 是否启用平面阴影？
     */
    @property({ type: CCBoolean })
    get enabled (): boolean {
        return this._enabled;
    }

    set enabled (enable: boolean) {
        this._enabled = enable;
    }

    /**
     * @en The normal of the plane which receives shadow
     * @zh 阴影接收平面的法线
     */
    @property({ type: Vec3 })
    get normal () {
        return this._normal;
    }

    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
    }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离
     */
    @property({ type: CCFloat })
    get distance () {
        return this._distance;
    }

    set distance (val: number) {
        this._distance = val;
    }

    /**
     * @en Shadow color
     * @zh 阴影颜色
     */
    @property({ type: Color })
    get shadowColor () {
        return this._shadowColor;
    }

    set shadowColor (color: Color) {
        Color.toArray(this._data, color, UBOShadow.SHADOW_COLOR_OFFSET);
        this._globalBinding!.buffer!.update(this.data);
    }

    get matLight () {
        return this._matLight;
    }

    get data () {
        return this._data;
    }

    @property
    protected _enabled: boolean = false;
    @property
    protected _normal = new Vec3(0, 1, 0);
    @property
    protected _distance = 0;
    @property
    protected _shadowColor = new Color(0, 0, 0, 76);
    protected _matLight = new Mat4();
    protected _data = Float32Array.from([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // matLightPlaneProj
        0.0, 0.0, 0.0, 0.3, // shadowColor
    ]);
    protected _globalBinding: IInternalBindingInst | null = null;
    protected _record = new Map<Model, IShadowRenderData>();
    protected _pendingModels: IShadowRenderData[] = [];
    protected _material: Material | null = null;
    protected _instancingMaterial: Material | null = null;
    protected _device: GFXDevice|null = null;

    constructor () {

    }

    public activate () {
        const pipeline = legacyCC.director.root.pipeline;
        this._globalBinding = pipeline.globalBindings.get(UBOShadow.BLOCK.name)!;
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
        this._globalBinding!.buffer!.update(this.data);
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
        this._globalBinding!.buffer!.update(this.data);
    }

    public updateShadowList (scene: RenderScene, frstm: frustum, stamp: number, shadowVisible = false) {
        this._pendingModels.length = 0;
        if (!scene.mainLight || !shadowVisible) { return; }
        const models = scene.models;
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
        const buffer = InstancedBuffer.get(this._instancingMaterial!.passes[0], device);
        if (buffer) { buffer.clear(); }
        for (let i = 0; i < modelLen; i++) {
            const { model, psoCIs: psocis, instancedBuffer } = models[i];
            for (let j = 0; j < psocis.length; j++) {
                const submodel = model.getSubModel(j);
                const psoci = psocis[j];
                if (instancedBuffer) {
                    instancedBuffer.merge(submodel, model.instancedAttributes, psoci);
                } else {
                    const ia = submodel.inputAssembler!;
                    const pso = PipelineStateManager.getOrCreatePipelineState(device, psoci, renderPass, ia);
                    const bindingLayout = BindingLayoutPool.get(PSOCIPool.get(psoci, PSOCIView.BINDING_LAYOUT));
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindBindingLayout(bindingLayout);
                    cmdBuff.bindInputAssembler(ia);
                    cmdBuff.draw(ia);
                }
            }
        }
        if (buffer && buffer.psoci) {
            buffer.uploadBuffers();
            let lastPSO: GFXPipelineState | null = null;
            for (let b = 0; b < buffer.instances.length; ++b) {
                const instance = buffer.instances[b];
                if (!instance.count) { continue; }
                const pso = PipelineStateManager.getOrCreatePipelineState(device, buffer.psoci, renderPass, instance.ia);
                if (lastPSO !== pso) {
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindBindingLayout(BindingLayoutPool.get(PSOCIPool.get(buffer.psoci, PSOCIView.BINDING_LAYOUT)));
                    lastPSO = pso;
                }
                cmdBuff.bindInputAssembler(instance.ia);
                cmdBuff.draw(instance.ia);
            }
        }
    }

    public createShadowData (model: Model): IShadowRenderData {
        const psoCIs: number[] = [];
        const material = model.isInstancingEnabled ? this._instancingMaterial! : this._material!;
        for (let i = 0; i < model.subModelNum; i++) {
            const psoCI = material.passes[0].createPipelineStateCI(model.getMacroPatches(i));
            if (psoCI) {
                model.insertImplantPSOCI(psoCI, i); // add back to model to sync binding layouts
                BindingLayoutPool.get(PSOCIPool.get(psoCI, PSOCIView.BINDING_LAYOUT)).update();
                psoCIs.push(psoCI);
            }
        }
        return { model, psoCIs, instancedBuffer: InstancedBuffer.get(material.passes[0], this._device!) };
    }

    public destroyShadowData (model: Model) {
        const data = this._record.get(model);
        if (!data) { return; }
        const material = data.instancedBuffer ? this._instancingMaterial! : this._material!;
        for (let i = 0; i < data.psoCIs.length; i++) {
            const psoCI = data.psoCIs[i];
            model.removeImplantPSOCI(psoCI);
            material.passes[0].destroyPipelineStateCI(psoCI);
        }
        this._record.delete(model);
    }

    public onGlobalPipelineStateChanged () {
        const it = this._record.keys(); let res = it.next();
        while (!res.done) {
            this.destroyShadowData(res.value);
            res = it.next();
        }
        this._record.clear();
    }

    public destroy () {
        this.onGlobalPipelineStateChanged();
        this._material!.destroy();
        this._instancingMaterial!.destroy();
    }

    /**
     * @en Set plane which receives shadow with the given node's world transformation
     * @zh 根据指定节点的世界变换设置阴影接收平面的信息
     * @param node The node for setting up the plane
     */
    public setPlaneFromNode (node: Node) {
        node.getWorldRotation(_qt);
        this.normal = Vec3.transformQuat(_v3, _up, _qt);
        node.getWorldPosition(_v3);
        this.distance = Vec3.dot(this._normal, _v3);
    }
}
