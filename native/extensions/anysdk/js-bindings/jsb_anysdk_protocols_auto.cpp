#include "jsb_anysdk_protocols_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "PluginManager.h"
#include "ProtocolAnalytics.h"
#include "ProtocolIAP.h"
#include "ProtocolAds.h"
#include "ProtocolShare.h"
#include "ProtocolSocial.h"
#include "ProtocolUser.h"
#include "ProtocolPush.h"
#include "ProtocolCrash.h"
#include "ProtocolREC.h"
#include "ProtocolCustom.h"
#include "AgentManager.h"
#include "JSBRelation.h"
#include "ProtocolAdTracking.h"

se::Object* __jsb_anysdk_framework_PluginProtocol_proto = nullptr;
se::Class* __jsb_anysdk_framework_PluginProtocol_class = nullptr;

static bool js_anysdk_framework_PluginProtocol_isFunctionSupported(se::State& s)
{
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_PluginProtocol_isFunctionSupported : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginProtocol_isFunctionSupported : Error processing arguments");
        bool result = cobj->isFunctionSupported(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginProtocol_isFunctionSupported : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginProtocol_isFunctionSupported)

static bool js_anysdk_framework_PluginProtocol_getPluginName(se::State& s)
{
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_PluginProtocol_getPluginName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const char* result = cobj->getPluginName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginProtocol_getPluginName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginProtocol_getPluginName)

static bool js_anysdk_framework_PluginProtocol_getPluginVersion(se::State& s)
{
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_PluginProtocol_getPluginVersion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getPluginVersion();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginProtocol_getPluginVersion : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginProtocol_getPluginVersion)

static bool js_anysdk_framework_PluginProtocol_setPluginName(se::State& s)
{
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_PluginProtocol_setPluginName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginProtocol_setPluginName : Error processing arguments");
        cobj->setPluginName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginProtocol_setPluginName)

static bool js_anysdk_framework_PluginProtocol_getSDKVersion(se::State& s)
{
    anysdk::framework::PluginProtocol* cobj = (anysdk::framework::PluginProtocol*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_PluginProtocol_getSDKVersion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getSDKVersion();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginProtocol_getSDKVersion : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginProtocol_getSDKVersion)




bool js_register_anysdk_framework_PluginProtocol(se::Object* obj)
{
    auto cls = se::Class::create("PluginProtocol", obj, nullptr, nullptr);

    cls->defineFunction("isFunctionSupported", _SE(js_anysdk_framework_PluginProtocol_isFunctionSupported));
    cls->defineFunction("getPluginName", _SE(js_anysdk_framework_PluginProtocol_getPluginName));
    cls->defineFunction("getPluginVersion", _SE(js_anysdk_framework_PluginProtocol_getPluginVersion));
    cls->defineFunction("setPluginName", _SE(js_anysdk_framework_PluginProtocol_setPluginName));
    cls->defineFunction("getSDKVersion", _SE(js_anysdk_framework_PluginProtocol_getSDKVersion));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::PluginProtocol>(cls);

    __jsb_anysdk_framework_PluginProtocol_proto = cls->getProto();
    __jsb_anysdk_framework_PluginProtocol_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_PluginFactory_proto = nullptr;
se::Class* __jsb_anysdk_framework_PluginFactory_class = nullptr;

static bool js_anysdk_framework_PluginFactory_purgeFactory(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        anysdk::framework::PluginFactory::purgeFactory();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginFactory_purgeFactory)

static bool js_anysdk_framework_PluginFactory_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::PluginFactory* result = anysdk::framework::PluginFactory::getInstance();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::PluginFactory>((anysdk::framework::PluginFactory*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginFactory_getInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginFactory_getInstance)




bool js_register_anysdk_framework_PluginFactory(se::Object* obj)
{
    auto cls = se::Class::create("PluginFactory", obj, nullptr, nullptr);

    cls->defineStaticFunction("purgeFactory", _SE(js_anysdk_framework_PluginFactory_purgeFactory));
    cls->defineStaticFunction("getInstance", _SE(js_anysdk_framework_PluginFactory_getInstance));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::PluginFactory>(cls);

    __jsb_anysdk_framework_PluginFactory_proto = cls->getProto();
    __jsb_anysdk_framework_PluginFactory_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_PluginManager_proto = nullptr;
se::Class* __jsb_anysdk_framework_PluginManager_class = nullptr;

static bool js_anysdk_framework_PluginManager_unloadPlugin(se::State& s)
{
    anysdk::framework::PluginManager* cobj = (anysdk::framework::PluginManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_PluginManager_unloadPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginManager_unloadPlugin : Error processing arguments");
        cobj->unloadPlugin(arg0);
        return true;
    }
    if (argc == 2) {
        const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginManager_unloadPlugin : Error processing arguments");
        cobj->unloadPlugin(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginManager_unloadPlugin)

static bool js_anysdk_framework_PluginManager_loadPlugin(se::State& s)
{
    anysdk::framework::PluginManager* cobj = (anysdk::framework::PluginManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_PluginManager_loadPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginManager_loadPlugin : Error processing arguments");
        anysdk::framework::PluginProtocol* result = cobj->loadPlugin(arg0, arg1);
        ok &= native_ptr_to_rooted_seval<anysdk::framework::PluginProtocol>((anysdk::framework::PluginProtocol*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginManager_loadPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginManager_loadPlugin)

static bool js_anysdk_framework_PluginManager_end(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        anysdk::framework::PluginManager::end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginManager_end)

static bool js_anysdk_framework_PluginManager_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::PluginManager* result = anysdk::framework::PluginManager::getInstance();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::PluginManager>((anysdk::framework::PluginManager*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_PluginManager_getInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_PluginManager_getInstance)




bool js_register_anysdk_framework_PluginManager(se::Object* obj)
{
    auto cls = se::Class::create("PluginManager", obj, nullptr, nullptr);

    cls->defineFunction("unloadPlugin", _SE(js_anysdk_framework_PluginManager_unloadPlugin));
    cls->defineFunction("loadPlugin", _SE(js_anysdk_framework_PluginManager_loadPlugin));
    cls->defineStaticFunction("end", _SE(js_anysdk_framework_PluginManager_end));
    cls->defineStaticFunction("getInstance", _SE(js_anysdk_framework_PluginManager_getInstance));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::PluginManager>(cls);

    __jsb_anysdk_framework_PluginManager_proto = cls->getProto();
    __jsb_anysdk_framework_PluginManager_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolAnalytics_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolAnalytics_class = nullptr;

static bool js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin(se::State& s)
{
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin : Error processing arguments");
        cobj->logTimedEventBegin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin)

static bool js_anysdk_framework_ProtocolAnalytics_logError(se::State& s)
{
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAnalytics_logError : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        const char* arg1 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAnalytics_logError : Error processing arguments");
        cobj->logError(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAnalytics_logError)

static bool js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException(se::State& s)
{
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException : Error processing arguments");
        cobj->setCaptureUncaughtException(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException)

static bool js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis(se::State& s)
{
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        long arg0 = 0;
        ok &= seval_to_long(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis : Error processing arguments");
        cobj->setSessionContinueMillis(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis)

static bool js_anysdk_framework_ProtocolAnalytics_startSession(se::State& s)
{
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAnalytics_startSession : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->startSession();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAnalytics_startSession)

static bool js_anysdk_framework_ProtocolAnalytics_stopSession(se::State& s)
{
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAnalytics_stopSession : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSession();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAnalytics_stopSession)

static bool js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd(se::State& s)
{
    anysdk::framework::ProtocolAnalytics* cobj = (anysdk::framework::ProtocolAnalytics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd : Error processing arguments");
        cobj->logTimedEventEnd(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolAnalytics(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolAnalytics", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("logTimedEventBegin", _SE(js_anysdk_framework_ProtocolAnalytics_logTimedEventBegin));
    cls->defineFunction("logError", _SE(js_anysdk_framework_ProtocolAnalytics_logError));
    cls->defineFunction("setCaptureUncaughtException", _SE(js_anysdk_framework_ProtocolAnalytics_setCaptureUncaughtException));
    cls->defineFunction("setSessionContinueMillis", _SE(js_anysdk_framework_ProtocolAnalytics_setSessionContinueMillis));
    cls->defineFunction("startSession", _SE(js_anysdk_framework_ProtocolAnalytics_startSession));
    cls->defineFunction("stopSession", _SE(js_anysdk_framework_ProtocolAnalytics_stopSession));
    cls->defineFunction("logTimedEventEnd", _SE(js_anysdk_framework_ProtocolAnalytics_logTimedEventEnd));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolAnalytics>(cls);

    __jsb_anysdk_framework_ProtocolAnalytics_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolAnalytics_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolIAP_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolIAP_class = nullptr;

static bool js_anysdk_framework_ProtocolIAP_getPluginId(se::State& s)
{
    anysdk::framework::ProtocolIAP* cobj = (anysdk::framework::ProtocolIAP*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolIAP_getPluginId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getPluginId();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolIAP_getPluginId : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolIAP_getPluginId)

static bool js_anysdk_framework_ProtocolIAP_getOrderId(se::State& s)
{
    anysdk::framework::ProtocolIAP* cobj = (anysdk::framework::ProtocolIAP*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolIAP_getOrderId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getOrderId();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolIAP_getOrderId : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolIAP_getOrderId)

static bool js_anysdk_framework_ProtocolIAP_resetPayState(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        anysdk::framework::ProtocolIAP::resetPayState();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolIAP_resetPayState)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolIAP(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolIAP", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("getPluginId", _SE(js_anysdk_framework_ProtocolIAP_getPluginId));
    cls->defineFunction("getOrderId", _SE(js_anysdk_framework_ProtocolIAP_getOrderId));
    cls->defineStaticFunction("resetPayState", _SE(js_anysdk_framework_ProtocolIAP_resetPayState));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolIAP>(cls);

    __jsb_anysdk_framework_ProtocolIAP_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolIAP_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolAds_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolAds_class = nullptr;

static bool js_anysdk_framework_ProtocolAds_showAds(se::State& s)
{
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAds_showAds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_showAds : Error processing arguments");
        cobj->showAds(arg0);
        return true;
    }
    if (argc == 2) {
        anysdk::framework::AdsType arg0;
        int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_showAds : Error processing arguments");
        cobj->showAds(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAds_showAds)

static bool js_anysdk_framework_ProtocolAds_hideAds(se::State& s)
{
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAds_hideAds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_hideAds : Error processing arguments");
        cobj->hideAds(arg0);
        return true;
    }
    if (argc == 2) {
        anysdk::framework::AdsType arg0;
        int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_hideAds : Error processing arguments");
        cobj->hideAds(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAds_hideAds)

static bool js_anysdk_framework_ProtocolAds_queryPoints(se::State& s)
{
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAds_queryPoints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->queryPoints();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_queryPoints : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAds_queryPoints)

static bool js_anysdk_framework_ProtocolAds_isAdTypeSupported(se::State& s)
{
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAds_isAdTypeSupported : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_isAdTypeSupported : Error processing arguments");
        bool result = cobj->isAdTypeSupported(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_isAdTypeSupported : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAds_isAdTypeSupported)

static bool js_anysdk_framework_ProtocolAds_preloadAds(se::State& s)
{
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAds_preloadAds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        anysdk::framework::AdsType arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_preloadAds : Error processing arguments");
        cobj->preloadAds(arg0);
        return true;
    }
    if (argc == 2) {
        anysdk::framework::AdsType arg0;
        int arg1 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_preloadAds : Error processing arguments");
        cobj->preloadAds(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAds_preloadAds)

static bool js_anysdk_framework_ProtocolAds_spendPoints(se::State& s)
{
    anysdk::framework::ProtocolAds* cobj = (anysdk::framework::ProtocolAds*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAds_spendPoints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAds_spendPoints : Error processing arguments");
        cobj->spendPoints(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAds_spendPoints)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolAds(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolAds", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("showAds", _SE(js_anysdk_framework_ProtocolAds_showAds));
    cls->defineFunction("hideAds", _SE(js_anysdk_framework_ProtocolAds_hideAds));
    cls->defineFunction("queryPoints", _SE(js_anysdk_framework_ProtocolAds_queryPoints));
    cls->defineFunction("isAdTypeSupported", _SE(js_anysdk_framework_ProtocolAds_isAdTypeSupported));
    cls->defineFunction("preloadAds", _SE(js_anysdk_framework_ProtocolAds_preloadAds));
    cls->defineFunction("spendPoints", _SE(js_anysdk_framework_ProtocolAds_spendPoints));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolAds>(cls);

    __jsb_anysdk_framework_ProtocolAds_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolAds_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolSocial_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolSocial_class = nullptr;

static bool js_anysdk_framework_ProtocolSocial_showLeaderboard(se::State& s)
{
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolSocial_showLeaderboard : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolSocial_showLeaderboard : Error processing arguments");
        cobj->showLeaderboard(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolSocial_showLeaderboard)

static bool js_anysdk_framework_ProtocolSocial_signOut(se::State& s)
{
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolSocial_signOut : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->signOut();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolSocial_signOut)

static bool js_anysdk_framework_ProtocolSocial_showAchievements(se::State& s)
{
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolSocial_showAchievements : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->showAchievements();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolSocial_showAchievements)

static bool js_anysdk_framework_ProtocolSocial_signIn(se::State& s)
{
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolSocial_signIn : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->signIn();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolSocial_signIn)

static bool js_anysdk_framework_ProtocolSocial_submitScore(se::State& s)
{
    anysdk::framework::ProtocolSocial* cobj = (anysdk::framework::ProtocolSocial*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolSocial_submitScore : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        long arg1 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_long(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolSocial_submitScore : Error processing arguments");
        cobj->submitScore(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolSocial_submitScore)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolSocial(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolSocial", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("showLeaderboard", _SE(js_anysdk_framework_ProtocolSocial_showLeaderboard));
    cls->defineFunction("signOut", _SE(js_anysdk_framework_ProtocolSocial_signOut));
    cls->defineFunction("showAchievements", _SE(js_anysdk_framework_ProtocolSocial_showAchievements));
    cls->defineFunction("signIn", _SE(js_anysdk_framework_ProtocolSocial_signIn));
    cls->defineFunction("submitScore", _SE(js_anysdk_framework_ProtocolSocial_submitScore));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolSocial>(cls);

    __jsb_anysdk_framework_ProtocolSocial_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolSocial_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolUser_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolUser_class = nullptr;

static bool js_anysdk_framework_ProtocolUser_isLogined(se::State& s)
{
    anysdk::framework::ProtocolUser* cobj = (anysdk::framework::ProtocolUser*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolUser_isLogined : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isLogined();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolUser_isLogined : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolUser_isLogined)

static bool js_anysdk_framework_ProtocolUser_getUserID(se::State& s)
{
    anysdk::framework::ProtocolUser* cobj = (anysdk::framework::ProtocolUser*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolUser_getUserID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getUserID();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolUser_getUserID : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolUser_getUserID)

static bool js_anysdk_framework_ProtocolUser_login(se::State& s)
{
    CC_UNUSED bool ok = true;
    anysdk::framework::ProtocolUser* cobj = (anysdk::framework::ProtocolUser*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_anysdk_framework_ProtocolUser_login : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::map<std::string, std::string> arg0;
            ok &= seval_to_std_map_string_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->login(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            cobj->login();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolUser_login)

static bool js_anysdk_framework_ProtocolUser_getPluginId(se::State& s)
{
    anysdk::framework::ProtocolUser* cobj = (anysdk::framework::ProtocolUser*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolUser_getPluginId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getPluginId();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolUser_getPluginId : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolUser_getPluginId)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolUser(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolUser", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("isLogined", _SE(js_anysdk_framework_ProtocolUser_isLogined));
    cls->defineFunction("getUserID", _SE(js_anysdk_framework_ProtocolUser_getUserID));
    cls->defineFunction("login", _SE(js_anysdk_framework_ProtocolUser_login));
    cls->defineFunction("getPluginId", _SE(js_anysdk_framework_ProtocolUser_getPluginId));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolUser>(cls);

    __jsb_anysdk_framework_ProtocolUser_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolUser_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolPush_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolPush_class = nullptr;

static bool js_anysdk_framework_ProtocolPush_startPush(se::State& s)
{
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolPush_startPush : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->startPush();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolPush_startPush)

static bool js_anysdk_framework_ProtocolPush_closePush(se::State& s)
{
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolPush_closePush : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->closePush();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolPush_closePush)

static bool js_anysdk_framework_ProtocolPush_delAlias(se::State& s)
{
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolPush_delAlias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolPush_delAlias : Error processing arguments");
        cobj->delAlias(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolPush_delAlias)

static bool js_anysdk_framework_ProtocolPush_setAlias(se::State& s)
{
    anysdk::framework::ProtocolPush* cobj = (anysdk::framework::ProtocolPush*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolPush_setAlias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolPush_setAlias : Error processing arguments");
        cobj->setAlias(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolPush_setAlias)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolPush(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolPush", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("startPush", _SE(js_anysdk_framework_ProtocolPush_startPush));
    cls->defineFunction("closePush", _SE(js_anysdk_framework_ProtocolPush_closePush));
    cls->defineFunction("delAlias", _SE(js_anysdk_framework_ProtocolPush_delAlias));
    cls->defineFunction("setAlias", _SE(js_anysdk_framework_ProtocolPush_setAlias));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolPush>(cls);

    __jsb_anysdk_framework_ProtocolPush_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolPush_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolCrash_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolCrash_class = nullptr;

static bool js_anysdk_framework_ProtocolCrash_setUserIdentifier(se::State& s)
{
    anysdk::framework::ProtocolCrash* cobj = (anysdk::framework::ProtocolCrash*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolCrash_setUserIdentifier : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolCrash_setUserIdentifier : Error processing arguments");
        cobj->setUserIdentifier(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolCrash_setUserIdentifier)

static bool js_anysdk_framework_ProtocolCrash_reportException(se::State& s)
{
    anysdk::framework::ProtocolCrash* cobj = (anysdk::framework::ProtocolCrash*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolCrash_reportException : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        const char* arg1 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolCrash_reportException : Error processing arguments");
        cobj->reportException(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolCrash_reportException)

static bool js_anysdk_framework_ProtocolCrash_leaveBreadcrumb(se::State& s)
{
    anysdk::framework::ProtocolCrash* cobj = (anysdk::framework::ProtocolCrash*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolCrash_leaveBreadcrumb : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolCrash_leaveBreadcrumb : Error processing arguments");
        cobj->leaveBreadcrumb(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolCrash_leaveBreadcrumb)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolCrash(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolCrash", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("setUserIdentifier", _SE(js_anysdk_framework_ProtocolCrash_setUserIdentifier));
    cls->defineFunction("reportException", _SE(js_anysdk_framework_ProtocolCrash_reportException));
    cls->defineFunction("leaveBreadcrumb", _SE(js_anysdk_framework_ProtocolCrash_leaveBreadcrumb));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolCrash>(cls);

    __jsb_anysdk_framework_ProtocolCrash_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolCrash_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolREC_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolREC_class = nullptr;

static bool js_anysdk_framework_ProtocolREC_share(se::State& s)
{
    anysdk::framework::ProtocolREC* cobj = (anysdk::framework::ProtocolREC*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolREC_share : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::map<std::string, std::string> arg0;
        ok &= seval_to_std_map_string_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolREC_share : Error processing arguments");
        cobj->share(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolREC_share)

static bool js_anysdk_framework_ProtocolREC_startRecording(se::State& s)
{
    anysdk::framework::ProtocolREC* cobj = (anysdk::framework::ProtocolREC*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolREC_startRecording : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->startRecording();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolREC_startRecording)

static bool js_anysdk_framework_ProtocolREC_stopRecording(se::State& s)
{
    anysdk::framework::ProtocolREC* cobj = (anysdk::framework::ProtocolREC*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolREC_stopRecording : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopRecording();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolREC_stopRecording)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolREC(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolREC", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("share", _SE(js_anysdk_framework_ProtocolREC_share));
    cls->defineFunction("startRecording", _SE(js_anysdk_framework_ProtocolREC_startRecording));
    cls->defineFunction("stopRecording", _SE(js_anysdk_framework_ProtocolREC_stopRecording));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolREC>(cls);

    __jsb_anysdk_framework_ProtocolREC_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolREC_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolCustom_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolCustom_class = nullptr;


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolCustom(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolCustom", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolCustom>(cls);

    __jsb_anysdk_framework_ProtocolCustom_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolCustom_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_ProtocolAdTracking_proto = nullptr;
se::Class* __jsb_anysdk_framework_ProtocolAdTracking_class = nullptr;

static bool js_anysdk_framework_ProtocolAdTracking_onPay(se::State& s)
{
    anysdk::framework::ProtocolAdTracking* cobj = (anysdk::framework::ProtocolAdTracking*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAdTracking_onPay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::map<std::string, std::string> arg0;
        ok &= seval_to_std_map_string_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAdTracking_onPay : Error processing arguments");
        cobj->onPay(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAdTracking_onPay)

static bool js_anysdk_framework_ProtocolAdTracking_onLogin(se::State& s)
{
    anysdk::framework::ProtocolAdTracking* cobj = (anysdk::framework::ProtocolAdTracking*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAdTracking_onLogin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::map<std::string, std::string> arg0;
        ok &= seval_to_std_map_string_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAdTracking_onLogin : Error processing arguments");
        cobj->onLogin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAdTracking_onLogin)

static bool js_anysdk_framework_ProtocolAdTracking_onRegister(se::State& s)
{
    anysdk::framework::ProtocolAdTracking* cobj = (anysdk::framework::ProtocolAdTracking*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_ProtocolAdTracking_onRegister : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_ProtocolAdTracking_onRegister : Error processing arguments");
        cobj->onRegister(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_ProtocolAdTracking_onRegister)


extern se::Object* __jsb_anysdk_framework_PluginProtocol_proto;


bool js_register_anysdk_framework_ProtocolAdTracking(se::Object* obj)
{
    auto cls = se::Class::create("ProtocolAdTracking", obj, __jsb_anysdk_framework_PluginProtocol_proto, nullptr);

    cls->defineFunction("onPay", _SE(js_anysdk_framework_ProtocolAdTracking_onPay));
    cls->defineFunction("onLogin", _SE(js_anysdk_framework_ProtocolAdTracking_onLogin));
    cls->defineFunction("onRegister", _SE(js_anysdk_framework_ProtocolAdTracking_onRegister));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::ProtocolAdTracking>(cls);

    __jsb_anysdk_framework_ProtocolAdTracking_proto = cls->getProto();
    __jsb_anysdk_framework_ProtocolAdTracking_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_AgentManager_proto = nullptr;
se::Class* __jsb_anysdk_framework_AgentManager_class = nullptr;

static bool js_anysdk_framework_AgentManager_unloadAllPlugins(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_unloadAllPlugins : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->unloadAllPlugins();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_unloadAllPlugins)

static bool js_anysdk_framework_AgentManager_getSocialPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getSocialPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolSocial* result = cobj->getSocialPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolSocial>((anysdk::framework::ProtocolSocial*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getSocialPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getSocialPlugin)

static bool js_anysdk_framework_AgentManager_getPushPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getPushPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolPush* result = cobj->getPushPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolPush>((anysdk::framework::ProtocolPush*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getPushPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getPushPlugin)

static bool js_anysdk_framework_AgentManager_getUserPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getUserPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolUser* result = cobj->getUserPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolUser>((anysdk::framework::ProtocolUser*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getUserPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getUserPlugin)

static bool js_anysdk_framework_AgentManager_getAdTrackingPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getAdTrackingPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolAdTracking* result = cobj->getAdTrackingPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolAdTracking>((anysdk::framework::ProtocolAdTracking*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getAdTrackingPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getAdTrackingPlugin)

static bool js_anysdk_framework_AgentManager_getCustomPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getCustomPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolCustom* result = cobj->getCustomPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolCustom>((anysdk::framework::ProtocolCustom*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getCustomPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getCustomPlugin)

static bool js_anysdk_framework_AgentManager_getCustomParam(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getCustomParam : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getCustomParam();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getCustomParam : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getCustomParam)

static bool js_anysdk_framework_AgentManager_loadAllPlugins(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_loadAllPlugins : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->loadAllPlugins();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_loadAllPlugins)

static bool js_anysdk_framework_AgentManager_init(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_init : Error processing arguments");
        cobj->init(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_init)

static bool js_anysdk_framework_AgentManager_isAnaylticsEnabled(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_isAnaylticsEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnaylticsEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_isAnaylticsEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_isAnaylticsEnabled)

static bool js_anysdk_framework_AgentManager_getChannelId(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getChannelId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getChannelId();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getChannelId : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getChannelId)

static bool js_anysdk_framework_AgentManager_getAdsPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getAdsPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolAds* result = cobj->getAdsPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolAds>((anysdk::framework::ProtocolAds*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getAdsPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getAdsPlugin)

static bool js_anysdk_framework_AgentManager_setIsAnaylticsEnabled(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_setIsAnaylticsEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_setIsAnaylticsEnabled : Error processing arguments");
        cobj->setIsAnaylticsEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_setIsAnaylticsEnabled)

static bool js_anysdk_framework_AgentManager_getSharePlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getSharePlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolShare* result = cobj->getSharePlugin();
        ok &= native_ptr_to_seval<anysdk::framework::ProtocolShare>((anysdk::framework::ProtocolShare*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getSharePlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getSharePlugin)

static bool js_anysdk_framework_AgentManager_getAnalyticsPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getAnalyticsPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolAnalytics* result = cobj->getAnalyticsPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolAnalytics>((anysdk::framework::ProtocolAnalytics*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getAnalyticsPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getAnalyticsPlugin)

static bool js_anysdk_framework_AgentManager_getRECPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getRECPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolREC* result = cobj->getRECPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolREC>((anysdk::framework::ProtocolREC*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getRECPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getRECPlugin)

static bool js_anysdk_framework_AgentManager_getCrashPlugin(se::State& s)
{
    anysdk::framework::AgentManager* cobj = (anysdk::framework::AgentManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_anysdk_framework_AgentManager_getCrashPlugin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::ProtocolCrash* result = cobj->getCrashPlugin();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::ProtocolCrash>((anysdk::framework::ProtocolCrash*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getCrashPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getCrashPlugin)

static bool js_anysdk_framework_AgentManager_end(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        anysdk::framework::AgentManager::end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_end)

static bool js_anysdk_framework_AgentManager_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        anysdk::framework::AgentManager* result = anysdk::framework::AgentManager::getInstance();
        ok &= native_ptr_to_rooted_seval<anysdk::framework::AgentManager>((anysdk::framework::AgentManager*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_AgentManager_getInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_AgentManager_getInstance)




bool js_register_anysdk_framework_AgentManager(se::Object* obj)
{
    auto cls = se::Class::create("AgentManager", obj, nullptr, nullptr);

    cls->defineFunction("unloadAllPlugins", _SE(js_anysdk_framework_AgentManager_unloadAllPlugins));
    cls->defineFunction("getSocialPlugin", _SE(js_anysdk_framework_AgentManager_getSocialPlugin));
    cls->defineFunction("getPushPlugin", _SE(js_anysdk_framework_AgentManager_getPushPlugin));
    cls->defineFunction("getUserPlugin", _SE(js_anysdk_framework_AgentManager_getUserPlugin));
    cls->defineFunction("getAdTrackingPlugin", _SE(js_anysdk_framework_AgentManager_getAdTrackingPlugin));
    cls->defineFunction("getCustomPlugin", _SE(js_anysdk_framework_AgentManager_getCustomPlugin));
    cls->defineFunction("getCustomParam", _SE(js_anysdk_framework_AgentManager_getCustomParam));
    cls->defineFunction("loadAllPlugins", _SE(js_anysdk_framework_AgentManager_loadAllPlugins));
    cls->defineFunction("init", _SE(js_anysdk_framework_AgentManager_init));
    cls->defineFunction("isAnaylticsEnabled", _SE(js_anysdk_framework_AgentManager_isAnaylticsEnabled));
    cls->defineFunction("getChannelId", _SE(js_anysdk_framework_AgentManager_getChannelId));
    cls->defineFunction("getAdsPlugin", _SE(js_anysdk_framework_AgentManager_getAdsPlugin));
    cls->defineFunction("setIsAnaylticsEnabled", _SE(js_anysdk_framework_AgentManager_setIsAnaylticsEnabled));
    cls->defineFunction("getSharePlugin", _SE(js_anysdk_framework_AgentManager_getSharePlugin));
    cls->defineFunction("getAnalyticsPlugin", _SE(js_anysdk_framework_AgentManager_getAnalyticsPlugin));
    cls->defineFunction("getRECPlugin", _SE(js_anysdk_framework_AgentManager_getRECPlugin));
    cls->defineFunction("getCrashPlugin", _SE(js_anysdk_framework_AgentManager_getCrashPlugin));
    cls->defineStaticFunction("end", _SE(js_anysdk_framework_AgentManager_end));
    cls->defineStaticFunction("getInstance", _SE(js_anysdk_framework_AgentManager_getInstance));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::AgentManager>(cls);

    __jsb_anysdk_framework_AgentManager_proto = cls->getProto();
    __jsb_anysdk_framework_AgentManager_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_anysdk_framework_JSBRelation_proto = nullptr;
se::Class* __jsb_anysdk_framework_JSBRelation_class = nullptr;

static bool js_anysdk_framework_JSBRelation_getMethodsOfPlugin(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        anysdk::framework::PluginProtocol* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_JSBRelation_getMethodsOfPlugin : Error processing arguments");
        std::string result = anysdk::framework::JSBRelation::getMethodsOfPlugin(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_anysdk_framework_JSBRelation_getMethodsOfPlugin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_anysdk_framework_JSBRelation_getMethodsOfPlugin)




bool js_register_anysdk_framework_JSBRelation(se::Object* obj)
{
    auto cls = se::Class::create("JSBRelation", obj, nullptr, nullptr);

    cls->defineStaticFunction("getMethodsOfPlugin", _SE(js_anysdk_framework_JSBRelation_getMethodsOfPlugin));
    cls->install();
    JSBClassType::registerClass<anysdk::framework::JSBRelation>(cls);

    __jsb_anysdk_framework_JSBRelation_proto = cls->getProto();
    __jsb_anysdk_framework_JSBRelation_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_anysdk_framework(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("anysdk", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("anysdk", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_anysdk_framework_PluginProtocol(ns);
    js_register_anysdk_framework_ProtocolCustom(ns);
    js_register_anysdk_framework_ProtocolUser(ns);
    js_register_anysdk_framework_PluginFactory(ns);
    js_register_anysdk_framework_ProtocolIAP(ns);
    js_register_anysdk_framework_AgentManager(ns);
    js_register_anysdk_framework_ProtocolSocial(ns);
    js_register_anysdk_framework_ProtocolAdTracking(ns);
    js_register_anysdk_framework_ProtocolAnalytics(ns);
    js_register_anysdk_framework_ProtocolAds(ns);
    js_register_anysdk_framework_ProtocolCrash(ns);
    js_register_anysdk_framework_PluginManager(ns);
    js_register_anysdk_framework_ProtocolPush(ns);
    js_register_anysdk_framework_ProtocolREC(ns);
    js_register_anysdk_framework_JSBRelation(ns);
    return true;
}

