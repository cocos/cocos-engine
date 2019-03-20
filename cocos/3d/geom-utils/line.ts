import { vec3 } from '../../core/vmath';
import enums from './enums';

export default class line {

    /**
     * create a new line
     *
     * @param sx start X component
     * @param sy start Y component
     * @param sz start Z component
     * @param ex end X component
     * @param ey end Y component
     * @param ez end Z component
     * @return
     */
    public static create (sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) {
        return new line(sx, sy, sz, ex, ey, ez);
    }

    /**
     * Creates a new line initialized with values from an existing line
     *
     * @param a line to clone
     * @return a new line
     */
    public static clone (a: line) {
        return new line(
            a.s.x, a.s.y, a.s.z,
            a.e.x, a.e.y, a.e.z,
        );
    }

    /**
     * Copy the values from one line to another
     *
     * @param out the receiving line
     * @param a the source line
     * @return out
     */
    public static copy (out: line, a: line) {
        vec3.copy(out.s, a.s);
        vec3.copy(out.e, a.e);

        return out;
    }

    /**
     * create a line from two points
     *
     * @param out the receiving line
     * @param start line start
     * @param end target position
     * @return out
     */
    public static fromPoints (out: line, start: vec3, end: vec3) {
        vec3.copy(out.s, start);
        vec3.copy(out.e, end);
        return out;
    }

    /**
     * Set the components of a vec3 to the given values
     *
     * @param out the receiving vector
     * @param sx start X component
     * @param sy start Y component
     * @param sz start Z component
     * @param ex end X component
     * @param ey end Y component
     * @param ez end Z component
     * @return out
     */
    public static set (out: line, sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) {
        out.s.x = sx;
        out.s.y = sy;
        out.s.z = sz;
        out.e.x = ex;
        out.e.y = ey;
        out.e.z = ez;

        return out;
    }

    /**
     * create line from 2 points
     *
     * @param a
     * @return
     */
    public static magnitude (a: line) {
        return vec3.distance(a.s, a.e);
    }

    /**
     * Alias of {@link line.magnitude}.
     */
    public static mag (a: line) {
        return line.magnitude(a);
    }

    public s: vec3;
    public e: vec3;

    private _type: number;

    constructor (sx = 0, sy = 0, sz = 0, ex = 0, ey = 0, ez = -1) {
        this._type = enums.SHAPE_LINE;
        this.s = vec3.create(sx, sy, sz);
        this.e = vec3.create(ex, ey, ez);
    }
}
