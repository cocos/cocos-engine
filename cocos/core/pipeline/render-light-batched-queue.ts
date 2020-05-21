/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXBuffer } from '../gfx/buffer';
import { GFXPipelineState } from '../gfx/pipeline-state';
import { Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, IRenderQueueDesc } from './define';
import { IMacroPatch } from '../renderer/core/pass'
import { UBOForwardLight } from '../pipeline/define';
import { Light } from '../renderer';
import { LightType } from '../renderer/scene/light';

const myForward_Light_Sphere_Patches = [
    { name: 'CC_FOWARD_ADD', value: true },
];
const myForward_Light_Spot_Patches = [
    { name: 'CC_FOWARD_ADD', value: true },
    { name: 'CC_SPOTLIGHT', value: true },
];

/**
 * @zh
 * ligth-batched-queue
 */
export class RenderLightBatchedQueue {

    private _sortedSubModelsArray: Array<SubModel[]>;
    private _sortedPSOArray: Array<GFXPipelineState[]>;
    private _lightBuffers: GFXBuffer[] = [];

    private _passDesc: IRenderQueueDesc;

    /**
     * constructor
     * @param desc Render queue description
     */
    constructor (desc: IRenderQueueDesc) {
        this._passDesc = desc;
        this._sortedSubModelsArray = new Array<SubModel[]>();
        this._sortedPSOArray = new Array<GFXPipelineState[]>();
    }

    /**
     * update lightBuffer for light-batch-queue
     * @param lightBuffer GFXBuffer for light
     */
    public updateLightBuffer (index, lightBuffer: GFXBuffer) {
        this._lightBuffers[index] = lightBuffer;
    }

    /**
     * update lightBuffer for light-batch-queue.size()
     * @param size
     */
    public updateQueueSize (lightSize: number) {
        this._sortedSubModelsArray.length = this._sortedPSOArray.length = lightSize;
        for (let i = 0; i < lightSize; ++i) {
            this._sortedSubModelsArray[i] = [];
            this._sortedPSOArray[i] = [];
        }
    }

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear () {
        for(let i = 0; i < this._sortedSubModelsArray.length; ++i)
        {
            this._sortedSubModelsArray[i].length = 0;
            this._sortedPSOArray[i].length = 0;
        }
        this._sortedSubModelsArray.length = 0;
        this._sortedPSOArray.length = 0;
        this._lightBuffers.length = 0;
    }

    public add (index: number, lightIndexOffset: number[], nextLightIndex: number, lightIndices: number[],
        validLights: Light[], pass: Pass, renderObj: IRenderObject, modelIdx: number) {
        if (pass.phase === this._passDesc.phases) {
            for (let l = lightIndexOffset[index]; l < nextLightIndex; l++) {
                const light = validLights[lightIndices[l]];
                switch (light.type) {
                    case LightType.SPHERE:
                        this.attach(lightIndices[l], pass, renderObj, modelIdx, myForward_Light_Sphere_Patches);
                        break;

                    case LightType.SPOT:
                        this.attach(lightIndices[l], pass, renderObj, modelIdx, myForward_Light_Spot_Patches);
                        break;
                }
            }
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (cmdBuff: GFXCommandBuffer) {
        for (let i = 0; i < this._sortedSubModelsArray.length; ++i) {
            for (let j = 0; j < this._sortedSubModelsArray[i].length; ++j) {
                cmdBuff.bindPipelineState(this._sortedPSOArray[i][j]);
                let bindingLayout = this._sortedPSOArray[i][j].pipelineLayout.layouts[0];
                bindingLayout.update();
                cmdBuff.bindBindingLayout(bindingLayout);
                cmdBuff.bindInputAssembler(this._sortedSubModelsArray[i][j].inputAssembler!);
                cmdBuff.draw(this._sortedSubModelsArray[i][j].inputAssembler!);
            }
        }
    }

    /**
     * Organization queue
     * @param index someOne queue
     * @param pass Pass
     * @param renderObj RenderObject
     * @param modelIdx submodel Index
     * @param patches Sphere/Spot Light
     */
    private attach (index: number, pass: Pass, renderObj: IRenderObject, modelIdx: number, patches?: IMacroPatch[]) {
        const nowStep = this._sortedSubModelsArray[index].length;
        this._sortedSubModelsArray[index].push(renderObj.model.subModels[modelIdx]);
        // keep pos == subModel
        this._sortedPSOArray[index].length = this._sortedSubModelsArray[index].length;
        //@ts-ignore
        this._sortedPSOArray[index][nowStep] = renderObj.model.createPipelineState(pass, modelIdx, patches);
        const bindingLayout = this._sortedPSOArray[index][nowStep].pipelineLayout.layouts[0];
        if (this._lightBuffers[index]) { bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, this._lightBuffers[index]); }
    }
}