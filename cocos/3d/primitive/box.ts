import { Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { IGeometry, IGeometryOptions } from './define';

interface IBoxOptions extends IGeometryOptions {
    /**
     * Box extent on X-axis.
     */
    width?: number;

    /**
     * Box extent on Y-axis.
     */
    height?: number;

    /**
     * Box extent on Z-axis.
     */
    length?: number;

    /**
     * Segment count on X-axis.
     */
    widthSegments?: number;

    /**
     * Segment count on Y-axis.
     */
    heightSegments?: number;

    /**
     * Segment count on Z-axis.
     */
    lengthSegments?: number;
}

/**
 * This function generates a box with specified extents and centered at origin,
 * but may be repositioned through `center` option).
 * @param options Options.
 */
export default function box (options?: IBoxOptions): IGeometry {
    options = options || {};
    const ws = options.widthSegments || 1;
    const hs = options.heightSegments || 1;
    const ls = options.lengthSegments || 1;

    const hw = (options.width || 1) / 2;
    const hh = (options.height || 1) / 2;
    const hl = (options.length || 1) / 2;

    const corners = [
        vec3.set(c0, -hw, -hh, hl),
        vec3.set(c1, hw, -hh, hl),
        vec3.set(c2, hw, hh, hl),
        vec3.set(c3, -hw, hh, hl),
        vec3.set(c4, hw, -hh, -hl),
        vec3.set(c5, -hw, -hh, -hl),
        vec3.set(c6, -hw, hh, -hl),
        vec3.set(c7, hw, hh, -hl),
    ];

    const faceAxes = [
        [2, 3, 1], // FRONT
        [4, 5, 7], // BACK
        [7, 6, 2], // TOP
        [1, 0, 4], // BOTTOM
        [1, 4, 2], // RIGHT
        [5, 0, 6],  // LEFT
    ];

    const faceNormals = [
        [0, 0, 1], // FRONT
        [0, 0, -1], // BACK
        [0, 1, 0], // TOP
        [0, -1, 0], // BOTTOM
        [1, 0, 0], // RIGHT
        [-1, 0, 0],  // LEFT
    ];

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const minPos = new Vec3(-hw, -hh, -hl);
    const maxPos = new Vec3(hw, hh, hl);
    const boundingRadius = Math.sqrt(hw * hw + hh * hh + hl * hl);

    function _buildPlane (side: number, uSegments: number, vSegments: number) {
        let u: number;
        let v: number;
        let ix: number;
        let iy: number;
        const offset = positions.length / 3;
        const faceAxe = faceAxes[side];
        const faceNormal = faceNormals[side];

        for (iy = 0; iy <= vSegments; iy++) {
            for (ix = 0; ix <= uSegments; ix++) {
                u = ix / uSegments;
                v = iy / vSegments;

                vec3.lerp(temp1, corners[faceAxe[0]], corners[faceAxe[1]], u);
                vec3.lerp(temp2, corners[faceAxe[0]], corners[faceAxe[2]], v);
                vec3.sub(temp3, temp2, corners[faceAxe[0]]);
                vec3.add(r, temp1, temp3);

                positions.push(r.x, r.y, r.z);
                normals.push(faceNormal[0], faceNormal[1], faceNormal[2]);
                uvs.push(u, v);

                if ((ix < uSegments) && (iy < vSegments)) {
                    const useg1 = uSegments + 1;
                    const a = ix + iy * useg1;
                    const b = ix + (iy + 1) * useg1;
                    const c = (ix + 1) + (iy + 1) * useg1;
                    const d = (ix + 1) + iy * useg1;

                    indices.push(offset + a, offset + d, offset + b);
                    indices.push(offset + b, offset + d, offset + c);
                }
            }
        }
    }

    _buildPlane(0, ws, hs); // FRONT
    _buildPlane(4, ls, hs); // RIGHT
    _buildPlane(1, ws, hs); // BACK
    _buildPlane(5, ls, hs); // LEFT
    _buildPlane(3, ws, ls); // BOTTOM
    _buildPlane(2, ws, ls); // TOP

    return {
        positions,
        normals,
        uvs,
        indices,
        minPos,
        maxPos,
        boundingRadius,
    };
}

const temp1 = new Vec3();
const temp2 = new Vec3();
const temp3 = new Vec3();
const r = new Vec3();
const c0 = new Vec3();
const c1 = new Vec3();
const c2 = new Vec3();
const c3 = new Vec3();
const c4 = new Vec3();
const c5 = new Vec3();
const c6 = new Vec3();
const c7 = new Vec3();
