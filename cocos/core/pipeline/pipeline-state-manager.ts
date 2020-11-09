/**
 * @packageDocumentation
 * @hidden
 */

import { Shader, RenderPass, InputAssembler, Device, PipelineState, InputState, PipelineStateInfo } from '../gfx';
import { PassPool, PassView, PassHandle, PipelineLayoutPool } from '../renderer/core/memory-pools';
import { Pass } from '../renderer/core/pass';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, PipelineState> = new Map<number, PipelineState>();

    // pass is only needed on TS.
    static getOrCreatePipelineState (device: Device, pass: Pass, shader: Shader, renderPass: RenderPass, ia: InputAssembler) {

        const hPass = pass.handle;
        const hash1 = PassPool.get(hPass, PassView.HASH);
        const hash2 = renderPass.hash;
        const hash3 = ia.attributesHash;
        const hash4 = shader.id;

        const newHash = hash1 ^ hash2 ^ hash3 ^ hash4;
        let pso = this._PSOHashMap.get(newHash);
        if (!pso) {
            const pipelineLayout = PipelineLayoutPool.get(PassPool.get(hPass, PassView.PIPELINE_LAYOUT));
            const inputState = new InputState(ia.attributes);
            const psoInfo = new PipelineStateInfo(
                shader, pipelineLayout, renderPass, inputState,
                pass.rasterizerState,
                pass.depthStencilState,
                pass.blendState,
                PassPool.get(hPass, PassView.PRIMITIVE),
                PassPool.get(hPass, PassView.DYNAMIC_STATES),
            );
            pso = device.createPipelineState(psoInfo);
            this._PSOHashMap.set(newHash, pso);
        }

        return pso;
    }
}
