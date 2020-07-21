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

const forwardShadowMapPatches: IMacroPatch[] = [
    { name: 'CC_VSM_SHADOW', value: true },
];

/**
 * @zh
 * shadowMap-batched-queue
 */
export class RenderShadowMapBatchedQueue {
    private _subModelsArray: SubModel[] = [];
    private _psoCIArray: IPSOCreateInfo[] = [];
    private _shadowMapBuffer: GFXBuffer|null = null;

    // psoCI cache
    private _psoCICache: Map<IRenderObject, IPSOCreateInfo> = new Map();
    // pso cache
    private _psoCache: Map<SubModel, GFXPipelineState> = new Map();

    private _phaseID = getPhaseID('shadow-add');

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear (shadowMapBuffer: GFXBuffer) {
        this._subModelsArray.length = 0;
        this._psoCIArray.length = 0;
        // Put it in the destruction event ↓↓↓
        // this._psoCICache.clear();
        // this._psoCache.clear();
        this._shadowMapBuffer = shadowMapBuffer;
    }

    public add (pass: Pass, renderObj: IRenderObject, subModelIdx: number) {
        if (pass.phase === this._phaseID) {
            const subModel = renderObj.model.subModels[subModelIdx];
            const modelPatches = renderObj.model.getMacroPatches(subModelIdx);
            const fullPatches = modelPatches ? forwardShadowMapPatches.concat(modelPatches) : forwardShadowMapPatches;

            let psoCI: IPSOCreateInfo;
            if (this._psoCICache.has(renderObj)) {
                psoCI = this._psoCICache.get(renderObj)!;
            } else {
                psoCI = pass.createPipelineStateCI(fullPatches)!;
                this._psoCICache.set(renderObj, psoCI);
            }

            renderObj.model.updateLocalBindings(psoCI, subModelIdx);
            if (this._shadowMapBuffer) {
                psoCI.bindingLayout.bindBuffer(UBOShadow.BLOCK.binding, this._shadowMapBuffer);
                psoCI.bindingLayout.update();
            }

            this._subModelsArray.push(subModel);
            this._psoCIArray.push(psoCI);
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        for (let i = 0; i < this._subModelsArray.length; ++i) {
            const subModel = this._subModelsArray[i];
            const psoCI = this._psoCIArray[i];
            const ia = subModel.inputAssembler!;

            let pso: GFXPipelineState;
            if (this._psoCache.has(subModel)) {
                pso = this._psoCache.get(subModel)!;
            } else {
                pso = PipelineStateManager.getOrCreatePipelineState(device, psoCI, renderPass, ia);
                this._psoCache.set(subModel, pso);
            }

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindBindingLayout(psoCI.bindingLayout);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }

}
