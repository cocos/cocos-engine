#include "spine-skeleton-instance.h"
#include <spine/spine.h>
#include "AtlasAttachmentLoaderExtension.h"
#include "spine-mesh-data.h"
#include "spine-wasm.h"

SlotMesh globalMesh(nullptr, nullptr, 0, 0);

extern "C" {
extern void spineListenerCallBackFromJS();
extern void spineTrackListenerCallback();
AttachmentVertices* generateAttachmentVertices(spine::Attachment* attachment);
}

using namespace spine;
extern HashMap<SkeletonData *, HashMap<Attachment *, AttachmentVertices *>*> spineAttachmentVerticesMap;
extern HashMap<SkeletonData *, HashMap<spine::String, spine::String>*> spineTexturesMap;

/**
 * The slot-associated attachment may exist on different skeletonData, so setSlotTexture needs to traverse all skeletonData.
 */
AttachmentVertices *getAttachmentVertices(Attachment *attachment) {
    auto entries = spineAttachmentVerticesMap.getEntries();
    while (entries.hasNext()) {
        auto entry = entries.next();
        auto *skeletonData = entry.key;
        auto *attachmentVerticesMap = entry.value;
        if (attachmentVerticesMap->containsKey(attachment)) {
            return (*attachmentVerticesMap)[attachment];
        }
    }
    return nullptr;
}

template<typename VertexType, typename UVArrayType>
void loopUVCoords(VertexType* tmp, const UVArrayType& uvs, int count) {
    for (int i = 0, ii = 0; i < count; ++i, ii += 2) {
        tmp[i].texCoord.u = uvs[ii];
        tmp[i].texCoord.v = uvs[ii + 1];
    }
}

#ifdef CC_SPINE_VERSION_4_2
template<typename MeshT, 
         typename AttachmentT,
         typename VerticesT,
         typename TexMapT>
void setSpineTextureID(MeshT& currMesh,
                      AttachmentT* attachment,
                      VerticesT* vertices,
                      TexMapT* texMap) {
    if (auto* region = static_cast<AtlasRegion*>(attachment->getRegion())) {
        if (region->page && region->page->name != vertices->_textureName) {
            currMesh.textureID = (*texMap)[region->page->name];
            return;
        }
    }
    currMesh.textureID = vertices->_textureUUID;
}

template<typename VerticesT, typename AttachmentT, 
         typename SlotT, typename TexMapT, typename VertMapT>
void initAttachmentVertices(VerticesT*& vertices,
                      AttachmentT* attachment,
                      SlotT* slot,
                      TexMapT* texMap,
                      VertMapT* vertMap) 
{
    if (!vertices && !attachment->getRegion()) {
        attachment->getSequence()->apply(slot, attachment);
        if (attachment->getRegion()) {
            vertices = generateAttachmentVertices(attachment);
            if (texMap->containsKey(vertices->_textureName)) {
                vertices->_textureUUID = (*texMap)[vertices->_textureName];
            }
            vertMap->put(attachment, vertices);
        }
    }
}
#else
template<typename MeshT, 
         typename AttachmentT,
         typename VerticesT,
         typename TexMapT>
void setSpineTextureID(MeshT& currMesh,
                      AttachmentT*,
                      VerticesT* vertices,
                      TexMapT*)
{
    //do nothing
    currMesh.textureID = vertices->_textureUUID;
}

template<typename VerticesT, typename AttachmentT, 
         typename SlotT, typename TexMapT, typename VertMapT>
void initAttachmentVertices(VerticesT*&, AttachmentT*, SlotT*, TexMapT*, VertMapT*) 
{
    //do nothing
}
#endif


static void animationCallback(AnimationState *state, EventType type, TrackEntry *entry, Event *event) {
    SpineSkeletonInstance *instance = (static_cast<SpineSkeletonInstance *>(state->getRendererObject()));
    if (instance) {
        SpineEventInfo info;
        info.entry = entry;
        info.eventType = type;
        info.event = event;
        instance->animationEvents.add(info);

        if (type == spine::EventType::EventType_Dispose) {
            /**
             * In the official implementation of Spine's AnimationState class, the animationCallback is invoked after the trackEntryCallback. 
             * After the AnimationState completes the EventType_Dispose callback, the TrackEntry will be reclaimed, so this event must be dispatched immediately.
             */
            instance->dispatchEvents();
        }
    }
}

static void trackEntryCallback(AnimationState *state, EventType type, TrackEntry *entry, Event *event) {
    SpineSkeletonInstance *instance = (static_cast<SpineSkeletonInstance *>(state->getRendererObject()));
    if (instance) {
        SpineEventInfo info;
        info.entry = entry;
        info.eventType = type;
        info.event = event;
        instance->trackEvents.add(info);
    }
}

SpineSkeletonInstance::SpineSkeletonInstance() {
    _model = new SpineModel();
    animationEvents.ensureCapacity(spine::EventType::EventType_Event + 1);
    trackEvents.ensureCapacity(spine::EventType::EventType_Event + 1);
}

SpineSkeletonInstance::~SpineSkeletonInstance() {
    _trackListenerSet.clear();
    animationEvents.clear();
    trackEvents.clear();
    _skeletonData = nullptr;
    if (_clipper) delete _clipper;
    if (_animState) delete _animState;
    if (_animStateData) delete _animStateData;
    if (_skeleton) delete _skeleton;
    if (_model) delete _model;

    if (_slotTextureSet.size() > 0) {
        auto entries = _slotTextureSet.getEntries();
        while (entries.hasNext()) {
            auto entry = entries.next();
            auto info = entry.value;
            releaseSlotCacheInfo(info);
        }
    }
}

void SpineSkeletonInstance::destroy() {
    delete this;
}

Skeleton *SpineSkeletonInstance::initSkeleton(SkeletonData *data) {
    if (data == _skeletonData) {
        return _skeleton;
    }
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
#ifdef CC_SPINE_VERSION_3_8
    _skeleton->updateWorldTransform();
#else
    _skeleton->updateWorldTransform(Physics::Physics_Reset);
#endif
    _animState->setRendererObject(this);
    _animState->setListener(animationCallback);
    return _skeleton;
}

TrackEntry *SpineSkeletonInstance::setAnimation(float trackIndex, const spine::String &name, bool loop) {
    if (!_skeleton) return nullptr;
    spine::Animation *animation = _skeleton->getData()->findAnimation(name);
    if (!animation) {
        _animState->clearTracks();
        _skeleton->setToSetupPose();
        return nullptr;
    }
    auto *trackEntry = _animState->setAnimation(trackIndex, animation, loop);
    _animState->apply(*_skeleton);
#ifdef CC_SPINE_VERSION_3_8
    _skeleton->updateWorldTransform();
#else
    _skeleton->updateWorldTransform(Physics::Physics_Update);
#endif
    return trackEntry;
}

void SpineSkeletonInstance::setSkin(const spine::String &name) {
    if (!_skeleton) return;
    _skeleton->setSkin(name);
    _skeleton->setSlotsToSetupPose();
}

void SpineSkeletonInstance::updateAnimation(float dltTime) {
    if (!_skeleton) return;
    dltTime *= dtRate;
    _skeleton->update(dltTime);
    _animState->update(dltTime);
    _animState->apply(*_skeleton);
    dispatchEvents();
}

SpineModel *SpineSkeletonInstance::updateRenderData() {
    if (_userData.debugMode) {
        _debugShapes.clear();
    }
#ifdef CC_SPINE_VERSION_3_8
    _skeleton->updateWorldTransform();
#else
    _skeleton->updateWorldTransform(Physics::Physics_Update);
#endif
    SpineMeshData::reset();
    _model->clearMeshes();
    if (_userData.useTint) {
        _model->byteStride = sizeof(V3F_T2F_C4B_C4B);
    } else {
        _model->byteStride = sizeof(V3F_T2F_C4B);
    }
    collectMeshData();
    globalMesh.textureID = "";
    _model->setBufferPtr(SpineMeshData::vb(), SpineMeshData::ib());
    return _model;
}

void SpineSkeletonInstance::collectMeshData() {
    uint32_t byteStrideOneColor = sizeof(V3F_T2F_C4B);
    uint32_t byteStrideTwoColor = sizeof(V3F_T2F_C4B_C4B);
    uint32_t sizeof_float = sizeof(float);
    uint32_t strideOneColor = byteStrideOneColor / sizeof_float;
    uint32_t strideTwoColor = byteStrideTwoColor / sizeof_float;
    uint16_t sizeof_uint16 = sizeof(uint16_t);

    uint32_t byteStrideColor = !_userData.useTint ? byteStrideOneColor : byteStrideTwoColor;
    uint32_t strideColor = byteStrideColor / sizeof_float;

    Color4F color;
    auto &slotArray = _skeleton->getDrawOrder();
    uint32_t slotCount = slotArray.size();
    DEBUG_SHAPE_TYPE debugShapeType = DEBUG_SHAPE_TYPE::DEBUG_REGION;

    SlotMesh currMesh = globalMesh;
#ifdef CC_SPINE_VERSION_3_8
    if (_effect) {
        _effect->begin(*_skeleton);
    }
#else
    void* _effect = nullptr;
#endif
#ifdef CC_SPINE_VERSION_4_2
    if (!spineTexturesMap.containsKey(_skeletonData)) return;
    auto* texturesMap = spineTexturesMap[_skeletonData];
#else
    HashMap<spine::String, spine::String> *texturesMap = nullptr;
#endif
    if (!spineAttachmentVerticesMap.containsKey(_skeletonData)) return;
    auto* attachmentVerticesMap = spineAttachmentVerticesMap[_skeletonData];
    const Color& skeletonColor = _skeleton->getColor();
    for (uint32_t drawIdx = 0; drawIdx < slotCount; ++drawIdx) {
        auto* slot = slotArray[drawIdx];
        auto& bone = slot->getBone();
        if (!bone.isActive()) {
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
        spine::Attachment* attachmentSlot = slot->getAttachment();
        AttachmentVertices *cacheSlotAttachmentVertices = nullptr;
        AttachmentVertices *attachmentVertices = nullptr;
        if (attachmentVerticesMap->containsKey(attachmentSlot)) {
            attachmentVertices = (*attachmentVerticesMap)[attachmentSlot];
        }
        if (_userData.useSlotTexture && _slotTextureSet.containsKey(slot)) {
            auto info = _slotTextureSet[slot];
            attachmentSlot = info.attachment;
            cacheSlotAttachmentVertices = info.attachmentVertices;
        }
        if (cacheSlotAttachmentVertices) {
            attachmentVertices = cacheSlotAttachmentVertices;
        }
        const spine::RTTI& attachmentRTTI = attachmentSlot->getRTTI();
        if (attachmentRTTI.isExactly(spine::RegionAttachment::rtti)) {
            debugShapeType = DEBUG_SHAPE_TYPE::DEBUG_REGION;
            auto *attachment = static_cast<spine::RegionAttachment *>(attachmentSlot);
            initAttachmentVertices(attachmentVertices, attachment, slot, texturesMap, attachmentVerticesMap);
            setSpineTextureID(currMesh, attachment, attachmentVertices, texturesMap);
            auto *triangles = attachmentVertices->_triangles;
            auto vertCount = triangles->vertCount;
            auto indexCount = triangles->indexCount;
            auto ibSize = indexCount * sizeof_uint16;

            auto vbSize = vertCount * byteStrideColor;
            auto *vertices = SpineMeshData::queryVBuffer();
            auto *indices = SpineMeshData::queryIBuffer();
            if (!_userData.useTint) {
                memcpy(static_cast<void *>(vertices), static_cast<void *>(triangles->verts), vbSize);
#ifdef CC_SPINE_VERSION_4_2
                const auto& uvs = attachment->getUVs();
                V3F_T2F_C4B* tmp = (V3F_T2F_C4B *)(vertices);
                loopUVCoords(tmp, uvs, 4);
 #endif
            } else {
                V3F_T2F_C4B_C4B *verts = (V3F_T2F_C4B_C4B *)vertices;
#ifdef CC_SPINE_VERSION_4_2
                    const auto& uvs = attachment->getUVs();
                    loopUVCoords(verts, uvs, vertCount);
#else
                    for (int ii = 0; ii < vertCount; ii++) {
                        verts[ii].texCoord = triangles->verts[ii].texCoord;
                    }
#endif
            }
            memcpy(indices, triangles->indices, ibSize);
#ifdef CC_SPINE_VERSION_3_8
            attachment->computeWorldVertices(bone, (float *)vertices, 0, strideColor);
#else
            attachment->computeWorldVertices(*slot, (float *)vertices, 0, strideColor);
#endif
            currMesh.set((uint8_t *)vertices, indices, vertCount, indexCount);
            const Color& attachmentColor = attachment->getColor();
            color.r *= attachmentColor.r;
            color.g *= attachmentColor.g;
            color.b *= attachmentColor.b;
            color.a *= attachmentColor.a;
        } else if (attachmentRTTI.isExactly(spine::MeshAttachment::rtti)) {
            debugShapeType = DEBUG_SHAPE_TYPE::DEBUG_MESH;
            auto *attachment = static_cast<spine::MeshAttachment *>(attachmentSlot);
            initAttachmentVertices(attachmentVertices, attachment, slot, texturesMap, attachmentVerticesMap);
            setSpineTextureID(currMesh, attachment, attachmentVertices, texturesMap);
            auto *triangles = attachmentVertices->_triangles;
            auto vertCount = triangles->vertCount;
            auto indexCount = triangles->indexCount;
            auto ibSize = indexCount * sizeof_uint16;

            auto vbSize = vertCount * byteStrideColor;
            auto *vertices = SpineMeshData::queryVBuffer();
            auto *indices = SpineMeshData::queryIBuffer();
            bool isRegionChanged = currMesh.textureID != attachmentVertices->_textureUUID;
            if (!_userData.useTint) {
                memcpy(static_cast<void *>(vertices), static_cast<void *>(triangles->verts), vbSize);
#ifdef CC_SPINE_VERSION_4_2
                // Calling 'attachment->computeWorldVertices()' can alter the UV coordinates.
                const auto& uvs = attachment->getUVs();
                V3F_T2F_C4B* tmp = (V3F_T2F_C4B *)(vertices);
                loopUVCoords(tmp, uvs, 4);
#endif
            } else {
                V3F_T2F_C4B_C4B *verts = (V3F_T2F_C4B_C4B *)vertices;
#ifdef CC_SPINE_VERSION_4_2
                const auto& uvs = attachment->getUVs();
                loopUVCoords(verts, uvs, vertCount);
#else
                for (int ii = 0; ii < vertCount; ii++) {
                    verts[ii].texCoord = triangles->verts[ii].texCoord;
                }
#endif
            }
            memcpy(indices, triangles->indices, ibSize);
            attachment->computeWorldVertices(*slot, 0, attachment->getWorldVerticesLength(), (float *)vertices, 0, strideColor);
            currMesh.set((uint8_t *)vertices, indices, vertCount, indexCount);
            const Color& attachmentColor = attachment->getColor();
            color.r *= attachmentColor.r;
            color.g *= attachmentColor.g;
            color.b *= attachmentColor.b;
            color.a *= attachmentColor.a;
        } else if (attachmentRTTI.isExactly(spine::ClippingAttachment::rtti)) {
            auto *clip = static_cast<spine::ClippingAttachment *>(attachmentSlot);
            _clipper->clipStart(*slot, clip);
            continue;
        } else {
            _clipper->clipEnd(*slot);
            continue;
        }
        const Color& slotColor = slot->getColor();
        uint32_t uintA = (uint32_t)(255 * skeletonColor.a * slotColor.a * color.a);
        uint32_t multiplier = _userData.premultipliedAlpha ? uintA : 255;
        uint32_t uintR = (uint32_t)(skeletonColor.r * slotColor.r * color.r * multiplier);
        uint32_t uintG = (uint32_t)(skeletonColor.g * slotColor.g * color.g * multiplier);
        uint32_t uintB = (uint32_t)(skeletonColor.b * slotColor.b * color.b * multiplier);
        uint32_t light = (uintA << 24) + (uintB << 16) + (uintG << 8) + uintR;

        if (slot->hasDarkColor()) {
            const Color& slotDarkColor = slot->getDarkColor();
            uintR = (uint32_t)(skeletonColor.r * slotDarkColor.r * color.r * multiplier);
            uintG = (uint32_t)(skeletonColor.g * slotDarkColor.g * color.g * multiplier);
            uintB = (uint32_t)(skeletonColor.b * slotDarkColor.b * color.b * multiplier);
        } else {
            uintR = 0;
            uintG = 0;
            uintB = 0;
        }
        uintA = _userData.premultipliedAlpha ? 255 : 0;
        uint32_t dark = (uintA << 24) + (uintB << 16) + (uintG << 8) + uintR;

        if (!_userData.useTint) {
            if (_clipper->isClipping()) {
                _clipper->clipTriangles(reinterpret_cast<float *>(currMesh.vBuf), currMesh.iBuf, currMesh.iCount, (float *)(&currMesh.vBuf[3 * 4]), strideColor);
                auto& clippedTriangles = _clipper->getClippedTriangles();
                if (clippedTriangles.size() == 0) {
                    _clipper->clipEnd(*slot);
                    continue;
                }
                auto& clippedVertices = _clipper->getClippedVertices();
                auto& clippedUVs = _clipper->getClippedUVs();
                const auto vertCount = static_cast<int>(clippedVertices.size()) >> 1;
                const auto indexCount = static_cast<int>(clippedTriangles.size());
                const auto vbSize = vertCount * byteStrideColor;
                uint8_t *vPtr = SpineMeshData::queryVBuffer();
                uint16_t *iPtr = SpineMeshData::queryIBuffer();
                currMesh.set(vPtr, iPtr, vertCount, indexCount);
                memcpy(iPtr, clippedTriangles.buffer(), sizeof_uint16 * indexCount);
                float *verts = clippedVertices.buffer();
                float *uvs = clippedUVs.buffer();

                V3F_T2F_C4B *vertices = (V3F_T2F_C4B *)currMesh.vBuf;
                if (_effect) {
                    for (int v = 0, vn = vertCount, vv = 0; v < vn; ++v, vv += 2) {
                        vertices[v].vertex.x = verts[vv];
                        vertices[v].vertex.y = verts[vv + 1];
                        vertices[v].texCoord.u = uvs[vv];
                        vertices[v].texCoord.v = uvs[vv + 1];
#ifdef CC_SPINE_VERSION_3_8
                        _effect->transform(vertices[v].vertex.x, vertices[v].vertex.y);
#endif
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
                if (_effect) {
                    for (int v = 0; v < vertCount; ++v) {
#ifdef CC_SPINE_VERSION_3_8
                        _effect->transform(vertex[v].vertex.x, vertex[v].vertex.y);
#endif
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
                _clipper->clipTriangles(reinterpret_cast<float *>(currMesh.vBuf), currMesh.iBuf, currMesh.iCount, (float *)(&currMesh.vBuf[3 * 4]), strideColor);
                auto& clippedTriangles = _clipper->getClippedTriangles();
                if (clippedTriangles.size() == 0) {
                    _clipper->clipEnd(*slot);
                    continue;
                }
                auto& clippedVertices = _clipper->getClippedVertices();
                auto& clippedUVs = _clipper->getClippedUVs();
                const auto vertCount = static_cast<int>(clippedVertices.size()) >> 1;
                const auto indexCount = static_cast<int>(clippedTriangles.size());
                const auto vbSize = vertCount * byteStrideColor;
                uint8_t *vPtr = SpineMeshData::queryVBuffer();
                uint16_t *iPtr = SpineMeshData::queryIBuffer();
                currMesh.set(vPtr, iPtr, vertCount, indexCount);
                memcpy(iPtr, clippedTriangles.buffer(), sizeof_uint16 * indexCount);
                float *verts = clippedVertices.buffer();
                float *uvs = clippedUVs.buffer();

                V3F_T2F_C4B_C4B *vertices = (V3F_T2F_C4B_C4B *)currMesh.vBuf;
                if (_effect) {
                    for (int v = 0, vn = vertCount, vv = 0; v < vn; ++v, vv += 2) {
                        vertices[v].vertex.x = verts[vv];
                        vertices[v].vertex.y = verts[vv + 1];
                        vertices[v].texCoord.u = uvs[vv];
                        vertices[v].texCoord.v = uvs[vv + 1];
#ifdef CC_SPINE_VERSION_3_8
                        _effect->transform(vertices[v].vertex.x, vertices[v].vertex.y);
#endif
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
                if (_effect) {
                    for (int v = 0; v < vertCount; ++v) {
#ifdef CC_SPINE_VERSION_3_8
                        _effect->transform(vertex[v].vertex.x, vertex[v].vertex.y);
#endif
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

        SpineMeshData::moveVB(currMesh.vCount * byteStrideColor);
        SpineMeshData::moveIB(currMesh.iCount);
        // record debug shape info
        if (_userData.debugMode) {
            size_t currentShapesLen = _debugShapes.size();
            _debugShapes.setSize(currentShapesLen + 1, {});
            SpineDebugShape& debugShape = _debugShapes[currentShapesLen];
            debugShape.type = static_cast<uint32_t>(debugShapeType);
            debugShape.vOffset = _model->vCount;
            debugShape.vCount = currMesh.vCount;
            debugShape.iOffset = _model->iCount;
            debugShape.iCount = currMesh.iCount;
        }

        currMesh.blendMode = static_cast<uint32_t>(slot->getData().getBlendMode());
        _model->addSlotMesh(currMesh);
        _clipper->clipEnd(*slot);
    }

    _clipper->clipEnd();
#ifdef CC_SPINE_VERSION_3_8
    if (_effect) _effect->end();
#endif
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

#ifdef CC_SPINE_VERSION_3_8
void SpineSkeletonInstance::setJitterEffect(JitterVertexEffect *effect) {
    _effect = effect;
}

void SpineSkeletonInstance::setSwirlEffect(SwirlVertexEffect *effect) {
    _effect = effect;
}

void SpineSkeletonInstance::clearEffect() {
    _effect = nullptr;
}
#endif

AnimationState *SpineSkeletonInstance::getAnimationState() {
    return _animState;
}

void SpineSkeletonInstance::setMix(const spine::String &from, const spine::String &to, float duration) {
    _animStateData->setMix(from, to, duration);
}

void SpineSkeletonInstance::setTrackEntryListener(uint32_t trackId, TrackEntry *entry) {
    if (!entry->getRendererObject()) {
        _trackListenerSet.put(entry, trackId);
        entry->setRendererObject(this);
        entry->setListener(trackEntryCallback);
    }
}

void SpineSkeletonInstance::setUseTint(bool useTint) {
    _userData.useTint = useTint;
}

void SpineSkeletonInstance::setDebugMode(bool debug) {
    _userData.debugMode = debug;
}

void SpineSkeletonInstance::onTrackEntryEvent(TrackEntry *entry, EventType type, Event *event) {
    if (!entry->getRendererObject()) return;
    SpineWasmUtil::s_listenerID = _trackListenerSet[entry];
    SpineWasmUtil::s_currentType = type;
    SpineWasmUtil::s_currentEntry = entry;
    SpineWasmUtil::s_currentEvent = event;
    spineTrackListenerCallback();
    if (type == EventType_Dispose) {
        entry->setRendererObject(nullptr);
        _trackListenerSet.remove(entry);
    }
}

void SpineSkeletonInstance::onAnimationStateEvent(TrackEntry *entry, EventType type, Event *event) {
    SpineWasmUtil::s_currentType = type;
    SpineWasmUtil::s_currentEntry = entry;
    SpineWasmUtil::s_currentEvent = event;
    if (_eventListenerID != 0) {
        SpineWasmUtil::s_listenerID = _eventListenerID;
        spineListenerCallBackFromJS();
    }
}

void SpineSkeletonInstance::resizeSlotRegion(const spine::String &slotName, uint32_t width, uint32_t height, bool createNew) {
    if (!_skeleton) return;
    auto* slot = _skeleton->findSlot(slotName);
    if (!slot) return;
    auto *attachment = slot->getAttachment();
    if (!attachment) return;
    if (createNew) {
        attachment = attachment->copy();
    }
    SlotCacheInfo info;
    info.attachment = attachment;
    info.isOwner = createNew;
    if (attachment->getRTTI().isExactly(spine::RegionAttachment::rtti)) {
        auto *region = static_cast<RegionAttachment *>(attachment);
#ifdef CC_SPINE_VERSION_3_8
        region->setRegionWidth(width);
        region->setRegionHeight(height);
        region->setRegionOriginalWidth(width);
        region->setRegionOriginalHeight(height);
        region->setWidth(width);
        region->setHeight(height);
        region->setUVs(0, 0, 1.0f, 1.0f, false);
        region->updateOffset();
#else
        auto *textureRegion = region->getRegion();
        if (textureRegion) {
            textureRegion->width = width;
            textureRegion->height = height;
            textureRegion->originalWidth = width;
            textureRegion->originalHeight = height;

            textureRegion->u = 0;
            textureRegion->v = 0;
            textureRegion->u2 = 1.0f;
            textureRegion->v2 = 1.0f;
        }
        region->setWidth(width);
        region->setHeight(height);
        auto &uvs = region->getUVs();
        uvs[2] = 0;
        uvs[3] = 1;
        uvs[4] = 0;
        uvs[5] = 0;
        uvs[6] = 1;
        uvs[7] = 0;
        uvs[0] = 1;
        uvs[1] = 1;
        region->updateRegion();
#endif

        auto *attachmentVertices = getAttachmentVertices(slot->getAttachment());
        if (!attachmentVertices) return;
        if (createNew) {
            attachmentVertices = attachmentVertices->copy();
            info.attachmentVertices = attachmentVertices;
        }
        V3F_T2F_C4B *vertices = attachmentVertices->_triangles->verts;
        auto &UVs = region->getUVs();
        for (int i = 0, ii = 0; i < 4; ++i, ii += 2) {
            vertices[i].texCoord.u = UVs[ii];
            vertices[i].texCoord.v = UVs[ii + 1];
        }
    } else if (attachment->getRTTI().isExactly(spine::MeshAttachment::rtti)) {
        auto *mesh = static_cast<MeshAttachment *>(attachment);
#ifdef CC_SPINE_VERSION_3_8
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
#else
        auto *region = mesh->getRegion();
        if (region) {
            region->width = width;
            region->height = height;
            region->originalWidth = width;
            region->originalHeight = height;
            region->u = 0;
            region->v = 0;
            region->u2 = 1.0f;
            region->v2 = 1.0f;
            region->degrees = 0;
        }
        mesh->setWidth(width);
        mesh->setHeight(height);
        mesh->updateRegion();
#endif

        auto *attachmentVertices = getAttachmentVertices(slot->getAttachment());
        if (!attachmentVertices) return;
        if (createNew) {
            attachmentVertices = attachmentVertices->copy();
            info.attachmentVertices = attachmentVertices;
        }
        V3F_T2F_C4B *vertices = attachmentVertices->_triangles->verts;
        const auto &UVs = mesh->getUVs();
        for (size_t i = 0, ii = 0, nn = mesh->getWorldVerticesLength(); ii < nn; ++i, ii += 2) {
            vertices[i].texCoord.u = UVs[ii];
            vertices[i].texCoord.v = UVs[ii + 1];
        }
    }
    if (_slotTextureSet.containsKey(slot)) {
        auto cacheInfo = _slotTextureSet[slot];
        releaseSlotCacheInfo(cacheInfo);
    }
    _slotTextureSet.put(slot, info);
    _skeleton->updateCache();
}

void SpineSkeletonInstance::setSlotTexture(const spine::String &slotName, const spine::String& textureUuid) {
    if (!_skeleton) return;
    auto* slot = _skeleton->findSlot(slotName);
    if (!slot) return;
    _userData.useSlotTexture = true;
    if (_slotTextureSet.containsKey(slot)) {
        AttachmentVertices *attachmentVertices = _slotTextureSet[slot].attachmentVertices;
        if (attachmentVertices) {
            attachmentVertices->_textureUUID = textureUuid;
        }
    }
}

void SpineSkeletonInstance::dispatchEvents() {
    spine::Vector<SpineEventInfo> vecAnimationEvents;
    spine::Vector<SpineEventInfo> vecTrackEvents;
    if (animationEvents.size() > 0) {
        //Cache animation events then call back to JS.
        vecAnimationEvents.addAll(animationEvents);
        animationEvents.clear();
    }
    if (trackEvents.size() > 0) {
        //Cache track events then call back to JS.
        vecTrackEvents.addAll(trackEvents);
        trackEvents.clear();
    }
    for (int i = 0; i < vecAnimationEvents.size(); i++) {
        auto& info = vecAnimationEvents[i];
        onAnimationStateEvent(info.entry, info.eventType, info.event);
    }
    for (int i = 0; i < vecTrackEvents.size(); i++) {
        auto& info = vecTrackEvents[i];
        onTrackEntryEvent(info.entry, info.eventType, info.event);
    }
}

void SpineSkeletonInstance::releaseSlotCacheInfo(SlotCacheInfo &info) {
    if (info.attachment && info.isOwner) {
        delete info.attachment;
        info.attachment = nullptr;
        delete info.attachmentVertices;
        info.attachmentVertices = nullptr;
    }
}