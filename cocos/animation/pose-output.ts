/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { BlendStateBuffer, BlendingPropertyName, BlendStateWriter } from '../3d/skeletal-animation/skeletal-animation-blending';
import type { Node } from '../scene-graph';

export type Pose = BlendStateBuffer;

export class PoseOutput {
    public weight = 0.0;

    constructor (pose: Pose) {
        this._pose = pose;
    }

    public destroy (): void {
        for (let iBlendStateWriter = 0; iBlendStateWriter < this._blendStateWriters.length; ++iBlendStateWriter) {
            this._pose.destroyWriter(this._blendStateWriters[iBlendStateWriter]);
        }
        this._blendStateWriters.length = 0;
    }

    public createPoseWriter (node: Node, property: BlendingPropertyName, constants: boolean): BlendStateWriter<BlendingPropertyName> {
        const writer = this._pose.createWriter(node, property, this, constants);
        this._blendStateWriters.push(writer);
        return writer;
    }

    private _pose: Pose;

    private _blendStateWriters: BlendStateWriter<any>[] = [];
}
