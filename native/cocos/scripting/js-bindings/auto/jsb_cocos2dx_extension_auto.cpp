#include "scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "extensions/cocos-ext.h"

se::Object* __jsb_cocos2d_extension_EventAssetsManagerEx_proto = nullptr;
se::Class* __jsb_cocos2d_extension_EventAssetsManagerEx_class = nullptr;

static bool js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::extension::AssetsManagerEx* result = cobj->getAssetsManagerEx();
        ok &= native_ptr_to_seval<cocos2d::extension::AssetsManagerEx>((cocos2d::extension::AssetsManagerEx*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDownloadedFiles();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getTotalFiles();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getAssetId(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getAssetId();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getAssetId : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getAssetId)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getTotalBytes();
        ok &= double_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCURLECode();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getMessage(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getMessage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getMessage();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getMessage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getMessage)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCURLMCode();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getDownloadedBytes();
        ok &= double_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPercentByFile();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getEventCode(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getEventCode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getEventCode();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getEventCode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getEventCode)

static bool js_cocos2dx_extension_EventAssetsManagerEx_getPercent(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPercent();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_getPercent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_getPercent)

static bool js_cocos2dx_extension_EventAssetsManagerEx_isResuming(se::State& s)
{
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventAssetsManagerEx_isResuming : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isResuming();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_isResuming : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventAssetsManagerEx_isResuming)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_EventAssetsManagerEx_finalize)

static bool js_cocos2dx_extension_EventAssetsManagerEx_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::string arg0;
    cocos2d::extension::AssetsManagerEx* arg1 = nullptr;
    cocos2d::extension::EventAssetsManagerEx::EventCode arg2;
    ok &= seval_to_std_string(args[0], &arg0);
    ok &= seval_to_native_ptr(args[1], &arg1);
    ok &= seval_to_int32(args[2], (int32_t*)&arg2);
    SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventAssetsManagerEx_constructor : Error processing arguments");
    cocos2d::extension::EventAssetsManagerEx* cobj = new (std::nothrow) cocos2d::extension::EventAssetsManagerEx(arg0, arg1, arg2);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_EventAssetsManagerEx_constructor, __jsb_cocos2d_extension_EventAssetsManagerEx_class, js_cocos2d_extension_EventAssetsManagerEx_finalize)



extern se::Object* __jsb_cocos2d_EventCustom_proto;

static bool js_cocos2d_extension_EventAssetsManagerEx_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::EventAssetsManagerEx)", s.nativeThisObject());
    cocos2d::extension::EventAssetsManagerEx* cobj = (cocos2d::extension::EventAssetsManagerEx*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_EventAssetsManagerEx_finalize)

bool js_register_cocos2dx_extension_EventAssetsManagerEx(se::Object* obj)
{
    auto cls = se::Class::create("EventAssetsManager", obj, __jsb_cocos2d_EventCustom_proto, _SE(js_cocos2dx_extension_EventAssetsManagerEx_constructor));

    cls->defineFunction("getAssetsManagerEx", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getAssetsManagerEx));
    cls->defineFunction("getDownloadedFiles", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedFiles));
    cls->defineFunction("getTotalFiles", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getTotalFiles));
    cls->defineFunction("getAssetId", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getAssetId));
    cls->defineFunction("getTotalBytes", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getTotalBytes));
    cls->defineFunction("getCURLECode", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getCURLECode));
    cls->defineFunction("getMessage", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getMessage));
    cls->defineFunction("getCURLMCode", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getCURLMCode));
    cls->defineFunction("getDownloadedBytes", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getDownloadedBytes));
    cls->defineFunction("getPercentByFile", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getPercentByFile));
    cls->defineFunction("getEventCode", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getEventCode));
    cls->defineFunction("getPercent", _SE(js_cocos2dx_extension_EventAssetsManagerEx_getPercent));
    cls->defineFunction("isResuming", _SE(js_cocos2dx_extension_EventAssetsManagerEx_isResuming));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_EventAssetsManagerEx_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::EventAssetsManagerEx>(cls);

    __jsb_cocos2d_extension_EventAssetsManagerEx_proto = cls->getProto();
    __jsb_cocos2d_extension_EventAssetsManagerEx_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_Manifest_proto = nullptr;
se::Class* __jsb_cocos2d_extension_Manifest_class = nullptr;

static bool js_cocos2dx_extension_Manifest_getManifestRoot(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_getManifestRoot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getManifestRoot();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_getManifestRoot : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_getManifestRoot)

static bool js_cocos2dx_extension_Manifest_setUpdating(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_setUpdating : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_setUpdating : Error processing arguments");
        cobj->setUpdating(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_setUpdating)

static bool js_cocos2dx_extension_Manifest_getManifestFileUrl(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_getManifestFileUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getManifestFileUrl();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_getManifestFileUrl : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_getManifestFileUrl)

static bool js_cocos2dx_extension_Manifest_isVersionLoaded(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_isVersionLoaded : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isVersionLoaded();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_isVersionLoaded : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_isVersionLoaded)

static bool js_cocos2dx_extension_Manifest_parseFile(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_parseFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_parseFile : Error processing arguments");
        cobj->parseFile(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_parseFile)

static bool js_cocos2dx_extension_Manifest_isLoaded(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_isLoaded : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isLoaded();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_isLoaded : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_isLoaded)

static bool js_cocos2dx_extension_Manifest_getPackageUrl(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_getPackageUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getPackageUrl();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_getPackageUrl : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_getPackageUrl)

static bool js_cocos2dx_extension_Manifest_isUpdating(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_isUpdating : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUpdating();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_isUpdating : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_isUpdating)

static bool js_cocos2dx_extension_Manifest_getVersion(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_getVersion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getVersion();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_getVersion : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_getVersion)

static bool js_cocos2dx_extension_Manifest_parseJSONString(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_parseJSONString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_parseJSONString : Error processing arguments");
        cobj->parseJSONString(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_parseJSONString)

static bool js_cocos2dx_extension_Manifest_getVersionFileUrl(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_getVersionFileUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getVersionFileUrl();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_getVersionFileUrl : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_getVersionFileUrl)

static bool js_cocos2dx_extension_Manifest_getSearchPaths(se::State& s)
{
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Manifest_getSearchPaths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<std::string> result = cobj->getSearchPaths();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Manifest_getSearchPaths : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Manifest_getSearchPaths)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_Manifest_finalize)

static bool js_cocos2dx_extension_Manifest_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::extension::Manifest* cobj = new (std::nothrow) cocos2d::extension::Manifest(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            cocos2d::extension::Manifest* cobj = new (std::nothrow) cocos2d::extension::Manifest();
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::Manifest* cobj = new (std::nothrow) cocos2d::extension::Manifest(arg0);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_cocos2dx_extension_Manifest_constructor, __jsb_cocos2d_extension_Manifest_class, js_cocos2d_extension_Manifest_finalize)




static bool js_cocos2d_extension_Manifest_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::Manifest)", s.nativeThisObject());
    cocos2d::extension::Manifest* cobj = (cocos2d::extension::Manifest*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_Manifest_finalize)

bool js_register_cocos2dx_extension_Manifest(se::Object* obj)
{
    auto cls = se::Class::create("Manifest", obj, nullptr, _SE(js_cocos2dx_extension_Manifest_constructor));

    cls->defineFunction("getManifestRoot", _SE(js_cocos2dx_extension_Manifest_getManifestRoot));
    cls->defineFunction("setUpdating", _SE(js_cocos2dx_extension_Manifest_setUpdating));
    cls->defineFunction("getManifestFileUrl", _SE(js_cocos2dx_extension_Manifest_getManifestFileUrl));
    cls->defineFunction("isVersionLoaded", _SE(js_cocos2dx_extension_Manifest_isVersionLoaded));
    cls->defineFunction("parseFile", _SE(js_cocos2dx_extension_Manifest_parseFile));
    cls->defineFunction("isLoaded", _SE(js_cocos2dx_extension_Manifest_isLoaded));
    cls->defineFunction("getPackageUrl", _SE(js_cocos2dx_extension_Manifest_getPackageUrl));
    cls->defineFunction("isUpdating", _SE(js_cocos2dx_extension_Manifest_isUpdating));
    cls->defineFunction("getVersion", _SE(js_cocos2dx_extension_Manifest_getVersion));
    cls->defineFunction("parseJSONString", _SE(js_cocos2dx_extension_Manifest_parseJSONString));
    cls->defineFunction("getVersionFileUrl", _SE(js_cocos2dx_extension_Manifest_getVersionFileUrl));
    cls->defineFunction("getSearchPaths", _SE(js_cocos2dx_extension_Manifest_getSearchPaths));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_Manifest_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::Manifest>(cls);

    __jsb_cocos2d_extension_Manifest_proto = cls->getProto();
    __jsb_cocos2d_extension_Manifest_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_AssetsManagerEx_proto = nullptr;
se::Class* __jsb_cocos2d_extension_AssetsManagerEx_class = nullptr;

static bool js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDownloadedFiles();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles)

static bool js_cocos2dx_extension_AssetsManagerEx_getState(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getState();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getState)

static bool js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const int result = cobj->getMaxConcurrentTask();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask)

static bool js_cocos2dx_extension_AssetsManagerEx_getTotalFiles(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getTotalFiles();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalFiles : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getTotalFiles)

static bool js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Manifest* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest : Error processing arguments");
        bool result = cobj->loadRemoteManifest(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest)

static bool js_cocos2dx_extension_AssetsManagerEx_checkUpdate(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_checkUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->checkUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_checkUpdate)

static bool js_cocos2dx_extension_AssetsManagerEx_getTotalBytes(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getTotalBytes();
        ok &= double_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getTotalBytes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getTotalBytes)

static bool js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<bool (const std::basic_string<char> &, cocos2d::extension::ManifestAsset)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const std::basic_string<char> & larg0, cocos2d::extension::ManifestAsset larg1) -> bool {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= std_string_to_seval(larg0, &args[0]);
                    ok &= ManifestAsset_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    bool result;
                    ok &= seval_to_boolean(rval, &result);
                    SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type bool");
                    return result;
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback : Error processing arguments");
        cobj->setVerifyCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback)

static bool js_cocos2dx_extension_AssetsManagerEx_getStoragePath(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getStoragePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getStoragePath();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getStoragePath : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getStoragePath)

static bool js_cocos2dx_extension_AssetsManagerEx_update(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_update)

static bool js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<int (const std::basic_string<char> &, const std::basic_string<char> &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const std::basic_string<char> & larg0, const std::basic_string<char> & larg1) -> int {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= std_string_to_seval(larg0, &args[0]);
                    ok &= std_string_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    int result;
                    ok &= seval_to_int32(rval, (int32_t*)&result);
                    SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type int");
                    return result;
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle : Error processing arguments");
        cobj->setVersionCompareHandle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle)

static bool js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask : Error processing arguments");
        cobj->setMaxConcurrentTask(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask)

static bool js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getDownloadedBytes();
        ok &= double_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes)

static bool js_cocos2dx_extension_AssetsManagerEx_getLocalManifest(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getLocalManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::extension::Manifest* result = cobj->getLocalManifest();
        ok &= native_ptr_to_seval<cocos2d::extension::Manifest>((cocos2d::extension::Manifest*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getLocalManifest : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getLocalManifest)

static bool js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->loadLocalManifest(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            cocos2d::extension::Manifest* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->loadLocalManifest(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest)

static bool js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::extension::Manifest* result = cobj->getRemoteManifest();
        ok &= native_ptr_to_seval<cocos2d::extension::Manifest>((cocos2d::extension::Manifest*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest)

static bool js_cocos2dx_extension_AssetsManagerEx_prepareUpdate(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_prepareUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->prepareUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_prepareUpdate)

static bool js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->downloadFailedAssets();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets)

static bool js_cocos2dx_extension_AssetsManagerEx_isResuming(se::State& s)
{
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_AssetsManagerEx_isResuming : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isResuming();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_isResuming : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_isResuming)

static bool js_cocos2dx_extension_AssetsManagerEx_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_AssetsManagerEx_create : Error processing arguments");
        auto result = cocos2d::extension::AssetsManagerEx::create(arg0, arg1);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_AssetsManagerEx_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_AssetsManagerEx_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_AssetsManagerEx_finalize)

static bool js_cocos2dx_extension_AssetsManagerEx_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::function<int (const std::basic_string<char> &, const std::basic_string<char> &)> arg2;
            do {
                if (args[2].isObject() && args[2].toObject()->isFunction())
                {
                    se::Value jsThis(s.thisObject());
                    se::Value jsFunc(args[2]);
                    jsThis.toObject()->attachObject(jsFunc.toObject());
                    auto lambda = [=](const std::basic_string<char> & larg0, const std::basic_string<char> & larg1) -> int {
                        se::ScriptEngine::getInstance()->clearException();
                        se::AutoHandleScope hs;
            
                        CC_UNUSED bool ok = true;
                        se::ValueArray args;
                        args.resize(2);
                        ok &= std_string_to_seval(larg0, &args[0]);
                        ok &= std_string_to_seval(larg1, &args[1]);
                        se::Value rval;
                        se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                        se::Object* funcObj = jsFunc.toObject();
                        bool succeed = funcObj->call(args, thisObj, &rval);
                        if (!succeed) {
                            se::ScriptEngine::getInstance()->clearException();
                        }
                        int result;
                        ok &= seval_to_int32(rval, (int32_t*)&result);
                        SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type int");
                        return result;
                    };
                    arg2 = lambda;
                }
                else
                {
                    arg2 = nullptr;
                }
            } while(false)
            ;
            if (!ok) { ok = true; break; }
            cocos2d::extension::AssetsManagerEx* cobj = new (std::nothrow) cocos2d::extension::AssetsManagerEx(arg0, arg1, arg2);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::extension::AssetsManagerEx* cobj = new (std::nothrow) cocos2d::extension::AssetsManagerEx(arg0, arg1);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_cocos2dx_extension_AssetsManagerEx_constructor, __jsb_cocos2d_extension_AssetsManagerEx_class, js_cocos2d_extension_AssetsManagerEx_finalize)




static bool js_cocos2d_extension_AssetsManagerEx_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::AssetsManagerEx)", s.nativeThisObject());
    cocos2d::extension::AssetsManagerEx* cobj = (cocos2d::extension::AssetsManagerEx*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_AssetsManagerEx_finalize)

bool js_register_cocos2dx_extension_AssetsManagerEx(se::Object* obj)
{
    auto cls = se::Class::create("AssetsManager", obj, nullptr, _SE(js_cocos2dx_extension_AssetsManagerEx_constructor));

    cls->defineFunction("getDownloadedFiles", _SE(js_cocos2dx_extension_AssetsManagerEx_getDownloadedFiles));
    cls->defineFunction("getState", _SE(js_cocos2dx_extension_AssetsManagerEx_getState));
    cls->defineFunction("getMaxConcurrentTask", _SE(js_cocos2dx_extension_AssetsManagerEx_getMaxConcurrentTask));
    cls->defineFunction("getTotalFiles", _SE(js_cocos2dx_extension_AssetsManagerEx_getTotalFiles));
    cls->defineFunction("loadRemoteManifest", _SE(js_cocos2dx_extension_AssetsManagerEx_loadRemoteManifest));
    cls->defineFunction("checkUpdate", _SE(js_cocos2dx_extension_AssetsManagerEx_checkUpdate));
    cls->defineFunction("getTotalBytes", _SE(js_cocos2dx_extension_AssetsManagerEx_getTotalBytes));
    cls->defineFunction("setVerifyCallback", _SE(js_cocos2dx_extension_AssetsManagerEx_setVerifyCallback));
    cls->defineFunction("getStoragePath", _SE(js_cocos2dx_extension_AssetsManagerEx_getStoragePath));
    cls->defineFunction("update", _SE(js_cocos2dx_extension_AssetsManagerEx_update));
    cls->defineFunction("setVersionCompareHandle", _SE(js_cocos2dx_extension_AssetsManagerEx_setVersionCompareHandle));
    cls->defineFunction("setMaxConcurrentTask", _SE(js_cocos2dx_extension_AssetsManagerEx_setMaxConcurrentTask));
    cls->defineFunction("getDownloadedBytes", _SE(js_cocos2dx_extension_AssetsManagerEx_getDownloadedBytes));
    cls->defineFunction("getLocalManifest", _SE(js_cocos2dx_extension_AssetsManagerEx_getLocalManifest));
    cls->defineFunction("loadLocalManifest", _SE(js_cocos2dx_extension_AssetsManagerEx_loadLocalManifest));
    cls->defineFunction("getRemoteManifest", _SE(js_cocos2dx_extension_AssetsManagerEx_getRemoteManifest));
    cls->defineFunction("prepareUpdate", _SE(js_cocos2dx_extension_AssetsManagerEx_prepareUpdate));
    cls->defineFunction("downloadFailedAssets", _SE(js_cocos2dx_extension_AssetsManagerEx_downloadFailedAssets));
    cls->defineFunction("isResuming", _SE(js_cocos2dx_extension_AssetsManagerEx_isResuming));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_AssetsManagerEx_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_AssetsManagerEx_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::AssetsManagerEx>(cls);

    __jsb_cocos2d_extension_AssetsManagerEx_proto = cls->getProto();
    __jsb_cocos2d_extension_AssetsManagerEx_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_EventListenerAssetsManagerEx_proto = nullptr;
se::Class* __jsb_cocos2d_extension_EventListenerAssetsManagerEx_class = nullptr;

static bool js_cocos2dx_extension_EventListenerAssetsManagerEx_init(se::State& s)
{
    cocos2d::extension::EventListenerAssetsManagerEx* cobj = (cocos2d::extension::EventListenerAssetsManagerEx*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_EventListenerAssetsManagerEx_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const cocos2d::extension::AssetsManagerEx* arg0 = nullptr;
        std::function<void (cocos2d::extension::EventAssetsManagerEx *)> arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](cocos2d::extension::EventAssetsManagerEx* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= native_ptr_to_seval<cocos2d::extension::EventAssetsManagerEx>((cocos2d::extension::EventAssetsManagerEx*)larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1 = lambda;
            }
            else
            {
                arg1 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventListenerAssetsManagerEx_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventListenerAssetsManagerEx_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventListenerAssetsManagerEx_init)

static bool js_cocos2dx_extension_EventListenerAssetsManagerEx_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::extension::AssetsManagerEx* arg0 = nullptr;
        std::function<void (cocos2d::extension::EventAssetsManagerEx *)> arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsFunc.toObject()->root();
                auto lambda = [=](cocos2d::extension::EventAssetsManagerEx* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= native_ptr_to_seval<cocos2d::extension::EventAssetsManagerEx>((cocos2d::extension::EventAssetsManagerEx*)larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1 = lambda;
            }
            else
            {
                arg1 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_EventListenerAssetsManagerEx_create : Error processing arguments");
        auto result = cocos2d::extension::EventListenerAssetsManagerEx::create(arg0, arg1);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_EventListenerAssetsManagerEx_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_EventListenerAssetsManagerEx_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_EventListenerAssetsManagerEx_finalize)

static bool js_cocos2dx_extension_EventListenerAssetsManagerEx_constructor(se::State& s)
{
    cocos2d::extension::EventListenerAssetsManagerEx* cobj = new (std::nothrow) cocos2d::extension::EventListenerAssetsManagerEx();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_EventListenerAssetsManagerEx_constructor, __jsb_cocos2d_extension_EventListenerAssetsManagerEx_class, js_cocos2d_extension_EventListenerAssetsManagerEx_finalize)



extern se::Object* __jsb_cocos2d_EventListenerCustom_proto;

static bool js_cocos2d_extension_EventListenerAssetsManagerEx_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::EventListenerAssetsManagerEx)", s.nativeThisObject());
    cocos2d::extension::EventListenerAssetsManagerEx* cobj = (cocos2d::extension::EventListenerAssetsManagerEx*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_EventListenerAssetsManagerEx_finalize)

bool js_register_cocos2dx_extension_EventListenerAssetsManagerEx(se::Object* obj)
{
    auto cls = se::Class::create("EventListenerAssetsManager", obj, __jsb_cocos2d_EventListenerCustom_proto, _SE(js_cocos2dx_extension_EventListenerAssetsManagerEx_constructor));

    cls->defineFunction("init", _SE(js_cocos2dx_extension_EventListenerAssetsManagerEx_init));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_EventListenerAssetsManagerEx_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_EventListenerAssetsManagerEx_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::EventListenerAssetsManagerEx>(cls);

    __jsb_cocos2d_extension_EventListenerAssetsManagerEx_proto = cls->getProto();
    __jsb_cocos2d_extension_EventListenerAssetsManagerEx_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_Control_proto = nullptr;
se::Class* __jsb_cocos2d_extension_Control_class = nullptr;

static bool js_cocos2dx_extension_Control_setEnabled(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_setEnabled)

static bool js_cocos2dx_extension_Control_getState(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getState();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_getState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_getState)

static bool js_cocos2dx_extension_Control_sendActionsForControlEvents(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_sendActionsForControlEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::EventType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_sendActionsForControlEvents : Error processing arguments");
        cobj->sendActionsForControlEvents(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_sendActionsForControlEvents)

static bool js_cocos2dx_extension_Control_setSelected(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_setSelected : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_setSelected : Error processing arguments");
        cobj->setSelected(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_setSelected)

static bool js_cocos2dx_extension_Control_isEnabled(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_isEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_isEnabled)

static bool js_cocos2dx_extension_Control_needsLayout(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_needsLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->needsLayout();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_needsLayout)

static bool js_cocos2dx_extension_Control_hasVisibleParents(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_hasVisibleParents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->hasVisibleParents();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_hasVisibleParents : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_hasVisibleParents)

static bool js_cocos2dx_extension_Control_isSelected(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_isSelected : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isSelected();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_isSelected : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_isSelected)

static bool js_cocos2dx_extension_Control_isTouchInside(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_isTouchInside : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_isTouchInside : Error processing arguments");
        bool result = cobj->isTouchInside(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_isTouchInside : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_isTouchInside)

static bool js_cocos2dx_extension_Control_setHighlighted(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_setHighlighted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_setHighlighted : Error processing arguments");
        cobj->setHighlighted(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_setHighlighted)

static bool js_cocos2dx_extension_Control_getTouchLocation(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_getTouchLocation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_getTouchLocation : Error processing arguments");
        cocos2d::Vec2 result = cobj->getTouchLocation(arg0);
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_getTouchLocation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_getTouchLocation)

static bool js_cocos2dx_extension_Control_isHighlighted(se::State& s)
{
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_Control_isHighlighted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isHighlighted();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_Control_isHighlighted : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_isHighlighted)

static bool js_cocos2dx_extension_Control_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::extension::Control::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_Control_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_Control_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_Control_finalize)

static bool js_cocos2dx_extension_Control_constructor(se::State& s)
{
    cocos2d::extension::Control* cobj = new (std::nothrow) cocos2d::extension::Control();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_Control_constructor, __jsb_cocos2d_extension_Control_class, js_cocos2d_extension_Control_finalize)



extern se::Object* __jsb_cocos2d_Layer_proto;

static bool js_cocos2d_extension_Control_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::Control)", s.nativeThisObject());
    cocos2d::extension::Control* cobj = (cocos2d::extension::Control*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_Control_finalize)

bool js_register_cocos2dx_extension_Control(se::Object* obj)
{
    auto cls = se::Class::create("Control", obj, __jsb_cocos2d_Layer_proto, _SE(js_cocos2dx_extension_Control_constructor));

    cls->defineFunction("setEnabled", _SE(js_cocos2dx_extension_Control_setEnabled));
    cls->defineFunction("getState", _SE(js_cocos2dx_extension_Control_getState));
    cls->defineFunction("sendActionsForControlEvents", _SE(js_cocos2dx_extension_Control_sendActionsForControlEvents));
    cls->defineFunction("setSelected", _SE(js_cocos2dx_extension_Control_setSelected));
    cls->defineFunction("isEnabled", _SE(js_cocos2dx_extension_Control_isEnabled));
    cls->defineFunction("needsLayout", _SE(js_cocos2dx_extension_Control_needsLayout));
    cls->defineFunction("hasVisibleParents", _SE(js_cocos2dx_extension_Control_hasVisibleParents));
    cls->defineFunction("isSelected", _SE(js_cocos2dx_extension_Control_isSelected));
    cls->defineFunction("isTouchInside", _SE(js_cocos2dx_extension_Control_isTouchInside));
    cls->defineFunction("setHighlighted", _SE(js_cocos2dx_extension_Control_setHighlighted));
    cls->defineFunction("getTouchLocation", _SE(js_cocos2dx_extension_Control_getTouchLocation));
    cls->defineFunction("isHighlighted", _SE(js_cocos2dx_extension_Control_isHighlighted));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_Control_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_Control_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::Control>(cls);

    __jsb_cocos2d_extension_Control_proto = cls->getProto();
    __jsb_cocos2d_extension_Control_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlButton_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlButton_class = nullptr;

static bool js_cocos2dx_extension_ControlButton_isPushed(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_isPushed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPushed();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_isPushed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_isPushed)

static bool js_cocos2dx_extension_ControlButton_setTitleLabelForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setTitleLabelForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setTitleLabelForState : Error processing arguments");
        cobj->setTitleLabelForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setTitleLabelForState)

static bool js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage : Error processing arguments");
        cobj->setAdjustBackgroundImage(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage)

static bool js_cocos2dx_extension_ControlButton_setTitleForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setTitleForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setTitleForState : Error processing arguments");
        cobj->setTitleForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setTitleForState)

static bool js_cocos2dx_extension_ControlButton_setLabelAnchorPoint(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setLabelAnchorPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setLabelAnchorPoint : Error processing arguments");
        cobj->setLabelAnchorPoint(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setLabelAnchorPoint)

static bool js_cocos2dx_extension_ControlButton_getLabelAnchorPoint(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getLabelAnchorPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getLabelAnchorPoint();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getLabelAnchorPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getLabelAnchorPoint)

static bool js_cocos2dx_extension_ControlButton_initWithBackgroundSprite(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_initWithBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Scale9Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_initWithBackgroundSprite : Error processing arguments");
        bool result = cobj->initWithBackgroundSprite(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_initWithBackgroundSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_initWithBackgroundSprite)

static bool js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState : Error processing arguments");
        float result = cobj->getTitleTTFSizeForState(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState)

static bool js_cocos2dx_extension_ControlButton_setTitleTTFForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setTitleTTFForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setTitleTTFForState : Error processing arguments");
        cobj->setTitleTTFForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setTitleTTFForState)

static bool js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState : Error processing arguments");
        cobj->setTitleTTFSizeForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState)

static bool js_cocos2dx_extension_ControlButton_setTitleLabel(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setTitleLabel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setTitleLabel : Error processing arguments");
        cobj->setTitleLabel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setTitleLabel)

static bool js_cocos2dx_extension_ControlButton_setPreferredSize(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setPreferredSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setPreferredSize : Error processing arguments");
        cobj->setPreferredSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setPreferredSize)

static bool js_cocos2dx_extension_ControlButton_getCurrentTitleColor(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getCurrentTitleColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getCurrentTitleColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getCurrentTitleColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getCurrentTitleColor)

static bool js_cocos2dx_extension_ControlButton_setZoomOnTouchDown(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setZoomOnTouchDown : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setZoomOnTouchDown : Error processing arguments");
        cobj->setZoomOnTouchDown(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setZoomOnTouchDown)

static bool js_cocos2dx_extension_ControlButton_setBackgroundSprite(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Scale9Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setBackgroundSprite : Error processing arguments");
        cobj->setBackgroundSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setBackgroundSprite)

static bool js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState : Error processing arguments");
        cocos2d::ui::Scale9Sprite* result = cobj->getBackgroundSpriteForState(arg0);
        ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState)

static bool js_cocos2dx_extension_ControlButton_getHorizontalOrigin(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getHorizontalOrigin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getHorizontalOrigin();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getHorizontalOrigin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getHorizontalOrigin)

static bool js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        float arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize : Error processing arguments");
        bool result = cobj->initWithTitleAndFontNameAndFontSize(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize)

static bool js_cocos2dx_extension_ControlButton_setTitleBMFontForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setTitleBMFontForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setTitleBMFontForState : Error processing arguments");
        cobj->setTitleBMFontForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setTitleBMFontForState)

static bool js_cocos2dx_extension_ControlButton_getScaleRatio(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getScaleRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getScaleRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getScaleRatio)

static bool js_cocos2dx_extension_ControlButton_getTitleTTFForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getTitleTTFForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleTTFForState : Error processing arguments");
        const std::string& result = cobj->getTitleTTFForState(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleTTFForState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getTitleTTFForState)

static bool js_cocos2dx_extension_ControlButton_getBackgroundSprite(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Scale9Sprite* result = cobj->getBackgroundSprite();
        ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getBackgroundSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getBackgroundSprite)

static bool js_cocos2dx_extension_ControlButton_getTitleColorForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getTitleColorForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleColorForState : Error processing arguments");
        cocos2d::Color3B result = cobj->getTitleColorForState(arg0);
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleColorForState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getTitleColorForState)

static bool js_cocos2dx_extension_ControlButton_setTitleColorForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setTitleColorForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Color3B arg0;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_Color3B(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setTitleColorForState : Error processing arguments");
        cobj->setTitleColorForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setTitleColorForState)

static bool js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->doesAdjustBackgroundImage();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage)

static bool js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::SpriteFrame* arg0 = nullptr;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState : Error processing arguments");
        cobj->setBackgroundSpriteFrameForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState)

static bool js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Scale9Sprite* arg0 = nullptr;
        cocos2d::extension::Control::State arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState : Error processing arguments");
        cobj->setBackgroundSpriteForState(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState)

static bool js_cocos2dx_extension_ControlButton_setScaleRatio(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setScaleRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setScaleRatio : Error processing arguments");
        cobj->setScaleRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setScaleRatio)

static bool js_cocos2dx_extension_ControlButton_getTitleBMFontForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getTitleBMFontForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleBMFontForState : Error processing arguments");
        const std::string& result = cobj->getTitleBMFontForState(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleBMFontForState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getTitleBMFontForState)

static bool js_cocos2dx_extension_ControlButton_getTitleLabel(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getTitleLabel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Node* result = cobj->getTitleLabel();
        ok &= native_ptr_to_seval<cocos2d::Node>((cocos2d::Node*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleLabel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getTitleLabel)

static bool js_cocos2dx_extension_ControlButton_getPreferredSize(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getPreferredSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Size& result = cobj->getPreferredSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getPreferredSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getPreferredSize)

static bool js_cocos2dx_extension_ControlButton_getVerticalMargin(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getVerticalMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getVerticalMargin();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getVerticalMargin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getVerticalMargin)

static bool js_cocos2dx_extension_ControlButton_getTitleLabelForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getTitleLabelForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleLabelForState : Error processing arguments");
        cocos2d::Node* result = cobj->getTitleLabelForState(arg0);
        ok &= native_ptr_to_seval<cocos2d::Node>((cocos2d::Node*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleLabelForState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getTitleLabelForState)

static bool js_cocos2dx_extension_ControlButton_setMargins(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_setMargins : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        int arg0 = 0;
        int arg1 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_setMargins : Error processing arguments");
        cobj->setMargins(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_setMargins)

static bool js_cocos2dx_extension_ControlButton_getCurrentTitle(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_extension_ControlButton_getCurrentTitle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            std::string result = cobj->getCurrentTitle();
            ok &= std_string_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getCurrentTitle : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            const std::string& result = cobj->getCurrentTitle();
            ok &= std_string_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getCurrentTitle : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getCurrentTitle)

static bool js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::ui::Scale9Sprite* arg1 = nullptr;
        bool arg2;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite : Error processing arguments");
        bool result = cobj->initWithLabelAndBackgroundSprite(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite)

static bool js_cocos2dx_extension_ControlButton_getZoomOnTouchDown(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getZoomOnTouchDown : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getZoomOnTouchDown();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getZoomOnTouchDown : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getZoomOnTouchDown)

static bool js_cocos2dx_extension_ControlButton_getTitleForState(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlButton_getTitleForState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::Control::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleForState : Error processing arguments");
        std::string result = cobj->getTitleForState(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_getTitleForState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_getTitleForState)

static bool js_cocos2dx_extension_ControlButton_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::ui::Scale9Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlButton* result = cocos2d::extension::ControlButton::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlButton>((cocos2d::extension::ControlButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::extension::ControlButton* result = cocos2d::extension::ControlButton::create();
            ok &= native_ptr_to_seval<cocos2d::extension::ControlButton>((cocos2d::extension::ControlButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            cocos2d::Node* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlButton* result = cocos2d::extension::ControlButton::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlButton>((cocos2d::extension::ControlButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlButton* result = cocos2d::extension::ControlButton::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlButton>((cocos2d::extension::ControlButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            cocos2d::Node* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool arg2;
            ok &= seval_to_boolean(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlButton* result = cocos2d::extension::ControlButton::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlButton>((cocos2d::extension::ControlButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlButton_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlButton_finalize)

static bool js_cocos2dx_extension_ControlButton_constructor(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = new (std::nothrow) cocos2d::extension::ControlButton();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlButton_constructor, __jsb_cocos2d_extension_ControlButton_class, js_cocos2d_extension_ControlButton_finalize)

static bool js_cocos2dx_extension_ControlButton_ctor(se::State& s)
{
    cocos2d::extension::ControlButton* cobj = new (std::nothrow) cocos2d::extension::ControlButton();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_ControlButton_ctor, __jsb_cocos2d_extension_ControlButton_class, js_cocos2d_extension_ControlButton_finalize)


    

extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlButton_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlButton)", s.nativeThisObject());
    cocos2d::extension::ControlButton* cobj = (cocos2d::extension::ControlButton*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlButton_finalize)

bool js_register_cocos2dx_extension_ControlButton(se::Object* obj)
{
    auto cls = se::Class::create("ControlButton", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlButton_constructor));

    cls->defineFunction("isPushed", _SE(js_cocos2dx_extension_ControlButton_isPushed));
    cls->defineFunction("setTitleLabelForState", _SE(js_cocos2dx_extension_ControlButton_setTitleLabelForState));
    cls->defineFunction("setAdjustBackgroundImage", _SE(js_cocos2dx_extension_ControlButton_setAdjustBackgroundImage));
    cls->defineFunction("setTitleForState", _SE(js_cocos2dx_extension_ControlButton_setTitleForState));
    cls->defineFunction("setLabelAnchorPoint", _SE(js_cocos2dx_extension_ControlButton_setLabelAnchorPoint));
    cls->defineFunction("getLabelAnchorPoint", _SE(js_cocos2dx_extension_ControlButton_getLabelAnchorPoint));
    cls->defineFunction("initWithBackgroundSprite", _SE(js_cocos2dx_extension_ControlButton_initWithBackgroundSprite));
    cls->defineFunction("getTitleTTFSizeForState", _SE(js_cocos2dx_extension_ControlButton_getTitleTTFSizeForState));
    cls->defineFunction("setTitleTTFForState", _SE(js_cocos2dx_extension_ControlButton_setTitleTTFForState));
    cls->defineFunction("setTitleTTFSizeForState", _SE(js_cocos2dx_extension_ControlButton_setTitleTTFSizeForState));
    cls->defineFunction("setTitleLabel", _SE(js_cocos2dx_extension_ControlButton_setTitleLabel));
    cls->defineFunction("setPreferredSize", _SE(js_cocos2dx_extension_ControlButton_setPreferredSize));
    cls->defineFunction("getCurrentTitleColor", _SE(js_cocos2dx_extension_ControlButton_getCurrentTitleColor));
    cls->defineFunction("setZoomOnTouchDown", _SE(js_cocos2dx_extension_ControlButton_setZoomOnTouchDown));
    cls->defineFunction("setBackgroundSprite", _SE(js_cocos2dx_extension_ControlButton_setBackgroundSprite));
    cls->defineFunction("getBackgroundSpriteForState", _SE(js_cocos2dx_extension_ControlButton_getBackgroundSpriteForState));
    cls->defineFunction("getHorizontalOrigin", _SE(js_cocos2dx_extension_ControlButton_getHorizontalOrigin));
    cls->defineFunction("initWithTitleAndFontNameAndFontSize", _SE(js_cocos2dx_extension_ControlButton_initWithTitleAndFontNameAndFontSize));
    cls->defineFunction("setTitleBMFontForState", _SE(js_cocos2dx_extension_ControlButton_setTitleBMFontForState));
    cls->defineFunction("getScaleRatio", _SE(js_cocos2dx_extension_ControlButton_getScaleRatio));
    cls->defineFunction("getTitleTTFForState", _SE(js_cocos2dx_extension_ControlButton_getTitleTTFForState));
    cls->defineFunction("getBackgroundSprite", _SE(js_cocos2dx_extension_ControlButton_getBackgroundSprite));
    cls->defineFunction("getTitleColorForState", _SE(js_cocos2dx_extension_ControlButton_getTitleColorForState));
    cls->defineFunction("setTitleColorForState", _SE(js_cocos2dx_extension_ControlButton_setTitleColorForState));
    cls->defineFunction("doesAdjustBackgroundImage", _SE(js_cocos2dx_extension_ControlButton_doesAdjustBackgroundImage));
    cls->defineFunction("setBackgroundSpriteFrameForState", _SE(js_cocos2dx_extension_ControlButton_setBackgroundSpriteFrameForState));
    cls->defineFunction("setBackgroundSpriteForState", _SE(js_cocos2dx_extension_ControlButton_setBackgroundSpriteForState));
    cls->defineFunction("setScaleRatio", _SE(js_cocos2dx_extension_ControlButton_setScaleRatio));
    cls->defineFunction("getTitleBMFontForState", _SE(js_cocos2dx_extension_ControlButton_getTitleBMFontForState));
    cls->defineFunction("getTitleLabel", _SE(js_cocos2dx_extension_ControlButton_getTitleLabel));
    cls->defineFunction("getPreferredSize", _SE(js_cocos2dx_extension_ControlButton_getPreferredSize));
    cls->defineFunction("getVerticalMargin", _SE(js_cocos2dx_extension_ControlButton_getVerticalMargin));
    cls->defineFunction("getTitleLabelForState", _SE(js_cocos2dx_extension_ControlButton_getTitleLabelForState));
    cls->defineFunction("setMargins", _SE(js_cocos2dx_extension_ControlButton_setMargins));
    cls->defineFunction("getCurrentTitle", _SE(js_cocos2dx_extension_ControlButton_getCurrentTitle));
    cls->defineFunction("initWithLabelAndBackgroundSprite", _SE(js_cocos2dx_extension_ControlButton_initWithLabelAndBackgroundSprite));
    cls->defineFunction("getZoomOnTouchDown", _SE(js_cocos2dx_extension_ControlButton_getZoomOnTouchDown));
    cls->defineFunction("getTitleForState", _SE(js_cocos2dx_extension_ControlButton_getTitleForState));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_ControlButton_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlButton_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlButton_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlButton>(cls);

    __jsb_cocos2d_extension_ControlButton_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlButton_class = cls;

    jsb_set_extend_property("cc", "ControlButton");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlHuePicker_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlHuePicker_class = nullptr;

static bool js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos : Error processing arguments");
        bool result = cobj->initWithTargetAndPos(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos)

static bool js_cocos2dx_extension_ControlHuePicker_setHue(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_setHue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_setHue : Error processing arguments");
        cobj->setHue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_setHue)

static bool js_cocos2dx_extension_ControlHuePicker_getStartPos(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_getStartPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getStartPos();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_getStartPos : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_getStartPos)

static bool js_cocos2dx_extension_ControlHuePicker_getHue(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_getHue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_getHue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_getHue)

static bool js_cocos2dx_extension_ControlHuePicker_getSlider(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_getSlider : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getSlider();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_getSlider : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_getSlider)

static bool js_cocos2dx_extension_ControlHuePicker_setBackground(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_setBackground : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_setBackground : Error processing arguments");
        cobj->setBackground(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_setBackground)

static bool js_cocos2dx_extension_ControlHuePicker_setHuePercentage(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_setHuePercentage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_setHuePercentage : Error processing arguments");
        cobj->setHuePercentage(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_setHuePercentage)

static bool js_cocos2dx_extension_ControlHuePicker_getBackground(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_getBackground : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getBackground();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_getBackground : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_getBackground)

static bool js_cocos2dx_extension_ControlHuePicker_getHuePercentage(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_getHuePercentage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHuePercentage();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_getHuePercentage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_getHuePercentage)

static bool js_cocos2dx_extension_ControlHuePicker_setSlider(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlHuePicker_setSlider : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_setSlider : Error processing arguments");
        cobj->setSlider(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_setSlider)

static bool js_cocos2dx_extension_ControlHuePicker_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlHuePicker_create : Error processing arguments");
        auto result = cocos2d::extension::ControlHuePicker::create(arg0, arg1);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_ControlHuePicker_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlHuePicker_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlHuePicker_finalize)

static bool js_cocos2dx_extension_ControlHuePicker_constructor(se::State& s)
{
    cocos2d::extension::ControlHuePicker* cobj = new (std::nothrow) cocos2d::extension::ControlHuePicker();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlHuePicker_constructor, __jsb_cocos2d_extension_ControlHuePicker_class, js_cocos2d_extension_ControlHuePicker_finalize)



extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlHuePicker_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlHuePicker)", s.nativeThisObject());
    cocos2d::extension::ControlHuePicker* cobj = (cocos2d::extension::ControlHuePicker*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlHuePicker_finalize)

bool js_register_cocos2dx_extension_ControlHuePicker(se::Object* obj)
{
    auto cls = se::Class::create("ControlHuePicker", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlHuePicker_constructor));

    cls->defineFunction("initWithTargetAndPos", _SE(js_cocos2dx_extension_ControlHuePicker_initWithTargetAndPos));
    cls->defineFunction("setHue", _SE(js_cocos2dx_extension_ControlHuePicker_setHue));
    cls->defineFunction("getStartPos", _SE(js_cocos2dx_extension_ControlHuePicker_getStartPos));
    cls->defineFunction("getHue", _SE(js_cocos2dx_extension_ControlHuePicker_getHue));
    cls->defineFunction("getSlider", _SE(js_cocos2dx_extension_ControlHuePicker_getSlider));
    cls->defineFunction("setBackground", _SE(js_cocos2dx_extension_ControlHuePicker_setBackground));
    cls->defineFunction("setHuePercentage", _SE(js_cocos2dx_extension_ControlHuePicker_setHuePercentage));
    cls->defineFunction("getBackground", _SE(js_cocos2dx_extension_ControlHuePicker_getBackground));
    cls->defineFunction("getHuePercentage", _SE(js_cocos2dx_extension_ControlHuePicker_getHuePercentage));
    cls->defineFunction("setSlider", _SE(js_cocos2dx_extension_ControlHuePicker_setSlider));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlHuePicker_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlHuePicker_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlHuePicker>(cls);

    __jsb_cocos2d_extension_ControlHuePicker_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlHuePicker_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlSaturationBrightnessPicker_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class = nullptr;

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getShadow();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos : Error processing arguments");
        bool result = cobj->initWithTargetAndPos(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getStartPos();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getOverlay();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getSlider();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getBackground();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSaturation();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getBrightness();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Node* arg0 = nullptr;
        cocos2d::Vec2 arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSaturationBrightnessPicker_create : Error processing arguments");
        auto result = cocos2d::extension::ControlSaturationBrightnessPicker::create(arg0, arg1);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSaturationBrightnessPicker_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlSaturationBrightnessPicker_finalize)

static bool js_cocos2dx_extension_ControlSaturationBrightnessPicker_constructor(se::State& s)
{
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = new (std::nothrow) cocos2d::extension::ControlSaturationBrightnessPicker();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlSaturationBrightnessPicker_constructor, __jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class, js_cocos2d_extension_ControlSaturationBrightnessPicker_finalize)



extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlSaturationBrightnessPicker_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlSaturationBrightnessPicker)", s.nativeThisObject());
    cocos2d::extension::ControlSaturationBrightnessPicker* cobj = (cocos2d::extension::ControlSaturationBrightnessPicker*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlSaturationBrightnessPicker_finalize)

bool js_register_cocos2dx_extension_ControlSaturationBrightnessPicker(se::Object* obj)
{
    auto cls = se::Class::create("ControlSaturationBrightnessPicker", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_constructor));

    cls->defineFunction("getShadow", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getShadow));
    cls->defineFunction("initWithTargetAndPos", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_initWithTargetAndPos));
    cls->defineFunction("getStartPos", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getStartPos));
    cls->defineFunction("getOverlay", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getOverlay));
    cls->defineFunction("getSlider", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSlider));
    cls->defineFunction("getBackground", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBackground));
    cls->defineFunction("getSaturation", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getSaturation));
    cls->defineFunction("getBrightness", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_getBrightness));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlSaturationBrightnessPicker_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlSaturationBrightnessPicker_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlSaturationBrightnessPicker>(cls);

    __jsb_cocos2d_extension_ControlSaturationBrightnessPicker_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlSaturationBrightnessPicker_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlColourPicker_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlColourPicker_class = nullptr;

static bool js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Ref* arg0 = nullptr;
        cocos2d::extension::Control::EventType arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged : Error processing arguments");
        cobj->hueSliderValueChanged(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged)

static bool js_cocos2dx_extension_ControlColourPicker_getHuePicker(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_getHuePicker : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::extension::ControlHuePicker* result = cobj->getHuePicker();
        ok &= native_ptr_to_seval<cocos2d::extension::ControlHuePicker>((cocos2d::extension::ControlHuePicker*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_getHuePicker : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_getHuePicker)

static bool js_cocos2dx_extension_ControlColourPicker_getcolourPicker(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_getcolourPicker : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::extension::ControlSaturationBrightnessPicker* result = cobj->getcolourPicker();
        ok &= native_ptr_to_seval<cocos2d::extension::ControlSaturationBrightnessPicker>((cocos2d::extension::ControlSaturationBrightnessPicker*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_getcolourPicker : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_getcolourPicker)

static bool js_cocos2dx_extension_ControlColourPicker_setBackground(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_setBackground : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_setBackground : Error processing arguments");
        cobj->setBackground(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_setBackground)

static bool js_cocos2dx_extension_ControlColourPicker_setcolourPicker(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_setcolourPicker : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::ControlSaturationBrightnessPicker* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_setcolourPicker : Error processing arguments");
        cobj->setcolourPicker(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_setcolourPicker)

static bool js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Ref* arg0 = nullptr;
        cocos2d::extension::Control::EventType arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged : Error processing arguments");
        cobj->colourSliderValueChanged(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged)

static bool js_cocos2dx_extension_ControlColourPicker_setHuePicker(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_setHuePicker : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::ControlHuePicker* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_setHuePicker : Error processing arguments");
        cobj->setHuePicker(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_setHuePicker)

static bool js_cocos2dx_extension_ControlColourPicker_getBackground(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlColourPicker_getBackground : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getBackground();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlColourPicker_getBackground : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_getBackground)

static bool js_cocos2dx_extension_ControlColourPicker_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::extension::ControlColourPicker::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_ControlColourPicker_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlColourPicker_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlColourPicker_finalize)

static bool js_cocos2dx_extension_ControlColourPicker_constructor(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = new (std::nothrow) cocos2d::extension::ControlColourPicker();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlColourPicker_constructor, __jsb_cocos2d_extension_ControlColourPicker_class, js_cocos2d_extension_ControlColourPicker_finalize)

static bool js_cocos2dx_extension_ControlColourPicker_ctor(se::State& s)
{
    cocos2d::extension::ControlColourPicker* cobj = new (std::nothrow) cocos2d::extension::ControlColourPicker();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_ControlColourPicker_ctor, __jsb_cocos2d_extension_ControlColourPicker_class, js_cocos2d_extension_ControlColourPicker_finalize)


    

extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlColourPicker_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlColourPicker)", s.nativeThisObject());
    cocos2d::extension::ControlColourPicker* cobj = (cocos2d::extension::ControlColourPicker*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlColourPicker_finalize)

bool js_register_cocos2dx_extension_ControlColourPicker(se::Object* obj)
{
    auto cls = se::Class::create("ControlColourPicker", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlColourPicker_constructor));

    cls->defineFunction("hueSliderValueChanged", _SE(js_cocos2dx_extension_ControlColourPicker_hueSliderValueChanged));
    cls->defineFunction("getHuePicker", _SE(js_cocos2dx_extension_ControlColourPicker_getHuePicker));
    cls->defineFunction("getcolourPicker", _SE(js_cocos2dx_extension_ControlColourPicker_getcolourPicker));
    cls->defineFunction("setBackground", _SE(js_cocos2dx_extension_ControlColourPicker_setBackground));
    cls->defineFunction("setcolourPicker", _SE(js_cocos2dx_extension_ControlColourPicker_setcolourPicker));
    cls->defineFunction("colourSliderValueChanged", _SE(js_cocos2dx_extension_ControlColourPicker_colourSliderValueChanged));
    cls->defineFunction("setHuePicker", _SE(js_cocos2dx_extension_ControlColourPicker_setHuePicker));
    cls->defineFunction("getBackground", _SE(js_cocos2dx_extension_ControlColourPicker_getBackground));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_ControlColourPicker_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlColourPicker_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlColourPicker_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlColourPicker>(cls);

    __jsb_cocos2d_extension_ControlColourPicker_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlColourPicker_class = cls;

    jsb_set_extend_property("cc", "ControlColourPicker");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlPotentiometer_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlPotentiometer_class = nullptr;

static bool js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation : Error processing arguments");
        cobj->setPreviousLocation(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation)

static bool js_cocos2dx_extension_ControlPotentiometer_setValue(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_setValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_setValue : Error processing arguments");
        cobj->setValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_setValue)

static bool js_cocos2dx_extension_ControlPotentiometer_getProgressTimer(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_getProgressTimer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ProgressTimer* result = cobj->getProgressTimer();
        ok &= native_ptr_to_seval<cocos2d::ProgressTimer>((cocos2d::ProgressTimer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_getProgressTimer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_getProgressTimer)

static bool js_cocos2dx_extension_ControlPotentiometer_getMaximumValue(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_getMaximumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMaximumValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_getMaximumValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_getMaximumValue)

static bool js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::Vec2 arg0;
        cocos2d::Vec2 arg1;
        cocos2d::Vec2 arg2;
        cocos2d::Vec2 arg3;
        ok &= seval_to_Vec2(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        ok &= seval_to_Vec2(args[2], &arg2);
        ok &= seval_to_Vec2(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint : Error processing arguments");
        float result = cobj->angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(arg0, arg1, arg2, arg3);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint)

static bool js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan : Error processing arguments");
        cobj->potentiometerBegan(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan)

static bool js_cocos2dx_extension_ControlPotentiometer_setMaximumValue(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_setMaximumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_setMaximumValue : Error processing arguments");
        cobj->setMaximumValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_setMaximumValue)

static bool js_cocos2dx_extension_ControlPotentiometer_getMinimumValue(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_getMinimumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMinimumValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_getMinimumValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_getMinimumValue)

static bool js_cocos2dx_extension_ControlPotentiometer_setThumbSprite(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_setThumbSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_setThumbSprite : Error processing arguments");
        cobj->setThumbSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_setThumbSprite)

static bool js_cocos2dx_extension_ControlPotentiometer_getValue(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_getValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_getValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_getValue)

static bool js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getPreviousLocation();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation)

static bool js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        cocos2d::Vec2 arg1;
        ok &= seval_to_Vec2(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint : Error processing arguments");
        float result = cobj->distanceBetweenPointAndPoint(arg0, arg1);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint)

static bool js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded : Error processing arguments");
        cobj->potentiometerEnded(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded)

static bool js_cocos2dx_extension_ControlPotentiometer_setProgressTimer(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_setProgressTimer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ProgressTimer* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_setProgressTimer : Error processing arguments");
        cobj->setProgressTimer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_setProgressTimer)

static bool js_cocos2dx_extension_ControlPotentiometer_setMinimumValue(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_setMinimumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_setMinimumValue : Error processing arguments");
        cobj->setMinimumValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_setMinimumValue)

static bool js_cocos2dx_extension_ControlPotentiometer_getThumbSprite(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_getThumbSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getThumbSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_getThumbSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_getThumbSprite)

static bool js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::Sprite* arg0 = nullptr;
        cocos2d::ProgressTimer* arg1 = nullptr;
        cocos2d::Sprite* arg2 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite : Error processing arguments");
        bool result = cobj->initWithTrackSprite_ProgressTimer_ThumbSprite(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite)

static bool js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved : Error processing arguments");
        cobj->potentiometerMoved(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved)

static bool js_cocos2dx_extension_ControlPotentiometer_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        const char* arg0 = nullptr;
        const char* arg1 = nullptr;
        const char* arg2 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
        std::string arg2_tmp; ok &= seval_to_std_string(args[2], &arg2_tmp); arg2 = arg2_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlPotentiometer_create : Error processing arguments");
        auto result = cocos2d::extension::ControlPotentiometer::create(arg0, arg1, arg2);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_ControlPotentiometer_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlPotentiometer_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlPotentiometer_finalize)

static bool js_cocos2dx_extension_ControlPotentiometer_constructor(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = new (std::nothrow) cocos2d::extension::ControlPotentiometer();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlPotentiometer_constructor, __jsb_cocos2d_extension_ControlPotentiometer_class, js_cocos2d_extension_ControlPotentiometer_finalize)

static bool js_cocos2dx_extension_ControlPotentiometer_ctor(se::State& s)
{
    cocos2d::extension::ControlPotentiometer* cobj = new (std::nothrow) cocos2d::extension::ControlPotentiometer();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_ControlPotentiometer_ctor, __jsb_cocos2d_extension_ControlPotentiometer_class, js_cocos2d_extension_ControlPotentiometer_finalize)


    

extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlPotentiometer_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlPotentiometer)", s.nativeThisObject());
    cocos2d::extension::ControlPotentiometer* cobj = (cocos2d::extension::ControlPotentiometer*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlPotentiometer_finalize)

bool js_register_cocos2dx_extension_ControlPotentiometer(se::Object* obj)
{
    auto cls = se::Class::create("ControlPotentiometer", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlPotentiometer_constructor));

    cls->defineFunction("setPreviousLocation", _SE(js_cocos2dx_extension_ControlPotentiometer_setPreviousLocation));
    cls->defineFunction("setValue", _SE(js_cocos2dx_extension_ControlPotentiometer_setValue));
    cls->defineFunction("getProgressTimer", _SE(js_cocos2dx_extension_ControlPotentiometer_getProgressTimer));
    cls->defineFunction("getMaximumValue", _SE(js_cocos2dx_extension_ControlPotentiometer_getMaximumValue));
    cls->defineFunction("angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint", _SE(js_cocos2dx_extension_ControlPotentiometer_angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint));
    cls->defineFunction("potentiometerBegan", _SE(js_cocos2dx_extension_ControlPotentiometer_potentiometerBegan));
    cls->defineFunction("setMaximumValue", _SE(js_cocos2dx_extension_ControlPotentiometer_setMaximumValue));
    cls->defineFunction("getMinimumValue", _SE(js_cocos2dx_extension_ControlPotentiometer_getMinimumValue));
    cls->defineFunction("setThumbSprite", _SE(js_cocos2dx_extension_ControlPotentiometer_setThumbSprite));
    cls->defineFunction("getValue", _SE(js_cocos2dx_extension_ControlPotentiometer_getValue));
    cls->defineFunction("getPreviousLocation", _SE(js_cocos2dx_extension_ControlPotentiometer_getPreviousLocation));
    cls->defineFunction("distanceBetweenPointAndPoint", _SE(js_cocos2dx_extension_ControlPotentiometer_distanceBetweenPointAndPoint));
    cls->defineFunction("potentiometerEnded", _SE(js_cocos2dx_extension_ControlPotentiometer_potentiometerEnded));
    cls->defineFunction("setProgressTimer", _SE(js_cocos2dx_extension_ControlPotentiometer_setProgressTimer));
    cls->defineFunction("setMinimumValue", _SE(js_cocos2dx_extension_ControlPotentiometer_setMinimumValue));
    cls->defineFunction("getThumbSprite", _SE(js_cocos2dx_extension_ControlPotentiometer_getThumbSprite));
    cls->defineFunction("initWithTrackSprite_ProgressTimer_ThumbSprite", _SE(js_cocos2dx_extension_ControlPotentiometer_initWithTrackSprite_ProgressTimer_ThumbSprite));
    cls->defineFunction("potentiometerMoved", _SE(js_cocos2dx_extension_ControlPotentiometer_potentiometerMoved));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_ControlPotentiometer_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlPotentiometer_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlPotentiometer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlPotentiometer>(cls);

    __jsb_cocos2d_extension_ControlPotentiometer_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlPotentiometer_class = cls;

    jsb_set_extend_property("cc", "ControlPotentiometer");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlSlider_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlSlider_class = nullptr;

static bool js_cocos2dx_extension_ControlSlider_setBackgroundSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setBackgroundSprite : Error processing arguments");
        cobj->setBackgroundSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setBackgroundSprite)

static bool js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMaximumAllowedValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue)

static bool js_cocos2dx_extension_ControlSlider_initWithSprites(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_extension_ControlSlider_initWithSprites : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSprites(arg0, arg1, arg2, arg3);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_initWithSprites : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSprites(arg0, arg1, arg2);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_initWithSprites : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_initWithSprites)

static bool js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMinimumAllowedValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue)

static bool js_cocos2dx_extension_ControlSlider_getMaximumValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getMaximumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMaximumValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getMaximumValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getMaximumValue)

static bool js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getSelectedThumbSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite)

static bool js_cocos2dx_extension_ControlSlider_setProgressSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setProgressSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setProgressSprite : Error processing arguments");
        cobj->setProgressSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setProgressSprite)

static bool js_cocos2dx_extension_ControlSlider_setMaximumValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setMaximumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setMaximumValue : Error processing arguments");
        cobj->setMaximumValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setMaximumValue)

static bool js_cocos2dx_extension_ControlSlider_getMinimumValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getMinimumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMinimumValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getMinimumValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getMinimumValue)

static bool js_cocos2dx_extension_ControlSlider_setThumbSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setThumbSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setThumbSprite : Error processing arguments");
        cobj->setThumbSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setThumbSprite)

static bool js_cocos2dx_extension_ControlSlider_getValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getValue();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getValue)

static bool js_cocos2dx_extension_ControlSlider_getBackgroundSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getBackgroundSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getBackgroundSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getBackgroundSprite)

static bool js_cocos2dx_extension_ControlSlider_getThumbSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getThumbSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getThumbSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getThumbSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getThumbSprite)

static bool js_cocos2dx_extension_ControlSlider_setValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setValue : Error processing arguments");
        cobj->setValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setValue)

static bool js_cocos2dx_extension_ControlSlider_locationFromTouch(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_locationFromTouch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_locationFromTouch : Error processing arguments");
        cocos2d::Vec2 result = cobj->locationFromTouch(arg0);
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_locationFromTouch : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_locationFromTouch)

static bool js_cocos2dx_extension_ControlSlider_setMinimumValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setMinimumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setMinimumValue : Error processing arguments");
        cobj->setMinimumValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setMinimumValue)

static bool js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue : Error processing arguments");
        cobj->setMinimumAllowedValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue)

static bool js_cocos2dx_extension_ControlSlider_getProgressSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_getProgressSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getProgressSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_getProgressSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_getProgressSprite)

static bool js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite : Error processing arguments");
        cobj->setSelectedThumbSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite)

static bool js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue : Error processing arguments");
        cobj->setMaximumAllowedValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue)

static bool js_cocos2dx_extension_ControlSlider_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* result = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlSlider>((cocos2d::extension::ControlSlider*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg1 = nullptr;
            std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg2 = nullptr;
            std::string arg2_tmp; ok &= seval_to_std_string(args[2], &arg2_tmp); arg2 = arg2_tmp.c_str();
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* result = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlSlider>((cocos2d::extension::ControlSlider*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 4) {
            const char* arg0 = nullptr;
            std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg1 = nullptr;
            std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg2 = nullptr;
            std::string arg2_tmp; ok &= seval_to_std_string(args[2], &arg2_tmp); arg2 = arg2_tmp.c_str();
            if (!ok) { ok = true; break; }
            const char* arg3 = nullptr;
            std::string arg3_tmp; ok &= seval_to_std_string(args[3], &arg3_tmp); arg3 = arg3_tmp.c_str();
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* result = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2, arg3);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlSlider>((cocos2d::extension::ControlSlider*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSlider* result = cocos2d::extension::ControlSlider::create(arg0, arg1, arg2, arg3);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlSlider>((cocos2d::extension::ControlSlider*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSlider_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSlider_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlSlider_finalize)

static bool js_cocos2dx_extension_ControlSlider_constructor(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = new (std::nothrow) cocos2d::extension::ControlSlider();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlSlider_constructor, __jsb_cocos2d_extension_ControlSlider_class, js_cocos2d_extension_ControlSlider_finalize)

static bool js_cocos2dx_extension_ControlSlider_ctor(se::State& s)
{
    cocos2d::extension::ControlSlider* cobj = new (std::nothrow) cocos2d::extension::ControlSlider();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_ControlSlider_ctor, __jsb_cocos2d_extension_ControlSlider_class, js_cocos2d_extension_ControlSlider_finalize)


    

extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlSlider_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlSlider)", s.nativeThisObject());
    cocos2d::extension::ControlSlider* cobj = (cocos2d::extension::ControlSlider*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlSlider_finalize)

bool js_register_cocos2dx_extension_ControlSlider(se::Object* obj)
{
    auto cls = se::Class::create("ControlSlider", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlSlider_constructor));

    cls->defineFunction("setBackgroundSprite", _SE(js_cocos2dx_extension_ControlSlider_setBackgroundSprite));
    cls->defineFunction("getMaximumAllowedValue", _SE(js_cocos2dx_extension_ControlSlider_getMaximumAllowedValue));
    cls->defineFunction("initWithSprites", _SE(js_cocos2dx_extension_ControlSlider_initWithSprites));
    cls->defineFunction("getMinimumAllowedValue", _SE(js_cocos2dx_extension_ControlSlider_getMinimumAllowedValue));
    cls->defineFunction("getMaximumValue", _SE(js_cocos2dx_extension_ControlSlider_getMaximumValue));
    cls->defineFunction("getSelectedThumbSprite", _SE(js_cocos2dx_extension_ControlSlider_getSelectedThumbSprite));
    cls->defineFunction("setProgressSprite", _SE(js_cocos2dx_extension_ControlSlider_setProgressSprite));
    cls->defineFunction("setMaximumValue", _SE(js_cocos2dx_extension_ControlSlider_setMaximumValue));
    cls->defineFunction("getMinimumValue", _SE(js_cocos2dx_extension_ControlSlider_getMinimumValue));
    cls->defineFunction("setThumbSprite", _SE(js_cocos2dx_extension_ControlSlider_setThumbSprite));
    cls->defineFunction("getValue", _SE(js_cocos2dx_extension_ControlSlider_getValue));
    cls->defineFunction("getBackgroundSprite", _SE(js_cocos2dx_extension_ControlSlider_getBackgroundSprite));
    cls->defineFunction("getThumbSprite", _SE(js_cocos2dx_extension_ControlSlider_getThumbSprite));
    cls->defineFunction("setValue", _SE(js_cocos2dx_extension_ControlSlider_setValue));
    cls->defineFunction("locationFromTouch", _SE(js_cocos2dx_extension_ControlSlider_locationFromTouch));
    cls->defineFunction("setMinimumValue", _SE(js_cocos2dx_extension_ControlSlider_setMinimumValue));
    cls->defineFunction("setMinimumAllowedValue", _SE(js_cocos2dx_extension_ControlSlider_setMinimumAllowedValue));
    cls->defineFunction("getProgressSprite", _SE(js_cocos2dx_extension_ControlSlider_getProgressSprite));
    cls->defineFunction("setSelectedThumbSprite", _SE(js_cocos2dx_extension_ControlSlider_setSelectedThumbSprite));
    cls->defineFunction("setMaximumAllowedValue", _SE(js_cocos2dx_extension_ControlSlider_setMaximumAllowedValue));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_ControlSlider_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlSlider_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlSlider_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlSlider>(cls);

    __jsb_cocos2d_extension_ControlSlider_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlSlider_class = cls;

    jsb_set_extend_property("cc", "ControlSlider");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlStepper_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlStepper_class = nullptr;

static bool js_cocos2dx_extension_ControlStepper_getMinusSprite(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_getMinusSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getMinusSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_getMinusSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_getMinusSprite)

static bool js_cocos2dx_extension_ControlStepper_setValue(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        double arg0 = 0;
        ok &= seval_to_double(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setValue : Error processing arguments");
        cobj->setValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setValue)

static bool js_cocos2dx_extension_ControlStepper_setStepValue(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setStepValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        double arg0 = 0;
        ok &= seval_to_double(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setStepValue : Error processing arguments");
        cobj->setStepValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setStepValue)

static bool js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Sprite* arg0 = nullptr;
        cocos2d::Sprite* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite : Error processing arguments");
        bool result = cobj->initWithMinusSpriteAndPlusSprite(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite)

static bool js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        double arg0 = 0;
        bool arg1;
        ok &= seval_to_double(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent : Error processing arguments");
        cobj->setValueWithSendingEvent(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent)

static bool js_cocos2dx_extension_ControlStepper_setMaximumValue(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setMaximumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        double arg0 = 0;
        ok &= seval_to_double(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setMaximumValue : Error processing arguments");
        cobj->setMaximumValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setMaximumValue)

static bool js_cocos2dx_extension_ControlStepper_getMinusLabel(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_getMinusLabel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Label* result = cobj->getMinusLabel();
        ok &= native_ptr_to_seval<cocos2d::Label>((cocos2d::Label*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_getMinusLabel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_getMinusLabel)

static bool js_cocos2dx_extension_ControlStepper_getPlusLabel(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_getPlusLabel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Label* result = cobj->getPlusLabel();
        ok &= native_ptr_to_seval<cocos2d::Label>((cocos2d::Label*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_getPlusLabel : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_getPlusLabel)

static bool js_cocos2dx_extension_ControlStepper_setWraps(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setWraps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setWraps : Error processing arguments");
        cobj->setWraps(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setWraps)

static bool js_cocos2dx_extension_ControlStepper_setMinusLabel(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setMinusLabel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Label* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setMinusLabel : Error processing arguments");
        cobj->setMinusLabel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setMinusLabel)

static bool js_cocos2dx_extension_ControlStepper_startAutorepeat(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_startAutorepeat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->startAutorepeat();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_startAutorepeat)

static bool js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation : Error processing arguments");
        cobj->updateLayoutUsingTouchLocation(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation)

static bool js_cocos2dx_extension_ControlStepper_isContinuous(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_isContinuous : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isContinuous();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_isContinuous : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_isContinuous)

static bool js_cocos2dx_extension_ControlStepper_stopAutorepeat(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_stopAutorepeat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopAutorepeat();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_stopAutorepeat)

static bool js_cocos2dx_extension_ControlStepper_setMinimumValue(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setMinimumValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        double arg0 = 0;
        ok &= seval_to_double(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setMinimumValue : Error processing arguments");
        cobj->setMinimumValue(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setMinimumValue)

static bool js_cocos2dx_extension_ControlStepper_setPlusLabel(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setPlusLabel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Label* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setPlusLabel : Error processing arguments");
        cobj->setPlusLabel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setPlusLabel)

static bool js_cocos2dx_extension_ControlStepper_getValue(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_getValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getValue();
        ok &= double_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_getValue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_getValue)

static bool js_cocos2dx_extension_ControlStepper_getPlusSprite(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_getPlusSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getPlusSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_getPlusSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_getPlusSprite)

static bool js_cocos2dx_extension_ControlStepper_setPlusSprite(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setPlusSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setPlusSprite : Error processing arguments");
        cobj->setPlusSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setPlusSprite)

static bool js_cocos2dx_extension_ControlStepper_setMinusSprite(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlStepper_setMinusSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Sprite* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_setMinusSprite : Error processing arguments");
        cobj->setMinusSprite(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_setMinusSprite)

static bool js_cocos2dx_extension_ControlStepper_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Sprite* arg0 = nullptr;
        cocos2d::Sprite* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlStepper_create : Error processing arguments");
        auto result = cocos2d::extension::ControlStepper::create(arg0, arg1);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_ControlStepper_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlStepper_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlStepper_finalize)

static bool js_cocos2dx_extension_ControlStepper_constructor(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = new (std::nothrow) cocos2d::extension::ControlStepper();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlStepper_constructor, __jsb_cocos2d_extension_ControlStepper_class, js_cocos2d_extension_ControlStepper_finalize)

static bool js_cocos2dx_extension_ControlStepper_ctor(se::State& s)
{
    cocos2d::extension::ControlStepper* cobj = new (std::nothrow) cocos2d::extension::ControlStepper();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_ControlStepper_ctor, __jsb_cocos2d_extension_ControlStepper_class, js_cocos2d_extension_ControlStepper_finalize)


    

extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlStepper_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlStepper)", s.nativeThisObject());
    cocos2d::extension::ControlStepper* cobj = (cocos2d::extension::ControlStepper*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlStepper_finalize)

bool js_register_cocos2dx_extension_ControlStepper(se::Object* obj)
{
    auto cls = se::Class::create("ControlStepper", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlStepper_constructor));

    cls->defineFunction("getMinusSprite", _SE(js_cocos2dx_extension_ControlStepper_getMinusSprite));
    cls->defineFunction("setValue", _SE(js_cocos2dx_extension_ControlStepper_setValue));
    cls->defineFunction("setStepValue", _SE(js_cocos2dx_extension_ControlStepper_setStepValue));
    cls->defineFunction("initWithMinusSpriteAndPlusSprite", _SE(js_cocos2dx_extension_ControlStepper_initWithMinusSpriteAndPlusSprite));
    cls->defineFunction("setValueWithSendingEvent", _SE(js_cocos2dx_extension_ControlStepper_setValueWithSendingEvent));
    cls->defineFunction("setMaximumValue", _SE(js_cocos2dx_extension_ControlStepper_setMaximumValue));
    cls->defineFunction("getMinusLabel", _SE(js_cocos2dx_extension_ControlStepper_getMinusLabel));
    cls->defineFunction("getPlusLabel", _SE(js_cocos2dx_extension_ControlStepper_getPlusLabel));
    cls->defineFunction("setWraps", _SE(js_cocos2dx_extension_ControlStepper_setWraps));
    cls->defineFunction("setMinusLabel", _SE(js_cocos2dx_extension_ControlStepper_setMinusLabel));
    cls->defineFunction("startAutorepeat", _SE(js_cocos2dx_extension_ControlStepper_startAutorepeat));
    cls->defineFunction("updateLayoutUsingTouchLocation", _SE(js_cocos2dx_extension_ControlStepper_updateLayoutUsingTouchLocation));
    cls->defineFunction("isContinuous", _SE(js_cocos2dx_extension_ControlStepper_isContinuous));
    cls->defineFunction("stopAutorepeat", _SE(js_cocos2dx_extension_ControlStepper_stopAutorepeat));
    cls->defineFunction("setMinimumValue", _SE(js_cocos2dx_extension_ControlStepper_setMinimumValue));
    cls->defineFunction("setPlusLabel", _SE(js_cocos2dx_extension_ControlStepper_setPlusLabel));
    cls->defineFunction("getValue", _SE(js_cocos2dx_extension_ControlStepper_getValue));
    cls->defineFunction("getPlusSprite", _SE(js_cocos2dx_extension_ControlStepper_getPlusSprite));
    cls->defineFunction("setPlusSprite", _SE(js_cocos2dx_extension_ControlStepper_setPlusSprite));
    cls->defineFunction("setMinusSprite", _SE(js_cocos2dx_extension_ControlStepper_setMinusSprite));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_ControlStepper_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlStepper_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlStepper_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlStepper>(cls);

    __jsb_cocos2d_extension_ControlStepper_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlStepper_class = cls;

    jsb_set_extend_property("cc", "ControlStepper");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ControlSwitch_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ControlSwitch_class = nullptr;

static bool js_cocos2dx_extension_ControlSwitch_setOn(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_extension_ControlSwitch_setOn : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            bool arg0;
            ok &= seval_to_boolean(args[0], &arg0);
            cobj->setOn(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            bool arg0;
            ok &= seval_to_boolean(args[0], &arg0);
            bool arg1;
            ok &= seval_to_boolean(args[1], &arg1);
            cobj->setOn(arg0, arg1);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSwitch_setOn)

static bool js_cocos2dx_extension_ControlSwitch_locationFromTouch(se::State& s)
{
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSwitch_locationFromTouch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Touch* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_locationFromTouch : Error processing arguments");
        cocos2d::Vec2 result = cobj->locationFromTouch(arg0);
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_locationFromTouch : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSwitch_locationFromTouch)

static bool js_cocos2dx_extension_ControlSwitch_isOn(se::State& s)
{
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSwitch_isOn : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOn();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_isOn : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSwitch_isOn)

static bool js_cocos2dx_extension_ControlSwitch_initWithMaskSprite(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_extension_ControlSwitch_initWithMaskSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 6) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg4 = nullptr;
            ok &= seval_to_native_ptr(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg5 = nullptr;
            ok &= seval_to_native_ptr(args[5], &arg5);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithMaskSprite(arg0, arg1, arg2, arg3, arg4, arg5);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_initWithMaskSprite : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithMaskSprite(arg0, arg1, arg2, arg3);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_initWithMaskSprite : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSwitch_initWithMaskSprite)

static bool js_cocos2dx_extension_ControlSwitch_hasMoved(se::State& s)
{
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ControlSwitch_hasMoved : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->hasMoved();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_hasMoved : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSwitch_hasMoved)

static bool js_cocos2dx_extension_ControlSwitch_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSwitch* result = cocos2d::extension::ControlSwitch::create(arg0, arg1, arg2, arg3);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlSwitch>((cocos2d::extension::ControlSwitch*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 6) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::Sprite* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg4 = nullptr;
            ok &= seval_to_native_ptr(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::Label* arg5 = nullptr;
            ok &= seval_to_native_ptr(args[5], &arg5);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ControlSwitch* result = cocos2d::extension::ControlSwitch::create(arg0, arg1, arg2, arg3, arg4, arg5);
            ok &= native_ptr_to_seval<cocos2d::extension::ControlSwitch>((cocos2d::extension::ControlSwitch*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ControlSwitch_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ControlSwitch_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ControlSwitch_finalize)

static bool js_cocos2dx_extension_ControlSwitch_constructor(se::State& s)
{
    cocos2d::extension::ControlSwitch* cobj = new (std::nothrow) cocos2d::extension::ControlSwitch();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ControlSwitch_constructor, __jsb_cocos2d_extension_ControlSwitch_class, js_cocos2d_extension_ControlSwitch_finalize)

static bool js_cocos2dx_extension_ControlSwitch_ctor(se::State& s)
{
    cocos2d::extension::ControlSwitch* cobj = new (std::nothrow) cocos2d::extension::ControlSwitch();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_ControlSwitch_ctor, __jsb_cocos2d_extension_ControlSwitch_class, js_cocos2d_extension_ControlSwitch_finalize)


    

extern se::Object* __jsb_cocos2d_extension_Control_proto;

static bool js_cocos2d_extension_ControlSwitch_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ControlSwitch)", s.nativeThisObject());
    cocos2d::extension::ControlSwitch* cobj = (cocos2d::extension::ControlSwitch*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ControlSwitch_finalize)

bool js_register_cocos2dx_extension_ControlSwitch(se::Object* obj)
{
    auto cls = se::Class::create("ControlSwitch", obj, __jsb_cocos2d_extension_Control_proto, _SE(js_cocos2dx_extension_ControlSwitch_constructor));

    cls->defineFunction("setOn", _SE(js_cocos2dx_extension_ControlSwitch_setOn));
    cls->defineFunction("locationFromTouch", _SE(js_cocos2dx_extension_ControlSwitch_locationFromTouch));
    cls->defineFunction("isOn", _SE(js_cocos2dx_extension_ControlSwitch_isOn));
    cls->defineFunction("initWithMaskSprite", _SE(js_cocos2dx_extension_ControlSwitch_initWithMaskSprite));
    cls->defineFunction("hasMoved", _SE(js_cocos2dx_extension_ControlSwitch_hasMoved));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_ControlSwitch_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ControlSwitch_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ControlSwitch_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ControlSwitch>(cls);

    __jsb_cocos2d_extension_ControlSwitch_proto = cls->getProto();
    __jsb_cocos2d_extension_ControlSwitch_class = cls;

    jsb_set_extend_property("cc", "ControlSwitch");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_ScrollView_proto = nullptr;
se::Class* __jsb_cocos2d_extension_ScrollView_class = nullptr;

static bool js_cocos2dx_extension_ScrollView_isClippingToBounds(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_isClippingToBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isClippingToBounds();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_isClippingToBounds : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_isClippingToBounds)

static bool js_cocos2dx_extension_ScrollView_setContainer(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setContainer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setContainer : Error processing arguments");
        cobj->setContainer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setContainer)

static bool js_cocos2dx_extension_ScrollView_setContentOffsetInDuration(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setContentOffsetInDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        float arg1 = 0;
        ok &= seval_to_Vec2(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setContentOffsetInDuration : Error processing arguments");
        cobj->setContentOffsetInDuration(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setContentOffsetInDuration)

static bool js_cocos2dx_extension_ScrollView_setZoomScaleInDuration(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setZoomScaleInDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setZoomScaleInDuration : Error processing arguments");
        cobj->setZoomScaleInDuration(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setZoomScaleInDuration)

static bool js_cocos2dx_extension_ScrollView_updateTweenAction(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_updateTweenAction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        std::string arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_updateTweenAction : Error processing arguments");
        cobj->updateTweenAction(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_updateTweenAction)

static bool js_cocos2dx_extension_ScrollView_setMaxScale(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setMaxScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setMaxScale : Error processing arguments");
        cobj->setMaxScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setMaxScale)

static bool js_cocos2dx_extension_ScrollView_hasVisibleParents(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_hasVisibleParents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->hasVisibleParents();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_hasVisibleParents : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_hasVisibleParents)

static bool js_cocos2dx_extension_ScrollView_getDirection(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_getDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDirection();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_getDirection : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_getDirection)

static bool js_cocos2dx_extension_ScrollView_getContainer(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_getContainer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Node* result = cobj->getContainer();
        ok &= native_ptr_to_seval<cocos2d::Node>((cocos2d::Node*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_getContainer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_getContainer)

static bool js_cocos2dx_extension_ScrollView_setMinScale(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setMinScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setMinScale : Error processing arguments");
        cobj->setMinScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setMinScale)

static bool js_cocos2dx_extension_ScrollView_getZoomScale(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_getZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getZoomScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_getZoomScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_getZoomScale)

static bool js_cocos2dx_extension_ScrollView_updateInset(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_updateInset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateInset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_updateInset)

static bool js_cocos2dx_extension_ScrollView_initWithViewSize(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_initWithViewSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Size arg0;
        cocos2d::Node* arg1 = nullptr;
        ok &= seval_to_Size(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_initWithViewSize : Error processing arguments");
        bool result = cobj->initWithViewSize(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_initWithViewSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_initWithViewSize)

static bool js_cocos2dx_extension_ScrollView_pause(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_pause : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Ref* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_pause : Error processing arguments");
        cobj->pause(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_pause)

static bool js_cocos2dx_extension_ScrollView_setDirection(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::ScrollView::Direction arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setDirection : Error processing arguments");
        cobj->setDirection(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setDirection)

static bool js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopAnimatedContentOffset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset)

static bool js_cocos2dx_extension_ScrollView_setContentOffset(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setContentOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setContentOffset : Error processing arguments");
        cobj->setContentOffset(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        bool arg1;
        ok &= seval_to_Vec2(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setContentOffset : Error processing arguments");
        cobj->setContentOffset(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setContentOffset)

static bool js_cocos2dx_extension_ScrollView_isDragging(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_isDragging : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isDragging();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_isDragging : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_isDragging)

static bool js_cocos2dx_extension_ScrollView_isTouchEnabled(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_isTouchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTouchEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_isTouchEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_isTouchEnabled)

static bool js_cocos2dx_extension_ScrollView_isBounceable(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_isBounceable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isBounceable();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_isBounceable : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_isBounceable)

static bool js_cocos2dx_extension_ScrollView_setTouchEnabled(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setTouchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setTouchEnabled : Error processing arguments");
        cobj->setTouchEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setTouchEnabled)

static bool js_cocos2dx_extension_ScrollView_getContentOffset(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_getContentOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getContentOffset();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_getContentOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_getContentOffset)

static bool js_cocos2dx_extension_ScrollView_resume(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_resume : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Ref* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_resume : Error processing arguments");
        cobj->resume(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_resume)

static bool js_cocos2dx_extension_ScrollView_setClippingToBounds(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setClippingToBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setClippingToBounds : Error processing arguments");
        cobj->setClippingToBounds(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setClippingToBounds)

static bool js_cocos2dx_extension_ScrollView_setViewSize(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setViewSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setViewSize : Error processing arguments");
        cobj->setViewSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setViewSize)

static bool js_cocos2dx_extension_ScrollView_getViewSize(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_getViewSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getViewSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_getViewSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_getViewSize)

static bool js_cocos2dx_extension_ScrollView_maxContainerOffset(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_maxContainerOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->maxContainerOffset();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_maxContainerOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_maxContainerOffset)

static bool js_cocos2dx_extension_ScrollView_setBounceable(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_setBounceable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_setBounceable : Error processing arguments");
        cobj->setBounceable(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setBounceable)

static bool js_cocos2dx_extension_ScrollView_isTouchMoved(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_isTouchMoved : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTouchMoved();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_isTouchMoved : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_isTouchMoved)

static bool js_cocos2dx_extension_ScrollView_isNodeVisible(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_isNodeVisible : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_isNodeVisible : Error processing arguments");
        bool result = cobj->isNodeVisible(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_isNodeVisible : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_isNodeVisible)

static bool js_cocos2dx_extension_ScrollView_minContainerOffset(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_ScrollView_minContainerOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->minContainerOffset();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_minContainerOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_minContainerOffset)

static bool js_cocos2dx_extension_ScrollView_setZoomScale(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_extension_ScrollView_setZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            float arg0 = 0;
            ok &= seval_to_float(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool arg1;
            ok &= seval_to_boolean(args[1], &arg1);
            cobj->setZoomScale(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            float arg0 = 0;
            ok &= seval_to_float(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setZoomScale(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_setZoomScale)

static bool js_cocos2dx_extension_ScrollView_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            cocos2d::extension::ScrollView* result = cocos2d::extension::ScrollView::create();
            ok &= native_ptr_to_seval<cocos2d::extension::ScrollView>((cocos2d::extension::ScrollView*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Node* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::extension::ScrollView* result = cocos2d::extension::ScrollView::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::extension::ScrollView>((cocos2d::extension::ScrollView*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_ScrollView_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_ScrollView_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_ScrollView_finalize)

static bool js_cocos2dx_extension_ScrollView_constructor(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = new (std::nothrow) cocos2d::extension::ScrollView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_ScrollView_constructor, __jsb_cocos2d_extension_ScrollView_class, js_cocos2d_extension_ScrollView_finalize)

static bool js_cocos2dx_extension_ScrollView_ctor(se::State& s)
{
    cocos2d::extension::ScrollView* cobj = new (std::nothrow) cocos2d::extension::ScrollView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_ScrollView_ctor, __jsb_cocos2d_extension_ScrollView_class, js_cocos2d_extension_ScrollView_finalize)


    

extern se::Object* __jsb_cocos2d_Layer_proto;

static bool js_cocos2d_extension_ScrollView_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::ScrollView)", s.nativeThisObject());
    cocos2d::extension::ScrollView* cobj = (cocos2d::extension::ScrollView*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_ScrollView_finalize)

bool js_register_cocos2dx_extension_ScrollView(se::Object* obj)
{
    auto cls = se::Class::create("ScrollView", obj, __jsb_cocos2d_Layer_proto, _SE(js_cocos2dx_extension_ScrollView_constructor));

    cls->defineFunction("isClippingToBounds", _SE(js_cocos2dx_extension_ScrollView_isClippingToBounds));
    cls->defineFunction("setContainer", _SE(js_cocos2dx_extension_ScrollView_setContainer));
    cls->defineFunction("setContentOffsetInDuration", _SE(js_cocos2dx_extension_ScrollView_setContentOffsetInDuration));
    cls->defineFunction("setZoomScaleInDuration", _SE(js_cocos2dx_extension_ScrollView_setZoomScaleInDuration));
    cls->defineFunction("updateTweenAction", _SE(js_cocos2dx_extension_ScrollView_updateTweenAction));
    cls->defineFunction("setMaxScale", _SE(js_cocos2dx_extension_ScrollView_setMaxScale));
    cls->defineFunction("hasVisibleParents", _SE(js_cocos2dx_extension_ScrollView_hasVisibleParents));
    cls->defineFunction("getDirection", _SE(js_cocos2dx_extension_ScrollView_getDirection));
    cls->defineFunction("getContainer", _SE(js_cocos2dx_extension_ScrollView_getContainer));
    cls->defineFunction("setMinScale", _SE(js_cocos2dx_extension_ScrollView_setMinScale));
    cls->defineFunction("getZoomScale", _SE(js_cocos2dx_extension_ScrollView_getZoomScale));
    cls->defineFunction("updateInset", _SE(js_cocos2dx_extension_ScrollView_updateInset));
    cls->defineFunction("initWithViewSize", _SE(js_cocos2dx_extension_ScrollView_initWithViewSize));
    cls->defineFunction("pause", _SE(js_cocos2dx_extension_ScrollView_pause));
    cls->defineFunction("setDirection", _SE(js_cocos2dx_extension_ScrollView_setDirection));
    cls->defineFunction("stopAnimatedContentOffset", _SE(js_cocos2dx_extension_ScrollView_stopAnimatedContentOffset));
    cls->defineFunction("setContentOffset", _SE(js_cocos2dx_extension_ScrollView_setContentOffset));
    cls->defineFunction("isDragging", _SE(js_cocos2dx_extension_ScrollView_isDragging));
    cls->defineFunction("isTouchEnabled", _SE(js_cocos2dx_extension_ScrollView_isTouchEnabled));
    cls->defineFunction("isBounceable", _SE(js_cocos2dx_extension_ScrollView_isBounceable));
    cls->defineFunction("setTouchEnabled", _SE(js_cocos2dx_extension_ScrollView_setTouchEnabled));
    cls->defineFunction("getContentOffset", _SE(js_cocos2dx_extension_ScrollView_getContentOffset));
    cls->defineFunction("resume", _SE(js_cocos2dx_extension_ScrollView_resume));
    cls->defineFunction("setClippingToBounds", _SE(js_cocos2dx_extension_ScrollView_setClippingToBounds));
    cls->defineFunction("setViewSize", _SE(js_cocos2dx_extension_ScrollView_setViewSize));
    cls->defineFunction("getViewSize", _SE(js_cocos2dx_extension_ScrollView_getViewSize));
    cls->defineFunction("maxContainerOffset", _SE(js_cocos2dx_extension_ScrollView_maxContainerOffset));
    cls->defineFunction("setBounceable", _SE(js_cocos2dx_extension_ScrollView_setBounceable));
    cls->defineFunction("isTouchMoved", _SE(js_cocos2dx_extension_ScrollView_isTouchMoved));
    cls->defineFunction("isNodeVisible", _SE(js_cocos2dx_extension_ScrollView_isNodeVisible));
    cls->defineFunction("minContainerOffset", _SE(js_cocos2dx_extension_ScrollView_minContainerOffset));
    cls->defineFunction("setZoomScale", _SE(js_cocos2dx_extension_ScrollView_setZoomScale));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_ScrollView_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_ScrollView_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_ScrollView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::ScrollView>(cls);

    __jsb_cocos2d_extension_ScrollView_proto = cls->getProto();
    __jsb_cocos2d_extension_ScrollView_class = cls;

    jsb_set_extend_property("cc", "ScrollView");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_TableViewCell_proto = nullptr;
se::Class* __jsb_cocos2d_extension_TableViewCell_class = nullptr;

static bool js_cocos2dx_extension_TableViewCell_reset(se::State& s)
{
    cocos2d::extension::TableViewCell* cobj = (cocos2d::extension::TableViewCell*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableViewCell_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableViewCell_reset)

static bool js_cocos2dx_extension_TableViewCell_getIdx(se::State& s)
{
    cocos2d::extension::TableViewCell* cobj = (cocos2d::extension::TableViewCell*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableViewCell_getIdx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        ssize_t result = cobj->getIdx();
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableViewCell_getIdx : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableViewCell_getIdx)

static bool js_cocos2dx_extension_TableViewCell_setIdx(se::State& s)
{
    cocos2d::extension::TableViewCell* cobj = (cocos2d::extension::TableViewCell*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableViewCell_setIdx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableViewCell_setIdx : Error processing arguments");
        cobj->setIdx(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableViewCell_setIdx)

static bool js_cocos2dx_extension_TableViewCell_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::extension::TableViewCell::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_extension_TableViewCell_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableViewCell_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_TableViewCell_finalize)

static bool js_cocos2dx_extension_TableViewCell_constructor(se::State& s)
{
    cocos2d::extension::TableViewCell* cobj = new (std::nothrow) cocos2d::extension::TableViewCell();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_TableViewCell_constructor, __jsb_cocos2d_extension_TableViewCell_class, js_cocos2d_extension_TableViewCell_finalize)

static bool js_cocos2dx_extension_TableViewCell_ctor(se::State& s)
{
    cocos2d::extension::TableViewCell* cobj = new (std::nothrow) cocos2d::extension::TableViewCell();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_TableViewCell_ctor, __jsb_cocos2d_extension_TableViewCell_class, js_cocos2d_extension_TableViewCell_finalize)


    

extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_cocos2d_extension_TableViewCell_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::TableViewCell)", s.nativeThisObject());
    cocos2d::extension::TableViewCell* cobj = (cocos2d::extension::TableViewCell*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_TableViewCell_finalize)

bool js_register_cocos2dx_extension_TableViewCell(se::Object* obj)
{
    auto cls = se::Class::create("TableViewCell", obj, __jsb_cocos2d_Node_proto, _SE(js_cocos2dx_extension_TableViewCell_constructor));

    cls->defineFunction("reset", _SE(js_cocos2dx_extension_TableViewCell_reset));
    cls->defineFunction("getIdx", _SE(js_cocos2dx_extension_TableViewCell_getIdx));
    cls->defineFunction("setIdx", _SE(js_cocos2dx_extension_TableViewCell_setIdx));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_TableViewCell_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_extension_TableViewCell_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_TableViewCell_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::TableViewCell>(cls);

    __jsb_cocos2d_extension_TableViewCell_proto = cls->getProto();
    __jsb_cocos2d_extension_TableViewCell_class = cls;

    jsb_set_extend_property("cc", "TableViewCell");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_extension_TableView_proto = nullptr;
se::Class* __jsb_cocos2d_extension_TableView_class = nullptr;

static bool js_cocos2dx_extension_TableView_updateCellAtIndex(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_updateCellAtIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_updateCellAtIndex : Error processing arguments");
        cobj->updateCellAtIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_updateCellAtIndex)

static bool js_cocos2dx_extension_TableView_setVerticalFillOrder(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_setVerticalFillOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::TableView::VerticalFillOrder arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_setVerticalFillOrder : Error processing arguments");
        cobj->setVerticalFillOrder(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_setVerticalFillOrder)

static bool js_cocos2dx_extension_TableView_scrollViewDidZoom(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_scrollViewDidZoom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::ScrollView* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_scrollViewDidZoom : Error processing arguments");
        cobj->scrollViewDidZoom(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_scrollViewDidZoom)

static bool js_cocos2dx_extension_TableView__updateContentSize(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView__updateContentSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->_updateContentSize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView__updateContentSize)

static bool js_cocos2dx_extension_TableView_getVerticalFillOrder(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_getVerticalFillOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getVerticalFillOrder();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_getVerticalFillOrder : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_getVerticalFillOrder)

static bool js_cocos2dx_extension_TableView_removeCellAtIndex(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_removeCellAtIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_removeCellAtIndex : Error processing arguments");
        cobj->removeCellAtIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_removeCellAtIndex)

static bool js_cocos2dx_extension_TableView_initWithViewSize(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_initWithViewSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Size arg0;
        cocos2d::Node* arg1 = nullptr;
        ok &= seval_to_Size(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_initWithViewSize : Error processing arguments");
        bool result = cobj->initWithViewSize(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_initWithViewSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_initWithViewSize)

static bool js_cocos2dx_extension_TableView_scrollViewDidScroll(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_scrollViewDidScroll : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::extension::ScrollView* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_scrollViewDidScroll : Error processing arguments");
        cobj->scrollViewDidScroll(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_scrollViewDidScroll)

static bool js_cocos2dx_extension_TableView_reloadData(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_reloadData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reloadData();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_reloadData)

static bool js_cocos2dx_extension_TableView_insertCellAtIndex(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_insertCellAtIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_insertCellAtIndex : Error processing arguments");
        cobj->insertCellAtIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_insertCellAtIndex)

static bool js_cocos2dx_extension_TableView_cellAtIndex(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_cellAtIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_cellAtIndex : Error processing arguments");
        cocos2d::extension::TableViewCell* result = cobj->cellAtIndex(arg0);
        ok &= native_ptr_to_seval<cocos2d::extension::TableViewCell>((cocos2d::extension::TableViewCell*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_cellAtIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_cellAtIndex)

static bool js_cocos2dx_extension_TableView_dequeueCell(se::State& s)
{
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_extension_TableView_dequeueCell : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::extension::TableViewCell* result = cobj->dequeueCell();
        ok &= native_ptr_to_seval<cocos2d::extension::TableViewCell>((cocos2d::extension::TableViewCell*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_extension_TableView_dequeueCell : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_TableView_dequeueCell)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_extension_TableView_finalize)

static bool js_cocos2dx_extension_TableView_constructor(se::State& s)
{
    cocos2d::extension::TableView* cobj = new (std::nothrow) cocos2d::extension::TableView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_extension_TableView_constructor, __jsb_cocos2d_extension_TableView_class, js_cocos2d_extension_TableView_finalize)

static bool js_cocos2dx_extension_TableView_ctor(se::State& s)
{
    cocos2d::extension::TableView* cobj = new (std::nothrow) cocos2d::extension::TableView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_extension_TableView_ctor, __jsb_cocos2d_extension_TableView_class, js_cocos2d_extension_TableView_finalize)


    

extern se::Object* __jsb_cocos2d_extension_ScrollView_proto;

static bool js_cocos2d_extension_TableView_finalize(se::State& s)
{
    CCLOG("jsbindings: finalizing JS object %p (cocos2d::extension::TableView)", s.nativeThisObject());
    cocos2d::extension::TableView* cobj = (cocos2d::extension::TableView*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_extension_TableView_finalize)

bool js_register_cocos2dx_extension_TableView(se::Object* obj)
{
    auto cls = se::Class::create("TableView", obj, __jsb_cocos2d_extension_ScrollView_proto, _SE(js_cocos2dx_extension_TableView_constructor));

    cls->defineFunction("updateCellAtIndex", _SE(js_cocos2dx_extension_TableView_updateCellAtIndex));
    cls->defineFunction("setVerticalFillOrder", _SE(js_cocos2dx_extension_TableView_setVerticalFillOrder));
    cls->defineFunction("scrollViewDidZoom", _SE(js_cocos2dx_extension_TableView_scrollViewDidZoom));
    cls->defineFunction("_updateContentSize", _SE(js_cocos2dx_extension_TableView__updateContentSize));
    cls->defineFunction("getVerticalFillOrder", _SE(js_cocos2dx_extension_TableView_getVerticalFillOrder));
    cls->defineFunction("removeCellAtIndex", _SE(js_cocos2dx_extension_TableView_removeCellAtIndex));
    cls->defineFunction("initWithViewSize", _SE(js_cocos2dx_extension_TableView_initWithViewSize));
    cls->defineFunction("scrollViewDidScroll", _SE(js_cocos2dx_extension_TableView_scrollViewDidScroll));
    cls->defineFunction("reloadData", _SE(js_cocos2dx_extension_TableView_reloadData));
    cls->defineFunction("insertCellAtIndex", _SE(js_cocos2dx_extension_TableView_insertCellAtIndex));
    cls->defineFunction("cellAtIndex", _SE(js_cocos2dx_extension_TableView_cellAtIndex));
    cls->defineFunction("dequeueCell", _SE(js_cocos2dx_extension_TableView_dequeueCell));
    cls->defineFunction("ctor", _SE(js_cocos2dx_extension_TableView_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_extension_TableView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::extension::TableView>(cls);

    __jsb_cocos2d_extension_TableView_proto = cls->getProto();
    __jsb_cocos2d_extension_TableView_class = cls;

    jsb_set_extend_property("cc", "TableView");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_extension(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("cc", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("cc", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_extension_AssetsManagerEx(ns);
    js_register_cocos2dx_extension_Control(ns);
    js_register_cocos2dx_extension_ControlHuePicker(ns);
    js_register_cocos2dx_extension_TableViewCell(ns);
    js_register_cocos2dx_extension_ControlStepper(ns);
    js_register_cocos2dx_extension_ControlColourPicker(ns);
    js_register_cocos2dx_extension_ControlButton(ns);
    js_register_cocos2dx_extension_ControlSlider(ns);
    js_register_cocos2dx_extension_ScrollView(ns);
    js_register_cocos2dx_extension_Manifest(ns);
    js_register_cocos2dx_extension_ControlPotentiometer(ns);
    js_register_cocos2dx_extension_EventListenerAssetsManagerEx(ns);
    js_register_cocos2dx_extension_TableView(ns);
    js_register_cocos2dx_extension_EventAssetsManagerEx(ns);
    js_register_cocos2dx_extension_ControlSwitch(ns);
    js_register_cocos2dx_extension_ControlSaturationBrightnessPicker(ns);
    return true;
}

