import { GFXAttributeName, GFXFormat } from './define';

const vfmt = [
    {
        name: GFXAttributeName.ATTR_POSITION,
        format: GFXFormat.RGB32F,
    },
    {
        name: GFXAttributeName.ATTR_COLOR,
        format: GFXFormat.RGB32F,
    },
    {
        name: GFXAttributeName.ATTR_TEX_COORD,
        format: GFXFormat.RGB32F,
    },
];

export {
    vfmt,
};
