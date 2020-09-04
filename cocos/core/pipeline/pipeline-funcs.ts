/**
 * @category pipeline
 */

import { GFXColor } from '../gfx/define';

/**
 * @en Convert color in SRGB space to linear space
 * @zh SRGB 颜色空间转换为线性空间。
 * @param out Output color object
 * @param gamma Gamma value in SRGB space
 */
export function SRGBToLinear (out: GFXColor, gamma: GFXColor) {
    // out.x = Math.pow(gamma.x, 2.2);
    // out.y = Math.pow(gamma.y, 2.2);
    // out.z = Math.pow(gamma.z, 2.2);
    out.x = gamma.x * gamma.x;
    out.y = gamma.y * gamma.y;
    out.z = gamma.z * gamma.z;
}

/**
 * @en Convert color in linear space to SRGB space
 * @zh 线性空间转换为 SRGB 颜色空间。
 * @param out Output color object
 * @param linear Color value in linear space
 */
export function LinearToSRGB (out: GFXColor, linear: GFXColor) {
    // out.x = Math.pow(linear.x, 0.454545);
    // out.y = Math.pow(linear.y, 0.454545);
    // out.z = Math.pow(linear.z, 0.454545);
    out.x = Math.sqrt(linear.x);
    out.y = Math.sqrt(linear.y);
    out.z = Math.sqrt(linear.z);
}
