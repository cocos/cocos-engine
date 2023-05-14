#include "cocos-spine/spine-skeleton-instance.h"
#include "core/platform/Debug.h"
#include "platform/FileUtils.h"
#include "spine/spine.h"
#include "spine-creator-support/spine-cocos2dx.h"
#include "spine-creator-support/AttachmentVertices.h"
#include "editor-support/middleware-adapter.h"


namespace spine {

SpineSkeletonInstance::SpineSkeletonInstance() {
    _model = new SpineSkeletonModelData();
}

SpineSkeletonInstance::~SpineSkeletonInstance() {
    CC_SAFE_DELETE(_clipper);
    CC_SAFE_DELETE(_animState);
    CC_SAFE_DELETE(_animStateData);
    CC_SAFE_DELETE(_skelData);
    CC_SAFE_DELETE(_skeleton);
    CC_SAFE_DELETE(_model);
}

void SpineSkeletonInstance::initSkeletonData(ccstd::string &jsonStr, ccstd::string &atlasText) {
    spine::Atlas *atlas = new spine::Atlas(atlasText.c_str(), (int)atlasText.size(), "", nullptr, false);
    spine::AttachmentLoader *attachmentLoader = new spine::Cocos2dAtlasAttachmentLoader(atlas);
    spine::SkeletonJson json(attachmentLoader);
    json.setScale(1.0F);
    _skelData = json.readSkeletonData(jsonStr.c_str());

    _skeleton = new spine::Skeleton(_skelData);

    _animStateData = new spine::AnimationStateData(_skelData);

    _animState = new spine::AnimationState(_animStateData);

    _clipper = new spine::SkeletonClipping();

    _skeleton->setToSetupPose();
    _skeleton->updateWorldTransform();
}

void SpineSkeletonInstance::initSkeletonDataBinary(ccstd::string &dataPath, ccstd::string &atlasText) {
    spine::Atlas *atlas = new spine::Atlas(atlasText.c_str(), (int)atlasText.size(), "", nullptr, false);
    spine::AttachmentLoader *attachmentLoader = new spine::Cocos2dAtlasAttachmentLoader(atlas);

    auto fileUtils = cc::FileUtils::getInstance();
    if (!fileUtils->isFileExist(dataPath)) {
        CC_LOG_ERROR("file: %s not exist!!!", dataPath.c_str());
        return;
    }
    cc::Data dataBuffer;
    const auto fullpath = fileUtils->fullPathForFilename(dataPath);
    fileUtils->getContents(fullpath, &dataBuffer);

    spine::SkeletonBinary binary(attachmentLoader);
    binary.setScale(1.0F);
    _skelData = binary.readSkeletonData(dataBuffer.getBytes(), (int)dataBuffer.getSize());

    _skeleton = new spine::Skeleton(_skelData);

    _animStateData = new spine::AnimationStateData(_skelData);

    _animState = new spine::AnimationState(_animStateData);

    _clipper = new spine::SkeletonClipping();

    _skeleton->setToSetupPose();
    _skeleton->updateWorldTransform();
}

void SpineSkeletonInstance::setSkin(ccstd::string &name) {
    if (!_skeleton) return;
    _skeleton->setSkin(name.c_str());
    _skeleton->setSlotsToSetupPose();
}

bool SpineSkeletonInstance::setAnimation (uint32_t trackIndex, ccstd::string &name, bool loop) {
    if (!_skeleton) return false;
    spine::Animation *animation = _skeleton->getData()->findAnimation(name.c_str());
    if (!animation) {
        CC_LOG_DEBUG("Spine: Animation not found:!!!");
        return false;
    }
    auto *trackEntry = _animState->setAnimation(0, animation, loop);
    _animState->apply(*_skeleton);
    return true;
}

void SpineSkeletonInstance::updateAnimation(float dltTime) {
    if (!_skeleton) return;
    _skeleton->update(dltTime);
    _animState->update(dltTime);
    _animState->apply(*_skeleton);
    _skeleton->updateWorldTransform();
}

void SpineSkeletonInstance::setTimeScale(float scale) {
    if (_animState) {
        _animState->setTimeScale(scale);
    }
}

void SpineSkeletonInstance::setDefaultScale(float scale) {
    _userData.scale = scale;
    if (scale - 1.0 > 0.01F || scale - 1.0 < -0.01F) {
        _userData.doScale = true;
    } else {
        _userData.doScale = false;
    }
}

void SpineSkeletonInstance::clearTrack(uint32_t trackIndex) {
    if (_animState) {
        _animState->clearTrack(trackIndex);
    }
}

void SpineSkeletonInstance::clearTracks() {
    if (_animState) {
        _animState->clearTracks();
    }
}

void SpineSkeletonInstance::setToSetupPose() {
    if (_skeleton) {
        _skeleton->setToSetupPose();
    }
}

void SpineSkeletonInstance::setMix(ccstd::string &fromAnimation, ccstd::string &toAnimation, float duration) {
    if (_animStateData) {
        _animStateData->setMix(fromAnimation.c_str(), toAnimation.c_str(), duration);
    }
}

void SpineSkeletonInstance::setColor(float r, float g, float b, float a) {
    _userData.color.r = r;
    _userData.color.g = g;
    _userData.color.b = b;
    _userData.color.a = a;
}

void SpineSkeletonInstance::setSlotsToSetupPose() {
    if (_skeleton) {
        _skeleton->setSlotsToSetupPose();
    }
}

void SpineSkeletonInstance::setBonesToSetupPose() {
    if (_skeleton) {
        _skeleton->setBonesToSetupPose();
    }
}

void SpineSkeletonInstance::setAttachment(ccstd::string &slotName, ccstd::string &attachmentName) {
    if (_skeleton) {
        _skeleton->setAttachment(slotName.c_str(), attachmentName.c_str());
    }
}

SpineSkeletonModelData* SpineSkeletonInstance::updateRenderData() {
    ccstd::vector<SpineSkeletonMeshData> meshArray{};
    collectMeshData(meshArray);

    processVertices(meshArray);

    mergeMeshes(meshArray);
    meshArray.clear();
    return _model;
}

void SpineSkeletonInstance::collectMeshData(std::vector<SpineSkeletonMeshData> &meshArray) {
    SpineSkeletonMeshData *currMesh = nullptr;

    unsigned int byteStride = sizeof(cc::middleware::V3F_T2F_C4B);
    int startSlotIndex = -1;
    int endSlotIndex = -1;
    bool inRange = true;
    auto &drawOrder = _skeleton->getDrawOrder();
    int drawCount = drawOrder.size();

    if (_effect) {
        _effect->begin(*_skeleton);
    }

    cc::middleware::Color4F color;
    for (uint32_t drawIdx = 0, n = drawCount; drawIdx < n; ++drawIdx) {
        color.r = _userData.color.r;
        color.g = _userData.color.g;
        color.b = _userData.color.b;
        color.a = _userData.color.a;
        auto slot = drawOrder[drawIdx];
        if (slot->getBone().isActive() == false) {
            continue;
        }
        if (startSlotIndex >= 0 && startSlotIndex == slot->getData().getIndex()) {
            inRange = true;
        }
        if (!inRange) {
            _clipper->clipEnd(*slot);
            continue;
        }
        if (endSlotIndex >= 0 && endSlotIndex == slot->getData().getIndex()) {
            inRange = false;
        }

        if (!slot->getAttachment()) {
            _clipper->clipEnd(*slot);
            continue;
        }

        if (slot->getAttachment()->getRTTI().isExactly(spine::RegionAttachment::rtti)) {
            auto *attachment = dynamic_cast<spine::RegionAttachment *>(slot->getAttachment());
            auto *attachmentVertices = reinterpret_cast<spine::AttachmentVertices *>(attachment->getRendererObject());

            auto vertCount = attachmentVertices->_triangles->vertCount;
            int stride = sizeof(cc::middleware::V3F_T2F_C4B);
            auto vbSize = vertCount * stride;
            auto indexCount = attachmentVertices->_triangles->indexCount;
            auto ibSize = indexCount * sizeof(uint16_t);
            SpineSkeletonMeshData mesh(drawIdx,
                (uint8_t*)attachmentVertices->_triangles->verts,
                attachmentVertices->_triangles->indices,
                vertCount,
                indexCount,
                byteStride,
                slot->getData().getBlendMode());
            attachment->computeWorldVertices(slot->getBone(),(float *)mesh.vBuf, 0, stride / sizeof(float));
            meshArray.push_back(mesh);
            currMesh = &mesh;
            color.r *= attachment->getColor().r;
            color.g *= attachment->getColor().g;
            color.b *= attachment->getColor().b;
            color.a *= attachment->getColor().a;
        } else if (slot->getAttachment()->getRTTI().isExactly(spine::MeshAttachment::rtti)) {
            auto *attachment = dynamic_cast<spine::MeshAttachment *>(slot->getAttachment());
            auto *attachmentVertices = static_cast<spine::AttachmentVertices *>(attachment->getRendererObject());      

            auto vertCount = attachmentVertices->_triangles->vertCount;
            auto vbSize = vertCount * byteStride;
            auto indexCount = attachmentVertices->_triangles->indexCount;
            auto ibSize = indexCount * sizeof(uint16_t);

            SpineSkeletonMeshData mesh(drawIdx,
                (uint8_t*)attachmentVertices->_triangles->verts,
                attachmentVertices->_triangles->indices,
                vertCount,
                indexCount,
                byteStride,
                slot->getData().getBlendMode());
            attachment->computeWorldVertices(*slot, 0, attachment->getWorldVerticesLength(), (float *)mesh.vBuf, 0, byteStride / sizeof(float));
            meshArray.push_back(mesh);
            currMesh = &mesh;

            color.r *= attachment->getColor().r;
            color.g *= attachment->getColor().g;
            color.b *= attachment->getColor().b;
            color.a *= attachment->getColor().a;
        } else if (slot->getAttachment()->getRTTI().isExactly(spine::ClippingAttachment::rtti)) {
            auto *clip = dynamic_cast<spine::ClippingAttachment *>(slot->getAttachment());
            _clipper->clipStart(*slot, clip);
            continue;
        } else {
            _clipper->clipEnd(*slot);
            continue;
        }

        uint32_t uintA = (uint32_t)(255* _skeleton->getColor().a * slot->getColor().a * color.a);
        uint32_t multiplier = _userData.premultipliedAlpha ? uintA : 255;
        uint32_t uintR = (uint32_t)(_skeleton->getColor().r * slot->getColor().r * color.r * multiplier);
        uint32_t uintG = (uint32_t)(_skeleton->getColor().g * slot->getColor().g * color.g * multiplier);
        uint32_t uintB = (uint32_t)(_skeleton->getColor().b * slot->getColor().b * color.b * multiplier);
        uint32_t uintColor = (uintA << 24) + (uintB << 16) + (uintG << 8) + uintR;

        if (_clipper->isClipping()) {

        } else {
            int byteStride = sizeof(cc::middleware::V3F_T2F_C4B); 
            int vCount = currMesh->vCount;
            cc::middleware::V3F_T2F_C4B *vertex = (cc::middleware::V3F_T2F_C4B *)currMesh->vBuf;
            uint32_t* uPtr = (uint32_t*)currMesh->vBuf;
            if (_effect) {
                for (int v = 0; v < vCount; ++v) {
                    _effect->transform(vertex[v].vertex.x, vertex[v].vertex.y);
                    uPtr[v * 6 + 5] = uintColor;
                }
            } else {
                for (int v = 0; v < vCount; ++v) {
                    uPtr[v * 6 + 5] = uintColor;
                }
            }
        }
        _clipper->clipEnd(*slot);
    }
    _clipper->clipEnd();
    if (_effect) _effect->end();
}

void SpineSkeletonInstance::mergeMeshes(std::vector<SpineSkeletonMeshData> &meshArray) {
    int count = meshArray.size();
    if (count < 1) return;
    int vCount = 0;
    int iCount = 0;
    for (int i = 0; i < count; i++) {
        vCount += meshArray[i].vCount;
        iCount += meshArray[i].iCount;
    }
    uint32_t byteStride = sizeof(cc::middleware::V3F_T2F_C4B);
    _model->allocData(vCount, iCount, byteStride);

    vCount = 0;
    iCount = 0;
    auto curBlend = meshArray[0].blendMode;
    SpineMeshBlendInfo blendInfo;
    blendInfo.blendMode = curBlend;
    blendInfo.indexOffset = iCount;
    _model->blendList.push_back(blendInfo);
    for (int i = 0; i < count; i++) {
        if (meshArray[i].blendMode != curBlend) {
            auto lastIdx = _model->blendList.size() - 1;
            _model->blendList[lastIdx].indexCount = iCount - _model->blendList[lastIdx].indexOffset;
            curBlend = meshArray[i].blendMode;
            blendInfo.blendMode = curBlend;
            blendInfo.indexOffset = iCount;
            _model->blendList.push_back(blendInfo);
        }
        uint16_t *iPtr = _model->iBuf.data() + iCount;
        for (int ii = 0; ii < meshArray[i].iCount; ii++) {
            iPtr[ii] = meshArray[i].iBuf[ii] + vCount;
        }
        uint8_t *vPtr = _model->vBuf.data() + vCount * byteStride;
        uint32_t byteSize = meshArray[i].vCount * byteStride;
        memcpy(vPtr, meshArray[i].vBuf, byteSize);
        vCount += meshArray[i].vCount;
        iCount += meshArray[i].iCount;
    }
    auto lastIdx = _model->blendList.size() - 1;
    _model->blendList[lastIdx].indexCount = iCount - _model->blendList[lastIdx].indexOffset;
}

void SpineSkeletonInstance::processVertices(std::vector<SpineSkeletonMeshData> &meshes)
{
    if (!_userData.doScale && !_userData.doFillZ) return;

    int byteStride = sizeof(cc::middleware::V3F_T2F_C4B); 
    int count = meshes.size();
    if (_userData.doScale && _userData.doFillZ) {
        float scale = _userData.scale;
        float zoffset = 0;
        for (int i = 0; i < count; i++) {
            auto mesh = meshes[i];
            float *ptr = (float *)mesh.vBuf;
            for (int m = 0; m < mesh.vCount; m++) {
                float *vert = ptr + m * byteStride / sizeof(float);
                vert[0] *= scale;
                vert[1] *= scale;
                vert[2] = zoffset;
            }
            zoffset += 0.01F;
        }
    } else if (_userData.doScale && !_userData.doFillZ) {
        float scale = _userData.scale;
        float zValue = 0;
        for (int i = 0; i < count; i++) {
            auto mesh = meshes[i];
            float *ptr = (float *)mesh.vBuf;
            for (int m = 0; m < mesh.vCount; m++) {
                float *vert = ptr + m * byteStride / sizeof(float);
                vert[0] *= scale;
                vert[1] *= scale;
                vert[2] = zValue;
            }
        }
    } else if (!_userData.doScale && _userData.doFillZ) {
        float zoffset = 0;
        for (int i = 0; i < count; i++) {
            auto mesh = meshes[i];
            float *ptr = (float *)mesh.vBuf;
            for (int m = 0; m < mesh.vCount; m++) {
                float *vert = ptr + m * byteStride / sizeof(float);
                vert[2] = zoffset;
            }
            zoffset = 0;
        }
    }
}

} // namespace spine
