/**
 * @hidden
 */

import { GFXPipelineState, GFXInputState } from '../gfx/pipeline-state';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXInputAssembler } from '../gfx/input-assembler';
import { GFXDevice } from '../gfx/device';
import { PassPool, PassView, RasterizerStatePool, BlendStatePool, DepthStencilStatePool, PassHandle, PipelineLayoutPool } from '../renderer/core/memory-pools';
import { GFXDynamicStateFlags, GFXShader } from '../gfx';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, GFXPipelineState> = new Map<number, GFXPipelineState>();

    static getOrCreatePipelineState (device: GFXDevice, hPass: PassHandle, shader: GFXShader, renderPass: GFXRenderPass, ia: GFXInputAssembler) {

        const hash1 = PassPool.get(hPass, PassView.HASH);
        const hash2 = renderPass.hash;
        const hash3 = ia.attributesHash;
        const hash4 = shader.id;

        const newHash = hash1 ^ hash2 ^ hash3 ^ hash4;
        let pso = this._PSOHashMap.get(newHash);
        if (!pso) {
            const pipelineLayout = PipelineLayoutPool.get(PassPool.get(hPass, PassView.PIPELINE_LAYOUT));
            const inputState = new GFXInputState();
            inputState.attributes = ia.attributes;
            pso = device.createPipelineState({
                primitive: PassPool.get(hPass, PassView.PRIMITIVE),
                rasterizerState: RasterizerStatePool.get(PassPool.get(hPass, PassView.RASTERIZER_STATE)),
                depthStencilState: DepthStencilStatePool.get(PassPool.get(hPass, PassView.DEPTH_STENCIL_STATE)),
                blendState: BlendStatePool.get(PassPool.get(hPass, PassView.BLEND_STATE)),
                dynamicStates: PassPool.get(hPass, PassView.DYNAMIC_STATES),
                inputState,
                renderPass,
                shader,
                pipelineLayout,
            });
            this._PSOHashMap.set(newHash, pso);
        }

        return pso;
    }
}
