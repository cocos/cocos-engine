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
import { Attribute, DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, DescriptorType, Device, MemoryAccessBit, PipelineLayout, PipelineLayoutInfo, Shader, ShaderInfo, ShaderStage, ShaderStageFlagBit, Uniform, UniformBlock, UniformInputAttachment, UniformSampler, UniformSamplerTexture, UniformStorageBuffer, UniformStorageImage, UniformTexture } from '../../gfx';
import { genHandles, getActiveAttributes, getShaderInstanceName, getSize, getVariantKey, prepareDefines } from '../../render-scene/core/program-utils';
import { getDeviceShaderVersion, MacroRecord } from '../../render-scene';
import { IProgramInfo } from '../../render-scene/core/program-lib';
import { DescriptorSetData, DescriptorSetLayoutData, LayoutGraphData, LayoutGraphDataValue, PipelineLayoutData, RenderPhaseData, ShaderProgramData } from './layout-graph';
import { ProgramLibrary, ProgramProxy } from './private';
import { DescriptorTypeOrder, UpdateFrequency } from './types';
import { ProgramGroup, ProgramHost, ProgramInfo, ProgramLibraryData } from './web-types';
import { getCustomPassID, getCustomPhaseID, getOrCreateDescriptorSetLayout, getEmptyDescriptorSetLayout, getEmptyPipelineLayout, initializeDescriptorSetLayoutInfo, makeDescriptorSetLayoutData, getDescriptorSetLayout } from './layout-graph-utils';
import { assert } from '../../core/platform/debug';

const INVALID_ID = 0xFFFFFFFF;
const _descriptorSetIndex = [2, 1, 3, 0];

function getBitCount (cnt: number) {
    return Math.ceil(Math.log2(Math.max(cnt, 2)));
}

function makeProgramInfo (effectName: string, shader: EffectAsset.IShaderInfo): IProgramInfo {
    const programInfo = { ...shader } as IProgramInfo;
    programInfo.effectName = effectName;

    // calculate option mask offset
    let offset = 0;
    for (const def of programInfo.defines) {
        let cnt = 1;
        if (def.type === 'number') {
            const range = def.range!;
            cnt = getBitCount(range[1] - range[0] + 1); // inclusive on both ends
            def._map = (value: number) => value - range[0];
        } else if (def.type === 'string') {
            cnt = getBitCount(def.options!.length);
            def._map = (value: any) => Math.max(0, def.options!.findIndex((s) => s === value));
        } else if (def.type === 'boolean') {
            def._map = (value: any) => (value ? 1 : 0);
        }
        def._offset = offset;
        offset += cnt;
    }
    if (offset > 31) {
        programInfo.uber = true;
    }
    // generate constant macros
    programInfo.constantMacros = '';
    for (const key in shader.builtins.statistics) {
        programInfo.constantMacros += `#define ${key} ${shader.builtins.statistics[key]}\n`;
    }
    return programInfo;
}

function overwriteProgramBlockInfo (shaderInfo: ShaderInfo, programInfo: IProgramInfo) {
    const set = _descriptorSetIndex[UpdateFrequency.PER_BATCH];
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

function populateMixedShaderInfo (
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

function makeShaderInfo (
    lg: LayoutGraphData,
    passLayouts: PipelineLayoutData,
    phaseLayouts: PipelineLayoutData,
    srcShaderInfo: EffectAsset.IShaderInfo,
    programData: ShaderProgramData | null,
): [ShaderInfo, Array<number>] {
    const shaderInfo = new ShaderInfo();
    const blockSizes = new Array<number>();
    { // pass
        const passLayout = passLayouts.descriptorSets.get(UpdateFrequency.PER_PASS);
        if (passLayout) {
            populateMergedShaderInfo(lg.valueNames, passLayout.descriptorSetLayoutData,
                _descriptorSetIndex[UpdateFrequency.PER_PASS], shaderInfo, blockSizes);
        }
    }
    { // phase
        const phaseLayout = phaseLayouts.descriptorSets.get(UpdateFrequency.PER_PHASE);
        if (phaseLayout) {
            populateMergedShaderInfo(lg.valueNames, phaseLayout.descriptorSetLayoutData,
                _descriptorSetIndex[UpdateFrequency.PER_PHASE], shaderInfo, blockSizes);
        }
    }
    { // batch
        const batchInfo = srcShaderInfo.descriptors[UpdateFrequency.PER_BATCH];
        if (programData) {
            const perBatch = programData.layout.descriptorSets.get(UpdateFrequency.PER_BATCH);
            if (perBatch) {
                populateMergedShaderInfo(lg.valueNames, perBatch.descriptorSetLayoutData,
                    _descriptorSetIndex[UpdateFrequency.PER_BATCH], shaderInfo, blockSizes);
            }
        } else {
            const batchLayout = phaseLayouts.descriptorSets.get(UpdateFrequency.PER_BATCH);
            if (batchLayout) {
                populateMixedShaderInfo(batchLayout.descriptorSetLayoutData,
                    batchInfo, _descriptorSetIndex[UpdateFrequency.PER_BATCH],
                    shaderInfo, blockSizes);
            }
        }
    }
    { // instance
        const instanceInfo = srcShaderInfo.descriptors[UpdateFrequency.PER_INSTANCE];
        if (programData) {
            const perInstance = programData.layout.descriptorSets.get(UpdateFrequency.PER_INSTANCE);
            if (perInstance) {
                populateMergedShaderInfo(lg.valueNames, perInstance.descriptorSetLayoutData,
                    _descriptorSetIndex[UpdateFrequency.PER_INSTANCE], shaderInfo, blockSizes);
            }
        } else {
            const instanceLayout = phaseLayouts.descriptorSets.get(UpdateFrequency.PER_INSTANCE);
            if (instanceLayout) {
                populateMixedShaderInfo(instanceLayout.descriptorSetLayoutData,
                    instanceInfo, _descriptorSetIndex[UpdateFrequency.PER_INSTANCE],
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

function buildProgramData (
    programName: string,
    srcShaderInfo: EffectAsset.IShaderInfo,
    lg: LayoutGraphData, phase: RenderPhaseData, programData: ShaderProgramData,
) {
    {
        const perBatch = makeDescriptorSetLayoutData(lg,
            UpdateFrequency.PER_BATCH,
            _descriptorSetIndex[UpdateFrequency.PER_BATCH],
            srcShaderInfo.descriptors[UpdateFrequency.PER_BATCH]);
        const setData =  new DescriptorSetData(perBatch);
        initializeDescriptorSetLayoutInfo(setData.descriptorSetLayoutData,
            setData.descriptorSetLayoutInfo);
        programData.layout.descriptorSets.set(UpdateFrequency.PER_BATCH, setData);
    }
    {
        const perInstance = makeDescriptorSetLayoutData(lg,
            UpdateFrequency.PER_INSTANCE,
            _descriptorSetIndex[UpdateFrequency.PER_INSTANCE],
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

export class WebProgramLibrary extends ProgramLibraryData implements ProgramLibrary {
    constructor (lg: LayoutGraphData) {
        super(lg);
        for (const v of lg.vertices()) {
            if (lg.holds(LayoutGraphDataValue.RenderPhase, v)) {
                this.phases.set(v, new ProgramGroup());
            }
        }
    }
    addEffect (effect: EffectAsset): void {
        const lg = this.layoutGraph;
        for (const tech of effect.techniques) {
            for (const pass of tech.passes) {
                const programName = pass.program;
                // pass
                const passID = getCustomPassID(this.layoutGraph, pass.pass);
                if (passID === INVALID_ID) {
                    console.error(`Invalid render pass, program: ${programName}`);
                    continue;
                }
                const passLayout = lg.getLayout(passID);
                // phase
                const phaseID = getCustomPhaseID(this.layoutGraph, passID, pass.phase);
                if (phaseID === INVALID_ID) {
                    console.error(`Invalid render phase, program: ${programName}`);
                    continue;
                }
                const phaseLayout = lg.getLayout(phaseID);

                // programs
                let group = this.phases.get(phaseID);
                if (group === undefined) {
                    group = new ProgramGroup();
                    this.phases.set(phaseID, group);
                }
                const phasePrograms = group.programInfos;

                // source shader info
                let srcShaderInfo: EffectAsset.IShaderInfo | null = null;
                for (const shaderInfo of effect.shaders) {
                    if (shaderInfo.name === programName) {
                        srcShaderInfo = shaderInfo;
                        break;
                    }
                }
                if (!srcShaderInfo) {
                    console.error(`program: ${programName} not found`);
                    continue;
                }
                if (srcShaderInfo.descriptors === undefined) {
                    console.error(`No descriptors in shader: ${programName}, please reimport ALL effects`);
                    continue;
                }

                // build program
                const programInfo = makeProgramInfo(effect.name, srcShaderInfo);

                // collect program descriptors
                let programData: ShaderProgramData | null = null;
                if (!this.mergeHighFrequency) {
                    const phase = lg.getRenderPhase(phaseID);
                    programData = new ShaderProgramData();
                    buildProgramData(programName, srcShaderInfo, lg, phase, programData);
                }

                // shaderInfo and blockSizes
                const [shaderInfo, blockSizes] = makeShaderInfo(lg, passLayout, phaseLayout,
                    srcShaderInfo, programData);

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

    getProgramInfo (phaseID: number, programName: string): IProgramInfo {
        assert(phaseID !== INVALID_ID);
        const group = this.phases.get(phaseID)!;
        const info = group.programInfos.get(programName)!;
        return info.programInfo;
    }

    getShaderInfo (phaseID: number, programName: string): ShaderInfo {
        assert(phaseID !== INVALID_ID);
        const group = this.phases.get(phaseID)!;
        const info = group.programInfos.get(programName)!;
        return info.shaderInfo;
    }

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
    getMaterialDescriptorSetLayout (device: Device, phaseID: number, programName: string): DescriptorSetLayout {
        if (this.mergeHighFrequency) {
            assert(phaseID !== INVALID_ID);
            const passID = this.layoutGraph.getParent(phaseID);
            return getOrCreateDescriptorSetLayout(this.layoutGraph, passID, phaseID, UpdateFrequency.PER_BATCH);
        }
        return getOrCreateProgramDescriptorSetLayout(device, this.layoutGraph,
            phaseID, programName, UpdateFrequency.PER_BATCH);
    }
    getLocalDescriptorSetLayout (device: Device, phaseID: number, programName: string): DescriptorSetLayout {
        if (this.mergeHighFrequency) {
            assert(phaseID !== INVALID_ID);
            const passID = this.layoutGraph.getParent(phaseID);
            return getOrCreateDescriptorSetLayout(this.layoutGraph, passID, phaseID, UpdateFrequency.PER_INSTANCE);
        }
        return getOrCreateProgramDescriptorSetLayout(device, this.layoutGraph,
            phaseID, programName, UpdateFrequency.PER_INSTANCE);
    }
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
