/**
 * @hidden
 */

import { Mat4, Quat, Vec3 } from '../../core/math';
import { IVec3Like, IQuatLike } from '../../core/math/type-define';

/**
 * declare interface
 */
export interface IBuiltinShape {
    center: Vec3;
    transform (m: Mat4, pos: IVec3Like, rot: IQuatLike, scale: IVec3Like, out: IBuiltinShape): any;
}
