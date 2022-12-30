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
