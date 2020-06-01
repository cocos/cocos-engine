/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXBuffer } from '../gfx/buffer';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, IRenderQueueDesc } from './define';
import { UBOForwardLight } from '../pipeline/define';

 const myForward_Depth_Patches = [
     { name: 'CC_DEPTH', value: true },
 ];

/**
 * @zh
 * depth-batched-queue
 */
export class RenderDepthBatchedQueue {
    private _subModelsArray: SubModel[] = [];
    private _psoArray: GFXPipelineState[] = [];
    private _depthBuffer: GFXBuffer|null = null;

    /**
     * constructor
     * @param desc Render queue description
     */
    constructor () {
    }

    /**
     * update depthBuffer for depth-batch-queue
     * @param depthBuffer GFXBuffer for depth
     */
    public updateDepthBuffer (depthBuffer: GFXBuffer) {
        this._depthBuffer = depthBuffer;
    }

    /**
     * @zh
     * clear depth-Batched-Queue
     */
    public clear () {
        this._subModelsArray.length = 0;
        this._psoArray.length = 0;
        this._depthBuffer = null;
    }

    public add (renderObj: IRenderObject, modelIdx: number) {
        const nowStep = this._subModelsArray.length;
        this._subModelsArray.push(renderObj.model.subModels[modelIdx]);

        // keep pos == subModel
        this._psoArray.length = this._subModelsArray.length;

        //@ts-ignore
        this._psoArray[nowStep] = renderObj.model.createPipelineState(pass, modelIdx, myForward_Depth_Patches);
        const bindingLayout = this._psoArray[nowStep].pipelineLayout.layouts[0];
        if (this._depthBuffer) { bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, this._depthBuffer); }/// UBO depth
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