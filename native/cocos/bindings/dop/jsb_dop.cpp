/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "jsb_dop.h"

#include "BufferAllocator.h"
#include "BufferPool.h"
#include "cocos/bindings/manual/jsb_classtype.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"

/********************************************************
       BufferPool binding
   *******************************************************/
se::Class *jsb_BufferPool_class = nullptr; // NOLINT

static bool jsb_BufferPool_allocateNewChunk(se::State &s) { // NOLINT
    auto *pool = static_cast<se::BufferPool *>(s.nativeThisObject());
    SE_PRECONDITION2(pool, false, "jsb_BufferPool_allocateNewChunk : Invalid Native Object");
    s.rval().setObject(pool->allocateNewChunk());
    return true;
}
SE_BIND_FUNC(jsb_BufferPool_allocateNewChunk);

SE_DECLARE_FINALIZE_FUNC(jsb_BufferPool_finalize)

static bool jsb_BufferPool_constructor(se::State &s) { // NOLINT
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 3) {
        uint poolType      = 0;
        uint entryBits     = 0;
        uint bytesPerEntry = 0;

        bool ok = true;
        ok &= seval_to_uint32(args[0], &poolType);
        ok &= seval_to_uint32(args[1], &entryBits);
        ok &= seval_to_uint32(args[2], &bytesPerEntry);
        if (!ok) {
            SE_REPORT_ERROR("jsb_BufferPool_constructor: argument convertion error");
            return false;
        }

        se::BufferPool *pool = JSB_ALLOC(se::BufferPool, (se::PoolType)poolType, entryBits, bytesPerEntry);
        s.thisObject()->setPrivateData(pool);
        se::NonRefNativePtrCreatedByCtorMap::emplace(pool);
        return true;
    }

    SE_REPORT_ERROR("jsb_BufferPool_constructor: wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(jsb_BufferPool_constructor, jsb_BufferPool_class, jsb_BufferPool_finalize) // NOLINT

static bool jsb_BufferPool_finalize(se::State &s) { // NOLINT
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end()) {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto *cobj = static_cast<se::BufferPool *>(s.nativeThisObject());
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(jsb_BufferPool_finalize)

static bool js_register_se_BufferPool(se::Object *obj) { // NOLINT
    se::Class *cls = se::Class::create("NativeBufferPool", obj, nullptr, _SE(jsb_BufferPool_constructor));

    cls->defineFunction("allocateNewChunk", _SE(jsb_BufferPool_allocateNewChunk));
    cls->install();
    JSBClassType::registerClass<se::BufferPool>(cls);

    jsb_BufferPool_class = cls; // NOLINT

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

/*****************************************************
   Array binding
  ******************************************************/
static se::Class *jsb_BufferAllocator_class = nullptr; // NOLINT

SE_DECLARE_FINALIZE_FUNC(jsb_BufferAllocator_finalize)

static bool jsb_BufferAllocator_constructor(se::State &s) { // NOLINT
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 1) {
        uint type = 0;

        se::BufferAllocator *bufferAllocator = JSB_ALLOC(se::BufferAllocator, static_cast<se::PoolType>(type));
        s.thisObject()->setPrivateData(bufferAllocator);
        se::NonRefNativePtrCreatedByCtorMap::emplace(bufferAllocator);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(jsb_BufferAllocator_constructor, jsb_BufferAllocator_class, jsb_BufferAllocator_finalize)

static bool jsb_BufferAllocator_finalize(se::State &s) { // NOLINT
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end()) {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto *cobj = static_cast<se::BufferAllocator *>(s.nativeThisObject());
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(jsb_BufferAllocator_finalize)

static bool jsb_BufferAllocator_alloc(se::State &s) { // NOLINT
    auto *bufferAllocator = static_cast<se::BufferAllocator *>(s.nativeThisObject());
    SE_PRECONDITION2(bufferAllocator, false, "jsb_Array_alloc : Invalid Native Object");

    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 2) {
        uint index = 0;
        seval_to_uint32(args[0], &index);
        uint bytes = 0;
        seval_to_uint32(args[1], &bytes);
        s.rval().setObject(bufferAllocator->alloc(index, bytes));
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(jsb_BufferAllocator_alloc);

static bool jsb_BufferAllocator_free(se::State &s) { // NOLINT
    auto *bufferAllocator = static_cast<se::BufferAllocator *>(s.nativeThisObject());
    SE_PRECONDITION2(bufferAllocator, false, "jsb_Array_alloc : Invalid Native Object");

    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 1) {
        uint index = 0;
        seval_to_uint32(args[0], &index);
        bufferAllocator->free(index);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(jsb_BufferAllocator_free);

static bool js_register_se_BufferAllocator(se::Object *obj) { // NOLINT
    se::Class *cls = se::Class::create("NativeBufferAllocator", obj, nullptr, _SE(jsb_BufferAllocator_constructor));
    cls->defineFunction("alloc", _SE(jsb_BufferAllocator_alloc));
    cls->defineFunction("free", _SE(jsb_BufferAllocator_free));
    cls->install();
    JSBClassType::registerClass<se::BufferAllocator>(cls);

    jsb_BufferAllocator_class = cls; // NOLINT

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_dop_bindings(se::Object *obj) { // NOLINT
    // TODO(liuhang): Don't make dop into jsb namespace. Currently put it into jsb namesapce just to test codes.
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object *ns = nsVal.toObject();

    js_register_se_BufferAllocator(ns); // NOLINT
    js_register_se_BufferPool(ns);      // NOLINT
    return true;
}
