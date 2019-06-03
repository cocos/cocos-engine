import { mat4, quat, vec3 } from '../../core/vmath';
import enums from './enums';

const _v3_tmp = vec3.create();
function maxComponent (v: vec3) { return Math.max(Math.max(v.x, v.y), v.z); }

// tslint:disable-next-line: class-name
export default class sphere {

    /**
     * create a new sphere
     *
     * @return {sphere}
     */
    public static create (cx: number, cy: number, cz: number, r: number): sphere {
        return new sphere(cx, cy, cz, r);
    }

    /**
     * clone a new sphere
     *
     * @param {sphere} p the source sphere
     * @return {sphere}
     */
    public static clone (p: sphere): sphere {
        return new sphere(p.center.x, p.center.y, p.center.z, p.radius);
    }

    /**
     * copy the values from one sphere to another
     *
     * @param {sphere} out the receiving sphere
     * @param {sphere} p the source sphere
     * @return {sphere}
     */
    public static copy (out: sphere, p: sphere): sphere {
        vec3.copy(out.center, p.center);
        out.radius = p.radius;

        return out;
    }

    /**
     * create a new bounding sphere from two corner points
     *
     * @param {sphere} out the receiving sphere
     * @param {vec3} minPos lower corner of the original shape
     * @param {vec3} maxPos upper corner of the original shape
     * @return {sphere}
     */
    public static fromPoints (out: sphere, minPos: vec3, maxPos: vec3): sphere {
        vec3.scale(out.center, vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        out.radius = vec3.mag(vec3.sub(_v3_tmp, maxPos, minPos)) * 0.5;
        return out;
    }

    /**
     * Set the components of a sphere to the given values
     *
     * @param {sphere} out the receiving sphere
     * @param {number} cx X component of c
     * @param {number} cy Y component of c
     * @param {number} cz Z component of c
     * @param {number} r
     * @return {sphere} out
     * @function
     */
    public static set (out: sphere, cx: number, cy: number, cz: number, r: number): sphere {
        out.center.x = cx;
        out.center.y = cy;
        out.center.z = cz;
        out.radius = r;

        return out;
    }

    public center: vec3;
    public radius: number;

    private _type: number;

    constructor (cx = 0, cy = 0, cz = 0, r = 1) {
        this._type = enums.SHAPE_SPHERE;
        this.center = vec3.create(cx, cy, cz);
        this.radius = r;
    }

    public clone () {
        return sphere.clone(this);
    }

    public copy (a: sphere) {
        return sphere.copy(this, a);
    }

    /**
     * Get the bounding points of this shape
     * @param {vec3} minPos
     * @param {vec3} maxPos
     */
    public getBoundary (minPos: vec3, maxPos: vec3) {
        vec3.set(minPos, this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
        vec3.set(maxPos, this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
    }

    /**
     * Transform this shape
     * @param {mat4} m the transform matrix
     * @param {vec3} pos the position part of the transform
     * @param {quat} rot the rotation part of the transform
     * @param {vec3} scale the scale part of the transform
     * @param {sphere} [out] the target shape
     */
    public transform (m: mat4, pos: vec3, rot: quat, scale: vec3, out: sphere) {
        vec3.transformMat4(out.center, this.center, m);
        out.radius = this.radius * maxComponent(scale);
    }

    public translateAndRotate (m: mat4, rot: quat, out: sphere){
        vec3.transformMat4(out.center, this.center, m);
    }

    public setScale (scale: vec3, out: sphere) {
        out.radius = this.radius * maxComponent(scale);
    }
}
