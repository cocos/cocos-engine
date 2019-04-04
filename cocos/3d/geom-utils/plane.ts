import { vec3, mat4, vec4 } from '../../core/vmath';
import enums from './enums';

const v1 = vec3.create(0, 0, 0);
const v2 = vec3.create(0, 0, 0);

export default class plane {

    /**
     * create a new plane
     *
     * @param nx normal X component
     * @param ny normal Y component
     * @param nz normal Z component
     * @param d distance to the origin
     * @return
     */
    public static create (nx: number, ny: number, nz: number, d: number) {
        return new plane(nx, ny, nz, d);
    }

    /**
     * clone a new plane
     *
     * @param p a the source plane
     * @return
     */
    public static clone (p: plane) {
        return new plane(p.n.x, p.n.y, p.n.z, p.d);
    }

    /**
     * copy the values from one plane to another
     *
     * @param out the receiving plane
     * @param p the source plane
     * @return
     */
    public static copy (out: plane, p: plane) {
        vec3.copy(out.n, p.n);
        out.d = p.d;

        return out;
    }

    /**
     * create a plane from three points
     *
     * @param out the receiving plane
     * @param a
     * @param b
     * @param c
     * @return
     */
    public static fromPoints (out: plane, a: vec3, b: vec3, c: vec3) {
        vec3.sub(v1, b, a);
        vec3.sub(v2, c, a);

        vec3.normalize(out.n, vec3.cross(out.n, v1, v2));
        out.d = vec3.dot(out.n, a);

        return out;
    }

    /**
     * Set the components of a plane to the given values
     *
     * @param out the receiving plane
     * @param nx X component of n
     * @param ny Y component of n
     * @param nz Z component of n
     * @param d
     * @return out
     */
    public static set (out: plane, nx: number, ny: number, nz: number, d: number) {
        out.n.x = nx;
        out.n.y = ny;
        out.n.z = nz;
        out.d = d;

        return out;
    }

    /**
     * create plane from normal and point
     *
     * @param out the receiving plane
     * @param normal
     * @param point
     * @return out
     */
    public static fromNormalAndPoint (out: plane, normal: vec3, point: vec3) {
        vec3.copy(out.n, normal);
        out.d = vec3.dot(normal, point);

        return out;
    }

    /**
     * normalize a plane
     *
     * @param out the receiving plane
     * @param a plane to normalize
     * @return out
     */
    public static normalize (out: plane, a: plane) {
        const len = vec3.magnitude(a.n);
        vec3.normalize(out.n, a.n);
        if (len > 0) {
            out.d = a.d / len;
        }
        return out;
    }

    public transform = (() => {
        const temp_mat = cc.mat4();
        const temp_vec4 = cc.v4();
        return (mat: mat4) => {
            mat4.invert(temp_mat, mat);
            mat4.transpose(temp_mat, temp_mat);
            vec4.set(temp_vec4, this.n.x, this.n.y, this.n.z, this.d);
            vec4.transformMat4(temp_vec4, temp_vec4, temp_mat);
            vec3.set(this.n, temp_vec4.x, temp_vec4.y, temp_vec4.z);
            this.d = temp_vec4.w;
        };
    })();

    public n: vec3;
    public d: number;

    private _type: number;

    constructor (nx = 0, ny = 1, nz = 0, d = 0) {
        this._type = enums.SHAPE_PLANE;
        this.n = vec3.create(nx, ny, nz);
        this.d = d;
    }
}
