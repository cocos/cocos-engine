// eslint-disable-next-line max-len
import { DescriptorSetInfo, DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, DescriptorType, Device, ShaderStageFlagBit, UniformBlock } from '../../gfx';
// eslint-disable-next-line max-len
import { DescriptorBlock, DescriptorBlockIndex, LayoutGraphData, PipelineLayoutData, LayoutGraphDataValue, RenderStageData, RenderPhaseData, DescriptorTypeOrder, DescriptorSetLayoutData, DescriptorSetData, DescriptorBlockData, Descriptor, DescriptorData, getDescriptorTypeOrderName, DescriptorBlockFlattened } from './layout-graph';
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
        if (stage === ShaderStageFlagBit.ALL) {
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
                oss += `    DescriptorSet<${getUpdateFrequencyName(key)}> {\n`;
                const blocks = value.descriptorSetLayoutData.descriptorBlocks;
                for (let j = 0; j < blocks.length; ++j) {
                    const block = blocks[j];
                    oss += `        Block<${getDescriptorTypeOrderName(block.type)}, ${this.getName(block.visibility)}> {\n`;
                    oss += `        capacity: ${block.capacity}\n`;
                    oss += `        count: ${block.descriptors.length}\n`;
                    if (block.descriptors.length > 0) {
                        oss += '        Descriptors{ \n';
                        const count = 0;
                        for (let k = 0; k < block.descriptors.length; ++k) {
                            const d: DescriptorData = block.descriptors[k];
                            // if (count++) {
                            oss += '            ';
                            const n: string = g.valueNames[d.descriptorID];
                            oss += `"${n}`;
                            if (d.count !== 1) {
                                oss += `[${d.count}]`;
                            }
                            oss += '"';
                            // }
                            oss += '\n';
                        }
                    }
                    oss += '        }\n';
                }
                oss += '    }\n';
            });
            oss += `}\n`;
        }
        return oss;
    }

    public get data () {
        return this._data;
    }
}
