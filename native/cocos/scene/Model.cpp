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
#include <array>

// #include "core/Director.h"
#include "core/Root.h"
#include "core/TypedArray.h"
#include "core/assets/Material.h"
#include "core/event/EventTypesToJS.h"
#include "gfx-base/GFXTexture.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/InstancedBuffer.h"
#include "scene/Model.h"
#include "scene/Pass.h"
#include "scene/RenderScene.h"
#include "scene/SubModel.h"

namespace {
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

cc::Float32Array &vec4ToFloat32Array(const cc::Vec4 &v, cc::Float32Array &out, index_t ofs = 0) {
    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    out[ofs + 2] = v.z;
    out[ofs + 3] = v.w;
    return out;
}

cc::Float32Array &mat4ToFloat32Array(const cc::Mat4 &mat, cc::Float32Array &out, index_t ofs = 0) {
    memcpy(reinterpret_cast<float *>(const_cast<uint8_t *>(out.buffer()->getData())) + ofs, mat.m, 16 * sizeof(float));
    return out;
}

const cc::gfx::SamplerInfo LIGHTMAP_SAMPLER_HASH{
    cc::gfx::Filter::LINEAR,
    cc::gfx::Filter::LINEAR,
    cc::gfx::Filter::NONE,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
};

const cc::gfx::SamplerInfo LIGHTMAP_SAMPLER_WITH_MIP_HASH{
    cc::gfx::Filter::LINEAR,
    cc::gfx::Filter::LINEAR,
    cc::gfx::Filter::LINEAR,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
};

const std::vector<cc::scene::IMacroPatch> SHADOW_MAP_PATCHES{{"CC_ENABLE_DIR_SHADOW", true}, {"CC_RECEIVE_SHADOW", true}};
const std::string                         INST_MAT_WORLD = "a_matWorld0";
} // namespace

namespace cc {
namespace scene {

Model::Model() {
    _device = Root::getInstance()->getDevice();
}

Model::~Model() = default;

void Model::initialize() {
    if (_inited) return;
    _receiveShadow = true;
    _castShadow    = false;
    _enabled       = true;
    _visFlags      = Layers::Enum::NONE;
    _inited        = true;
    _localData.reset(pipeline::UBOLocal::COUNT);
}

void Model::destroy() {
    for (SubModel *subModel : _subModels) {
        CC_SAFE_DESTROY(subModel);
    }
    _subModels.clear();

    CC_SAFE_DESTROY_NULL(_localBuffer);
    CC_SAFE_DESTROY_NULL(_worldBoundBuffer);

    _worldBounds       = nullptr;
    _modelBounds       = nullptr;
    _inited            = false;
    _localDataUpdated  = true;
    _transform         = nullptr;
    _node              = nullptr;
    _isDynamicBatching = false;
}

void Model::uploadMat4AsVec4x3(const Mat4 &mat, Float32Array &v1, Float32Array &v2, Float32Array &v3) {
    uint32_t copyBytes = sizeof(float) * 3;
    auto *   buffer    = const_cast<uint8_t *>(v1.buffer()->getData());

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

void Model::updateTransform(uint32_t stamp) {
    if (isModelImplementedInJS()) {
        if (!_isCalledFromJS) {
            _eventProcessor.emit(EventTypesToJS::MODEL_UPDATE_TRANSFORM, stamp);
            _isCalledFromJS = false;
            return;
        }
    }

    Node *node = _transform;
    if (node->getChangedFlags() || node->getDirtyFlag()) {
        node->updateWorldTransform();
        _localDataUpdated = true;
        if (_modelBounds != nullptr && _modelBounds->isValid() && _worldBounds != nullptr) {
            _modelBounds->transform(node->getWorldMatrix(), _worldBounds);
        }
        if (_scene) {
            _scene->updateOctree(this);
        }
    }
}

void Model::updateWorldBound() {
    Node *node = _transform;
    if (node) {
        node->updateWorldTransform();
        _localDataUpdated = true;
        if (_modelBounds != nullptr && _modelBounds->isValid() && _worldBounds != nullptr) {
            _modelBounds->transform(node->getWorldMatrix(), _worldBounds);
        }
    }
}

void Model::updateWorldBoundsForJSSkinningModel(const Vec3 &min, const Vec3 &max) {
    Node *node = _transform;
    if (node) {
        if (_modelBounds != nullptr && _modelBounds->isValid() && _worldBounds != nullptr) {
            geometry::AABB::fromPoints(min, max, _modelBounds);
            _modelBounds->transform(node->getWorldMatrix(), _worldBounds);
        }
    }
}

void Model::updateWorldBoundsForJSBakedSkinningModel(geometry::AABB *aabb) {
    _worldBounds->center      = aabb->center;
    _worldBounds->halfExtents = aabb->halfExtents;
}

void Model::updateUBOs(uint32_t stamp) {
    if (isModelImplementedInJS()) {
        if (!_isCalledFromJS) {
            _eventProcessor.emit(EventTypesToJS::MODEL_UPDATE_UBO, stamp);
            _isCalledFromJS = false;
            return;
        }
    }

    for (SubModel *subModel : _subModels) {
        subModel->update();
    }
    _updateStamp = stamp;
    if (!_localDataUpdated) {
        return;
    }
    _localDataUpdated = false;
    getTransform()->updateWorldTransform();
    const auto &worldMatrix = getTransform()->getWorldMatrix();
    Mat4        mat4;
    int         idx = _instMatWorldIdx;
    if (idx >= 0) {
        std::vector<TypedArray> &attrs = getInstancedAttributeBlock()->views;
        uploadMat4AsVec4x3(worldMatrix, cc::get<Float32Array>(attrs[idx]), cc::get<Float32Array>(attrs[idx + 1]), cc::get<Float32Array>(attrs[idx + 2]));
    } else if (_localBuffer) {
        mat4ToFloat32Array(worldMatrix, _localData, pipeline::UBOLocal::MAT_WORLD_OFFSET);
        Mat4::inverseTranspose(worldMatrix, &mat4);

        mat4ToFloat32Array(mat4, _localData, pipeline::UBOLocal::MAT_WORLD_IT_OFFSET);
        _localBuffer->update(_localData.buffer()->getData());
        const bool enableOcclusionQuery = pipeline::RenderPipeline::getInstance()->isOcclusionQueryEnabled();
        if (enableOcclusionQuery) {
            updateWorldBoundUBOs();
        }
    }
}

void Model::updateWorldBoundUBOs() {
    if (_worldBoundBuffer) {
        std::array<float, pipeline::UBOWorldBound::COUNT> worldBoundBufferView;
        const Vec3 &                                      center      = _worldBounds ? _worldBounds->getCenter() : Vec3{0.0F, 0.0F, 0.0F};
        const Vec3 &                                      halfExtents = _worldBounds ? _worldBounds->getHalfExtents() : Vec3{1.0F, 1.0F, 1.0F};
        const Vec4                                        worldBoundCenter{center.x, center.y, center.z, 0.0F};
        const Vec4                                        worldBoundHalfExtents{halfExtents.x, halfExtents.y, halfExtents.z, 1.0F};
        memcpy(worldBoundBufferView.data() + pipeline::UBOWorldBound::WORLD_BOUND_CENTER, &worldBoundCenter.x, sizeof(Vec4));
        memcpy(worldBoundBufferView.data() + pipeline::UBOWorldBound::WORLD_BOUND_HALF_EXTENTS, &worldBoundHalfExtents.x, sizeof(Vec4));
        _worldBoundBuffer->update(worldBoundBufferView.data(), pipeline::UBOWorldBound::SIZE);
    }
}

void Model::createBoundingShape(const cc::optional<Vec3> &minPos, const cc::optional<Vec3> &maxPos) {
    if (!minPos.has_value() || !maxPos.has_value()) {
        return;
    }

    _modelBounds = geometry::AABB::fromPoints(minPos.value(), maxPos.value(), new geometry::AABB());
    _worldBounds = geometry::AABB::fromPoints(minPos.value(), maxPos.value(), new geometry::AABB());
}

SubModel *Model::createSubModel() {
    return new SubModel();
}

void Model::initSubModel(index_t idx, cc::RenderingSubMesh *subMeshData, Material *mat) {
    initialize();
    bool isNewSubModel = false;
    if (idx >= _subModels.size()) {
        _subModels.resize(idx + 1, nullptr);
    }

    if (_subModels[idx] == nullptr) {
        _subModels[idx] = createSubModel();
        isNewSubModel   = true;
    } else {
        CC_SAFE_DESTROY(_subModels[idx]);
    }
    _subModels[idx]->initialize(subMeshData, mat->getPasses(), getMacroPatches(idx));
    _subModels[idx]->initPlanarShadowShader();
    _subModels[idx]->initPlanarShadowInstanceShader();
    updateAttributesAndBinding(idx);
}

void Model::setSubModelMesh(index_t idx, cc::RenderingSubMesh *subMesh) const {
    if (idx < _subModels.size()) {
        _subModels[idx]->setSubMesh(subMesh);
    }
}

void Model::setSubModelMaterial(index_t idx, Material *mat) {
    if (idx < _subModels.size()) {
        _subModels[idx]->setPasses(mat->getPasses());
        updateAttributesAndBinding(idx);
    }
}

void Model::onGlobalPipelineStateChanged() const {
    for (SubModel *subModel : _subModels) {
        subModel->onPipelineStateChanged();
    }
}

void Model::onMacroPatchesStateChanged() {
    for (index_t i = 0; i < _subModels.size(); ++i) {
        _subModels[i]->onMacroPatchesStateChanged(getMacroPatches(i));
    }
}

void Model::updateLightingmap(Texture2D *texture, const Vec4 &uvParam) {
    vec4ToFloat32Array(uvParam, _localData, pipeline::UBOLocal::LIGHTINGMAP_UVPARAM); //TODO(xwx): toArray not implemented in Math
    _localDataUpdated = true;
    _lightmap         = texture;
    _lightmapUVParam  = uvParam;

    if (texture == nullptr) {
        texture = BuiltinResMgr::getInstance()->get<Texture2D>(std::string("empty-texture"));
    }
    gfx::Texture *gfxTexture = texture->getGFXTexture();
    if (gfxTexture) {
        auto *sampler = _device->getSampler(texture->getMipmaps().size() > 1 ? LIGHTMAP_SAMPLER_WITH_MIP_HASH : LIGHTMAP_SAMPLER_HASH);
        for (SubModel *subModel : _subModels) {
            gfx::DescriptorSet *descriptorSet = subModel->getDescriptorSet();
            // // TODO(Yun Hsiao Wu): should manage lightmap macro switches automatically
            // // USE_LIGHTMAP -> CC_USE_LIGHTMAP
            descriptorSet->bindTexture(pipeline::LIGHTMAPTEXTURE::BINDING, gfxTexture);
            descriptorSet->bindSampler(pipeline::LIGHTMAPTEXTURE::BINDING, sampler);
            descriptorSet->update();
        }
    }
}

std::vector<IMacroPatch> &Model::getMacroPatches(index_t subModelIndex) {
    if (isModelImplementedInJS()) {
        if (!_isCalledFromJS) {
            _eventProcessor.emit(EventTypesToJS::MODEL_GET_MACRO_PATCHES, subModelIndex, &_macroPatches);
            _isCalledFromJS = false;
            return _macroPatches;
        }
    }

    if (_receiveShadow) {
        for (const auto &patch : SHADOW_MAP_PATCHES) {
            _macroPatches.emplace_back(patch);
        }
    } else {
        _macroPatches.clear();
    }

    return _macroPatches;
}

void Model::updateAttributesAndBinding(index_t subModelIndex) {
    if (subModelIndex >= _subModels.size()) return;
    SubModel *subModel = _subModels[subModelIndex];
    initLocalDescriptors(subModelIndex);
    updateLocalDescriptors(subModelIndex, subModel->getDescriptorSet());

    initWorldBoundDescriptors(subModelIndex);
    updateWorldBoundDescriptors(subModelIndex, subModel->getWorldBoundDescriptorSet());

    gfx::Shader *shader = subModel->getPasses()[0]->getShaderVariant(subModel->getPatches());
    updateInstancedAttributes(shader->getAttributes(), subModel->getPasses()[0]);
}

index_t Model::getInstancedAttributeIndex(const std::string &name) const {
    const auto &attributes = _instanceAttributeBlock.attributes;
    for (index_t i = 0; i < attributes.size(); ++i) {
        if (attributes[i].name == name) {
            return i;
        }
    }
    return CC_INVALID_INDEX;
}

void Model::updateInstancedAttributes(const std::vector<gfx::Attribute> &attributes, Pass *pass) {
    if (isModelImplementedInJS()) {
        if (!_isCalledFromJS) {
            _eventProcessor.emit(EventTypesToJS::MODEL_UPDATE_INSTANCED_ATTRIBUTES, attributes, pass);
            _isCalledFromJS = false;
            return;
        }
    }

    if (!pass->getDevice()->hasFeature(gfx::Feature::INSTANCED_ARRAYS)) return;
    // free old data

    uint32_t size = 0;
    for (const gfx::Attribute &attribute : attributes) {
        if (!attribute.isInstanced) continue;
        size += gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)].size;
    }
    auto &attrs  = _instanceAttributeBlock;
    attrs.buffer = Uint8Array(size);
    attrs.views.clear();
    attrs.attributes.clear();
    uint32_t offset = 0;

    for (const gfx::Attribute &attribute : attributes) {
        if (!attribute.isInstanced) continue;
        gfx::Attribute attr;
        attr.format       = attribute.format;
        attr.name         = attribute.name;
        attr.isNormalized = attribute.isNormalized;
        attr.location     = attribute.location;
        attrs.attributes.emplace_back(attr);
        const auto &info          = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)];
        auto *      buffer        = attrs.buffer.buffer();
        auto        typeViewArray = getTypedArrayConstructor(info, buffer, offset, info.count);
        attrs.views.emplace_back(typeViewArray);
        offset += info.size;
    }
    if (pass->getBatchingScheme() == BatchingSchemes::INSTANCING) {
        pass->getInstancedBuffer()->destroy();
    }
    setInstMatWorldIdx(getInstancedAttributeIndex(INST_MAT_WORLD));
    _localDataUpdated = true;
}

void Model::initLocalDescriptors(index_t /*subModelIndex*/) {
    if (!_localBuffer) {
        _localBuffer = _device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            pipeline::UBOLocal::SIZE,
            pipeline::UBOLocal::SIZE,
        });
    }
}

void Model::initWorldBoundDescriptors(index_t /*subModelIndex*/) {
    if (!_worldBoundBuffer) {
        _worldBoundBuffer = _device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            pipeline::UBOLocal::SIZE,
            pipeline::UBOLocal::SIZE,
        });
    }
}

void Model::updateLocalDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet) {
    if (isModelImplementedInJS()) {
        if (!_isCalledFromJS) {
            _eventProcessor.emit(EventTypesToJS::MODEL_UPDATE_LOCAL_DESCRIPTORS, subModelIndex, descriptorSet);
            _isCalledFromJS = false;
            return;
        }
    }

    if (_localBuffer) {
        descriptorSet->bindBuffer(pipeline::UBOLocal::BINDING, _localBuffer);
    }
}

void Model::updateWorldBoundDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet) {
    if (isModelImplementedInJS()) {
        if (!_isCalledFromJS) {
            _eventProcessor.emit(EventTypesToJS::MODEL_UPDATE_LOCAL_DESCRIPTORS, subModelIndex, descriptorSet);
            _isCalledFromJS = false;
            return;
        }
    }

    if (_worldBoundBuffer) {
        descriptorSet->bindBuffer(pipeline::UBOLocal::BINDING, _worldBoundBuffer);
    }
}
void Model::setInstancedAttributesViewData(index_t viewIdx, index_t arrIdx, float value) {
    cc::get<Float32Array>(_instanceAttributeBlock.views[viewIdx])[arrIdx] = value;
}

} // namespace scene
} // namespace cc
