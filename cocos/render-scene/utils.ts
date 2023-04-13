/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { Attribute, Buffer, BufferInfo, Device, InputAssemblerInfo, AttributeName, BufferUsageBit, Format, MemoryUsageBit } from '../gfx';
import { IGeometry } from '../primitive/define';

export function createIA (device: Device, data: IGeometry) {
    if (!data.positions) {
        console.error('The data must have positions field');
        return null;
    }

    const verts: number[] = [];
    const vcount = data.positions.length / 3;

    for (let i = 0; i < vcount; ++i) {
        verts.push(data.positions[3 * i], data.positions[3 * i + 1], data.positions[3 * i + 2]);

        if (data.normals) {
            verts.push(data.normals[3 * i], data.normals[3 * i + 1], data.normals[3 * i + 2]);
        }
        if (data.uvs) {
            verts.push(data.uvs[2 * i], data.uvs[2 * i + 1]);
        }
        if (data.colors) {
            verts.push(data.colors[3 * i], data.colors[3 * i + 1], data.colors[3 * i + 2]);
        }
    }

    const vfmt: Attribute[] = [];
    vfmt.push(new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F));
    if (data.normals) {
        vfmt.push(new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F));
    }
    if (data.uvs) {
        vfmt.push(new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F));
    }
    if (data.colors) {
        vfmt.push(new Attribute(AttributeName.ATTR_COLOR, Format.RGB32F));
    }

    const vb = device.createBuffer(new BufferInfo(
        BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
        MemoryUsageBit.DEVICE,
        verts.length * 4,
        verts.length * 4 / vcount,
    ));

    vb.update(new Float32Array(verts));

    let ib: Buffer | null = null;
    if (data.indices) {
        ib = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            data.indices.length * 2,
            2,
        ));

        ib.update(new Uint16Array(data.indices));
    }

    return device.createInputAssembler(new InputAssemblerInfo(vfmt, [vb], ib));
}
