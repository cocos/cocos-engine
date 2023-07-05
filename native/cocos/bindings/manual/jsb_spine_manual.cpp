/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "jsb_spine_manual.h"
#include "base/Data.h"
#include "base/memory/Memory.h"
#include "bindings/auto/jsb_spine_auto.h"
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"
#include "bindings/manual/jsb_helper.h"
#include "editor-support/spine-creator-support/spine-cocos2dx.h"
#include "editor-support/spine/spine.h"
#include "middleware-adapter.h"
#include "platform/FileUtils.h"
#include "spine-creator-support/SkeletonDataMgr.h"
#include "spine-creator-support/SkeletonRenderer.h"
#include "spine-creator-support/spine-cocos2dx.h"
#include "spine-creator-support/Vector2.h"

using namespace cc;

static spine::Cocos2dTextureLoader textureLoader;
static cc::RefMap<ccstd::string, middleware::Texture2D *> *_preloadedAtlasTextures = nullptr;
static middleware::Texture2D *_getPreloadedAtlasTexture(const char *path) {
    CC_ASSERT(_preloadedAtlasTextures);
    auto it = _preloadedAtlasTextures->find(path);
    return it != _preloadedAtlasTextures->end() ? it->second : nullptr;
}

static bool js_register_spine_initSkeletonData(se::State &s) {
    const auto &args = s.args();
    int argc = (int)args.size();
    if (argc != 5) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;

    ccstd::string uuid;
    ok = sevalue_to_native(args[0], &uuid);
    SE_PRECONDITION2(ok, false, "Invalid uuid content!");

    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (hasSkeletonData) {
        spine::SkeletonData *skeletonData = mgr->retainByUUID(uuid);
        native_ptr_to_seval<spine::SkeletonData>(skeletonData, &s.rval());
        return true;
    }

    ccstd::string skeletonDataFile;
    ok = sevalue_to_native(args[1], &skeletonDataFile);
    SE_PRECONDITION2(ok, false, "Invalid json path!");

    ccstd::string atlasText;
    ok = sevalue_to_native(args[2], &atlasText);
    SE_PRECONDITION2(ok, false, "Invalid atlas content!");

    cc::RefMap<ccstd::string, middleware::Texture2D *> textures;
    ok = seval_to_Map_string_key(args[3], &textures);
    SE_PRECONDITION2(ok, false, "Invalid textures!");

    float scale = 1.0f;
    ok = sevalue_to_native(args[4], &scale);
    SE_PRECONDITION2(ok, false, "Invalid scale!");

    // create atlas from preloaded texture

    _preloadedAtlasTextures = &textures;
    spine::spAtlasPage_setCustomTextureLoader(_getPreloadedAtlasTexture);

    spine::Atlas *atlas = ccnew_placement(__FILE__, __LINE__) spine::Atlas(atlasText.c_str(), (int)atlasText.size(), "", &textureLoader);

    _preloadedAtlasTextures = nullptr;
    spine::spAtlasPage_setCustomTextureLoader(nullptr);

    spine::AttachmentLoader *attachmentLoader = ccnew_placement(__FILE__, __LINE__) spine::Cocos2dAtlasAttachmentLoader(atlas);
    spine::SkeletonData *skeletonData = nullptr;

    std::size_t length = skeletonDataFile.length();
    auto binPos = skeletonDataFile.find(".skel", length - 5);
    if (binPos == ccstd::string::npos) binPos = skeletonDataFile.find(".bin", length - 4);

    if (binPos != ccstd::string::npos) {
        auto fileUtils = cc::FileUtils::getInstance();
        if (fileUtils->isFileExist(skeletonDataFile)) {
            cc::Data cocos2dData;
            const auto fullpath = fileUtils->fullPathForFilename(skeletonDataFile);
            fileUtils->getContents(fullpath, &cocos2dData);

            spine::SkeletonBinary binary(attachmentLoader);
            binary.setScale(scale);
            skeletonData = binary.readSkeletonData(cocos2dData.getBytes(), (int)cocos2dData.getSize());
            CC_ASSERT(skeletonData); // Can use binary.getError() to get error message.
        }
    } else {
        spine::SkeletonJson json(attachmentLoader);
        json.setScale(scale);
        skeletonData = json.readSkeletonData(skeletonDataFile.c_str());
        CC_ASSERT(skeletonData); // Can use json.getError() to get error message.
    }

    if (skeletonData) {
        ccstd::vector<int> texturesIndex;
        for (auto it = textures.begin(); it != textures.end(); it++) {
            texturesIndex.push_back(it->second->getRealTextureIndex());
        }
        mgr->setSkeletonData(uuid, skeletonData, atlas, attachmentLoader, texturesIndex);
        native_ptr_to_seval<spine::SkeletonData>(skeletonData, &s.rval());
    } else {
        if (atlas) {
            delete atlas;
            atlas = nullptr;
        }
        if (attachmentLoader) {
            delete attachmentLoader;
            attachmentLoader = nullptr;
        }
    }
    return true;
}
SE_BIND_FUNC(js_register_spine_initSkeletonData)

static bool js_register_spine_disposeSkeletonData(se::State &s) {
    const auto &args = s.args();
    int argc = (int)args.size();
    if (argc != 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;

    ccstd::string uuid;
    ok = sevalue_to_native(args[0], &uuid);
    SE_PRECONDITION2(ok, false, "Invalid uuid content!");

    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (!hasSkeletonData) return true;
    mgr->releaseByUUID(uuid);
    return true;
}
SE_BIND_FUNC(js_register_spine_disposeSkeletonData)

static bool js_register_spine_initSkeletonRenderer(se::State &s) {
    // renderer, jsonPath, atlasText, textures, scale
    const auto &args = s.args();
    int argc = (int)args.size();
    if (argc != 2) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;

    spine::SkeletonRenderer *node = nullptr;
    ok = seval_to_native_ptr(args[0], &node);
    SE_PRECONDITION2(ok, false, "Converting SpineRenderer failed!");

    ccstd::string uuid;
    ok = sevalue_to_native(args[1], &uuid);
    SE_PRECONDITION2(ok, false, "Invalid uuid content!");

    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (hasSkeletonData) {
        node->initWithUUID(uuid);
    }
    return true;
}
SE_BIND_FUNC(js_register_spine_initSkeletonRenderer)

static bool js_register_spine_retainSkeletonData(se::State &s) {
    const auto &args = s.args();
    int argc = (int)args.size();
    if (argc != 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
        return false;
    }
    bool ok = false;

    ccstd::string uuid;
    ok = sevalue_to_native(args[0], &uuid);
    SE_PRECONDITION2(ok, false, "Invalid uuid content!");

    auto mgr = spine::SkeletonDataMgr::getInstance();
    bool hasSkeletonData = mgr->hasSkeletonData(uuid);
    if (hasSkeletonData) {
        spine::SkeletonData *skeletonData = mgr->retainByUUID(uuid);
        native_ptr_to_seval<spine::SkeletonData>(skeletonData, &s.rval());
    }
    return true;
}
SE_BIND_FUNC(js_register_spine_retainSkeletonData)

static bool js_computeWorldVertices_VertexAttachment(se::State &s) {
    const auto &args = s.args();

    spine::VertexAttachment *vertexAttachment = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    if (nullptr == vertexAttachment) return true;

    spine::Slot *slot = nullptr;
    size_t start = 0, count = 0, offset = 0, stride = 0;
    se::Value worldVerticesVal;

    bool ok = false;
    ok = sevalue_to_native(args[0], &slot, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing slot");

    ok = sevalue_to_native(args[1], &start, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing start");
    
    ok = sevalue_to_native(args[2], &worldVerticesVal, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing vertices");

    ok = sevalue_to_native(args[3], &count, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing count");

    ok = sevalue_to_native(args[4], &offset, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing offset");
    
    ok = sevalue_to_native(args[5], &stride, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing stride");

    if (worldVerticesVal.toObject()->isTypedArray()) {
        uint8_t* ptr = nullptr;
        size_t len = 0;
        worldVerticesVal.toObject()->getTypedArrayData(&ptr, &len);
        vertexAttachment->computeWorldVertices(*slot, start, count, (float*)ptr, offset, stride);
    } else if (worldVerticesVal.toObject()->isArray()) {
        spine::Vector<float> worldVertices;
        worldVertices.ensureCapacity(count);
        vertexAttachment->computeWorldVertices(*slot, start, count, worldVertices, 0);

        int tCount = offset + (count >> 1) * stride;
        
        for (size_t i = offset, t = 0; i < tCount; i += stride, t += 2) {
            worldVerticesVal.toObject()->setArrayElement(i, se::Value(worldVertices[t]));
            worldVerticesVal.toObject()->setArrayElement(i + 1, se::Value(worldVertices[t + 1]));
        }
    }
    return true;
}
SE_BIND_FUNC(js_computeWorldVertices_VertexAttachment)

static bool js_computeWorldVertices_RegionAttachment(se::State &s) {
    const auto &args = s.args();

    spine::RegionAttachment *regionAttachment = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    if (nullptr == regionAttachment) return true;

    spine::Bone *bone = nullptr;
    size_t offset = 0, stride = 0;
    se::Value worldVerticesVal;

    bool ok = false;
    ok = sevalue_to_native(args[0], &bone, s.thisObject());
    ok = sevalue_to_native(args[1], &worldVerticesVal, s.thisObject());
    ok = sevalue_to_native(args[2], &offset, s.thisObject());
    ok = sevalue_to_native(args[3], &stride, s.thisObject());

    if (worldVerticesVal.toObject()->isTypedArray()) {
        uint8_t* ptr = nullptr;
        size_t len = 0;
        worldVerticesVal.toObject()->getTypedArrayData(&ptr, &len);
        regionAttachment->computeWorldVertices(*bone, (float*)ptr, offset, stride);
    } else if (worldVerticesVal.toObject()->isArray()) {
        spine::Vector<float> worldVertices;
        int count = 8;
        worldVertices.ensureCapacity(count);
        regionAttachment->computeWorldVertices(*bone, worldVertices, 0);

        int curr = offset;
        worldVerticesVal.toObject()->setArrayElement(curr, se::Value(worldVertices[0]));
        worldVerticesVal.toObject()->setArrayElement(curr + 1, se::Value(worldVertices[1]));

        curr += stride;
        worldVerticesVal.toObject()->setArrayElement(curr, se::Value(worldVertices[2]));
        worldVerticesVal.toObject()->setArrayElement(curr + 1, se::Value(worldVertices[3]));

        curr += stride;
        worldVerticesVal.toObject()->setArrayElement(curr, se::Value(worldVertices[4]));
        worldVerticesVal.toObject()->setArrayElement(curr + 1, se::Value(worldVertices[5]));

        curr += stride;
        worldVerticesVal.toObject()->setArrayElement(curr, se::Value(worldVertices[6]));
        worldVerticesVal.toObject()->setArrayElement(curr + 1, se::Value(worldVertices[7]));
    }
    return true;
}
SE_BIND_FUNC(js_computeWorldVertices_RegionAttachment)

static bool js_getBounds_Skeleton(se::State &s) {
    const auto &args = s.args();
    spine::Skeleton* skeleton = SE_THIS_OBJECT<spine::Skeleton>(s);
    if (nullptr == skeleton) return true;

    se::Value temp;

    bool ok = false;
    ok = sevalue_to_native(args[2], &temp, s.thisObject());

    {
        float offx, offy, sizex, sizey;
        spine::Vector<float> outVertexBuffer;
        skeleton->getBounds(offx, offy, sizex, sizey, outVertexBuffer);
        args[0].toObject()->setProperty("x", se::Value(offx));
        args[0].toObject()->setProperty("y", se::Value(offy));
        args[1].toObject()->setProperty("x", se::Value(sizex));
        args[1].toObject()->setProperty("y", se::Value(sizey));
        if (!temp.isNullOrUndefined()) {
            for (int i = 0; i < outVertexBuffer.size(); ++i) {
                temp.toObject()->setArrayElement(i, se::Value(outVertexBuffer[i]));
            }
        }
    }
    return true;
}
SE_BIND_FUNC(js_getBounds_Skeleton)

static bool js_findAttachmentsForSlot_Skin(se::State &s) {
    const auto &args = s.args();
    spine::Skin* skin = SE_THIS_OBJECT<spine::Skin>(s);
    if (nullptr == skin) return true;

    size_t slotIndex = 0;
    se::Value attachmentsVal;

    bool ok = false;
    ok = sevalue_to_native(args[0], &slotIndex, s.thisObject());
    ok = sevalue_to_native(args[1], &attachmentsVal, s.thisObject());

    spine::Vector<spine::Attachment*> attachments;
    skin->findAttachmentsForSlot(slotIndex, attachments);

    for (int i = 0; i < attachments.size(); ++i) {
        spine::Attachment* attach = attachments[i];
        spine::SkinEntry* entry = new spine::SkinEntry(slotIndex, attach->getName(), attach);
        attachmentsVal.toObject()->setArrayElement(i, se::Value(entry));
    }
    return true;
}
SE_BIND_FUNC(js_findAttachmentsForSlot_Skin)

static bool js_worldToLocal_Bone(se::State &s) {
    const auto &args = s.args();
    spine::Bone* bone = SE_THIS_OBJECT<spine::Bone>(s);
    if (nullptr == bone) return true;

    spine::Vector2 world(0, 0);

    bool ok = false;
    ok = sevalue_to_native(args[0], &world, s.thisObject());

    float outX, outY;
    bone->worldToLocal(world.x, world.y, outX, outY);

    spine::Vector2 outNative(outX, outY);
    se::Value ret;
    nativevalue_to_se(outNative, ret, s.thisObject());
    s.rval().setObject(ret.toObject());
    return true;
}
SE_BIND_FUNC(js_worldToLocal_Bone)

static bool js_localToWorld_Bone(se::State &s) {
    const auto &args = s.args();
    spine::Bone* bone = SE_THIS_OBJECT<spine::Bone>(s);
    if (nullptr == bone) return true;

    spine::Vector2 local(0, 0);

    bool ok = false;
    ok = sevalue_to_native(args[0], &local, s.thisObject());

    float outX, outY;
    bone->localToWorld(local.x, local.y, outX, outY);

    spine::Vector2 outNative(outX, outY);
    se::Value ret;
    nativevalue_to_se(outNative, ret, s.thisObject());
    s.rval().setObject(ret.toObject());
    return true;
}
SE_BIND_FUNC(js_localToWorld_Bone)

static bool js_computeWorldPosition_PointAttachment(se::State &s) {
    const auto &args = s.args();
    spine::PointAttachment* pointAttachment = SE_THIS_OBJECT<spine::PointAttachment>(s);
    if (nullptr == pointAttachment) return true;

    spine::Bone* bone = nullptr;

    bool ok = false;
    ok = sevalue_to_native(args[0], &bone, s.thisObject());

    float outX, outY;
    pointAttachment->computeWorldPosition(*bone, outX, outY);

    spine::Vector2 outNative(outX, outY);
    se::Value ret;
    nativevalue_to_se(outNative, ret, s.thisObject());
    s.rval().setObject(ret.toObject());
    return true;
}
SE_BIND_FUNC(js_computeWorldPosition_PointAttachment)

static bool js_transform_VertexEffect(se::State &s) {
    const auto &args = s.args();
    spine::VertexEffect* effect = SE_THIS_OBJECT<spine::VertexEffect>(s);
    if (nullptr == effect) return true;

    float outX, outY;
    effect->transform(outX, outY);

    args[0].toObject()->setProperty("x", se::Value(outX));
    args[0].toObject()->setProperty("y", se::Value(outY));
    return true;
}
SE_BIND_FUNC(js_transform_VertexEffect)

static bool js_transform_SwirlVertexEffect(se::State &s) {
    const auto &args = s.args();
    spine::SwirlVertexEffect* effect = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    if (nullptr == effect) return true;

    float outX, outY;
    effect->transform(outX, outY);

    args[0].toObject()->setProperty("x", se::Value(outX));
    args[0].toObject()->setProperty("y", se::Value(outY));
    return true;
}
SE_BIND_FUNC(js_transform_SwirlVertexEffect)

static bool js_transform_JitterVertexEffect(se::State &s) {
    const auto &args = s.args();
    spine::JitterVertexEffect* effect = SE_THIS_OBJECT<spine::JitterVertexEffect>(s);
    if (nullptr == effect) return true;

    float outX, outY;
    effect->transform(outX, outY);

    args[0].toObject()->setProperty("x", se::Value(outX));
    args[0].toObject()->setProperty("y", se::Value(outY));
    return true;
}
SE_BIND_FUNC(js_transform_JitterVertexEffect)

static bool js_spine_Skin_getAttachments(se::State& s) {
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    spine::Skin *skin = (spine::Skin *) NULL ;
    
    if(argc != 0) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
        return false;
    }
    skin = SE_THIS_OBJECT<spine::Skin>(s);
    if (nullptr == skin) return true;
    spine::Skin::AttachmentMap::Entries attachments = skin->getAttachments();

    ccstd::vector<spine::SkinEntry*> entryList;
    while (attachments.hasNext()) {
        spine::Skin::AttachmentMap::Entry entry = attachments.next();
        spine::SkinEntry* skinEntry = new spine::SkinEntry(entry._slotIndex, entry._name, entry._attachment);
        entryList.push_back(skinEntry);
    }
    
    se::Object *array = se::Object::createArrayObject(entryList.size());
    for (int i = 0; i < entryList.size(); ++i) {
        array->setArrayElement(i, se::Value(entryList[i]));
    }
    s.rval().setObject(array);
    
    return true;
}
SE_BIND_FUNC(js_spine_Skin_getAttachments)

static bool js_spine_VertexEffect_begin(se::State& s) {
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    spine::VertexEffect *arg1 = (spine::VertexEffect *) NULL ;
    spine::Skeleton *arg2 = 0 ;
    
    if(argc != 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
        return false;
    }
    arg1 = SE_THIS_OBJECT<spine::VertexEffect>(s);
    if (nullptr == arg1) return true;
    
    ok &= sevalue_to_native(args[0], &arg2, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    
    (arg1)->begin(*arg2);
    
    
    return true;
}
SE_BIND_FUNC(js_spine_VertexEffect_begin)

bool register_all_spine_manual(se::Object *obj) {
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("spine", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("spine", nsVal);
    }
    se::Object *ns = nsVal.toObject();

    ns->defineFunction("initSkeletonRenderer", _SE(js_register_spine_initSkeletonRenderer));
    ns->defineFunction("initSkeletonData", _SE(js_register_spine_initSkeletonData));
    ns->defineFunction("retainSkeletonData", _SE(js_register_spine_retainSkeletonData));
    ns->defineFunction("disposeSkeletonData", _SE(js_register_spine_disposeSkeletonData));

    __jsb_spine_VertexAttachment_proto->defineFunction("computeWorldVertices", _SE(js_computeWorldVertices_VertexAttachment));
    __jsb_spine_RegionAttachment_proto->defineFunction("computeWorldVertices", _SE(js_computeWorldVertices_RegionAttachment));
    __jsb_spine_Skeleton_proto->defineFunction("getBounds", _SE(js_getBounds_Skeleton));
    __jsb_spine_Skin_proto->defineFunction("getAttachmentsForSlot", _SE(js_findAttachmentsForSlot_Skin));
    __jsb_spine_Bone_proto->defineFunction("worldToLocal", _SE(js_worldToLocal_Bone));
    __jsb_spine_Bone_proto->defineFunction("localToWorld", _SE(js_localToWorld_Bone));
    __jsb_spine_PointAttachment_proto->defineFunction("computeWorldPosition", _SE(js_computeWorldPosition_PointAttachment));
    __jsb_spine_VertexEffect_proto->defineFunction("begin", _SE(js_spine_VertexEffect_begin));
    __jsb_spine_VertexEffect_proto->defineFunction("transform", _SE(js_transform_VertexEffect));
    __jsb_spine_SwirlVertexEffect_proto->defineFunction("transform", _SE(js_transform_SwirlVertexEffect));
    __jsb_spine_JitterVertexEffect_proto->defineFunction("transform", _SE(js_transform_JitterVertexEffect));
    __jsb_spine_Skin_proto->defineFunction("getAttachments", _SE(js_spine_Skin_getAttachments));

    spine::setSpineObjectDisposeCallback([](void *spineObj) {
        if (!se::NativePtrToObjectMap::isValid()) {
            return;
        }
        // Support Native Spine fo Creator V3.0
        se::NativePtrToObjectMap::forEach(spineObj, [](se::Object *seObj) {
            // Unmap native and js object since native object was destroyed.
            // Otherwise, it may trigger 'assertion' in se::Object::setPrivateData later
            // since native obj is already released and the new native object may be assigned with
            // the same address.
            seObj->setClearMappingInFinalizer(false);
        });
        se::NativePtrToObjectMap::erase(spineObj);
    });

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
        spine::SkeletonDataMgr::destroyInstance();
    });

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
