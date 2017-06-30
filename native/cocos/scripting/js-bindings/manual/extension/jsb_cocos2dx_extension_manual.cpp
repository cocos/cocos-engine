/*
 * Created by James Chen on 3/11/13.
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include "scripting/js-bindings/manual/extension/jsb_cocos2dx_extension_manual.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include <thread>
#include <chrono>

#include "base/CCDirector.h"
#include "base/CCScheduler.h"
#include "renderer/CCTextureCache.h"

USING_NS_CC;
USING_NS_CC_EXT;

extern JSClass* jsb_cocos2d_extension_EventAssetsManagerEx_class;
extern JS::PersistentRootedObject* jsb_cocos2d_extension_EventAssetsManagerEx_prototype;

bool js_cocos2dx_extension_EventListenerAssetsManagerEx_init(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cocos2d::extension::EventListenerAssetsManagerEx* cobj = (cocos2d::extension::EventListenerAssetsManagerEx *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_cocos2dx_extension_EventListenerAssetsManagerEx_init : Invalid Native Object");
    if (argc == 2) {
        const cocos2d::extension::AssetsManagerEx* arg0 = nullptr;
        std::function<void (cocos2d::extension::EventAssetsManagerEx *)> arg1;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (const cocos2d::extension::AssetsManagerEx*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        do {
            if(JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                JS::RootedObject jsfunc(cx, args.get(1).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc, jstarget));
                auto lambda = [=](cocos2d::extension::EventAssetsManagerEx* larg0) -> void {
                    JS::RootedValue largv(cx, JS::NullValue());
                    do {
                        if (larg0) {
                            JS::RootedObject arg0Obj(cx);
                            JS::RootedObject proto(cx, jsb_cocos2d_extension_EventAssetsManagerEx_prototype->get());
                            jsb_get_or_create_weak_jsobject(cx, larg0, jsb_cocos2d_extension_EventAssetsManagerEx_class, proto, &arg0Obj, "cocos2d::extension::EventAssetsManagerEx");
                            largv = JS::ObjectOrNullValue(arg0Obj);
                        }
                    } while (0);
                    JS::HandleValueArray largsv(largv);
                    JS::RootedValue rval(cx);
                    bool succeed = func->invoke(largsv, &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg1 = lambda;
            }
            else
            {
                arg1 = nullptr;
            }
        } while(0)
            ;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventListenerAssetsManagerEx_init : Error processing arguments");
        bool ret = cobj->init(arg0, arg1);
        JS::RootedValue jsret(cx, JS::BooleanValue(ret));
        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventListenerAssetsManagerEx_init : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_cocos2dx_extension_EventListenerAssetsManagerEx_create(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 2) {
        cocos2d::extension::AssetsManagerEx* arg0 = nullptr;
        std::function<void (cocos2d::extension::EventAssetsManagerEx *)> arg1;
        JSFunctionWrapper *wrapper = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::extension::AssetsManagerEx*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        do {
            if(JS_TypeOfValue(cx, args.get(1)) == JSTYPE_FUNCTION)
            {
                JS::RootedObject jstarget(cx, args.thisv().toObjectOrNull());
                JS::RootedObject jsfunc(cx, args.get(1).toObjectOrNull());
                std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, jstarget, jsfunc));
                wrapper = func.get();
                auto lambda = [=](cocos2d::extension::EventAssetsManagerEx* larg0) -> void {
                    JS::RootedValue largv(cx, JS::NullValue());
                    do {
                        if (larg0) {
                            JS::RootedObject arg0Obj(cx);
                            JS::RootedObject proto(cx, jsb_cocos2d_extension_EventAssetsManagerEx_prototype->get());
                            jsb_get_or_create_weak_jsobject(cx, larg0, jsb_cocos2d_extension_EventAssetsManagerEx_class, proto, &arg0Obj, "cocos2d::extension::EventAssetsManagerEx");
                            largv = JS::ObjectOrNullValue(arg0Obj);
                        }
                    } while (0);
                    JS::HandleValueArray largsv(largv);
                    JS::RootedValue rval(cx);
                    bool succeed = func->invoke(largsv, &rval);
                    if (!succeed && JS_IsExceptionPending(cx)) {
                        handlePendingException(cx);
                    }
                };
                arg1 = lambda;
            }
            else
            {
                arg1 = nullptr;
            }
        } while(0)
            ;
        JSB_PRECONDITION2(ok, cx, false, "js_cocos2dx_extension_EventListenerAssetsManagerEx_create : Error processing arguments");
        cocos2d::extension::EventListenerAssetsManagerEx* ret = cocos2d::extension::EventListenerAssetsManagerEx::create(arg0, arg1);
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject jsobj(cx);
            js_get_or_create_jsobject<cocos2d::extension::EventListenerAssetsManagerEx>(cx, ret, &jsobj);
            jsret = JS::ObjectOrNullValue(jsobj);
            if (wrapper)
            {
                wrapper->setOwner(cx, jsobj);
            }
        } else {
            jsret = JS::NullValue();
        }
        args.rval().set(jsret);
        return true;
    }
    JS_ReportErrorUTF8(cx, "js_cocos2dx_extension_EventListenerAssetsManagerEx_create : wrong number of arguments");
    return false;
}

__JSDownloaderDelegator::__JSDownloaderDelegator(JSContext *cx, JS::HandleObject obj, const std::string &url, JS::HandleObject callback)
: _cx(cx)
, _url(url)
{
    _obj = obj;
    _jsCallback = callback;

    JS::RootedValue target(cx, JS::ObjectOrNullValue(obj));
    if (!target.isNullOrUndefined())
    {
        js_add_object_root(target);
    }
    target.set(JS::ObjectOrNullValue(callback));
    if (!target.isNullOrUndefined())
    {
        js_add_object_root(target);
    }
}

__JSDownloaderDelegator::~__JSDownloaderDelegator()
{
    JS::RootedValue target(_cx, JS::ObjectOrNullValue(_obj));
    if (!target.isNullOrUndefined())
    {
        js_remove_object_root(target);
    }
    target.set(JS::ObjectOrNullValue(_jsCallback));
    if (!target.isNullOrUndefined())
    {
        js_remove_object_root(target);
    }

    _downloader->onTaskError = (nullptr);
    _downloader->onDataTaskSuccess = (nullptr);
}

__JSDownloaderDelegator *__JSDownloaderDelegator::create(JSContext *cx, JS::HandleObject obj, const std::string &url, JS::HandleObject callback)
{
    __JSDownloaderDelegator *delegate = new (std::nothrow) __JSDownloaderDelegator(cx, obj, url, callback);
    delegate->autorelease();
    return delegate;
}

void __JSDownloaderDelegator::startDownload()
{
    if (auto texture = Director::getInstance()->getTextureCache()->getTextureForKey(_url))
    {
        onSuccess(texture);
    }
    else
    {
        _downloader = std::make_shared<cocos2d::network::Downloader>();
//        _downloader->setConnectionTimeout(8);
        _downloader->onTaskError = [this](const cocos2d::network::DownloadTask& task,
                                          int errorCode,
                                          int errorCodeInternal,
                                          const std::string& errorStr)
        {
            this->onError();
        };

        _downloader->onDataTaskSuccess = [this](const cocos2d::network::DownloadTask& task,
                                                std::vector<unsigned char>& data)
        {
            Image* img = new (std::nothrow) Image();
            Texture2D *tex = nullptr;
            do
            {
                if (false == img->initWithImageData(data.data(), data.size()))
                {
                    break;
                }
                tex = Director::getInstance()->getTextureCache()->addImage(img, _url);
            } while (0);
            CC_SAFE_RELEASE(img);

            if (tex)
            {
                this->onSuccess(tex);
            }
            else
            {
                this->onError();
            }
        };

        _downloader->createDownloadDataTask(_url);
    }
}

void __JSDownloaderDelegator::download()
{
    retain();
    startDownload();
}

void __JSDownloaderDelegator::downloadAsync()
{
    retain();
    auto t = std::thread(&__JSDownloaderDelegator::startDownload, this);
    t.detach();
}

void __JSDownloaderDelegator::onError()
{
    Director::getInstance()->getScheduler()->performFunctionInCocosThread([this]
    {
        JS::RootedValue callback(_cx, JS::ObjectOrNullValue(_jsCallback));
        if (!callback.isNull()) {
            JS::RootedObject global(_cx, ScriptingCore::getInstance()->getGlobalObject());
            JS::RootedValue succeed(_cx, JS::FalseHandleValue);
            JS::HandleValueArray args(succeed);
            JS::RootedValue retval(_cx);
            JS_CallFunctionValue(_cx, global, callback, args, &retval);
        }
        release();
    });
}

void __JSDownloaderDelegator::onSuccess(Texture2D *tex)
{
    CCASSERT(tex, "__JSDownloaderDelegator::onSuccess must make sure tex not null!");
    Director::getInstance()->getScheduler()->performFunctionInCocosThread([this, tex]
    {
        JS::RootedObject global(_cx, ScriptingCore::getInstance()->getGlobalObject());
        JS::AutoValueVector valArr(_cx);
        if (tex)
        {
            valArr.append(JS::BooleanValue(true));
            JS::RootedObject jsobj(_cx);
            js_get_or_create_jsobject<Texture2D>(_cx, tex, &jsobj);
            valArr.append(JS::ObjectOrNullValue(jsobj));
        }
        else
        {
            valArr.append(JS::BooleanValue(false));
            valArr.append(JS::NullValue());
        }

        JS::RootedValue callback(_cx, JS::ObjectOrNullValue(_jsCallback));
        if (!callback.isNull())
        {
            JS::RootedValue retval(_cx);
            JS::HandleValueArray args(valArr);
            JS_CallFunctionValue(_cx, global, callback, args, &retval);
        }
        release();
    });
}

// jsb.loadRemoteImg(url, function(succeed, result) {})
bool js_load_remote_image(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    if (argc == 2)
    {
        std::string url;
        bool ok = jsval_to_std_string(cx, args.get(0), &url);
        JSB_PRECONDITION2(ok, cx, false, "js_load_remote_image : Error processing arguments");
        JS::RootedObject callback(cx, args.get(1).toObjectOrNull());
        
        __JSDownloaderDelegator *delegate = __JSDownloaderDelegator::create(cx, obj, url, callback);
        delegate->downloadAsync();
        
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_load_remote_image : wrong number of arguments");
    return false;
}

using namespace std::chrono;

bool js_performance_now(JSContext *cx, uint32_t argc, JS::Value *vp)
{
	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	auto now = steady_clock::now();
	auto micro = duration_cast<microseconds>(now - ScriptingCore::getInstance()->getEngineStartTime()).count();
	args.rval().set(JS::DoubleValue((double)micro * 0.001));
	return true;
}

extern JS::PersistentRootedObject* jsb_cocos2d_extension_AssetsManagerEx_prototype;
extern JS::PersistentRootedObject* jsb_cocos2d_extension_EventListenerAssetsManagerEx_prototype;
extern JS::PersistentRootedObject* jsb_cocos2d_extension_Manifest_prototype;

void register_all_cocos2dx_extension_manual(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject ccObj(cx);
    JS::RootedObject jsbObj(cx);
    JS::RootedValue tmpVal(cx);
    JS::RootedObject tmpObj(cx);
    get_or_create_js_obj(cx, global, "cc", &ccObj);
    get_or_create_js_obj(cx, global, "jsb", &jsbObj);

    tmpObj.set(jsb_cocos2d_extension_AssetsManagerEx_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_extension_Manifest_prototype->get());
    JS_DefineFunction(cx, tmpObj, "retain", js_cocos2dx_retain, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "release", js_cocos2dx_release, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_GetProperty(cx, ccObj, "EventListenerAssetsManager", &tmpVal);
    tmpObj.set(tmpVal.toObjectOrNull());
    JS_DefineFunction(cx, tmpObj, "create", js_cocos2dx_extension_EventListenerAssetsManagerEx_create, 2, JSPROP_READONLY | JSPROP_PERMANENT);
    tmpObj.set(jsb_cocos2d_extension_EventListenerAssetsManagerEx_prototype->get());
    JS_DefineFunction(cx, tmpObj, "init", js_cocos2dx_extension_EventListenerAssetsManagerEx_init, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS_DefineFunction(cx, jsbObj, "loadRemoteImg", js_load_remote_image, 2, JSPROP_READONLY | JSPROP_PERMANENT);

    JS::RootedObject performance(cx);
    get_or_create_js_obj(cx, global, "performance", &performance);
    JS_DefineFunction(cx, performance, "now", js_performance_now, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
}
