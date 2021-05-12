/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { Mesh } from '../assets/mesh';
import { AttributeName, Format, FormatInfos } from '../../core/gfx';
import { IGeometry } from '../../primitive/define';
import { readBuffer } from './buffer';

enum _keyMap {
    positions = AttributeName.ATTR_POSITION,
    normals = AttributeName.ATTR_NORMAL,
    uvs = AttributeName.ATTR_TEX_COORD,
    colors = AttributeName.ATTR_COLOR,
}

export function readMesh (mesh: Mesh, iPrimitive = 0) {
    const out: IGeometry = { positions: [] };
    const dataView = new DataView(mesh.data.buffer, mesh.data.byteOffset, mesh.data.byteLength);
    const struct = mesh.struct;
    const primitive = struct.primitives[iPrimitive];
    for (const idx of primitive.vertexBundelIndices) {
        const bundle = struct.vertexBundles[idx];
        let offset = bundle.view.offset;
        const { length, stride } = bundle.view;
        for (const attr of bundle.attributes) {
            const name: AttributeName = _keyMap[attr.name];
            if (name) { out[name] = (out[name] || []).concat(readBuffer(dataView, attr.format, offset, length, stride)); }
            offset += FormatInfos[attr.format].size;
        }
    }
    const view = primitive.indexView!;
    out.indices = readBuffer(dataView, Format[`R${view.stride * 8}UI`], view.offset, view.length);
    return out;
}
