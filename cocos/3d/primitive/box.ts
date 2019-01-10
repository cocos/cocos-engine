import { GFXPrimitiveMode } from '../../gfx/define';
import { IGeometry, IGeometryOptions, normalizeGeometryOptions, WindingOrder } from './defines';

interface IBoxOptions extends IGeometryOptions {
    /**
     * Box extent on X-axis.
     */
    length: number;

    /**
     * Box extent on Z-axis.
     */
    width: number;

    /**
     * Box extent on Y-axis.
     */
    height: number;
}

/**
 * This function generates a box with specified extents and centered at origin,
 * but may emplaced through `center` option).
 * @param options Options.
 */
export default function box (options: IBoxOptions): IGeometry {
    normalizeGeometryOptions(options);

    const right = options.length / 2;
    const left = -right;
    const top = options.height / 2;
    const bottom = -top;
    const near = options.width / 2;
    const far = -near;
    const center = options.center ? {
        x: options.center.x || 0,
        y: options.center.y || 0,
        z: options.center.z || 0,
    } : {
        x: 0,
        y: 0,
        z: 0,
    };

    const vertices: number[] = [];
    const addVertex = (x: number, y: number, z: number) => {
        vertices.push(x + center.x, y + center.y, z + center.z);
    };
    addVertex(left, top, near);
    addVertex(left, bottom, near);
    addVertex(right, bottom, near);
    addVertex(right, top, near);
    addVertex(left, top, far);
    addVertex(left, bottom, far);
    addVertex(right, bottom, far);
    addVertex(right, top, far);

    let indices: number[] = [];
    let normals: number[] | undefined;
    let primitiveType: GFXPrimitiveMode = GFXPrimitiveMode.POINT_LIST;
    if (options.wireframed) {
        primitiveType = GFXPrimitiveMode.LINE_LIST;
        indices = indices.concat([
            0, 1, 1, 2, 2, 3, 3, 0, // Front quad
            4, 5, 5, 6, 6, 7, 7, 4, // Back quad
            0, 4, 1, 5, 2, 6, 3, 7, // Side lines
        ]);
    } else {
        primitiveType = GFXPrimitiveMode.TRIANGLE_LIST;
        type FaceNormal = [ number, number, number ];
        type FaceQuad = [
            number, // Left top
            number, // Left bottom
            number, // Right bottom
            number // Right top
        ];
        interface IFaceInfo {
            quad: FaceQuad;
            normal: FaceNormal;
        }
        interface IFaceInfos {
            front: IFaceInfo;
            right: IFaceInfo;
            back: IFaceInfo;
            left: IFaceInfo;
            top: IFaceInfo;
            bottom: IFaceInfo;
        }

        const addTri = (i: number, j: number, k: number) => {
            if (options.windingOrder === WindingOrder.CounterClockwise) {
                indices.push(i, j, k);
            } else {
                indices.push(i, k, j);
            }
        };

        const addQuad = (faceQuad: FaceQuad) => {
            const lt = faceQuad[0];
            const lb = faceQuad[1];
            const rb = faceQuad[2];
            const rt = faceQuad[3];
            addTri(lt, lb, rb);
            addTri(lt, rb, rt);
        };

        const addNormal = (faceNormal: FaceNormal) => {
            const x = faceNormal[0];
            const y = faceNormal[1];
            const z = faceNormal[2];
            if (options.windingOrder === WindingOrder.CounterClockwise) {
                normals!.push(x, y, z);
            } else {
                normals!.push(-x, -y, -z);
            }
        };

        const addFace = (face: IFaceInfo) => {
            addQuad(face.quad);
            if (normals) {
                addNormal(face.normal);
            }
        };

        const faceInfos: IFaceInfos = {
            front: {
                quad: [0, 1, 2, 3],
                normal: [0, 0, 1],
            },
            right: {
                quad: [3, 2, 6, 7],
                normal: [1, 0, 0],
            },
            back: {
                quad: [7, 6, 5, 4],
                normal: [0, 0, -1],
            },
            left: {
                quad: [4, 5, 1, 0],
                normal: [-1, 0, 0],
            },
            top: {
                quad: [4, 0, 3, 7],
                normal: [0, 1, 0],
            },
            bottom: {
                quad: [1, 5, 6, 2],
                normal: [0, -1, 0],
            },
        };

        if (options.includeNormal) {
            normals = [];
        }
        addFace(faceInfos.front);
        addFace(faceInfos.right);
        addFace(faceInfos.back);
        addFace(faceInfos.left);
        addFace(faceInfos.top);
        addFace(faceInfos.bottom);
    }

    const result: IGeometry = {
        primitiveType,
        vertices,
        indices,
    };

    if (normals) {
        result.normals = normals;
    }

    return result;
}
