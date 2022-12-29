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

#include "scene/SubModel.h"
#include "core/Root.h"
#include "core/platform/Debug.h"
#include "pipeline/Define.h"
#include "pipeline/InstancedBuffer.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "scene/Model.h"
#include "scene/Pass.h"
#include "scene/Shadow.h"

namespace cc {
namespace scene {

const ccstd::string INST_MAT_WORLD = "a_matWorld0";
const ccstd::string INST_SH = "a_sh_linear_const_r";

cc::TypedArray getTypedArrayConstructor(const cc::gfx::FormatInfo &info, cc::ArrayBuffer *buffer, uint32_t byteOffset, uint32_t length) {
    const uint32_t stride = info.size / info.count;
    switch (info.type) {
        case cc::gfx::FormatType::UNORM:
        case cc::gfx::FormatType::UINT: {
            switch (stride) {
                case 1: return cc::Uint8Array(buffer, byteOffset, length);
                case 2: return cc::Uint16Array(buffer, byteOffset, length);
                case 4: return cc::Uint32Array(buffer, byteOffset, length);
                default:
                    break;
            }
            break;
        }
        case cc::gfx::FormatType::SNORM:
        case cc::gfx::FormatType::INT: {
            switch (stride) {
                case 1: return cc::Int8Array(buffer, byteOffset, length);
                case 2: return cc::Int16Array(buffer, byteOffset, length);
                case 4: return cc::Int32Array(buffer, byteOffset, length);
                default:
                    break;
            }
            break;
        }
        case cc::gfx::FormatType::FLOAT: {
            return cc::Float32Array(buffer, byteOffset, length);
        }
        default:
            break;
    }
    return cc::Float32Array(buffer, byteOffset, length);
}

SubModel::SubModel() {
    _id = generateId();
}

const static uint32_t MAX_PASS_COUNT = 8;

void SubModel::update() {
    const auto &passes = *_passes;
    for (Pass *pass : passes) {
        pass->update();
    }
    _descriptorSet->update();

    if (_worldBoundDescriptorSet) {
        _worldBoundDescriptorSet->update();
    }
}

void SubModel::setPasses(const std::shared_ptr<ccstd::vector<IntrusivePtr<Pass>>> &pPasses) {
    if (!pPasses || pPasses->size() > MAX_PASS_COUNT) {
        debug::errorID(12004, MAX_PASS_COUNT);
        return;
    }

    _passes = pPasses;
    flushPassInfo();

    const auto &passes = *_passes;
    if (passes[0]->getBatchingScheme() == BatchingSchemes::VB_MERGING) {
        _subMesh->genFlatBuffers();
    }
    // DS layout might change too
    if (_descriptorSet) {
        _descriptorSet->destroy();
        gfx::DescriptorSetInfo dsInfo;
        dsInfo.layout = passes[0]->getLocalSetLayout();
        _descriptorSet = _device->createDescriptorSet(dsInfo);
    }
}

gfx::Shader *SubModel::getShader(uint32_t index) const {
    if (index >= _shaders.size()) {
        return nullptr;
    }

    return _shaders[index];
}

Pass *SubModel::getPass(uint32_t index) const {
    auto &passes = *_passes;
    if (index >= passes.size()) {
        return nullptr;
    }

    return passes[index];
}

void SubModel::initialize(RenderingSubMesh *subMesh, const std::shared_ptr<ccstd::vector<IntrusivePtr<Pass>>> &pPasses, const ccstd::vector<IMacroPatch> &patches) {
    _device = Root::getInstance()->getDevice();
    CC_ASSERT(!pPasses->empty());
    gfx::DescriptorSetInfo dsInfo;
    dsInfo.layout = (*pPasses)[0]->getLocalSetLayout();
    _inputAssembler = _device->createInputAssembler(subMesh->getIaInfo());
    _descriptorSet = _device->createDescriptorSet(dsInfo);

    const auto *pipeline = Root::getInstance()->getPipeline();
    const auto *occlusionPass = pipeline->getPipelineSceneData()->getOcclusionQueryPass();
    if (occlusionPass) {
        cc::gfx::DescriptorSetInfo occlusionDSInfo;
        occlusionDSInfo.layout = occlusionPass->getLocalSetLayout();
        _worldBoundDescriptorSet = _device->createDescriptorSet(occlusionDSInfo);
    }

    _subMesh = subMesh;
    _patches = patches;
    _passes = pPasses;

    flushPassInfo();

    const auto &passes = *_passes;
    if (passes[0]->getBatchingScheme() == BatchingSchemes::VB_MERGING) {
        subMesh->genFlatBuffers();
    }
    _priority = pipeline::RenderPriority::DEFAULT;

    // initialize resources for reflection material
    if (passes[0]->getPhase() == pipeline::getPhaseID("reflection")) {
        const auto *mainWindow = Root::getInstance()->getMainWindow();
        uint32_t texWidth = mainWindow->getWidth();
        uint32_t texHeight = mainWindow->getHeight();
        const uint32_t minSize = 512;
        if (texHeight < texWidth) {
            texWidth = minSize * texWidth / texHeight;
            texHeight = minSize;
        } else {
            texWidth = minSize;
            texHeight = minSize * texHeight / texWidth;
        }
        _reflectionTex = _device->createTexture(gfx::TextureInfo{
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::TRANSFER_SRC | gfx::TextureUsageBit::SAMPLED,
            gfx::Format::RGBA8,
            texWidth,
            texHeight,
        });
        _descriptorSet->bindTexture(pipeline::REFLECTIONTEXTURE::BINDING, _reflectionTex);

        const gfx::SamplerInfo samplerInfo{
            gfx::Filter::LINEAR,
            gfx::Filter::LINEAR,
            gfx::Filter::NONE,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
        };
        _reflectionSampler = _device->getSampler(samplerInfo);
        _descriptorSet->bindSampler(pipeline::REFLECTIONTEXTURE::BINDING, _reflectionSampler);
        _descriptorSet->bindTexture(pipeline::REFLECTIONSTORAGE::BINDING, _reflectionTex);
    }
}

// TODO():
// This is a temporary solution
// It should not be written in a fixed way, or modified by the user
void SubModel::initPlanarShadowShader() {
    const auto *pipeline = Root::getInstance()->getPipeline();
    Shadows *shadowInfo = pipeline->getPipelineSceneData()->getShadows();
    if (shadowInfo != nullptr) {
        _planarShader = shadowInfo->getPlanarShader(_patches);
    } else {
        _planarShader = nullptr;
    }
}

// TODO():
// This is a temporary solution
// It should not be written in a fixed way, or modified by the user
void SubModel::initPlanarShadowInstanceShader() {
    const auto *pipeline = Root::getInstance()->getPipeline();
    Shadows *shadowInfo = pipeline->getPipelineSceneData()->getShadows();
    if (shadowInfo != nullptr) {
        _planarInstanceShader = shadowInfo->getPlanarInstanceShader(_patches);
    } else {
        _planarInstanceShader = nullptr;
    }
}

void SubModel::destroy() {
    CC_SAFE_DESTROY_NULL(_descriptorSet);
    CC_SAFE_DESTROY_NULL(_inputAssembler);
    CC_SAFE_DESTROY_NULL(_worldBoundDescriptorSet);

    _priority = pipeline::RenderPriority::DEFAULT;

    _patches.clear();
    _subMesh = nullptr;
    _passes.reset();
    _shaders.clear();

    CC_SAFE_DESTROY_NULL(_reflectionTex);
    _reflectionSampler = nullptr;
}

void SubModel::onPipelineStateChanged() {
    const auto &passes = *_passes;
    if (passes.empty()) return;

    for (Pass *pass : passes) {
        pass->beginChangeStatesSilently();
        pass->tryCompile(); // force update shaders
        pass->endChangeStatesSilently();
    }
    flushPassInfo();
}

void SubModel::onMacroPatchesStateChanged(const ccstd::vector<IMacroPatch> &patches) {
    _patches = patches;
    const auto &passes = *_passes;
    if (passes.empty()) return;
    for (Pass *pass : passes) {
        pass->beginChangeStatesSilently();
        pass->tryCompile(); // force update shaders
        pass->endChangeStatesSilently();
    }
    flushPassInfo();
}

void SubModel::onGeometryChanged() {
    if (!_subMesh) {
        return;
    }

    // update draw info
    const auto &drawInfo = _subMesh->getDrawInfo();
    if (drawInfo.has_value()) {
        _inputAssembler->setDrawInfo(drawInfo.value());
    }
}

void SubModel::updateInstancedAttributes(const ccstd::vector<gfx::Attribute> &attributes) {
    auto *pass = getPass(0);
    _instancedWorldMatrixIndex = -1;
    _instancedSHIndex = -1;
    if (!pass->getDevice()->hasFeature(gfx::Feature::INSTANCED_ARRAYS)) return;
    // free old data

    uint32_t size = 0;
    for (const gfx::Attribute &attribute : attributes) {
        if (!attribute.isInstanced) continue;
        size += gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)].size;
    }
    auto &attrs = _instancedAttributeBlock;
    attrs.buffer = Uint8Array(size);
    attrs.views.clear();
    attrs.attributes.clear();
    attrs.views.reserve(attributes.size());
    attrs.attributes.reserve(attributes.size());

    uint32_t offset = 0;

    for (const gfx::Attribute &attribute : attributes) {
        if (!attribute.isInstanced) continue;
        gfx::Attribute attr;
        attr.format = attribute.format;
        attr.name = attribute.name;
        attr.isNormalized = attribute.isNormalized;
        attr.location = attribute.location;
        attrs.attributes.emplace_back(attr);
        const auto &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)];
        auto *buffer = attrs.buffer.buffer();
        auto typeViewArray = getTypedArrayConstructor(info, buffer, offset, info.count);
        attrs.views.emplace_back(typeViewArray);
        offset += info.size;
    }
    if (pass->getBatchingScheme() == BatchingSchemes::INSTANCING) {
        pass->getInstancedBuffer()->destroy();
    }
    _instancedWorldMatrixIndex = getInstancedAttributeIndex(INST_MAT_WORLD);
    _instancedSHIndex = getInstancedAttributeIndex(INST_SH);
}

void SubModel::updateInstancedWorldMatrix(const Mat4 &mat, int32_t idx) {
    auto &attrs = _instancedAttributeBlock.views;
    auto &v1 = ccstd::get<Float32Array>(attrs[idx]);
    auto &v2 = ccstd::get<Float32Array>(attrs[idx + 1]);
    auto &v3 = ccstd::get<Float32Array>(attrs[idx + +2]);
    const uint32_t copyBytes = sizeof(float) * 3;
    auto *buffer = const_cast<uint8_t *>(v1.buffer()->getData());

    uint8_t *dst = buffer + v1.byteOffset();
    memcpy(dst, mat.m, copyBytes);
    v1[3] = mat.m[12];

    dst = buffer + v2.byteOffset();
    memcpy(dst, mat.m + 4, copyBytes);
    v2[3] = mat.m[13];

    dst = buffer + v3.byteOffset();
    memcpy(dst, mat.m + 8, copyBytes);
    v3[3] = mat.m[14];
}

void SubModel::updateInstancedSH(const Float32Array &data, int32_t idx) {
    auto &attrs = _instancedAttributeBlock.views;
    const auto count = (pipeline::UBOSH::SH_QUADRATIC_R_OFFSET - pipeline::UBOSH::SH_LINEAR_CONST_R_OFFSET) / 4;
    auto offset = 0;

    for (auto i = idx; i < idx + count; i++) {
        auto &attr = ccstd::get<Float32Array>(attrs[i]);
        for (auto k = 0; k < 4; k++) {
            attr[k] = data[offset++];
        }
    }
}

void SubModel::flushPassInfo() {
    const auto &passes = *_passes;
    if (passes.empty()) return;
    if (!_shaders.empty()) {
        _shaders.clear();
    }
    _shaders.resize(passes.size());
    for (size_t i = 0; i < passes.size(); ++i) {
        _shaders[i] = passes[i]->getShaderVariant(_patches);
    }
}

void SubModel::setSubMesh(RenderingSubMesh *subMesh) {
    const auto &passes = *_passes;
    _inputAssembler->destroy();
    _inputAssembler->initialize(subMesh->getIaInfo());
    if (passes[0]->getBatchingScheme() == BatchingSchemes::VB_MERGING) {
        subMesh->genFlatBuffers();
    }
    _subMesh = subMesh;
}

void SubModel::setInstancedAttribute(const ccstd::string &name, const float *value, uint32_t byteLength) {
    const auto &attributes = _instancedAttributeBlock.attributes;
    auto &views = _instancedAttributeBlock.views;
    for (size_t i = 0, len = attributes.size(); i < len; ++i) {
        const auto &attribute = attributes[i];
        if (attribute.name == name) {
            const auto &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)];
            switch (info.type) {
                case gfx::FormatType::NONE:
                case gfx::FormatType::UNORM:
                case gfx::FormatType::SNORM:
                case gfx::FormatType::UINT:
                case gfx::FormatType::INT: {
                    CC_ABORT();
                } break;
                case gfx::FormatType::FLOAT:
                case gfx::FormatType::UFLOAT: {
                    CC_ASSERT(ccstd::holds_alternative<Float32Array>(views[i]));
                    auto &view = ccstd::get<Float32Array>(views[i]);
                    auto *dstData = reinterpret_cast<float *>(view.buffer()->getData() + view.byteOffset());
                    CC_ASSERT(byteLength <= view.byteLength());
                    memcpy(dstData, value, byteLength);
                } break;
                default:
                    break;
            }
        }
    }
}

int32_t SubModel::getInstancedAttributeIndex(const ccstd::string &name) const {
    const auto &attributes = _instancedAttributeBlock.attributes;
    for (index_t i = 0; i < static_cast<index_t>(attributes.size()); ++i) {
        if (attributes[i].name == name) {
            return i;
        }
    }
    return CC_INVALID_INDEX;
}

} // namespace scene
} // namespace cc
