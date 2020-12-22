import { MINIGAME, RUNTIME_BASED } from 'internal:constants';
import glsl1 from './shader-sources/glsl1';
import glsl3 from './shader-sources/glsl3';
import glsl4 from './shader-sources/glsl4';

type ShaderVersion =
    | 'glsl1'
    | 'glsl3'
    | 'glsl4'
    ;

type ShaderSource = unknown[][];

/**
 * The shader sources assembled in this build.
 */
const assembly: Partial<Record<ShaderVersion, ShaderSource>> = (() => {
    if (MINIGAME || RUNTIME_BASED) {
        return {
            glsl1,
        };
    } else {
        return {
            glsl1,
            glsl3,
            glsl4,
        };
    }
})();

export default assembly;
