import { RenderPass } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { PipelineStateManager } from '../pipeline-state-manager';
import { SetIndex } from '../define';
import { IAPool, DSPool, ShaderPool, UIBatchPool, UIBatchView, PassPool } from '../../renderer/core/memory-pools';
import { Layers } from '../../scene-graph/layers';
import { Camera } from '../../renderer/scene/camera';
import { ForwardPipeline } from './forward-pipeline';
import { RenderPipeline } from '../render-pipeline';

export class UIPhase {
    private declare _pipeline: RenderPipeline;

    public activate (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
    }

    public render (camera: Camera, renderPass: RenderPass) {
        const pipeline = this._pipeline as ForwardPipeline;
        const device = pipeline.device;
        const cmdBuff = pipeline.commandBuffers[0];
        const scene = camera.scene!;
        const batches = scene.batches;
        const vis = camera.visibility & Layers.BitMask.UI_2D;
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            let visible = false;
            if (vis) {
                if (camera.visibility === batch.visFlags) {
                    visible = true;
                }
            } else {
                if (camera.visibility & batch.visFlags) {
                    visible = true;
                }
            }

            if (!visible) continue;
            const handle = batch.handle;
            const count = UIBatchPool.get(handle, UIBatchView.PASS_COUNT);
            for (let j = 0; j < count; j++) {
                const pass = batch.passes[j];
                const shaderHandle = UIBatchPool.get(handle, UIBatchView.SHADER_0+j);
                const shader = ShaderPool.get(shaderHandle);
                const inputAssembler = IAPool.get(batch.hInputAssembler);
                const ds = DSPool.get(batch.hDescriptorSet);
                const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, ds);
                cmdBuff.bindInputAssembler(inputAssembler);
                cmdBuff.draw(inputAssembler);
            }
        }
    }
}
