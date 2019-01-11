import { GFXPrimitiveMode } from '../../gfx/define';
import * as renderer from '../../renderer';
import gfx from '../../renderer/gfx/index';
import find from '../../scene-graph/find';
import { Mesh, RenderingMesh } from '../assets/mesh';

/**
 *
 * @param {import("../assets/skeleton").default} skinning
 */
function createJointsTexture (skinning) {
    const jointCount = skinning.joints.length;

    // Set jointsTexture.
    // A squared texture with side length N(N > 1) multiples of 2 can store
    // 2 ^ (2 * N - 2) matrices.
    // We support most 1024 joints.
    let size;
    if (jointCount > 1024) {
        throw new Error('To many joints(more than 1024).');
    } else if (jointCount > 256) {
        size = 64;
    } else if (jointCount > 64) {
        size = 32;
    } else if (jointCount > 16) {
        size = 16;
    } else if (jointCount > 4) {
        size = 8;
    } else {
        size = 4;
    }

    return new gfx.Texture2D(cc.game._renderContext, {
        width: size,
        height: size,
        format: gfx.TEXTURE_FMT_RGBA32F,
        minFilter: gfx.FILTER_NEAREST,
        magFilter: gfx.FILTER_NEAREST,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
        mipmap: false,
    });
}

function createMesh (context, data) {
    const ia = renderer.createIA(context, data);
    const meshAsset = new Mesh();
    const primitiveMode = data.primitiveMode === undefined ? GFXPrimitiveMode.TRIANGLE_LIST : data.primitiveMode;
    meshAsset._renderingMesh = new RenderingMesh([{ inputAssembler: ia, primitiveMode }], [], []);
    meshAsset._minPosition = data.minPos;
    meshAsset._maxPosition = data.maxPos;

    return meshAsset;
}

/**
 * @param {Uint8Array} buffer
 */
function toPPM (buffer, w, h) {
    return `P3 ${w} ${h} 255\n${buffer.filter((e, i) => i % 4 < 3).toString()}\n`;
}

export default {
    createJointsTexture,
    createMesh,

    find,
    toPPM,
};
