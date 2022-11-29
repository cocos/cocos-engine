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
/* eslint-disable max-len */
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
import { Attribute, DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorType, GetTypeSize, ShaderInfo, ShaderStage, ShaderStageFlagBit, Uniform, UniformBlock, UniformInputAttachment, UniformSampler, UniformSamplerTexture, UniformStorageBuffer, UniformStorageImage, UniformTexture } from '../../gfx';
import { IProgramInfo, ITemplateInfo } from '../../render-scene/core/program-lib';

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

export function rebindMaterialDescriptors (
    passID: number,
    phaseID: number,
    rate: UpdateFrequency,
    descriptorInfo: EffectAsset.IDescriptorInfo,
    tmplInfo: ITemplateInfo,
): void {
    const layout = getDescriptorSetLayoutData(lg, passID, phaseID, rate);
    const set = _descriptorSetSlot[rate];
    for (const descriptorBlock of layout.descriptorBlocks) {
        const visibility = descriptorBlock.visibility;
        let binding = 0;
        switch (descriptorBlock.type) {
        case DescriptorTypeOrder.UNIFORM_BUFFER:
            binding = descriptorBlock.offset;
            for (const block of descriptorInfo.blocks) {
                if (block.stageFlags !== visibility) {
                    continue;
                }
                tmplInfo.blockSizes.push(getSize(block));
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
                    DescriptorType.UNIFORM_BUFFER, 1, visibility));
                tmplInfo.shaderInfo.blocks.push(
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
            binding = descriptorBlock.offset;
            for (const tex of descriptorInfo.samplerTextures) {
                if (tex.stageFlags !== visibility) {
                    continue;
                }
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
                    DescriptorType.SAMPLER_TEXTURE, tex.count, visibility));
                tmplInfo.shaderInfo.samplerTextures.push(new UniformSamplerTexture(
                    set, binding, tex.name, tex.type, tex.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.SAMPLER:
            binding = descriptorBlock.offset;
            for (const sampler of descriptorInfo.samplers) {
                if (sampler.stageFlags !== visibility) {
                    continue;
                }
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
                    DescriptorType.SAMPLER, sampler.count, visibility));
                tmplInfo.shaderInfo.samplers.push(new UniformSampler(
                    set, binding, sampler.name, sampler.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.TEXTURE:
            binding = descriptorBlock.offset;
            for (const texture of descriptorInfo.textures) {
                if (texture.stageFlags !== visibility) {
                    continue;
                }
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
                    DescriptorType.TEXTURE, texture.count, visibility));
                tmplInfo.shaderInfo.textures.push(new UniformTexture(
                    set, binding, texture.name, texture.type, texture.count,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.STORAGE_BUFFER:
            binding = descriptorBlock.offset;
            for (const buffer of descriptorInfo.buffers) {
                if (buffer.stageFlags !== visibility) {
                    continue;
                }
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
                    DescriptorType.STORAGE_BUFFER, 1, visibility));
                tmplInfo.shaderInfo.buffers.push(new UniformStorageBuffer(
                    set, binding, buffer.name, 1, buffer.memoryAccess,
                )); // effect compiler guarantees buffer count = 1
                ++binding;
            }
            break;
        case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
            break;
        case DescriptorTypeOrder.STORAGE_IMAGE:
            binding = descriptorBlock.offset;
            for (const image of descriptorInfo.images) {
                if (image.stageFlags !== visibility) {
                    continue;
                }
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
                    DescriptorType.STORAGE_IMAGE, image.count, image.stageFlags));
                tmplInfo.shaderInfo.images.push(new UniformStorageImage(
                    set, binding, image.name, image.type, image.count, image.memoryAccess,
                ));
                ++binding;
            }
            break;
        case DescriptorTypeOrder.INPUT_ATTACHMENT:
            binding = descriptorBlock.offset;
            for (const subpassInput of descriptorInfo.subpassInputs) {
                if (subpassInput.stageFlags !== visibility) {
                    continue;
                }
                tmplInfo.bindings.push(new DescriptorSetLayoutBinding(binding,
                    DescriptorType.INPUT_ATTACHMENT, subpassInput.count, subpassInput.stageFlags));
                tmplInfo.shaderInfo.subpassInputs.push(new UniformInputAttachment(
                    set, subpassInput.binding, subpassInput.name, subpassInput.count,
                ));
                ++binding;
            }
            break;
        default:
        }
    }
    const srcInfo = descriptorInfo;
    const dstInfo = tmplInfo.shaderInfo;
    if (dstInfo.blocks.length !== srcInfo.blocks.length) {
        console.error('block count mismatch');
    }
    if (dstInfo.samplers.length !== srcInfo.samplers.length) {
        console.error('sampler count mismatch');
    }
    if (dstInfo.samplerTextures.length !== srcInfo.samplerTextures.length) {
        console.error('samplerTexture count mismatch');
    }
    if (dstInfo.textures.length !== srcInfo.textures.length) {
        console.error('texture count mismatch');
    }
    if (dstInfo.buffers.length !== srcInfo.buffers.length) {
        console.error('buffer count mismatch');
    }
    if (dstInfo.images.length !== srcInfo.images.length) {
        console.error('image count mismatch');
    }
    if (dstInfo.subpassInputs.length !== srcInfo.subpassInputs.length) {
        console.error('subpassInput count mismatch');
    }
}
