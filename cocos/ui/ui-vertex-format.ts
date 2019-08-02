/**
 * @category ui
 */
import { GFXAttributeName, GFXFormat } from '../core/gfx/define';

export const vfmt = [
    {
        name: GFXAttributeName.ATTR_POSITION,
        format: GFXFormat.RGB32F,
    },
    {
        name: GFXAttributeName.ATTR_TEX_COORD,
        format: GFXFormat.RG32F,
    },
    {
        name: GFXAttributeName.ATTR_COLOR,
        format: GFXFormat.RGBA32F,
    },
];
