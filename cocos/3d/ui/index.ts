/**
 * @hidden
 */

import {
    barFilled,
    bmfont,
    CanvasPool,
    graphics,
    graphicsAssembler,
    labelAssembler,
    letter,
    mask,
    maskEnd,
    radialFilled,
    simple,
    sliced,
    spriteAssembler,
    StencilManager,
    ttf,
} from './assembler';
import { MeshBuffer } from './mesh-buffer';
import { vfmt } from './ui-vertex-format';

export * from './components';
export * from '../../renderer/ui/ui-render-flag';

export {
    MeshBuffer,
    StencilManager,
    CanvasPool,
    vfmt,
    barFilled,
    radialFilled,
    simple,
    sliced,
    ttf,
    bmfont,
    letter,
    mask,
    maskEnd,
    spriteAssembler,
    graphics,
    labelAssembler,
    graphicsAssembler,

};

cc.UI = {
    MeshBuffer,
    vfmt,
    barFilled,
    radialFilled,
    simple,
    sliced,
    ttf,
    bmfont,
    letter,
    mask,
    maskEnd,
    graphics,
    spriteAssembler,
    graphicsAssembler,
    labelAssembler,
};
