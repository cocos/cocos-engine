import { GFXPrimitiveMode } from '../../gfx/define';

export enum WindingOrder {
    /**
     * Clockwise.
     */
    Clockwise,

    /**
     * Counter-clockwise.
     */
    CounterClockwise,
}

export interface IGeometryOptions {
    /**
     * Whether generated wireframed geometry. Default to false.
     */
    wireframed?: boolean;

    /**
     * The winding order. Default to counter-clockwise.
     */
    windingOrder?: WindingOrder;

    /**
     * Whether to include normal. Default to true.
     */
    includeNormal?: boolean;

    /**
     * The center of the geometry. Default to (0, 0, 0).
     */
    center?: {
        x?: number;
        y?: number;
        z?: number;
    };
}

export function normalizeGeometryOptions (options: IGeometryOptions) {
    options.wireframed = options.wireframed || false;
    options.windingOrder = options.windingOrder === undefined ?
        WindingOrder.CounterClockwise : options.windingOrder;
    options.includeNormal = options.includeNormal === undefined ?
        true : options.includeNormal;
    if (!options.center) {
        options.center = {};
    }
    options.center.x = options.center.x || 0;
    options.center.y = options.center.y || 0;
    options.center.z = options.center.z || 0;
    return options;
}

export interface IGeometry {
    /**
     * Topology of the geometry vertices.
     */
    primitiveType: GFXPrimitiveMode;

    /**
     * Vertex positions.
     */
    vertices: number[];

    /**
     * Gemetry indices, if one needs indexed-draw.
     */
    indices?: number[];

    /**
     * Vertex normals.
     */
    normals?: number[];
}
