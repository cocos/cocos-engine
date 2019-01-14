import { GFXPrimitiveMode } from '../../gfx/define';
import * as renderer from '../../renderer';
export { default as find } from '../../scene-graph/find';
import Texture2D from '../../assets/texture-2d';
import { Filter, PixelFormat, WrapMode } from '../../assets/texture-base';
import { Mesh, RenderingMesh } from '../assets/mesh';

/**
 *
 */
export function createJointsTexture (skinning: { joints: any[]; }) {
    const jointCount = skinning.joints.length;

    // Set jointsTexture.
    // A squared texture with side length N(N > 1) multiples of 2 can store
    // 2 ^ (2 * N - 2) matrices.
    // We support most 1024 joints.
    let size = 0;
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

    const texture = new Texture2D();
    texture.create(size, size, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    return texture;
}

export function createMesh (context, data) {
    const ia = renderer.createIA(context, data);
    const meshAsset = new Mesh();
    const primitiveMode = data.primitiveMode === undefined ? GFXPrimitiveMode.TRIANGLE_LIST : data.primitiveMode;
    meshAsset._renderingMesh = new RenderingMesh([{ inputAssembler: ia, primitiveMode }], [], []);
    meshAsset._minPosition = data.minPos;
    meshAsset._maxPosition = data.maxPos;

    return meshAsset;
}

/**
 *
 */
export function toPPM (buffer: Uint8Array, w: number, h: number) {
    return `P3 ${w} ${h} 255\n${buffer.filter((e, i) => i % 4 < 3).toString()}\n`;
}
