import { IAssemblerManager } from '../../core/renderer/ui/base';
import { ArmatureDisplay } from '../ArmatureDisplay';
import { simple } from './simple';

// Inline all type switch to avoid jit deoptimization during inlined function change

export const simpleDragonBoneAssembler: IAssemblerManager = {
    getAssembler () {
        return simple;
    },
};

ArmatureDisplay.Assembler = simpleDragonBoneAssembler;
