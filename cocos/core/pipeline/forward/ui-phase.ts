import { RenderPass, Device, CommandBuffer } from '../../gfx';
import { UI } from '../../renderer/ui/ui';
import { legacyCC } from '../../global-exports';
import { PipelineStateManager } from '../pipeline-state-manager';
import { SetIndex } from '../define';
import { IAPool, DSPool, ShaderPool } from '../../renderer/core/memory-pools';

export class UIPhase {
    // public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
    //     const ui = legacyCC.director.root.ui;
    //     const batches = ui.batches;
    //     for (let i = 0; i < batches.length; ++i) {
    //         const batch = batches.array[i];
    //         const pass = batch.material.passes[0];
    //         const shader = ShaderPool.get(pass.getShaderVariant());
    //         const inputAssembler = IAPool.get(batch.hInputAssembler);
    //         const ds = DSPool.get(batch.hDescriptorSet);
    //         const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
    //         cmdBuff.bindPipelineState(pso);
    //         cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
    //         cmdBuff.bindDescriptorSet(SetIndex.LOCAL, ds);
    //         cmdBuff.bindInputAssembler(inputAssembler);
    //         cmdBuff.draw(inputAssembler);
    //     }
    //     ui.reset();
    // }
    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        const batches = legacyCC.director.root.pipeline.renderObjects;
        for (let i = 0; i < batches.length; ++i) {
            const batch = batches[i];
            const pass = batch.pass;
            const shader = ShaderPool.get(pass.getShaderVariant());
            const inputAssembler = IAPool.get(batch.ia);
            const ds = DSPool.get(batch.ds);
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, ds);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }
    }
}