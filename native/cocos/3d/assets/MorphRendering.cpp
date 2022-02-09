/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "3d/assets/MorphRendering.h"

#include <memory>
#include "3d/assets/Mesh.h"
#include "3d/assets/Morph.h"
#include "base/RefCounted.h"
#include "core/DataView.h"
#include "core/TypedArray.h"
#include "core/assets/RenderingSubMesh.h"
#include "core/assets/Texture2D.h"
#include "platform/Image.h"
#include "renderer/pipeline/Define.h"
#include "scene/Pass.h"

namespace cc {

/**
 * The instance of once sub-mesh morph rendering.
 */
class SubMeshMorphRenderingInstance : public RefCounted {
public:
    ~SubMeshMorphRenderingInstance() override = default;
    /**
     * Set weights of each morph target.
     * @param weights The weights.
     */
    virtual void setWeights(const std::vector<float> &weights) = 0;

    /**
     * Asks the define overrides needed to do the rendering.
     */
    virtual std::vector<scene::IMacroPatch> requiredPatches() = 0;

    /**
     * Adapts the pipelineState to apply the rendering.
     * @param pipelineState
     */
    virtual void adaptPipelineState(gfx::DescriptorSet *descriptorSet) = 0;

    /**
     * Destroy this instance.
     */
    virtual void destroy() = 0;
};

/**
 * Describes how to render a sub-mesh morph.
 */
class SubMeshMorphRendering : public RefCounted {
public:
    ~SubMeshMorphRendering() override = default;
    /**
     * Creates a rendering instance.
     */
    virtual SubMeshMorphRenderingInstance *createInstance() = 0;
};

namespace {
/**
 * True if force to use cpu computing based sub-mesh rendering.
 */
const bool PREFER_CPU_COMPUTING = false;

class MorphTexture final : public RefCounted {
public:
    MorphTexture() = default;

    ~MorphTexture() override = default;
    /**
     * Gets the GFX texture.
     */
    gfx::Texture *getTexture() {
        return _textureAsset->getGFXTexture();
    }

    /**
     * Gets the GFX sampler.
     */
    gfx::Sampler *getSampler() {
        return _sampler;
    }

    /**
     * Value view.
     */
    Float32Array &getValueView() {
        return _valueView;
    }

    /**
     * Destroy the texture. Release its GPU resources.
     */
    void destroy() {
        _textureAsset->destroy();
        // Samplers allocated from `samplerLib` are not required and
        // should not be destroyed.
        // _sampler.destroy();
    }

    /**
     * Update the pixels content to `valueView`.
     */
    void updatePixels() {
        _textureAsset->uploadData(_arrayBuffer->getData());
    }

    void initialize(gfx::Device *gfxDevice, uint32_t width, uint32_t height, uint32_t pixelBytes, bool /*useFloat32Array*/, PixelFormat pixelFormat) {
        _arrayBuffer = new ArrayBuffer(width * height * pixelBytes);
        _valueView   = Float32Array(_arrayBuffer);

        auto *             imageAsset = new ImageAsset();
        IMemoryImageSource source{_arrayBuffer, false, width, height, pixelFormat};
        imageAsset->setNativeAsset(source);

        _textureAsset = new Texture2D();
        _textureAsset->setFilters(Texture2D::Filter::NEAREST, Texture2D::Filter::NEAREST);
        _textureAsset->setMipFilter(Texture2D::Filter::NONE);
        _textureAsset->setWrapMode(Texture2D::WrapMode::CLAMP_TO_EDGE, Texture2D::WrapMode::CLAMP_TO_EDGE, Texture2D::WrapMode::CLAMP_TO_EDGE);
        _textureAsset->setImage(imageAsset);

        if (nullptr == _textureAsset->getGFXTexture()) {
            CC_LOG_WARNING("Unexpected: failed to create morph texture?");
        }
        _sampler = gfxDevice->getSampler(_textureAsset->getSamplerInfo());
    }

private:
    IntrusivePtr<Texture2D> _textureAsset;
    gfx::Sampler *          _sampler{nullptr};
    ArrayBuffer::Ptr        _arrayBuffer;
    Float32Array            _valueView;

    CC_DISALLOW_COPY_MOVE_ASSIGN(MorphTexture);
};

struct GpuMorphAttribute {
    std::string                attributeName;
    IntrusivePtr<MorphTexture> morphTexture;
};

struct CpuMorphAttributeTarget {
    Float32Array displacements;
};

using CpuMorphAttributeTargetList = std::vector<CpuMorphAttributeTarget>;

struct CpuMorphAttribute {
    std::string                 name;
    CpuMorphAttributeTargetList targets;
};

struct Vec4TextureFactory {
    uint32_t                        width{0};
    uint32_t                        height{0};
    std::function<MorphTexture *()> create{nullptr};
};

/**
 * Decides a best texture size to have the specified pixel capacity at least.
 * The decided width and height has the following characteristics:
 * - the width and height are both power of 2;
 * - if the width and height are different, the width would be set to the larger once;
 * - the width is ensured to be multiple of 4.
 * @param nPixels Least pixel capacity.
 */
bool bestSizeToHavePixels(uint32_t nPixels, uint32_t *pWidth, uint32_t *pHeight) {
    if (pWidth == nullptr || pHeight == nullptr) {
        if (pWidth != nullptr) {
            *pWidth = 0;
        }

        if (pHeight != nullptr) {
            *pHeight = 0;
        }
        return false;
    }

    if (nPixels < 5) {
        nPixels = 5;
    }
    const uint32_t aligned = pipeline::nextPow2(nPixels);
    const auto     epxSum  = static_cast<uint32_t>(std::log2(aligned));
    const uint32_t h       = epxSum >> 1;
    const uint32_t w       = (epxSum & 1) ? (h + 1) : h;

    *pWidth  = 1 << w;
    *pHeight = 1 << h;

    return true;
}

/**
 * When use vertex-texture-fetch technique, we do need
 * `gl_vertexId` when we sample per-vertex data.
 * WebGL 1.0 does not have `gl_vertexId`; WebGL 2.0, however, does.
 * @param mesh
 * @param subMeshIndex
 * @param gfxDevice
 */
void enableVertexId(Mesh *mesh, uint32_t subMeshIndex, gfx::Device *gfxDevice) {
    mesh->getRenderingSubMeshes()[subMeshIndex]->enableVertexIdChannel(gfxDevice);
}

/**
 *
 * @param gfxDevice
 * @param vec4Capacity Capacity of vec4.
 */
Vec4TextureFactory createVec4TextureFactory(gfx::Device *gfxDevice, uint32_t vec4Capacity) {
    bool hasFeatureFloatTexture = static_cast<uint32_t>(gfxDevice->getFormatFeatures(gfx::Format::RGBA32F) & gfx::FormatFeature::SAMPLED_TEXTURE) != 0;

    uint32_t    pixelRequired   = 0;
    PixelFormat pixelFormat     = PixelFormat::RGBA8888;
    uint32_t    pixelBytes      = 4;
    bool        useFloat32Array = false;
    if (hasFeatureFloatTexture) {
        pixelRequired   = vec4Capacity;
        pixelBytes      = 16;
        pixelFormat     = Texture2D::PixelFormat::RGBA32F;
        useFloat32Array = true;
    } else {
        pixelRequired   = 4 * vec4Capacity;
        pixelBytes      = 4;
        pixelFormat     = Texture2D::PixelFormat::RGBA8888;
        useFloat32Array = false;
    }

    uint32_t width  = 0;
    uint32_t height = 0;
    bestSizeToHavePixels(pixelRequired, &width, &height);
    CC_ASSERT(width * height >= pixelRequired);

    Vec4TextureFactory ret;
    ret.width  = width;
    ret.height = height;
    ret.create = [=]() -> MorphTexture * {
        auto *texture = new MorphTexture(); // texture will be held by IntrusivePtr in GpuMorphAttribute
        texture->initialize(gfxDevice, width, height, pixelBytes, useFloat32Array, pixelFormat);
        return texture;
    };

    return ret;
}

/**
 * Provides the access to morph related uniforms.
 */
class MorphUniforms final : public RefCounted {
public:
    MorphUniforms(gfx::Device *gfxDevice, uint32_t targetCount) {
        _targetCount = targetCount;
        _localBuffer = new DataView(new ArrayBuffer(pipeline::UBOMorph::SIZE));

        _remoteBuffer = gfxDevice->createBuffer(gfx::BufferInfo{
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            pipeline::UBOMorph::SIZE,
            pipeline::UBOMorph::SIZE,
        });
    }

    ~MorphUniforms() override {
        delete _localBuffer;
    }

    void destroy() {
        _remoteBuffer->destroy();
    }

    gfx::Buffer *getBuffer() const {
        return _remoteBuffer;
    }

    void setWeights(const std::vector<float> &weights) {
        CC_ASSERT(weights.size() == _targetCount);
        for (size_t iWeight = 0; iWeight < weights.size(); ++iWeight) {
            _localBuffer->setFloat32(static_cast<uint32_t>(pipeline::UBOMorph::OFFSET_OF_WEIGHTS + 4 * iWeight), weights[iWeight]);
        }
    }

    void setMorphTextureInfo(float width, float height) {
        _localBuffer->setFloat32(pipeline::UBOMorph::OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH, width);
        _localBuffer->setFloat32(pipeline::UBOMorph::OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT, height);
    }

    void setVerticesCount(uint32_t count) {
        _localBuffer->setFloat32(pipeline::UBOMorph::OFFSET_OF_VERTICES_COUNT, static_cast<float>(count));
    }

    void commit() {
        ArrayBuffer *buffer = _localBuffer->buffer();
        _remoteBuffer->update(buffer->getData(), buffer->byteLength());
    }

private:
    uint32_t                  _targetCount{0};
    DataView *                _localBuffer{nullptr};
    IntrusivePtr<gfx::Buffer> _remoteBuffer;
};

class CpuComputing final : public SubMeshMorphRendering {
public:
    explicit CpuComputing(Mesh *mesh, uint32_t subMeshIndex, const Morph *morph, gfx::Device *gfxDevice);

    SubMeshMorphRenderingInstance *       createInstance() override;
    const std::vector<CpuMorphAttribute> &getData() const;

private:
    std::vector<CpuMorphAttribute> _attributes;
    gfx::Device *                  _gfxDevice{nullptr};
};

class GpuComputing final : public SubMeshMorphRendering {
public:
    explicit GpuComputing(Mesh *mesh, uint32_t subMeshIndex, const Morph *morph, gfx::Device *gfxDevice);
    SubMeshMorphRenderingInstance *createInstance() override;

    void destroy();

private:
    gfx::Device *                  _gfxDevice{nullptr};
    const SubMeshMorph *           _subMeshMorph{nullptr};
    uint32_t                       _textureWidth{0};
    uint32_t                       _textureHeight{0};
    std::vector<GpuMorphAttribute> _attributes;
    uint32_t                       _verticesCount{0};

    friend class GpuComputingRenderingInstance;
};

class CpuComputingRenderingInstance final : public SubMeshMorphRenderingInstance {
public:
    explicit CpuComputingRenderingInstance(CpuComputing *owner, uint32_t nVertices, gfx::Device *gfxDevice) {
        _owner         = owner; //NOTE: release by mesh`s destroy, it`ll call current instance`s destroy method
        _morphUniforms = new MorphUniforms(gfxDevice, 0 /* TODO? */);

        auto vec4TextureFactory = createVec4TextureFactory(gfxDevice, nVertices);
        _morphUniforms->setMorphTextureInfo(static_cast<float>(vec4TextureFactory.width), static_cast<float>(vec4TextureFactory.height));
        _morphUniforms->commit();
        for (const auto &attributeMorph : _owner->getData()) {
            auto *morphTexture = vec4TextureFactory.create();
            _attributes.emplace_back(GpuMorphAttribute{attributeMorph.name, morphTexture});
        }
    }

    void setWeights(const std::vector<float> &weights) override {
        for (size_t iAttribute = 0; iAttribute < _attributes.size(); ++iAttribute) {
            const auto &  myAttribute    = _attributes[iAttribute];
            Float32Array &valueView      = myAttribute.morphTexture->getValueView();
            const auto &  attributeMorph = _owner->getData()[iAttribute];
            CC_ASSERT(weights.size() == attributeMorph.targets.size());
            for (size_t iTarget = 0; iTarget < attributeMorph.targets.size(); ++iTarget) {
                const auto &   targetDisplacements = attributeMorph.targets[iTarget].displacements;
                const float    weight              = weights[iTarget];
                const uint32_t nVertices           = targetDisplacements.length() / 3;
                if (iTarget == 0) {
                    for (uint32_t iVertex = 0; iVertex < nVertices; ++iVertex) {
                        valueView[4 * iVertex + 0] = targetDisplacements[3 * iVertex + 0] * weight;
                        valueView[4 * iVertex + 1] = targetDisplacements[3 * iVertex + 1] * weight;
                        valueView[4 * iVertex + 2] = targetDisplacements[3 * iVertex + 2] * weight;
                    }
                } else if (std::fabs(weight) >= std::numeric_limits<float>::epsilon()) {
                    for (uint32_t iVertex = 0; iVertex < nVertices; ++iVertex) {
                        valueView[4 * iVertex + 0] += targetDisplacements[3 * iVertex + 0] * weight;
                        valueView[4 * iVertex + 1] += targetDisplacements[3 * iVertex + 1] * weight;
                        valueView[4 * iVertex + 2] += targetDisplacements[3 * iVertex + 2] * weight;
                    }
                }
            }

            myAttribute.morphTexture->updatePixels();
        }
    }

    std::vector<scene::IMacroPatch> requiredPatches() override {
        return {
            {"CC_MORPH_TARGET_USE_TEXTURE", true},
            {"CC_MORPH_PRECOMPUTED", true},
        };
    }

    void adaptPipelineState(gfx::DescriptorSet *descriptorSet) override {
        for (const auto &attribute : _attributes) {
            const auto &           attributeName = attribute.attributeName;
            cc::optional<uint32_t> binding;
            if (attributeName == gfx::ATTR_NAME_POSITION) {
                binding = uint32_t{pipeline::POSITIONMORPH::BINDING};
            } else if (attributeName == gfx::ATTR_NAME_NORMAL) {
                binding = uint32_t{pipeline::NORMALMORPH::BINDING};
            } else if (attributeName == gfx::ATTR_NAME_TANGENT) {
                binding = uint32_t{pipeline::TANGENTMORPH::BINDING};
            } else {
                CC_LOG_WARNING("Unexpected attribute!");
            }

            if (binding.has_value()) {
                descriptorSet->bindSampler(binding.value(), attribute.morphTexture->getSampler());
                descriptorSet->bindTexture(binding.value(), attribute.morphTexture->getTexture());
            }
        }
        descriptorSet->bindBuffer(pipeline::UBOMorph::BINDING, _morphUniforms->getBuffer());
        descriptorSet->update();
    }

    void destroy() override {
        CC_SAFE_DESTROY(_morphUniforms);
        for (auto &myAttribute : _attributes) {
            CC_SAFE_DESTROY(myAttribute.morphTexture);
        }
    }

private:
    std::vector<GpuMorphAttribute> _attributes;
    IntrusivePtr<CpuComputing>     _owner;
    IntrusivePtr<MorphUniforms>    _morphUniforms;
};

class GpuComputingRenderingInstance final : public SubMeshMorphRenderingInstance {
public:
    explicit GpuComputingRenderingInstance(GpuComputing *owner, gfx::Device *gfxDevice) {
        _owner         = owner;
        _morphUniforms = new MorphUniforms(gfxDevice, static_cast<uint32_t>(_owner->_subMeshMorph->targets.size()));
        _morphUniforms->setMorphTextureInfo(static_cast<float>(_owner->_textureWidth), static_cast<float>(_owner->_textureHeight));
        _morphUniforms->setVerticesCount(_owner->_verticesCount);
        _morphUniforms->commit();
        _attributes = &_owner->_attributes;
    }

    void setWeights(const std::vector<float> &weights) override {
        _morphUniforms->setWeights(weights);
        _morphUniforms->commit();
    }

    std::vector<scene::IMacroPatch> requiredPatches() override {
        return {
            {"CC_MORPH_TARGET_USE_TEXTURE", true},
        };
    }

    void adaptPipelineState(gfx::DescriptorSet *descriptorSet) override {
        for (const auto &attribute : *_attributes) {
            const auto &           attributeName = attribute.attributeName;
            cc::optional<uint32_t> binding;
            if (attributeName == gfx::ATTR_NAME_POSITION) {
                binding = uint32_t{pipeline::POSITIONMORPH::BINDING};
            } else if (attributeName == gfx::ATTR_NAME_NORMAL) {
                binding = uint32_t{pipeline::NORMALMORPH::BINDING};
            } else if (attributeName == gfx::ATTR_NAME_TANGENT) {
                binding = uint32_t{pipeline::TANGENTMORPH::BINDING};
            } else {
                CC_LOG_WARNING("Unexpected attribute!");
            }

            if (binding.has_value()) {
                descriptorSet->bindSampler(binding.value(), attribute.morphTexture->getSampler());
                descriptorSet->bindTexture(binding.value(), attribute.morphTexture->getTexture());
            }
        }
        descriptorSet->bindBuffer(pipeline::UBOMorph::BINDING, _morphUniforms->getBuffer());
        descriptorSet->update();
    }

    void destroy() override {
    }

private:
    std::vector<GpuMorphAttribute> *_attributes{nullptr};
    IntrusivePtr<GpuComputing>      _owner;
    IntrusivePtr<MorphUniforms>     _morphUniforms;
};

CpuComputing::CpuComputing(Mesh *mesh, uint32_t subMeshIndex, const Morph *morph, gfx::Device *gfxDevice) {
    _gfxDevice               = gfxDevice;
    const auto &subMeshMorph = morph->subMeshMorphs[subMeshIndex].value();
    enableVertexId(mesh, subMeshIndex, gfxDevice);

    for (size_t attributeIndex = 0, len = subMeshMorph.attributes.size(); attributeIndex < len; ++attributeIndex) {
        const auto &attributeName = subMeshMorph.attributes[attributeIndex];

        CpuMorphAttribute attr;
        attr.name = attributeName;
        attr.targets.resize(subMeshMorph.targets.size());

        uint32_t i = 0;
        for (const auto &attributeDisplacement : subMeshMorph.targets) {
            const Mesh::IBufferView &displacementsView = attributeDisplacement.displacements[attributeIndex];
            attr.targets[i].displacements              = Float32Array(mesh->getData().buffer(),
                                                         mesh->getData().byteOffset() + displacementsView.offset,
                                                         attributeDisplacement.displacements[attributeIndex].count);

            ++i;
        }

        _attributes.emplace_back(attr);
    }
}

SubMeshMorphRenderingInstance *CpuComputing::createInstance() {
    return new CpuComputingRenderingInstance(
        this,
        _attributes[0].targets[0].displacements.length() / 3,
        _gfxDevice);
}

const std::vector<CpuMorphAttribute> &CpuComputing::getData() const {
    return _attributes;
}

GpuComputing::GpuComputing(Mesh *mesh, uint32_t subMeshIndex, const Morph *morph, gfx::Device *gfxDevice) {
    _gfxDevice               = gfxDevice;
    const auto &subMeshMorph = morph->subMeshMorphs[subMeshIndex].value();

    _subMeshMorph = &subMeshMorph;
    //    assertIsNonNullable(subMeshMorph);

    enableVertexId(mesh, subMeshIndex, gfxDevice);

    uint32_t nVertices    = mesh->getStruct().vertexBundles[mesh->getStruct().primitives[subMeshIndex].vertexBundelIndices[0]].view.count;
    _verticesCount        = nVertices;
    auto     nTargets     = static_cast<uint32_t>(subMeshMorph.targets.size());
    uint32_t vec4Required = nVertices * nTargets;

    auto vec4TextureFactory = createVec4TextureFactory(gfxDevice, vec4Required);
    _textureWidth           = vec4TextureFactory.width;
    _textureHeight          = vec4TextureFactory.height;

    // Creates texture for each attribute.
    uint32_t attributeIndex = 0;
    _attributes.reserve(subMeshMorph.attributes.size());
    for (const auto &attributeName : subMeshMorph.attributes) {
        auto *        vec4Tex   = vec4TextureFactory.create();
        Float32Array &valueView = vec4Tex->getValueView();
        // if (DEV) { // Make it easy to view texture in profilers...
        //     for (let i = 0; i < valueView.length / 4; ++i) {
        //         valueView[i * 4 + 3] = 1.0;
        //     }
        // }

        uint32_t morphTargetIndex = 0;
        for (const auto &morphTarget : subMeshMorph.targets) {
            const auto &   displacementsView = morphTarget.displacements[attributeIndex];
            Float32Array   displacements(mesh->getData().buffer(),
                                       mesh->getData().byteOffset() + displacementsView.offset,
                                       displacementsView.count);
            const uint32_t displacementsOffset = (nVertices * morphTargetIndex) * 4;
            for (uint32_t iVertex = 0; iVertex < nVertices; ++iVertex) {
                valueView[displacementsOffset + 4 * iVertex + 0] = displacements[3 * iVertex + 0];
                valueView[displacementsOffset + 4 * iVertex + 1] = displacements[3 * iVertex + 1];
                valueView[displacementsOffset + 4 * iVertex + 2] = displacements[3 * iVertex + 2];
            }

            ++morphTargetIndex;
        }

        vec4Tex->updatePixels();

        _attributes.emplace_back(GpuMorphAttribute{attributeName, vec4Tex});

        ++attributeIndex;
    }
}

SubMeshMorphRenderingInstance *GpuComputing::createInstance() {
    return new GpuComputingRenderingInstance(this, _gfxDevice);
}

void GpuComputing::destroy() {
    for (auto &attribute : _attributes) {
        attribute.morphTexture->destroy();
    }
}

} // namespace

class StdMorphRenderingInstance : public MorphRenderingInstance {
public:
    explicit StdMorphRenderingInstance(StdMorphRendering *owner) {
        _owner            = owner;
        size_t nSubMeshes = _owner->_mesh->getStruct().primitives.size();
        _subMeshInstances.resize(nSubMeshes, nullptr);

        for (size_t iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
            if (_owner->_subMeshRenderings[iSubMesh] != nullptr) {
                _subMeshInstances[iSubMesh] = _owner->_subMeshRenderings[iSubMesh]->createInstance();
            }
        }
    }

    ~StdMorphRenderingInstance() override = default;

    void setWeights(index_t subMeshIndex, const MeshWeightsType &weights) override {
        if (_subMeshInstances[subMeshIndex]) {
            _subMeshInstances[subMeshIndex]->setWeights(weights);
        }
    }

    void adaptPipelineState(index_t subMeshIndex, gfx::DescriptorSet *descriptorSet) override {
        if (_subMeshInstances[subMeshIndex]) {
            _subMeshInstances[subMeshIndex]->adaptPipelineState(descriptorSet);
        }
    }

    std::vector<scene::IMacroPatch> requiredPatches(index_t subMeshIndex) override {
        CC_ASSERT(_owner->_mesh->getStruct().morph.has_value());
        const auto &subMeshMorphOpt          = _owner->_mesh->getStruct().morph.value().subMeshMorphs[subMeshIndex];
        auto *      subMeshRenderingInstance = _subMeshInstances[subMeshIndex].get();
        if (subMeshRenderingInstance == nullptr || !subMeshMorphOpt.has_value()) {
            return {};
        }
        const auto &subMeshMorph = subMeshMorphOpt.value();

        std::vector<scene::IMacroPatch> patches{
            {"CC_USE_MORPH", true},
            {"CC_MORPH_TARGET_COUNT", static_cast<int32_t>(subMeshMorph.targets.size())}};

        auto posIter = std::find(subMeshMorph.attributes.begin(), subMeshMorph.attributes.end(), gfx::ATTR_NAME_POSITION);
        if (posIter != subMeshMorph.attributes.end()) {
            patches.emplace_back(scene::IMacroPatch{
                "CC_MORPH_TARGET_HAS_POSITION",
                true,
            });
        }

        auto normalIter = std::find(subMeshMorph.attributes.begin(), subMeshMorph.attributes.end(), gfx::ATTR_NAME_NORMAL);
        if (normalIter != subMeshMorph.attributes.end()) {
            patches.emplace_back(scene::IMacroPatch{
                "CC_MORPH_TARGET_HAS_NORMAL",
                true,
            });
        }

        auto tangentIter = std::find(subMeshMorph.attributes.begin(), subMeshMorph.attributes.end(), gfx::ATTR_NAME_TANGENT);
        if (tangentIter != subMeshMorph.attributes.end()) {
            patches.emplace_back(scene::IMacroPatch{
                "CC_MORPH_TARGET_HAS_TANGENT",
                true,
            });
        }

        auto renderingInstancePatches = subMeshRenderingInstance->requiredPatches();
        for (auto &renderingInstancePatch : renderingInstancePatches) {
            patches.emplace_back(renderingInstancePatch);
        }

        return patches;
    }

    void destroy() override {
        for (auto &subMeshInstance : _subMeshInstances) {
            if (subMeshInstance != nullptr) {
                subMeshInstance->destroy();
            }
        }
    }

private:
    IntrusivePtr<StdMorphRendering>                          _owner;
    std::vector<IntrusivePtr<SubMeshMorphRenderingInstance>> _subMeshInstances;
};

StdMorphRendering::StdMorphRendering(Mesh *mesh, gfx::Device *gfxDevice) {
    _mesh                  = mesh;
    const auto &structInfo = _mesh->getStruct();
    if (!structInfo.morph.has_value()) {
        return;
    }

    const size_t nSubMeshes = structInfo.primitives.size();
    _subMeshRenderings.resize(nSubMeshes, nullptr);
    const auto &morph = structInfo.morph.value();
    for (size_t iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
        const auto &subMeshMorphHolder = morph.subMeshMorphs[iSubMesh];
        if (!subMeshMorphHolder.has_value()) {
            continue;
        }

        const auto &subMeshMorph = subMeshMorphHolder.value();

        if (PREFER_CPU_COMPUTING || subMeshMorph.targets.size() > pipeline::UBOMorph::MAX_MORPH_TARGET_COUNT) {
            _subMeshRenderings[iSubMesh] = new CpuComputing(
                _mesh,
                static_cast<uint32_t>(iSubMesh),
                &morph,
                gfxDevice);
        } else {
            _subMeshRenderings[iSubMesh] = new GpuComputing(
                _mesh,
                static_cast<uint32_t>(iSubMesh),
                &morph,
                gfxDevice);
        }
    }
}

StdMorphRendering::~StdMorphRendering() = default;

MorphRenderingInstance *StdMorphRendering::createInstance() {
    auto *ret = new StdMorphRenderingInstance(this);
    return ret;
}

} // namespace cc
