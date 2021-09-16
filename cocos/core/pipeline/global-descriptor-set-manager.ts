/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module pipeline
 */

import { RenderPipeline } from './render-pipeline';
import { Device, BufferUsageBit, MemoryUsageBit, BufferInfo, Filter, Address, Sampler, DescriptorSet,
    DescriptorSetInfo, Buffer, Texture, DescriptorSetLayoutInfo, DescriptorSetLayout } from '../gfx';
import { UBOShadow, globalDescriptorSetLayout, PipelineGlobalBindings } from './define';
import { genSamplerHash, samplerLib } from '../renderer/core/sampler-lib';

const _samplerLinearInfo = [
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
];

const _samplerPointInfo = [
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
];

export class GlobalDSManager {
    private _device: Device;
    private _descriptorSetMap: Map<number, DescriptorSet> = new Map();
    private _globalDescriptorSet: DescriptorSet;
    private _descriptorSetLayout: DescriptorSetLayout;
    private _linearSampler: Sampler;
    private _pointSampler: Sampler;

    get descriptorSetMap () {
        return this._descriptorSetMap;
    }

    // TODO: Future extensions of PCSS require search depth to compute the penumbra, which requires linear sampling
    get linearSampler () {
        return this._linearSampler;
    }

    // TODO: For the use of hard and soft, point sampling is required
    get pointSampler () {
        return this._pointSampler;
    }

    get descriptorSetLayout () {
        return this._descriptorSetLayout;
    }

    get globalDescriptorSet () {
        return this._globalDescriptorSet;
    }

    constructor (pipeline: RenderPipeline) {
        this._device = pipeline.device;

        const linearSamplerHash = genSamplerHash(_samplerLinearInfo);
        this._linearSampler = samplerLib.getSampler(this._device, linearSamplerHash);

        const pointSamplerHash = genSamplerHash(_samplerPointInfo);
        this._pointSampler = samplerLib.getSampler(this._device, pointSamplerHash);

        const layoutInfo = new DescriptorSetLayoutInfo(globalDescriptorSetLayout.bindings);
        this._descriptorSetLayout = this._device.createDescriptorSetLayout(layoutInfo);

        this._globalDescriptorSet = this._device.createDescriptorSet(new DescriptorSetInfo(this._descriptorSetLayout));
    }

    /**
     * @en Bind buffer for all descriptorSets, so that all created descriptorSet buffer are consistent
     * @zh 为所有的 descriptorSet 绑定 buffer，使得所有已创建的 descriptorSet buffer 保持一致
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    public bindBuffer (binding: number, buffer: Buffer) {
        this._globalDescriptorSet.bindBuffer(binding, buffer);
        const it = this._descriptorSetMap.values();
        let res = it.next();
        while (!res.done) {
            const descriptorSet = res.value;
            descriptorSet.bindBuffer(binding, buffer);
            res = it.next();
        }
    }

    /**
     * @en Bind sampler for all descriptorSets, so that all created descriptorSet sampler are consistent
     * @zh 为所有的 descriptorSet 绑定 sampler，使得所有已创建的 descriptorSet sampler 保持一致
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    public bindSampler (binding: number, sampler: Sampler) {
        this._globalDescriptorSet.bindSampler(binding, sampler);
        const it = this._descriptorSetMap.values();
        let res = it.next();
        while (!res.done) {
            const descriptorSet = res.value;
            descriptorSet.bindSampler(binding, sampler);
            res = it.next();
        }
    }

    /**
     * @en Bind texture for all descriptorSets, so that all created descriptorSet texture are consistent
     * @zh 为所有的 descriptorSet 绑定 texture，使得所有已创建的 descriptorSet texture 保持一致
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    public bindTexture (binding: number, texture: Texture) {
        this._globalDescriptorSet.bindTexture(binding, texture);
        const it = this._descriptorSetMap.values();
        let res = it.next();
        while (!res.done) {
            const descriptorSet = res.value;
            descriptorSet.bindTexture(binding, texture);
            res = it.next();
        }
    }

    /**
     * @en Update all descriptorSet
     * @zh 更新所有的 descriptorSet
     */
    public update () {
        this._globalDescriptorSet.update();
        const it = this._descriptorSetMap.values();
        let res = it.next();
        while (!res.done) {
            const descriptorSet = res.value;
            descriptorSet.update();
            res = it.next();
        }
    }

    /**
     * @en The layout of all created descriptorSets in buffer, sampler, and texture (except shadow) is consistent with the globalDescriptorSet
     * @zh 所有创建出来的 descriptorSet 在 buffer、 sampler、 texture（shadow 除外）的布局与 globalDescriptorSet 保持一致
     * @param idx Specify index creation
     * @return descriptorSet
     */
    public getOrCreateDescriptorSet (idx: number) {
        const device = this._device;

        // The global descriptorSet is managed by the pipeline and binds the buffer
        if (!this._descriptorSetMap.has(idx)) {
            const globalDescriptorSet = this._globalDescriptorSet;
            const descriptorSet = device.createDescriptorSet(new DescriptorSetInfo(this._descriptorSetLayout));
            this._descriptorSetMap.set(idx, descriptorSet);

            // Create & Sync ALL UBO Buffer, Texture, Sampler
            for (let i = PipelineGlobalBindings.UBO_GLOBAL; i < PipelineGlobalBindings.COUNT; i++) {
                descriptorSet.bindBuffer(i, globalDescriptorSet.getBuffer(i));
                descriptorSet.bindSampler(i, globalDescriptorSet.getSampler(i));
                descriptorSet.bindTexture(i, globalDescriptorSet.getTexture(i));
            }

            const shadowUBO = device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                UBOShadow.SIZE,
                UBOShadow.SIZE,
            ));
            descriptorSet.bindBuffer(UBOShadow.BINDING, shadowUBO);

            descriptorSet.update();
        }

        return this._descriptorSetMap.get(idx);
    }

    public destroy () {
        this._descriptorSetLayout.destroy();
        this._linearSampler.destroy();
        this._pointSampler.destroy();
    }
}
