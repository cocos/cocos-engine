/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXBuffer } from '../gfx/buffer';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, IRenderQueueDesc } from './define';
import { UBOForwardLight } from '../pipeline/define';/// UBO depth

 const myForward_ShadowMap_Patches = [
     { name: 'CC_SHADOWMAP', value: true },
 ];

/**
 * @zh
 * shadowMap-batched-queue
 */
export class RenderShadowMapBatchedQueue {
    private _subModelsArray: SubModel[] = [];
    private _psoArray: GFXPipelineState[] = [];
    private _shadowMapBuffer: GFXBuffer|null = null;

    private _passDesc: IRenderQueueDesc;

    /**
     * constructor
     * @param desc Render queue description
     */
    constructor (desc: IRenderQueueDesc) {
        this._passDesc = desc;
    }

    /**
     * update lightBuffer for light-batch-queue
     * @param lightBuffer GFXBuffer for light
     */
    public updateShadowMapBuffer (shadowMapBuffer: GFXBuffer) {
        this._shadowMapBuffer = shadowMapBuffer;
    }

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear () {
        this._subModelsArray.length = 0;
        this._psoArray.length = 0;
        this._shadowMapBuffer = null;
    }

    public add (pass: Pass, renderObj: IRenderObject, modelIdx: number) {
        if (pass.phase === this._passDesc.phases) {
            const nowStep = this._subModelsArray.length;
            this._subModelsArray.push(renderObj.model.subModels[modelIdx]);

            // keep pos == subModel
            this._psoArray.length = this._subModelsArray.length;

            //@ts-ignore
            this._psoArray[nowStep] = renderObj.model.createPipelineState(pass, modelIdx, myForward_ShadowMap_Patches);
            const bindingLayout = this._psoArray[nowStep].pipelineLayout.layouts[0];
            if (this._shadowMapBuffer) { bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, this._shadowMapBuffer); }/// UBO depth
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (cmdBuff: GFXCommandBuffer) {
        for (let i = 0; i < this._subModelsArray.length; ++i) {
            cmdBuff.bindPipelineState(this._psoArray[i]);
            let bindingLayout = this._psoArray[i].pipelineLayout.layouts[0];
            bindingLayout.update();
            cmdBuff.bindBindingLayout(bindingLayout);
            cmdBuff.bindInputAssembler(this._subModelsArray[i].inputAssembler!);
            cmdBuff.draw(this._subModelsArray[i].inputAssembler!);
        }
    }
}