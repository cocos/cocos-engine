/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, UBOForwardLight, SetIndex } from './define';
import { Light } from '../renderer';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXDescriptorSet, IGFXDescriptorSetInfo, GFXDescriptorType, GFXShader } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassHandle, PassView, PassPool, SubModelPool, SubModelView } from '../renderer/core/memory-pools';

const _dsInfo: IGFXDescriptorSetInfo = { layout: null! };

function cloneDescriptorSet (device: GFXDevice, src: GFXDescriptorSet) {
    _dsInfo.layout = src.layout;
    const ds = device.createDescriptorSet(_dsInfo);
    for (let i = 0; i < _dsInfo.layout.length; i++) {
        switch (_dsInfo.layout[i]) {
            case GFXDescriptorType.UNIFORM_BUFFER:
                ds.bindBuffer(i, src.getBuffer(i));
                break;
            case GFXDescriptorType.SAMPLER:
                ds.bindSampler(i, src.getSampler(i));
                ds.bindTexture(i, src.getTexture(i));
                break;
        }
    }
    return ds;
}

interface ILightPSOCI {
    shader: GFXShader;
    descriptorSet: GFXDescriptorSet;
    hPass: PassHandle;
}

/**
 * @zh 叠加光照队列。
 */
export class RenderAdditiveLightQueue {

    private _sortedSubModelsArray: SubModel[][] = [];
    private _sortedPSOCIArray: ILightPSOCI[][] = [];
    private _phaseID = getPhaseID('forward-add');

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

    public add (renderObj: IRenderObject, subModelIdx: number, passIdx: number, beginIdx: number, endIdx: number) {
        const subModel = renderObj.model.subModels[subModelIdx];
        const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + passIdx));
        const pass = subModel.passes[passIdx];

        if (pass.phase === this._phaseID) {
            for (let i = beginIdx; i < endIdx; i++) {
                const lightIdx = this._lightIndices[i];
                const lightBuffer = this._lightBuffers[lightIdx];
                const subModelList = this._sortedSubModelsArray[lightIdx];
                const psoCIList = this._sortedPSOCIArray[lightIdx];

                // TODO: cache & reuse
                const descriptorSet = cloneDescriptorSet(pass.device, subModel.descriptorSet);
                descriptorSet.bindBuffer(UBOForwardLight.BLOCK.binding, lightBuffer);
                descriptorSet.update();

                subModelList.push(subModel);
                psoCIList.push({ hPass: pass.handle, shader, descriptorSet });
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
                const pso = PipelineStateManager.getOrCreatePipelineState(device, psoCI.hPass, psoCI.shader, renderPass, ia);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, DSPool.get(PassPool.get(psoCI.hPass, PassView.DESCRIPTOR_SET)));
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, psoCI.descriptorSet);
                cmdBuff.bindInputAssembler(ia);
                cmdBuff.draw(ia);
            }
        }
    }
}
