// eslint-disable-next-line max-len
import { DescriptorSetInfo, DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, DescriptorType, Device, ShaderStageFlagBit } from '../../gfx';
// eslint-disable-next-line max-len
import { DescriptorBlock, DescriptorBlockIndex, LayoutGraphData, PipelineLayoutData, LayoutGraphDataValue, RenderStageData, RenderPhaseData, DescriptorTypeOrder, DescriptorSetLayoutData, DescriptorSetData, DescriptorBlockData, Descriptor, DescriptorData, getDescriptorTypeOrderName } from './layout-graph';
import { LayoutGraphBuilder } from './pipeline';
import { getUpdateFrequencyName, UpdateFrequency } from './types';

export class WebLayoutGraphBuilder extends LayoutGraphBuilder  {
    private _data: LayoutGraphData;
    private _device: Device;

    constructor (deviceIn: Device, dataIn: LayoutGraphData) {
        super();
        this._device = deviceIn;
        this._data = dataIn;
    }

    private add_vertex<T extends LayoutGraphDataValue> (g: LayoutGraphData, tag: T, object, name: string, parentID = 0xFFFFFFFF): number {
        const layouts: PipelineLayoutData = new PipelineLayoutData();
        return g.addVertex(tag, object, name, UpdateFrequency.PER_INSTANCE, layouts, parentID);
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

    private hasFlag (flags, flagToTest): boolean {
        return (flags & flagToTest) !== 0;
    }

    private getName (stage: ShaderStageFlagBit): string {
        let count = 0;
        let str = '';
        if (this.hasFlag(stage, ShaderStageFlagBit.VERTEX)) {
            if (count++) {
                str += ' | ';
            }
            str += 'Vertex';
        }
        if (this.hasFlag(stage, ShaderStageFlagBit.CONTROL)) {
            if (count++) {
                str += ' | ';
            }
            str += 'Control';
        }
        if (this.hasFlag(stage, ShaderStageFlagBit.EVALUATION)) {
            if (count++) {
                str += ' | ';
            }
            str += 'Evaluation';
        }
        if (this.hasFlag(stage, ShaderStageFlagBit.GEOMETRY)) {
            if (count++) {
                str += ' | ';
            }
            str += 'Geometry';
        }
        if (this.hasFlag(stage, ShaderStageFlagBit.FRAGMENT)) {
            if (count++) {
                str += ' | ';
            }
            str += 'Fragment';
        }
        if (this.hasFlag(stage, ShaderStageFlagBit.COMPUTE)) {
            if (count++) {
                str += ' | ';
            }
            str += 'Compute';
        }
        if (this.hasFlag(stage, ShaderStageFlagBit.ALL)) {
            if (count++) {
                str += ' | ';
            }
            str += 'All';
        }
        return str;
    }

    private createDescriptorSetLayout (layoutData: DescriptorSetLayoutData) {
        const info: DescriptorSetLayoutInfo = new DescriptorSetLayoutInfo();
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

        return this._device.createDescriptorSetLayout(info);
    }

    public clear (): void {
        // this._data.clear();
    }

    public addRenderStage (name: string): number {
        return this.add_vertex<LayoutGraphDataValue.RenderStage>(this._data, LayoutGraphDataValue.RenderStage, new RenderStageData(), name);
    }
    public addRenderPhase (name: string, parentID: number): number {
        return this.add_vertex<LayoutGraphDataValue.RenderPhase>(this._data, LayoutGraphDataValue.RenderPhase, new RenderPhaseData(), name, parentID);
    }
    public addDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlock): void {
        const g: LayoutGraphData = this._data;
        const ppl: PipelineLayoutData = g.getLayout(nodeID);
        if (block.capacity <= 0) {
            console.error('empty block');
        }

        const layout: DescriptorSetLayoutData | undefined = ppl.descriptorSets.get(index.updateFrequency)?.descriptorSetLayoutData;
        if (layout !== undefined) {
            layout.descriptorBlocks.push(new DescriptorBlockData(index.descriptorType, index.visibility, block.capacity));
            const dstBlock = layout.descriptorBlocks[layout.descriptorBlocks.length - 1];
            dstBlock.offset = layout.capacity;
            dstBlock.capacity = block.capacity;
            block.descriptors.forEach((value, key) => {
                const name: string = key;
                const d: Descriptor = value;
                const nameID: number | undefined = g.attributeIndex.get(name);
                if (nameID === undefined) {
                    console.error('attribute not found');
                } else {
                    const data: DescriptorData = new DescriptorData(nameID);
                    data.count = d.count;
                    dstBlock.descriptors.push(data);
                }
            });
            layout.capacity += block.capacity;
        }
    }
    public reserveDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlock): void {
        const g: LayoutGraphData = this._data;
        const ppl: PipelineLayoutData = g.getLayout(nodeID);
        if (block.capacity <= 0) {
            console.error('empty block');
        }

        const layout: DescriptorSetLayoutData | undefined = ppl.descriptorSets.get(index.updateFrequency)?.descriptorSetLayoutData;
        if (layout !== undefined) {
            layout.descriptorBlocks.push(new DescriptorBlockData(index.descriptorType, index.visibility, block.capacity));
            const dstBlock = layout.descriptorBlocks[layout.descriptorBlocks.length - 1];
            dstBlock.offset = layout.capacity;
            dstBlock.capacity = block.capacity;
            layout.capacity += block.capacity;
        }
    }
    public compile (): number {
        const g: LayoutGraphData = this._data;
        for (let i = 0; i < g._layouts.length; ++i) {
            const ppl: PipelineLayoutData = g.getLayout(i);
            ppl.descriptorSets.forEach((value, key) => {
                const level = value;
                const layoutData = level.descriptorSetLayoutData;
                const layout: DescriptorSetLayout = this.createDescriptorSetLayout(layoutData);
                level.descriptorSetLayout = (layout);
                level.descriptorSet = (this._device.createDescriptorSet(new DescriptorSetInfo(layout)));
            });
        }

        return 0;
    }
    public print (): string {
        let oss = '';
        const g: LayoutGraphData = this._data;
        for (let i = 0; i < g._layouts.length; ++i) {
            const ppl: PipelineLayoutData = g.getLayout(i);
            const name: string = g._names[i];
            const freq: UpdateFrequency = g._updateFrequencies[i];

            oss += `"${name}": `;
            oss += `<${getUpdateFrequencyName(freq)}> {\n`;

            // eslint-disable-next-line no-loop-func
            ppl.descriptorSets.forEach((value, key) => {
                oss += `Set<${getUpdateFrequencyName(key)}> {\n`;
                const blocks = value.descriptorSetLayoutData.descriptorBlocks;
                for (let j = 0; j < blocks.length; ++j) {
                    const block = blocks[j];
                    oss += `Block<${getDescriptorTypeOrderName(block.type)}, ${this.getName(block.visibility)}> {\n`;
                    oss += `capacity: ${block.capacity},\n`;
                    oss += `count: ${block.descriptors.length},\n`;
                    if (block.descriptors.length > 0) {
                        oss += 'Descriptors{ ';
                        let count = 0;
                        for (let k = 0; k < block.descriptors.length; ++k) {
                            const d: DescriptorData = block.descriptors[k];
                            if (count++) {
                                oss += ', ';
                                const n: string = g.valueNames[d.descriptorID];
                                oss += `"${n}`;
                                if (d.count !== 1) {
                                    oss += `[${d.count}]`;
                                }
                                oss += '"';
                            }
                            oss += ' }\n';
                        }
                    }
                    oss += '}\n';
                }
                oss += '}\n';
            });
        }
        return '';
    }
}
