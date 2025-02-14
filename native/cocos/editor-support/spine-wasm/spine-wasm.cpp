#include "spine-wasm.h"
#include "AtlasAttachmentLoaderExtension.h"
#include "spine-mesh-data.h"
#include "util-function.h"
#include "wasmSpineExtension.h"

#include <emscripten/emscripten.h>
#include <emscripten/val.h>

#include "spine/HashMap.h"

using namespace spine;

static void logToConsole(const char* message) {
    EM_ASM({
        console.log(UTF8ToString($0));
    }, message);
}

namespace {
    HashMap<String, SkeletonData*> skeletonDataMap{};

    static void updateAttachmentVerticesTextureId(SkeletonData* skeletonData, const spine::Vector<spine::String>& textureNames, const spine::Vector<spine::String>& textureUUIDs) {
        spine::HashMap<spine::String, spine::String> textureMap{};
        int textureSize = textureNames.size();
        for (int i = 0; i < textureSize; ++i) {
            textureMap.put(textureNames[i], textureUUIDs[i]);
        }

        auto& skins = skeletonData->getSkins();
        auto skinSize = skins.size();
        for (int i = 0; i < skinSize; ++i) {
            auto* skin = skins[i];
            auto entries = skin->getAttachments();
            while (entries.hasNext()) {
                Skin::AttachmentMap::Entry& entry = entries.next();
                AttachmentVertices* attachmentVertices;
                auto* attachment = entry._attachment;
                if (attachment->getRTTI().isExactly(MeshAttachment::rtti)) {
                    auto* meshAttachment = static_cast<MeshAttachment*>(attachment);
#ifdef CC_SPINE_VERSION_3_8
                    attachmentVertices = static_cast<AttachmentVertices*>(meshAttachment->getRendererObject());
#else
                    attachmentVertices = static_cast<AttachmentVertices*>(meshAttachment->getRegion()->rendererObject);
#endif
                } else if (attachment->getRTTI().isExactly(RegionAttachment::rtti)) {
                    auto* regionAttachment = static_cast<RegionAttachment*>(attachment);
#ifdef CC_SPINE_VERSION_3_8
                    attachmentVertices = static_cast<AttachmentVertices*>(regionAttachment->getRendererObject());
#else
                    attachmentVertices = static_cast<AttachmentVertices*>(regionAttachment->getRegion()->rendererObject);
#endif
                }
                if (attachmentVertices) {
                    auto& textureName = attachmentVertices->_textureName;
                    if (textureMap.containsKey(textureName)) {
                        attachmentVertices->_textureUUID = textureMap[textureName];
                    } else {
                        spine::String logInfo(textureName);
                        logInfo.append(" attachment's texture doesn`t exist ");
                        logInfo.append(textureName);
                        logToConsole(logInfo.buffer());
                    }
                }
            }
        }
    }
}

uint32_t SpineWasmUtil::s_listenerID = 0;
EventType SpineWasmUtil::s_currentType = EventType_Event;
TrackEntry* SpineWasmUtil::s_currentEntry = nullptr;
Event* SpineWasmUtil::s_currentEvent = nullptr;
uint8_t* SpineWasmUtil::s_mem = nullptr;

void SpineWasmUtil::spineWasmInit() {
    // LogUtil::Initialize();
    SpineExtension* extension = new WasmSpineExtension();
    SpineExtension::setInstance(extension);

    SpineMeshData::initMeshMemory();

    //LogUtil::PrintToJs("spineWasmInit");
}

void SpineWasmUtil::spineWasmDestroy() {
    auto* extension = SpineExtension::getInstance();
    delete extension;
    freeStoreMemory();
    SpineMeshData::releaseMeshMemory();
    // LogUtil::ReleaseBuffer();
}

SkeletonData* SpineWasmUtil::querySpineSkeletonDataByUUID(const String& uuid) {
    if (!skeletonDataMap.containsKey(uuid)) {
        return nullptr;
    }
    return skeletonDataMap[uuid];
}

SkeletonData* SpineWasmUtil::createSpineSkeletonDataWithJson(const String& jsonStr, const String& altasStr, const spine::Vector<spine::String>& textureNames, const spine::Vector<spine::String>& textureUUIDs) {
#if ENABLE_JSON_PARSER
    auto* atlas = new Atlas(altasStr.buffer(), altasStr.length(), "", nullptr, false);
    if (!atlas) {
        return nullptr;
    }
    AttachmentLoader* attachmentLoader = new AtlasAttachmentLoaderExtension(atlas);
    #ifdef CC_SPINE_VERSION_3_8
    SkeletonJson json(attachmentLoader);
    #else
    SkeletonJson json(attachmentLoader, true);
    #endif
    json.setScale(1.0F);
    SkeletonData* skeletonData = json.readSkeletonData(jsonStr.buffer());
    auto& errorMsg = json.getError();
    if (!errorMsg.isEmpty()) {
        logToConsole(errorMsg.buffer());
    }

    updateAttachmentVerticesTextureId(skeletonData, textureNames, textureUUIDs);

    return skeletonData;
#else
    return nullptr;
#endif
}

SkeletonData* SpineWasmUtil::createSpineSkeletonDataWithBinary(uint32_t byteSize, const String& altasStr, const spine::Vector<spine::String>& textureNames, const spine::Vector<spine::String>& textureUUIDs) {
#if ENABLE_BINARY_PARSER
    auto* atlas = new Atlas(altasStr.buffer(), altasStr.length(), "", nullptr, false);
    if (!atlas) {
        return nullptr;
    }
    AttachmentLoader* attachmentLoader = new AtlasAttachmentLoaderExtension(atlas);
    #ifdef CC_SPINE_VERSION_3_8
    SkeletonBinary binary(attachmentLoader);
    #else
    SkeletonBinary binary(attachmentLoader, true);
    #endif
    binary.setScale(1.0F);
    SkeletonData* skeletonData = binary.readSkeletonData(s_mem, byteSize);
    auto& errorMsg = binary.getError();
    if (!errorMsg.isEmpty()) {
        logToConsole(errorMsg.buffer());
    }

    updateAttachmentVerticesTextureId(skeletonData, textureNames, textureUUIDs);

    return skeletonData;
#else
    return nullptr;
#endif
}

void SpineWasmUtil::registerSpineSkeletonDataWithUUID(SkeletonData* data, const String& uuid) {
    if (!skeletonDataMap.containsKey(uuid)) {
        skeletonDataMap.put(uuid, data);
    }
}

void SpineWasmUtil::destroySpineSkeletonDataWithUUID(const String& uuid) {
    if (skeletonDataMap.containsKey(uuid)) {
        auto* data = skeletonDataMap[uuid];
#if CC_USE_SPINE_4_2
        auto& skins = data->getSkins();
        auto skinSize = skins.size();
        // release AttachmentVertices
        for (int i = 0; i < skinSize; ++i) {
            auto* skin = skins[i];
            auto entries = skin->getAttachments();
            while (entries.hasNext()) {
                Skin::AttachmentMap::Entry& entry = entries.next();
                AttachmentVertices* attachmentVertices;
                auto* attachment = entry._attachment;
                if (attachment->getRTTI().isExactly(MeshAttachment::rtti)) {
                    auto* meshAttachment = static_cast<MeshAttachment*>(attachment);
                    attachmentVertices = static_cast<AttachmentVertices*>(meshAttachment->getRegion()->rendererObject);
                } else if (attachment->getRTTI().isExactly(RegionAttachment::rtti)) {
                    auto* regionAttachment = static_cast<RegionAttachment*>(attachment);
                    attachmentVertices = static_cast<AttachmentVertices*>(regionAttachment->getRegion()->rendererObject);
                }
                if (attachmentVertices) {
                    delete attachmentVertices;
                }
            }
        }
#endif
        delete data;
        skeletonDataMap.remove(uuid);
    }
}

void SpineWasmUtil::destroySpineSkeleton(Skeleton* skeleton) {
    if (skeleton) {
        delete skeleton;
    }
}

uint32_t SpineWasmUtil::createStoreMemory(uint32_t size) {
    s_mem = new uint8_t[size];

    return (uint32_t)s_mem;
}

void SpineWasmUtil::freeStoreMemory() {
    if (s_mem) {
        delete[] s_mem;
        s_mem = nullptr;
    }
}

uint32_t SpineWasmUtil::getCurrentListenerID() {
    return s_listenerID;
}

EventType SpineWasmUtil::getCurrentEventType() {
    return s_currentType;
}

TrackEntry* SpineWasmUtil::getCurrentTrackEntry() {
    return s_currentEntry;
}

Event* SpineWasmUtil::getCurrentEvent() {
    return s_currentEvent;
}