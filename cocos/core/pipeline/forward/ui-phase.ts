/*
 Copyright (c) 2018-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { RenderPass } from '../../gfx';
import { PipelineStateManager } from '../pipeline-state-manager';
import { SetIndex } from '../define';
import { Camera } from '../../renderer/scene/camera';
import { RenderPipeline } from '../render-pipeline';
import { getPhaseID } from '../pass-phase';

export class UIPhase {
    private _phaseID = getPhaseID('default');
    private declare _pipeline: RenderPipeline;

    public activate (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
    }

    public render (camera: Camera, renderPass: RenderPass) {
        const pipeline = this._pipeline;
        const device = pipeline.device;
        const cmdBuff = pipeline.commandBuffers[0];
        const scene = camera.scene!;
        const batches = scene.batches;
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            let visible = false;
            if (camera.visibility & batch.visFlags) {
                visible = true;
            }

            if (!visible) continue;
            // shaders.length always equals actual used passes.length
            const count = batch.shaders.length;
            for (let j = 0; j < count; j++) {
                const pass = batch.passes[j];
                if (pass.phase !== this._phaseID) continue;
                const shader = batch.shaders[j];
                const inputAssembler = batch.inputAssembler;
                const ds = batch.descriptorSet;
                const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler!);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
                cmdBuff.bindInputAssembler(inputAssembler!);
                for (let i = 0; i < batch.drawcalls.length; i++) {
                    const ds = batch.drawcalls[i].descriptorSet;
                    cmdBuff.bindDescriptorSet(SetIndex.LOCAL, ds, batch.drawcalls[i].dynamicOffsets);
                    cmdBuff.draw(batch.drawcalls[i].drawInfo);
                }
            }
        }
    }
}
