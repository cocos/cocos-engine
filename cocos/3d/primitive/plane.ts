import { Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { applyDefaultGeometryOptions, IGeometry, IGeometryOptions } from './define';

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

function applyDefaultPlaneOptions (options?: RecursivePartial<IPlaneOptions>): IPlaneOptions {
    options = applyDefaultGeometryOptions<IPlaneOptions>(options);
    options.width = 10;
    options.length = 10;
    options.widthSegments = 10;
    options.lengthSegments = 10;
    return options as IPlaneOptions;
}

const temp1 = vec3.create(0, 0, 0);
const temp2 = vec3.create(0, 0, 0);
const temp3 = vec3.create(0, 0, 0);
const r = vec3.create(0, 0, 0);
const c00 = vec3.create(0, 0, 0);
const c10 = vec3.create(0, 0, 0);
const c01 = vec3.create(0, 0, 0);

/**
 * This function generates a plane on XOZ plane with positive Y direction.
 * @param options Options.
 */
export default function (options?: IPlaneOptions): IGeometry {
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

    vec3.set(c00, -hw, 0, hl);
    vec3.set(c10, hw, 0, hl);
    vec3.set(c01, -hw, 0, -hl);

    for (let y = 0; y <= vSegments; y++) {
        for (let x = 0; x <= uSegments; x++) {
            const u = x / uSegments;
            const v = y / vSegments;

            vec3.lerp(temp1, c00, c10, u);
            vec3.lerp(temp2, c00, c01, v);
            vec3.sub(temp3, temp2, c00);
            vec3.add(r, temp1, temp3);

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
