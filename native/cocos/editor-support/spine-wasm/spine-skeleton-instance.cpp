#include "spine-skeleton-instance.h"
#include <spine/spine.h>
#include <vector>
#include "AtlasAttachmentLoaderExtension.h"
#include "spine-mesh-data.h"
#include "spine-wasm.h"
#include "util-function.h"

extern "C" {
extern void spineListenerCallBackFromJS();
}
using namespace spine;

static void animationCallback(AnimationState *state, EventType type, TrackEntry *entry, Event *event) {
    SpineSkeletonInstance *instance = (SpineSkeletonInstance *)state->getRendererObject();
    instance->onAnimationStateEvent(entry, type, event);
}

SpineSkeletonInstance::SpineSkeletonInstance() {
    _model = new SpineModel();
}

SpineSkeletonInstance::~SpineSkeletonInstance() {
    if (_clipper) delete _clipper;
    if (_animState) delete _animState;
    if (_animStateData) delete _animStateData;
    if (_skeleton) delete _skeleton;
    if (_model) delete _model;
}

Skeleton *SpineSkeletonInstance::initSkeleton(SkeletonData *data) {
    if (_clipper) delete _clipper;
    if (_animState) delete _animState;
    if (_animStateData) delete _animStateData;
    if (_skeleton) delete _skeleton;

    _skeletonData = data;
    _skeleton = new Skeleton(_skeletonData);
    _animStateData = new AnimationStateData(_skeletonData);
    _animState = new AnimationState(_animStateData);
    _clipper = new SkeletonClipping();
    _skeleton->setToSetupPose();
    _skeleton->updateWorldTransform();
    //LogUtil::PrintToJs("initSkeleton ok.");

    _animState->setRendererObject(this);
    _animState->setListener(animationCallback);
    return _skeleton;
}

TrackEntry *SpineSkeletonInstance::setAnimation(float trackIndex, const std::string &name, bool loop) {
    if (!_skeleton) return nullptr;
    spine::Animation *animation = _skeleton->getData()->findAnimation(name.c_str());
    if (!animation) {
        //LogUtil::PrintToJs("Spine: Animation not found:!!!");
        _animState->clearTracks();
        _skeleton->setToSetupPose();
        return nullptr;
    }
    auto *trackEntry = _animState->setAnimation(trackIndex, animation, loop);
    _animState->apply(*_skeleton);
    _skeleton->updateWorldTransform();
    return trackEntry;
}

void SpineSkeletonInstance::setSkin(const std::string &name) {
    if (!_skeleton) return;
    _skeleton->setSkin(name.c_str());
    _skeleton->setSlotsToSetupPose();
    _animState->apply(*_skeleton);
    _skeleton->updateWorldTransform();
    //LogUtil::PrintToJs(name.c_str());
}

void SpineSkeletonInstance::updateAnimation(float dltTime) {
    if (!_skeleton) return;
    _skeleton->update(dltTime);
    _animState->update(dltTime);
    _animState->apply(*_skeleton);
    _skeleton->updateWorldTransform();
}

SpineModel *SpineSkeletonInstance::updateRenderData() {
    if (_userData.debugMode) {
        _debugShapes.clear();
    }
    SpineMeshData::reset();
    _model->clearMeshes();
    if (_userData.useTint) {
        _model->byteStride = sizeof(V3F_T2F_C4B_C4B);
    } else {
        _model->byteStride = sizeof(V3F_T2F_C4B);
    }

    collectMeshData();

    _model->setBufferPtr(SpineMeshData::vb(), SpineMeshData::ib());
    return _model;
}

void SpineSkeletonInstance::collectMeshData() {
    uint32_t byteStrideOneColor = sizeof(V3F_T2F_C4B);
    uint32_t byteStrideTwoColor = sizeof(V3F_T2F_C4B_C4B);

    Color4F color;
    auto &slotArray = _skeleton->getDrawOrder();
    uint32_t slotCount = slotArray.size();
    DEBUG_SHAPE_TYPE debugShapeType = DEBUG_SHAPE_TYPE::DEBUG_REGION;

    SlotMesh currMesh;
    if (_effect) {
        _effect->begin(*_skeleton);
    }

    for (uint32_t drawIdx = 0; drawIdx < slotCount; ++drawIdx) {
        auto slot = slotArray[drawIdx];
        if (slot->getBone().isActive() == false) {
            continue;
        }

        if (!slot->getAttachment()) {
            _clipper->clipEnd(*slot);
            continue;
        }
        color.r = _userData.color.r;
        color.g = _userData.color.g;
        color.b = _userData.color.b;
        color.a = _userData.color.a;
        if (slot->getAttachment()->getRTTI().isExactly(spine::RegionAttachment::rtti)) {
            debugShapeType = DEBUG_SHAPE_TYPE::DEBUG_REGION;
            auto *attachment = static_cast<spine::RegionAttachment *>(slot->getAttachment());
            auto *attachmentVertices = reinterpret_cast<AttachmentVertices *>(attachment->getRendererObject());

            auto vertCount = attachmentVertices->_triangles->vertCount;
            auto indexCount = attachmentVertices->_triangles->indexCount;
            auto ibSize = indexCount * sizeof(uint16_t);

            if (!_userData.useTint) {
                auto vbSize = vertCount * byteStrideOneColor;
                auto *vertices = SpineMeshData::queryVBuffer(vbSize);
                auto *indices = SpineMeshData::queryIBuffer(indexCount);
                memcpy(static_cast<void *>(vertices), static_cast<void *>(attachmentVertices->_triangles->verts), vbSize);
                memcpy(indices, attachmentVertices->_triangles->indices, ibSize);
                attachment->computeWorldVertices(slot->getBone(), (float *)vertices, 0, byteStrideOneColor / sizeof(float));
                currMesh = SlotMesh((uint8_t *)vertices, indices, vertCount, indexCount);
            } else {
                auto vbSize = vertCount * byteStrideTwoColor;
                auto *vertices = SpineMeshData::queryVBuffer(vbSize);
                auto *indices = SpineMeshData::queryIBuffer(indexCount);
                V3F_T2F_C4B_C4B *verts = (V3F_T2F_C4B_C4B *)vertices;
                for (int ii = 0; ii < vertCount; ii++) {
                    verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
                }
                memcpy(indices, attachmentVertices->_triangles->indices, ibSize);
                attachment->computeWorldVertices(slot->getBone(), (float *)vertices, 0, byteStrideTwoColor / sizeof(float));
                currMesh = SlotMesh((uint8_t *)vertices, indices, vertCount, indexCount);
            }
            color.r *= attachment->getColor().r;
            color.g *= attachment->getColor().g;
            color.b *= attachment->getColor().b;
            color.a *= attachment->getColor().a;
            currMesh.textureID = attachmentVertices->_textureId;
        } else if (slot->getAttachment()->getRTTI().isExactly(spine::MeshAttachment::rtti)) {
            debugShapeType = DEBUG_SHAPE_TYPE::DEBUG_MESH;
            auto *attachment = static_cast<spine::MeshAttachment *>(slot->getAttachment());
            auto *attachmentVertices = static_cast<AttachmentVertices *>(attachment->getRendererObject());

            auto vertCount = attachmentVertices->_triangles->vertCount;
            auto indexCount = attachmentVertices->_triangles->indexCount;
            auto ibSize = indexCount * sizeof(uint16_t);
            if (!_userData.useTint) {
                auto vbSize = vertCount * byteStrideOneColor;
                auto *vertices = SpineMeshData::queryVBuffer(vbSize);
                auto *indices = SpineMeshData::queryIBuffer(indexCount);
                memcpy(static_cast<void *>(vertices), static_cast<void *>(attachmentVertices->_triangles->verts), vbSize);
                memcpy(indices, attachmentVertices->_triangles->indices, ibSize);
                attachment->computeWorldVertices(*slot, 0, attachment->getWorldVerticesLength(), (float *)vertices, 0, byteStrideOneColor / sizeof(float));
                currMesh = SlotMesh((uint8_t *)vertices, indices, vertCount, indexCount);
            } else {
                auto vbSize = vertCount * byteStrideTwoColor;
                auto *vertices = SpineMeshData::queryVBuffer(vbSize);
                auto *indices = SpineMeshData::queryIBuffer(indexCount);
                V3F_T2F_C4B_C4B *verts = (V3F_T2F_C4B_C4B *)vertices;
                for (int ii = 0; ii < vertCount; ii++) {
                    verts[ii].texCoord = attachmentVertices->_triangles->verts[ii].texCoord;
                }
                memcpy(indices, attachmentVertices->_triangles->indices, ibSize);
                attachment->computeWorldVertices(*slot, 0, attachment->getWorldVerticesLength(), (float *)vertices, 0, byteStrideTwoColor / sizeof(float));
                currMesh = SlotMesh((uint8_t *)vertices, indices, vertCount, indexCount);
            }
            color.r *= attachment->getColor().r;
            color.g *= attachment->getColor().g;
            color.b *= attachment->getColor().b;
            color.a *= attachment->getColor().a;
            currMesh.textureID = attachmentVertices->_textureId;
        } else if (slot->getAttachment()->getRTTI().isExactly(spine::ClippingAttachment::rtti)) {
            auto *clip = static_cast<spine::ClippingAttachment *>(slot->getAttachment());
            _clipper->clipStart(*slot, clip);
            continue;
        } else {
            _clipper->clipEnd(*slot);
            continue;
        }

        uint32_t uintA = (uint32_t)(255 * _skeleton->getColor().a * slot->getColor().a * color.a);
        uint32_t multiplier = _userData.premultipliedAlpha ? uintA : 255;
        uint32_t uintR = (uint32_t)(_skeleton->getColor().r * slot->getColor().r * color.r * multiplier);
        uint32_t uintG = (uint32_t)(_skeleton->getColor().g * slot->getColor().g * color.g * multiplier);
        uint32_t uintB = (uint32_t)(_skeleton->getColor().b * slot->getColor().b * color.b * multiplier);
        uint32_t light = (uintA << 24) + (uintB << 16) + (uintG << 8) + uintR;

        if (slot->hasDarkColor()) {
            uintR = (uint32_t)(_skeleton->getColor().r * slot->getDarkColor().r * color.r * multiplier);
            uintG = (uint32_t)(_skeleton->getColor().g * slot->getDarkColor().g * color.g * multiplier);
            uintB = (uint32_t)(_skeleton->getColor().b * slot->getDarkColor().b * color.b * multiplier);
        } else {
            uintR = 0;
            uintG = 0;
            uintB = 0;
        }
        uintA = _userData.premultipliedAlpha ? 255 : 0;
        uint32_t dark = (uintA << 24) + (uintB << 16) + (uintG << 8) + uintR;

        if (!_userData.useTint) {
            if (_clipper->isClipping()) {
                _clipper->clipTriangles(reinterpret_cast<float *>(currMesh.vBuf), currMesh.iBuf, currMesh.iCount, (float *)(&currMesh.vBuf[3 * 4]), byteStrideOneColor / sizeof(float));

                if (_clipper->getClippedTriangles().size() == 0) {
                    _clipper->clipEnd(*slot);
                    continue;
                }
                auto vertCount = static_cast<int>(_clipper->getClippedVertices().size()) >> 1;
                auto indexCount = static_cast<int>(_clipper->getClippedTriangles().size());
                auto vbSize = vertCount * byteStrideOneColor;
                uint8_t *vPtr = SpineMeshData::queryVBuffer(vbSize);
                uint16_t *iPtr = SpineMeshData::queryIBuffer(indexCount);
                currMesh = SlotMesh(vPtr, iPtr, vertCount, indexCount);
                memcpy(iPtr, _clipper->getClippedTriangles().buffer(), sizeof(uint16_t) * indexCount);

                float *verts = _clipper->getClippedVertices().buffer();
                float *uvs = _clipper->getClippedUVs().buffer();
                V3F_T2F_C4B *vertices = (V3F_T2F_C4B *)currMesh.vBuf;
                if (_effect) {
                    for (int v = 0, vn = vertCount, vv = 0; v < vn; ++v, vv += 2) {
                        vertices[v].vertex.x = verts[vv];
                        vertices[v].vertex.y = verts[vv + 1];
                        vertices[v].texCoord.u = uvs[vv];
                        vertices[v].texCoord.v = uvs[vv + 1];
                        _effect->transform(vertices[v].vertex.x, vertices[v].vertex.y);
                        *((uint32_t *)&vertices[v].color) = light;
                    }
                } else {
                    for (int v = 0, vn = vertCount, vv = 0; v < vn; ++v, vv += 2) {
                        vertices[v].vertex.x = verts[vv];
                        vertices[v].vertex.y = verts[vv + 1];
                        vertices[v].texCoord.u = uvs[vv];
                        vertices[v].texCoord.v = uvs[vv + 1];
                        *((uint32_t *)&vertices[v].color) = light;
                    }
                }
            } else {
                auto vertCount = currMesh.vCount;
                V3F_T2F_C4B *vertex = (V3F_T2F_C4B *)currMesh.vBuf;
                uint32_t *uPtr = (uint32_t *)currMesh.vBuf;
                auto stride = byteStrideOneColor / sizeof(float);
                if (_effect) {
                    for (int v = 0; v < vertCount; ++v) {
                        _effect->transform(vertex[v].vertex.x, vertex[v].vertex.y);
                        *((uint32_t *)&vertex[v].color) = light;
                    }
                } else {
                    for (int v = 0; v < vertCount; ++v) {
                        *((uint32_t *)&vertex[v].color) = light;
                    }
                }
            }
        } else {
            if (_clipper->isClipping()) {
                _clipper->clipTriangles(reinterpret_cast<float *>(currMesh.vBuf), currMesh.iBuf, currMesh.iCount, (float *)(&currMesh.vBuf[3 * 4]), byteStrideTwoColor / sizeof(float));

                if (_clipper->getClippedTriangles().size() == 0) {
                    _clipper->clipEnd(*slot);
                    continue;
                }
                auto vertCount = static_cast<int>(_clipper->getClippedVertices().size()) >> 1;
                auto indexCount = static_cast<int>(_clipper->getClippedTriangles().size());
                auto vbSize = vertCount * byteStrideTwoColor;
                uint8_t *vPtr = SpineMeshData::queryVBuffer(vbSize);
                uint16_t *iPtr = SpineMeshData::queryIBuffer(indexCount);
                currMesh = SlotMesh(vPtr, iPtr, vertCount, indexCount);
                memcpy(iPtr, _clipper->getClippedTriangles().buffer(), sizeof(uint16_t) * indexCount);

                float *verts = _clipper->getClippedVertices().buffer();
                float *uvs = _clipper->getClippedUVs().buffer();
                V3F_T2F_C4B_C4B *vertices = (V3F_T2F_C4B_C4B *)currMesh.vBuf;
                if (_effect) {
                    for (int v = 0, vn = vertCount, vv = 0; v < vn; ++v, vv += 2) {
                        vertices[v].vertex.x = verts[vv];
                        vertices[v].vertex.y = verts[vv + 1];
                        vertices[v].texCoord.u = uvs[vv];
                        vertices[v].texCoord.v = uvs[vv + 1];
                        _effect->transform(vertices[v].vertex.x, vertices[v].vertex.y);
                        *((uint32_t *)&vertices[v].color) = light;
                        *((uint32_t *)&vertices[v].color2) = dark;
                    }
                } else {
                    for (int v = 0, vn = vertCount, vv = 0; v < vn; ++v, vv += 2) {
                        vertices[v].vertex.x = verts[vv];
                        vertices[v].vertex.y = verts[vv + 1];
                        vertices[v].texCoord.u = uvs[vv];
                        vertices[v].texCoord.v = uvs[vv + 1];
                        *((uint32_t *)&vertices[v].color) = light;
                        *((uint32_t *)&vertices[v].color2) = dark;
                    }
                }
            } else {
                auto vertCount = currMesh.vCount;
                V3F_T2F_C4B_C4B *vertex = (V3F_T2F_C4B_C4B *)currMesh.vBuf;
                uint32_t *uPtr = (uint32_t *)currMesh.vBuf;
                auto stride = byteStrideTwoColor / sizeof(float);
                if (_effect) {
                    for (int v = 0; v < vertCount; ++v) {
                        _effect->transform(vertex[v].vertex.x, vertex[v].vertex.y);
                        *((uint32_t *)&vertex[v].color) = light;
                        *((uint32_t *)&vertex[v].color2) = dark;
                    }
                } else {
                    for (int v = 0; v < vertCount; ++v) {
                        *((uint32_t *)&vertex[v].color) = light;
                        *((uint32_t *)&vertex[v].color2) = dark;
                    }
                }
            }
        }

        auto stride = _userData.useTint ? byteStrideTwoColor : byteStrideOneColor;
        SpineMeshData::moveVB(currMesh.vCount * stride);
        SpineMeshData::moveIB(currMesh.iCount);
        // record debug shape info
        if (_userData.debugMode) {
            SpineDebugShape debugShape;
            debugShape.type = static_cast<uint32_t>(debugShapeType);
            debugShape.vOffset = _model->vCount;
            debugShape.vCount = currMesh.vCount;
            debugShape.iOffset = _model->iCount;
            debugShape.iCount = currMesh.iCount;
            _debugShapes.push_back(debugShape);
        }

        currMesh.blendMode = static_cast<uint32_t>(slot->getData().getBlendMode());
        if (_userData.useSlotTexture) {
            auto iter = slotTextureSet.find(slot);
            if (iter != slotTextureSet.end()) {
                currMesh.textureID = iter->second;
            }
        }
        _model->addSlotMesh(currMesh);

        _clipper->clipEnd(*slot);
    }
    _clipper->clipEnd();
    if (_effect) _effect->end();
}

void SpineSkeletonInstance::setPremultipliedAlpha(bool val) {
    _userData.premultipliedAlpha = val;
}

void SpineSkeletonInstance::setColor(float r, float g, float b, float a) {
    _userData.color.r = r;
    _userData.color.g = g;
    _userData.color.b = b;
    _userData.color.a = a;
}

void SpineSkeletonInstance::setJitterEffect(JitterVertexEffect *effect) {
    _effect = effect;
}

void SpineSkeletonInstance::setSwirlEffect(SwirlVertexEffect *effect) {
    _effect = effect;
}

void SpineSkeletonInstance::clearEffect() {
    _effect = nullptr;
}

AnimationState *SpineSkeletonInstance::getAnimationState() {
    return _animState;
}

void SpineSkeletonInstance::setMix(const std::string &from, const std::string &to, float duration) {
    _animStateData->setMix(from.c_str(), to.c_str(), duration);
}

void SpineSkeletonInstance::setListener(uint32_t listenerID, uint32_t type) {
    switch (type) {
        case EventType_Start:
            _startListenerID = listenerID;
            break;
        case EventType_Interrupt:
            _interruptListenerID = listenerID;
            break;
        case EventType_End:
            _endListenerID = listenerID;
            break;
        case EventType_Dispose:
            _disposeListenerID = listenerID;
            break;
        case EventType_Complete:
            _completeListenerID = listenerID;
            break;
        case EventType_Event:
            _eventListenerID = listenerID;
            break;
    }
}

void SpineSkeletonInstance::setUseTint(bool useTint) {
    _userData.useTint = useTint;
}

void SpineSkeletonInstance::setDebugMode(bool debug) {
    _userData.debugMode = debug;
}

void SpineSkeletonInstance::onAnimationStateEvent(TrackEntry *entry, EventType type, Event *event) {
    SpineWasmUtil::s_currentType = type;
    SpineWasmUtil::s_currentEntry = entry;
    SpineWasmUtil::s_currentEvent = event;
    switch (type) {
        case EventType_Start:
            if (_startListenerID != 0) {
                SpineWasmUtil::s_listenerID = _startListenerID;
                spineListenerCallBackFromJS();
            }
            break;
        case EventType_Interrupt:
            if (_interruptListenerID != 0) {
                SpineWasmUtil::s_listenerID = _interruptListenerID;
                spineListenerCallBackFromJS();
            }
            break;
        case EventType_End:
            if (_endListenerID != 0) {
                SpineWasmUtil::s_listenerID = _endListenerID;
                spineListenerCallBackFromJS();
            }
            break;
        case EventType_Dispose:
            if (_disposeListenerID != 0) {
                SpineWasmUtil::s_listenerID = _disposeListenerID;
                spineListenerCallBackFromJS();
            }
            break;
        case EventType_Complete:
            if (_completeListenerID != 0) {
                SpineWasmUtil::s_listenerID = _completeListenerID;
                spineListenerCallBackFromJS();
            }
            break;
        case EventType_Event:
            if (_eventListenerID != 0) {
                SpineWasmUtil::s_listenerID = _eventListenerID;
                spineListenerCallBackFromJS();
            }
            break;
    }
}

std::vector<SpineDebugShape> &SpineSkeletonInstance::getDebugShapes() {
    return this->_debugShapes;
}

void SpineSkeletonInstance::resizeSlotRegion(const std::string &slotName, uint32_t width, uint32_t height, bool createNew) {
    if (!_skeleton) return;
    auto slot = _skeleton->findSlot(slotName.c_str());
    if (!slot) return;
    auto attachment = slot->getAttachment();
    if (!attachment) return;
    if (createNew) {
        attachment = attachment->copy();
        slot->setAttachment(attachment);
    }
    if (attachment->getRTTI().isExactly(spine::RegionAttachment::rtti)) {
        auto region = static_cast<RegionAttachment *>(attachment);
        region->setRegionWidth(width);
        region->setRegionHeight(height);
        region->setRegionOriginalWidth(width);
        region->setRegionOriginalHeight(height);
        region->setWidth(width);
        region->setHeight(height);
        region->setUVs(0, 0, 1.0f, 1.0f, false);
        region->updateOffset();
        auto attachmentVertices = static_cast<AttachmentVertices *>(region->getRendererObject());
        if (createNew) {
            attachmentVertices = attachmentVertices->copy();
            region->setRendererObject(attachmentVertices);
        }
        V3F_T2F_C4B *vertices = attachmentVertices->_triangles->verts;
        auto UVs = region->getUVs();
        for (int i = 0, ii = 0; i < 4; ++i, ii += 2) {
            vertices[i].texCoord.u = UVs[ii];
            vertices[i].texCoord.v = UVs[ii + 1];
        }
    } else if (attachment->getRTTI().isExactly(spine::MeshAttachment::rtti)) {
        auto mesh = static_cast<MeshAttachment *>(attachment);
        mesh->setRegionWidth(width);
        mesh->setRegionHeight(height);
        mesh->setRegionOriginalWidth(width);
        mesh->setRegionOriginalHeight(height);
        mesh->setWidth(width);
        mesh->setHeight(height);
        mesh->setRegionU(0);
        mesh->setRegionV(0);
        mesh->setRegionU2(1.0f);
        mesh->setRegionV2(1.0f);
        mesh->setRegionRotate(true);
        mesh->setRegionDegrees(0);
        mesh->updateUVs();
        auto attachmentVertices = static_cast<AttachmentVertices *>(mesh->getRendererObject());
        if (createNew) {
            attachmentVertices = attachmentVertices->copy();
            mesh->setRendererObject(attachmentVertices);
        }
        V3F_T2F_C4B *vertices = attachmentVertices->_triangles->verts;
        auto UVs = mesh->getUVs();
        for (size_t i = 0, ii = 0, nn = mesh->getWorldVerticesLength(); ii < nn; ++i, ii += 2) {
            vertices[i].texCoord.u = UVs[ii];
            vertices[i].texCoord.v = UVs[ii + 1];
        }
    }
}

void SpineSkeletonInstance::setSlotTexture(const std::string &slotName, uint32_t textureID) {
    if (!_skeleton) return;
    auto slot = _skeleton->findSlot(slotName.c_str());
    if (!slot) return;
    _userData.useSlotTexture = true;
    auto iter = slotTextureSet.find(slot);
    if (iter != slotTextureSet.end()) {
        iter->second = textureID;
    } else {
        slotTextureSet[slot] = textureID;
    }
}