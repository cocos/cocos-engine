/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import { EDITOR } from 'internal:constants';
import { BasicPipeline, PipelineBuilder } from './pipeline';
import { WebPipeline } from './web-pipeline';
import { macro } from '../../core/platform/macro';
import { DeferredPipelineBuilder, ForwardPipelineBuilder } from './builtin-pipelines';
import { CustomPipelineBuilder, TestPipelineBuilder } from './custom-pipeline';
import { LayoutGraphData, loadLayoutGraphData } from './layout-graph';
import { BinaryInputArchive } from './binary-archive';
import { WebProgramLibrary } from './web-program-library';
import { Device } from '../../gfx';
import { initializeLayoutGraphData, terminateLayoutGraphData, getCustomPassID, getCustomPhaseID, getCustomSubpassID } from './layout-graph-utils';
import { ProgramLibrary } from './private';
import { PostProcessBuilder } from '../post-process/post-process-builder';

let _pipeline: WebPipeline | null = null;

export const INVALID_ID = 0xFFFFFFFF;
const defaultLayoutGraph = new LayoutGraphData();

export * from './types';
export * from './pipeline';
export * from './archive';

export const enableEffectImport = true;
export const programLib: ProgramLibrary = new WebProgramLibrary(defaultLayoutGraph);

export function createCustomPipeline (): BasicPipeline {
    const layoutGraph = defaultLayoutGraph;

    const ppl = new WebPipeline(layoutGraph);
    const pplName = macro.CUSTOM_PIPELINE_NAME;
    ppl.setCustomPipelineName(pplName);
    (programLib as WebProgramLibrary).pipeline = ppl;
    _pipeline = ppl;
    return ppl;
}

export const customPipelineBuilderMap = new Map<string, PipelineBuilder>();

export function setCustomPipeline (name: string, builder: PipelineBuilder): void {
    customPipelineBuilderMap.set(name, builder);
}
export function getCustomPipeline (name: string): PipelineBuilder {
    let builder = customPipelineBuilderMap.get(name);
    if (!builder) {
        if (name === 'Test') {
            builder = new TestPipelineBuilder(_pipeline!.pipelineSceneData);
            customPipelineBuilderMap.set('Test', builder);
        } else {
            builder = customPipelineBuilderMap.get('Forward')!;
        }
    }
    return builder;
}

function addCustomBuiltinPipelines (map: Map<string, PipelineBuilder>): void {
    map.set('Forward', new PostProcessBuilder());
    map.set('Deferred', new DeferredPipelineBuilder());
    map.set('Deprecated', new CustomPipelineBuilder());
}

addCustomBuiltinPipelines(customPipelineBuilderMap);

export function init (device: Device, arrayBuffer: ArrayBuffer | null): void {
    if (arrayBuffer) {
        const readBinaryData = new BinaryInputArchive(arrayBuffer);
        loadLayoutGraphData(readBinaryData, defaultLayoutGraph);
    }
    initializeLayoutGraphData(device, defaultLayoutGraph);
}

export function destroy (): void {
    terminateLayoutGraphData(defaultLayoutGraph);
}

export function getPassID (name: string | undefined): number {
    return getCustomPassID(defaultLayoutGraph, name);
}

export function getSubpassID (passID: number, name: string): number {
    return getCustomSubpassID(defaultLayoutGraph, passID, name);
}

export function getPhaseID (passID: number, name: string | number | undefined): number {
    return getCustomPhaseID(defaultLayoutGraph, passID, name);
}

export function completePhaseName (name: string | number | undefined): string {
    if (typeof name === 'number') {
        return name.toString();
    } else if (typeof name === 'string') {
        return name;
    } else {
        return 'default';
    }
}
