
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
#include "core/data/JSBNativeDataHolder.h"
#include "profiler/DebugRenderer.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif

#if CC_DEBUG
static bool js_engine_getter_return_true(se::State& s) // NOLINT(readability-identifier-naming)
{
    s.rval().setBoolean(true);
    return true;
}
SE_BIND_PROP_GET(js_engine_getter_return_true)
#endif
se::Object* __jsb_cc_FileUtils_proto = nullptr; // NOLINT
se::Class* __jsb_cc_FileUtils_class = nullptr;  // NOLINT

static bool js_engine_FileUtils_addSearchPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->addSearchPath(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->createDirectory(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string result = cobj->fullPathForFilename(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string result = cobj->fullPathFromRelativeFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cc::Data result = cobj->getDataFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getDefaultResourceRootPath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getDefaultResourceRootPath)

static bool js_engine_FileUtils_getFileDir(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string result = cobj->getFileDir(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getFileDir)

static bool js_engine_FileUtils_getFileExtension(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string result = cobj->getFileExtension(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        long result = cobj->getFileSize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getOriginalSearchPaths();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getSearchPaths();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string result = cobj->getStringFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string result = cobj->getSuitableFOpen(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<const char*, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::unordered_map<std::string, cc::Value> result = cobj->getValueMapFromData(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::unordered_map<std::string, cc::Value> result = cobj->getValueMapFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::vector<cc::Value> result = cobj->getValueVectorFromFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getWritablePath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->isAbsolutePath(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->isDirectoryExist(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->isFileExist(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::vector<std::string> result = cobj->listFiles(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_listFiles)

static bool js_engine_FileUtils_normalizePath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string result = cobj->normalizePath(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_normalizePath)

static bool js_engine_FileUtils_purgeCachedEntries(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::FileUtils>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->removeDirectory(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->removeFile(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2( cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
            SE_PRECONDITION2(ok, false, "Error processing arguments");
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
            SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<std::string>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Data, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->writeDataToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->writeStringToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::unordered_map<std::string, cc::Value>, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->writeToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::unordered_map<std::string, cc::Value>, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->writeValueMapToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::vector<cc::Value>, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->writeValueVectorToFile(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_writeValueVectorToFile)

static bool js_engine_FileUtils_getInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::FileUtils* result = cc::FileUtils::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_getInstance_static)

bool js_register_engine_FileUtils(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("FileUtils", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
    cls->defineFunction("addSearchPath", _SE(js_engine_FileUtils_addSearchPath));
    cls->defineFunction("createDirectory", _SE(js_engine_FileUtils_createDirectory));
    cls->defineFunction("fullPathForFilename", _SE(js_engine_FileUtils_fullPathForFilename));
    cls->defineFunction("fullPathFromRelativeFile", _SE(js_engine_FileUtils_fullPathFromRelativeFile));
    cls->defineFunction("getDataFromFile", _SE(js_engine_FileUtils_getDataFromFile));
    cls->defineFunction("getDefaultResourceRootPath", _SE(js_engine_FileUtils_getDefaultResourceRootPath));
    cls->defineFunction("getFileDir", _SE(js_engine_FileUtils_getFileDir));
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
    cls->defineFunction("normalizePath", _SE(js_engine_FileUtils_normalizePath));
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
    cls->defineStaticFunction("getInstance", _SE(js_engine_FileUtils_getInstance_static));
    cls->install();
    JSBClassType::registerClass<cc::FileUtils>(cls);

    __jsb_cc_FileUtils_proto = cls->getProto();
    __jsb_cc_FileUtils_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Vec2_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Vec2_class = nullptr;  // NOLINT

static bool js_engine_Vec2_get_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Vec2>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Vec2_set_x)

static bool js_engine_Vec2_get_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Vec2>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
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
se::Object* __jsb_cc_OSInterface_proto = nullptr; // NOLINT
se::Class* __jsb_cc_OSInterface_class = nullptr;  // NOLINT

bool js_register_engine_OSInterface(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("OSInterface", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
    cls->install();
    JSBClassType::registerClass<cc::OSInterface>(cls);

    __jsb_cc_OSInterface_proto = cls->getProto();
    __jsb_cc_OSInterface_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ICanvasGradient_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ICanvasGradient_class = nullptr;  // NOLINT

static bool js_engine_ICanvasGradient_addColorStop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasGradient>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cc::ICanvasGradient* result = cobj->createLinearGradient(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_createLinearGradient)

static bool js_engine_ICanvasRenderingContext2D_fetchData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->fetchData();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_ICanvasRenderingContext2D_fetchData)

static bool js_engine_ICanvasRenderingContext2D_fill(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ICanvasRenderingContext2D>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cc::Size result = cobj->measureText(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
    cls->defineProperty("width", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setWidth_asSetter));
    cls->defineProperty("height", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setHeight_asSetter));
    cls->defineProperty("fillStyle", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setFillStyle_asSetter));
    cls->defineProperty("font", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setFont_asSetter));
    cls->defineProperty("globalCompositeOperation", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setGlobalCompositeOperation_asSetter));
    cls->defineProperty("lineCap", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineCap_asSetter));
    cls->defineProperty("lineJoin", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineJoin_asSetter));
    cls->defineProperty("lineWidth", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setLineWidth_asSetter));
    cls->defineProperty("strokeStyle", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setStrokeStyle_asSetter));
    cls->defineProperty("textAlign", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setTextAlign_asSetter));
    cls->defineProperty("textBaseline", nullptr, _SE(js_engine_ICanvasRenderingContext2D_setTextBaseline_asSetter));
    cls->defineFunction("beginPath", _SE(js_engine_ICanvasRenderingContext2D_beginPath));
    cls->defineFunction("clearRect", _SE(js_engine_ICanvasRenderingContext2D_clearRect));
    cls->defineFunction("closePath", _SE(js_engine_ICanvasRenderingContext2D_closePath));
    cls->defineFunction("createLinearGradient", _SE(js_engine_ICanvasRenderingContext2D_createLinearGradient));
    cls->defineFunction("fetchData", _SE(js_engine_ICanvasRenderingContext2D_fetchData));
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
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
    SE_PRECONDITION2(ok, false, "Error processing arguments");
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<const char*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->init(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->r, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Color_set_r)

static bool js_engine_Color_get_g(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->g, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Color_set_g)

static bool js_engine_Color_get_b(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->b, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_Color_set_b)

static bool js_engine_Color_get_a(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Color>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->a, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
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

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->destroy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getHideFlags());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isReplicated();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isValid();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::CCObject::Flags, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->toString();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
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
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_objFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_CCObject_set__objFlags)

static bool js_engine_CCObject_get__name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::CCObject>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

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
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_name, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_CCObject_set__name)

SE_DECLARE_FINALIZE_FUNC(js_cc_CCObject_finalize)

static bool js_engine_CCObject_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::CCObject);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_engine_CCObject_constructor, __jsb_cc_CCObject_class, js_cc_CCObject_finalize)

static bool js_cc_CCObject_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_CCObject_finalize)

bool js_register_engine_CCObject(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CCObject", obj, nullptr, _SE(js_engine_CCObject_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
    cls->defineProperty("_objFlags", _SE(js_engine_CCObject_get__objFlags), _SE(js_engine_CCObject_set__objFlags));
    cls->defineProperty("_name", _SE(js_engine_CCObject_get__name), _SE(js_engine_CCObject_set__name));
    cls->defineProperty("name", _SE(js_engine_CCObject_getName_asGetter), _SE(js_engine_CCObject_setName_asSetter));
    cls->defineProperty("hideFlags", _SE(js_engine_CCObject_getHideFlags_asGetter), _SE(js_engine_CCObject_setHideFlags_asSetter));
    cls->defineProperty("replicated", _SE(js_engine_CCObject_isReplicated_asGetter), _SE(js_engine_CCObject_setReplicated_asSetter));
    cls->defineProperty("isValid", _SE(js_engine_CCObject_isValid_asGetter), nullptr);
    cls->defineFunction("_destroy", _SE(js_engine_CCObject_destroy));
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
se::Object* __jsb_cc_JSBNativeDataHolder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_JSBNativeDataHolder_class = nullptr;  // NOLINT

static bool js_engine_JSBNativeDataHolder_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::JSBNativeDataHolder>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_JSBNativeDataHolder_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cc_JSBNativeDataHolder_finalize)

static bool js_engine_JSBNativeDataHolder_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned char*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::JSBNativeDataHolder, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::JSBNativeDataHolder);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_engine_JSBNativeDataHolder_constructor, __jsb_cc_JSBNativeDataHolder_class, js_cc_JSBNativeDataHolder_finalize)

static bool js_cc_JSBNativeDataHolder_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_JSBNativeDataHolder_finalize)

bool js_register_engine_JSBNativeDataHolder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("JSBNativeDataHolder", obj, nullptr, _SE(js_engine_JSBNativeDataHolder_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
    cls->defineFunction("destroy", _SE(js_engine_JSBNativeDataHolder_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_JSBNativeDataHolder_finalize));
    cls->install();
    JSBClassType::registerClass<cc::JSBNativeDataHolder>(cls);

    __jsb_cc_JSBNativeDataHolder_proto = cls->getProto();
    __jsb_cc_JSBNativeDataHolder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
#if CC_USE_DEBUG_RENDERER
se::Object* __jsb_cc_DebugTextInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_DebugTextInfo_class = nullptr;  // NOLINT

static bool js_engine_DebugTextInfo_get_color(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->color, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->color, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_DebugTextInfo_get_color)

static bool js_engine_DebugTextInfo_set_color(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->color, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_DebugTextInfo_set_color)

static bool js_engine_DebugTextInfo_get_bold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bold, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bold, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_DebugTextInfo_get_bold)

static bool js_engine_DebugTextInfo_set_bold(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bold, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_DebugTextInfo_set_bold)

static bool js_engine_DebugTextInfo_get_italic(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->italic, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->italic, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_DebugTextInfo_get_italic)

static bool js_engine_DebugTextInfo_set_italic(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->italic, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_DebugTextInfo_set_italic)

static bool js_engine_DebugTextInfo_get_shadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadow, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadow, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_DebugTextInfo_get_shadow)

static bool js_engine_DebugTextInfo_set_shadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadow, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_DebugTextInfo_set_shadow)

static bool js_engine_DebugTextInfo_get_shadowThickness(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadowThickness, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadowThickness, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_DebugTextInfo_get_shadowThickness)

static bool js_engine_DebugTextInfo_set_shadowThickness(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadowThickness, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_DebugTextInfo_set_shadowThickness)

static bool js_engine_DebugTextInfo_get_shadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadowColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadowColor, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_DebugTextInfo_get_shadowColor)

static bool js_engine_DebugTextInfo_set_shadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadowColor, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_DebugTextInfo_set_shadowColor)

static bool js_engine_DebugTextInfo_get_scale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->scale, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->scale, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_engine_DebugTextInfo_get_scale)

static bool js_engine_DebugTextInfo_set_scale(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DebugTextInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->scale, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_engine_DebugTextInfo_set_scale)


template<>
bool sevalue_to_native(const se::Value &from, cc::DebugTextInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::DebugTextInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("color", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->color), ctx);
    }
    json->getProperty("bold", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bold), ctx);
    }
    json->getProperty("italic", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->italic), ctx);
    }
    json->getProperty("shadow", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadow), ctx);
    }
    json->getProperty("shadowThickness", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadowThickness), ctx);
    }
    json->getProperty("shadowColor", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadowColor), ctx);
    }
    json->getProperty("scale", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->scale), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_DebugTextInfo_finalize)

static bool js_engine_DebugTextInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::DebugTextInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::DebugTextInfo);
        auto cobj = ptr->get<cc::DebugTextInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::DebugTextInfo);
    auto cobj = ptr->get<cc::DebugTextInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->color), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->bold), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->italic), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->shadow), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->shadowThickness), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->shadowColor), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->scale), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_engine_DebugTextInfo_constructor, __jsb_cc_DebugTextInfo_class, js_cc_DebugTextInfo_finalize)

static bool js_cc_DebugTextInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_DebugTextInfo_finalize)

bool js_register_engine_DebugTextInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DebugTextInfo", obj, nullptr, _SE(js_engine_DebugTextInfo_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
    cls->defineProperty("color", _SE(js_engine_DebugTextInfo_get_color), _SE(js_engine_DebugTextInfo_set_color));
    cls->defineProperty("bold", _SE(js_engine_DebugTextInfo_get_bold), _SE(js_engine_DebugTextInfo_set_bold));
    cls->defineProperty("italic", _SE(js_engine_DebugTextInfo_get_italic), _SE(js_engine_DebugTextInfo_set_italic));
    cls->defineProperty("shadow", _SE(js_engine_DebugTextInfo_get_shadow), _SE(js_engine_DebugTextInfo_set_shadow));
    cls->defineProperty("shadowThickness", _SE(js_engine_DebugTextInfo_get_shadowThickness), _SE(js_engine_DebugTextInfo_set_shadowThickness));
    cls->defineProperty("shadowColor", _SE(js_engine_DebugTextInfo_get_shadowColor), _SE(js_engine_DebugTextInfo_set_shadowColor));
    cls->defineProperty("scale", _SE(js_engine_DebugTextInfo_get_scale), _SE(js_engine_DebugTextInfo_set_scale));
    cls->defineFinalizeFunction(_SE(js_cc_DebugTextInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::DebugTextInfo>(cls);

    __jsb_cc_DebugTextInfo_proto = cls->getProto();
    __jsb_cc_DebugTextInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
#endif // CC_USE_DEBUG_RENDERER
#if CC_USE_DEBUG_RENDERER
se::Object* __jsb_cc_DebugRenderer_proto = nullptr; // NOLINT
se::Class* __jsb_cc_DebugRenderer_class = nullptr;  // NOLINT

static bool js_engine_DebugRenderer_addText(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::DebugRenderer>(s);
    // SE_PRECONDITION2( cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<std::string, true> arg0 = {};
            HolderType<cc::Vec2, true> arg1 = {};
            HolderType<cc::DebugTextInfo, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addText(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<cc::Vec2, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addText(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_engine_DebugRenderer_addText)

static bool js_engine_DebugRenderer_getInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::DebugRenderer* result = cc::DebugRenderer::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_engine_DebugRenderer_getInstance_static)

bool js_register_engine_DebugRenderer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DebugRenderer", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_engine_getter_return_true), nullptr);
#endif
    cls->defineFunction("addText", _SE(js_engine_DebugRenderer_addText));
    cls->defineStaticFunction("getInstance", _SE(js_engine_DebugRenderer_getInstance_static));
    cls->install();
    JSBClassType::registerClass<cc::DebugRenderer>(cls);

    __jsb_cc_DebugRenderer_proto = cls->getProto();
    __jsb_cc_DebugRenderer_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
#endif // CC_USE_DEBUG_RENDERER
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
    #if CC_USE_DEBUG_RENDERER
    js_register_engine_DebugRenderer(ns);
    #endif // CC_USE_DEBUG_RENDERER
    #if CC_USE_DEBUG_RENDERER
    js_register_engine_DebugTextInfo(ns);
    #endif // CC_USE_DEBUG_RENDERER
    js_register_engine_Device(ns);
    js_register_engine_FileUtils(ns);
    js_register_engine_JSBNativeDataHolder(ns);
    js_register_engine_SAXParser(ns);
    js_register_engine_Vec2(ns);
    return true;
}

// clang-format on