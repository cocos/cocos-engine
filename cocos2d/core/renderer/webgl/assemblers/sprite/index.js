import Asembler from '../../../assembler';
import { Type, FillType } from '../../../../components/CCSprite';

import Simple from "./2d/simple";
import Sliced from "./2d/sliced";
import Tiled from "./2d/tiled";
import RadialFilled from "./2d/radial-filled";
import BarFilled from "./2d/bar-filled";
import Mesh from './2d/mesh';

import Simple3D from "./3d/simple";
import Sliced3D from "./3d/sliced";
import Tiled3D from "./3d/tiled";
import RadialFilled3D from "./3d/radial-filled";
import BarFilled3D from "./3d/bar-filled";
import Mesh3D from './3d/mesh';

let ctor = {
    getConstructor(sprite) {
        let is3DNode = sprite.node.is3DNode;

        let ctor = is3DNode ? Simple3D : Simple;
        switch (sprite.type) {
            case Type.SLICED:
                ctor = is3DNode ? Sliced3D : Sliced;
                break;
            case Type.TILED:
                ctor = is3DNode ? Tiled3D : Tiled;
                break;
            case Type.FILLED:
                if (sprite._fillType === FillType.RADIAL) {
                    ctor = is3DNode ? RadialFilled3D : RadialFilled;
                } else {
                    ctor = is3DNode ? BarFilled3D : BarFilled;
                }
                break;
            case Type.MESH:
                ctor = is3DNode ? Mesh3D : Mesh;
                break;
        }

        return ctor;
    },

    Simple,
    Sliced,
    Tiled,
    RadialFilled,
    BarFilled,
    Mesh,

    Simple3D,
    Sliced3D,
    Tiled3D,
    RadialFilled3D,
    BarFilled3D,
    Mesh3D,
};

Asembler.register(cc.Sprite, ctor);
