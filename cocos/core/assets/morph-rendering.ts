/**
 * @hidden
 */

import { GFXAttributeName, GFXBuffer, GFXBufferUsageBit, GFXDevice, GFXFeature, GFXMemoryUsageBit } from '../gfx';
import { Mesh } from './mesh';
import { Texture2D } from './texture-2d';
import { ImageAsset } from './image-asset';
import { samplerLib } from '../renderer/core/sampler-lib';
import { UBOMorph, UniformNormalMorphTexture, UniformPositionMorphTexture, UniformTangentMorphTexture } from '../pipeline/define';
import { warn, warnID } from '../platform/debug';
import { Morph, MorphRendering, MorphRenderingInstance, SubMeshMorph } from './morph';
import { assertIsNonNullable, assertIsTrue } from '../data/utils/asserts';
import { log2, nextPow2 } from '../math/bits';
import { IMacroPatch, IPSOCreateInfo } from '../renderer';
import { legacyCC } from '../global-exports';
import { PixelFormat } from './asset-enum';
import { DEV } from 'internal:constants';

/**
 * True if force to use cpu computing based sub-mesh rendering.
 */
const preferCpuComputing = false;

/**
 * Standard morph rendering.
 * The standard morph rendering renders each of sub-mesh morph separately.
 * Sub-mesh morph rendering may select different technique according sub-mesh morph itself.
 */
export class StdMorphRendering implements MorphRendering {
    private _mesh: Mesh;
    private _subMeshRenderings: (SubMeshMorphRendering | null)[] = [];

    constructor (mesh: Mesh, gfxDevice: GFXDevice) {
        this._mesh = mesh;
        if (!this._mesh.struct.morph) {
            return;
        }

        const nSubMeshes = this._mesh.struct.primitives.length;
        this._subMeshRenderings = new Array(nSubMeshes).fill(null);
        for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
            const subMeshMorph = this._mesh.struct.morph.subMeshMorphs[iSubMesh];
            if (!subMeshMorph) {
                continue;
            }

            if (subMeshMorph.targets.length > UBOMorph.MAX_MORPH_TARGET_COUNT) {
                warnID(10002, UBOMorph.MAX_MORPH_TARGET_COUNT, subMeshMorph.targets.length);
                continue;
            }

            if (preferCpuComputing) {
                this._subMeshRenderings[iSubMesh] = new CpuComputing(
                    this._mesh,
                    iSubMesh,
                    this._mesh.struct.morph,
                    gfxDevice,
                );
            } else {
                this._subMeshRenderings[iSubMesh] = new GpuComputing(
                    this._mesh,
                    iSubMesh,
                    this._mesh.struct.morph,
                    gfxDevice,
                );
            }
        }
    }

    public createInstance (): MorphRenderingInstance {
        const nSubMeshes = this._mesh.struct.primitives.length;
        const subMeshInstances: (SubMeshMorphRenderingInstance | null)[] = new Array(nSubMeshes);
        for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
            subMeshInstances[iSubMesh] = this._subMeshRenderings[iSubMesh]?.createInstance() ?? null;
        }
        return {
            setWeights: (subMeshIndex: number, weights: number[]) => {
                subMeshInstances[subMeshIndex]?.setWeights(weights);
            },

            requiredPatches: (subMeshIndex: number) => {
                assertIsNonNullable(this._mesh.struct.morph);
                const subMeshMorph = this._mesh.struct.morph.subMeshMorphs[subMeshIndex];
                const subMeshRenderingInstance = subMeshInstances[subMeshIndex];
                if (subMeshRenderingInstance === null) {
                    return;
                }
                assertIsNonNullable(subMeshMorph);
                const patches: IMacroPatch[] = [
                    { name: 'CC_USE_MORPH', value: true },
                    { name: 'CC_MORPH_TARGET_COUNT', value: subMeshMorph.targets.length }
                ];
                if (subMeshMorph.attributes.includes(GFXAttributeName.ATTR_POSITION)) {
                    patches.push({ name: 'CC_MORPH_TARGET_HAS_POSITION', value: true});
                }
                if (subMeshMorph.attributes.includes(GFXAttributeName.ATTR_NORMAL)) {
                    patches.push({ name: 'CC_MORPH_TARGET_HAS_NORMAL', value: true});
                }
                if (subMeshMorph.attributes.includes(GFXAttributeName.ATTR_TANGENT)) {
                    patches.push({ name: 'CC_MORPH_TARGET_HAS_TANGENT', value: true});
                }
                patches.push(...subMeshRenderingInstance.requiredPatches());
                return patches;
            },

            adaptPipelineState: (subMeshIndex: number, pipelineCreateInfo: IPSOCreateInfo) => {
                subMeshInstances[subMeshIndex]?.adaptPipelineState(pipelineCreateInfo);
            },

            destroy: () => {
                for (const subMeshInstance of subMeshInstances) {
                    subMeshInstance?.destroy();
                }
            },
        };
    }
}

/**
 * Describes how to render a sub-mesh morph.
 */
interface SubMeshMorphRendering {
    /**
     * Creates a rendering instance.
     */
    createInstance (): SubMeshMorphRenderingInstance;
}

/**
 * The instance of once sub-mesh morph rendering.
 */
interface SubMeshMorphRenderingInstance {
    /**
     * Set weights of each morph target.
     * @param weights The weights.
     */
    setWeights (weights: number[]): void;

    /**
     * Asks the define overrides needed to do the rendering.
     */
    requiredPatches (): IMacroPatch[];

    /**
     * Adapts the pipelineState to apply the rendering.
     * @param pipelineState
     */
    adaptPipelineState (pipelineCreateInfo: IPSOCreateInfo): void;

    /**
     * Destroy this instance.
     */
    destroy (): void;
}

/**
 * (General purpose) Gpu computing based sub-mesh morph rendering.
 * This technique computes final attribute displacements on GPU.
 * Target displacements of each attribute are transferred through vertex texture, say, morph texture.
 */
class GpuComputing implements SubMeshMorphRendering {
    private _gfxDevice: GFXDevice;
    private _subMeshMorph: SubMeshMorph;
    private _textureInfo: {
        width: number;
        height: number;
    };
    private _attributes: {
        name: string;
        morphTexture: MorphTexture;
    }[];

    constructor (mesh: Mesh, subMeshIndex: number, morph: Morph, gfxDevice: GFXDevice) {
        assertIsNonNullable(mesh.data);
        this._gfxDevice = gfxDevice;
        const meshData = mesh.data.buffer;
        const subMeshMorph = morph.subMeshMorphs[subMeshIndex];
        assertIsNonNullable(subMeshMorph);
        this._subMeshMorph = subMeshMorph;

        enableVertexId(mesh, subMeshIndex, gfxDevice);

        const nVertices = mesh.struct.vertexBundles[mesh.struct.primitives[subMeshIndex].vertexBundelIndices[0]].view.count;
        const nTargets = subMeshMorph.targets.length;
        // Head includes N vector 4, where N is number of targets.
        // Every r channel of the pixel denotes the index of the data pixel of corresponding target.
        // [ (target1_data_offset), (target2_data_offset), .... ] target_data
        const vec4Required = nTargets + nVertices * nTargets;

        const vec4TextureFactory = createVec4TextureFactory(gfxDevice, vec4Required);
        this._textureInfo = {
            width: vec4TextureFactory.width,
            height: vec4TextureFactory.height,
        };

        // Creates texture for each attribute.
        this._attributes = subMeshMorph.attributes.map((attributeName, attributeIndex) => {
            const vec4Tex = vec4TextureFactory.create();
            const valueView = vec4Tex.valueView;
            // if (DEV) { // Make it easy to view texture in profilers...
            //     for (let i = 0; i < valueView.length / 4; ++i) {
            //         valueView[i * 4 + 3] = 1.0;
            //     }
            // }
            {
                let pHead = 0;
                let nVec4s = subMeshMorph.targets.length;
                subMeshMorph.targets.forEach((morphTarget) => {
                    const displacementsView = morphTarget.displacements[attributeIndex];
                    const displacements = new Float32Array(meshData, displacementsView.offset, displacementsView.count);
                    const nVec3s = displacements.length / 3;
                    valueView[pHead] = nVec4s;
                    const displacementsOffset = nVec4s * 4;
                    for (let iVec3 = 0; iVec3 < nVec3s; ++iVec3) {
                        valueView[displacementsOffset + 4 * iVec3 + 0] = displacements[3 * iVec3 + 0];
                        valueView[displacementsOffset + 4 * iVec3 + 1] = displacements[3 * iVec3 + 1];
                        valueView[displacementsOffset + 4 * iVec3 + 2] = displacements[3 * iVec3 + 2];
                    }
                    pHead += 4;
                    nVec4s += nVec3s;
                });
            }
            vec4Tex.updatePixels();
            return {
                name: attributeName,
                morphTexture: vec4Tex,
            };
        });
    }

    public destroy () {
        for (const attribute of this._attributes) {
            attribute.morphTexture.destroy();
        }
    }

    public createInstance () {
        const morphUniforms = new MorphUniforms(this._gfxDevice, this._subMeshMorph.targets.length);
        morphUniforms.setMorphTextureInfo(this._textureInfo.width, this._textureInfo.height);
        morphUniforms.commit();
        return {
            setWeights: (weights: number[]) => {
                morphUniforms.setWeights(weights);
                morphUniforms.commit();
            },

            requiredPatches: (): IMacroPatch[] => {
                return [{ name: 'CC_MORPH_TARGET_USE_TEXTURE', value: true, }];
            },

            adaptPipelineState: (pipelineCreateInfo: IPSOCreateInfo) => {
                const bindingLayout = pipelineCreateInfo.bindingLayout;
                for (const attribute of this._attributes) {
                    let binding: number | undefined;
                    switch (attribute.name) {
                        case GFXAttributeName.ATTR_POSITION: binding = UniformPositionMorphTexture.binding; break;
                        case GFXAttributeName.ATTR_NORMAL: binding = UniformNormalMorphTexture.binding; break;
                        case GFXAttributeName.ATTR_TANGENT: binding = UniformTangentMorphTexture.binding; break;
                        default:
                            warn(`Unexpected attribute!`); break;
                    }
                    if (binding !== undefined) {
                        bindingLayout.bindSampler(binding, attribute.morphTexture.sampler);
                        bindingLayout.bindTexture(binding, attribute.morphTexture.texture);
                    }
                }
                bindingLayout.bindBuffer(UBOMorph.BLOCK.binding, morphUniforms.buffer);
                bindingLayout.update();
            },

            destroy: () => {

            },
        };
    }
}

/**
 * Cpu computing based sub-mesh morph rendering.
 * This technique computes final attribute displacements on CPU.
 * The displacements, then, are passed to GPU.
 */
class CpuComputing implements SubMeshMorphRendering {
    private _gfxDevice: GFXDevice;
    private _attributes: {
        name: string;
        targets: {
            displacements: Float32Array;
        }[];
    }[] = [];

    constructor (mesh: Mesh, subMeshIndex: number, morph: Morph, gfxDevice: GFXDevice) {
        this._gfxDevice = gfxDevice;
        assertIsNonNullable(mesh.data);
        const meshData = mesh.data.buffer;
        const subMeshMorph = morph.subMeshMorphs[subMeshIndex];
        assertIsNonNullable(subMeshMorph);
        enableVertexId(mesh, subMeshIndex, gfxDevice);
        this._attributes = subMeshMorph.attributes.map((attributeName, attributeIndex) =>  {
            return {
                name: attributeName,
                targets: subMeshMorph.targets.map((attributeDisplacement) => ({
                    displacements: new Float32Array(
                        meshData,
                        attributeDisplacement.displacements[attributeIndex].offset,
                        attributeDisplacement.displacements[attributeIndex].count),
                })),
            };
        });
    }

    /**
     * DO NOT use this field.
     */
    get data () {
        return this._attributes;
    }

    public createInstance () {
        return new CpuComputingRenderingInstance(
            this,
            this._attributes[0].targets[0].displacements.length / 3,
            this._gfxDevice,
        );
    }
}
class CpuComputingRenderingInstance implements SubMeshMorphRenderingInstance {
    private _attributes: {
        attributeName: string;
        morphTexture: MorphTexture;
    }[];
    private _owner: CpuComputing;
    private _morphUniforms: MorphUniforms;

    public constructor (owner: CpuComputing, nVertices: number, gfxDevice: GFXDevice) {
        this._owner = owner;
        this._morphUniforms = new MorphUniforms(gfxDevice, 0 /* TODO? */ );

        const vec4TextureFactory = createVec4TextureFactory(gfxDevice, nVertices);
        this._morphUniforms.setMorphTextureInfo(vec4TextureFactory.width, vec4TextureFactory.height);
        this._morphUniforms.commit();

        this._attributes = this._owner.data.map((attributeMorph, attributeIndex) => {
            const morphTexture = vec4TextureFactory.create();
            return {
                attributeName: attributeMorph.name,
                morphTexture,
            };
        });
    }

    public setWeights (weights: number[]) {
        for (let iAttribute = 0; iAttribute < this._attributes.length; ++iAttribute) {
            const myAttribute = this._attributes[iAttribute];
            const valueView = myAttribute.morphTexture.valueView;
            const attributeMorph = this._owner.data[iAttribute];
            assertIsTrue(weights.length === attributeMorph.targets.length);
            for (let iTarget = 0; iTarget < attributeMorph.targets.length; ++iTarget) {
                const targetDisplacements = attributeMorph.targets[iTarget].displacements;
                const weight = weights[iTarget];
                const nVertices = targetDisplacements.length / 3;
                if (iTarget === 0) {
                    for (let iVertex = 0; iVertex < nVertices; ++iVertex) {
                        valueView[4 * iVertex + 0] = targetDisplacements[3 * iVertex + 0] * weight;
                        valueView[4 * iVertex + 1] = targetDisplacements[3 * iVertex + 1] * weight;
                        valueView[4 * iVertex + 2] = targetDisplacements[3 * iVertex + 2] * weight;
                    }
                } else {
                    for (let iVertex = 0; iVertex < nVertices; ++iVertex) {
                        valueView[4 * iVertex + 0] += targetDisplacements[3 * iVertex + 0] * weight;
                        valueView[4 * iVertex + 1] += targetDisplacements[3 * iVertex + 1] * weight;
                        valueView[4 * iVertex + 2] += targetDisplacements[3 * iVertex + 2] * weight;
                    }
                }
            }

            // Normalize displacements to [0, 1].
            if (false) {
                const n = attributeMorph.targets[0].displacements.length / 3;
                for (let c = 0; c < 3; ++c) {
                    let min = Number.POSITIVE_INFINITY;
                    let max = Number.NEGATIVE_INFINITY;
                    for (let i = 0; i < n; ++i) {
                        const x = valueView[i * 3 + c];
                        max = Math.max(x, max);
                        min = Math.min(x, min);
                    }
                    const d = max - min;
                    if (d !== 0) {
                        for (let i = 0; i < n; ++i) {
                            const x = valueView[i * 3 + c];
                            valueView[i * 3 + c] = (x - min) / d;
                        }
                    }
                }
            }

            // Randomize displacements.
            if (false) {
                for (let i = 0; i < valueView.length; ++i) {
                    if (i % 3 === 1) {
                        valueView[i] = (legacyCC.director.getTotalFrames() % 500) * 0.001;
                    } else {
                        valueView[i] = 0;
                    }
                }
            }

            myAttribute.morphTexture.updatePixels();
        }
    }

    public requiredPatches (): IMacroPatch[] {
        return [
            { name: 'CC_MORPH_TARGET_USE_TEXTURE', value: true, },
            { name: 'CC_MORPH_PRECOMPUTED', value: true, },
        ];
    }

    public adaptPipelineState (pipelineCreateInfo: IPSOCreateInfo) {
        const bindingLayout = pipelineCreateInfo.bindingLayout;
        for (const attribute of this._attributes) {
            const attributeName = attribute.attributeName;
            let binding: number | undefined;
            switch (attributeName) {
                case GFXAttributeName.ATTR_POSITION: binding = UniformPositionMorphTexture.binding; break;
                case GFXAttributeName.ATTR_NORMAL: binding = UniformNormalMorphTexture.binding; break;
                case GFXAttributeName.ATTR_TANGENT: binding = UniformTangentMorphTexture.binding; break;
                default:
                    warn(`Unexpected attribute!`); break;
            }
            if (binding !== undefined) {
                bindingLayout.bindSampler(binding, attribute.morphTexture.sampler);
                bindingLayout.bindTexture(binding, attribute.morphTexture.texture);
            }
        }
        bindingLayout.bindBuffer(UBOMorph.BLOCK.binding, this._morphUniforms.buffer);
        bindingLayout.update();
    }

    public destroy () {
        this._morphUniforms.destroy();
        for (let iAttribute = 0; iAttribute < this._attributes.length; ++iAttribute) {
            const myAttribute = this._attributes[iAttribute];
            myAttribute.morphTexture.destroy();
        }
    }
}

/**
 * Provides the access to morph related uniforms.
 */
class MorphUniforms {
    private _targetCount: number;
    private _localBuffer: DataView;
    private _remoteBuffer: GFXBuffer;

    constructor (gfxDevice: GFXDevice, targetCount: number) {
        this._targetCount = targetCount;
        this._localBuffer = new DataView(new ArrayBuffer(UBOMorph.SIZE));
        this._remoteBuffer = gfxDevice.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOMorph.SIZE,
            stride: UBOMorph.SIZE,
        });
    }

    public destroy () {
        this._remoteBuffer.destroy();
    }

    public get buffer () {
        return this._remoteBuffer;
    }

    public setWeights (weights: number[]) {
        assertIsTrue(weights.length === this._targetCount);
        for (let iWeight = 0; iWeight < weights.length; ++iWeight) {
            this._localBuffer.setFloat32(UBOMorph.OFFSET_OF_WEIGHTS + 4 * iWeight, weights[iWeight], legacyCC.sys.isLittleEndian);
        }
    }

    public setMorphTextureInfo (width: number, height: number) {
        this._localBuffer.setFloat32(UBOMorph.OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH, width, legacyCC.sys.isLittleEndian);
        this._localBuffer.setFloat32(UBOMorph.OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT, height, legacyCC.sys.isLittleEndian);
    }

    public commit () {
        this._remoteBuffer.update(
            this._localBuffer.buffer,
            this._localBuffer.byteOffset,
            this._localBuffer.byteLength,
        );
    }
}

/**
 * 
 * @param gfxDevice 
 * @param vec4Capacity Capacity of vec4.
 */
function createVec4TextureFactory (gfxDevice: GFXDevice, vec4Capacity: number) {
    const hasFeatureFloatTexture = gfxDevice.hasFeature(GFXFeature.TEXTURE_FLOAT);

    let pixelRequired: number;
    let pixelFormat: PixelFormat;
    let pixelBytes: number;
    let updateViewConstructor: typeof Float32Array | typeof Uint8Array;
    if (hasFeatureFloatTexture) {
        pixelRequired = vec4Capacity;
        pixelBytes = 16;
        pixelFormat = Texture2D.PixelFormat.RGBA32F;
        updateViewConstructor = Float32Array;
    } else {
        pixelRequired = 4 * vec4Capacity;
        pixelBytes = 4;
        pixelFormat = Texture2D.PixelFormat.RGBA8888;
        updateViewConstructor = Uint8Array;
    }

    const { width, height } = bestSizeToHavePixels(pixelRequired);
    assertIsTrue(width * height > pixelRequired);

    return {
        width,
        height,
        create: () => {
            const arrayBuffer = new ArrayBuffer(width * height * pixelBytes);
            const valueView = new Float32Array(arrayBuffer);
            const updateView = updateViewConstructor === Float32Array ? valueView : new updateViewConstructor(arrayBuffer);
            const image = new ImageAsset({
                width,
                height,
                _data: updateView,
                _compressed: false,
                format: pixelFormat,
            });
            const textureAsset = new Texture2D();
            textureAsset.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
            textureAsset.setMipFilter(Texture2D.Filter.NONE);
            textureAsset.setWrapMode(Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE);
            textureAsset.image = image;
            if (!textureAsset.getGFXTexture()) {
                warn(`Unexpected: failed to create morph texture?`);
            }
            const sampler = samplerLib.getSampler(gfxDevice, textureAsset.getSamplerHash());
            return {
                /**
                 * Gets the GFX texture.
                 */
                get texture () {
                    return textureAsset.getGFXTexture()!;
                },

                /**
                 * Gets the GFX sampler.
                 */
                get sampler () {
                    return sampler;
                },

                /**
                 * Value view.
                 */
                get valueView () {
                    return valueView;
                },

                /**
                 * Destroy the texture. Release its GPU resources.
                 */
                destroy () {
                    textureAsset.destroy();
                    // Samplers allocated from `samplerLib` are not required and
                    // should not be destroyed.
                    // this._sampler.destroy();
                },

                /**
                 * Update the pixels content to `valueView`.
                 */
                updatePixels () {
                    textureAsset.uploadData(updateView);
                },
            };
        },
    };
}

type MorphTexture = ReturnType<ReturnType<typeof createVec4TextureFactory>['create']>;

/**
 * When use vertex-texture-fetch technique, we do need
 * `gl_vertexId` when we sample per-vertex data.
 * WebGL 1.0 does not have `gl_vertexId`; WebGL 2.0, however, does.
 * @param mesh
 * @param subMeshIndex
 * @param gfxDevice
 */
function enableVertexId (mesh: Mesh, subMeshIndex: number, gfxDevice: GFXDevice) {
    mesh.renderingSubMeshes[subMeshIndex].enableVertexIdChannel(gfxDevice);
}

/**
 * Decides a best texture size to have the specified pixel capacity at least.
 * The decided width and height has the following characteristics:
 * - the width and height are both power of 2;
 * - if the width and height are different, the width would be set to the larger once;
 * - the width is ensured to be multiple of 4.
 * @param nPixels Least pixel capacity.
 */
function bestSizeToHavePixels (nPixels: number) {
    if (nPixels < 5) {
        nPixels = 5;
    }
    const aligned = nextPow2(nPixels);
    const epxSum = log2(aligned);
    const h = epxSum >> 1;
    const w = (epxSum & 1) ? (h + 1) : h;
    return {
        width: 1 << w,
        height: 1 << h,
    };
}