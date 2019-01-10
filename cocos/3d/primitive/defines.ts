import { GFXPrimitiveMode } from '../../gfx/define';

export interface IGeometryOptions {
    /**
     * Whether to include normal. Default to true.
     */
    includeNormal?: boolean;
}

export function normalizeGeometryOptions (options: IGeometryOptions) {
    options.includeNormal = options.includeNormal === undefined ?
        true : options.includeNormal;
    return options;
}

export interface IGeometry {
    /**
     * Topology of the geometry vertices.
     */
    primitiveMode: GFXPrimitiveMode;

    /**
     * Vertex positions.
     */
    positions: number[];

    /**
     * Min position.
     */
    minPos: {
        x: number;
        y: number;
        z: number;
    };

    /**
     * Max position.
     */
    maxPos: {
        x: number;
        y: number;
        z: number;
    };

    /**
     * Bounding sphere radius.
     */
    boundingRadius: number;

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
}
