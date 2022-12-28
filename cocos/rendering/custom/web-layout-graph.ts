/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { DEBUG } from 'internal:constants';
import { EffectAsset } from '../../asset/assets';
// eslint-disable-next-line max-len
import { DescriptorSetInfo, DescriptorSetLayout, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, DescriptorType, Device, ShaderStageFlagBit, Type, UniformBlock } from '../../gfx';
import { VectorGraphColorMap } from './effect';
import { depthFirstSearch } from './graph';
// eslint-disable-next-line max-len
import { LayoutGraphData, PipelineLayoutData, LayoutGraphDataValue, RenderStageData, RenderPhaseData, DescriptorSetLayoutData, DescriptorSetData, DescriptorBlockData, DescriptorData, ShaderProgramData } from './layout-graph';
import { LayoutGraphBuilder } from './pipeline';
import { WebLayoutExporter } from './web-layout-exporter';
import { DescriptorBlockIndex, DescriptorTypeOrder,
    Descriptor, DescriptorBlockFlattened, UpdateFrequency } from './types';
import { getGfxDescriptorType, PrintVisitor } from './layout-graph-utils';

export class WebLayoutGraphBuilder implements LayoutGraphBuilder  {
    private _data: LayoutGraphData;
    private _device: Device | null;
    private _exporter: WebLayoutExporter;

    constructor (deviceIn: Device | null, dataIn: LayoutGraphData) {
        this._device = deviceIn;
        this._data = dataIn;
        this._exporter = new WebLayoutExporter(this);
    }

    private createDescriptorInfo (layoutData: DescriptorSetLayoutData, info: DescriptorSetLayoutInfo) {
        for (let i = 0; i < layoutData.descriptorBlocks.length; ++i) {
            const block = layoutData.descriptorBlocks[i];
            let slot = block.offset;
            for (let j = 0; j < block.descriptors.length; ++j) {
                const d = block.descriptors[j];
                const binding: DescriptorSetLayoutBinding = new DescriptorSetLayoutBinding();
                binding.binding = slot;
                binding.descriptorType = getGfxDescriptorType(block.type);
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
        this.createDescriptorInfo(layoutData, info);

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
            UpdateFrequency.PER_PHASE, new PipelineLayoutData(),
            parentID);
    }

    public addShader (name: string, parentPhaseID: number): void {
        const phaseData = this._data.getRenderPhase(parentPhaseID);
        const id = phaseData.shaderPrograms.length;
        const shaderData = new ShaderProgramData();
        // 填充shaderData数据
        phaseData.shaderPrograms.push(shaderData);
        phaseData.shaderIndex.set(name, id);

        // 注册shader所在的phase的ID
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

    public reorderDescriptorBlock (nodeID: number, index: DescriptorBlockIndex, block: DescriptorBlockFlattened): void {
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

        layout.descriptorBlocks.sort((a, b) => a.type - b.type);

        let cap = 0;
        for (let i = 0; i < layout.descriptorBlocks.length; ++i) {
            const block = layout.descriptorBlocks[i];
            block.offset = cap;
            cap += block.capacity;
        }
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
                    this.createDescriptorInfo(layoutData, level.descriptorSetLayoutInfo);
                }
            });
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

    public exportEffect (effect: EffectAsset) {
        this._exporter.exportEffect(effect);
    }
}
