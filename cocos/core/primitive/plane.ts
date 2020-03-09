/**
 * @category 3d/primitive
 */

import { Vec3 } from '../math';
import { applyDefaultGeometryOptions, IGeometry, IGeometryOptions } from './define';

/**
 * @en
 * The definition of the parameter for building a plane.
 * @zh
 * 平面参数选项。
 */
interface IPlaneOptions extends RecursivePartial<IGeometryOptions> {
    /**
     * Plane extent on X-axis.
     */
    width: number;

    /**
     * Plane extent on Z-axis.
     */
    length: number;

    /**
     * Segment count on X-axis.
     */
    widthSegments: number;

    /**
     * Segment count on Z-axis.
     */
    lengthSegments: number;
}

/**
 * @zh
 * 应用默认的平面参数选项。
 * @param options 平面参数选项。
 */
function applyDefaultPlaneOptions (options?: RecursivePartial<IPlaneOptions>): IPlaneOptions {
    options = applyDefaultGeometryOptions<IPlaneOptions>(options);
    options.width = options.width || 10;
    options.length = options.length || 10;
    options.widthSegments = options.widthSegments || 10;
    options.lengthSegments = options.lengthSegments || 10;
    return options as IPlaneOptions;
}

const temp1 = new Vec3(0, 0, 0);
const temp2 = new Vec3(0, 0, 0);
const temp3 = new Vec3(0, 0, 0);
const r = new Vec3(0, 0, 0);
const c00 = new Vec3(0, 0, 0);
const c10 = new Vec3(0, 0, 0);
const c01 = new Vec3(0, 0, 0);

/**
 * @en
 * This function generates a plane on XOZ plane with positive Y direction.
 * @zh
 * 生成一个平面，其位于XOZ平面，方向为Y轴正方向。
 * @param options 平面参数选项。
 */
export default function plane (options?: IPlaneOptions): IGeometry {
    const normalizedOptions = applyDefaultPlaneOptions(options);

    const {
        width,
        length,
        widthSegments: uSegments,
        lengthSegments: vSegments,
    } = normalizedOptions;

    const hw = width * 0.5;
    const hl = length * 0.5;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const minPos = new Vec3(-hw, 0, -hl);
    const maxPos = new Vec3(hw, 0, hl);
    const boundingRadius = Math.sqrt(width * width + length * length);

    Vec3.set(c00, -hw, 0, hl);
    Vec3.set(c10, hw, 0, hl);
    Vec3.set(c01, -hw, 0, -hl);

    for (let y = 0; y <= vSegments; y++) {
        for (let x = 0; x <= uSegments; x++) {
            const u = x / uSegments;
            const v = y / vSegments;

            Vec3.lerp(temp1, c00, c10, u);
            Vec3.lerp(temp2, c00, c01, v);
            Vec3.subtract(temp3, temp2, c00);
            Vec3.add(r, temp1, temp3);

            positions.push(r.x, r.y, r.z);
            if (normalizedOptions.includeUV) {
                uvs.push(u, v);
            }

            if ((x < uSegments) && (y < vSegments)) {
                const useg1 = uSegments + 1;
                const a = x + y * useg1;
                const b = x + (y + 1) * useg1;
                const c = (x + 1) + (y + 1) * useg1;
                const d = (x + 1) + y * useg1;

                indices.push(a, d, b);
                indices.push(d, c, b);
            }
        }
    }

    const result: IGeometry = {
        positions,
        indices,
        minPos,
        maxPos,
        boundingRadius,
    };

    if (normalizedOptions.includeNormal) {
        const nVertex = (vSegments + 1) * (uSegments + 1);
        const normals = new Array<number>(3 * nVertex);
        result.normals = normals;
        for (let i = 0; i < nVertex; ++i) {
            normals[i * 3 + 0] = 0;
            normals[i * 3 + 1] = 1;
            normals[i * 3 + 2] = 0;
        }
    }

    if (normalizedOptions.includeUV) {
        result.uvs = uvs;
    }

    return result;
}
