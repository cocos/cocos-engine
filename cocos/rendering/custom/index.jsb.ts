/*
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

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

declare const render: any;

import zlib from '../../../external/compression/zlib.min';
import { Pipeline, PipelineBuilder, RenderingModule } from './pipeline';
import { Device } from '../../gfx';
import { forceResizeAllWindows } from './framework';

export * from './types';
export * from './pipeline';
export * from './archive';
export * from './framework';

let _pipeline: Pipeline | null = null;

export const INVALID_ID = 0xFFFFFFFF;
export const enableEffectImport = true;

const HEADER_SIZE = 8;

let _renderModule: RenderingModule;

export function createCustomPipeline (): Pipeline {
    _pipeline = render.Factory.createPipeline() as Pipeline;
    return _pipeline;
}

export const customPipelineBuilderMap = new Map<string, PipelineBuilder>();

export function setCustomPipeline (name: string, builder: PipelineBuilder) {
    customPipelineBuilderMap.set(name, builder);
    forceResizeAllWindows();
}

export function getCustomPipeline (name: string): PipelineBuilder {
    let builder = customPipelineBuilderMap.get(name);
    if (!builder) {
        builder = customPipelineBuilderMap.get('Forward')!;
    }
    return builder;
}

export function init (device: Device, arrayBuffer: ArrayBuffer | null) {
    if (arrayBuffer && arrayBuffer.byteLength >= HEADER_SIZE) {
        const header = new Uint32Array(arrayBuffer, 0, 2);
        if (header[0] === INVALID_ID) {
            // Data is compressed
            const inflator = new zlib.Inflate(new Uint8Array(arrayBuffer, HEADER_SIZE));
            const decompressed = inflator.decompress() as Uint8Array;
            _renderModule = render.Factory.init(device, decompressed.buffer);
        } else {
            // Data is not compressed
            _renderModule = render.Factory.init(device, arrayBuffer);
        }
    } else {
        _renderModule = render.Factory.init(device, new ArrayBuffer(0));
    }
}

export function destroy () {
    render.Factory.destroy(_renderModule);
}

export function getPassID (name: string | undefined): number {
    if (name === undefined) {
        return _renderModule.getPassID('default');
    }
    return _renderModule.getPassID(name);
}

export function getSubpassID (passID: number, name: string): number {
    return _renderModule.getSubpassID(passID, name);
}

export function getPhaseID (passID: number, name: string | number | undefined): number {
    if (name === undefined) {
        return _renderModule.getPhaseID(passID, 'default');
    }
    if (typeof (name) === 'number') {
        return _renderModule.getPhaseID(passID, name.toString());
    }
    return _renderModule.getPhaseID(passID, name);
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
