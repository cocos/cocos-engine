import { mat3, quat, vec3 } from '../../core/vmath';

const _v3_tmp = vec3.create();
const _v3_tmp2 = vec3.create();

export default class box {

    /**
     * create a new box
     */
    public static create () {
        return new box(0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * create a new axis-aligned box from two corner points
     *
     * @param minPos lower corner position of the box
     * @param maxPos upper corner position of the box
     * @return
     */
    public static fromPoints (minPos: vec3, maxPos: vec3) {
        vec3.scale(_v3_tmp, vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        vec3.scale(_v3_tmp2, vec3.sub(_v3_tmp2, maxPos, minPos), 0.5);
        return new box(_v3_tmp.x, _v3_tmp.y, _v3_tmp.z,
            _v3_tmp2.x, _v3_tmp2.y, _v3_tmp2.z,
            1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * clone a new box
     *
     * @param a the source box
     * @return
     */
    public static clone (a: box) {
        return new box(a.center.x, a.center.y, a.center.z,
            a.halfExtents.x, a.halfExtents.y, a.halfExtents.z,
            a.orientation.m00, a.orientation.m01, a.orientation.m02,
            a.orientation.m03, a.orientation.m04, a.orientation.m05,
            a.orientation.m06, a.orientation.m07, a.orientation.m08);
    }

    /**
     * copy the values from one box to another
     *
     * @param out the receiving box
     * @param a the source box
     * @return
     */
    public static copy (out: box, a: box) {
        out.center = a.center;
        out.halfExtents = a.halfExtents;
        out.orientation = a.orientation;

        return out;
    }

    /**
     * Set the components of a box to the given values
     *
     * @param {box} out the receiving box
     * @param px X coordinates for box's original point
     * @param py Y coordinates for box's original point
     * @param pz Z coordinates for box's original point
     * @param w the half of box width
     * @param h the half of box height
     * @param l the half of box length
     * @param ox_1 the orientation vector coordinates
     * @param ox_2 the orientation vector coordinates
     * @param ox_3 the orientation vector coordinates
     * @param oy_1 the orientation vector coordinates
     * @param oy_2 the orientation vector coordinates
     * @param oy_3 the orientation vector coordinates
     * @param oz_1 the orientation vector coordinates
     * @param oz_2 the orientation vector coordinates
     * @param oz_3 the orientation vector coordinates
     * @returns out
     * @function
     */
    public static set (
        out: box,
        px: number, py: number, pz: number,
        w: number, h: number, l: number,
        ox_1: number, ox_2: number, ox_3: number,
        oy_1: number, oy_2: number, oy_3: number,
        oz_1: number, oz_2: number, oz_3: number) {
        vec3.set(out.center, px, py, pz);
        vec3.set(out.halfExtents, w, h, l);
        mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
        return out;
    }

    public center: vec3;
    public halfExtents: vec3;
    public orientation: mat3;

    constructor (
        px: number, py: number, pz: number,
        w: number, h: number, l: number,
        ox_1: number, ox_2: number, ox_3: number,
        oy_1: number, oy_2: number, oy_3: number,
        oz_1: number, oz_2: number, oz_3: number) {
        this.center = vec3.create(px, py, pz);
        this.halfExtents = vec3.create(w, h, l);
        this.orientation = mat3.create(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
    }

    /**
     * Get the bounding points of this shape
     * @param minPos
     * @param maxPos
     */
    public getBoundary (minPos: vec3, maxPos: vec3) {
        vec3.sub(minPos, this.center, this.halfExtents);
        vec3.add(maxPos, this.center, this.halfExtents);
    }

    /**
     * Translate this shape and apply the effect to a target shape
     * @param pos the translation factor
     * @param out the target shape
     */
    public translate (pos: vec3, out?: box) {
        if (!out) { out = this; }
        vec3.add(out.center, this.center, pos);
    }

    /**
     * Rotate this shape and apply the effect to a target shape
     * @param rot the rotation factor
     * @param out the target shape
     */
    public rotate (rot: quat, out?: box) {
        if (!out) { out = this; }
        // parent box doesn't contain rotations for now
        mat3.fromQuat(out.orientation, rot);
    }

    /**
     * Scale this shape and apply the effect to a target shape
     * @param scale the scaling factor
     * @param out the target shape
     */
    public scale (scale: vec3, out?: box) {
        if (!out) { out = this; }
        vec3.mul(out.halfExtents, this.halfExtents, scale);
    }
}
