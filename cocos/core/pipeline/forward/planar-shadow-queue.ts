import { aabb, intersect} from '../../geometry';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { SetIndex} from '../../pipeline/define';
import { GFXCommandBuffer, GFXDevice, GFXRenderPass, GFXShader} from '../../gfx';
import { InstancedBuffer } from '../../pipeline';
import { PipelineStateManager } from '../../pipeline/pipeline-state-manager';
import { Model } from '../../renderer/scene';
import { DSPool, ShaderPool, PassPool, PassView, SubModelPool, SubModelView } from '../../renderer/core/memory-pools';
import { ForwardPipeline } from './forward-pipeline';
import { ShadowType } from '../../renderer/scene/shadows';
import { RenderView } from '../render-view';
import { Layers } from '../../scene-graph/layers';

const _ab = new aabb();

interface IShadowRenderData {
    model: Model;
    shaders: GFXShader[];
    instancedBuffer: InstancedBuffer | null;
}

export class PlanarShadowQueue {
    private _pendingModels: IShadowRenderData[] = [];
    private _record = new Map<Model, IShadowRenderData>();
    protected declare _pipeline;

    constructor (pipeline: ForwardPipeline) {
        this._pipeline = pipeline;
    }

    private createShadowData (model: Model): IShadowRenderData {
        const shaders: GFXShader[] = [];
        const shadows = this._pipeline.shadows;
        const material = model.isInstancingEnabled ? shadows.instancingMaterial : shadows.material;
        const instancedBuffer = model.isInstancingEnabled ? InstancedBuffer.get(material.passes[0]) : null;
        const subModels = model.subModels;
        for (let i = 0; i < subModels.length; i++) {
            const hShader = SubModelPool.get(subModels[i].handle, SubModelView.SHADER_0);
            shaders.push(ShaderPool.get(hShader));
        }
        return { model, shaders, instancedBuffer };
    }

    public updateShadowList (view: RenderView) {
        this._pendingModels.length = 0;
        const shadows = this._pipeline.shadows;
        if (!shadows.enabled || shadows.type !== ShadowType.Planar) { return; }
        const camera = view.camera;
        const scene = camera.scene!;
        const frstm = camera.frustum;
        const shadowVisible =  (camera.visibility & Layers.BitMask.DEFAULT) !== 0;
        if (!scene.mainLight || !shadowVisible) { return; }
        const models = scene.models;

        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (!model.enabled || !model.node || !model.castShadow) { continue; }
            if (model.worldBounds) {
                aabb.transform(_ab, model.worldBounds, shadows.matLight);
                if (!intersect.aabb_frustum(_ab, frstm)) { continue; }
            }
            const data = this.createShadowData(model);
            this._pendingModels.push(data);
        }
    }

    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        const shadows = this._pipeline.shadows;
        if (!shadows.enabled || shadows.type !== ShadowType.Planar) { return; }

        const models = this._pendingModels;
        const modelLen = models.length;
        if (!modelLen) { return; }
        const buffer = InstancedBuffer.get(shadows.instancingMaterial.passes[0]);
        if (buffer) { buffer.clear(); }
        const hPass = shadows.material.passes[0].handle;
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
}
