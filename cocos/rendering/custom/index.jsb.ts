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

declare const render: any;

import { Pipeline, PipelineBuilder } from './pipeline';
import { buildDeferredLayout, buildForwardLayout } from './effect';
import { macro } from '../../core/platform/macro';
import { DeferredPipelineBuilder, ForwardPipelineBuilder } from './builtin-pipelines';
import { CustomPipelineBuilder, NativePipelineBuilder } from './custom-pipeline';

export * from './types';
export * from './pipeline';
export * from './archive';

export function createCustomPipeline (): Pipeline {
    const ppl = render.Factory.createPipeline();
    const pplName = macro.CUSTOM_PIPELINE_NAME;
    if (pplName === 'Deferred') {
        buildDeferredLayout(ppl);
    } else {
        buildForwardLayout(ppl);
    }
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
