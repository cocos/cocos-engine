
import Quat from './quat';
import Vec3 from './vec3';
import Mat4 from './Mat4';

let tmp_quat = new Quat();

export default class Trs {
    static toRotation (out: Quat, a: FloatArray): Quat {
        out.x = a[3];
        out.y = a[4];
        out.z = a[5];
        out.w = a[6];
        return out;
    }

    static fromRotation (out: FloatArray, a: Quat): FloatArray {
        out[3] = a.x;
        out[4] = a.y;
        out[5] = a.z;
        out[6] = a.w;
        return out;
    }

    static toEuler (out: Vec3, a: FloatArray): Vec3 {
        Trs.toRotation(tmp_quat, a);
        Quat.toEuler(out, tmp_quat);
        return out;
    }

    static fromEuler (out: FloatArray, a: Vec3): FloatArray {
        Quat.fromEuler(tmp_quat, a.x, a.y, a.z);
        Trs.fromRotation(out, tmp_quat);
        return out;
    }

    static fromEulerNumber (out: FloatArray, x: number, y: number, z: number): FloatArray {
        Quat.fromEuler(tmp_quat, x, y, z);
        Trs.fromRotation(out, tmp_quat);
        return out;
    }

    static toScale (out: Vec3, a: FloatArray): Vec3 {
        out.x = a[7];
        out.y = a[8];
        out.z = a[9];
        return out;
    }

    static fromScale (out: FloatArray, a: Vec3): FloatArray {
        out[7] = a.x;
        out[8] = a.y;
        out[9] = a.z;
        return out;
    }

    static toPosition (out: Vec3, a: FloatArray): Vec3 {
        out.x = a[0];
        out.y = a[1];
        out.z = a[2];
        return out;
    }

    static fromPosition (out: FloatArray, a: Vec3): FloatArray {
        out[0] = a.x;
        out[1] = a.y;
        out[2] = a.z;
        return out;
    }

    static fromAngleZ (out: FloatArray, a: number): FloatArray {
        Quat.fromAngleZ(tmp_quat, a);
        Trs.fromRotation(out, tmp_quat);
        return out;
    }

    static toMat4 (out: Mat4, trs: FloatArray): Mat4 {
        let x = trs[3], y = trs[4], z = trs[5], w = trs[6];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;
        let sx = trs[7];
        let sy = trs[8];
        let sz = trs[9];

        let m = out.m;
        m[0] = (1 - (yy + zz)) * sx;
        m[1] = (xy + wz) * sx;
        m[2] = (xz - wy) * sx;
        m[3] = 0;
        m[4] = (xy - wz) * sy;
        m[5] = (1 - (xx + zz)) * sy;
        m[6] = (yz + wx) * sy;
        m[7] = 0;
        m[8] = (xz + wy) * sz;
        m[9] = (yz - wx) * sz;
        m[10] = (1 - (xx + yy)) * sz;
        m[11] = 0;
        m[12] = trs[0];
        m[13] = trs[1];
        m[14] = trs[2];
        m[15] = 1;

        return out;
    }
}

cc.Trs = Trs;