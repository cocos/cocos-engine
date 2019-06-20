
import * as Assembler from './assembler';
import { MeshBuffer } from './mesh-buffer';
import * as UIVertexFormat from './ui-vertex-format';

export * from './components';

export {
    Assembler,
    MeshBuffer,
    UIVertexFormat,
};

cc.UI = { Assembler, MeshBuffer};
