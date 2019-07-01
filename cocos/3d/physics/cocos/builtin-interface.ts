/**
 * @hidden
 */

import { mat4, quat, vec3 } from '../../../core/vmath';

/**
 * declare interface
 */
export interface IBuiltinShape {
    center: vec3;
    setScale (scale: vec3, out: IBuiltinShape): void;
    translateAndRotate (m: mat4, rot: quat, out: IBuiltinShape): void;
    transform (...args: any): any;
}
