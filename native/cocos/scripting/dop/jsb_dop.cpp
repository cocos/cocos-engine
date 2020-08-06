/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#include "jsb_dop.h"

#include "BufferPool.h"
#include "ObjectPool.h"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_classtype.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.h"

se::Object *jsb_BufferPool_proto = nullptr;
se::Class *jsb_BufferPool_class = nullptr;

static bool jsb_BufferPool_allocateNewChunk(se::State &s) {
    se::BufferPool *pool = (se::BufferPool *)s.nativeThisObject();
    SE_PRECONDITION2(pool, false, "jsb_BufferPool_allocateNewChunk : Invalid Native Object");
    s.rval().setObject(pool->allocateNewChunk());
    return true;
}
SE_BIND_FUNC(jsb_BufferPool_allocateNewChunk);

SE_DECLARE_FINALIZE_FUNC(jsb_BufferPool_finalize)

static bool jsb_BufferPool_constructor(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 3) {
        uint poolType = 0;
        uint entryBits = 0;
        uint bytesPerEntry = 0;

        bool ok = true;
        ok &= seval_to_uint(args[0], &poolType);
        ok &= seval_to_uint(args[1], &entryBits);
        ok &= seval_to_uint(args[2], &bytesPerEntry);
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
SE_BIND_CTOR(jsb_BufferPool_constructor, jsb_BufferPool_class, jsb_BufferPool_finalize)

static bool jsb_BufferPool_finalize(se::State &s) {
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end()) {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        se::BufferPool *cobj = (se::BufferPool *)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(jsb_BufferPool_finalize)

bool js_register_se_BufferPool(se::Object *obj) {
    se::Class *cls = se::Class::create("NativeBufferPool", obj, nullptr, _SE(jsb_BufferPool_constructor));

    cls->defineFunction("allocateNewChunk", _SE(jsb_BufferPool_allocateNewChunk));
    cls->install();
    JSBClassType::registerClass<se::BufferPool>(cls);
    se::Object *proto = cls->getProto();

    jsb_BufferPool_proto = proto;
    jsb_BufferPool_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object *jsb_ObjectPool_proto = nullptr;
se::Class *jsb_ObjectPool_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(jsb_ObjectPool_finalize)

static bool jsb_ObjectPool_constructor(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
        if (!args[0].isObject()) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        se::Object *jsArr = args[0].toObject();

        se::ObjectPool *pool = JSB_ALLOC(se::ObjectPool, jsArr);
        s.thisObject()->setPrivateData(pool);
        se::NonRefNativePtrCreatedByCtorMap::emplace(pool);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(jsb_ObjectPool_constructor, jsb_ObjectPool_class, jsb_ObjectPool_finalize)

static bool jsb_ObjectPool_finalize(se::State &s) {
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end()) {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        se::ObjectPool *cobj = (se::ObjectPool *)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(jsb_ObjectPool_finalize)

bool js_register_se_ObjectPool(se::Object *obj) {
    se::Class *cls = se::Class::create("ObjectPool", obj, nullptr, _SE(jsb_ObjectPool_constructor));
    cls->install();
    JSBClassType::registerClass<se::ObjectPool>(cls);
    se::Object *proto = cls->getProto();

    jsb_ObjectPool_proto = proto;
    jsb_ObjectPool_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_dop_bindings(se::Object *obj) {
    // TODO: Don't make dop into jsb namespace. Currently put it into jsb namesapce just to test codes.
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object *ns = nsVal.toObject();

    js_register_se_BufferPool(ns);
    js_register_se_ObjectPool(ns);
    return true;
}
