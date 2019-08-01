import Asembler from '../../../assembler';
import { Type } from '../../../../components/CCSprite';

import Simple from "./simple";
import Sliced from "./sliced";
import Tiled from "./tiled";

let ctor = {
    getConstructor(sprite) {
        let ctor = Simple;
        switch (sprite.type) {
            case Type.SLICED:
                ctor = Sliced;
                break;
            case Type.TILED:
                ctor = Tiled;
                break;
        }

        return ctor;
    },

    Simple,
    Sliced,
    Tiled
};

Asembler.register(cc.Sprite, ctor);
