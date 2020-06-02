/**
 * @hidden
 */

import { GFXPipelineState, IGFXPipelineStateInfo, GFXInputState } from '../gfx/pipeline-state';
import { IPSOCreateInfo } from '../renderer/scene/submodel';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXInputAssembler } from '../gfx/input-assembler';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import { GFXDevice } from '../gfx/device';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, GFXPipelineState> = new Map<number, GFXPipelineState>();
    private static _inputState: GFXInputState = new GFXInputState();;

    static getOrCreatePipelineState(
        device: GFXDevice,
        psoCreateInfo: IPSOCreateInfo,
        renderPass: GFXRenderPass,
        ia: GFXInputAssembler
        ): GFXPipelineState {

        const hash1 = psoCreateInfo.hash;
        const hash2= renderPass.hash;
        const hash3 = ia.attributesHash;

        const res = `ps,${hash1},${hash2},${hash3}`;
        const newHash = murmurhash2_32_gc(res, 666);
        let pso = this._PSOHashMap.get(newHash);
        if (!pso) {
            this._inputState.attributes = ia.attributes
            const createInfo: IGFXPipelineStateInfo = {
                primitive: psoCreateInfo.primitive,
                shader: psoCreateInfo.shader,
                inputState: this._inputState,
                rasterizerState: psoCreateInfo.rasterizerState,
                depthStencilState: psoCreateInfo.depthStencilState,
                blendState: psoCreateInfo.blendState,
                dynamicStates: psoCreateInfo.dynamicStates,
                layout: psoCreateInfo.pipelineLayout,
                renderPass: renderPass,
                hash: newHash,
            };

            pso = device.createPipelineState(createInfo);
            this._PSOHashMap.set(newHash, pso);
        }
        
        return pso;
    }
}
