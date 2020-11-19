import { IAssemblerManager } from '../../core/renderer/ui/base';
import { Skeleton } from '../skeleton';
import { simple } from './simple';

// Inline all type switch to avoid jit deoptimization during inlined function change

export const simpleSpineAssembler: IAssemblerManager = {
    getAssembler () {
        return simple;
    },
};

Skeleton.Assembler = simpleSpineAssembler;
