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
import { UBOGlobal, UBOShadow, UBOCamera, UNIFORM_SHADOWMAP_BINDING,
    UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, globalDescriptorSetLayout, PipelineGlobalBindings } from './define';
import { genSamplerHash, samplerLib } from '../renderer/core/sampler-lib';
import { builtinResMgr } from '../builtin/builtin-res-mgr';
import { Texture2D } from '../assets/texture-2d';

const _samplerInfo = [
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
];

export class GlobalDSManager {
    private _device: Device;
    private _descriptorSetMap: Map<number, DescriptorSet> = new Map();
    private _descriptorSetLayout!: DescriptorSetLayout;
    private _sampler: Sampler;

    get descriptorSetMap () {
        return this._descriptorSetMap;
    }

    get shadowMapSampler () {
        return this._sampler;
    }

    get descriptorSetLayout () {
        return this._descriptorSetLayout;
    }

    constructor (pipeline: RenderPipeline) {
        this._device = pipeline.device;

        const shadowMapSamplerHash = genSamplerHash(_samplerInfo);
        this._sampler = samplerLib.getSampler(this._device, shadowMapSamplerHash);

        const layoutInfo = new DescriptorSetLayoutInfo(globalDescriptorSetLayout.bindings);
        this._descriptorSetLayout = this._device.createDescriptorSetLayout(layoutInfo);
    }

    /**
     * @en Bind buffer for all descriptorSets, so that all created descriptorSet buffer are consistent
     * @zh 为所有的 descriptorSet 绑定 buffer，使得所有已创建的 descriptorSet buffer 保持一致
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    public bindBuffer (binding: number, buffer: Buffer) {
        const descriptorSets = Array.from(this._descriptorSetMap.values());
        for (let i = 0; i < descriptorSets.length; i++) {
            const descriptorSet = descriptorSets[i];
            descriptorSet.bindBuffer(binding, buffer);
        }
    }

    /**
     * @en Bind sampler for all descriptorSets, so that all created descriptorSet sampler are consistent
     * @zh 为所有的 descriptorSet 绑定 sampler，使得所有已创建的 descriptorSet sampler 保持一致
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    public bindSampler (binding: number, sampler: Sampler) {
        const descriptorSets = Array.from(this._descriptorSetMap.values());
        for (let i = 0; i < descriptorSets.length; i++) {
            const descriptorSet = descriptorSets[i];
            descriptorSet.bindSampler(binding, sampler);
        }
    }

    /**
     * @en Bind texture for all descriptorSets, so that all created descriptorSet texture are consistent
     * @zh 为所有的 descriptorSet 绑定 texture，使得所有已创建的 descriptorSet texture 保持一致
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    public bindTexture (binding: number, texture: Texture) {
        const descriptorSets = Array.from(this._descriptorSetMap.values());
        for (let i = 0; i < descriptorSets.length; i++) {
            const descriptorSet = descriptorSets[i];
            descriptorSet.bindTexture(binding, texture);
        }
    }

    /**
     * @en Update all descriptorSet
     * @zh 更新所有的 descriptorSet
     */
    public update () {
        const descriptorSets = Array.from(this._descriptorSetMap.values());
        for (let i = 0; i < descriptorSets.length; ++i) {
            const descriptorSet = descriptorSets[i];
            descriptorSet.update();
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
            const descriptorSet = device.createDescriptorSet(new DescriptorSetInfo(this._descriptorSetLayout));
            this._descriptorSetMap.set(idx, descriptorSet);

            // Other descriptorSets are created with the same state as the global descriptorSet
            if (idx > -1) {
                const descriptorSet = this._descriptorSetMap.get(idx)!;
                const globalDescriptorSet = this._descriptorSetMap.get(-1)!;
                // Bindings for newly created descriptorSet, updated to a layout consistent with the globalDescriptorSet. shadow excepted
                descriptorSet.bindBuffer(UBOGlobal.BINDING, globalDescriptorSet.getBuffer(UBOGlobal.BINDING));

                descriptorSet.bindBuffer(UBOCamera.BINDING, globalDescriptorSet.getBuffer(UBOCamera.BINDING));

                const shadowBUO = device.createBuffer(new BufferInfo(
                    BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                    UBOShadow.SIZE,
                    UBOShadow.SIZE,
                ));
                descriptorSet.bindBuffer(UBOShadow.BINDING, shadowBUO);

                for (let i = PipelineGlobalBindings.SAMPLER_SHADOWMAP; i < PipelineGlobalBindings.COUNT; i++) {
                    if (i === PipelineGlobalBindings.SAMPLER_SHADOWMAP) {
                        descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, this._sampler);
                        descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING,
                            builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
                    } else if (i === PipelineGlobalBindings.SAMPLER_SPOT_LIGHTING_MAP) {
                        descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, this._sampler);
                        descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING,
                            builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
                    } else {
                        descriptorSet.bindSampler(i, globalDescriptorSet.getSampler(i));
                        descriptorSet.bindTexture(i, globalDescriptorSet.getTexture(i));
                    }
                }
                descriptorSet.update();
            }
        }

        return this._descriptorSetMap.get(idx);
    }

    public destroy () {
        const descriptorSets = Array.from(this._descriptorSetMap.values());

        // The global descriptorSet is released by the pipeline, the other descriptorSets are released by whoever gets them.
        // So index starts at 1
        for (let i = 1; i < descriptorSets.length; ++i) {
            const descriptorSet = descriptorSets[i];
            if (descriptorSet) {
                descriptorSet.destroy();
            }
        }
        this._descriptorSetMap.clear();
    }
}
