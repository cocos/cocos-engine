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

import * as VertexFormat from './vertex-format';
import { Batcher2D } from './batcher-2d';
import { DrawBatch2D } from './draw-batch';
import { markAsWarning, replaceProperty, removeProperty, warnID } from '../../core';
import { MeshBuffer } from './mesh-buffer';
import { MeshRenderData } from './render-data';

export { VertexFormat as UIVertexFormat };

export { Batcher2D as UI };

export { UIDrawBatch };

/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 * @internal
 */
class UIDrawBatch extends DrawBatch2D {
}

markAsWarning(MeshBuffer.prototype, 'MeshBuffer',
    [
        'byteStart',
        'vertexStart',
        'indicesStart',
        'request',
    ].map((item) => ({
        name: item,
        suggest: `please use meshBuffer.accessor.${item} instead`,
    })));

replaceProperty(MeshBuffer.prototype, 'MeshBuffer', [
    {
        name: 'indicesOffset',
        newName: 'indexOffset',
    },
]);

removeProperty(MeshBuffer.prototype, 'MeshBuffer', [
    {
        name: 'vertexBuffers',
    },
    {
        name: 'indexBuffer',
    },
]);

replaceProperty(Batcher2D.prototype, 'Batcher2D', [
    {
        name: 'currBufferBatch',
        newName: 'currBufferAccessor',
    },
    {
        name: 'acquireBufferBatch',
        newName: 'switchBufferAccessor',
    },
]);

removeProperty(MeshRenderData.prototype, 'MeshRenderData', [
    {
        name: 'formatByte',
    },
    {
        name: 'byteStart',
    },
    {
        name: 'byteCount',
    },
]);

replaceProperty(MeshRenderData.prototype, 'MeshRenderData', [
    {
        name: 'indicesStart',
        newName: 'indexStart',
    },
]);

export class QuadRenderData extends MeshRenderData {
    constructor (vertexFormat) {
        super(vertexFormat);
        warnID(9006);
    }
}
