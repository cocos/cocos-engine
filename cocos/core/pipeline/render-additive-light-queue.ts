/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, UBOForwardLight } from './define';
import { IMacroPatch } from '../renderer/core/pass'
import { Light } from '../renderer';
import { LightType } from '../renderer/scene/light';
import { GFXDevice, GFXRenderPass, GFXBuffer } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { BindingLayoutPool, PSOCIPool, PSOCIView } from '../renderer/core/memory-pools';

const spherePatches = [
    { name: 'CC_FORWARD_ADD', value: true },
];
const spotPatches = [
    { name: 'CC_FORWARD_ADD', value: true },
    { name: 'CC_SPOTLIGHT', value: true },
];

export enum ShadowPatchMask {
    Sphere = 1 << 2,        // sphere light
    Spot = 1 << 3,          // spot light
}

/**
 * @zh 叠加光照队列。
 */
export class RenderAdditiveLightQueue {

    private _sortedSubModelsArray: SubModel[][] = [];
    private _sortedPSOCIArray: number[][] = [];
    private _phaseID = getPhaseID('forward-add');

    // psoCI cache
    private _psoCICache: Map<SubModel, IPSOCreateInfo> = new Map();
    // psoCI + subModel cache
    private _psoCISubModelCache: Map<SubModel, number> = new Map();

    // references
    private _validLights: Light[] = [];
    private _lightBuffers: GFXBuffer[] = [];
    private _lightIndices: number[] = [];

    /**
     * @zh
     * 清空渲染队列。
     */
    public clear (validLights: Light[], lightBuffers: GFXBuffer[], lightIndices: number[]) {
        this._validLights = validLights;
        this._lightBuffers = lightBuffers;
        this._lightIndices = lightIndices;
        this._sortedSubModelsArray.length = this._sortedPSOCIArray.length = validLights.length;
        for(let i = 0; i < validLights.length; ++i) {
            if (this._sortedPSOCIArray[i]) {
                this._sortedSubModelsArray[i].length = 0;
                this._sortedPSOCIArray[i].length = 0;
            } else {
                this._sortedSubModelsArray[i] = [];
                this._sortedPSOCIArray[i] = [];
            }
        }
    }

    public add (renderObj: IRenderObject, subModelIdx: number, pass: Pass, beginIdx: number, endIdx: number) {
        if (pass.phase === this._phaseID) {
            for (let i = beginIdx; i < endIdx; i++) {
                const lightIdx = this._lightIndices[i];
                const light = this._validLights[lightIdx];
                switch (light.type) {
                    case LightType.SPHERE:
                        this.attach(renderObj, subModelIdx, this._lightBuffers[lightIdx], lightIdx, pass, spherePatches, ShadowPatchMask.Sphere);
                        break;
                    case LightType.SPOT:
                        this.attach(renderObj, subModelIdx, this._lightBuffers[lightIdx], lightIdx, pass, spotPatches, ShadowPatchMask.Spot);
                        break;
                }
            }
        }
    }

    /**
     * @zh
     * 记录命令缓冲。
     */
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        for (let i = 0; i < this._sortedPSOCIArray.length; ++i) {
            for (let j = 0; j < this._sortedPSOCIArray[i].length; ++j) {
                const psoCI = this._sortedPSOCIArray[i][j];
                const ia = this._sortedSubModelsArray[i][j].inputAssembler!;
                const pso = PipelineStateManager.getOrCreatePipelineState(device, psoCI, renderPass, ia);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindBindingLayout(BindingLayoutPool.get(PSOCIPool.get(psoCI, PSOCIView.BINDING_LAYOUT)));
                cmdBuff.bindInputAssembler(ia);
                cmdBuff.draw(ia);
            }
        }
    }

    private attach (renderObj: IRenderObject, subModelIdx: number, lightBuffer: GFXBuffer, lightIdx: number,
        pass: Pass, patches: IMacroPatch[], shadowPathchMask: number) {
        const subModelPatchMask = renderObj.model.subModelPatchMask;
        const subModel = renderObj.model.subModels[subModelIdx];
        const subModelList = this._sortedSubModelsArray[lightIdx];
        const psoCIList = this._sortedPSOCIArray[lightIdx];
        const modelPatches = renderObj.model.getMacroPatches(subModelIdx);
        const fullPatches = modelPatches ? patches.concat(modelPatches) : patches;
        let psoCI: IPSOCreateInfo;
        if (this._psoCICache.has(subModel) && this._psoCISubModelCache.get(subModel) === patcheMask) {
            psoCI = this._psoCICache.get(subModel)!;
        } else {
        const psoCI = pass.createPipelineStateCI(fullPatches)!;
            this._psoCICache.set(subModel, psoCI);
            this._psoCISubModelCache.set(subModel, patcheMask);
        renderObj.model.updateLocalBindings(psoCI, subModelIdx);
        const bindingLayout = BindingLayoutPool.get(PSOCIPool.get(psoCI, PSOCIView.BINDING_LAYOUT));
        bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, lightBuffer);
        bindingLayout.update();

        subModelList.push(renderObj.model.subModels[subModelIdx]);
        psoCIList.push(psoCI);
    }
}
