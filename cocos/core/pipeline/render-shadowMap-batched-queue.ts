/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass, IMacroPatch } from '../renderer';
import { SubModel, IPSOCreateInfo } from '../renderer/scene/submodel';
import { IRenderObject, UBOPCFShadow } from './define';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXPipelineState } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';

const forwardShadowMapPatches: IMacroPatch[] = [
    { name: 'CC_VSM_SHADOW', value: true },
];

/**
 * @zh
 * 阴影渲染队列
 */
export class RenderShadowMapBatchedQueue {
    private _subModelsArray: SubModel[] = [];
    private _psoCIArray: IPSOCreateInfo[] = [];
    private _shadowMapBuffer: GFXBuffer|null = null;

    // psoCI cache
    private _psoCICache: Map<SubModel, IPSOCreateInfo> = new Map();

    private _phaseID = getPhaseID('shadow-add');

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear (shadowMapBuffer: GFXBuffer) {
        this._subModelsArray.length = 0;
        this._psoCIArray.length = 0;
        this._shadowMapBuffer = shadowMapBuffer;
    }

    public add (pass: Pass, renderObj: IRenderObject, subModelIdx: number) {
        if (pass.phase === this._phaseID) {
            const subModel = renderObj.model.subModels[subModelIdx];
            const modelPatches = renderObj.model.getMacroPatches(subModelIdx);
            const fullPatches = modelPatches ? forwardShadowMapPatches.concat(modelPatches) : forwardShadowMapPatches;

            let psoCI: IPSOCreateInfo;
            if (this._psoCICache.has(subModel)) {
                psoCI = this._psoCICache.get(subModel)!;
            } else {
                psoCI = pass.createPipelineStateCI(fullPatches)!;
                this._psoCICache.set(subModel, psoCI);

                renderObj.model.updateLocalBindings(psoCI, subModelIdx);
                psoCI.bindingLayout.bindBuffer(UBOPCFShadow.BLOCK.binding, this._shadowMapBuffer!);
                psoCI.bindingLayout.update();
            }

            if (this._shadowMapBuffer) {
                this._subModelsArray.push(subModel);
                this._psoCIArray.push(psoCI);
            } else {
                this._subModelsArray.length = 0;
                this._psoCIArray.length = 0;
                this._psoCICache.clear();
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
            const psoCI = this._psoCIArray[i];
            const ia = subModel.inputAssembler!;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, psoCI, renderPass, ia);

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindBindingLayout(psoCI.bindingLayout);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }
}
