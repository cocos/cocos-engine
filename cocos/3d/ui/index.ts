
import * as Assembler from './assembler';
import { MeshBuffer } from './mesh-buffer';

export * from './components';

export {
    Assembler,
    MeshBuffer,
};

cc.UI = { Assembler, MeshBuffer};
