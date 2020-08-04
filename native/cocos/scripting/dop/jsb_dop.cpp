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

se::Object* jsb_BufferPool_proto = nullptr;
se::Class* jsb_BufferPool_class = nullptr;

static bool jsb_BufferPool_getChunkArrayBuffer(se::State& s)
{
    se::BufferPool* pool = (se::BufferPool*)s.nativeThisObject();
    SE_PRECONDITION2(pool, false, "jsb_BufferPool_getChunkArrayBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
        size_t id = 0;
        bool ok = seval_to_size(args[0], &id);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        se::Object *ab = pool->getChunkArrayBuffer(id);
        s.rval().setObject(ab);
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(jsb_BufferPool_getChunkArrayBuffer);

SE_DECLARE_FINALIZE_FUNC(jsb_BufferPool_finalize)

static bool jsb_BufferPool_constructor(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 2)
    {
        size_t bytesPerEntry, entryBits;

        bool ok = true;
        ok &= seval_to_size(args[0], &bytesPerEntry);
        ok &= seval_to_size(args[1], &entryBits);
        if (!ok) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        se::BufferPool* pool = JSB_ALLOC(se::BufferPool, bytesPerEntry, entryBits);
        s.thisObject()->setPrivateData(pool);
        se::NonRefNativePtrCreatedByCtorMap::emplace(pool);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(jsb_BufferPool_constructor, jsb_BufferPool_class, jsb_BufferPool_finalize)

static bool jsb_BufferPool_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        se::BufferPool *cobj = (se::BufferPool*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(jsb_BufferPool_finalize)

bool js_register_se_BufferPool(se::Object* obj)
{
    se::Class *cls = se::Class::create("BufferPool", obj, nullptr, _SE(jsb_BufferPool_constructor));

    cls->defineFunction("getChunkArrayBuffer", _SE(jsb_BufferPool_getChunkArrayBuffer));
    cls->install();
    JSBClassType::registerClass<se::BufferPool>(cls);
    se::Object *proto = cls->getProto();
    
    jsb_BufferPool_proto = proto;
    jsb_BufferPool_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}


se::Object* jsb_ObjectPool_proto = nullptr;
se::Class* jsb_ObjectPool_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(jsb_ObjectPool_finalize)

static bool jsb_ObjectPool_constructor(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        if (!args[0].isObject()) {
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        se::Object *jsArr = args[0].toObject();

        se::ObjectPool* pool = JSB_ALLOC(se::ObjectPool, jsArr);
        s.thisObject()->setPrivateData(pool);
        se::NonRefNativePtrCreatedByCtorMap::emplace(pool);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(jsb_ObjectPool_constructor, jsb_ObjectPool_class, jsb_ObjectPool_finalize)

static bool jsb_ObjectPool_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        se::ObjectPool *cobj = (se::ObjectPool*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(jsb_ObjectPool_finalize)

bool js_register_se_ObjectPool(se::Object* obj)
{
    se::Class *cls = se::Class::create("ObjectPool", obj, nullptr, _SE(jsb_ObjectPool_constructor));
    cls->install();
    JSBClassType::registerClass<se::ObjectPool>(cls);
    se::Object *proto = cls->getProto();
    
    jsb_ObjectPool_proto = proto;
    jsb_ObjectPool_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_dop_bindings(se::Object* obj)
{
    js_register_se_BufferPool(obj);
    js_register_se_ObjectPool(obj);
    return true;
}
