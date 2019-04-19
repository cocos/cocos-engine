#include "scripting/js-bindings/auto/jsb_cocos2dx_network_auto.hpp"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "network/CCDownloader.h"

se::Object* __jsb_cocos2d_network_Downloader_proto = nullptr;
se::Class* __jsb_cocos2d_network_Downloader_class = nullptr;

static bool js_network_Downloader_setOnTaskProgress(se::State& s)
{
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_network_Downloader_setOnTaskProgress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (const cocos2d::network::DownloadTask &, long long, long long, long long)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const cocos2d::network::DownloadTask & larg0, long long larg1, long long larg2, long long larg3) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(4);
                    ok &= DownloadTask_to_seval(larg0, &args[0]);
                    ok &= longlong_to_seval(larg1, &args[1]);
                    ok &= longlong_to_seval(larg2, &args[2]);
                    ok &= longlong_to_seval(larg3, &args[3]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_network_Downloader_setOnTaskProgress : Error processing arguments");
        cobj->setOnTaskProgress(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_network_Downloader_setOnTaskProgress)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_network_Downloader_finalize)

static bool js_network_Downloader_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::network::DownloaderHints arg0;
            ok &= seval_to_DownloaderHints(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::network::Downloader* cobj = new (std::nothrow) cocos2d::network::Downloader(arg0);
            s.thisObject()->setPrivateData(cobj);
            se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            cocos2d::network::Downloader* cobj = new (std::nothrow) cocos2d::network::Downloader();
            s.thisObject()->setPrivateData(cobj);
            se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_network_Downloader_constructor, __jsb_cocos2d_network_Downloader_class, js_cocos2d_network_Downloader_finalize)




static bool js_cocos2d_network_Downloader_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::network::Downloader)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_network_Downloader_finalize)

bool js_register_network_Downloader(se::Object* obj)
{
    auto cls = se::Class::create("Downloader", obj, nullptr, _SE(js_network_Downloader_constructor));

    cls->defineFunction("setOnTaskProgress", _SE(js_network_Downloader_setOnTaskProgress));
    cls->defineFinalizeFunction(_SE(js_cocos2d_network_Downloader_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::network::Downloader>(cls);

    __jsb_cocos2d_network_Downloader_proto = cls->getProto();
    __jsb_cocos2d_network_Downloader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_network(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_network_Downloader(ns);
    return true;
}

#endif //#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
