import { IAssemblerManager } from '../../2d/renderer/base';
import { Skeleton } from '../skeleton';
import { simple } from './simple';

// Inline all type switch to avoid jit deoptimization during inlined function change
/**
 * @internal since v3.7.1 this is an engine private object.
 */
export const simpleSpineAssembler: IAssemblerManager = {
    getAssembler () {
        return simple;
    },
};

Skeleton.Assembler = simpleSpineAssembler;
