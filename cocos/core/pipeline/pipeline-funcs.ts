/**
 * @category pipeline
 */

import { IGFXColor } from '../gfx/define';

/**
 * @en Convert color in SRGB space to linear space
 * @zh SRGB 颜色空间转换为线性空间。
 * @param out Output color object
 * @param gamma Gamma value in SRGB space
 */
export function SRGBToLinear (out: IGFXColor, gamma: IGFXColor) {
    // out.r = Math.pow(gamma.r, 2.2);
    // out.g = Math.pow(gamma.g, 2.2);
    // out.b = Math.pow(gamma.b, 2.2);
    out.r = gamma.r * gamma.r;
    out.g = gamma.g * gamma.g;
    out.b = gamma.b * gamma.b;
}

/**
 * @en Convert color in linear space to SRGB space
 * @zh 线性空间转换为 SRGB 颜色空间。
 * @param out Output color object
 * @param linear Color value in linear space
 */
export function LinearToSRGB (out: IGFXColor, linear: IGFXColor) {
    // out.r = Math.pow(linear.r, 0.454545);
    // out.g = Math.pow(linear.g, 0.454545);
    // out.b = Math.pow(linear.b, 0.454545);
    out.r = Math.sqrt(linear.r);
    out.g = Math.sqrt(linear.g);
    out.b = Math.sqrt(linear.b);
}
