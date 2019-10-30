import { vfmt3D } from './webgl/vertex-format';
import Vec3 from '../value-types/vec3';

let vec3_temps = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(cc.v3());
}

let Assembler3D = {
    floatsPerVert: 6,

    uvOffset: 3,
    colorOffset: 5,

    getBuffer (renderer) {
        return renderer._meshBuffer3D;
    },

    getVfmt () {
        return vfmt3D;
    },

    updateWorldVerts (comp) {
        let matrix = comp.node._worldMatrix;
        let local = this._local;
        let world = this._renderData.vDatas[0];
        
        Vec3.set(vec3_temps[0], local[0], local[1], 0);
        Vec3.set(vec3_temps[1], local[2], local[1], 0);
        Vec3.set(vec3_temps[2], local[0], local[3], 0);
        Vec3.set(vec3_temps[3], local[2], local[3], 0);

        let floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < 4; i++) {
            let vertex = vec3_temps[i];
            Vec3.transformMat4(vertex, vertex, matrix);

            let dstOffset = floatsPerVert * i;
            world[dstOffset] = vertex.x;
            world[dstOffset+1] = vertex.y;
            world[dstOffset+2] = vertex.z;
        }
    },
};

cc.Assembler3D = Assembler3D;
export default Assembler3D;
