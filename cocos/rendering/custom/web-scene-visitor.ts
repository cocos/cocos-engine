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

import { PipelineState, DescriptorSet, InputAssembler, DrawInfo, Buffer, CommandBuffer, Rect, Viewport } from '../../gfx';
import { PipelineSceneData } from '../pipeline-scene-data';
import { SceneVisitor } from './pipeline';

export class WebSceneVisitor implements SceneVisitor {
    protected _pipelineSceneData: PipelineSceneData;
    private _commandBuffer: CommandBuffer;
    constructor (commandBuffer: CommandBuffer, pipelineSceneData: PipelineSceneData) {
        this._pipelineSceneData = pipelineSceneData;
        this._commandBuffer = commandBuffer;
    }
    public get pipelineSceneData (): PipelineSceneData {
        return this._pipelineSceneData;
    }
    public setViewport (vp: Viewport): void {
        this._commandBuffer.setViewport(vp);
    }
    public setScissor (rect: Rect): void {
        this._commandBuffer.setScissor(rect);
    }
    public bindPipelineState (pso: PipelineState): void {
        this._commandBuffer.bindPipelineState(pso);
    }
    public bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: number[]): void {
        this._commandBuffer.bindDescriptorSet(set, descriptorSet, dynamicOffsets);
    }
    public bindInputAssembler (ia: InputAssembler): void {
        this._commandBuffer.bindInputAssembler(ia);
    }
    public draw (info: DrawInfo): void {
        this._commandBuffer.draw(info);
    }
    public updateBuffer (buffer: Buffer, data: ArrayBuffer, size?: number): void {
        this._commandBuffer.updateBuffer(buffer, data, size);
    }
}
