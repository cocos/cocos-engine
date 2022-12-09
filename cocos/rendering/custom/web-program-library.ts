/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

/* eslint-disable max-len */
import { EffectAsset } from '../../asset/assets';
import { Attribute, DescriptorSetLayout, DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE, Device, MemoryAccessBit, PipelineLayout, PipelineLayoutInfo, Shader, ShaderInfo, ShaderStage, ShaderStageFlagBit, Type, Uniform, UniformBlock, UniformInputAttachment, UniformSampler, UniformSamplerTexture, UniformStorageBuffer, UniformStorageImage, UniformTexture } from '../../gfx';
import { genHandles, getActiveAttributes, getCombinationDefines, getShaderInstanceName, getSize, getVariantKey, populateMacros, prepareDefines } from '../../render-scene/core/program-utils';
import { getDeviceShaderVersion, MacroRecord } from '../../render-scene';
import { IProgramInfo } from '../../render-scene/core/program-lib';
import { DescriptorBlockData, DescriptorData, DescriptorSetData, DescriptorSetLayoutData, LayoutGraphData, LayoutGraphDataValue, PipelineLayoutData, RenderPhaseData, ShaderProgramData, UniformBlockData } from './layout-graph';
import { ProgramLibrary, ProgramProxy } from './private';
import { DescriptorTypeOrder, UpdateFrequency } from './types';
import { ProgramGroup, ProgramHost, ProgramInfo, ProgramLibraryData } from './web-types';
import { getCustomPassID, getCustomPhaseID, getOrCreateDescriptorSetLayout, getEmptyDescriptorSetLayout, getEmptyPipelineLayout, initializeDescriptorSetLayoutInfo, makeDescriptorSetLayoutData, getDescriptorSetLayout, getOrCreateDescriptorBlockData, getDescriptorID, getDescriptorTypeOrder } from './layout-graph-utils';
import { assert } from '../../core/platform/debug';
import { IDescriptorSetLayoutInfo, localDescriptorSetLayout } from '../define';

const INVALID_ID = 0xFFFFFFFF;
const _setIndex = [2, 1, 3, 0];

// make IProgramInfo from IShaderInfo
function makeProgramInfo (effectName: string, shader: EffectAsset.IShaderInfo): IProgramInfo {
    const programInfo = { ...shader } as IProgramInfo;
    programInfo.effectName = effectName;

    populateMacros(programInfo);

    return programInfo;
}

// overwrite IProgramInfo using gfx.ShaderInfo
function overwriteProgramBlockInfo (shaderInfo: ShaderInfo, programInfo: IProgramInfo) {
    const set = _setIndex[UpdateFrequency.PER_BATCH];
    for (const block of programInfo.blocks) {
        let found = false;
        for (const src of shaderInfo.blocks) {
            if (src.set !== set) {
                continue;
            }
            if (src.name === block.name) {
                block.binding = src.binding;
                found = true;
                break;
            }
        }
        if (!found) {
            console.error(`Block ${block.name} not found in shader ${shaderInfo.name}`);
        }
    }
}

// add descriptor to size-reserved descriptor set
function populateGroupedShaderInfo (
    layout: DescriptorSetLayoutData,
    descriptorInfo: EffectAsset.IDescriptorInfo,
    set: number, shaderInfo: ShaderInfo, blockSizes: number[],
) {
    for (const descriptorBlock of layout.descriptorBlocks) {
        const visibility = descriptorBlock.visibility;
        let binding = descriptorBlock.offset;

        switch (descriptorBlock.type) {
        case DescriptorTypeOrder.UNIFORM_BUFFER:
            for (const block of descriptorInfo.blocks) {
                if (block.stageFlags !== visibility) {
                    continue;
                }
                blockSizes.push(getSize(block.members));
                shaderInfo.blocks.push(
                    new UniformBlock(set, binding, block.name,
                        block.members.map((m) => new Uniform(m.name, m.type, m.count)),
                        1), // count is always 1 for UniformBlock
                );
                ++binding;
            }
            break;
        case DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER:
            // not implemented yet
            break;
        case DescriptorTypeOrder.SAMPLER_TEXTURE:
            for (const tex of descriptorInfo.samplerTextures) {
                if (tex.stageFlags !== visibility) {
                    continue;
                }
                shaderInfo.samplerTextures.push(new UniformSamplerTexture(
                    set, binding, tex.name, tex.type, tex.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.SAMPLER:
            for (const sampler of descriptorInfo.samplers) {
                if (sampler.stageFlags !== visibility) {
                    continue;
                }
                shaderInfo.samplers.push(new UniformSampler(
                    set, binding, sampler.name, sampler.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.TEXTURE:
            for (const texture of descriptorInfo.textures) {
                if (texture.stageFlags !== visibility) {
                    continue;
                }
                shaderInfo.textures.push(new UniformTexture(
                    set, binding, texture.name, texture.type, texture.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.STORAGE_BUFFER:
            for (const buffer of descriptorInfo.buffers) {
                if (buffer.stageFlags !== visibility) {
                    continue;
                }
                shaderInfo.buffers.push(new UniformStorageBuffer(
                    set, binding, buffer.name, 1, buffer.memoryAccess,
                )); // effect compiler guarantees buffer count = 1
                ++binding;
            }
            break;
        case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
            // not implemented yet
            break;
        case DescriptorTypeOrder.STORAGE_IMAGE:
            for (const image of descriptorInfo.images) {
                if (image.stageFlags !== visibility) {
                    continue;
                }
                shaderInfo.images.push(new UniformStorageImage(
                    set, binding, image.name, image.type, image.count, image.memoryAccess,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.INPUT_ATTACHMENT:
            for (const subpassInput of descriptorInfo.subpassInputs) {
                if (subpassInput.stageFlags !== visibility) {
                    continue;
                }
                shaderInfo.subpassInputs.push(new UniformInputAttachment(
                    set, subpassInput.binding, subpassInput.name, subpassInput.count,
                ));
                ++binding;
            }
            break;
        default:
        }
    }
}

// add merged descriptor to gfx.ShaderInfo
function populateMergedShaderInfo (valueNames: string[],
    layout: DescriptorSetLayoutData,
    set: number, shaderInfo: ShaderInfo, blockSizes: number[]) {
    for (const descriptorBlock of layout.descriptorBlocks) {
        let binding = descriptorBlock.offset;
        switch (descriptorBlock.type) {
        case DescriptorTypeOrder.UNIFORM_BUFFER:
            for (const block of descriptorBlock.descriptors) {
                const uniformBlock = layout.uniformBlocks.get(block.descriptorID);
                if (uniformBlock === undefined) {
                    console.error(`Failed to find uniform block ${block.descriptorID} in layout`);
                    continue;
                }
                blockSizes.push(getSize(uniformBlock.members));
                shaderInfo.blocks.push(
                    new UniformBlock(set, binding, valueNames[block.descriptorID],
                        uniformBlock.members.map((m) => new Uniform(m.name, m.type, m.count)),
                        1), // count is always 1 for UniformBlock
                );
                ++binding;
            }
            if (binding !== descriptorBlock.offset + descriptorBlock.capacity) {
                console.error(`Uniform buffer binding mismatch for set ${set}`);
            }
            break;
        case DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER:
            // not implemented yet
            break;
        case DescriptorTypeOrder.SAMPLER_TEXTURE:
            for (const tex of descriptorBlock.descriptors) {
                shaderInfo.samplerTextures.push(new UniformSamplerTexture(
                    set, binding, valueNames[tex.descriptorID], tex.type, tex.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.SAMPLER:
            for (const sampler of descriptorBlock.descriptors) {
                shaderInfo.samplers.push(new UniformSampler(
                    set, binding, valueNames[sampler.descriptorID], sampler.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.TEXTURE:
            for (const texture of descriptorBlock.descriptors) {
                shaderInfo.textures.push(new UniformTexture(
                    set, binding, valueNames[texture.descriptorID], texture.type, texture.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.STORAGE_BUFFER:
            for (const buffer of descriptorBlock.descriptors) {
                shaderInfo.buffers.push(new UniformStorageBuffer(
                    set, binding, valueNames[buffer.descriptorID], 1,
                    MemoryAccessBit.READ_WRITE/*buffer.memoryAccess*/,
                )); // effect compiler guarantees buffer count = 1
                ++binding;
            }
            break;
        case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
            // not implemented yet
            break;
        case DescriptorTypeOrder.STORAGE_IMAGE:
            for (const image of descriptorBlock.descriptors) {
                shaderInfo.images.push(new UniformStorageImage(
                    set, binding, valueNames[image.descriptorID], image.type, image.count,
                    MemoryAccessBit.READ_WRITE/*image.memoryAccess*/,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.INPUT_ATTACHMENT:
            for (const subpassInput of descriptorBlock.descriptors) {
                shaderInfo.subpassInputs.push(new UniformInputAttachment(
                    set, binding, valueNames[subpassInput.descriptorID], subpassInput.count,
                ));
                ++binding;
            }
            break;
        default:
        }
    }
}

// add descriptor from effect to gfx.ShaderInfo
function populateShaderInfo (
    descriptorInfo: EffectAsset.IDescriptorInfo,
    set: number, shaderInfo: ShaderInfo, blockSizes: number[],
) {
    for (let i = 0; i < descriptorInfo.blocks.length; i++) {
        const block = descriptorInfo.blocks[i];
        blockSizes.push(getSize(block.members));
        shaderInfo.blocks.push(new UniformBlock(set, block.binding, block.name,
            block.members.map((m) => new Uniform(m.name, m.type, m.count)), 1)); // effect compiler guarantees block count = 1
    }
    for (let i = 0; i < descriptorInfo.samplerTextures.length; i++) {
        const samplerTexture = descriptorInfo.samplerTextures[i];
        shaderInfo.samplerTextures.push(new UniformSamplerTexture(
            set, samplerTexture.binding, samplerTexture.name, samplerTexture.type, samplerTexture.count,
        ));
    }
    for (let i = 0; i < descriptorInfo.samplers.length; i++) {
        const sampler = descriptorInfo.samplers[i];
        shaderInfo.samplers.push(new UniformSampler(
            set, sampler.binding, sampler.name, sampler.count,
        ));
    }
    for (let i = 0; i < descriptorInfo.textures.length; i++) {
        const texture = descriptorInfo.textures[i];
        shaderInfo.textures.push(new UniformTexture(
            set, texture.binding, texture.name, texture.type, texture.count,
        ));
    }
    for (let i = 0; i < descriptorInfo.buffers.length; i++) {
        const buffer = descriptorInfo.buffers[i];
        shaderInfo.buffers.push(new UniformStorageBuffer(
            set, buffer.binding, buffer.name, 1, buffer.memoryAccess,
        )); // effect compiler guarantees buffer count = 1
    }
    for (let i = 0; i < descriptorInfo.images.length; i++) {
        const image = descriptorInfo.images[i];
        shaderInfo.images.push(new UniformStorageImage(
            set, image.binding, image.name, image.type, image.count, image.memoryAccess,
        ));
    }
    for (let i = 0; i < descriptorInfo.subpassInputs.length; i++) {
        const subpassInput = descriptorInfo.subpassInputs[i];
        shaderInfo.subpassInputs.push(new UniformInputAttachment(
            set, subpassInput.binding, subpassInput.name, subpassInput.count,
        ));
    }
}

// add fixed local descriptors to gfx.ShaderInfo
function populateLocalShaderInfo (
    target: EffectAsset.IDescriptorInfo,
    source: IDescriptorSetLayoutInfo, shaderInfo: ShaderInfo, blockSizes: number[],
) {
    const set = _setIndex[UpdateFrequency.PER_INSTANCE];
    for (let i = 0; i < target.blocks.length; i++) {
        const block = target.blocks[i];
        const info = source.layouts[block.name] as UniformBlock | undefined;
        const binding = info && source.bindings.find((bd) => bd.binding === info.binding);
        if (!info || !binding || !(binding.descriptorType & DESCRIPTOR_BUFFER_TYPE)) {
            console.warn(`builtin UBO '${block.name}' not available!`);
            continue;
        }
        blockSizes.push(getSize(block.members));
        shaderInfo.blocks.push(new UniformBlock(set, block.binding, block.name,
            block.members.map((m) => new Uniform(m.name, m.type, m.count)), 1)); // effect compiler guarantees block count = 1
    }
    for (let i = 0; i < target.samplerTextures.length; i++) {
        const samplerTexture = target.samplerTextures[i];
        const info = source.layouts[samplerTexture.name] as UniformSamplerTexture;
        const binding = info && source.bindings.find((bd) => bd.binding === info.binding);
        if (!info || !binding || !(binding.descriptorType & DESCRIPTOR_SAMPLER_TYPE)) {
            console.warn(`builtin samplerTexture '${samplerTexture.name}' not available!`);
            continue;
        }
        shaderInfo.samplerTextures.push(new UniformSamplerTexture(
            set, samplerTexture.binding, samplerTexture.name, samplerTexture.type, samplerTexture.count,
        ));
    }
}

// make gfx.ShaderInfo
function makeShaderInfo (
    lg: LayoutGraphData,
    passLayouts: PipelineLayoutData,
    phaseLayouts: PipelineLayoutData,
    srcShaderInfo: EffectAsset.IShaderInfo,
    programData: ShaderProgramData | null,
    fixedLocal: boolean,
): [ShaderInfo, Array<number>] {
    const shaderInfo = new ShaderInfo();
    const blockSizes = new Array<number>();
    { // pass
        const passLayout = passLayouts.descriptorSets.get(UpdateFrequency.PER_PASS);
        if (passLayout) {
            populateMergedShaderInfo(lg.valueNames, passLayout.descriptorSetLayoutData,
                _setIndex[UpdateFrequency.PER_PASS], shaderInfo, blockSizes);
        }
    }
    { // phase
        const phaseLayout = phaseLayouts.descriptorSets.get(UpdateFrequency.PER_PHASE);
        if (phaseLayout) {
            populateMergedShaderInfo(lg.valueNames, phaseLayout.descriptorSetLayoutData,
                _setIndex[UpdateFrequency.PER_PHASE], shaderInfo, blockSizes);
        }
    }
    { // batch
        const batchInfo = srcShaderInfo.descriptors[UpdateFrequency.PER_BATCH];
        if (programData) {
            const perBatch = programData.layout.descriptorSets.get(UpdateFrequency.PER_BATCH);
            if (perBatch) {
                populateMergedShaderInfo(lg.valueNames, perBatch.descriptorSetLayoutData,
                    _setIndex[UpdateFrequency.PER_BATCH], shaderInfo, blockSizes);
            }
        } else {
            const batchLayout = phaseLayouts.descriptorSets.get(UpdateFrequency.PER_BATCH);
            if (batchLayout) {
                populateGroupedShaderInfo(batchLayout.descriptorSetLayoutData,
                    batchInfo, _setIndex[UpdateFrequency.PER_BATCH],
                    shaderInfo, blockSizes);
            }
        }
    }
    { // instance
        const instanceInfo = srcShaderInfo.descriptors[UpdateFrequency.PER_INSTANCE];
        if (programData) {
            if (fixedLocal) {
                populateLocalShaderInfo(instanceInfo, localDescriptorSetLayout, shaderInfo, blockSizes);
            } else {
                const perInstance = programData.layout.descriptorSets.get(UpdateFrequency.PER_INSTANCE);
                if (perInstance) {
                    populateMergedShaderInfo(lg.valueNames, perInstance.descriptorSetLayoutData,
                        _setIndex[UpdateFrequency.PER_INSTANCE], shaderInfo, blockSizes);
                }
            }
        } else {
            const instanceLayout = phaseLayouts.descriptorSets.get(UpdateFrequency.PER_INSTANCE);
            if (instanceLayout) {
                populateGroupedShaderInfo(instanceLayout.descriptorSetLayoutData,
                    instanceInfo, _setIndex[UpdateFrequency.PER_INSTANCE],
                    shaderInfo, blockSizes);
            }
        }
    }
    shaderInfo.stages.push(new ShaderStage(ShaderStageFlagBit.VERTEX, ''));
    shaderInfo.stages.push(new ShaderStage(ShaderStageFlagBit.FRAGMENT, ''));
    return [shaderInfo, blockSizes];
}

class WebProgramProxy implements ProgramProxy {
    constructor (host: ProgramHost) {
        this.host = host;
    }
    get name (): string {
        return this.host.program.name;
    }
    get shader (): Shader {
        return this.host.program;
    }
    host: ProgramHost;
}

// find name and type from local descriptor set info
function getDescriptorNameAndType (source: IDescriptorSetLayoutInfo, binding: number): [string, Type] {
    for (const name in source.layouts) {
        const v = source.layouts[name];
        if (v.binding === binding) {
            assert(v.name === name);
            let type = Type.UNKNOWN;
            if (v instanceof UniformSamplerTexture) {
                type = v.type;
            } else if (v instanceof UniformStorageImage) {
                type = v.type;
            }
            return [v.name, type];
        }
    }
    console.error('descriptor not found');
    return ['', Type.UNKNOWN];
}

// make DescriptorSetLayoutData from local descriptor set info
function makeLocalDescriptorSetLayoutData (lg: LayoutGraphData,
    source: IDescriptorSetLayoutInfo): DescriptorSetLayoutData {
    const data = new DescriptorSetLayoutData();
    for (const b of source.bindings) {
        const [name, type] = getDescriptorNameAndType(source, b.binding);
        const nameID = getDescriptorID(lg, name);
        const order = getDescriptorTypeOrder(b.descriptorType);
        const block = new DescriptorBlockData(order, b.stageFlags, b.count);
        block.offset = b.binding;
        block.descriptors.push(new DescriptorData(nameID, type, b.count));
        data.descriptorBlocks.push(block);
        const v = source.layouts[name];
        if (v instanceof UniformBlock) {
            data.uniformBlocks.set(nameID, v);
        }
    }
    return data;
}

// make descriptor sets for ShaderProgramData (PerBatch, PerInstance)
function buildProgramData (
    programName: string,
    srcShaderInfo: EffectAsset.IShaderInfo,
    lg: LayoutGraphData, phase: RenderPhaseData, programData: ShaderProgramData,
    fixedLocal: boolean,
) {
    {
        const perBatch = makeDescriptorSetLayoutData(lg,
            UpdateFrequency.PER_BATCH,
            _setIndex[UpdateFrequency.PER_BATCH],
            srcShaderInfo.descriptors[UpdateFrequency.PER_BATCH]);
        const setData =  new DescriptorSetData(perBatch);
        initializeDescriptorSetLayoutInfo(setData.descriptorSetLayoutData,
            setData.descriptorSetLayoutInfo);
        programData.layout.descriptorSets.set(UpdateFrequency.PER_BATCH, setData);
    }
    if (fixedLocal) {
        const perInstance = makeLocalDescriptorSetLayoutData(lg, localDescriptorSetLayout);
        const setData =  new DescriptorSetData(perInstance);
        initializeDescriptorSetLayoutInfo(setData.descriptorSetLayoutData,
            setData.descriptorSetLayoutInfo);
        if (localDescriptorSetLayout.bindings.length !== setData.descriptorSetLayoutInfo.bindings.length) {
            console.error('local descriptor set layout inconsistent');
        } else {
            for (let k = 0; k !== localDescriptorSetLayout.bindings.length; ++k) {
                const b = localDescriptorSetLayout.bindings[k];
                const b2 = setData.descriptorSetLayoutInfo.bindings[k];
                if (b.binding !== b2.binding
                    || b.descriptorType !== b2.descriptorType
                    || b.count !== b2.count
                    || b.stageFlags !== b2.stageFlags) {
                    console.error('local descriptor set layout inconsistent');
                }
            }
        }
        programData.layout.descriptorSets.set(UpdateFrequency.PER_INSTANCE, setData);
    } else {
        const perInstance = makeDescriptorSetLayoutData(lg,
            UpdateFrequency.PER_INSTANCE,
            _setIndex[UpdateFrequency.PER_INSTANCE],
            srcShaderInfo.descriptors[UpdateFrequency.PER_INSTANCE]);
        const setData =  new DescriptorSetData(perInstance);
        initializeDescriptorSetLayoutInfo(setData.descriptorSetLayoutData,
            setData.descriptorSetLayoutInfo);
        programData.layout.descriptorSets.set(UpdateFrequency.PER_INSTANCE, setData);
    }
    const shaderID = phase.shaderPrograms.length;
    phase.shaderIndex.set(programName, shaderID);
    phase.shaderPrograms.push(programData);
}

// get or create PerProgram gfx.DescriptorSetLayout
function getOrCreateProgramDescriptorSetLayout (device: Device,
    lg: LayoutGraphData, phaseID: number,
    programName: string, rate: UpdateFrequency): DescriptorSetLayout {
    assert(rate < UpdateFrequency.PER_PHASE);
    const phase = lg.getRenderPhase(phaseID);
    const programID = phase.shaderIndex.get(programName);
    if (programID === undefined) {
        return getEmptyDescriptorSetLayout();
    }
    const programData = phase.shaderPrograms[programID];
    const layout = programData.layout.descriptorSets.get(rate);
    if (layout === undefined) {
        return getEmptyDescriptorSetLayout();
    }
    if (layout.descriptorSetLayout) {
        return layout.descriptorSetLayout;
    }
    layout.descriptorSetLayout = device.createDescriptorSetLayout(layout.descriptorSetLayoutInfo);

    return layout.descriptorSetLayout;
}

// get PerProgram gfx.DescriptorSetLayout
function getProgramDescriptorSetLayout (device: Device,
    lg: LayoutGraphData, phaseID: number,
    programName: string, rate: UpdateFrequency): DescriptorSetLayout | null {
    assert(rate < UpdateFrequency.PER_PHASE);
    const phase = lg.getRenderPhase(phaseID);
    const programID = phase.shaderIndex.get(programName);
    if (programID === undefined) {
        return null;
    }
    const programData = phase.shaderPrograms[programID];
    const layout = programData.layout.descriptorSets.get(rate);
    if (layout === undefined) {
        return null;
    }
    if (layout.descriptorSetLayout) {
        return layout.descriptorSetLayout;
    }
    layout.descriptorSetLayout = device.createDescriptorSetLayout(layout.descriptorSetLayoutInfo);

    return layout.descriptorSetLayout;
}

// find shader program in LayoutGraphData
function getEffectShader (lg: LayoutGraphData, effect: EffectAsset,
    pass: EffectAsset.IPassInfo): [number, number, EffectAsset.IShaderInfo | null, number] {
    const programName = pass.program;
    const passID = getCustomPassID(lg, pass.pass);
    if (passID === INVALID_ID) {
        console.error(`Invalid render pass, program: ${programName}`);
        return [INVALID_ID, INVALID_ID, null, INVALID_ID];
    }
    const phaseID = getCustomPhaseID(lg, passID, pass.phase);
    if (phaseID === INVALID_ID) {
        console.error(`Invalid render phase, program: ${programName}`);
        return [passID, INVALID_ID, null, INVALID_ID];
    }
    let srcShaderInfo: EffectAsset.IShaderInfo | null = null;
    let shaderID = INVALID_ID;
    for (let i = 0; i < effect.shaders.length; ++i) {
        const shaderInfo = effect.shaders[i];
        if (shaderInfo.name === programName) {
            srcShaderInfo = shaderInfo;
            shaderID = i;
            break;
        }
    }
    return [passID, phaseID, srcShaderInfo, shaderID];
}

// valid IShaderInfo is compatible
function validateShaderInfo (srcShaderInfo: EffectAsset.IShaderInfo): number {
    // source shader info
    if (srcShaderInfo.descriptors === undefined) {
        console.error(`No descriptors in shader: ${srcShaderInfo.name}, please reimport ALL effects`);
        return 1;
    }
    return 0;
}

export class WebProgramLibrary extends ProgramLibraryData implements ProgramLibrary {
    constructor (lg: LayoutGraphData) {
        super(lg);
        for (const v of lg.vertices()) {
            if (lg.holds(LayoutGraphDataValue.RenderPhase, v)) {
                this.phases.set(v, new ProgramGroup());
            }
        }
    }
    // add effect to database
    addEffect (effect: EffectAsset): void {
        const lg = this.layoutGraph;
        for (const tech of effect.techniques) {
            for (const pass of tech.passes) {
                const programName = pass.program;
                const [passID, phaseID, srcShaderInfo] = getEffectShader(lg, effect, pass);
                if (srcShaderInfo === null || validateShaderInfo(srcShaderInfo)) {
                    console.error(`program: ${programName} not found`);
                    continue;
                }
                assert(passID !== INVALID_ID && phaseID !== INVALID_ID);
                const passLayout = lg.getLayout(passID);
                const phaseLayout = lg.getLayout(phaseID);

                // programs
                let group = this.phases.get(phaseID);
                if (group === undefined) {
                    group = new ProgramGroup();
                    this.phases.set(phaseID, group);
                }
                const phasePrograms = group.programInfos;

                // build program
                const programInfo = makeProgramInfo(effect.name, srcShaderInfo);

                // collect program descriptors
                let programData: ShaderProgramData | null = null;
                if (!this.mergeHighFrequency) {
                    const phase = lg.getRenderPhase(phaseID);
                    programData = new ShaderProgramData();
                    buildProgramData(programName, srcShaderInfo, lg, phase, programData, this.fixedLocal);
                }

                // shaderInfo and blockSizes
                const [shaderInfo, blockSizes] = makeShaderInfo(lg, passLayout, phaseLayout,
                    srcShaderInfo, programData, this.fixedLocal);

                // overwrite programInfo
                overwriteProgramBlockInfo(shaderInfo, programInfo);

                // handle map
                const handleMap = genHandles(shaderInfo);
                // attributes
                const attributes = new Array<Attribute>();
                for (const attr of programInfo.attributes) {
                    attributes.push(new Attribute(
                        attr.name, attr.format, attr.isNormalized, 0, attr.isInstanced, attr.location,
                    ));
                }
                // create programInfo
                const info = new ProgramInfo(programInfo, shaderInfo, attributes, blockSizes, handleMap);
                phasePrograms.set(srcShaderInfo.name, info);
            }
        }
    }
    // precompile effect
    precompileEffect (device: Device, effect: EffectAsset): void {
        const lg = this.layoutGraph;
        for (const tech of effect.techniques) {
            for (const pass of tech.passes) {
                const programName = pass.program;
                const [passID, phaseID, srcShaderInfo, shaderID] = getEffectShader(lg, effect, pass);
                if (srcShaderInfo === null || validateShaderInfo(srcShaderInfo)) {
                    console.error(`program: ${programName} not valid`);
                    continue;
                }
                assert(passID !== INVALID_ID && phaseID !== INVALID_ID && shaderID !== INVALID_ID);
                const combination = effect.combinations[shaderID];
                if (!combination) {
                    continue;
                }
                const defines = getCombinationDefines(combination);
                defines.forEach(
                    (defines) => this.getProgramVariant(
                        device, phaseID, programName, defines,
                    ),
                );
            }
        }
    }
    // get IProgramInfo
    getProgramInfo (phaseID: number, programName: string): IProgramInfo {
        assert(phaseID !== INVALID_ID);
        const group = this.phases.get(phaseID)!;
        const info = group.programInfos.get(programName)!;
        return info.programInfo;
    }

    // get gfx.ShaderInfo
    getShaderInfo (phaseID: number, programName: string): ShaderInfo {
        assert(phaseID !== INVALID_ID);
        const group = this.phases.get(phaseID)!;
        const info = group.programInfos.get(programName)!;
        return info.shaderInfo;
    }
    // get shader key
    getKey (phaseID: number, programName: string, defines: MacroRecord): string {
        assert(phaseID !== INVALID_ID);
        // get phase
        const group = this.phases.get(phaseID);
        if (group === undefined) {
            console.error(`Invalid render phase, program: ${programName}`);
            return '';
        }
        // get info
        const info = group.programInfos.get(programName);
        if (info === undefined) {
            console.error(`Invalid program, program: ${programName}`);
            return '';
        }
        return getVariantKey(info.programInfo, defines);
    }
    // get program variant
    getProgramVariant (device: Device, phaseID: number, name: string, defines: MacroRecord, key: string | null = null): ProgramProxy | null {
        assert(phaseID !== INVALID_ID);
        // get phase
        const group = this.phases.get(phaseID);
        if (group === undefined) {
            console.error(`Invalid render phase, program: ${name}`);
            return null;
        }
        // get info
        const info = group.programInfos.get(name);
        if (info === undefined) {
            console.error(`Invalid program, program: ${name}`);
            return null;
        }
        const programInfo = info.programInfo;
        if (key === null) {
            key = getVariantKey(programInfo, defines);
        }

        // try get program
        const programHosts = group.programHosts;
        const programHost = programHosts.get(key);
        if (programHost !== undefined) {
            return new WebProgramProxy(programHost);
        }

        // prepare variant
        const macroArray = prepareDefines(defines, programInfo.defines);
        const prefix = this.layoutGraph.constantMacros + programInfo.constantMacros
        + macroArray.reduce((acc, cur) => `${acc}#define ${cur.name} ${cur.value}\n`, '');

        let src = programInfo.glsl3;
        const deviceShaderVersion = getDeviceShaderVersion(device);
        if (deviceShaderVersion) {
            src = programInfo[deviceShaderVersion];
        } else {
            console.error('Invalid GFX API!');
        }

        // prepare shader info
        const shaderInfo = info.shaderInfo;
        shaderInfo.stages[0].source = prefix + src.vert;
        shaderInfo.stages[1].source = prefix + src.frag;
        shaderInfo.attributes = getActiveAttributes(programInfo, info.attributes, defines);
        shaderInfo.name = getShaderInstanceName(name, macroArray);

        // create shader
        const shader = device.createShader(shaderInfo);

        // create program host and register
        const host = new ProgramHost(shader);
        programHosts.set(key, host);

        // create
        return new WebProgramProxy(host);
    }
    // get material descriptor set layout
    getMaterialDescriptorSetLayout (device: Device, phaseID: number, programName: string): DescriptorSetLayout {
        if (this.mergeHighFrequency) {
            assert(phaseID !== INVALID_ID);
            const passID = this.layoutGraph.getParent(phaseID);
            return getOrCreateDescriptorSetLayout(this.layoutGraph, passID, phaseID, UpdateFrequency.PER_BATCH);
        }
        return getOrCreateProgramDescriptorSetLayout(device, this.layoutGraph,
            phaseID, programName, UpdateFrequency.PER_BATCH);
    }
    // get local descriptor set layout
    getLocalDescriptorSetLayout (device: Device, phaseID: number, programName: string): DescriptorSetLayout {
        if (this.mergeHighFrequency) {
            assert(phaseID !== INVALID_ID);
            const passID = this.layoutGraph.getParent(phaseID);
            return getOrCreateDescriptorSetLayout(this.layoutGraph, passID, phaseID, UpdateFrequency.PER_INSTANCE);
        }
        return getOrCreateProgramDescriptorSetLayout(device, this.layoutGraph,
            phaseID, programName, UpdateFrequency.PER_INSTANCE);
    }
    // get related uniform block sizes
    getBlockSizes (phaseID: number, programName: string): number[] {
        assert(phaseID !== INVALID_ID);
        const group = this.phases.get(phaseID);
        if (!group) {
            console.error(`Invalid render phase, program: ${programName}`);
            return [];
        }
        const info = group.programInfos.get(programName);
        if (!info) {
            console.error(`Invalid program, program: ${programName}`);
            return [];
        }
        return info.blockSizes;
    }
    // get property handle map
    getHandleMap (phaseID: number, programName: string): Record<string, number> {
        assert(phaseID !== INVALID_ID);
        const group = this.phases.get(phaseID);
        if (!group) {
            console.error(`Invalid render phase, program: ${programName}`);
            return {};
        }
        const info = group.programInfos.get(programName);
        if (!info) {
            console.error(`Invalid program, program: ${programName}`);
            return {};
        }
        return info.handleMap;
    }
    // get shader pipeline layout
    getPipelineLayout (device: Device, phaseID: number, programName: string): PipelineLayout {
        if (this.mergeHighFrequency) {
            assert(phaseID !== INVALID_ID);
            const layout = this.layoutGraph.getRenderPhase(phaseID);
            return layout.pipelineLayout!;
        }
        const lg = this.layoutGraph;
        const phase = lg.getRenderPhase(phaseID);
        const programID = phase.shaderIndex.get(programName);
        if (programID === undefined) {
            return getEmptyPipelineLayout();
        }
        const programData = phase.shaderPrograms[programID];
        if (programData.pipelineLayout) {
            return programData.pipelineLayout;
        }

        // get pass
        const passID = lg.getParent(phaseID);
        if (passID === lg.nullVertex()) {
            return getEmptyPipelineLayout();
        }

        // craete pipeline layout
        const info = new PipelineLayoutInfo();
        const passSet = getDescriptorSetLayout(this.layoutGraph, passID, phaseID, UpdateFrequency.PER_PASS);
        if (passSet) {
            info.setLayouts.push(passSet);
        }
        const phaseSet = getDescriptorSetLayout(this.layoutGraph, passID, phaseID, UpdateFrequency.PER_PHASE);
        if (phaseSet) {
            info.setLayouts.push(phaseSet);
        }
        const batchSet = getProgramDescriptorSetLayout(device, lg, phaseID, programName, UpdateFrequency.PER_BATCH);
        if (batchSet) {
            info.setLayouts.push(batchSet);
        }
        const instanceSet = getProgramDescriptorSetLayout(device, lg, phaseID, programName, UpdateFrequency.PER_INSTANCE);
        if (instanceSet) {
            info.setLayouts.push(instanceSet);
        }
        programData.pipelineLayout = device.createPipelineLayout(info);
        return programData.pipelineLayout;
    }
}
