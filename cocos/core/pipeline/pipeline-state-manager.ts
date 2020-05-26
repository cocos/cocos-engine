/**
 * @hidden
 */

import { GFXPipelineState, IGFXPipelineStateInfo } from '../gfx/pipeline-state';
import { IPSOCreationInfo } from '../renderer/scene/submodel';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXInputAssembler } from '../gfx/input-assembler';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import { GFXDevice } from '../gfx/device';

export class PipelineStateManager {
    private static _PSOHashMap: Map<number, GFXPipelineState> = new Map<number, GFXPipelineState>();

    static getOrCreatePipelineState(
        device: GFXDevice,
        psoCreateInfo: IPSOCreationInfo,
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
                const createInfo: IGFXPipelineStateInfo = {
                    primitive: psoCreateInfo.primitive,
                    shader: psoCreateInfo.shader,
                    inputAssember: ia,
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
