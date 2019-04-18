import { GFXPrimitiveMode } from '../../gfx/define';
import { IGFXAttribute } from '../../gfx/input-assembler';

export interface IGeometryOptions {
    /**
     * Whether to include normal. Default to true.
     */
    includeNormal: boolean;

    /**
     * Whether to include uv. Default to true.
     */
    includeUV: boolean;
}

export function applyDefaultGeometryOptions<GeometryOptions = IGeometryOptions> (
    options?: RecursivePartial<IGeometryOptions>): GeometryOptions {
    options = options || {};
    if (options.includeNormal === undefined) {
        options.includeNormal = true;
    }
    if (options.includeUV === undefined) {
        options.includeUV = true;
    }
    return options as GeometryOptions;
}

export interface IGeometry {
    /**
     * Vertex positions.
     */
    positions: number[];

    /**
     * Min position.
     */
    minPos?: {
        x: number;
        y: number;
        z: number;
    };

    /**
     * Max position.
     */
    maxPos?: {
        x: number;
        y: number;
        z: number;
    };

    /**
     * Bounding sphere radius.
     */
    boundingRadius?: number;

    /**
     * Gemetry indices, if one needs indexed-draw.
     */
    indices?: number[];

    /**
     * Vertex normals.
     */
    normals?: number[];

    /**
     * Texture coordinates.
     */
    uvs?: number[];

    /**
     * Vertex colors.
     */
    colors?: number[];

    /**
     * Topology of the geometry vertices. Default is TRIANGLE_LIST.
     */
    primitiveMode?: GFXPrimitiveMode;

    /**
     * whether rays casting from the back face of this geometry could collide with it
     */
    doubleSided?: boolean;

    /**
     * specify vertex attributes, use (positions|normals|uvs|colors) as keys
     */
    attributes?: IGFXAttribute[];
}
