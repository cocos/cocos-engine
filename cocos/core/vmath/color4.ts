import { EPSILON } from './utils';

/**
 * Represents a color with red(r), green(g), blue(b) component of that color and
 * and an extra alpha(a) component indicating how opaque this color is.
 */
class color4 {
    /**
     * Creates a color, with components specified separately.
     *
     * @param r - Value assigned to r component.
     * @param g - Value assigned to g component.
     * @param b - Value assigned to b component.
     * @param a - Value assigned to a component.
     */
    constructor(r = 1, g = 1, b = 1, a = 1) {
        /**
         * The r component.
         * @type {number}
         * */
        this.r = r;

        /**
         * The g component.
         * @type {number}
         * */
        this.g = g;

        /**
         * The b component.
         * @type {number}
         * */
        this.b = b;

        /**
         * The a component.
         * @type {number}
         * */
        this.a = a;
    }

    /**
     * Creates a white color, or components specified separately.
     *
     * @param r - Value assigned to r component.
     * @param g - Value assigned to g component.
     * @param b - Value assigned to b component.
     * @param a - Value assigned to a component.
     * @return The newly created color.
     */
    static create(r = 1, g = 1, b = 1, a = 1) {
        return new color4(r, g, b, a);
    }

    /**
     * Clone a color.
     *
     * @param a - Color to clone.
     * @return The newly created color.
     */
    static clone(a) {
        return new color4(a.r, a.g, a.b, a.a);
    }

    /**
     * Copy content of a color into another.
     *
     * @param out - The color to modified.
     * @param a - The specified color.
     * @return out.
     */
    static copy(out, a) {
        out.r = a.r;
        out.g = a.g;
        out.b = a.b;
        out.a = a.a;
        return out;
    }

    /**
     * Set the components of a color to the given values.
     *
     * @param out - The color to modified.
     * @param r - Value assigned to r component.
     * @param g - Value assigned to g component.
     * @param b - Value assigned to b component.
     * @param a - Value assigned to a component.
     * @return out.
     */
    static set(out, r, g, b, a) {
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * Converts the hexadecimal formal color into rgb formal.
     *
     * @param out - Color to store result.
     * @param hex - The color's hexadecimal formal.
     * @return out.
     * @function
     */
    static fromHex(out, hex) {
        let r = ((hex >> 24)) / 255.0;
        let g = ((hex >> 16) & 0xff) / 255.0;
        let b = ((hex >> 8) & 0xff) / 255.0;
        let a = ((hex) & 0xff) / 255.0;

        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * Add components of two colors, respectively.
     *
     * @param out - Color to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    static add(out, a, b) {
        out.r = a.r + b.r;
        out.g = a.g + b.g;
        out.b = a.b + b.b;
        out.a = a.a + b.a;
        return out;
    }

    /**
     * Subtract components of color b from components of color a, respectively.
     *
     * @param out - Color to store result.
     * @param a - The a.
     * @param b - The b.
     * @return out.
     */
    static subtract(out, a, b) {
        out.r = a.r - b.r;
        out.g = a.g - b.g;
        out.b = a.b - b.b;
        out.a = a.a - b.a;
        return out;
    }

    /**
     * Alias of {@link color4.subtract}.
     */
    static sub(out, a, b) {
        return color4.subtract(out, a, b);
    }

    /**
     * Multiply components of two colors, respectively.
     *
     * @param out - Color to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    static multiply(out, a, b) {
        out.r = a.r * b.r;
        out.g = a.g * b.g;
        out.b = a.b * b.b;
        out.a = a.a * b.a;
        return out;
    }

    /**
     * Alias of {@link color4.multiply}.
     */
    static mul(out, a, b) {
        return color4.multiply(out, a, b);
    }

    /**
     * Divide components of color a by components of color b, respectively.
     *
     * @param out - Color to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @return out.
     */
    static divide(out, a, b) {
        out.r = a.r / b.r;
        out.g = a.g / b.g;
        out.b = a.b / b.b;
        out.a = a.a / b.a;
        return out;
    }

    /**
     * Alias of {@link color4.divide}.
     */
    static div(out, a, b) {
        return color4.divide(out, a, b);
    }

    /**
     * Scales a color by a number.
     *
     * @param out - Color to store result.
     * @param a - Color to scale.
     * @param b - The scale number.
     * @return out.
     */
    static scale(out, a, b) {
        out.r = a.r * b;
        out.g = a.g * b;
        out.b = a.b * b;
        out.a = a.a * b;
        return out;
    }

    /**
     * Performs a linear interpolation between two colors.
     *
     * @param out - Color to store result.
     * @param a - The first operand.
     * @param b - The second operand.
     * @param t - The interpolation coefficient.
     * @return out.
     */
    static lerp(out, a, b, t) {
        let ar = a.r,
            ag = a.g,
            ab = a.b,
            aa = a.a;
        out.r = ar + t * (b.r - ar);
        out.g = ag + t * (b.g - ag);
        out.b = ab + t * (b.b - ab);
        out.a = aa + t * (b.a - aa);
        return out;
    }

    /**
     * Returns string representation of a color.
     *
     * @param a - The color.
     * @return - String representation of this color.
     */
    static str(a) {
        return `color4(${a.r}, ${a.g}, ${a.b}, ${a.a})`;
    }

    /**
     * Store components of a color into array.
     *
     * @param out - Array to store result.
     * @param a - The color.
     * @return out.
     */
    static array(out, a) {
        let scale = (a instanceof cc.Color || a.a > 1) ? 1 / 255 : 1;
        out[0] = a.r * scale;
        out[1] = a.g * scale;
        out[2] = a.b * scale;
        out[3] = a.a * scale;

        return out;
    }

    /**
     * Returns whether the specified colors are equal. (Compared using ===)
     *
     * @param a - The first color.
     * @param b - The second color.
     * @return True if the colors are equal, false otherwise.
     */
    static exactEquals(a, b) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }

    /**
     * Returns whether the specified colors are approximately equal.
     *
     * @param a - The first color.
     * @param b - The second color.
     * @return True if the colors are approximately equal, false otherwise.
     */
    static equals(a, b) {
        let a0 = a.r, a1 = a.g, a2 = a.b, a3 = a.a;
        let b0 = b.r, b1 = b.g, b2 = b.b, b3 = b.a;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
    }

    /**
     * Converts a color's rgb formal into the hexadecimal one.
     *
     * @param a - The color.
     * @return - The color's hexadecimal formal.
     */
    static hex(a) {
        return ((a.r * 255) << 24 | (a.g * 255) << 16 | (a.b * 255) << 8 | a.a * 255) >>> 0;
    }
}

export default color4;