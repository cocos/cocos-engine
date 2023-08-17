/* eslint-disable @typescript-eslint/restrict-plus-operands */
/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

import { EffectAsset } from '../../asset/assets';
import { ShaderStageFlagBit } from '../../gfx';
import { EffectData, ShaderBindingData, ShaderLayoutData, TechniqueData } from './layout-graph';
import { DescriptorTypeOrder, UpdateFrequency } from './types';

const isArr = (origin: any): boolean => {
    const str = '[object Array]';
    return Object.prototype.toString.call(origin) === str;
};

const deepClone = <T>(origin: T, target?: Record<string, any> | T): T => {
    const tar = target || {};

    for (const key in origin) {
        if (Object.prototype.hasOwnProperty.call(origin, key)) {
            if (typeof origin[key] === 'object' && origin[key] !== null) {
                tar[key] = isArr(origin[key]) ? [] : {};
                deepClone(origin[key], tar[key]);
            } else {
                tar[key] = origin[key];
            }
        }
    }

    return tar as T;
};

export class WebLayoutExporter {
    private layoutGraph;

    constructor (graph) {
        this.layoutGraph = graph;
    }

    private addBinding (storedMap: Map<string, number>, freq: UpdateFrequency, flag: ShaderStageFlagBit, type: DescriptorTypeOrder) {
        const key = `${freq.toString()}|${flag.toString()}|${type.toString()}`;
        let stored = storedMap.get(key);
        if (stored === undefined) {
            storedMap.set(key, 0);
            stored = storedMap.get(key);
        } else {
            stored += 1;
            storedMap.set(key, stored);
        }
        return stored;
    }

    private setBinding (bindingData: ShaderBindingData, name: string, binding: number | undefined) {
        const shaderKey = this.layoutGraph.data.attributeIndex.get(name);
        if (shaderKey && binding !== undefined) {
            bindingData.descriptorBindings.set(shaderKey, binding);
        }
    }

    public exportEffect (effect: EffectAsset) {
        let parent = '';
        if (effect.name.indexOf('bloom') !== -1
            || effect.name.indexOf('post-process') !== -1
            || effect.name.indexOf('smaa') !== -1
            || effect.name.indexOf('toonmap') !== -1) {
            parent = 'post';
        } else if (effect.name.indexOf('deferred') !== -1) {
            parent = 'deferred';
        } else {
            parent = 'default';
        }

        let effectData: EffectData | undefined = this.layoutGraph.data.effects.get(effect.name);
        if (effectData === undefined) {
            effectData = new EffectData();
            this.layoutGraph.data.effects.set(effect.name, effectData);
        }

        for (let i = 0; i < effect.techniques.length; ++i) {
            const tech = effect.techniques[i];
            const techName = tech.name ? tech.name : i.toString();

            let techData: TechniqueData | undefined = effectData.techniques.get(techName);
            if (techData === undefined) {
                techData = new TechniqueData();
                effectData.techniques.set(techName, techData);
            }

            techData.passes.splice(0, techData.passes.length);
            for (let j = 0; j < tech.passes.length; ++j) {
                const shaderData: ShaderLayoutData = new ShaderLayoutData();
                techData.passes.push(shaderData);

                const pass = tech.passes[j];
                const passPhase = pass.phase;
                let phaseName = '';
                if (passPhase) {
                    phaseName = passPhase.toString();
                } else {
                    phaseName = `${parent}_`;
                }
                const shaderName = pass.program;
                let passShader;
                for (let s = 0; s < effect.shaders.length; ++s) {
                    const shader = effect.shaders[s];
                    const name = shader.name;
                    if (name === shaderName) {
                        passShader = <EffectAsset.IShaderInfo>{};
                        deepClone(shader, passShader);
                        break;
                    }
                }
                if (passShader) {
                    pass.shader = passShader;
                    const shader = pass.shader;
                    if (shader === undefined) {
                        continue;
                    }
                    const storedMap = new Map<string, number>();

                    const vid = this.layoutGraph.data.locate(`/${parent}/${phaseName}`);
                    const layout = this.layoutGraph.data.getLayout(vid);
                    const dss = layout.descriptorSets.get(UpdateFrequency.PER_BATCH);

                    if (dss) {
                        const dsData = dss.descriptorSetLayoutData.descriptorBlocks;

                        const bindingData = new ShaderBindingData();
                        shaderData.layoutData.set(UpdateFrequency.PER_BATCH, dss.descriptorSetLayoutData);
                        shaderData.bindingData.set(UpdateFrequency.PER_BATCH, bindingData);

                        for (let t = 0; t < shader.samplerTextures.length; ++t) {
                            const samplerTexInfo: EffectAsset.ISamplerTextureInfo = shader.samplerTextures[t];
                            const flag = samplerTexInfo.stageFlags;
                            const type = DescriptorTypeOrder.SAMPLER_TEXTURE;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        samplerTexInfo.binding = ds.offset + stored;
                                    } else {
                                        samplerTexInfo.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, samplerTexInfo.name, samplerTexInfo.binding);
                                    break;
                                }
                            }
                        }

                        for (let s = 0; s < shader.samplers.length; ++s) {
                            const samplerInfo: EffectAsset.ISamplerInfo = shader.samplers[s];
                            const flag = samplerInfo.stageFlags;
                            const type = DescriptorTypeOrder.SAMPLER;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        samplerInfo.binding = ds.offset + stored;
                                    } else {
                                        samplerInfo.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, samplerInfo.name, samplerInfo.binding);
                                    break;
                                }
                            }
                        }

                        for (let t = 0; t < shader.textures.length; ++t) {
                            const texInfo: EffectAsset.ITextureInfo = shader.textures[t];
                            const flag = texInfo.stageFlags;
                            const type = DescriptorTypeOrder.TEXTURE;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        texInfo.binding = ds.offset + stored;
                                    } else {
                                        texInfo.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, texInfo.name, texInfo.binding);
                                    break;
                                }
                            }
                        }

                        for (let b = 0; b < shader.buffers.length; ++b) {
                            const bufferInfo: EffectAsset.IBufferInfo = shader.buffers[b];
                            const flag = bufferInfo.stageFlags;
                            const type = DescriptorTypeOrder.STORAGE_BUFFER;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        bufferInfo.binding = ds.offset + stored;
                                    } else {
                                        bufferInfo.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, bufferInfo.name, bufferInfo.binding);
                                    break;
                                }
                            }
                        }

                        for (let m = 0; m < shader.images.length; +m) {
                            const imageInfo: EffectAsset.IImageInfo = shader.images[m];
                            const flag = imageInfo.stageFlags;
                            const type = DescriptorTypeOrder.STORAGE_IMAGE;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        imageInfo.binding = ds.offset + stored;
                                    } else {
                                        imageInfo.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, imageInfo.name, imageInfo.binding);
                                    break;
                                }
                            }
                        }

                        for (let si = 0; si < shader.subpassInputs.length; ++si) {
                            const subpassInfo: EffectAsset.IInputAttachmentInfo = shader.subpassInputs[si];
                            const flag = subpassInfo.stageFlags;
                            const type = DescriptorTypeOrder.INPUT_ATTACHMENT;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        subpassInfo.binding = ds.offset + stored;
                                    } else {
                                        subpassInfo.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, subpassInfo.name, subpassInfo.binding);
                                    break;
                                }
                            }
                        }

                        // builtin
                        for (let k = 0; k < shader.builtins.locals.samplerTextures.length; ++k) {
                            const descriptor = shader.builtins.locals.samplerTextures[k];
                            const type = DescriptorTypeOrder.SAMPLER_TEXTURE;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                let flag = ShaderStageFlagBit.VERTEX;
                                if ((descriptor.name === 'cc_jointTexture' || descriptor.name === 'cc_PositionDisplacements'
                                        || descriptor.name === 'cc_realtimeJoint' || descriptor.name === 'cc_NormalDisplacements'
                                        || descriptor.name === 'cc_TangentDisplacements')) {
                                    flag = ShaderStageFlagBit.VERTEX;
                                } else {
                                    flag = ShaderStageFlagBit.FRAGMENT;
                                }
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        descriptor.binding = ds.offset + stored;
                                    } else {
                                        descriptor.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, descriptor.name, descriptor.binding);
                                }
                            }
                        }

                        for (let k = 0; k < shader.builtins.locals.images.length; ++k) {
                            const descriptor = shader.builtins.locals.images[k];
                            const flag = ShaderStageFlagBit.COMPUTE;
                            const type = DescriptorTypeOrder.SAMPLER_TEXTURE;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_BATCH, flag, type);

                                    if (stored !== undefined) {
                                        descriptor.binding = ds.offset + stored;
                                    } else {
                                        descriptor.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, descriptor.name, descriptor.binding);
                                }
                            }
                        }
                    }

                    const pid = this.layoutGraph.data.locate(`/${parent}`);
                    const pLayout = this.layoutGraph.data.getLayout(pid);
                    const pss = pLayout.descriptorSets.get(UpdateFrequency.PER_PASS);

                    if (pss) {
                        const dsData = pss.descriptorSetLayoutData.descriptorBlocks;

                        const bindingData = new ShaderBindingData();
                        shaderData.layoutData.set(UpdateFrequency.PER_PASS, pss.descriptorSetLayoutData);
                        shaderData.bindingData.set(UpdateFrequency.PER_PASS, bindingData);

                        for (let g = 0; g < shader.builtins.globals.samplerTextures.length; ++g) {
                            const descriptor = shader.builtins.globals.samplerTextures[g];
                            const flag = ShaderStageFlagBit.FRAGMENT;
                            const type = DescriptorTypeOrder.SAMPLER_TEXTURE;
                            for (let d = 0; d < dsData.length; ++d) {
                                const ds = dsData[d];
                                if (ds.visibility === flag && ds.type === type) {
                                    const stored = this.addBinding(storedMap, UpdateFrequency.PER_PASS, flag, type);

                                    if (stored !== undefined) {
                                        descriptor.binding = ds.offset + stored;
                                    } else {
                                        descriptor.binding = ds.offset;
                                    }

                                    this.setBinding(bindingData, descriptor.name, descriptor.binding);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
