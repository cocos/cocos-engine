/**
 * @hidden
 */

import { GFXPipelineState, GFXInputState } from '../gfx/pipeline-state';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXInputAssembler } from '../gfx/input-assembler';
import { GFXDevice } from '../gfx/device';
import { PassPool, PassView, RasterizerStatePool, BlendStatePool, DepthStencilStatePool, PassHandle } from '../renderer/core/memory-pools';
import { GFXDynamicStateFlags, GFXShader } from '../gfx';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, GFXPipelineState> = new Map<number, GFXPipelineState>();

    static getOrCreatePipelineState (device: GFXDevice, hPass: PassHandle, shader: GFXShader, renderPass: GFXRenderPass, ia: GFXInputAssembler) {

        const hash1 = PassPool.get(hPass, PassView.HASH);
        const hash2 = renderPass.hash;
        const hash3 = ia.attributesHash;

        const newHash = hash1 ^ hash2 ^ hash3;
        let pso = this._PSOHashMap.get(newHash);
        if (!pso) {
            const inputState = new GFXInputState();
            inputState.attributes = ia.attributes;
            pso = device.createPipelineState({
                primitive: PassPool.get(hPass, PassView.PRIMITIVE),
                rasterizerState: RasterizerStatePool.get(PassPool.get(hPass, PassView.RASTERIZER_STATE)),
                depthStencilState: DepthStencilStatePool.get(PassPool.get(hPass, PassView.DEPTH_STENCIL_STATE)),
                blendState: BlendStatePool.get(PassPool.get(hPass, PassView.BLEND_STATE)),
                dynamicStates: PassPool.get(hPass, PassView.DYNAMIC_STATES) as GFXDynamicStateFlags,
                inputState,
                renderPass,
                shader,
            });
            this._PSOHashMap.set(newHash, pso);
        }

        return pso;
    }
}
