
/**
 * @class primitive.VertexData
 * @param {[Number]} positions 
 * @param {[Number]} normals 
 * @param {[Number]} uvs 
 * @param {[Number]} indices 
 * @param {Vec3} minPos 
 * @param {Vec3} maxPos 
 * @param {Number} boundingRadius 
 */
export default function VertexData (positions, normals, uvs, indices, minPos, maxPos, boundingRadius) {
    /**
     * @property {[Number]} positions
     */
    this.positions = positions;
    /**
     * @property {[Number]} normals
     */
    this.normals = normals;
    /**
     * @property {[Number]} uvs
     */
    this.uvs = uvs;
    /**
     * @property {[Number]} indices
     */
    this.indices = indices;
    /**
     * @property {Vec3} minPos
     */
    this.minPos = minPos;
    /**
     * @property {Vec3} maxPos
     */
    this.maxPos = maxPos;
    /**
     * @property {Number} boundingRadius
     */
    this.boundingRadius = boundingRadius;
}
