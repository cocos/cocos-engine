/* eslint-disable max-len */
/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

import { EffectAsset } from '../../assets';
import { DescriptorHierarchy } from './pipeline';
import { Descriptor, DescriptorBlock, DescriptorBlockIndex, DescriptorDB, DescriptorIndex, LayoutGraph, LayoutGraphValue, RenderPhase, UniformBlockDB } from './layout-graph';
import { ShaderStageFlagBit, Type, Uniform } from '../../gfx';
import { ParameterType, UpdateFrequency } from './types';
import { JOINT_UNIFORM_CAPACITY, UBOForwardLight, UBOLocalBatched, UBOMorph } from '../define';

export class WebDescriptorHierarchy extends DescriptorHierarchy {
    constructor () {
        super();
        this._layoutGraph = new LayoutGraph();
    }

    private getLayoutBlock (freq: UpdateFrequency, paraType: ParameterType, descType: DescriptorIndex, vis: ShaderStageFlagBit, descriptorDB: DescriptorDB): DescriptorBlock {
        const blockIndex: DescriptorBlockIndex = new DescriptorBlockIndex(freq, paraType, descType, vis);
        const key = JSON.stringify(blockIndex);
        if (descriptorDB.blocks.get(key) === undefined) {
            const uniformBlock: DescriptorBlock = new DescriptorBlock();
            descriptorDB.blocks.set(key, uniformBlock);

            // uniformBlock['blockIndex'] = blockIndex;
        }
        return descriptorDB.blocks.get(key) as DescriptorBlock;
    }

    private getLayoutBlockByKey (key: string, descriptorDB: DescriptorDB): DescriptorBlock {
        if (descriptorDB.blocks.get(key) === undefined) {
            const uniformBlock: DescriptorBlock = new DescriptorBlock();
            descriptorDB.blocks.set(key, uniformBlock);

            // const blockIndedx: DescriptorBlockIndex = JSON.parse(key) as DescriptorBlockIndex;
            // uniformBlock['blockIndex'] = blockIndedx;
        }
        return descriptorDB.blocks.get(key) as DescriptorBlock;
    }

    private getUniformBlock (blockName: string, targetBlock: DescriptorBlock): UniformBlockDB {
        if (targetBlock.uniformBlocks.get(blockName) === undefined) {
            const uniformDB: UniformBlockDB = new UniformBlockDB();
            targetBlock.uniformBlocks.set(blockName, uniformDB);
        }
        return targetBlock.uniformBlocks.get(blockName) as UniformBlockDB;
    }

    private setUniform (uniformDB: UniformBlockDB, name: string, type: Type, count: number) {
        const uniform: Uniform = new Uniform(name, type, count);
        uniformDB.values.set(uniform.name, uniform);
    }

    private setDescriptor (targetBlock: DescriptorBlock, name: string, type: Type) {
        const descriptor: Descriptor = new Descriptor(type);
        targetBlock.descriptors.set(name, descriptor);
    }

    private merge (descriptorDB: DescriptorDB) {
        for (const entry of descriptorDB.blocks) {
            const block: DescriptorBlock = entry[1];
            const typeMap: Map<Type, number> = new Map<Type, number>();
            for (const ee of block.descriptors) {
                const descriptor: Descriptor = ee[1];
                const type: Type = descriptor.type;
                if (typeMap.get(type) === undefined) {
                    typeMap.set(type, 1);
                } else {
                    const before: number = typeMap.get(type) as number;
                    typeMap.set(type, before + 1);
                }
                block.capacity++;
            }
            for (const ii of typeMap) {
                const type: Type = ii[0];
                const count: number = ii[1];
                if (count > 0) {
                    const mergedDescriptor: Descriptor = new Descriptor(type);
                    mergedDescriptor.count = count;
                    block.merged.set(type, mergedDescriptor);
                }
            }
        }
    }

    private mergeDBs (descriptorDBs: DescriptorDB[], target: DescriptorDB) {
        for (let i = 0; i < descriptorDBs.length; ++i) {
            const db: DescriptorDB = descriptorDBs[i];
            for (const e of db.blocks) {
                const key: string = e[0];
                const block: DescriptorBlock = e[1];

                if (block.merged.size > 0) {
                    const targetBlock: DescriptorBlock = this.getLayoutBlockByKey(key, target);
                    for (const ee of block.merged) {
                        const type: Type = ee[0];
                        const descriptor: Descriptor = ee[1];
                        if (!targetBlock.merged.has(type)) {
                            const ds: Descriptor = new Descriptor(descriptor.type);
                            ds.count = descriptor.count;
                            targetBlock.merged.set(type, ds);
                        } else {
                            const ds: Descriptor | undefined = targetBlock.merged.get(type);
                            if (ds !== undefined) {
                                ds.count = ds.count > descriptor.count ? ds.count : descriptor.count;
                            }
                        }
                    }
                    targetBlock.capacity = block.capacity > targetBlock.capacity ? block.capacity : targetBlock.capacity;
                }
            }
        }
    }

    private sort (descriptorDB: DescriptorDB) {
        const sortedMap: Map<string, DescriptorBlock> = new Map<string, DescriptorBlock>(Array.from(descriptorDB.blocks).sort((a, b) => String(a[0]).localeCompare(b[0])));
        descriptorDB.blocks.clear();
        for (const e of sortedMap) {
            descriptorDB.blocks.set(e[0], e[1]);
        }
    }

    public addEffect (asset: EffectAsset): void {
        const sz = asset.shaders.length;

        let hasCCGlobal = false;
        let hasCCCamera = false;
        let hasCCShadow = false;
        let hasShadowmap = false;
        let hasEnv = false;
        let hasDiffuse = false;
        let hasSpot = false;

        const dbsToMerge: DescriptorDB[] = [];

        for (let i = 0; i !== sz; ++i) {
            const shader: EffectAsset.IShaderInfo = asset.shaders[i];

            const queueDB: DescriptorDB = new DescriptorDB();

            for (let k = 0; k < shader.blocks.length; ++k) {
                const blockInfo: EffectAsset.IBlockInfo = shader.blocks[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_INSTANCE,
                    ParameterType.TABLE, DescriptorIndex.UNIFORM_BLOCK, blockInfo.stageFlags, queueDB);
                const uniformDB: UniformBlockDB = this.getUniformBlock(blockInfo.name, targetBlock);
                for (let kk = 0; kk < blockInfo.members.length; ++kk) {
                    const uniform: Uniform = blockInfo.members[kk];
                    uniformDB.values.set(uniform.name, uniform);
                }
            }

            for (let k = 0; k < shader.buffers.length; ++k) {
                const bufferInfo: EffectAsset.IBufferInfo = shader.buffers[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_QUEUE,
                    ParameterType.TABLE, DescriptorIndex.STORAGE_BUFFER, bufferInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, bufferInfo.name, Type.UNKNOWN);
            }

            for (let k = 0; k < shader.images.length; ++k) {
                const imageInfo: EffectAsset.IImageInfo = shader.images[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_QUEUE,
                    ParameterType.TABLE, DescriptorIndex.STORAGE_TEXTURE, imageInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, imageInfo.name, imageInfo.type);
            }

            for (let k = 0; k < shader.samplerTextures.length; ++k) {
                const samplerTexInfo: EffectAsset.ISamplerTextureInfo = shader.samplerTextures[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                    ParameterType.TABLE, DescriptorIndex.SAMPLER_TEXTURE, samplerTexInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, samplerTexInfo.name, samplerTexInfo.type);
            }

            for (let k = 0; k < shader.samplers.length; ++k) {
                const samplerInfo: EffectAsset.ISamplerInfo = shader.samplers[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_QUEUE,
                    ParameterType.TABLE, DescriptorIndex.SAMPLER, samplerInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, samplerInfo.name, Type.SAMPLER);
            }

            for (let k = 0; k < shader.textures.length; ++k) {
                const texInfo: EffectAsset.ITextureInfo = shader.textures[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_QUEUE,
                    ParameterType.TABLE, DescriptorIndex.TEXTURE, texInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, texInfo.name, texInfo.type);
            }

            for (let k = 0; k < shader.subpassInputs.length; ++k) {
                const subpassInfo: EffectAsset.IInputAttachmentInfo = shader.subpassInputs[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_QUEUE,
                    ParameterType.TABLE, DescriptorIndex.SUBPASS_INPUT, subpassInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, subpassInfo.name, Type.SUBPASS_INPUT);
            }

            // Add queue layout from define.ts
            const localUniformTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_INSTANCE,
                ParameterType.TABLE, DescriptorIndex.UNIFORM_BLOCK, ShaderStageFlagBit.VERTEX, queueDB);
            const localLightTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_QUEUE,
                ParameterType.TABLE, DescriptorIndex.UNIFORM_BLOCK, ShaderStageFlagBit.FRAGMENT, queueDB);
            const localModelTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_INSTANCE,
                ParameterType.TABLE, DescriptorIndex.UNIFORM_BLOCK, ShaderStageFlagBit.VERTEX | ShaderStageFlagBit.COMPUTE, queueDB);
            const localSamplerVertTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                ParameterType.TABLE, DescriptorIndex.SAMPLER_TEXTURE, ShaderStageFlagBit.VERTEX, queueDB);
            const localSamplerFragTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                ParameterType.TABLE, DescriptorIndex.SAMPLER_TEXTURE, ShaderStageFlagBit.FRAGMENT, queueDB);
            const localSamplerCompTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                ParameterType.TABLE, DescriptorIndex.SAMPLER_TEXTURE, ShaderStageFlagBit.COMPUTE, queueDB);

            for (let k = 0; k < shader.builtins.locals.blocks.length; ++k) {
                const blockName: string = shader.builtins.locals.blocks[k].name;
                if (blockName === 'CCMorph') {
                    const morphDB: UniformBlockDB = this.getUniformBlock('CCMorph', localUniformTarget);
                    this.setUniform(morphDB, 'cc_displacementWeights', Type.FLOAT4, UBOMorph.MAX_MORPH_TARGET_COUNT / 4);
                    this.setUniform(morphDB, 'cc_displacementTextureInfo', Type.FLOAT4, 1);
                } else if (blockName === 'CCSkinningTexture') {
                    const skinningTexDB: UniformBlockDB = this.getUniformBlock('CCSkinningTexture', localUniformTarget);
                    this.setUniform(skinningTexDB, 'cc_jointTextureInfo', Type.FLOAT4, 1);
                } else if (blockName === 'CCSkinningAnimation') {
                    const skinningAnimDB: UniformBlockDB = this.getUniformBlock('CCSkinningAnimation', localUniformTarget);
                    this.setUniform(skinningAnimDB, 'cc_jointAnimInfo', Type.FLOAT4, 1);
                } else if (blockName === 'CCSkinning') {
                    const skinningDB: UniformBlockDB = this.getUniformBlock('CCSkinning', localUniformTarget);
                    this.setUniform(skinningDB, 'cc_joints', Type.FLOAT4, JOINT_UNIFORM_CAPACITY * 3);
                } else if (blockName === 'CCUILocal') {
                    const uiDB: UniformBlockDB = this.getUniformBlock('CCUILocal', localUniformTarget);
                    this.setUniform(uiDB, 'cc_local_data', Type.FLOAT4, 1);
                } else if (blockName === 'CCForwardLight') {
                    const lightDB: UniformBlockDB = this.getUniformBlock('CCForwardLight', localLightTarget);
                    this.setUniform(lightDB, 'cc_lightPos', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                    this.setUniform(lightDB, 'cc_lightColor', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                    this.setUniform(lightDB, 'cc_lightSizeRangeAngle', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                    this.setUniform(lightDB, 'cc_lightDir', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                } else if (blockName === 'CCLocal') {
                    const localDB: UniformBlockDB = this.getUniformBlock('CCLocal', localModelTarget);
                    this.setUniform(localDB, 'cc_matWorld', Type.MAT4, 1);
                    this.setUniform(localDB, 'cc_matWorldIT', Type.MAT4, 1);
                    this.setUniform(localDB, 'cc_lightingMapUVParam', Type.FLOAT4, 1);
                } else if (blockName === 'CCLocalBatched') {
                    const batchDB: UniformBlockDB = this.getUniformBlock('CCLocalBatched', localModelTarget);
                    this.setUniform(batchDB, 'cc_matWorlds', Type.MAT4, UBOLocalBatched.BATCHING_COUNT);
                } else if (blockName === 'CCWorldBound') {
                    const boundDB: UniformBlockDB = this.getUniformBlock('CCWorldBound', localModelTarget);
                    this.setUniform(boundDB, 'cc_worldBoundCenter', Type.FLOAT4, 1);
                    this.setUniform(boundDB, 'cc_worldBoundHalfExtents', Type.FLOAT4, 1);
                }
            }

            for (let k = 0; k < shader.builtins.locals.samplerTextures.length; ++k) {
                const samplerName: string = shader.builtins.locals.samplerTextures[k].name;
                if (samplerName === 'cc_jointTexture') {
                    this.setDescriptor(localSamplerVertTarget, 'cc_jointTexture', Type.SAMPLER2D);
                } else if (samplerName === 'cc_PositionDisplacements') {
                    this.setDescriptor(localSamplerVertTarget, 'cc_PositionDisplacements', Type.SAMPLER2D);
                } else if (samplerName === 'cc_NormalDisplacements') {
                    this.setDescriptor(localSamplerVertTarget, 'cc_NormalDisplacements', Type.SAMPLER2D);
                } else if (samplerName === 'cc_TangentDisplacements') {
                    this.setDescriptor(localSamplerVertTarget, 'cc_TangentDisplacements', Type.SAMPLER2D);
                } else if (samplerName === 'cc_lightingMap') {
                    this.setDescriptor(localSamplerFragTarget, 'cc_lightingMap', Type.SAMPLER2D);
                } else if (samplerName === 'cc_spriteTexture') {
                    this.setDescriptor(localSamplerFragTarget, 'cc_spriteTexture', Type.SAMPLER2D);
                } else if (samplerName === 'cc_reflectionTexture') {
                    this.setDescriptor(localSamplerFragTarget, 'cc_reflectionTexture', Type.SAMPLER2D);
                }
            }

            for (let k = 0; k < shader.builtins.locals.images.length; ++k) {
                const imgName: string = shader.builtins.locals.images[k].name;
                if (imgName === 'cc_reflectionStorage') {
                    this.setDescriptor(localSamplerCompTarget, 'cc_reflectionStorage', Type.IMAGE2D);
                }
            }

            const phase: RenderPhase = new RenderPhase();
            phase.shaders.add(shader.name);
            this._layoutGraph.addVertex<LayoutGraphValue.RenderPhase>(LayoutGraphValue.RenderPhase, phase, shader.name, queueDB);

            for (let k = 0; k < shader.builtins.globals.blocks.length; ++k) {
                const blockName = shader.builtins.globals.blocks[k].name;
                if (blockName === 'CCGlobal') {
                    hasCCGlobal = true;
                } else if (blockName === 'CCCamera') {
                    hasCCCamera = true;
                } else if (blockName === 'CCShadow') {
                    hasCCShadow = true;
                }
            }

            for (let k = 0; k < shader.builtins.globals.samplerTextures.length; ++k) {
                const samplerName = shader.builtins.globals.samplerTextures[k].name;
                if (samplerName === 'cc_shadowMap') {
                    hasShadowmap = true;
                } else if (samplerName === 'cc_environment') {
                    hasEnv = true;
                } else if (samplerName === 'cc_diffuseMap') {
                    hasDiffuse = true;
                } else if (samplerName === 'cc_spotLightingMap') {
                    hasSpot = true;
                }
            }

            this.merge(queueDB);
            this.sort(queueDB);
            dbsToMerge.push(queueDB);
        }

        const passDB: DescriptorDB = new DescriptorDB();
        // Add pass layout from define.ts
        const globalUniformTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_PASS,
            ParameterType.TABLE, DescriptorIndex.UNIFORM_BLOCK, ShaderStageFlagBit.ALL, passDB);
        const globalSamplerTexTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_PASS,
            ParameterType.TABLE, DescriptorIndex.SAMPLER_TEXTURE, ShaderStageFlagBit.FRAGMENT, passDB);

        if (hasCCGlobal) {
            const globalDB: UniformBlockDB = this.getUniformBlock('CCGlobal', globalUniformTarget);
            this.setUniform(globalDB, 'cc_time', Type.FLOAT4, 1);
            this.setUniform(globalDB, 'cc_screenSize', Type.FLOAT4, 1);
            this.setUniform(globalDB, 'cc_nativeSize', Type.FLOAT4, 1);
        }

        if (hasCCCamera) {
            const cameraDB: UniformBlockDB = this.getUniformBlock('CCCamera', globalUniformTarget);
            this.setUniform(cameraDB, 'cc_matView', Type.MAT4, 1);
            this.setUniform(cameraDB, 'cc_matViewInv', Type.MAT4, 1);
            this.setUniform(cameraDB, 'cc_matProj', Type.MAT4, 1);
            this.setUniform(cameraDB, 'cc_matProjInv', Type.MAT4, 1);
            this.setUniform(cameraDB, 'cc_matViewProj', Type.MAT4, 1);
            this.setUniform(cameraDB, 'cc_matViewProjInv', Type.MAT4, 1);
            this.setUniform(cameraDB, 'cc_cameraPos', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_surfaceTransform', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_screenScale', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_exposure', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_mainLitDir', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_mainLitColor', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_ambientSky', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_ambientGround', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_fogColor', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_fogBase', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_fogAdd', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_nearFar', Type.FLOAT4, 1);
            this.setUniform(cameraDB, 'cc_viewPort', Type.FLOAT4, 1);
        }

        if (hasCCShadow) {
            const shadowDB: UniformBlockDB = this.getUniformBlock('CCShadow', globalUniformTarget);
            this.setUniform(shadowDB, 'cc_matLightPlaneProj', Type.MAT4, 1);
            this.setUniform(shadowDB, 'cc_matLightView', Type.MAT4, 1);
            this.setUniform(shadowDB, 'cc_matLightViewProj', Type.MAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowInvProjDepthInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowProjDepthInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowProjInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowNFLSInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowWHPBInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowLPNNInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowColor', Type.FLOAT4, 1);
        }

        if (hasShadowmap) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_shadowMap', Type.SAMPLER2D);
        }
        if (hasEnv) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_environment', Type.SAMPLER_CUBE);
        }
        if (hasDiffuse) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_diffuseMap', Type.SAMPLER_CUBE);
        }
        if (hasSpot) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_spotLightingMap', Type.SAMPLER2D);
        }

        this._layoutGraph.addVertex<LayoutGraphValue.RenderStage>(LayoutGraphValue.RenderStage, LayoutGraphValue.RenderStage, asset.name, passDB);

        this.mergeDBs(dbsToMerge, passDB);
        this.sort(passDB);
    }
    private _layoutGraph: LayoutGraph;

    public get layoutGraph () {
        return this._layoutGraph;
    }
}
