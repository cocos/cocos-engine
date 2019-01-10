// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from './gfx';
import InputAssembler from './core/input-assembler';
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXFormat } from '../gfx/define';

/**
 * @param {gfx.Device} device
 * @param {Object} data
 */
export function createIA(device, data) {
    if (!data.positions) {
        console.error('The data must have positions field');
        return null;
    }

    let verts = [];
    let vcount = data.positions.length / 3;

    for (let i = 0; i < vcount; ++i) {
        verts.push(data.positions[3 * i], data.positions[3 * i + 1], data.positions[3 * i + 2]);

        if (data.normals) {
            verts.push(data.normals[3 * i], data.normals[3 * i + 1], data.normals[3 * i + 2]);
        }
        if (data.uvs) {
            verts.push(data.uvs[2 * i], data.uvs[2 * i + 1]);
        }
        if (data.colors) {
            verts.push(data.colors[3 * i], data.uvs[3 * i + 1], data.colors[3 * i + 2]);
        }
    }

    let vfmt = [];
    vfmt.push({ name: gfx.ATTR_POSITION, format: GFXFormat.RGB32F });
    if (data.normals) {
        vfmt.push({ name: gfx.ATTR_NORMAL, format: GFXFormat.RGB32F });
    }
    if (data.uvs) {
        vfmt.push({ name: gfx.ATTR_UV0, format: GFXFormat.RG32F });
    }
    if (data.colors) {
        vfmt.push({ name: gfx.ATTR_COLOR, format: GFXFormat.RGB32F });
    }

    let vb = cc.director.root.device.createBuffer({
        usage: GFXBufferUsageBit.VERTEX,
        memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
        size: verts.length * 4,
        stride: verts.length * 4 / vcount,
    });

    vb.update(new Float32Array(verts));

    let ib = cc.director.root.device.createBuffer({
        usage: GFXBufferUsageBit.INDEX,
        memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
        size: data.indices.length * 2,
        stride: 2,
    });

    ib.update(new Uint16Array(data.indices));

    return cc.director.root.device.createInputAssembler({
        attributes: vfmt,
        vertexBuffers: [vb],
        indexBuffer: ib,
    });
}
