#include "cocos/bindings/auto/jsb_extension_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "extensions/cocos-ext.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_extension_EventAssetsManagerEx_proto = nullptr;
se::Class* __jsb_cc_extension_EventAssetsManagerEx_class = nullptr;

static bool js_extension_EventAssetsManagerEx_getAssetId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getAssetId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getAssetId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getAssetId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getAssetId)

static bool js_extension_EventAssetsManagerEx_getAssetsManagerEx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getAssetsManagerEx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::extension::AssetsManagerEx* result = cobj->getAssetsManagerEx();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getAssetsManagerEx : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getAssetsManagerEx)

static bool js_extension_EventAssetsManagerEx_getCURLECode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getCURLECode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCURLECode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getCURLECode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getCURLECode)

static bool js_extension_EventAssetsManagerEx_getCURLMCode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getCURLMCode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCURLMCode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getCURLMCode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getCURLMCode)

static bool js_extension_EventAssetsManagerEx_getDownloadedBytes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getDownloadedBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getDownloadedBytes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getDownloadedBytes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getDownloadedBytes)

static bool js_extension_EventAssetsManagerEx_getDownloadedFiles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getDownloadedFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDownloadedFiles();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getDownloadedFiles : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getDownloadedFiles)

static bool js_extension_EventAssetsManagerEx_getEventCode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getEventCode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getEventCode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getEventCode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getEventCode)

static bool js_extension_EventAssetsManagerEx_getMessage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getMessage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getMessage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getMessage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getMessage)

static bool js_extension_EventAssetsManagerEx_getPercent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPercent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getPercent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getPercent)

static bool js_extension_EventAssetsManagerEx_getPercentByFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getPercentByFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPercentByFile();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getPercentByFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getPercentByFile)

static bool js_extension_EventAssetsManagerEx_getTotalBytes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getTotalBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getTotalBytes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getTotalBytes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getTotalBytes)

static bool js_extension_EventAssetsManagerEx_getTotalFiles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_getTotalFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getTotalFiles();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_getTotalFiles : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_getTotalFiles)

static bool js_extension_EventAssetsManagerEx_isResuming(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_EventAssetsManagerEx_isResuming : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isResuming();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_isResuming : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_EventAssetsManagerEx_isResuming)

SE_DECLARE_FINALIZE_FUNC(js_cc_extension_EventAssetsManagerEx_finalize)

static bool js_extension_EventAssetsManagerEx_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::string arg0;
    cc::extension::AssetsManagerEx* arg1 = nullptr;
    cc::extension::EventAssetsManagerEx::EventCode arg2;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
    ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_extension_EventAssetsManagerEx_constructor : Error processing arguments");
    cc::extension::EventAssetsManagerEx* cobj = JSB_ALLOC(cc::extension::EventAssetsManagerEx, arg0, arg1, arg2);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_extension_EventAssetsManagerEx_constructor, __jsb_cc_extension_EventAssetsManagerEx_class, js_cc_extension_EventAssetsManagerEx_finalize)



static bool js_cc_extension_EventAssetsManagerEx_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<cc::extension::EventAssetsManagerEx>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_extension_EventAssetsManagerEx_finalize)

bool js_register_extension_EventAssetsManagerEx(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("EventAssetsManager", obj, nullptr, _SE(js_extension_EventAssetsManagerEx_constructor));

    cls->defineFunction("getAssetId", _SE(js_extension_EventAssetsManagerEx_getAssetId));
    cls->defineFunction("getAssetsManagerEx", _SE(js_extension_EventAssetsManagerEx_getAssetsManagerEx));
    cls->defineFunction("getCURLECode", _SE(js_extension_EventAssetsManagerEx_getCURLECode));
    cls->defineFunction("getCURLMCode", _SE(js_extension_EventAssetsManagerEx_getCURLMCode));
    cls->defineFunction("getDownloadedBytes", _SE(js_extension_EventAssetsManagerEx_getDownloadedBytes));
    cls->defineFunction("getDownloadedFiles", _SE(js_extension_EventAssetsManagerEx_getDownloadedFiles));
    cls->defineFunction("getEventCode", _SE(js_extension_EventAssetsManagerEx_getEventCode));
    cls->defineFunction("getMessage", _SE(js_extension_EventAssetsManagerEx_getMessage));
    cls->defineFunction("getPercent", _SE(js_extension_EventAssetsManagerEx_getPercent));
    cls->defineFunction("getPercentByFile", _SE(js_extension_EventAssetsManagerEx_getPercentByFile));
    cls->defineFunction("getTotalBytes", _SE(js_extension_EventAssetsManagerEx_getTotalBytes));
    cls->defineFunction("getTotalFiles", _SE(js_extension_EventAssetsManagerEx_getTotalFiles));
    cls->defineFunction("isResuming", _SE(js_extension_EventAssetsManagerEx_isResuming));
    cls->defineFinalizeFunction(_SE(js_cc_extension_EventAssetsManagerEx_finalize));
    cls->install();
    JSBClassType::registerClass<cc::extension::EventAssetsManagerEx>(cls);

    __jsb_cc_extension_EventAssetsManagerEx_proto = cls->getProto();
    __jsb_cc_extension_EventAssetsManagerEx_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_extension_Manifest_proto = nullptr;
se::Class* __jsb_cc_extension_Manifest_class = nullptr;

static bool js_extension_Manifest_getManifestFileUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_getManifestFileUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getManifestFileUrl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_getManifestFileUrl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_getManifestFileUrl)

static bool js_extension_Manifest_getManifestRoot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_getManifestRoot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getManifestRoot();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_getManifestRoot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_getManifestRoot)

static bool js_extension_Manifest_getPackageUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_getPackageUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getPackageUrl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_getPackageUrl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_getPackageUrl)

static bool js_extension_Manifest_getSearchPaths(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_getSearchPaths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<std::string> result = cobj->getSearchPaths();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_getSearchPaths : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_getSearchPaths)

static bool js_extension_Manifest_getVersion(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_getVersion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getVersion();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_getVersion : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_getVersion)

static bool js_extension_Manifest_getVersionFileUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_getVersionFileUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getVersionFileUrl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_getVersionFileUrl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_getVersionFileUrl)

static bool js_extension_Manifest_isLoaded(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_isLoaded : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isLoaded();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_isLoaded : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_isLoaded)

static bool js_extension_Manifest_isUpdating(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_isUpdating : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUpdating();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_isUpdating : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_isUpdating)

static bool js_extension_Manifest_isVersionLoaded(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_isVersionLoaded : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isVersionLoaded();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_isVersionLoaded : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_isVersionLoaded)

static bool js_extension_Manifest_parseFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_parseFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_parseFile : Error processing arguments");
        cobj->parseFile(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_parseFile)

static bool js_extension_Manifest_parseJSONString(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_parseJSONString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_parseJSONString : Error processing arguments");
        cobj->parseJSONString(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_parseJSONString)

static bool js_extension_Manifest_setUpdating(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::Manifest>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_Manifest_setUpdating : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_extension_Manifest_setUpdating : Error processing arguments");
        cobj->setUpdating(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_extension_Manifest_setUpdating)

SE_DECLARE_FINALIZE_FUNC(js_cc_extension_Manifest_finalize)

static bool js_extension_Manifest_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::string, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::extension::Manifest* cobj = JSB_ALLOC(cc::extension::Manifest, arg0.value(), arg1.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            cc::extension::Manifest* cobj = JSB_ALLOC(cc::extension::Manifest);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::extension::Manifest* cobj = JSB_ALLOC(cc::extension::Manifest, arg0.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_extension_Manifest_constructor, __jsb_cc_extension_Manifest_class, js_cc_extension_Manifest_finalize)



static bool js_cc_extension_Manifest_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<cc::extension::Manifest>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_extension_Manifest_finalize)

bool js_register_extension_Manifest(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Manifest", obj, nullptr, _SE(js_extension_Manifest_constructor));

    cls->defineFunction("getManifestFileUrl", _SE(js_extension_Manifest_getManifestFileUrl));
    cls->defineFunction("getManifestRoot", _SE(js_extension_Manifest_getManifestRoot));
    cls->defineFunction("getPackageUrl", _SE(js_extension_Manifest_getPackageUrl));
    cls->defineFunction("getSearchPaths", _SE(js_extension_Manifest_getSearchPaths));
    cls->defineFunction("getVersion", _SE(js_extension_Manifest_getVersion));
    cls->defineFunction("getVersionFileUrl", _SE(js_extension_Manifest_getVersionFileUrl));
    cls->defineFunction("isLoaded", _SE(js_extension_Manifest_isLoaded));
    cls->defineFunction("isUpdating", _SE(js_extension_Manifest_isUpdating));
    cls->defineFunction("isVersionLoaded", _SE(js_extension_Manifest_isVersionLoaded));
    cls->defineFunction("parseFile", _SE(js_extension_Manifest_parseFile));
    cls->defineFunction("parseJSONString", _SE(js_extension_Manifest_parseJSONString));
    cls->defineFunction("setUpdating", _SE(js_extension_Manifest_setUpdating));
    cls->defineFinalizeFunction(_SE(js_cc_extension_Manifest_finalize));
    cls->install();
    JSBClassType::registerClass<cc::extension::Manifest>(cls);

    __jsb_cc_extension_Manifest_proto = cls->getProto();
    __jsb_cc_extension_Manifest_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_extension_AssetsManagerEx_proto = nullptr;
se::Class* __jsb_cc_extension_AssetsManagerEx_class = nullptr;

static bool js_extension_AssetsManagerEx_checkUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_checkUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->checkUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_checkUpdate)

static bool js_extension_AssetsManagerEx_downloadFailedAssets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_downloadFailedAssets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->downloadFailedAssets();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_downloadFailedAssets)

static bool js_extension_AssetsManagerEx_getDownloadedBytes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getDownloadedBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getDownloadedBytes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getDownloadedBytes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getDownloadedBytes)

static bool js_extension_AssetsManagerEx_getDownloadedFiles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getDownloadedFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDownloadedFiles();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getDownloadedFiles : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getDownloadedFiles)

static bool js_extension_AssetsManagerEx_getLocalManifest(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getLocalManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::extension::Manifest* result = cobj->getLocalManifest();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getLocalManifest : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getLocalManifest)

static bool js_extension_AssetsManagerEx_getMaxConcurrentTask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getMaxConcurrentTask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const int result = cobj->getMaxConcurrentTask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getMaxConcurrentTask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getMaxConcurrentTask)

static bool js_extension_AssetsManagerEx_getRemoteManifest(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getRemoteManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::extension::Manifest* result = cobj->getRemoteManifest();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getRemoteManifest : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getRemoteManifest)

static bool js_extension_AssetsManagerEx_getState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getState());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getState)

static bool js_extension_AssetsManagerEx_getStoragePath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getStoragePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getStoragePath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getStoragePath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getStoragePath)

static bool js_extension_AssetsManagerEx_getTotalBytes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getTotalBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getTotalBytes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getTotalBytes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getTotalBytes)

static bool js_extension_AssetsManagerEx_getTotalFiles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_getTotalFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getTotalFiles();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_getTotalFiles : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_getTotalFiles)

static bool js_extension_AssetsManagerEx_isResuming(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_isResuming : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isResuming();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_isResuming : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_isResuming)

static bool js_extension_AssetsManagerEx_loadLocalManifest(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2( cobj, false, "js_extension_AssetsManagerEx_loadLocalManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->loadLocalManifest(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_loadLocalManifest : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<cc::extension::Manifest*, false> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->loadLocalManifest(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_loadLocalManifest : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_loadLocalManifest)

static bool js_extension_AssetsManagerEx_loadRemoteManifest(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_loadRemoteManifest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::extension::Manifest*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_loadRemoteManifest : Error processing arguments");
        bool result = cobj->loadRemoteManifest(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_loadRemoteManifest : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_loadRemoteManifest)

static bool js_extension_AssetsManagerEx_prepareUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_prepareUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->prepareUpdate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_prepareUpdate)

static bool js_extension_AssetsManagerEx_setEventCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_setEventCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (cc::extension::EventAssetsManagerEx *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](cc::extension::EventAssetsManagerEx* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_setEventCallback : Error processing arguments");
        cobj->setEventCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_setEventCallback)

static bool js_extension_AssetsManagerEx_setMaxConcurrentTask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_setMaxConcurrentTask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_setMaxConcurrentTask : Error processing arguments");
        cobj->setMaxConcurrentTask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_setMaxConcurrentTask)

static bool js_extension_AssetsManagerEx_setVerifyCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_setVerifyCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<bool (const std::string, cc::extension::ManifestAsset)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const std::string larg0, cc::extension::ManifestAsset larg1) -> bool {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    bool result;
                    ok &= sevalue_to_native(rval, &result, nullptr);
                    SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type bool");
                    return result;
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_setVerifyCallback : Error processing arguments");
        cobj->setVerifyCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_setVerifyCallback)

static bool js_extension_AssetsManagerEx_setVersionCompareHandle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_setVersionCompareHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<int (const std::string, const std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const std::string larg0, const std::string larg1) -> int {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    int result;
                    ok &= sevalue_to_native(rval, &result, nullptr);
                    SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type int");
                    return result;
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_setVersionCompareHandle : Error processing arguments");
        cobj->setVersionCompareHandle(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_setVersionCompareHandle)

static bool js_extension_AssetsManagerEx_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    SE_PRECONDITION2(cobj, false, "js_extension_AssetsManagerEx_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_update)

static bool js_extension_AssetsManagerEx_create(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_extension_AssetsManagerEx_create : Error processing arguments");
        auto result = cc::extension::AssetsManagerEx::create(arg0.value(), arg1.value());
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cc_extension_AssetsManagerEx_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_extension_AssetsManagerEx_create)

SE_DECLARE_FINALIZE_FUNC(js_cc_extension_AssetsManagerEx_finalize)

static bool js_extension_AssetsManagerEx_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::string, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::function<int (const std::string, const std::string)>, true> arg2 = {};
            do {
                if (args[2].isObject() && args[2].toObject()->isFunction())
                {
                    se::Value jsThis(s.thisObject());
                    se::Value jsFunc(args[2]);
                    jsThis.toObject()->attachObject(jsFunc.toObject());
                    auto lambda = [=](const std::string larg0, const std::string larg1) -> int {
                        se::ScriptEngine::getInstance()->clearException();
                        se::AutoHandleScope hs;
            
                        CC_UNUSED bool ok = true;
                        se::ValueArray args;
                        args.resize(2);
                        ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                        ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                        se::Value rval;
                        se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                        se::Object* funcObj = jsFunc.toObject();
                        bool succeed = funcObj->call(args, thisObj, &rval);
                        if (!succeed) {
                            se::ScriptEngine::getInstance()->clearException();
                        }
                        int result;
                        ok &= sevalue_to_native(rval, &result, nullptr);
                        SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type int");
                        return result;
                    };
                    arg2.data = lambda;
                }
                else
                {
                    arg2.data = nullptr;
                }
            } while(false)
            ;
            if (!ok) { ok = true; break; }
            cc::extension::AssetsManagerEx* cobj = JSB_ALLOC(cc::extension::AssetsManagerEx, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::string, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::extension::AssetsManagerEx* cobj = JSB_ALLOC(cc::extension::AssetsManagerEx, arg0.value(), arg1.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_extension_AssetsManagerEx_constructor, __jsb_cc_extension_AssetsManagerEx_class, js_cc_extension_AssetsManagerEx_finalize)



static bool js_cc_extension_AssetsManagerEx_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<cc::extension::AssetsManagerEx>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_extension_AssetsManagerEx_finalize)

bool js_register_extension_AssetsManagerEx(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AssetsManager", obj, nullptr, _SE(js_extension_AssetsManagerEx_constructor));

    cls->defineFunction("checkUpdate", _SE(js_extension_AssetsManagerEx_checkUpdate));
    cls->defineFunction("downloadFailedAssets", _SE(js_extension_AssetsManagerEx_downloadFailedAssets));
    cls->defineFunction("getDownloadedBytes", _SE(js_extension_AssetsManagerEx_getDownloadedBytes));
    cls->defineFunction("getDownloadedFiles", _SE(js_extension_AssetsManagerEx_getDownloadedFiles));
    cls->defineFunction("getLocalManifest", _SE(js_extension_AssetsManagerEx_getLocalManifest));
    cls->defineFunction("getMaxConcurrentTask", _SE(js_extension_AssetsManagerEx_getMaxConcurrentTask));
    cls->defineFunction("getRemoteManifest", _SE(js_extension_AssetsManagerEx_getRemoteManifest));
    cls->defineFunction("getState", _SE(js_extension_AssetsManagerEx_getState));
    cls->defineFunction("getStoragePath", _SE(js_extension_AssetsManagerEx_getStoragePath));
    cls->defineFunction("getTotalBytes", _SE(js_extension_AssetsManagerEx_getTotalBytes));
    cls->defineFunction("getTotalFiles", _SE(js_extension_AssetsManagerEx_getTotalFiles));
    cls->defineFunction("isResuming", _SE(js_extension_AssetsManagerEx_isResuming));
    cls->defineFunction("loadLocalManifest", _SE(js_extension_AssetsManagerEx_loadLocalManifest));
    cls->defineFunction("loadRemoteManifest", _SE(js_extension_AssetsManagerEx_loadRemoteManifest));
    cls->defineFunction("prepareUpdate", _SE(js_extension_AssetsManagerEx_prepareUpdate));
    cls->defineFunction("setEventCallback", _SE(js_extension_AssetsManagerEx_setEventCallback));
    cls->defineFunction("setMaxConcurrentTask", _SE(js_extension_AssetsManagerEx_setMaxConcurrentTask));
    cls->defineFunction("setVerifyCallback", _SE(js_extension_AssetsManagerEx_setVerifyCallback));
    cls->defineFunction("setVersionCompareHandle", _SE(js_extension_AssetsManagerEx_setVersionCompareHandle));
    cls->defineFunction("update", _SE(js_extension_AssetsManagerEx_update));
    cls->defineStaticFunction("create", _SE(js_extension_AssetsManagerEx_create));
    cls->defineFinalizeFunction(_SE(js_cc_extension_AssetsManagerEx_finalize));
    cls->install();
    JSBClassType::registerClass<cc::extension::AssetsManagerEx>(cls);

    __jsb_cc_extension_AssetsManagerEx_proto = cls->getProto();
    __jsb_cc_extension_AssetsManagerEx_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_extension(se::Object* obj)
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

    js_register_extension_EventAssetsManagerEx(ns);
    js_register_extension_Manifest(ns);
    js_register_extension_AssetsManagerEx(ns);
    return true;
}

