import { DEBUG } from 'internal:constants';
import { ccclass } from '../../data/decorators';
// eslint-disable-next-line max-len
import { DescriptorSetInfo, DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, DescriptorType, Device, ShaderStageFlagBit, Type, Uniform, UniformBlock } from '../../gfx';
import { VectorGraphColorMap } from './effect';
import { DefaultVisitor, depthFirstSearch, GraphColor, MutableVertexPropertyMap } from './graph';
// eslint-disable-next-line max-len
import { DescriptorBlockIndex, LayoutGraphData, PipelineLayoutData, LayoutGraphDataValue, RenderStageData, RenderPhaseData, DescriptorTypeOrder, DescriptorSetLayoutData, DescriptorSetData, DescriptorBlockData, Descriptor, DescriptorData, getDescriptorTypeOrderName, DescriptorBlockFlattened } from './layout-graph';
import { LayoutGraphBuilder } from './pipeline';
import { getUpdateFrequencyName, UpdateFrequency } from './types';

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

class PrintVisitor extends DefaultVisitor {
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

@ccclass('cc.WebLayoutGraphBuilder')
export class WebLayoutGraphBuilder extends LayoutGraphBuilder  {
    private _data: LayoutGraphData;
    private _device: Device | null;

    constructor (deviceIn: Device | null, dataIn: LayoutGraphData) {
        super();
        this._device = deviceIn;
        this._data = dataIn;
    }

    private getGfxType (type: DescriptorTypeOrder): DescriptorType | null {
        switch (type) {
        case DescriptorTypeOrder.UNIFORM_BUFFER:
            return DescriptorType.UNIFORM_BUFFER;
        case DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER:
            return DescriptorType.DYNAMIC_UNIFORM_BUFFER;
        case DescriptorTypeOrder.SAMPLER_TEXTURE:
            return DescriptorType.SAMPLER_TEXTURE;
        case DescriptorTypeOrder.SAMPLER:
            return DescriptorType.SAMPLER;
        case DescriptorTypeOrder.TEXTURE:
            return DescriptorType.TEXTURE;
        case DescriptorTypeOrder.STORAGE_BUFFER:
            return DescriptorType.STORAGE_BUFFER;
        case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
            return DescriptorType.DYNAMIC_STORAGE_BUFFER;
        case DescriptorTypeOrder.STORAGE_IMAGE:
            return DescriptorType.STORAGE_IMAGE;
        case DescriptorTypeOrder.INPUT_ATTACHMENT:
            return DescriptorType.INPUT_ATTACHMENT;
        default:
            console.error('DescriptorType not found');
            return null;
        }
    }

    private createDscriptorInfo (layoutData: DescriptorSetLayoutData, info: DescriptorSetLayoutInfo) {
        for (let i = 0; i < layoutData.descriptorBlocks.length; ++i) {
            const block = layoutData.descriptorBlocks[i];
            let slot = block.offset;
            for (let j = 0; j < block.descriptors.length; ++j) {
                const d = block.descriptors[j];
                const binding: DescriptorSetLayoutBinding = new DescriptorSetLayoutBinding();
                binding.binding = slot;
                if (this.getGfxType(block.type)) {
                    binding.descriptorType = this.getGfxType(block.type) as DescriptorType;
                }
                binding.count = d.count;
                binding.stageFlags = block.visibility;
                binding.immutableSamplers = [];
                info.bindings.push(binding);
                slot += d.count;
            }
        }
    }

    private createDescriptorSetLayout (layoutData: DescriptorSetLayoutData) {
        const info: DescriptorSetLayoutInfo = new DescriptorSetLayoutInfo();
        this.createDscriptorInfo(layoutData, info);

        if (this._device) {
            return this._device.createDescriptorSetLayout(info);
        } else {
            return null;
        }
    }

    public clear (): void {
        this._data.clear();
    }

    public addRenderStage (name: string): number {
        return this._data.addVertex(LayoutGraphDataValue.RenderStage,
            new RenderStageData(), name,
            UpdateFrequency.PER_PASS, new PipelineLayoutData());
    }

    public addRenderPhase (name: string, parentID: number): number {
        return this._data.addVertex(LayoutGraphDataValue.RenderPhase,
            new RenderPhaseData(), name,
            UpdateFrequency.PER_QUEUE, new PipelineLayoutData(),
            parentID);
    }

    public addShader (name: string, parentPhaseID: number): void {
        this._data.shaderLayoutIndex.set(name, parentPhaseID);
    }

    public addDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlockFlattened): void {
        const g: LayoutGraphData = this._data;
        const ppl: PipelineLayoutData = g.getLayout(nodeID);
        if (block.capacity <= 0) {
            console.error('empty block');
            return;
        }
        if (block.descriptorNames.length !== block.descriptors.length) {
            console.error('error descriptor');
            return;
        }
        if (block.uniformBlockNames.length !== block.uniformBlocks.length) {
            console.error('error uniform');
            return;
        }
        let data: DescriptorSetData | undefined = ppl.descriptorSets.get(index.updateFrequency);
        if (!data) {
            data = new DescriptorSetData(new DescriptorSetLayoutData(), null, null);
            ppl.descriptorSets.set(index.updateFrequency, data);
        }
        const layout = data.descriptorSetLayoutData;

        const dstBlock = new DescriptorBlockData(index.descriptorType, index.visibility, block.capacity);
        layout.descriptorBlocks.push(dstBlock);
        dstBlock.offset = layout.capacity;
        dstBlock.capacity = block.capacity;
        for (let j = 0; j < block.descriptors.length; ++j) {
            const name: string = block.descriptorNames[j];
            const d: Descriptor = block.descriptors[j];
            let nameID: number | undefined = g.attributeIndex.get(name);
            if (nameID === undefined) {
                const id = g.valueNames.length;
                g.attributeIndex.set(name, id);
                g.valueNames.push(name);
            }

            nameID = g.attributeIndex.get(name);
            const data: DescriptorData = new DescriptorData(nameID);
            data.count = d.count;
            dstBlock.descriptors.push(data);
        }
        layout.capacity += block.capacity;
    }

    public addUniformBlock (nodeID: number, index: DescriptorBlockIndex, name: string, uniformBlock: UniformBlock): void {
        const g: LayoutGraphData = this._data;
        const ppl: PipelineLayoutData = g.getLayout(nodeID);
        const layout: DescriptorSetLayoutData | undefined = ppl.descriptorSets.get(index.updateFrequency)?.descriptorSetLayoutData;
        if (layout !== undefined) {
            let nameID: number | undefined = g.attributeIndex.get(name);
            if (nameID === undefined) {
                const id = g.valueNames.length;
                g.attributeIndex.set(name, id);
                g.valueNames.push(name);
            }

            nameID = g.attributeIndex.get(name);
            layout.uniformBlocks.set(nameID as number, uniformBlock);
        }
    }

    public reserveDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlockFlattened): void {
        const g: LayoutGraphData = this._data;
        const ppl: PipelineLayoutData = g.getLayout(nodeID);
        if (block.capacity <= 0) {
            console.error('empty block');
            return;
        }

        const layout: DescriptorSetLayoutData | undefined = ppl.descriptorSets.get(index.updateFrequency)?.descriptorSetLayoutData;
        if (layout !== undefined) {
            layout.descriptorBlocks.push(new DescriptorBlockData(index.descriptorType, index.visibility, block.capacity));
            const dstBlock = layout.descriptorBlocks[layout.descriptorBlocks.length - 1];
            dstBlock.offset = layout.capacity;
            dstBlock.capacity = block.capacity;
            layout.capacity += block.capacity;
        } else {
            console.error('no layout');
        }
    }

    public compile (): number {
        const g: LayoutGraphData = this._data;
        for (let i = 0; i < g._layouts.length; ++i) {
            const ppl: PipelineLayoutData = g.getLayout(i);
            ppl.descriptorSets.forEach((value, key) => {
                const level = value;
                const layoutData = level.descriptorSetLayoutData;
                if (this._device) {
                    const layout: DescriptorSetLayout | null = this.createDescriptorSetLayout(layoutData);
                    if (layout) {
                        level.descriptorSetLayout = (layout);
                        level.descriptorSet = (this._device.createDescriptorSet(new DescriptorSetInfo(layout)));
                    }
                } else {
                    this.createDscriptorInfo(layoutData, level.descriptorSetLayoutInfo);
                }
            });
        }
        if (DEBUG) {
            console.log(this.print());
        }
        return 0;
    }

    public print (): string {
        const g: LayoutGraphData = this._data;
        const visitor = new PrintVisitor();
        const colorMap = new VectorGraphColorMap(g.numVertices());
        depthFirstSearch(g, visitor, colorMap);
        return visitor.oss;
    }

    public get data () {
        return this._data;
    }
}
