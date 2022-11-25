/*
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

import { EDITOR } from 'internal:constants';
import { Pipeline, PipelineBuilder } from './pipeline';
import { WebPipeline } from './web-pipeline';
import { buildDeferredLayout, buildForwardLayout, replacePerBatchOrInstanceShaderInfo } from './effect';
import { macro } from '../../core';
import { DeferredPipelineBuilder, ForwardPipelineBuilder } from './builtin-pipelines';
import { CustomPipelineBuilder, NativePipelineBuilder } from './custom-pipeline';
import { DescriptorSetLayoutData, LayoutGraphData, loadLayoutGraphData } from './layout-graph';
import { BinaryInputArchive } from './binary-archive';
import { EffectAsset } from '../../asset/assets/effect-asset';
import { Device } from '../../gfx/base/device';
import { DescriptorTypeOrder, UpdateFrequency } from './types';
import { getDescriptorSetLayout, getDescriptorSetLayoutData, initializeLayoutGraphData, terminateLayoutGraphData } from './layout-graph-utils';
import { DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorType, GetTypeSize, ShaderInfo, Uniform, UniformBlock, UniformSamplerTexture } from '../../gfx';
import { ITemplateInfo } from '../../render-scene/core/program-lib';

let _pipeline: WebPipeline | null = null;
let _device: Device;

const lg = new LayoutGraphData();

export * from './types';
export * from './pipeline';
export * from './archive';

export const enableEffectImport = !EDITOR;
export const invalidID = 0xFFFFFFFF;

export function setDevice (device: Device) {
    _device = device;
}

export function createCustomPipeline (): Pipeline {
    const layoutGraph = enableEffectImport ? lg : new LayoutGraphData();

    const ppl = new WebPipeline(layoutGraph);
    const pplName = macro.CUSTOM_PIPELINE_NAME;
    ppl.setCustomPipelineName(pplName);

    if (!enableEffectImport) {
        if (pplName === 'Deferred') {
            buildDeferredLayout(ppl);
        } else {
            buildForwardLayout(ppl);
        }
    }

    _pipeline = ppl;
    return ppl;
}

export const customPipelineBuilderMap = new Map<string, PipelineBuilder>();

export function setCustomPipeline (name: string, builder: PipelineBuilder) {
    customPipelineBuilderMap.set(name, builder);
}

export function getCustomPipeline (name: string): PipelineBuilder {
    let builder = customPipelineBuilderMap.get(name) || null;
    if (builder === null) {
        builder = customPipelineBuilderMap.get('Forward')!;
    }
    return builder;
}

function addCustomBuiltinPipelines (map: Map<string, PipelineBuilder>) {
    map.set('Forward', new ForwardPipelineBuilder());
    map.set('Deferred', new DeferredPipelineBuilder());
    map.set('Custom', new CustomPipelineBuilder());
    map.set('Native', new NativePipelineBuilder());
}

addCustomBuiltinPipelines(customPipelineBuilderMap);

export function initializeLayoutGraph (arrayBuffer: ArrayBuffer) {
    const readBinaryData = new BinaryInputArchive(arrayBuffer);
    loadLayoutGraphData(readBinaryData, lg);
    initializeLayoutGraphData(_device, lg);
}

export function terminateLayoutGraph () {
    terminateLayoutGraphData(lg);
}

export function getCustomPassID (name: string | undefined): number {
    return lg.locateChild(lg.nullVertex(),
        name || 'default');
}

export function getCustomPhaseID (passID: number, name: string| undefined): number {
    return lg.locateChild(passID, name || 'default');
}

export function getMaterialDescriptorSetLayout (passID: number, phaseID: number): DescriptorSetLayout {
    return getDescriptorSetLayout(lg, passID, phaseID, UpdateFrequency.PER_BATCH);
}

export function getMaterialDescriptorOffset (passID: number, phaseID: number): DescriptorSetLayout {
    return getDescriptorSetLayout(lg, passID, phaseID, UpdateFrequency.PER_BATCH);
}

export function getMaterialUniformBlockOffset (passID: number, phaseID: number): number | null {
    const data = getDescriptorSetLayoutData(lg, passID, phaseID, UpdateFrequency.PER_BATCH);
    for (const block of data.descriptorBlocks) {
        if (block.type === DescriptorTypeOrder.UNIFORM_BUFFER) {
            return block.offset;
        }
    }
    return null;
}

export function replaceShaderInfo (asset: EffectAsset) {
    // replacePerBatchOrInstanceShaderInfo(lg, asset);
}

function getSize (block: EffectAsset.IBlockInfo) {
    return block.members.reduce((s, m) => s + GetTypeSize(m.type) * m.count, 0);
}

const _descriptorSetSlot = [3, 2, 1, 0];

// export function rebindMaterialDescriptors (descriptorInfo: EffectAsset.IDescriptorInfo,
//     layout: DescriptorSetLayoutData): ITemplateInfo {
//     const tmplInfo = {} as ITemplateInfo;
//     // cache material-specific descriptor set layout
//     tmplInfo.samplerStartBinding = descriptorInfo.blocks.length;
//     tmplInfo.shaderInfo = new ShaderInfo();
//     tmplInfo.blockSizes = [];
//     tmplInfo.bindings = [];

//     const slot = _descriptorSetSlot[UpdateFrequency.PER_BATCH];

//     for (const descriptorBlock of layout.descriptorBlocks) {
//         const offset = descriptorBlock.offset;
//         const vis = descriptorBlock.visibility;
//         switch (descriptorBlock.type) {
//         case DescriptorTypeOrder.UNIFORM_BUFFER:
//             for (let i = 0; i < descriptorInfo.blocks.length; i++) {
//                 const binding = offset + i;
//                 const block = descriptorInfo.blocks[i];
//                 tmplInfo.blockSizes.push(getSize(block));
//                 // effect compiler guarantees block count = 1
//                 tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
//                     DescriptorType.UNIFORM_BUFFER, 1, vis));
//                 tmplInfo.shaderInfo.blocks.push(
//                     new UniformBlock(slot, binding, block.name,
//                         block.members.map((m) => new Uniform(m.name, m.type, m.count)),
//                         1),
//                 );
//             }
//             break;
//         case DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER:
//             break;
//         case DescriptorTypeOrder.SAMPLER_TEXTURE:
//             for (let i = 0; i < descriptorInfo.samplerTextures.length; i++) {
//                 const binding = offset + i;
//                 const samplerTexture = descriptorInfo.samplerTextures[i];
//                 tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
//                     DescriptorType.SAMPLER_TEXTURE, samplerTexture.count, vis));
//                 tmplInfo.shaderInfo.samplerTextures.push(new UniformSamplerTexture(
//                     slot, binding, samplerTexture.name, samplerTexture.type, samplerTexture.count,
//                 ));
//             }
//             break;
//         case DescriptorTypeOrder.SAMPLER:
//             for (let i = 0; i < descriptorInfo.samplers.length; i++) {
//                 const binding = offset + i;
//                 const sampler = descriptorInfo.samplers[i];
//                 tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
//                     DescriptorType.SAMPLER, sampler.count, sampler.stageFlags));
//                 tmplInfo.shaderInfo.samplers.push(new UniformSampler(
//                     SetIndex.MATERIAL, sampler.binding, sampler.name, sampler.count,
//                 ));
//             }
//             break;
//         case DescriptorTypeOrder.TEXTURE:
//             break;
//         case DescriptorTypeOrder.STORAGE_BUFFER:
//             break;
//         case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
//             break;
//         case DescriptorTypeOrder.STORAGE_IMAGE:
//             break;
//         case DescriptorTypeOrder.INPUT_ATTACHMENT:
//             break;
//         default:
//             break;
//         }
//     }

//     // let offset =

//     for (let i = 0; i < descriptorInfo.textures.length; i++) {
//         const texture = descriptorInfo.textures[i];
//         tmplInfo.bindings.push(new DescriptorSetLayoutBinding(texture.binding,
//             DescriptorType.TEXTURE, texture.count, texture.stageFlags));
//         tmplInfo.shaderInfo.textures.push(new UniformTexture(
//             SetIndex.MATERIAL, texture.binding, texture.name, texture.type, texture.count,
//         ));
//     }
//     for (let i = 0; i < descriptorInfo.buffers.length; i++) {
//         const buffer = descriptorInfo.buffers[i];
//         tmplInfo.bindings.push(new DescriptorSetLayoutBinding(buffer.binding,
//             DescriptorType.STORAGE_BUFFER, 1, buffer.stageFlags));
//         tmplInfo.shaderInfo.buffers.push(new UniformStorageBuffer(
//             SetIndex.MATERIAL, buffer.binding, buffer.name, 1, buffer.memoryAccess,
//         )); // effect compiler guarantees buffer count = 1
//     }
//     for (let i = 0; i < descriptorInfo.images.length; i++) {
//         const image = descriptorInfo.images[i];
//         tmplInfo.bindings.push(new DescriptorSetLayoutBinding(image.binding,
//             DescriptorType.STORAGE_IMAGE, image.count, image.stageFlags));
//         tmplInfo.shaderInfo.images.push(new UniformStorageImage(
//             SetIndex.MATERIAL, image.binding, image.name, image.type, image.count, image.memoryAccess,
//         ));
//     }
//     for (let i = 0; i < descriptorInfo.subpassInputs.length; i++) {
//         const subpassInput = descriptorInfo.subpassInputs[i];
//         tmplInfo.bindings.push(new DescriptorSetLayoutBinding(subpassInput.binding,
//             DescriptorType.INPUT_ATTACHMENT, subpassInput.count, subpassInput.stageFlags));
//         tmplInfo.shaderInfo.subpassInputs.push(new UniformInputAttachment(
//             SetIndex.MATERIAL, subpassInput.binding, subpassInput.name, subpassInput.count,
//         ));
//     }
//     tmplInfo.gfxAttributes = [];
//     for (let i = 0; i < descriptorInfo.attributes.length; i++) {
//         const attr = descriptorInfo.attributes[i];
//         tmplInfo.gfxAttributes.push(new Attribute(attr.name, attr.format, attr.isNormalized, 0, attr.isInstanced, attr.location));
//     }
//     insertBuiltinBindings(descriptorInfo, tmplInfo, localDescriptorSetLayout, 'locals');

//     tmplInfo.shaderInfo.stages.push(new ShaderStage(ShaderStageFlagBit.VERTEX, ''));
//     tmplInfo.shaderInfo.stages.push(new ShaderStage(ShaderStageFlagBit.FRAGMENT, ''));
//     tmplInfo.handleMap = genHandles(descriptorInfo);
//     tmplInfo.setLayouts = [];
//     return tmplInfo;
// }
