import Vec3 from '../../value-types/vec3';

/**
 * @class primitive.VertexData
 * @param {number[]} positions 
 * @param {number[]} normals 
 * @param {number[]} uvs 
 * @param {number[]} indices 
 * @param {Vec3} minPos 
 * @param {Vec3} maxPos 
 * @param {number} boundingRadius 
 */
export default class VertexData {
    /**
     * @property {number[]} positions
     */
    positions: number[];
    /**
     * @property {number[]} normals
     */
    normals: number[];
    /**
     * @property {number[]} uvs
     */
    uvs: number[];
    /**
     * @property {[Number]} indices
     */
    indices: number[];
    /**
     * @property {Vec3} minPos
     */
    minPos: Vec3;
    /**
     * @property {Vec3} maxPos
     */
    maxPos: Vec3;
    /**
     * @property {number} boundingRadius
     */
    boundingRadius: number;

    constructor(positions: number[], normals: number[], uvs: number[], indices: number[], minPos: Vec3, maxPos: Vec3, boundingRadius: number) {
        this.positions = positions;
        this.normals = normals;
        this.uvs = uvs;
        this.indices = indices;
        this.minPos = minPos;
        this.maxPos = maxPos;
        this.boundingRadius = boundingRadius;
    }
}
