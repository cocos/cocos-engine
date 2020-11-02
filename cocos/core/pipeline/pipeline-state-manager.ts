/**
 * @packageDocumentation
 * @hidden
 */

import { Shader, RenderPass, InputAssembler, Device, PipelineState, InputState, PipelineStateInfo } from '../gfx';
import { PassPool, PassView, RasterizerStatePool, BlendStatePool, DepthStencilStatePool, PassHandle, PipelineLayoutPool } from '../renderer/core/memory-pools';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, PipelineState> = new Map<number, PipelineState>();

    static getOrCreatePipelineState (device: Device, hPass: PassHandle, shader: Shader, renderPass: RenderPass, ia: InputAssembler) {

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
                RasterizerStatePool.get(PassPool.get(hPass, PassView.RASTERIZER_STATE)),
                DepthStencilStatePool.get(PassPool.get(hPass, PassView.DEPTH_STENCIL_STATE)),
                BlendStatePool.get(PassPool.get(hPass, PassView.BLEND_STATE)),
                PassPool.get(hPass, PassView.PRIMITIVE),
                PassPool.get(hPass, PassView.DYNAMIC_STATES),
            );
            pso = device.createPipelineState(psoInfo);
            this._PSOHashMap.set(newHash, pso);
        }

        return pso;
    }
}
