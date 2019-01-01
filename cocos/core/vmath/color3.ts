import { EPSILON } from './utils';

/**
 * Represents a color with red(r), green(g), blue(b) component of that color.
 */
class color3 {
  /**
   * Creates a color, with components specified separately.
   *
   * @param r - Value assigned to r component.
   * @param g - Value assigned to g component.
   * @param b - Value assigned to b component.
   */
  constructor(r = 1, g = 1, b = 1) {
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
  }

  /**
   * Creates a color, with components specified separately, or a black color if not specified
   *
   * @param r - Value assigned to r component.
   * @param g - Value assigned to g component.
   * @param b - Value assigned to b component.
   * @return The newly created color.
   */
  static create(r = 1, g = 1, b = 1) {
    return new color3(r, g, b);
  }

  /**
   * Clone a color.
   *
   * @param a - Color to clone.
   * @return The newly created color.
   */
  static clone(a) {
    return new color3(a.r, a.g, a.b);
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
    return out;
  }

  /**
   * Set the components of a color to the given values.
   *
   * @param out - The color to modified.
   * @param r - Value assigned to r component.
   * @param g - Value assigned to g component.
   * @param b - Value assigned to b component.
   * @return out.
   */
  static set(out, r, g, b) {
    out.r = r;
    out.g = g;
    out.b = b;
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
    let r = ((hex >> 16)) / 255.0;
    let g = ((hex >> 8) & 0xff) / 255.0;
    let b = ((hex) & 0xff) / 255.0;

    out.r = r;
    out.g = g;
    out.b = b;
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
    return out;
  }

  /**
   * Alias of {@link color3.subtract}.
   */
  static sub(out, a, b) {
    return color3.subtract(out, a, b);
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
    return out;
  }

  /**
   * Alias of {@link color3.multiply}.
   */
  static mul(out, a, b) {
    return color3.multiply(out, a, b);
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
    return out;
  }

  /**
   * Alias of {@link color3.divide}.
   */
  static div(out, a, b) {
    return color3.divide(out, a, b);
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
      ab = a.b;
    out.r = ar + t * (b.r - ar);
    out.g = ag + t * (b.g - ag);
    out.b = ab + t * (b.b - ab);
    return out;
  }

  /**
   * Returns string representation of a color.
   *
   * @param a - The color.
   * @return - String representation of this color.
   */
  static str(a) {
    return `color3(${a.r}, ${a.g}, ${a.b})`;
  }

  /**
   * Store components of a color into array.
   *
   * @param out - Array to store result.
   * @param a - The color.
   * @return out.
   */
  static array(out, a) {
    let scale = a instanceof cc.Color ? 1 / 255 : 1;
    out[0] = a.r * scale;
    out[1] = a.g * scale;
    out[2] = a.b * scale;

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
    return a.r === b.r && a.g === b.g && a.b === b.b;
  }

  /**
   * Returns whether the specified colors are approximately equal.
   *
   * @param a - The first color.
   * @param b - The second color.
   * @return True if the colors are approximately equal, false otherwise.
   */
  static equals(a, b) {
    let a0 = a.r, a1 = a.g, a2 = a.b;
    let b0 = b.r, b1 = b.g, b2 = b.b;
    return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
  }

  /**
   * Converts a color's rgb formal into the hexadecimal one.
   *
   * @param a - The color.
   * @return - The color's hexadecimal formal.
   */
  static hex(a) {
    return (a.r * 255) << 16 | (a.g * 255) << 8 | (a.b * 255);
  }
}

export default color3;