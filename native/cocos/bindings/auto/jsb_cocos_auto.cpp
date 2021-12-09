#include "cocos/bindings/auto/jsb_cocos_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "platform/FileUtils.h"
#include "bindings/event/EventDispatcher.h"
#include "platform/interfaces/modules/canvas/CanvasRenderingContext2D.h"
#include "platform/interfaces/modules/Device.h"
#include "platform/SAXParser.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_FileUtils_proto = nullptr;
se::Class* __jsb_cc_FileUtils_class = nullptr;

static bool js_engine_FileUtils_addSearchPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_addSearchPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_addSearchPath : Error processing arguments");
        cobj->addSearchPath(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_addSearchPath : Error processing arguments");
        cobj->addSearchPath(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_addSearchPath)

static bool js_engine_FileUtils_createDirectory(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_createDirectory : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_createDirectory : Error processing arguments");
        bool result = cobj->createDirectory(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_createDirectory : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_createDirectory)

static bool js_engine_FileUtils_fullPathForFilename(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_fullPathForFilename : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_fullPathForFilename : Error processing arguments");
        std::string result = cobj->fullPathForFilename(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_fullPathForFilename : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_fullPathForFilename)

static bool js_engine_FileUtils_fullPathFromRelativeFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_fullPathFromRelativeFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_fullPathFromRelativeFile : Error processing arguments");
        std::string result = cobj->fullPathFromRelativeFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_fullPathFromRelativeFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_fullPathFromRelativeFile)

static bool js_engine_FileUtils_getDataFromFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getDataFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getDataFromFile : Error processing arguments");
        cc::Data result = cobj->getDataFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getDataFromFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getDataFromFile)

static bool js_engine_FileUtils_getDefaultResourceRootPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getDefaultResourceRootPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getDefaultResourceRootPath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getDefaultResourceRootPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getDefaultResourceRootPath)

static bool js_engine_FileUtils_getFileExtension(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getFileExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileExtension : Error processing arguments");
        std::string result = cobj->getFileExtension(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileExtension : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getFileExtension)

static bool js_engine_FileUtils_getFileSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getFileSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileSize : Error processing arguments");
        long result = cobj->getFileSize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getFileSize)

static bool js_engine_FileUtils_getOriginalSearchPaths(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getOriginalSearchPaths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getOriginalSearchPaths();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getOriginalSearchPaths : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getOriginalSearchPaths)

static bool js_engine_FileUtils_getSearchPaths(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getSearchPaths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getSearchPaths();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getSearchPaths : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getSearchPaths)

static bool js_engine_FileUtils_getStringFromFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getStringFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getStringFromFile : Error processing arguments");
        std::string result = cobj->getStringFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getStringFromFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getStringFromFile)

static bool js_engine_FileUtils_getSuitableFOpen(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getSuitableFOpen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getSuitableFOpen : Error processing arguments");
        std::string result = cobj->getSuitableFOpen(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getSuitableFOpen : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getSuitableFOpen)

static bool js_engine_FileUtils_getValueMapFromData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getValueMapFromData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<const char*, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getValueMapFromData : Error processing arguments");
        std::unordered_map<std::string, cc::Value> result = cobj->getValueMapFromData(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getValueMapFromData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getValueMapFromData)

static bool js_engine_FileUtils_getValueMapFromFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getValueMapFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getValueMapFromFile : Error processing arguments");
        std::unordered_map<std::string, cc::Value> result = cobj->getValueMapFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getValueMapFromFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getValueMapFromFile)

static bool js_engine_FileUtils_getValueVectorFromFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getValueVectorFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getValueVectorFromFile : Error processing arguments");
        std::vector<cc::Value> result = cobj->getValueVectorFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getValueVectorFromFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getValueVectorFromFile)

static bool js_engine_FileUtils_getWritablePath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_getWritablePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getWritablePath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getWritablePath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getWritablePath)

static bool js_engine_FileUtils_isAbsolutePath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_isAbsolutePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_isAbsolutePath : Error processing arguments");
        bool result = cobj->isAbsolutePath(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_isAbsolutePath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_isAbsolutePath)

static bool js_engine_FileUtils_isDirectoryExist(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_isDirectoryExist : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_isDirectoryExist : Error processing arguments");
        bool result = cobj->isDirectoryExist(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_isDirectoryExist : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_isDirectoryExist)

static bool js_engine_FileUtils_isFileExist(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_isFileExist : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_isFileExist : Error processing arguments");
        bool result = cobj->isFileExist(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_isFileExist : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_isFileExist)

static bool js_engine_FileUtils_listFiles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_listFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_listFiles : Error processing arguments");
        std::vector<std::string> result = cobj->listFiles(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_listFiles : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_listFiles)

static bool js_engine_FileUtils_purgeCachedEntries(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_purgeCachedEntries : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->purgeCachedEntries();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_purgeCachedEntries)

static bool js_engine_FileUtils_removeDirectory(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_removeDirectory : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_removeDirectory : Error processing arguments");
        bool result = cobj->removeDirectory(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_removeDirectory : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_removeDirectory)

static bool js_engine_FileUtils_removeFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_removeFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_removeFile : Error processing arguments");
        bool result = cobj->removeFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_removeFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_removeFile)

static bool js_engine_FileUtils_renameFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2( cobj, false, "js_engine_FileUtils_renameFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->renameFile(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_engine_FileUtils_renameFile : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};
            HolderType<std::string, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->renameFile(arg0.value(), arg1.value(), arg2.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_engine_FileUtils_renameFile : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_renameFile)

static bool js_engine_FileUtils_setDefaultResourceRootPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_setDefaultResourceRootPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_setDefaultResourceRootPath : Error processing arguments");
        cobj->setDefaultResourceRootPath(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_setDefaultResourceRootPath)

static bool js_engine_FileUtils_setSearchPaths(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_setSearchPaths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<std::string>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_setSearchPaths : Error processing arguments");
        cobj->setSearchPaths(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_setSearchPaths)

static bool js_engine_FileUtils_setWritablePath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_setWritablePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_setWritablePath : Error processing arguments");
        cobj->setWritablePath(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_setWritablePath)

static bool js_engine_FileUtils_writeDataToFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_writeDataToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Data, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeDataToFile : Error processing arguments");
        bool result = cobj->writeDataToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeDataToFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_writeDataToFile)

static bool js_engine_FileUtils_writeStringToFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_writeStringToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeStringToFile : Error processing arguments");
        bool result = cobj->writeStringToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeStringToFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_writeStringToFile)

static bool js_engine_FileUtils_writeToFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_writeToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::unordered_map<std::string, cc::Value>, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeToFile : Error processing arguments");
        bool result = cobj->writeToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeToFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_writeToFile)

static bool js_engine_FileUtils_writeValueMapToFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_writeValueMapToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::unordered_map<std::string, cc::Value>, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeValueMapToFile : Error processing arguments");
        bool result = cobj->writeValueMapToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeValueMapToFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_writeValueMapToFile)

static bool js_engine_FileUtils_writeValueVectorToFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_writeValueVectorToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::vector<cc::Value>, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeValueVectorToFile : Error processing arguments");
        bool result = cobj->writeValueVectorToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_writeValueVectorToFile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_writeValueVectorToFile)

static bool js_engine_FileUtils_getInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::FileUtils* result = cc::FileUtils::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getInstance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getInstance)

static bool js_engine_FileUtils_setDelegate(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::FileUtils*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_setDelegate : Error processing arguments");
        cc::FileUtils::setDelegate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_setDelegate)

static bool js_engine_FileUtils_normalizePath(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_normalizePath : Error processing arguments");
        std::string result = cc::FileUtils::normalizePath(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_normalizePath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_normalizePath)

static bool js_engine_FileUtils_getFileDir(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileDir : Error processing arguments");
        std::string result = cc::FileUtils::getFileDir(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileDir : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getFileDir)


static bool js_cc_FileUtils_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::FileUtils>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_FileUtils_finalize)

bool js_register_engine_FileUtils(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("FileUtils", obj, nullptr, nullptr);

    cls->defineFunction("addSearchPath", _SE(js_engine_FileUtils_addSearchPath));
    cls->defineFunction("createDirectory", _SE(js_engine_FileUtils_createDirectory));
    cls->defineFunction("fullPathForFilename", _SE(js_engine_FileUtils_fullPathForFilename));
    cls->defineFunction("fullPathFromRelativeFile", _SE(js_engine_FileUtils_fullPathFromRelativeFile));
    cls->defineFunction("getDataFromFile", _SE(js_engine_FileUtils_getDataFromFile));
    cls->defineFunction("getDefaultResourceRootPath", _SE(js_engine_FileUtils_getDefaultResourceRootPath));
    cls->defineFunction("getFileExtension", _SE(js_engine_FileUtils_getFileExtension));
    cls->defineFunction("getFileSize", _SE(js_engine_FileUtils_getFileSize));
    cls->defineFunction("getOriginalSearchPaths", _SE(js_engine_FileUtils_getOriginalSearchPaths));
    cls->defineFunction("getSearchPaths", _SE(js_engine_FileUtils_getSearchPaths));
    cls->defineFunction("getStringFromFile", _SE(js_engine_FileUtils_getStringFromFile));
    cls->defineFunction("getSuitableFOpen", _SE(js_engine_FileUtils_getSuitableFOpen));
    cls->defineFunction("getValueMapFromData", _SE(js_engine_FileUtils_getValueMapFromData));
    cls->defineFunction("getValueMapFromFile", _SE(js_engine_FileUtils_getValueMapFromFile));
    cls->defineFunction("getValueVectorFromFile", _SE(js_engine_FileUtils_getValueVectorFromFile));
    cls->defineFunction("getWritablePath", _SE(js_engine_FileUtils_getWritablePath));
    cls->defineFunction("isAbsolutePath", _SE(js_engine_FileUtils_isAbsolutePath));
    cls->defineFunction("isDirectoryExist", _SE(js_engine_FileUtils_isDirectoryExist));
    cls->defineFunction("isFileExist", _SE(js_engine_FileUtils_isFileExist));
    cls->defineFunction("listFiles", _SE(js_engine_FileUtils_listFiles));
    cls->defineFunction("purgeCachedEntries", _SE(js_engine_FileUtils_purgeCachedEntries));
    cls->defineFunction("removeDirectory", _SE(js_engine_FileUtils_removeDirectory));
    cls->defineFunction("removeFile", _SE(js_engine_FileUtils_removeFile));
    cls->defineFunction("renameFile", _SE(js_engine_FileUtils_renameFile));
    cls->defineFunction("setDefaultResourceRootPath", _SE(js_engine_FileUtils_setDefaultResourceRootPath));
    cls->defineFunction("setSearchPaths", _SE(js_engine_FileUtils_setSearchPaths));
    cls->defineFunction("setWritablePath", _SE(js_engine_FileUtils_setWritablePath));
    cls->defineFunction("writeDataToFile", _SE(js_engine_FileUtils_writeDataToFile));
    cls->defineFunction("writeStringToFile", _SE(js_engine_FileUtils_writeStringToFile));
    cls->defineFunction("writeToFile", _SE(js_engine_FileUtils_writeToFile));
    cls->defineFunction("writeValueMapToFile", _SE(js_engine_FileUtils_writeValueMapToFile));
    cls->defineFunction("writeValueVectorToFile", _SE(js_engine_FileUtils_writeValueVectorToFile));
    cls->defineStaticFunction("getInstance", _SE(js_engine_FileUtils_getInstance));
    cls->defineStaticFunction("setDelegate", _SE(js_engine_FileUtils_setDelegate));
    cls->defineStaticFunction("normalizePath", _SE(js_engine_FileUtils_normalizePath));
    cls->defineStaticFunction("getFileDir", _SE(js_engine_FileUtils_getFileDir));
    cls->defineFinalizeFunction(_SE(js_cc_FileUtils_finalize));
    cls->install();
    JSBClassType::registerClass<cc::FileUtils>(cls);

    __jsb_cc_FileUtils_proto = cls->getProto();
    __jsb_cc_FileUtils_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_OSInterface_proto = nullptr;
se::Class* __jsb_cc_OSInterface_class = nullptr;



bool js_register_engine_OSInterface(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("OSInterface", obj, nullptr, nullptr);

    cls->install();
    JSBClassType::registerClass<cc::OSInterface>(cls);

    __jsb_cc_OSInterface_proto = cls->getProto();
    __jsb_cc_OSInterface_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ICanvasGradient_proto = nullptr;
se::Class* __jsb_cc_ICanvasGradient_class = nullptr;

static bool js_engine_ICanvasGradient_addColorStop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasGradient>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasGradient_addColorStop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasGradient_addColorStop : Error processing arguments");
        cobj->addColorStop(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasGradient_addColorStop)



bool js_register_engine_ICanvasGradient(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ICanvasGradient", obj, nullptr, nullptr);

    cls->defineFunction("addColorStop", _SE(js_engine_ICanvasGradient_addColorStop));
    cls->install();
    JSBClassType::registerClass<cc::ICanvasGradient>(cls);

    __jsb_cc_ICanvasGradient_proto = cls->getProto();
    __jsb_cc_ICanvasGradient_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ICanvasRenderingContext2D_proto = nullptr;
se::Class* __jsb_cc_ICanvasRenderingContext2D_class = nullptr;

static bool js_engine_ICanvasRenderingContext2D_beginPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_beginPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginPath();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_beginPath)

static bool js_engine_ICanvasRenderingContext2D_clearRect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_clearRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_clearRect : Error processing arguments");
        cobj->clearRect(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_clearRect)

static bool js_engine_ICanvasRenderingContext2D_closePath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_closePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->closePath();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_closePath)

static bool js_engine_ICanvasRenderingContext2D_createLinearGradient(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_createLinearGradient : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_createLinearGradient : Error processing arguments");
        cc::ICanvasGradient* result = cobj->createLinearGradient(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_createLinearGradient : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_createLinearGradient)

static bool js_engine_ICanvasRenderingContext2D_fill(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_fill : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->fill();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_fill)

static bool js_engine_ICanvasRenderingContext2D_fillImageData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_fillImageData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<cc::Data, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_fillImageData : Error processing arguments");
        cobj->fillImageData(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_fillImageData)

static bool js_engine_ICanvasRenderingContext2D_fillRect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_fillRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_fillRect : Error processing arguments");
        cobj->fillRect(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_fillRect)

static bool js_engine_ICanvasRenderingContext2D_fillText(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_fillText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_fillText : Error processing arguments");
        cobj->fillText(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_fillText)

static bool js_engine_ICanvasRenderingContext2D_lineTo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_lineTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_lineTo : Error processing arguments");
        cobj->lineTo(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_lineTo)

static bool js_engine_ICanvasRenderingContext2D_measureText(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_measureText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_measureText : Error processing arguments");
        cc::Size result = cobj->measureText(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_measureText : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_measureText)

static bool js_engine_ICanvasRenderingContext2D_moveTo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_moveTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_moveTo : Error processing arguments");
        cobj->moveTo(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_moveTo)

static bool js_engine_ICanvasRenderingContext2D_rect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_rect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_rect : Error processing arguments");
        cobj->rect(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_rect)

static bool js_engine_ICanvasRenderingContext2D_restore(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_restore : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->restore();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_restore)

static bool js_engine_ICanvasRenderingContext2D_rotate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_rotate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_rotate : Error processing arguments");
        cobj->rotate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_rotate)

static bool js_engine_ICanvasRenderingContext2D_save(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_save : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->save();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_save)

static bool js_engine_ICanvasRenderingContext2D_scale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_scale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_scale : Error processing arguments");
        cobj->scale(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_scale)

static bool js_engine_ICanvasRenderingContext2D_setCanvasBufferUpdatedCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setCanvasBufferUpdatedCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (const cc::Data &)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const cc::Data & larg0) -> void {
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
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setCanvasBufferUpdatedCallback : Error processing arguments");
        cobj->setCanvasBufferUpdatedCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_setCanvasBufferUpdatedCallback)

static bool js_engine_ICanvasRenderingContext2D_setFillStyle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setFillStyle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setFillStyle : Error processing arguments");
        cobj->setFillStyle(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setFillStyle)

static bool js_engine_ICanvasRenderingContext2D_setFont(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setFont : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setFont : Error processing arguments");
        cobj->setFont(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setFont)

static bool js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation : Error processing arguments");
        cobj->setGlobalCompositeOperation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation)

static bool js_engine_ICanvasRenderingContext2D_setHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setHeight : Error processing arguments");
        cobj->setHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setHeight)

static bool js_engine_ICanvasRenderingContext2D_setLineCap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setLineCap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setLineCap : Error processing arguments");
        cobj->setLineCap(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setLineCap)

static bool js_engine_ICanvasRenderingContext2D_setLineJoin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setLineJoin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setLineJoin : Error processing arguments");
        cobj->setLineJoin(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setLineJoin)

static bool js_engine_ICanvasRenderingContext2D_setLineWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setLineWidth)

static bool js_engine_ICanvasRenderingContext2D_setStrokeStyle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setStrokeStyle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setStrokeStyle : Error processing arguments");
        cobj->setStrokeStyle(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setStrokeStyle)

static bool js_engine_ICanvasRenderingContext2D_setTextAlign(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setTextAlign : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setTextAlign : Error processing arguments");
        cobj->setTextAlign(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setTextAlign)

static bool js_engine_ICanvasRenderingContext2D_setTextBaseline(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setTextBaseline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setTextBaseline : Error processing arguments");
        cobj->setTextBaseline(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setTextBaseline)

static bool js_engine_ICanvasRenderingContext2D_setTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setTransform : Error processing arguments");
        cobj->setTransform(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_setTransform)

static bool js_engine_ICanvasRenderingContext2D_setWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_setWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_setWidth : Error processing arguments");
        cobj->setWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_engine_ICanvasRenderingContext2D_setWidth)

static bool js_engine_ICanvasRenderingContext2D_stroke(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_stroke : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stroke();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_stroke)

static bool js_engine_ICanvasRenderingContext2D_strokeText(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_strokeText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_strokeText : Error processing arguments");
        cobj->strokeText(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_strokeText)

static bool js_engine_ICanvasRenderingContext2D_transform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_transform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_transform : Error processing arguments");
        cobj->transform(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_transform)

static bool js_engine_ICanvasRenderingContext2D_translate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_ICanvasRenderingContext2D_translate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_ICanvasRenderingContext2D_translate : Error processing arguments");
        cobj->translate(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_translate)



bool js_register_engine_ICanvasRenderingContext2D(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ICanvasRenderingContext2D", obj, __jsb_cc_OSInterface_proto, nullptr);

    cls->defineProperty("width", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setWidth));
    cls->defineProperty("height", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setHeight));
    cls->defineProperty("fillStyle", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setFillStyle));
    cls->defineProperty("font", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setFont));
    cls->defineProperty("globalCompositeOperation", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation));
    cls->defineProperty("lineCap", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineCap));
    cls->defineProperty("lineJoin", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineJoin));
    cls->defineProperty("lineWidth", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineWidth));
    cls->defineProperty("strokeStyle", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setStrokeStyle));
    cls->defineProperty("textAlign", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setTextAlign));
    cls->defineProperty("textBaseline", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setTextBaseline));
    cls->defineFunction("beginPath", _SE(js_engine_ICanvasRenderingContext2D_beginPath));
    cls->defineFunction("clearRect", _SE(js_engine_ICanvasRenderingContext2D_clearRect));
    cls->defineFunction("closePath", _SE(js_engine_ICanvasRenderingContext2D_closePath));
    cls->defineFunction("createLinearGradient", _SE(js_engine_ICanvasRenderingContext2D_createLinearGradient));
    cls->defineFunction("fill", _SE(js_engine_ICanvasRenderingContext2D_fill));
    cls->defineFunction("fillImageData", _SE(js_engine_ICanvasRenderingContext2D_fillImageData));
    cls->defineFunction("fillRect", _SE(js_engine_ICanvasRenderingContext2D_fillRect));
    cls->defineFunction("fillText", _SE(js_engine_ICanvasRenderingContext2D_fillText));
    cls->defineFunction("lineTo", _SE(js_engine_ICanvasRenderingContext2D_lineTo));
    cls->defineFunction("measureText", _SE(js_engine_ICanvasRenderingContext2D_measureText));
    cls->defineFunction("moveTo", _SE(js_engine_ICanvasRenderingContext2D_moveTo));
    cls->defineFunction("rect", _SE(js_engine_ICanvasRenderingContext2D_rect));
    cls->defineFunction("restore", _SE(js_engine_ICanvasRenderingContext2D_restore));
    cls->defineFunction("rotate", _SE(js_engine_ICanvasRenderingContext2D_rotate));
    cls->defineFunction("save", _SE(js_engine_ICanvasRenderingContext2D_save));
    cls->defineFunction("scale", _SE(js_engine_ICanvasRenderingContext2D_scale));
    cls->defineFunction("setCanvasBufferUpdatedCallback", _SE(js_engine_ICanvasRenderingContext2D_setCanvasBufferUpdatedCallback));
    cls->defineFunction("setTransform", _SE(js_engine_ICanvasRenderingContext2D_setTransform));
    cls->defineFunction("stroke", _SE(js_engine_ICanvasRenderingContext2D_stroke));
    cls->defineFunction("strokeText", _SE(js_engine_ICanvasRenderingContext2D_strokeText));
    cls->defineFunction("transform", _SE(js_engine_ICanvasRenderingContext2D_transform));
    cls->defineFunction("translate", _SE(js_engine_ICanvasRenderingContext2D_translate));
    cls->install();
    JSBClassType::registerClass<cc::ICanvasRenderingContext2D>(cls);

    __jsb_cc_ICanvasRenderingContext2D_proto = cls->getProto();
    __jsb_cc_ICanvasRenderingContext2D_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_CanvasGradient_proto = nullptr;
se::Class* __jsb_cc_CanvasGradient_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cc_CanvasGradient_finalize)

static bool js_engine_CanvasGradient_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::CanvasGradient* cobj = JSB_ALLOC(cc::CanvasGradient);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_engine_CanvasGradient_constructor, __jsb_cc_CanvasGradient_class, js_cc_CanvasGradient_finalize)



static bool js_cc_CanvasGradient_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::CanvasGradient>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::CanvasGradient>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_CanvasGradient_finalize)

bool js_register_engine_CanvasGradient(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CanvasGradient", obj, __jsb_cc_ICanvasGradient_proto, _SE(js_engine_CanvasGradient_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_CanvasGradient_finalize));
    cls->install();
    JSBClassType::registerClass<cc::CanvasGradient>(cls);

    __jsb_cc_CanvasGradient_proto = cls->getProto();
    __jsb_cc_CanvasGradient_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_CanvasRenderingContext2D_proto = nullptr;
se::Class* __jsb_cc_CanvasRenderingContext2D_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cc_CanvasRenderingContext2D_finalize)

static bool js_engine_CanvasRenderingContext2D_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    float arg0 = 0;
    float arg1 = 0;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_constructor : Error processing arguments");
    cc::CanvasRenderingContext2D* cobj = JSB_ALLOC(cc::CanvasRenderingContext2D, arg0, arg1);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_engine_CanvasRenderingContext2D_constructor, __jsb_cc_CanvasRenderingContext2D_class, js_cc_CanvasRenderingContext2D_finalize)



static bool js_cc_CanvasRenderingContext2D_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::CanvasRenderingContext2D>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::CanvasRenderingContext2D>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_CanvasRenderingContext2D_finalize)

bool js_register_engine_CanvasRenderingContext2D(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CanvasRenderingContext2D", obj, __jsb_cc_ICanvasRenderingContext2D_proto, _SE(js_engine_CanvasRenderingContext2D_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_CanvasRenderingContext2D_finalize));
    cls->install();
    JSBClassType::registerClass<cc::CanvasRenderingContext2D>(cls);

    __jsb_cc_CanvasRenderingContext2D_proto = cls->getProto();
    __jsb_cc_CanvasRenderingContext2D_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Device_proto = nullptr;
se::Class* __jsb_cc_Device_class = nullptr;

static bool js_engine_Device_getDPI(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cc::Device::getDPI();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDPI : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDPI)

static bool js_engine_Device_getDevicePixelRatio(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cc::Device::getDevicePixelRatio();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDevicePixelRatio : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDevicePixelRatio)

static bool js_engine_Device_setAccelerometerEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_setAccelerometerEnabled : Error processing arguments");
        cc::Device::setAccelerometerEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_setAccelerometerEnabled)

static bool js_engine_Device_setAccelerometerInterval(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_setAccelerometerInterval : Error processing arguments");
        cc::Device::setAccelerometerInterval(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_setAccelerometerInterval)

static bool js_engine_Device_getDeviceOrientation(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cc::Device::getDeviceOrientation());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDeviceOrientation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDeviceOrientation)

static bool js_engine_Device_getDeviceModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cc::Device::getDeviceModel();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDeviceModel : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDeviceModel)

static bool js_engine_Device_setKeepScreenOn(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_setKeepScreenOn : Error processing arguments");
        cc::Device::setKeepScreenOn(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_setKeepScreenOn)

static bool js_engine_Device_vibrate(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_vibrate : Error processing arguments");
        cc::Device::vibrate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_vibrate)

static bool js_engine_Device_getBatteryLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cc::Device::getBatteryLevel();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getBatteryLevel : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getBatteryLevel)

static bool js_engine_Device_getNetworkType(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cc::Device::getNetworkType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getNetworkType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getNetworkType)

static bool js_engine_Device_getSafeAreaEdge(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Vec4 result = cc::Device::getSafeAreaEdge();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getSafeAreaEdge : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getSafeAreaEdge)



bool js_register_engine_Device(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Device", obj, nullptr, nullptr);

    cls->defineStaticFunction("getDPI", _SE(js_engine_Device_getDPI));
    cls->defineStaticFunction("getDevicePixelRatio", _SE(js_engine_Device_getDevicePixelRatio));
    cls->defineStaticFunction("setAccelerometerEnabled", _SE(js_engine_Device_setAccelerometerEnabled));
    cls->defineStaticFunction("setAccelerometerInterval", _SE(js_engine_Device_setAccelerometerInterval));
    cls->defineStaticFunction("getDeviceOrientation", _SE(js_engine_Device_getDeviceOrientation));
    cls->defineStaticFunction("getDeviceModel", _SE(js_engine_Device_getDeviceModel));
    cls->defineStaticFunction("setKeepScreenOn", _SE(js_engine_Device_setKeepScreenOn));
    cls->defineStaticFunction("vibrate", _SE(js_engine_Device_vibrate));
    cls->defineStaticFunction("getBatteryLevel", _SE(js_engine_Device_getBatteryLevel));
    cls->defineStaticFunction("getNetworkType", _SE(js_engine_Device_getNetworkType));
    cls->defineStaticFunction("getSafeAreaEdge", _SE(js_engine_Device_getSafeAreaEdge));
    cls->install();
    JSBClassType::registerClass<cc::Device>(cls);

    __jsb_cc_Device_proto = cls->getProto();
    __jsb_cc_Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_SAXParser_proto = nullptr;
se::Class* __jsb_cc_SAXParser_class = nullptr;

static bool js_engine_SAXParser_init(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SAXParser>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_SAXParser_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<const char*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_SAXParser_init : Error processing arguments");
        bool result = cobj->init(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_SAXParser_init : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_SAXParser_init)



bool js_register_engine_SAXParser(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PlistParser", obj, nullptr, nullptr);

    cls->defineFunction("init", _SE(js_engine_SAXParser_init));
    cls->install();
    JSBClassType::registerClass<cc::SAXParser>(cls);

    __jsb_cc_SAXParser_proto = cls->getProto();
    __jsb_cc_SAXParser_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_engine(se::Object* obj)
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

    js_register_engine_FileUtils(ns);
    js_register_engine_OSInterface(ns);
    js_register_engine_ICanvasGradient(ns);
    js_register_engine_ICanvasRenderingContext2D(ns);
    js_register_engine_CanvasGradient(ns);
    js_register_engine_CanvasRenderingContext2D(ns);
    js_register_engine_Device(ns);
    js_register_engine_SAXParser(ns);
    return true;
}

