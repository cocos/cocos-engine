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
    ttf,
} from './assembler';
import { MeshBuffer } from '../core/renderer/ui/mesh-buffer';
import * as UIVertexFormat from '../core/renderer/ui/ui-vertex-format';
import { StencilManager } from '../core/renderer/ui/stencil-manager';
import { legacyCC } from '../core/global-exports';

export * from './components';

export {
    MeshBuffer,
    UIVertexFormat,
    StencilManager,
    CanvasPool,
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

legacyCC.UI = {
    MeshBuffer,
    UIVertexFormat,
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