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

import { Pipeline, PipelineBuilder } from './pipeline';
import { WebPipeline } from './web-pipeline';
import { buildDeferredLayout, buildForwardLayout, replacePerBatchOrInstanceShaderInfo } from './effect';
import { macro } from '../../core';
import { DeferredPipelineBuilder, ForwardPipelineBuilder } from './builtin-pipelines';
import { CustomPipelineBuilder, NativePipelineBuilder } from './custom-pipeline';
import { LayoutGraphData, loadLayoutGraphData } from './layout-graph';
import { BinaryInputArchive } from './binary-archive';
import { EffectAsset } from '../../asset/assets/effect-asset';
import { WebProgramLibrary } from './web-program-library';

let _pipeline: WebPipeline | null = null;

const defaultLayoutGraph = new LayoutGraphData();

export * from './types';
export * from './pipeline';
export * from './archive';

export const enableEffectImport = false;
export const programLib = new WebProgramLibrary(defaultLayoutGraph);

export function createCustomPipeline (): Pipeline {
    const layoutGraph = enableEffectImport ? defaultLayoutGraph : new LayoutGraphData();

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
    programLib.constantMacros = ppl.constantMacros;
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

export function deserializeLayoutGraph (arrayBuffer: ArrayBuffer) {
    const readBinaryData = new BinaryInputArchive(arrayBuffer);
    loadLayoutGraphData(readBinaryData, defaultLayoutGraph);
}

export function replaceShaderInfo (asset: EffectAsset) {
    const stageName = 'default';
    replacePerBatchOrInstanceShaderInfo(defaultLayoutGraph, asset, stageName);
}
