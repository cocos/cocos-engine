
import quat from './quat';

let tmp_quat = quat.create();

export default class trs {
    /**
     * 
     * @param {Quat} out 
     * @param {Float32Array} a 
     * @return {Quat}
     */
    static toRotation (out, a) {
        out.x = a[3];
        out.y = a[4];
        out.z = a[5];
        out.w = a[6];
        return out;
    }

    /**
     * 
     * @param {Float32Array} out 
     * @param {Quat} a 
     * @return {Float32Array}
     */
    static fromRotation (out, a) {
        out[3] = a.x;
        out[4] = a.y;
        out[5] = a.z;
        out[6] = a.w;
        return out;
    }

    /**
     * 
     * @param {Vec3} out 
     * @param {Float32Array} a 
     * @return {Vec3}
     */
    static toEuler (out, a) {
        trs.toRotation(tmp_quat, a);
        quat.toEuler(out, tmp_quat);
        return out;
    }

    /**
     * 
     * @param {Float32Array} out 
     * @param {Vec3} a 
     * @return {Float32Array}
     */
    static fromEuler (out, a) {
        quat.fromEuler(tmp_quat, a.x, a.y, a.z);
        trs.fromRotation(out, tmp_quat);
        return out;
    }

    /**
     * 
     * @param {Float32Array} out 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @return {Float32Array}
     */
    static fromEulerNumber (out, x, y, z) {
        quat.fromEuler(tmp_quat, x, y, z);
        trs.fromRotation(out, tmp_quat);
        return out;
    }

    /**
     * 
     * @param {Vec3} out 
     * @param {Float32Array} a 
     * @return {Vec3}
     */
    static toScale (out, a) {
        out.x = a[7];
        out.y = a[8];
        out.z = a[9];
        return out;
    }

    /**
     * 
     * @param {Float32Array} out 
     * @param {Vec3} a 
     * @return {Float32Array}
     */
    static fromScale (out, a) {
        out[7] = a.x;
        out[8] = a.y;
        out[9] = a.z;
        return out;
    }

    /**
     * 
     * @param {Vec3} out 
     * @param {Float32Array} a 
     * @return {Vec3}
     */
    static toPosition (out, a) {
        out.x = a[0];
        out.y = a[1];
        out.z = a[2];
        return out;
    }

    /**
     * 
     * @param {Float32Array} out 
     * @param {Vec3} a 
     * @return {Float32Array}
     */
    static fromPosition (out, a) {
        out[0] = a.x;
        out[1] = a.y;
        out[2] = a.z;
        return out;
    }

    /**
     * 
     * @param {Float32Array} out 
     * @param {Number} a 
     */
    static fromAngleZ (out, a) {
        quat.fromAngleZ(tmp_quat, a);
        trs.fromRotation(out, tmp_quat);
        return out;
    }

}
