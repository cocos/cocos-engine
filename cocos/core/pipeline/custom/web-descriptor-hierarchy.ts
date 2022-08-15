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
import { Descriptor, DescriptorBlock, DescriptorBlockIndex, DescriptorDB, DescriptorTypeOrder, LayoutGraph, LayoutGraphValue, LayoutGraphVisitor, RenderPhase } from './layout-graph';
import { ShaderStageFlagBit, Type, Uniform, UniformBlock } from '../../gfx';
import { ParameterType, UpdateFrequency } from './types';
import { JOINT_UNIFORM_CAPACITY, RenderPassStage, SetIndex, UBOCamera, UBOCSM, UBOForwardLight, UBOGlobal, UBOLocal, UBOLocalBatched, UBOMorph, UBOShadow, UBOSkinning, UBOSkinningAnimation, UBOSkinningTexture, UBOUILocal, UBOWorldBound } from '../define';
import { DefaultVisitor, edge_descriptor, IncidenceGraph, vertex_descriptor } from './graph';
import { ccclass } from '../../data/decorators';

@ccclass('cc.WebDescriptorHierarchy')
export class WebDescriptorHierarchy {
    public uniformBlockIndex: Map<DescriptorBlock, DescriptorBlockIndex>;
    public blockMerged: Map<DescriptorBlock, Map<Type, Descriptor>>;
    public dbsToMerge: Map<DescriptorDB, DescriptorDB[]>;

    constructor () {
        this._layoutGraph = new LayoutGraph();
        this.uniformBlockIndex = new Map<DescriptorBlock, DescriptorBlockIndex>();
        this.blockMerged = new Map<DescriptorBlock, Map<Type, Descriptor>>();
        this.dbsToMerge = new Map<DescriptorDB, DescriptorDB[]>();
    }

    public getLayoutBlock (freq: UpdateFrequency, paraType: ParameterType, descType: DescriptorTypeOrder, vis: ShaderStageFlagBit, descriptorDB: DescriptorDB): DescriptorBlock {
        const blockIndex: DescriptorBlockIndex = new DescriptorBlockIndex(freq, paraType, descType, vis);
        const key = JSON.stringify(blockIndex);
        if (descriptorDB.blocks.get(key) === undefined) {
            const uniformBlock: DescriptorBlock = new DescriptorBlock();
            descriptorDB.blocks.set(key, uniformBlock);

            this.uniformBlockIndex.set(uniformBlock, blockIndex);
        }
        return descriptorDB.blocks.get(key) as DescriptorBlock;
    }

    public getLayoutBlockByKey (key: string, descriptorDB: DescriptorDB): DescriptorBlock {
        if (descriptorDB.blocks.get(key) === undefined) {
            const uniformBlock: DescriptorBlock = new DescriptorBlock();
            descriptorDB.blocks.set(key, uniformBlock);

            const blockIndedx: DescriptorBlockIndex = JSON.parse(key) as DescriptorBlockIndex;
            this.uniformBlockIndex.set(uniformBlock, blockIndedx);
        }
        return descriptorDB.blocks.get(key) as DescriptorBlock;
    }

    public getUniformBlock (set: number, binding: number, blockName: string, targetBlock: DescriptorBlock): UniformBlock {
        if (targetBlock.uniformBlocks.get(blockName) === undefined) {
            const uniformDB: UniformBlock = new UniformBlock(set, binding, blockName, [], 1);
            targetBlock.uniformBlocks.set(blockName, uniformDB);
        }
        return targetBlock.uniformBlocks.get(blockName) as UniformBlock;
    }

    public setUniform (uniformDB: UniformBlock, name: string, type: Type, count: number) {
        const uniform: Uniform = new Uniform(name, type, count);
        uniformDB.members.push(uniform);
    }

    public setDescriptor (targetBlock: DescriptorBlock, name: string, type: Type) {
        const descriptor: Descriptor = new Descriptor(type);
        targetBlock.descriptors.set(name, descriptor);
    }

    public merge (descriptorDB: DescriptorDB) {
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
                    let merged: Map<Type, Descriptor>;
                    if (this.blockMerged.get(block) === undefined) {
                        merged = new Map<Type, Descriptor>();
                        this.blockMerged.set(block, merged);
                    }
                    this.blockMerged.get(block)?.set(type, mergedDescriptor);
                }
            }
        }
    }

    public mergeDBs (descriptorDBs: DescriptorDB[], target: DescriptorDB) {
        for (let i = 0; i < descriptorDBs.length; ++i) {
            const db: DescriptorDB = descriptorDBs[i];
            for (const e of db.blocks) {
                const key: string = e[0];
                const block: DescriptorBlock = e[1];

                let merged: Map<Type, Descriptor>;
                if (this.blockMerged.get(block) === undefined) {
                    merged = new Map<Type, Descriptor>();
                    this.blockMerged.set(block, merged);
                } else {
                    merged = this.blockMerged.get(block) as Map<Type, Descriptor>;
                }
                if (merged.size > 0) {
                    const targetBlock: DescriptorBlock = this.getLayoutBlockByKey(key, target);
                    let targetMerged: Map<Type, Descriptor>;
                    if (this.blockMerged.get(targetBlock) === undefined) {
                        targetMerged = new Map<Type, Descriptor>();
                        this.blockMerged.set(targetBlock, targetMerged);
                    } else {
                        targetMerged = this.blockMerged.get(targetBlock) as Map<Type, Descriptor>;
                    }
                    for (const ee of merged) {
                        const type: Type = ee[0];
                        const descriptor: Descriptor = ee[1];
                        if (!targetMerged.has(type)) {
                            const ds: Descriptor = new Descriptor(descriptor.type);
                            ds.count = descriptor.count;
                            targetMerged.set(type, ds);
                        } else {
                            const ds: Descriptor | undefined = targetMerged.get(type);
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

    public sort (descriptorDB: DescriptorDB) {
        const sortedMap: Map<string, DescriptorBlock> = new Map<string, DescriptorBlock>(Array.from(descriptorDB.blocks).sort((a, b) => String(a[0]).localeCompare(b[0])));
        descriptorDB.blocks.clear();
        for (const e of sortedMap) {
            descriptorDB.blocks.set(e[0], e[1]);
        }
    }

    public addEffect (asset: EffectAsset, parent: number): void {
        const sz = asset.shaders.length;

        const dbsMap: Map<string, DescriptorDB> = new Map<string, DescriptorDB>();

        for (let i = 0; i !== sz; ++i) {
            const shader: EffectAsset.IShaderInfo = asset.shaders[i];

            const queueDB: DescriptorDB = new DescriptorDB();

            for (let k = 0; k < shader.blocks.length; ++k) {
                const blockInfo: EffectAsset.IBlockInfo = shader.blocks[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_INSTANCE,
                    ParameterType.TABLE, DescriptorTypeOrder.UNIFORM_BUFFER, blockInfo.stageFlags, queueDB);
                const uniformDB: UniformBlock = this.getUniformBlock(SetIndex.MATERIAL, blockInfo.binding, blockInfo.name, targetBlock);
                for (let kk = 0; kk < blockInfo.members.length; ++kk) {
                    const uniform: Uniform = blockInfo.members[kk];
                    uniformDB.members.push(uniform);
                }
            }

            for (let k = 0; k < shader.buffers.length; ++k) {
                const bufferInfo: EffectAsset.IBufferInfo = shader.buffers[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                    ParameterType.TABLE, DescriptorTypeOrder.STORAGE_BUFFER, bufferInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, bufferInfo.name, Type.UNKNOWN);
            }

            for (let k = 0; k < shader.images.length; ++k) {
                const imageInfo: EffectAsset.IImageInfo = shader.images[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                    ParameterType.TABLE, DescriptorTypeOrder.STORAGE_IMAGE, imageInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, imageInfo.name, imageInfo.type);
            }

            for (let k = 0; k < shader.samplerTextures.length; ++k) {
                const samplerTexInfo: EffectAsset.ISamplerTextureInfo = shader.samplerTextures[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                    ParameterType.TABLE, DescriptorTypeOrder.SAMPLER_TEXTURE, samplerTexInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, samplerTexInfo.name, samplerTexInfo.type);
            }

            for (let k = 0; k < shader.samplers.length; ++k) {
                const samplerInfo: EffectAsset.ISamplerInfo = shader.samplers[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                    ParameterType.TABLE, DescriptorTypeOrder.SAMPLER, samplerInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, samplerInfo.name, Type.SAMPLER);
            }

            for (let k = 0; k < shader.textures.length; ++k) {
                const texInfo: EffectAsset.ITextureInfo = shader.textures[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                    ParameterType.TABLE, DescriptorTypeOrder.TEXTURE, texInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, texInfo.name, texInfo.type);
            }

            for (let k = 0; k < shader.subpassInputs.length; ++k) {
                const subpassInfo: EffectAsset.IInputAttachmentInfo = shader.subpassInputs[k];
                const targetBlock: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                    ParameterType.TABLE, DescriptorTypeOrder.INPUT_ATTACHMENT, subpassInfo.stageFlags, queueDB);
                this.setDescriptor(targetBlock, subpassInfo.name, Type.SUBPASS_INPUT);
            }

            // Add queue layout from define.ts
            const localUniformTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_INSTANCE,
                ParameterType.TABLE, DescriptorTypeOrder.UNIFORM_BUFFER, ShaderStageFlagBit.VERTEX, queueDB);
            const localLightTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                ParameterType.TABLE, DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER, ShaderStageFlagBit.FRAGMENT, queueDB);
            const localUITarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_INSTANCE,
                ParameterType.TABLE, DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER, ShaderStageFlagBit.VERTEX, queueDB);
            const localModelTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_INSTANCE,
                ParameterType.TABLE, DescriptorTypeOrder.UNIFORM_BUFFER, ShaderStageFlagBit.VERTEX | ShaderStageFlagBit.COMPUTE, queueDB);
            const localSamplerVertTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                ParameterType.TABLE, DescriptorTypeOrder.SAMPLER_TEXTURE, ShaderStageFlagBit.VERTEX, queueDB);
            const localSamplerFragTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                ParameterType.TABLE, DescriptorTypeOrder.SAMPLER_TEXTURE, ShaderStageFlagBit.FRAGMENT, queueDB);
            const localSamplerCompTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_BATCH,
                ParameterType.TABLE, DescriptorTypeOrder.SAMPLER_TEXTURE, ShaderStageFlagBit.COMPUTE, queueDB);

            for (let k = 0; k < shader.builtins.locals.blocks.length; ++k) {
                const blockName: string = shader.builtins.locals.blocks[k].name;
                if (blockName === 'CCMorph') {
                    const morphDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOMorph.BINDING, 'CCMorph', localUniformTarget);
                    this.setUniform(morphDB, 'cc_displacementWeights', Type.FLOAT4, UBOMorph.MAX_MORPH_TARGET_COUNT / 4);
                    this.setUniform(morphDB, 'cc_displacementTextureInfo', Type.FLOAT4, 1);
                } else if (blockName === 'CCSkinningTexture') {
                    const skinningTexDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOSkinningTexture.BINDING, 'CCSkinningTexture', localUniformTarget);
                    this.setUniform(skinningTexDB, 'cc_jointTextureInfo', Type.FLOAT4, 1);
                } else if (blockName === 'CCSkinningAnimation') {
                    const skinningAnimDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOSkinningAnimation.BINDING, 'CCSkinningAnimation', localUniformTarget);
                    this.setUniform(skinningAnimDB, 'cc_jointAnimInfo', Type.FLOAT4, 1);
                } else if (blockName === 'CCSkinning') {
                    const skinningDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOSkinning.BINDING, 'CCSkinning', localUniformTarget);
                    this.setUniform(skinningDB, 'cc_joints', Type.FLOAT4, JOINT_UNIFORM_CAPACITY * 3);
                } else if (blockName === 'CCUILocal') {
                    const uiDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOUILocal.BINDING, 'CCUILocal', localUITarget);
                    this.setUniform(uiDB, 'cc_local_data', Type.FLOAT4, 1);
                } else if (blockName === 'CCForwardLight') {
                    const lightDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOForwardLight.BINDING, 'CCForwardLight', localLightTarget);
                    this.setUniform(lightDB, 'cc_lightPos', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                    this.setUniform(lightDB, 'cc_lightColor', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                    this.setUniform(lightDB, 'cc_lightSizeRangeAngle', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                    this.setUniform(lightDB, 'cc_lightDir', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS);
                } else if (blockName === 'CCLocal') {
                    const localDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOLocal.BINDING, 'CCLocal', localModelTarget);
                    this.setUniform(localDB, 'cc_matWorld', Type.MAT4, 1);
                    this.setUniform(localDB, 'cc_matWorldIT', Type.MAT4, 1);
                    this.setUniform(localDB, 'cc_lightingMapUVParam', Type.FLOAT4, 1);
                } else if (blockName === 'CCLocalBatched') {
                    const batchDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOLocalBatched.BINDING, 'CCLocalBatched', localModelTarget);
                    this.setUniform(batchDB, 'cc_matWorlds', Type.MAT4, UBOLocalBatched.BATCHING_COUNT);
                } else if (blockName === 'CCWorldBound') {
                    const boundDB: UniformBlock = this.getUniformBlock(SetIndex.LOCAL, UBOWorldBound.BINDING, 'CCWorldBound', localModelTarget);
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

            dbsMap.set(shader.name, queueDB);
        }

        for (let i = 0; i < asset.techniques.length; ++i) {
            const tech = asset.techniques[i];
            for (let j = 0; j < tech.passes.length; ++j) {
                const pass = tech.passes[j];
                const passPhase = pass.phase;
                let phase = '';
                if (passPhase === undefined) {
                    phase = '_';
                } else if (typeof passPhase === 'number') {
                    phase = passPhase.toString();
                } else {
                    phase = passPhase;
                }
                const db2add = dbsMap.get(pass.program);
                if (db2add) {
                    const v2add = this._layoutGraph.locate(`/default/${phase}`);
                    if (v2add === 0xFFFFFFFF) {
                        const v = this.addRenderPhase(phase, parent);
                        const dbStored = this._layoutGraph.getDescriptors(v);
                        for (const ee of db2add.blocks) {
                            const blockIndex = ee[0];
                            const block = ee[1];
                            const b2add = new DescriptorBlock();
                            for (const dd of block.descriptors) {
                                b2add.descriptors.set(dd[0], dd[1]);
                                b2add.count++;
                                b2add.capacity++;
                            }
                            for (const uu of block.uniformBlocks) {
                                b2add.uniformBlocks.set(uu[0], uu[1]);
                                b2add.count++;
                                b2add.capacity++;
                            }
                            if (b2add.capacity > 0 || b2add.count > 0) {
                                dbStored.blocks.set(blockIndex, b2add);
                            }
                        }
                    } else {
                        const dbStored = this._layoutGraph.getDescriptors(v2add);
                        for (const ee of db2add.blocks) {
                            const blockIndex = ee[0];
                            const block = ee[1];
                            const blockStored = dbStored.blocks.get(blockIndex);
                            if (blockStored === undefined) {
                                const b2add = new DescriptorBlock();
                                for (const dd of block.descriptors) {
                                    b2add.descriptors.set(dd[0], dd[1]);
                                    b2add.count++;
                                    b2add.capacity++;
                                }
                                for (const uu of block.uniformBlocks) {
                                    b2add.uniformBlocks.set(uu[0], uu[1]);
                                    b2add.count++;
                                    b2add.capacity++;
                                }
                                if (b2add.capacity > 0 || b2add.count > 0) {
                                    dbStored.blocks.set(blockIndex, b2add);
                                }
                            } else {
                                for (const dd of block.descriptors) {
                                    if (blockStored.descriptors.get(dd[0]) === undefined) {
                                        blockStored.descriptors.set(dd[0], dd[1]);
                                        blockStored.count++;
                                        blockStored.capacity++;
                                    }
                                }
                                for (const uu of block.uniformBlocks) {
                                    if (blockStored.uniformBlocks.get(uu[0]) === undefined) {
                                        blockStored.uniformBlocks.set(uu[0], uu[1]);
                                        blockStored.count++;
                                        blockStored.capacity++;
                                    }
                                }
                            }
                        }
                    }

                    this.merge(db2add);
                    this.sort(db2add);

                    const parentDB: DescriptorDB = this._layoutGraph.getDescriptors(parent);
                    if (this.dbsToMerge.get(parentDB) === undefined) {
                        this.dbsToMerge.set(parentDB, []);
                    }
                    this.dbsToMerge.get(parentDB)?.push(db2add);
                }
            }
        }
    }

    public addGlobal (vName: string, hasCCGlobal, hasCCCamera, hasCCShadow, hasCCCSM, hasShadowmap, hasEnv, hasDiffuse, hasSpot): number {
        const passDB: DescriptorDB = new DescriptorDB();
        // Add pass layout from define.ts
        const globalUniformTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_PASS,
            ParameterType.TABLE, DescriptorTypeOrder.UNIFORM_BUFFER, ShaderStageFlagBit.ALL, passDB);
        const globalSamplerTexTarget: DescriptorBlock = this.getLayoutBlock(UpdateFrequency.PER_PASS,
            ParameterType.TABLE, DescriptorTypeOrder.SAMPLER_TEXTURE, ShaderStageFlagBit.FRAGMENT, passDB);

        if (hasCCGlobal) {
            const globalDB: UniformBlock = this.getUniformBlock(SetIndex.GLOBAL,
                UBOGlobal.BINDING, 'CCGlobal', globalUniformTarget);
            this.setUniform(globalDB, 'cc_time', Type.FLOAT4, 1);
            this.setUniform(globalDB, 'cc_screenSize', Type.FLOAT4, 1);
            this.setUniform(globalDB, 'cc_nativeSize', Type.FLOAT4, 1);
            this.setUniform(globalDB, 'cc_debug_view_mode', Type.FLOAT, 4);
            this.setUniform(globalDB, 'cc_debug_view_composite_pack_1', Type.FLOAT, 4);
            this.setUniform(globalDB, 'cc_debug_view_composite_pack_2', Type.FLOAT, 4);
            this.setUniform(globalDB, 'cc_debug_view_composite_pack_3', Type.FLOAT, 4);
            this.setDescriptor(globalUniformTarget, 'CCGlobal', Type.UNKNOWN);
        }

        if (hasCCCamera) {
            const cameraDB: UniformBlock = this.getUniformBlock(SetIndex.GLOBAL,
                UBOCamera.BINDING, 'CCCamera', globalUniformTarget);
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

            this.setDescriptor(globalUniformTarget, 'CCCamera', Type.UNKNOWN);
        }

        if (hasCCShadow) {
            const shadowDB: UniformBlock = this.getUniformBlock(SetIndex.GLOBAL,
                UBOShadow.BINDING, 'CCShadow', globalUniformTarget);
            this.setUniform(shadowDB, 'cc_matLightView', Type.MAT4, 1);
            this.setUniform(shadowDB, 'cc_matLightViewProj', Type.MAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowInvProjDepthInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowProjDepthInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowProjInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowNFLSInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowWHPBInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowLPNNInfo', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_shadowColor', Type.FLOAT4, 1);
            this.setUniform(shadowDB, 'cc_planarNDInfo', Type.FLOAT4, 1);

            this.setDescriptor(globalUniformTarget, 'CCShadow', Type.UNKNOWN);
        }

        if (hasCCCSM) {
            const csmDB: UniformBlock = this.getUniformBlock(SetIndex.GLOBAL,
                UBOCSM.BINDING, 'CCCSM', globalUniformTarget);
            this.setUniform(csmDB, 'cc_csmViewDir0', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT);
            this.setUniform(csmDB, 'cc_csmViewDir1', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT);
            this.setUniform(csmDB, 'cc_csmViewDir2', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT);
            this.setUniform(csmDB, 'cc_csmAtlas', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT);
            this.setUniform(csmDB, 'cc_matCSMViewProj', Type.MAT4, UBOCSM.CSM_LEVEL_COUNT);
            this.setUniform(csmDB, 'cc_csmProjDepthInfo', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT);
            this.setUniform(csmDB, 'cc_csmProjInfo', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT);
            this.setUniform(csmDB, 'cc_csmSplitsInfo', Type.FLOAT4, 1);

            this.setDescriptor(globalUniformTarget, 'CCCSM', Type.UNKNOWN);
        }

        if (hasShadowmap) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_shadowMap', Type.SAMPLER2D);
        }
        if (hasEnv) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_environment', Type.SAMPLER_CUBE);
        }
        if (hasSpot) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_spotShadowMap', Type.SAMPLER2D);
        }
        if (hasDiffuse) {
            this.setDescriptor(globalSamplerTexTarget, 'cc_diffuseMap', Type.SAMPLER_CUBE);
        }

        this.merge(passDB);

        const vid = this._layoutGraph.addVertex<LayoutGraphValue.RenderStage>(
            LayoutGraphValue.RenderStage, RenderPassStage.DEFAULT, vName, passDB,
        );

        return vid;
    }

    public mergeDescriptors (vid: number) {
        const target: DescriptorDB = this._layoutGraph.getDescriptors(vid);
        const toMerge = this.dbsToMerge.get(target);
        if (toMerge !== undefined) {
            this.mergeDBs(toMerge, target);
            this.sort(target);
        }
    }

    public addRenderStage (name: string, stageID: number): number {
        const passDB: DescriptorDB = new DescriptorDB();
        return this._layoutGraph.addVertex(LayoutGraphValue.RenderStage,
            stageID, name, passDB);
    }

    public addRenderPhase (name: string, parentStageID: number): number {
        const passDB: DescriptorDB = new DescriptorDB();
        return this._layoutGraph.addVertex(LayoutGraphValue.RenderPhase,
            new RenderPhase(), name, passDB, parentStageID);
    }

    public _layoutGraph: LayoutGraph;

    public get layoutGraph () {
        return this._layoutGraph;
    }
}

function getNumDescriptors (block: DescriptorBlock): number {
    let count = 0;
    for (const [, d] of block.descriptors) {
        count += d.count;
    }
    return count;
}

function checkDescriptorConsistency (lhs: Descriptor, rhs: Descriptor): boolean {
    if (lhs.type !== rhs.type) {
        return false;
    }
    if (lhs.count !== rhs.count) {
        return false;
    }
    return true;
}

export class CollectVisitor extends DefaultVisitor {
    getFrequency (g: LayoutGraph, v: number): UpdateFrequency {
        let freq: UpdateFrequency;
        if (g.holds(LayoutGraphValue.RenderStage, v)) {
            freq = UpdateFrequency.PER_PASS;
        } else {
            freq = UpdateFrequency.PER_QUEUE;
        }
        return freq;
    }

    mergeDescriptors (srcBlock: DescriptorBlock, dstBlock: DescriptorBlock): string {
        for (const [name, src] of srcBlock.descriptors) {
            const dst = dstBlock.descriptors.get(name);
            if (dst !== undefined) {
                if (!checkDescriptorConsistency(src, dst)) {
                    return `Descriptor ${name} is inconsistent`;
                }
            } else {
                dstBlock.descriptors.set(name, src);
            }
        }
        return '';
    }

    mergeParent (freq: UpdateFrequency, src: DescriptorDB, dst: DescriptorDB): string {
        for (const [key, srcBlock] of src.blocks) {
            let dstBlock = dst.blocks.get(key);
            if (dstBlock === undefined) {
                dstBlock = new DescriptorBlock();
                dst.blocks.set(key, dstBlock);
            }
            const index = JSON.parse(key) as DescriptorBlockIndex;
            if (index.updateFrequency > freq) {
                const error = this.mergeDescriptors(srcBlock, dstBlock);
                if (error) {
                    return error;
                }
            }
        }
        return '';
    }

    updateInfo (freq: UpdateFrequency, db: DescriptorDB) {
        db.blocks.forEach((block: DescriptorBlock, key: string) => {
            const index = JSON.parse(key) as DescriptorBlockIndex;
            if (index.updateFrequency >= freq) {
                block.count = getNumDescriptors(block);
                block.capacity = block.count;
            }
        });
    }

    backEdge (e: edge_descriptor, g: LayoutGraph): void {
        this._error = 'Cycle detected in graph';
    }

    finishEdge (e: edge_descriptor, g: LayoutGraph): void {
        if (this._error !== '') {
            return;
        }
        const parentID = g.source(e);
        const v = g.target(e);
        const dst = g.getDescriptors(parentID);
        const src = g.getDescriptors(v);
        const freq = this.getFrequency(g, v);
        this.mergeParent(freq, src, dst);
    }

    finishVertex (v: number, g: LayoutGraph): void {
        if (this._error !== '') {
            return;
        }
        const freq = this.getFrequency(g, v);
        const db = g.getDescriptors(v);
        this.updateInfo(freq, db);
    }

    get error (): string {
        return this._error;
    }
    private _error = '';
}
