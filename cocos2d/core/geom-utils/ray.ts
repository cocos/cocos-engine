import Vec3 from '../value-types/vec3';

/**
 * @class geomUtils.Ray
 * @param {Number} ox 
 * @param {Number} oy 
 * @param {Number} oz 
 * @param {Number} dx 
 * @param {Number} dy 
 * @param {Number} dz 
 */
export default class ray {
    /**
     * @property {Vec3} o
     */
    o: Vec3;
    /**
     * @property {Vec3} d
     */
    d: Vec3;

    constructor (ox = 0, oy = 0, oz = 0, dx = 1, dy = 1, dz = 1) {
        this.o = new Vec3(ox, oy, oz);
        this.d = new Vec3(dx, dy, dz);
    }

    /**
     * Creates a new ray initialized with values from an existing ray
     * @method clone
     * @param {geomUtils.Ray} a ray to clone
     * @returns {geomUtils.Ray} a new ray
     */
    public static clone (a) {
        return new ray(
            a.o.x, a.o.y, a.o.z,
            a.d.x, a.d.y, a.d.z
        );
    }

    /**
     * Copy the values from one ray to another
     * @method copy
     * @param {geomUtils.Ray} out the receiving ray
     * @param {geomUtils.Ray} a the source ray
     * @returns {geomUtils.Ray} out
     */
    public static copy (out, a) {
        out.o.x = a.o.x;
        out.o.y = a.o.y;
        out.o.z = a.o.z;
        out.d.x = a.d.x;
        out.d.y = a.d.y;
        out.d.z = a.d.z;

        return out;
    }

    /**
     * Set the components of a vec3 to the given values
     * @method set
     * @param {Vec3} out the receiving vector
     * @param {Number} ox origin X component
     * @param {Number} oy origin Y component
     * @param {Number} oz origin Z component
     * @param {Number} dx dir X component
     * @param {Number} dy dir Y component
     * @param {Number} dz dir Z component
     * @returns {Vec3} out
     */
    public static set (out, ox, oy, oz, dx, dy, dz) {
        out.o.x = ox;
        out.o.y = oy;
        out.o.z = oz;
        out.d.x = dx;
        out.d.y = dy;
        out.d.z = dz;

        return out;
    }

    /**
     * create ray from 2 points
     * @method fromPoints
     * @param {geomUtils.Ray} out the receiving plane
     * @param {Vec3} origin
     * @param {Vec3} lookAt
     * @returns {geomUtils.Ray} out
     */
    public static fromPoints (out, origin, lookAt) {
        Vec3.copy(out.o, origin);
        Vec3.normalize(out.d, Vec3.sub(out.d, lookAt, origin));

        return out;
    }
}
