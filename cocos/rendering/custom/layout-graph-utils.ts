/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

/* eslint-disable max-len */
import type { LayoutGraphData, PipelineLayoutData, RenderPhaseData } from './layout-graph';
import { DescriptorBlockData, DescriptorData, DescriptorSetLayoutData, LayoutGraphDataValue } from './layout-graph';
import { EffectAsset } from '../../asset/assets';
import { assert, error, warn } from '../../core';
import { DescriptorSetInfo, DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, DescriptorType, Device, Feature, Format, FormatFeatureBit, GetTypeSize, PipelineLayout, PipelineLayoutInfo, ShaderStageFlagBit, Type, Uniform, UniformBlock } from '../../gfx';
import { UBOForwardLight, UBOSkinning } from '../define';
import { UpdateFrequency, DescriptorBlockIndex, DescriptorTypeOrder, ParameterType } from './types';

export const INVALID_ID = 0xFFFFFFFF;
export const ENABLE_SUBPASS = true;

// get DescriptorType from DescriptorTypeOrder
export function getGfxDescriptorType (type: DescriptorTypeOrder): DescriptorType {
    switch (type) {
    case DescriptorTypeOrder.UNIFORM_BUFFER:
        return DescriptorType.UNIFORM_BUFFER;
    case DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER:
        return DescriptorType.DYNAMIC_UNIFORM_BUFFER;
    case DescriptorTypeOrder.SAMPLER_TEXTURE:
        return DescriptorType.SAMPLER_TEXTURE;
    case DescriptorTypeOrder.SAMPLER:
        return DescriptorType.SAMPLER;
    case DescriptorTypeOrder.TEXTURE:
        return DescriptorType.TEXTURE;
    case DescriptorTypeOrder.STORAGE_BUFFER:
        return DescriptorType.STORAGE_BUFFER;
    case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
        return DescriptorType.DYNAMIC_STORAGE_BUFFER;
    case DescriptorTypeOrder.STORAGE_IMAGE:
        return DescriptorType.STORAGE_IMAGE;
    case DescriptorTypeOrder.INPUT_ATTACHMENT:
        return DescriptorType.INPUT_ATTACHMENT;
    default:
        error('DescriptorType not found');
        return DescriptorType.INPUT_ATTACHMENT;
    }
}

// get DescriptorTypeOrder from DescriptorType
export function getDescriptorTypeOrder (type: DescriptorType): DescriptorTypeOrder {
    switch (type) {
    case DescriptorType.UNIFORM_BUFFER:
        return DescriptorTypeOrder.UNIFORM_BUFFER;
    case DescriptorType.DYNAMIC_UNIFORM_BUFFER:
        return DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER;
    case DescriptorType.SAMPLER_TEXTURE:
        return DescriptorTypeOrder.SAMPLER_TEXTURE;
    case DescriptorType.SAMPLER:
        return DescriptorTypeOrder.SAMPLER;
    case DescriptorType.TEXTURE:
        return DescriptorTypeOrder.TEXTURE;
    case DescriptorType.STORAGE_BUFFER:
        return DescriptorTypeOrder.STORAGE_BUFFER;
    case DescriptorType.DYNAMIC_STORAGE_BUFFER:
        return DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER;
    case DescriptorType.STORAGE_IMAGE:
        return DescriptorTypeOrder.STORAGE_IMAGE;
    case DescriptorType.INPUT_ATTACHMENT:
        return DescriptorTypeOrder.INPUT_ATTACHMENT;
    case DescriptorType.UNKNOWN:
    default:
        error('DescriptorTypeOrder not found');
        return DescriptorTypeOrder.INPUT_ATTACHMENT;
    }
}

// find passID using name
export function getCustomPassID (lg: LayoutGraphData, name: string | undefined): number {
    return lg.locateChild(lg.N, name || 'default');
}

// find subpassID using name
export function getCustomSubpassID (lg: LayoutGraphData, passID: number, name: string): number {
    return lg.locateChild(passID, name);
}

// find phaseID using subpassOrPassID and phase name
export function getCustomPhaseID (lg: LayoutGraphData, subpassOrPassID: number, name: string | number | undefined): number {
    if (name === undefined) {
        return lg.locateChild(subpassOrPassID, 'default');
    }
    if (typeof (name) === 'number') {
        return lg.locateChild(subpassOrPassID, name.toString());
    }
    return lg.locateChild(subpassOrPassID, name);
}

export const DEFAULT_UNIFORM_COUNTS: Map<string, number> = new Map([
    ['cc_lightPos', UBOForwardLight.LIGHTS_PER_PASS],
    ['cc_lightColor', UBOForwardLight.LIGHTS_PER_PASS],
    ['cc_lightSizeRangeAngle', UBOForwardLight.LIGHTS_PER_PASS],
    ['cc_lightDir', UBOForwardLight.LIGHTS_PER_PASS],
    ['cc_lightBoundingSizeVS', UBOForwardLight.LIGHTS_PER_PASS],
]);

export const DYNAMIC_UNIFORM_BLOCK: Set<string> = new Set([
    'CCCamera',
    'CCForwardLight',
    'CCUILocal',
]);

export function getUniformBlockSize (blockMembers: Array<Uniform>): number {
    let prevSize: number = 0;

    for (const m of blockMembers) {
        if (m.count) {
            prevSize += GetTypeSize(m.type) * m.count;
            continue;
        }

        const iter = DEFAULT_UNIFORM_COUNTS.get(m.name);
        if (iter !== undefined) {
            prevSize += GetTypeSize(m.type) * iter;
            continue;
        }

        if (m.name === 'cc_joints') {
            const sz = GetTypeSize(m.type) * UBOSkinning.LAYOUT.members[0].count;
            assert(sz !== UBOSkinning.SIZE);
            prevSize += sz;
            continue;
        }

        error(`Invalid uniform count: ${m.name}`);
    }

    assert(!!prevSize);

    return prevSize;
}

// sort descriptorBlocks using DescriptorBlockIndex
export function sortDescriptorBlocks<T> (lhs: [string, T], rhs: [string, T]): number {
    const lhsIndex: DescriptorBlockIndex = JSON.parse(lhs[0]);
    const rhsIndex: DescriptorBlockIndex = JSON.parse(rhs[0]);
    const lhsValue = lhsIndex.updateFrequency * 10000
        + lhsIndex.parameterType * 1000
        + lhsIndex.descriptorType * 100
        + lhsIndex.visibility;
    const rhsValue = rhsIndex.updateFrequency * 10000
        + rhsIndex.parameterType * 1000
        + rhsIndex.descriptorType * 100
        + rhsIndex.visibility;
    return lhsValue - rhsValue;
}

// get descriptor nameID from name
export function getOrCreateDescriptorID (lg: LayoutGraphData, name: string): number {
    const nameID = lg.attributeIndex.get(name);
    if (nameID === undefined) {
        const newID = lg.valueNames.length;
        lg.attributeIndex.set(name, newID);
        lg.valueNames.push(name);
        return newID;
    }
    return nameID;
}

function createDescriptorInfo (layoutData: DescriptorSetLayoutData, info: DescriptorSetLayoutInfo): void {
    for (let i = 0; i < layoutData.descriptorBlocks.length; ++i) {
        const block = layoutData.descriptorBlocks[i];
        let slot = block.offset;
        for (let j = 0; j < block.descriptors.length; ++j) {
            const d = block.descriptors[j];
            const binding: DescriptorSetLayoutBinding = new DescriptorSetLayoutBinding();
            binding.binding = slot;
            binding.descriptorType = getGfxDescriptorType(block.type);
            binding.count = d.count;
            binding.stageFlags = block.visibility;
            binding.immutableSamplers = [];
            info.bindings.push(binding);
            slot += d.count;
        }
    }
}

function createDescriptorSetLayout (device: Device | null, layoutData: DescriptorSetLayoutData): DescriptorSetLayout | null {
    const info: DescriptorSetLayoutInfo = new DescriptorSetLayoutInfo();
    createDescriptorInfo(layoutData, info);

    if (device) {
        return device.createDescriptorSetLayout(info);
    } else {
        return null;
    }
}

export function createGfxDescriptorSetsAndPipelines (device: Device | null, g: LayoutGraphData): void {
    for (let i = 0; i < g._layouts.length; ++i) {
        const ppl: PipelineLayoutData = g.getLayout(i);
        ppl.descriptorSets.forEach((value, key): void => {
            const level = value;
            const layoutData = level.descriptorSetLayoutData;
            if (device) {
                const layout: DescriptorSetLayout | null = createDescriptorSetLayout(device, layoutData);
                if (layout) {
                    level.descriptorSetLayout = (layout);
                    level.descriptorSet = (device.createDescriptorSet(new DescriptorSetInfo(layout)));
                }
            } else {
                createDescriptorInfo(layoutData, level.descriptorSetLayoutInfo);
            }
        });
    }
}

// lookup DescriptorBlockData from Map
function getDescriptorBlockData (map: Map<string, DescriptorBlockData>, index: DescriptorBlockIndex): DescriptorBlockData {
    const key = JSON.stringify(index);
    const block = map.get(key);
    if (block) {
        return block;
    }
    const newBlock = new DescriptorBlockData(index.descriptorType, index.visibility, 0);
    map.set(key, newBlock);
    return newBlock;
}

// make DescriptorSetLayoutData from effect directly
export function makeDescriptorSetLayoutData (
    lg: LayoutGraphData,
    rate: UpdateFrequency,
    set: number,
    descriptors: EffectAsset.IDescriptorInfo,
): DescriptorSetLayoutData {
    const map = new Map<string, DescriptorBlockData>();
    const uniformBlocks: Map<number, UniformBlock> = new Map<number, UniformBlock>();
    for (let i = 0; i < descriptors.blocks.length; i++) {
        const cb = descriptors.blocks[i];
        const block = getDescriptorBlockData(map, {
            updateFrequency: rate,
            parameterType: ParameterType.TABLE,
            descriptorType: DescriptorTypeOrder.UNIFORM_BUFFER,
            visibility: cb.stageFlags,
        });
        const nameID = getOrCreateDescriptorID(lg, cb.name);
        block.descriptors.push(new DescriptorData(nameID, Type.UNKNOWN, 1));
        // add uniform buffer
        uniformBlocks.set(nameID, new UniformBlock(set, 0xFFFFFFFF, cb.name, cb.members, 1));
    }
    for (let i = 0; i < descriptors.samplerTextures.length; i++) {
        const samplerTexture = descriptors.samplerTextures[i];
        const block = getDescriptorBlockData(map, {
            updateFrequency: rate,
            parameterType: ParameterType.TABLE,
            descriptorType: DescriptorTypeOrder.SAMPLER_TEXTURE,
            visibility: samplerTexture.stageFlags,
        });
        const nameID = getOrCreateDescriptorID(lg, samplerTexture.name);
        block.descriptors.push(new DescriptorData(nameID, samplerTexture.type, samplerTexture.count));
    }
    for (let i = 0; i < descriptors.samplers.length; i++) {
        const sampler = descriptors.samplers[i];
        const block = getDescriptorBlockData(map, {
            updateFrequency: rate,
            parameterType: ParameterType.TABLE,
            descriptorType: DescriptorTypeOrder.SAMPLER,
            visibility: sampler.stageFlags,
        });
        const nameID = getOrCreateDescriptorID(lg, sampler.name);
        block.descriptors.push(new DescriptorData(nameID, Type.SAMPLER, sampler.count));
    }
    for (let i = 0; i < descriptors.textures.length; i++) {
        const texture = descriptors.textures[i];
        const block = getDescriptorBlockData(map, {
            updateFrequency: rate,
            parameterType: ParameterType.TABLE,
            descriptorType: DescriptorTypeOrder.TEXTURE,
            visibility: texture.stageFlags,
        });
        const nameID = getOrCreateDescriptorID(lg, texture.name);
        block.descriptors.push(new DescriptorData(nameID, texture.type, texture.count));
    }
    for (let i = 0; i < descriptors.buffers.length; i++) {
        const buffer = descriptors.buffers[i];
        const block = getDescriptorBlockData(map, {
            updateFrequency: rate,
            parameterType: ParameterType.TABLE,
            descriptorType: DescriptorTypeOrder.STORAGE_BUFFER,
            visibility: buffer.stageFlags,
        });
        const nameID = getOrCreateDescriptorID(lg, buffer.name);
        block.descriptors.push(new DescriptorData(nameID, Type.UNKNOWN, 1));
    }
    for (let i = 0; i < descriptors.images.length; i++) {
        const image = descriptors.images[i];
        const block = getDescriptorBlockData(map, {
            updateFrequency: rate,
            parameterType: ParameterType.TABLE,
            descriptorType: DescriptorTypeOrder.STORAGE_IMAGE,
            visibility: image.stageFlags,
        });
        const nameID = getOrCreateDescriptorID(lg, image.name);
        block.descriptors.push(new DescriptorData(nameID, image.type, image.count));
    }
    for (let i = 0; i < descriptors.subpassInputs.length; i++) {
        const subpassInput = descriptors.subpassInputs[i];
        const block = getDescriptorBlockData(map, {
            updateFrequency: rate,
            parameterType: ParameterType.TABLE,
            descriptorType: DescriptorTypeOrder.INPUT_ATTACHMENT,
            visibility: subpassInput.stageFlags,
        });
        const nameID = getOrCreateDescriptorID(lg, subpassInput.name);
        block.descriptors.push(new DescriptorData(nameID, Type.UNKNOWN, subpassInput.count));
    }

    // sort blocks
    const flattenedBlocks = Array.from(map).sort(sortDescriptorBlocks);
    const data = new DescriptorSetLayoutData(set, 0);
    // calculate bindings
    let capacity = 0;
    for (const [key, block] of flattenedBlocks) {
        const index = JSON.parse(key) as DescriptorBlockIndex;
        block.offset = capacity;
        for (const d of block.descriptors) {
            if (index.descriptorType === DescriptorTypeOrder.UNIFORM_BUFFER) {
                // update uniform buffer binding
                const ub = uniformBlocks.get(d.descriptorID);
                if (!ub) {
                    error(`Uniform block not found for ${d.descriptorID}`);
                    continue;
                }
                assert(ub.binding === 0xFFFFFFFF);
                ub.binding = block.capacity;
                // add uniform buffer to output
                data.uniformBlocks.set(d.descriptorID, ub);
            }
            // update block capacity
            const binding = data.bindingMap.get(d.descriptorID);
            if (binding !== undefined) {
                error(`Duplicated descriptor ${d.descriptorID}`);
            }
            data.bindingMap.set(d.descriptorID, block.offset + block.capacity);
            block.capacity += d.count;
        }
        // increate total capacity
        capacity += block.capacity;
        data.capacity += block.capacity;
        if (index.descriptorType === DescriptorTypeOrder.UNIFORM_BUFFER
            || index.descriptorType === DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER) {
            data.uniformBlockCapacity += block.capacity;
        } else if (index.descriptorType === DescriptorTypeOrder.SAMPLER_TEXTURE) {
            data.samplerTextureCapacity += block.capacity;
        }
        data.descriptorBlocks.push(block);
    }
    return data;
}

// fill DescriptorSetLayoutInfo from DescriptorSetLayoutData
export function initializeDescriptorSetLayoutInfo (
    layoutData: DescriptorSetLayoutData,
    info: DescriptorSetLayoutInfo,
): void {
    for (let i = 0; i < layoutData.descriptorBlocks.length; ++i) {
        const block = layoutData.descriptorBlocks[i];
        let slot = block.offset;
        for (let j = 0; j < block.descriptors.length; ++j) {
            const d = block.descriptors[j];
            const binding = new DescriptorSetLayoutBinding();
            binding.binding = slot;
            binding.descriptorType = getGfxDescriptorType(block.type);
            binding.count = d.count;
            binding.stageFlags = block.visibility;
            binding.immutableSamplers = [];
            info.bindings.push(binding);
            slot += d.count;
        }
    }
}

let _emptyDescriptorSetLayout: DescriptorSetLayout;
let _emptyPipelineLayout: PipelineLayout;

export function populatePipelineLayoutInfo (
    layout: PipelineLayoutData,
    rate: UpdateFrequency,
    info: PipelineLayoutInfo,
): void {
    const set = layout.descriptorSets.get(rate);
    if (set && set.descriptorSetLayout) {
        info.setLayouts.push(set.descriptorSetLayout);
    } else {
        info.setLayouts.push(_emptyDescriptorSetLayout);
    }
}

export function generateConstantMacros (device: Device, constantMacros: string): void {
    constantMacros = `
  #define CC_DEVICE_SUPPORT_FLOAT_TEXTURE ${device.getFormatFeatures(Format.RGBA32F) & (
        FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE
    ) ? '1' : '0'}
  #define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS ${device.capabilities.maxVertexUniformVectors}
  #define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS ${device.capabilities.maxFragmentUniformVectors}
  #define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT ${device.hasFeature(Feature.INPUT_ATTACHMENT_BENEFIT) ? '1' : '0'}
  #define CC_PLATFORM_ANDROID_AND_WEBGL 0
  #define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES 0
  #define CC_JOINT_UNIFORM_CAPACITY ${UBOSkinning.JOINT_UNIFORM_CAPACITY}`;
}

// initialize layout graph module
export function initializeLayoutGraphData (device: Device, lg: LayoutGraphData): void {
    // create descriptor sets
    _emptyDescriptorSetLayout = device.createDescriptorSetLayout(new DescriptorSetLayoutInfo());
    _emptyPipelineLayout = device.createPipelineLayout(new PipelineLayoutInfo());
    for (const v of lg.vertices()) {
        const layoutData = lg.getLayout(v);
        for (const [_, set] of layoutData.descriptorSets) {
            if (set.descriptorSetLayout !== null) {
                warn('descriptor set layout already initialized. It will be overwritten');
            }
            initializeDescriptorSetLayoutInfo(
                set.descriptorSetLayoutData,
                set.descriptorSetLayoutInfo,
            );
            set.descriptorSetLayout = device.createDescriptorSetLayout(set.descriptorSetLayoutInfo);
        }
    }
    // create pipeline layouts
    for (const v of lg.vertices()) {
        if (!lg.holds(LayoutGraphDataValue.RenderPhase, v)) {
            continue;
        }
        const subpassOrPassID = lg.getParent(v);
        const phaseID = v;
        const passLayout = lg.getLayout(subpassOrPassID);
        const phaseLayout = lg.getLayout(phaseID);
        const info = new PipelineLayoutInfo();
        populatePipelineLayoutInfo(passLayout, UpdateFrequency.PER_PASS, info);
        populatePipelineLayoutInfo(phaseLayout, UpdateFrequency.PER_PHASE, info);
        populatePipelineLayoutInfo(phaseLayout, UpdateFrequency.PER_BATCH, info);
        populatePipelineLayoutInfo(phaseLayout, UpdateFrequency.PER_INSTANCE, info);
        const phase = lg.j<RenderPhaseData>(phaseID);
        phase.pipelineLayout = device.createPipelineLayout(info);
    }
}

// terminate layout graph module
export function terminateLayoutGraphData (lg: LayoutGraphData): void {
    for (const v of lg.vertices()) {
        const layoutData = lg.getLayout(v);
        for (const [_, set] of layoutData.descriptorSets) {
            if (set.descriptorSetLayout !== null) {
                set.descriptorSetLayout.destroy();
            }
        }
    }
    _emptyPipelineLayout.destroy();
    _emptyDescriptorSetLayout.destroy();
}

// get empty descriptor set layout
export function getEmptyDescriptorSetLayout (): DescriptorSetLayout {
    return _emptyDescriptorSetLayout;
}

// get empty pipeline layout
export function getEmptyPipelineLayout (): PipelineLayout {
    return _emptyPipelineLayout;
}

// get descriptor set from LayoutGraphData (not from ProgramData)
export function getOrCreateDescriptorSetLayout (
    lg: LayoutGraphData,
    subpassOrPassID: number,
    phaseID: number,
    rate: UpdateFrequency,
): DescriptorSetLayout {
    if (rate < UpdateFrequency.PER_PASS) {
        const phaseData = lg.getLayout(phaseID);
        const data = phaseData.descriptorSets.get(rate);
        if (data) {
            if (!data.descriptorSetLayout) {
                error('descriptor set layout not initialized');
                return _emptyDescriptorSetLayout;
            }
            return data.descriptorSetLayout;
        }
        return _emptyDescriptorSetLayout;
    }

    assert(rate === UpdateFrequency.PER_PASS);
    assert(subpassOrPassID === lg.getParent(phaseID));

    const passData = lg.getLayout(subpassOrPassID);
    const data = passData.descriptorSets.get(rate);
    if (data) {
        if (!data.descriptorSetLayout) {
            error('descriptor set layout not initialized');
            return _emptyDescriptorSetLayout;
        }
        return data.descriptorSetLayout;
    }
    return _emptyDescriptorSetLayout;
}

// getDescriptorSetLayout from LayoutGraphData
export function getDescriptorSetLayout (
    lg: LayoutGraphData,
    subpassOrPassID: number,
    phaseID: number,
    rate: UpdateFrequency,
): DescriptorSetLayout | null {
    if (rate < UpdateFrequency.PER_PASS) {
        const phaseData = lg.getLayout(phaseID);
        const data = phaseData.descriptorSets.get(rate);
        if (data) {
            if (!data.descriptorSetLayout) {
                error('descriptor set layout not initialized');
                return null;
            }
            return data.descriptorSetLayout;
        }
        return null;
    }

    assert(rate === UpdateFrequency.PER_PASS);
    assert(subpassOrPassID === lg.getParent(phaseID));

    const passData = lg.getLayout(subpassOrPassID);
    const data = passData.descriptorSets.get(rate);
    if (data) {
        if (!data.descriptorSetLayout) {
            error('descriptor set layout not initialized');
            return null;
        }
        return data.descriptorSetLayout;
    }
    return null;
}

// get or create DescriptorBlockData from DescriptorSetLayoutData
export function getOrCreateDescriptorBlockData (
    data: DescriptorSetLayoutData,
    type: DescriptorType,
    vis: ShaderStageFlagBit,
): DescriptorBlockData {
    const order = getDescriptorTypeOrder(type);
    for (const block of data.descriptorBlocks) {
        if (block.type === order && block.visibility === vis) {
            return block;
        }
    }
    const block = new DescriptorBlockData(order, vis);
    data.descriptorBlocks.push(block);
    return block;
}

export function getProgramID (lg: LayoutGraphData, phaseID: number, programName: string): number {
    assert(phaseID !== lg.N);
    const phase = lg.j<RenderPhaseData>(phaseID);
    const programID = phase.shaderIndex.get(programName);
    if (programID === undefined) {
        return INVALID_ID;
    }
    return programID;
}

export function getDescriptorNameID (lg: LayoutGraphData, name: string): number {
    const nameID = lg.attributeIndex.get(name);
    if (nameID === undefined) {
        return INVALID_ID;
    }
    return nameID;
}

export function getDescriptorName (lg: LayoutGraphData, nameID: number): string {
    if (nameID >= lg.valueNames.length) {
        return '';
    }
    return lg.valueNames[nameID];
}

export function getPerPassDescriptorSetLayoutData (
    lg: LayoutGraphData,
    subpassOrPassID: number,
): DescriptorSetLayoutData | null {
    assert(subpassOrPassID !== lg.N);
    const node = lg.getLayout(subpassOrPassID);
    const set = node.descriptorSets.get(UpdateFrequency.PER_PASS);
    if (set === undefined) {
        return null;
    }
    return set.descriptorSetLayoutData;
}

export function getPerPhaseDescriptorSetLayoutData (
    lg: LayoutGraphData,
    phaseID: number,
): DescriptorSetLayoutData | null {
    assert(phaseID !== lg.N);
    const node = lg.getLayout(phaseID);
    const set = node.descriptorSets.get(UpdateFrequency.PER_PHASE);
    if (set === undefined) {
        return null;
    }
    return set.descriptorSetLayoutData;
}

export function getPerBatchDescriptorSetLayoutData (
    lg: LayoutGraphData,
    phaseID: number,
    programID,
): DescriptorSetLayoutData | null {
    assert(phaseID !== lg.N);
    const phase = lg.j<RenderPhaseData>(phaseID);
    assert(programID < phase.shaderPrograms.length);
    const program = phase.shaderPrograms[programID];
    const set = program.layout.descriptorSets.get(UpdateFrequency.PER_BATCH);
    if (set === undefined) {
        return null;
    }
    return set.descriptorSetLayoutData;
}

export function getPerInstanceDescriptorSetLayoutData (
    lg: LayoutGraphData,
    phaseID: number,
    programID,
): DescriptorSetLayoutData | null {
    assert(phaseID !== lg.N);
    const phase = lg.j<RenderPhaseData>(phaseID);
    assert(programID < phase.shaderPrograms.length);
    const program = phase.shaderPrograms[programID];
    const set = program.layout.descriptorSets.get(UpdateFrequency.PER_INSTANCE);
    if (set === undefined) {
        return null;
    }
    return set.descriptorSetLayoutData;
}

export function getBinding (layout: DescriptorSetLayoutData, nameID: number): number {
    const binding = layout.bindingMap.get(nameID);
    if (binding === undefined) {
        return 0xFFFFFFFF;
    }
    return binding;
}
