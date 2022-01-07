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
#include "3d/models/BakedSkinningModel.h"
#include "3d/assets/Mesh.h"
//#include "3d/skeletal-animation/DataPoolManager.h"
#include "core/Root.h"
#include "scene/Model.h"
#include "scene/SubModel.h"

namespace {
const cc::gfx::SamplerInfo JOINT_TEXTURE_SAMPLER_INFO{
    cc::gfx::Filter::POINT,
    cc::gfx::Filter::POINT,
    cc::gfx::Filter::NONE,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
};

std::vector<cc::scene::IMacroPatch> myPatches{
    {"CC_USE_SKINNING", true},
    {"CC_USE_BAKED_ANIMATION", true}};

const std::string INST_JOINT_ANIM_INFO = "a_jointAnimInfo";
} // namespace
namespace cc {

BakedSkinningModel::BakedSkinningModel()
: Super()
//, _dataPoolManager(Root::getInstance()->getDataPoolManager())
{
    _type = Model::Type::BAKED_SKINNING;
    _jointMedium.jointTextureInfo.reset(4);
    // JSB uses _dataPoolManager in JS and the data is synchronized by syncDataForJS & syncAnimInfoForJS
    //    _jointMedium.animInfo = _dataPoolManager->jointAnimationInfo->getData();
}

void BakedSkinningModel::destroy() {
    // CC_SAFE_DELETE(uploadedAnim);
    _jointMedium.boundsInfo.clear();

    if (_jointMedium.buffer != nullptr) {
        CC_SAFE_DESTROY(_jointMedium.buffer);
    }
    applyJointTexture(cc::nullopt);
    Super::destroy();
}

void BakedSkinningModel::bindSkeleton(Skeleton *skeleton, Node *skinningRoot, Mesh *mesh) {
    _skeleton = skeleton;
    _mesh     = mesh;
    if (skeleton == nullptr || skinningRoot == nullptr || mesh == nullptr) return;
    setTransform(skinningRoot);

    // JSB uses _dataPoolManager in JS and the data is synchronized by syncDataForJS & syncAnimInfoForJS
    //    _jointMedium.animInfo = _dataPoolManager->jointAnimationInfo->getData(skinningRoot->getUuid());

    if (_jointMedium.buffer == nullptr) {
        _jointMedium.buffer = _device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            pipeline::UBOSkinning::SIZE,
            pipeline::UBOSkinning::SIZE,
        });
    }
}

void BakedSkinningModel::updateTransform(uint32_t stamp) {
    Super::updateTransform(stamp);
    if (!_isUploadedAnim) {
        return;
    }
    IAnimInfo &     animInfo  = _jointMedium.animInfo;
    geometry::AABB *skelBound = nullptr;
    const float *   curFrame  = animInfo.curFrame;
    //    float curFrame = info.data[0];
    auto index = static_cast<index_t>(std::roundf(*curFrame));
    if (!_jointMedium.boundsInfo.empty() && index < _jointMedium.boundsInfo.size()) {
        skelBound = &_jointMedium.boundsInfo[index].value();
    }

    if (_worldBounds && skelBound != nullptr) {
        Node *node = getTransform();
        skelBound->transform(node->getWorldMatrix(), _worldBounds);
    }
}

void BakedSkinningModel::updateUBOs(uint32_t stamp) {
    Super::updateUBOs(stamp);

    IAnimInfo &  info           = _jointMedium.animInfo;
    int          idx            = _instAnimInfoIdx;
    const float *curFrame       = info.curFrame;
    uint32_t     frameDataBytes = info.frameDataBytes;
    //    float curFrame = info.data[0];
    //    uint32_t curFrameDataBytes = info.data.byteLength();
    if (idx >= 0) {
        auto &views = getInstancedAttributeBlock()->views[idx];
        setTypedArrayValue(views, 0, *curFrame);
    } else if (*info.dirtyForJSB != 0) {
        info.buffer->update(curFrame, frameDataBytes);
        *info.dirtyForJSB = 0;
    }
}

void BakedSkinningModel::applyJointTexture(const cc::optional<IJointTextureHandle> &texture) {
    auto oldTex = _jointMedium.texture;
    if (oldTex.has_value() && texture.has_value() && (&oldTex.value() != &texture.value())) {
        //        _dataPoolManager->jointTexturePool->releaseHandle(oldTex.value());
    }
    _jointMedium.texture = texture;
    if (!texture.has_value()) {
        return;
    }
    auto *buffer           = _jointMedium.buffer.get();
    auto &jointTextureInfo = _jointMedium.jointTextureInfo;
    jointTextureInfo[0]    = static_cast<float>(texture->handle.texture->getWidth());
    jointTextureInfo[1]    = static_cast<float>(_skeleton->getJoints().size());
    jointTextureInfo[2]    = static_cast<float>(texture->pixelOffset) + 0.1F; // guard against floor() underflow
    jointTextureInfo[3]    = 1 / jointTextureInfo[0];
    updateInstancedJointTextureInfo();
    if (buffer != nullptr) {
        buffer->update(&jointTextureInfo[0], jointTextureInfo.byteLength());
    }
    auto *tex = texture->handle.texture;

    for (const auto &subModel : _subModels) {
        auto *descriptorSet = subModel->getDescriptorSet();
        descriptorSet->bindTexture(pipeline::JOINTTEXTURE::BINDING, tex);
    }
}

std::vector<scene::IMacroPatch> &BakedSkinningModel::getMacroPatches(index_t subModelIndex) {
    auto &patches = Super::getMacroPatches(subModelIndex);
    patches.reserve(patches.size() + myPatches.size());
    patches.insert(std::end(patches), std::begin(myPatches), std::end(myPatches));
    return patches;
}

void BakedSkinningModel::updateLocalDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet) {
    Super::updateLocalDescriptors(subModelIndex, descriptorSet);
    gfx::Buffer *    buffer   = _jointMedium.buffer;
    auto &           texture  = _jointMedium.texture;
    const IAnimInfo &animInfo = _jointMedium.animInfo;
    descriptorSet->bindBuffer(pipeline::UBOSkinningTexture::BINDING, buffer);
    descriptorSet->bindBuffer(pipeline::UBOSkinningAnimation::BINDING, animInfo.buffer);
    if (texture.has_value()) {
        auto *sampler = _device->getSampler(JOINT_TEXTURE_SAMPLER_INFO);
        descriptorSet->bindTexture(pipeline::JOINTTEXTURE::BINDING, texture->handle.texture);
        descriptorSet->bindSampler(pipeline::JOINTTEXTURE::BINDING, sampler);
    }
}

void BakedSkinningModel::updateInstancedAttributes(const std::vector<gfx::Attribute> &attributes, scene::Pass *pass) {
    Super::updateInstancedAttributes(attributes, pass);
    _instAnimInfoIdx = getInstancedAttributeIndex(INST_JOINT_ANIM_INFO);
    updateInstancedJointTextureInfo();
}

void BakedSkinningModel::updateInstancedJointTextureInfo() {
    const auto &     jointTextureInfo = _jointMedium.jointTextureInfo;
    const IAnimInfo &animInfo         = _jointMedium.animInfo;
    index_t          idx              = _instAnimInfoIdx;
    if (idx >= 0) {
        auto &view = getInstancedAttributeBlock()->views[idx];
        setTypedArrayValue(view, 0, *animInfo.curFrame); //NOTE: curFrame is only used in JSB.
        setTypedArrayValue(view, 1, jointTextureInfo[1]);
        setTypedArrayValue(view, 2, jointTextureInfo[2]);
    }
}

void BakedSkinningModel::syncAnimInfoForJS(gfx::Buffer *buffer, const Float32Array &data, Uint8Array &dirty) {
    _jointMedium.animInfo.buffer         = buffer;
    _jointMedium.animInfo.curFrame       = &data[0];
    _jointMedium.animInfo.frameDataBytes = data.byteLength();
    _jointMedium.animInfo.dirtyForJSB    = &dirty[0];
}

void BakedSkinningModel::syncDataForJS(const std::vector<cc::optional<geometry::AABB>> &boundsInfo,
                                       const cc::optional<geometry::AABB> &             modelBound,
                                       float                                            jointTextureInfo0,
                                       float                                            jointTextureInfo1,
                                       float                                            jointTextureInfo2,
                                       float                                            jointTextureInfo3,
                                       gfx::Texture *                                   tex,
                                       const Float32Array &                             animInfoData) {
    _jointMedium.boundsInfo = boundsInfo;

    if (modelBound.has_value()) {
        const geometry::AABB &modelBounldValue = modelBound.value();
        _modelBounds->set(modelBounldValue.center, modelBounldValue.halfExtents);
    } else {
        _modelBounds = nullptr;
    }

    _jointMedium.jointTextureInfo[0] = jointTextureInfo0;
    _jointMedium.jointTextureInfo[1] = jointTextureInfo1;
    _jointMedium.jointTextureInfo[2] = jointTextureInfo2;
    _jointMedium.jointTextureInfo[3] = jointTextureInfo3;

    _jointMedium.animInfo.curFrame       = &animInfoData[0];
    _jointMedium.animInfo.frameDataBytes = animInfoData.byteLength();
    IJointTextureHandle textureInfo;
    textureInfo.handle.texture = tex;
    _jointMedium.texture       = std::move(textureInfo);

    updateInstancedJointTextureInfo();

    auto *buffer = _jointMedium.buffer.get();
    if (buffer != nullptr) {
        buffer->update(&_jointMedium.jointTextureInfo[0], _jointMedium.jointTextureInfo.byteLength());
    }

    for (const auto &subModel : _subModels) {
        auto *descriptorSet = subModel->getDescriptorSet();
        descriptorSet->bindTexture(pipeline::JOINTTEXTURE::BINDING, tex);
    }
}

} // namespace cc
