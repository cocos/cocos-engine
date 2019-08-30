/**
 * @hidden
 */

import { Mat4, Quat, Vec3 } from '../../core/math';

/**
 * declare interface
 */
export interface IBuiltinShape {
    center: Vec3;
    setScale (scale: Vec3, out: IBuiltinShape): void;
    translateAndRotate (m: Mat4, rot: Quat, out: IBuiltinShape): void;
    transform (...args: any): any;
}
