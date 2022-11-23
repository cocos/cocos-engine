import { ShaderStageFlagBit, Type } from '../../gfx';
import { DefaultVisitor } from './graph';
import { DescriptorData, LayoutGraphData, LayoutGraphDataValue, PipelineLayoutData } from './layout-graph';
import { UpdateFrequency, getUpdateFrequencyName, getDescriptorTypeOrderName } from './types';

function getName (type: Type): string {
    switch (type) {
    case Type.UNKNOWN: return 'Unknown';
    case Type.BOOL: return 'Bool';
    case Type.BOOL2: return 'Bool2';
    case Type.BOOL3: return 'Bool3';
    case Type.BOOL4: return 'Bool4';
    case Type.INT: return 'Int';
    case Type.INT2: return 'Int2';
    case Type.INT3: return 'Int3';
    case Type.INT4: return 'Int4';
    case Type.UINT: return 'Uint';
    case Type.UINT2: return 'Uint2';
    case Type.UINT3: return 'Uint3';
    case Type.UINT4: return 'Uint4';
    case Type.FLOAT: return 'Float';
    case Type.FLOAT2: return 'Float2';
    case Type.FLOAT3: return 'Float3';
    case Type.FLOAT4: return 'Float4';
    case Type.MAT2: return 'Mat2';
    case Type.MAT2X3: return 'Mat2x3';
    case Type.MAT2X4: return 'Mat2x4';
    case Type.MAT3X2: return 'Mat3x2';
    case Type.MAT3: return 'Mat3';
    case Type.MAT3X4: return 'Mat3x4';
    case Type.MAT4X2: return 'Mat4x2';
    case Type.MAT4X3: return 'Mat4x3';
    case Type.MAT4: return 'Mat4';
    case Type.SAMPLER1D: return 'Sampler1D';
    case Type.SAMPLER1D_ARRAY: return 'Sampler1DArray';
    case Type.SAMPLER2D: return 'Sampler2D';
    case Type.SAMPLER2D_ARRAY: return 'Sampler2DArray';
    case Type.SAMPLER3D: return 'Sampler3D';
    case Type.SAMPLER_CUBE: return 'SamplerCube';
    case Type.SAMPLER: return 'Sampler';
    case Type.TEXTURE1D: return 'Texture1D';
    case Type.TEXTURE1D_ARRAY: return 'Texture1DArray';
    case Type.TEXTURE2D: return 'Texture2D';
    case Type.TEXTURE2D_ARRAY: return 'Texture2DArray';
    case Type.TEXTURE3D: return 'Texture3D';
    case Type.TEXTURE_CUBE: return 'TextureCube';
    case Type.IMAGE1D: return 'Image1D';
    case Type.IMAGE1D_ARRAY: return 'Image1DArray';
    case Type.IMAGE2D: return 'Image2D';
    case Type.IMAGE2D_ARRAY: return 'Image2DArray';
    case Type.IMAGE3D: return 'Image3D';
    case Type.IMAGE_CUBE: return 'ImageCube';
    case Type.SUBPASS_INPUT: return 'SubpassInput';
    case Type.COUNT: return 'Count';
    default: return 'Unknown';
    }
}

function hasFlag (flags: ShaderStageFlagBit, flagToTest: ShaderStageFlagBit): boolean {
    return (flags & flagToTest) !== 0;
}

function getVisibilityName (stage: ShaderStageFlagBit): string {
    let count = 0;
    let str = '';
    if (hasFlag(stage, ShaderStageFlagBit.VERTEX)) {
        if (count++) {
            str += ' | ';
        }
        str += 'Vertex';
    }
    if (hasFlag(stage, ShaderStageFlagBit.CONTROL)) {
        if (count++) {
            str += ' | ';
        }
        str += 'Control';
    }
    if (hasFlag(stage, ShaderStageFlagBit.EVALUATION)) {
        if (count++) {
            str += ' | ';
        }
        str += 'Evaluation';
    }
    if (hasFlag(stage, ShaderStageFlagBit.GEOMETRY)) {
        if (count++) {
            str += ' | ';
        }
        str += 'Geometry';
    }
    if (hasFlag(stage, ShaderStageFlagBit.FRAGMENT)) {
        if (count++) {
            str += ' | ';
        }
        str += 'Fragment';
    }
    if (hasFlag(stage, ShaderStageFlagBit.COMPUTE)) {
        if (count++) {
            str += ' | ';
        }
        str += 'Compute';
    }
    if (stage === ShaderStageFlagBit.ALL) {
        if (count++) {
            str += ' | ';
        }
        str += 'All';
    }
    return str;
}

export class PrintVisitor extends DefaultVisitor {
    discoverVertex (u: number, g: LayoutGraphData) {
        const ppl: PipelineLayoutData = g.getLayout(u);
        const name: string = g._names[u];
        const freq: UpdateFrequency = g._updateFrequencies[u];
        this.oss += `${this.space}"${name}": `;
        if (g.holds(LayoutGraphDataValue.RenderStage, u)) {
            this.oss += `RenderStage {\n`;
        } else {
            this.oss += `RenderPhase {\n`;
        }
        this.space += '    ';

        // eslint-disable-next-line no-loop-func
        ppl.descriptorSets.forEach((value, key) => {
            this.oss += `${this.space}DescriptorSet<${getUpdateFrequencyName(key)}> {\n`;
            this.space += '    ';
            const uniformBlocks = value.descriptorSetLayoutData.uniformBlocks;
            uniformBlocks.forEach((uniformBlock, attrNameID) => {
                const name = g.valueNames[attrNameID];
                this.oss += `${this.space}UniformBlock "${name}" {\n`;
                for (const u of uniformBlock.members) {
                    if (u.count > 1) {
                        this.oss += `${this.space}    ${u.name}[${u.count}]: ${getName(u.type)}\n`;
                    } else {
                        this.oss += `${this.space}    ${u.name}: ${getName(u.type)}\n`;
                    }
                }
                this.oss += `${this.space}}\n`;
            });

            const blocks = value.descriptorSetLayoutData.descriptorBlocks;
            for (let j = 0; j < blocks.length; ++j) {
                const block = blocks[j];
                this.oss += `${this.space}Block<${getDescriptorTypeOrderName(block.type)}, ${getVisibilityName(block.visibility)}> {\n`;
                this.oss += `${this.space}    offset: ${block.offset}\n`;
                this.oss += `${this.space}    capacity: ${block.capacity}\n`;
                this.oss += `${this.space}    count: ${block.descriptors.length}\n`;
                if (block.descriptors.length > 0) {
                    this.oss += `${this.space}    Descriptors{ \n`;
                    const count = 0;
                    for (let k = 0; k < block.descriptors.length; ++k) {
                        const d: DescriptorData = block.descriptors[k];
                        // if (count++) {
                        this.oss += this.space;
                        this.oss += '        ';
                        const n: string = g.valueNames[d.descriptorID];
                        this.oss += `"${n}`;
                        if (d.count !== 1) {
                            this.oss += `[${d.count}]`;
                        }
                        this.oss += '"';
                        // }
                        this.oss += '\n';
                    }
                    this.oss += `${this.space}    }\n`;
                }
                this.oss += `${this.space}}\n`;
            }
            this.space = this.space.substring(0, this.space.length - 4);
            this.oss += `${this.space}}\n`;
        });
    }
    finishVertex (v: number, g: LayoutGraphData) {
        this.space = this.space.substring(0, this.space.length - 4);
        this.oss += `${this.space}}\n`;
    }
    space = '';
    oss = '';
}
