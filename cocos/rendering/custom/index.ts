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
import { LayoutGraphData, loadLayoutGraphData } from './layout-graph';
import { BinaryInputArchive } from './binary-archive';
import { EffectAsset } from '../../asset/assets/effect-asset';
import { Device } from '../../gfx/base/device';
import { DescriptorTypeOrder, UpdateFrequency } from './types';
import { getDescriptorSetLayout, getDescriptorSetLayoutData, initializeLayoutGraphData, terminateLayoutGraphData } from './layout-graph-utils';
import { DescriptorSetLayout } from '../../gfx';

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
