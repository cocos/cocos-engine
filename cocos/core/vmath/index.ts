/**
<<<<<<< HEAD
 * @category core/math
=======
 * @category core/math 数学库模块
 * @hidden
>>>>>>> Daily merge (#4693)
 */

export * from './utils';

// NOTE: there is no syntax for: export {* as bits} from './lib/bits';
import * as bits from './bits';
/**
 * Export module bits.
 */
export { bits };

export { vec2 } from './vec2';
export { vec3 } from './vec3';
export { vec4 } from './vec4';
export { quat } from './quat';
export { mat3 } from './mat3';
export { mat4 } from './mat4';
export { color4 } from './color4';
