// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { GFXAttribute, GFXBuffer, GFXBufferInfo, GFXDevice, GFXInputAssemblerInfo } from '../gfx';
import { GFXAttributeName, GFXBufferUsageBit, GFXFormat, GFXMemoryUsageBit } from '../gfx/define';
import { IGeometry } from '../primitive/define';

export function createIA (device: GFXDevice, data: IGeometry) {
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

    const vfmt: GFXAttribute[] = [];
    vfmt.push(new GFXAttribute(GFXAttributeName.ATTR_POSITION, GFXFormat.RGB32F));
    if (data.normals) {
        vfmt.push(new GFXAttribute(GFXAttributeName.ATTR_NORMAL, GFXFormat.RGB32F));
    }
    if (data.uvs) {
        vfmt.push(new GFXAttribute(GFXAttributeName.ATTR_TEX_COORD, GFXFormat.RG32F));
    }
    if (data.colors) {
        vfmt.push(new GFXAttribute(GFXAttributeName.ATTR_COLOR, GFXFormat.RGB32F));
    }

    const vb = device.createBuffer(new GFXBufferInfo(
        GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
        GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
        verts.length * 4,
        verts.length * 4 / vcount,
    ));

    vb.update(new Float32Array(verts));

    let ib: GFXBuffer | null = null;
    if (data.indices) {
        ib = device.createBuffer(new GFXBufferInfo(
            GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            data.indices.length * 2,
            2,
        ));

        ib.update(new Uint16Array(data.indices));
    }

    return device.createInputAssembler(new GFXInputAssemblerInfo(vfmt, [vb], ib));
}
