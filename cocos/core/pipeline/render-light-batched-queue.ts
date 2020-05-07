/**
 * @category pipeline
 *              --by troublemaker52025
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXBuffer } from '../gfx/buffer';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, IRenderQueueDesc } from './define';
import { IMacroPatch } from '../renderer/core/pass'
import { UBOForwardLight } from '../pipeline/define';

/**
 * @zh
 * ligth-batched-queue
 */
export class RenderLightBatchedQueue {

    private _subModels: SubModel[] = [];
    private _psos: GFXPipelineState[] = [];
    private _lightBuffer: GFXBuffer | null = null;
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
    public updateLightBuffer (lightBuffer: GFXBuffer) {
        this._lightBuffer = lightBuffer;
    }

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear () {
        this._subModels.length = 0;
        this._psos.length = 0;
        this._lightBuffer = null;
    }

    /**
     * Push batch to lightBatchQueue
     * @param pass Pass
     * @param renderObj RenderObject
     * @param modelIdx submodels index
     * @param patches pass desc
     */
    public add (pass: Pass, renderObj: IRenderObject, modelIdx: number, patches?: IMacroPatch[]){
        if(pass.phase == this._passDesc.phases)
        {
            const nowStep = this._subModels.length;
            this._subModels.push(renderObj.model.subModels[modelIdx]);
            // keep _psos.length  =  _subModels.length
            this._psos.length = this._subModels.length;
            //@ts-ignore
            this._psos[nowStep] = renderObj.model.createPipelineState(pass, modelIdx, patches);
            const bindingLayout = this._psos[nowStep]!.pipelineLayout.layouts[0];
            if(this._lightBuffer){bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, this._lightBuffer);}
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (cmdBuff: GFXCommandBuffer) {
        for(let i = 0; i < this._subModels.length; ++i)
        {
            cmdBuff.bindPipelineState(this._psos[i]);
            let bindingLayout = this._psos[i]!.pipelineLayout.layouts[0];
            bindingLayout.update();
            cmdBuff.bindBindingLayout(bindingLayout);
            cmdBuff.bindInputAssembler(this._subModels[i].inputAssembler!);
            cmdBuff.draw(this._subModels[i].inputAssembler!);
        }
    }
}