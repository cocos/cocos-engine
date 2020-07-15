/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass, IMacroPatch } from '../renderer';
import { SubModel, IPSOCreateInfo } from '../renderer/scene/submodel';
import { IRenderObject, UBOShadow } from './define';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXPipelineState } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';

const myForward_ShadowMap_Patches: IMacroPatch[]= [
    { name: 'CC_VSM_SHADOW', value: true },
];

/**
 * @zh
 * shadowMap-batched-queue
 */
export class RenderShadowMapBatchedQueue {
    private _subModelsArray: SubModel[] = [];
    private _psoCIArray: IPSOCreateInfo[] = [];
    private _psoArray: GFXPipelineState[] = [];
    private _shadowMapBuffer: GFXBuffer|null = null;

    private _phaseID = getPhaseID('shadow-add');

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear (shadowMapBuffer: GFXBuffer) {
        this._subModelsArray.length = 0;
        this._shadowMapBuffer = shadowMapBuffer;
    }

    public add (pass: Pass, renderObj: IRenderObject, subModelIdx: number) {
        if (pass.phase === this._phaseID) {
            const modelPatches = renderObj.model.getMacroPatches(subModelIdx);
            const fullPatches = modelPatches ? myForward_ShadowMap_Patches.concat(modelPatches) : myForward_ShadowMap_Patches;
            this._subModelsArray.push(renderObj.model.subModels[subModelIdx]);
            if (!this._psoCIArray[this._subModelsArray.length - 1]) {
                this._psoCIArray[this._subModelsArray.length - 1] = pass.createPipelineStateCI(fullPatches)!;
            }
            renderObj.model.updateLocalBindings(this._psoCIArray[this._subModelsArray.length - 1], subModelIdx);
            this._psoCIArray[this._subModelsArray.length - 1].bindingLayout.bindBuffer(UBOShadow.BLOCK.binding, this._shadowMapBuffer!);
            this._psoCIArray[this._subModelsArray.length - 1].bindingLayout.update();
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        for (let i = 0; i < this._psoCIArray.length; ++i) {
            const psoCI = this._psoCIArray[i];
            const ia = this._subModelsArray[i].inputAssembler!;
            if (!this._psoArray[i]) {
                this._psoArray[i] = PipelineStateManager.getOrCreatePipelineState(device, psoCI, renderPass, ia);
            }
            cmdBuff.bindPipelineState(this._psoArray[i]);
            cmdBuff.bindBindingLayout(psoCI.bindingLayout);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }
}