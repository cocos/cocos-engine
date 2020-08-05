/**
 * @hidden
 */

import { GFXPipelineState, GFXInputState } from '../gfx/pipeline-state';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXInputAssembler } from '../gfx/input-assembler';
import { GFXDevice } from '../gfx/device';
import { PassInfoPool, PassInfoView, ShaderPool, RasterizerStatePool, BlendStatePool, DepthStencilStatePool, PSOCIPool, PSOCIView } from '../renderer/core/memory-pools';
import { GFXDynamicStateFlags } from '../gfx';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, GFXPipelineState> = new Map<number, GFXPipelineState>();

    static getOrCreatePipelineState (device: GFXDevice, psoci: number, renderPass: GFXRenderPass, ia: GFXInputAssembler) {

        const pass = PSOCIPool.get(psoci, PSOCIView.PASS_INFO);
        const hash1 = PassInfoPool.get(pass, PassInfoView.HASH);
        const hash2 = renderPass.hash;
        const hash3 = ia.attributesHash;

        const newHash = hash1 ^ hash2 ^ hash3;
        let pso = this._PSOHashMap.get(newHash);
        if (!pso) {
            const inputState = new GFXInputState();
            inputState.attributes = ia.attributes;
            pso = device.createPipelineState({
                primitive: PassInfoPool.get(pass, PassInfoView.PRIMITIVE),
                shader: ShaderPool.get(PSOCIPool.get(psoci, PSOCIView.SHADER)),
                rasterizerState: RasterizerStatePool.get(PassInfoPool.get(pass, PassInfoView.RASTERIZER_STATE)),
                depthStencilState: DepthStencilStatePool.get(PassInfoPool.get(pass, PassInfoView.DEPTH_STENCIL_STATE)),
                blendState: BlendStatePool.get(PassInfoPool.get(pass, PassInfoView.BLEND_STATE)),
                dynamicStates: PassInfoPool.get(pass, PassInfoView.DYNAMIC_STATES) as GFXDynamicStateFlags,
                inputState,
                renderPass,
            });
            this._PSOHashMap.set(newHash, pso);
        }

        return pso;
    }
}
