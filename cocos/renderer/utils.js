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
    vfmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
    if (data.normals) {
        vfmt.push({ name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
    }
    if (data.uvs) {
        vfmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    }
    if (data.colors) {
        vfmt.push({ name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
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

    let attributes = [];

    for (let i = 0; i < vfmt.length; i++) {
        let gfxAttr = {};
        gfxAttr.name = vfmt[i].name;
        let gfxFormat;
        switch (vfmt[i].num) {
            case 1:
                gfxFormat = 'R';
                break;
            case 2:
                gfxFormat = 'RG';
                break;
            case 3:
                gfxFormat = 'RGB';
                break;
            case 4:
                gfxFormat = 'RGBA';
                break;
        }
        switch (vfmt[i].type) {
            case gfx.ATTR_TYPE_INT8:
                gfxFormat += '8I';
                break;
            case gfx.ATTR_TYPE_UINT8:
                gfxFormat += '8UI';
                break;
            case gfx.ATTR_TYPE_INT16:
                gfxFormat += '16I';
                break;
            case gfx.ATTR_TYPE_UINT16:
                gfxFormat += '16UI';
                break;
            case gfx.ATTR_TYPE_INT32:
                gfxFormat += '32I';
                break;
            case gfx.ATTR_TYPE_UINT32:
                gfxFormat += '32UI';
                break;
            case gfx.ATTR_TYPE_FLOAT32:
                gfxFormat += '32F';
                break;
        }
        gfxAttr.format = GFXFormat[gfxFormat];
        gfxAttr.normalize = vfmt[i].normalize;
        attributes.push(gfxAttr);
    }

    return cc.director.root.device.createInputAssembler({
        attributes,
        vertexBuffers: [vb],
        indexBuffer: ib,
    });
}
