/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass, IMacroPatch } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, UBOPCFShadow, SetIndex } from './define';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXShader } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassHandle, PassPool, PassView } from '../renderer/core/memory-pools';

const forwardShadowMapPatches: IMacroPatch[] = [
    { name: 'CC_VSM_SHADOW', value: true },
];

/**
 * @zh
 * 阴影渲染队列
 */
export class RenderShadowMapBatchedQueue {
    private _subModelsArray: SubModel[] = [];
    private _passArray: PassHandle[] = [];
    private _shaderArray: GFXShader[] = [];
    private _shadowMapBuffer: GFXBuffer | null = null;
    private _phaseID = getPhaseID('shadow-add');

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear (shadowMapBuffer: GFXBuffer) {
        this._subModelsArray.length = 0;
        this._shaderArray.length = 0;
        this._passArray.length = 0;
        this._shadowMapBuffer = shadowMapBuffer;
    }

    public add (pass: Pass, renderObj: IRenderObject, subModelIdx: number) {
        if (pass.phase === this._phaseID) {
            const subModel = renderObj.model.subModels[subModelIdx];
            const modelPatches = renderObj.model.getMacroPatches(subModelIdx);
            const fullPatches = modelPatches ? forwardShadowMapPatches.concat(modelPatches) : forwardShadowMapPatches;

            const shader = ShaderPool.get(pass.getShaderVariant(fullPatches));

            if (this._shadowMapBuffer) {
                this._subModelsArray.push(subModel);
                this._shaderArray.push(shader);
                this._passArray.push(pass.handle);
            } else {
                this._subModelsArray.length = 0;
                this._shaderArray.length = 0;
                this._passArray.length = 0;
            }
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        for (let i = 0; i < this._subModelsArray.length; ++i) {
            const subModel = this._subModelsArray[i];
            const shader = this._shaderArray[i];
            const hPass = this._passArray[i];
            const ia = subModel.inputAssembler!;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, ia);
            const descriptorSet = DSPool.get(PassPool.get(hPass, PassView.DESCRIPTOR_SET));

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }
}
