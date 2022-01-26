
// clang-format off
#include "cocos/bindings/auto/jsb_cocos_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "platform/FileUtils.h"
#include "bindings/event/EventDispatcher.h"
#include "platform/interfaces/modules/canvas/CanvasRenderingContext2D.h"
#include "platform/interfaces/modules/Device.h"
#include "platform/SAXParser.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Quaternion.h"
#include "math/Color.h"
#include "core/data/Object.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_FileUtils_proto = nullptr; // NOLINT
se::Class* __jsb_cc_FileUtils_class = nullptr;  // NOLINT

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

static bool js_engine_FileUtils_getFileDir_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileDir_static : Error processing arguments");
        std::string result = cc::FileUtils::getFileDir(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getFileDir_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getFileDir_static)

static bool js_engine_FileUtils_getInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::FileUtils* result = cc::FileUtils::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_getInstance_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getInstance_static)

static bool js_engine_FileUtils_normalizePath_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_normalizePath_static : Error processing arguments");
        std::string result = cc::FileUtils::normalizePath(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_normalizePath_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_normalizePath_static)
static bool js_cc_FileUtils_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
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
    cls->defineStaticFunction("getFileDir", _SE(js_engine_FileUtils_getFileDir_static));
    cls->defineStaticFunction("getInstance", _SE(js_engine_FileUtils_getInstance_static));
    cls->defineStaticFunction("normalizePath", _SE(js_engine_FileUtils_normalizePath_static));
    cls->defineFinalizeFunction(_SE(js_cc_FileUtils_finalize));
    cls->install();
    JSBClassType::registerClass<cc::FileUtils>(cls);

    __jsb_cc_FileUtils_proto = cls->getProto();
    __jsb_cc_FileUtils_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_OSInterface_proto = nullptr; // NOLINT
se::Class* __jsb_cc_OSInterface_class = nullptr;  // NOLINT

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
se::Object* __jsb_cc_Vec2_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Vec2_class = nullptr;  // NOLINT

static bool js_engine_Vec2_get_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Vec2>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Vec2_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->x, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_Vec2_get_x)

static bool js_engine_Vec2_set_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Vec2>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Vec2_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_Vec2_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Vec2_set_x)

static bool js_engine_Vec2_get_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Vec2>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Vec2_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->y, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_Vec2_get_y)

static bool js_engine_Vec2_set_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Vec2>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Vec2_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_Vec2_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Vec2_set_y)

SE_DECLARE_FINALIZE_FUNC(js_cc_Vec2_finalize)

static bool js_engine_Vec2_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Vec2, arg0.value(), arg1.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Vec2);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<const float*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Vec2, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<cc::Vec2, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::Vec2, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Vec2, arg0.value(), arg1.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_engine_Vec2_constructor, __jsb_cc_Vec2_class, js_cc_Vec2_finalize)

static bool js_cc_Vec2_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Vec2_finalize)

bool js_register_engine_Vec2(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Vec2", obj, nullptr, _SE(js_engine_Vec2_constructor));

    cls->defineProperty("x", _SE(js_engine_Vec2_get_x), _SE(js_engine_Vec2_set_x));
    cls->defineProperty("y", _SE(js_engine_Vec2_get_y), _SE(js_engine_Vec2_set_y));
    cls->defineFinalizeFunction(_SE(js_cc_Vec2_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Vec2>(cls);

    __jsb_cc_Vec2_proto = cls->getProto();
    __jsb_cc_Vec2_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ICanvasGradient_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ICanvasGradient_class = nullptr;  // NOLINT

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
se::Object* __jsb_cc_ICanvasRenderingContext2D_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ICanvasRenderingContext2D_class = nullptr;  // NOLINT

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
                auto * thisObj = s.thisObject();
                auto lambda = [=](const cc::Data & larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setFillStyle)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setFont)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setHeight)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setLineCap)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setLineJoin)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setLineWidth)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setStrokeStyle)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setTextAlign)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setTextBaseline)

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
SE_BIND_FUNC_AS_PROP_SET(js_engine_ICanvasRenderingContext2D_setWidth)

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

    cls->defineProperty("strokeStyle", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setStrokeStyle_asSetter));
    cls->defineProperty("lineWidth", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineWidth_asSetter));
    cls->defineProperty("lineCap", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineCap_asSetter));
    cls->defineProperty("globalCompositeOperation", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation_asSetter));
    cls->defineProperty("fillStyle", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setFillStyle_asSetter));
    cls->defineProperty("height", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setHeight_asSetter));
    cls->defineProperty("width", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setWidth_asSetter));
    cls->defineProperty("textBaseline", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setTextBaseline_asSetter));
    cls->defineProperty("lineJoin", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineJoin_asSetter));
    cls->defineProperty("font", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setFont_asSetter));
    cls->defineProperty("textAlign", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setTextAlign_asSetter));
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
se::Object* __jsb_cc_CanvasGradient_proto = nullptr; // NOLINT
se::Class* __jsb_cc_CanvasGradient_class = nullptr;  // NOLINT

SE_DECLARE_FINALIZE_FUNC(js_cc_CanvasGradient_finalize)

static bool js_engine_CanvasGradient_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::CanvasGradient);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_engine_CanvasGradient_constructor, __jsb_cc_CanvasGradient_class, js_cc_CanvasGradient_finalize)

static bool js_cc_CanvasGradient_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
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
se::Object* __jsb_cc_CanvasRenderingContext2D_proto = nullptr; // NOLINT
se::Class* __jsb_cc_CanvasRenderingContext2D_class = nullptr;  // NOLINT

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
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::CanvasRenderingContext2D, arg0, arg1);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_engine_CanvasRenderingContext2D_constructor, __jsb_cc_CanvasRenderingContext2D_class, js_cc_CanvasRenderingContext2D_finalize)

static bool js_cc_CanvasRenderingContext2D_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
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
se::Object* __jsb_cc_Device_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Device_class = nullptr;  // NOLINT

static bool js_engine_Device_getBatteryLevel_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cc::Device::getBatteryLevel();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getBatteryLevel_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getBatteryLevel_static)

static bool js_engine_Device_getDPI_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cc::Device::getDPI();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDPI_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDPI_static)

static bool js_engine_Device_getDeviceModel_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cc::Device::getDeviceModel();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDeviceModel_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDeviceModel_static)

static bool js_engine_Device_getDeviceOrientation_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cc::Device::getDeviceOrientation());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDeviceOrientation_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDeviceOrientation_static)

static bool js_engine_Device_getDevicePixelRatio_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cc::Device::getDevicePixelRatio();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getDevicePixelRatio_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getDevicePixelRatio_static)

static bool js_engine_Device_getNetworkType_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cc::Device::getNetworkType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getNetworkType_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getNetworkType_static)

static bool js_engine_Device_getSafeAreaEdge_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Vec4 result = cc::Device::getSafeAreaEdge();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_Device_getSafeAreaEdge_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_Device_getSafeAreaEdge_static)

static bool js_engine_Device_setAccelerometerEnabled_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_setAccelerometerEnabled_static : Error processing arguments");
        cc::Device::setAccelerometerEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_setAccelerometerEnabled_static)

static bool js_engine_Device_setAccelerometerInterval_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_setAccelerometerInterval_static : Error processing arguments");
        cc::Device::setAccelerometerInterval(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_setAccelerometerInterval_static)

static bool js_engine_Device_setKeepScreenOn_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_setKeepScreenOn_static : Error processing arguments");
        cc::Device::setKeepScreenOn(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_setKeepScreenOn_static)

static bool js_engine_Device_vibrate_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_engine_Device_vibrate_static : Error processing arguments");
        cc::Device::vibrate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_Device_vibrate_static)

bool js_register_engine_Device(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Device", obj, nullptr, nullptr);

    cls->defineStaticFunction("getBatteryLevel", _SE(js_engine_Device_getBatteryLevel_static));
    cls->defineStaticFunction("getDPI", _SE(js_engine_Device_getDPI_static));
    cls->defineStaticFunction("getDeviceModel", _SE(js_engine_Device_getDeviceModel_static));
    cls->defineStaticFunction("getDeviceOrientation", _SE(js_engine_Device_getDeviceOrientation_static));
    cls->defineStaticFunction("getDevicePixelRatio", _SE(js_engine_Device_getDevicePixelRatio_static));
    cls->defineStaticFunction("getNetworkType", _SE(js_engine_Device_getNetworkType_static));
    cls->defineStaticFunction("getSafeAreaEdge", _SE(js_engine_Device_getSafeAreaEdge_static));
    cls->defineStaticFunction("setAccelerometerEnabled", _SE(js_engine_Device_setAccelerometerEnabled_static));
    cls->defineStaticFunction("setAccelerometerInterval", _SE(js_engine_Device_setAccelerometerInterval_static));
    cls->defineStaticFunction("setKeepScreenOn", _SE(js_engine_Device_setKeepScreenOn_static));
    cls->defineStaticFunction("vibrate", _SE(js_engine_Device_vibrate_static));
    cls->install();
    JSBClassType::registerClass<cc::Device>(cls);

    __jsb_cc_Device_proto = cls->getProto();
    __jsb_cc_Device_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_SAXParser_proto = nullptr; // NOLINT
se::Class* __jsb_cc_SAXParser_class = nullptr;  // NOLINT

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
se::Object* __jsb_cc_Color_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Color_class = nullptr;  // NOLINT

static bool js_engine_Color_get_r(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_get_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->r, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->r, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_Color_get_r)

static bool js_engine_Color_set_r(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_set_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->r, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_Color_set_r : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Color_set_r)

static bool js_engine_Color_get_g(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_get_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->g, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->g, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_Color_get_g)

static bool js_engine_Color_set_g(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_set_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->g, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_Color_set_g : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Color_set_g)

static bool js_engine_Color_get_b(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_get_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->b, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->b, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_Color_get_b)

static bool js_engine_Color_set_b(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_set_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->b, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_Color_set_b : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Color_set_b)

static bool js_engine_Color_get_a(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_get_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->a, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->a, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_Color_get_a)

static bool js_engine_Color_set_a(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_Color_set_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->a, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_Color_set_a : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Color_set_a)

SE_DECLARE_FINALIZE_FUNC(js_cc_Color_finalize)

static bool js_engine_Color_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            HolderType<uint8_t, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<uint8_t, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<uint8_t, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<uint8_t, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Color, arg0.value(), arg1.value(), arg2.value(), arg3.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Color);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<const unsigned char*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Color, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Color, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<cc::Color, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::Color, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Color, arg0.value(), arg1.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_engine_Color_constructor, __jsb_cc_Color_class, js_cc_Color_finalize)

static bool js_cc_Color_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Color_finalize)

bool js_register_engine_Color(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Color", obj, nullptr, _SE(js_engine_Color_constructor));

    cls->defineProperty("r", _SE(js_engine_Color_get_r), _SE(js_engine_Color_set_r));
    cls->defineProperty("g", _SE(js_engine_Color_get_g), _SE(js_engine_Color_set_g));
    cls->defineProperty("b", _SE(js_engine_Color_get_b), _SE(js_engine_Color_set_b));
    cls->defineProperty("a", _SE(js_engine_Color_get_a), _SE(js_engine_Color_set_a));
    cls->defineFinalizeFunction(_SE(js_cc_Color_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Color>(cls);

    __jsb_cc_Color_proto = cls->getProto();
    __jsb_cc_Color_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_CCObject_proto = nullptr; // NOLINT
se::Class* __jsb_cc_CCObject_class = nullptr;  // NOLINT

static bool js_engine_CCObject_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->destroy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_destroy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_CCObject_destroy)

static bool js_engine_CCObject_destroyImmediate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_destroyImmediate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroyImmediate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_CCObject_destroyImmediate)

static bool js_engine_CCObject_getHideFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_getHideFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getHideFlags());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_getHideFlags : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_engine_CCObject_getHideFlags)

static bool js_engine_CCObject_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_engine_CCObject_getName)

static bool js_engine_CCObject_isReplicated(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_isReplicated : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isReplicated();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_isReplicated : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_engine_CCObject_isReplicated)

static bool js_engine_CCObject_isValid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_isValid : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isValid();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_isValid : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_engine_CCObject_isValid)

static bool js_engine_CCObject_setHideFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_setHideFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::CCObject::Flags, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_setHideFlags : Error processing arguments");
        cobj->setHideFlags(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_engine_CCObject_setHideFlags)

static bool js_engine_CCObject_setName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_setName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_setName : Error processing arguments");
        cobj->setName(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_engine_CCObject_setName)

static bool js_engine_CCObject_setReplicated(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_setReplicated : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_setReplicated : Error processing arguments");
        cobj->setReplicated(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_engine_CCObject_setReplicated)

static bool js_engine_CCObject_toString(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_toString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->toString();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_engine_CCObject_toString : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_CCObject_toString)

static bool js_engine_CCObject_deferredDestroy_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::CCObject::deferredDestroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_CCObject_deferredDestroy_static)

static bool js_engine_CCObject_get__objFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_get__objFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_objFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_objFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_CCObject_get__objFlags)

static bool js_engine_CCObject_set__objFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_set__objFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_objFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_CCObject_set__objFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_CCObject_set__objFlags)

static bool js_engine_CCObject_get__name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_get__name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_CCObject_get__name)

static bool js_engine_CCObject_set__name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    SE_PRECONDITION2(cobj, false, "js_engine_CCObject_set__name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_engine_CCObject_set__name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_CCObject_set__name)
static bool js_cc_CCObject_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_CCObject_finalize)

bool js_register_engine_CCObject(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCObject", obj, nullptr, nullptr);

    cls->defineProperty("_objFlags", _SE(js_engine_CCObject_get__objFlags), _SE(js_engine_CCObject_set__objFlags));
    cls->defineProperty("_name", _SE(js_engine_CCObject_get__name), _SE(js_engine_CCObject_set__name));
    cls->defineProperty("hideFlags", _SE(js_engine_CCObject_getHideFlags_asGetter), _SE(js_engine_CCObject_setHideFlags_asSetter));
    cls->defineProperty("replicated", _SE(js_engine_CCObject_isReplicated_asGetter), _SE(js_engine_CCObject_setReplicated_asSetter));
    cls->defineProperty("name", _SE(js_engine_CCObject_getName_asGetter), _SE(js_engine_CCObject_setName_asSetter));
    cls->defineProperty("isValid", _SE(js_engine_CCObject_isValid_asGetter), nullptr);
    cls->defineFunction("destroy", _SE(js_engine_CCObject_destroy));
    cls->defineFunction("_destroyImmediate", _SE(js_engine_CCObject_destroyImmediate));
    cls->defineFunction("toString", _SE(js_engine_CCObject_toString));
    cls->defineStaticFunction("deferredDestroy", _SE(js_engine_CCObject_deferredDestroy_static));
    cls->defineFinalizeFunction(_SE(js_cc_CCObject_finalize));
    cls->install();
    JSBClassType::registerClass<cc::CCObject>(cls);

    __jsb_cc_CCObject_proto = cls->getProto();
    __jsb_cc_CCObject_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_engine(se::Object* obj)    // NOLINT
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_engine_CCObject(ns);
    js_register_engine_ICanvasGradient(ns);
    js_register_engine_CanvasGradient(ns);
    js_register_engine_OSInterface(ns);
    js_register_engine_ICanvasRenderingContext2D(ns);
    js_register_engine_CanvasRenderingContext2D(ns);
    js_register_engine_Color(ns);
    js_register_engine_Device(ns);
    js_register_engine_FileUtils(ns);
    js_register_engine_SAXParser(ns);
    js_register_engine_Vec2(ns);
    return true;
}

// clang-format on