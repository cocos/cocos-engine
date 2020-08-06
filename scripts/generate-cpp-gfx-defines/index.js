
// TODO:
// compile define.ts on the fly to get rid of bin/.cache dependency

const defines = require('../../bin/.cache/dev/cocos/core/gfx/define');
const fs = require('fs');
const { isObject } = require('util');

const enumList = [
    'ObjectType',
    'Status',
    'AttributeName',
    'Type',
    'Format',
    'BufferUsageBit',
    'MemoryUsageBit',
    'BufferFlagBit',
    'BufferAccessBit',
    'PrimitiveMode',
    'PolygonMode',
    'ShadeModel',
    'CullMode',
    'ComparisonFunc',
    'StencilOp',
    'BlendOp',
    'BlendFactor',
    'ColorMask',
    'Filter',
    'Address',
    'TextureType',
    'TextureUsageBit',
    'SampleCount',
    'TextureFlagBit',
    'ShaderType',
    'DescriptorType',
    'CommandBufferType',
    'LoadOp',
    'StoreOp',
    'TextureLayout',
    'PipelineBindPoint',
    'DynamicStateFlagBit',
    'StencilFace',
    'QueueType',
    'ClearFlag',
    'FormatType',
];

let classList = [
    // 'Rect',
    // 'Viewport',
    // 'Color',
    // 'Offset',
    // 'Extent',
    'TextureSubres',
    // 'TextureCopy',
    // 'BufferTextureCopy',
    // 'FormatInfo',
    // 'MemoryStatus',
];

let content = `
/**
 * Auto generated from engine/cocos/core/define.ts.
 */

#ifndef CC_CORE_GFX_DEF_AUTO_H_
#define CC_CORE_GFX_DEF_AUTO_H_

namespace cc {
namespace gfx {

`;


for (let i = 0; i < enumList.length; i++) {
    const enumName = enumList[i];
    const enumObject = defines['GFX' + enumName];
    content += `\nenum class ${enumName} : uint {\n`;
    for (const key in enumObject) {
        if (isNaN(parseInt(key))) {
            const value = enumObject[key];
            const valueString = isNaN(parseInt(value)) ? `"${value}"` : `0x${value.toString(16)}`;
            content += `    ${key} = ${valueString},\n`;
        }
    }
    content += `};\n`;
}

for (let i = 0; i < classList.length; i++) {
    const className = classList[i];
    const classObjectCtor = defines['GFX' + className];
    const classObject = new classObjectCtor();
    content += `\nstruct ${className} {\n`;
    for (const key in classObject) {
        const value = classObject[key];
        if (typeof value === 'object') {
            content += `    ${value.constructor.name.slice(3)} ${key};\n`;
        } else if (typeof value === 'number') {
            content += `    int ${key} = ${value};\n`;
        }
    }
    content += `};\n`;
}

content += `
} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DEF_AUTO_H_
`;

fs.writeFileSync('GFXDef-Auto.h', content, { encoding: 'utf8' });
