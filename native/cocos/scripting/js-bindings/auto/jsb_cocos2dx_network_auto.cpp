#include "scripting/js-bindings/auto/jsb_cocos2dx_network_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "network/CCDownloader.h"

se::Object* __jsb_cocos2d_network_Downloader_proto = nullptr;
se::Class* __jsb_cocos2d_network_Downloader_class = nullptr;

static bool js_cocos2dx_network_Downloader_setOnTaskError(se::State& s)
{
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_network_Downloader_setOnTaskError : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (const cocos2d::network::DownloadTask &, int, int, const std::basic_string<char> &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const cocos2d::network::DownloadTask & larg0, int larg1, int larg2, const std::basic_string<char> & larg3) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(4);
                    ok &= DownloadTask_to_seval(larg0, &args[0]);
                    ok &= int32_to_seval(larg1, &args[1]);
                    ok &= int32_to_seval(larg2, &args[2]);
                    ok &= std_string_to_seval(larg3, &args[3]);
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_network_Downloader_setOnTaskError : Error processing arguments");
        cobj->setOnTaskError(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_network_Downloader_setOnTaskError)

static bool js_cocos2dx_network_Downloader_setOnTaskProgress(se::State& s)
{
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_network_Downloader_setOnTaskProgress : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_network_Downloader_setOnTaskProgress : Error processing arguments");
        cobj->setOnTaskProgress(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_network_Downloader_setOnTaskProgress)

static bool js_cocos2dx_network_Downloader_createDownloadFileTask(se::State& s)
{
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cocos2d::network::DownloadTask> result = cobj->createDownloadFileTask(arg0, arg1);
        ok &= DownloadTask_to_seval(*result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cocos2d::network::DownloadTask> result = cobj->createDownloadFileTask(arg0, arg1, arg2);
        ok &= DownloadTask_to_seval(*result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_network_Downloader_createDownloadFileTask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_network_Downloader_createDownloadFileTask)

static bool js_cocos2dx_network_Downloader_setOnFileTaskSuccess(se::State& s)
{
    cocos2d::network::Downloader* cobj = (cocos2d::network::Downloader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_network_Downloader_setOnFileTaskSuccess : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (const cocos2d::network::DownloadTask &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const cocos2d::network::DownloadTask & larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= DownloadTask_to_seval(larg0, &args[0]);
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
        SE_PRECONDITION2(ok, false, "js_cocos2dx_network_Downloader_setOnFileTaskSuccess : Error processing arguments");
        cobj->setOnFileTaskSuccess(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_network_Downloader_setOnFileTaskSuccess)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_network_Downloader_finalize)

static bool js_cocos2dx_network_Downloader_constructor(se::State& s)
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
SE_BIND_CTOR(js_cocos2dx_network_Downloader_constructor, __jsb_cocos2d_network_Downloader_class, js_cocos2d_network_Downloader_finalize)




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

bool js_register_cocos2dx_network_Downloader(se::Object* obj)
{
    auto cls = se::Class::create("Downloader", obj, nullptr, _SE(js_cocos2dx_network_Downloader_constructor));

    cls->defineFunction("setOnTaskError", _SE(js_cocos2dx_network_Downloader_setOnTaskError));
    cls->defineFunction("setOnTaskProgress", _SE(js_cocos2dx_network_Downloader_setOnTaskProgress));
    cls->defineFunction("createDownloadFileTask", _SE(js_cocos2dx_network_Downloader_createDownloadFileTask));
    cls->defineFunction("setOnFileTaskSuccess", _SE(js_cocos2dx_network_Downloader_setOnFileTaskSuccess));
    cls->defineFinalizeFunction(_SE(js_cocos2d_network_Downloader_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::network::Downloader>(cls);

    __jsb_cocos2d_network_Downloader_proto = cls->getProto();
    __jsb_cocos2d_network_Downloader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_network(se::Object* obj)
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

    js_register_cocos2dx_network_Downloader(ns);
    return true;
}

