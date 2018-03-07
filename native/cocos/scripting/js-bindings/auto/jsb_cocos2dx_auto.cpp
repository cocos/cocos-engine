#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "cocos2d.h"

se::Object* __jsb_cocos2d_FileUtils_proto = nullptr;
se::Class* __jsb_cocos2d_FileUtils_class = nullptr;

static bool js_cocos2dx_FileUtils_writeDataToFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_writeDataToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Data arg0;
        std::string arg1;
        ok &= seval_to_Data(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeDataToFile : Error processing arguments");
        bool result = cobj->writeDataToFile(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeDataToFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_writeDataToFile)

static bool js_cocos2dx_FileUtils_fullPathForFilename(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_fullPathForFilename : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_fullPathForFilename : Error processing arguments");
        std::string result = cobj->fullPathForFilename(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_fullPathForFilename : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_fullPathForFilename)

static bool js_cocos2dx_FileUtils_getStringFromFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getStringFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getStringFromFile : Error processing arguments");
        std::string result = cobj->getStringFromFile(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getStringFromFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getStringFromFile)

static bool js_cocos2dx_FileUtils_removeFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_removeFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_removeFile : Error processing arguments");
        bool result = cobj->removeFile(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_removeFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_removeFile)

static bool js_cocos2dx_FileUtils_getDataFromFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getDataFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getDataFromFile : Error processing arguments");
        cocos2d::Data result = cobj->getDataFromFile(arg0);
        ok &= Data_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getDataFromFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getDataFromFile)

static bool js_cocos2dx_FileUtils_isAbsolutePath(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_isAbsolutePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_isAbsolutePath : Error processing arguments");
        bool result = cobj->isAbsolutePath(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_isAbsolutePath : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_isAbsolutePath)

static bool js_cocos2dx_FileUtils_renameFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_FileUtils_renameFile : Invalid Native Object");
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
            bool result = cobj->renameFile(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_renameFile : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            bool result = cobj->renameFile(arg0, arg1, arg2);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_renameFile : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_renameFile)

static bool js_cocos2dx_FileUtils_loadFilenameLookupDictionaryFromFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_loadFilenameLookupDictionaryFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_loadFilenameLookupDictionaryFromFile : Error processing arguments");
        cobj->loadFilenameLookupDictionaryFromFile(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_loadFilenameLookupDictionaryFromFile)

static bool js_cocos2dx_FileUtils_isPopupNotify(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_isPopupNotify : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPopupNotify();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_isPopupNotify : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_isPopupNotify)

static bool js_cocos2dx_FileUtils_getValueVectorFromFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getValueVectorFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getValueVectorFromFile : Error processing arguments");
        cocos2d::ValueVector result = cobj->getValueVectorFromFile(arg0);
        ok &= ccvaluevector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getValueVectorFromFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getValueVectorFromFile)

static bool js_cocos2dx_FileUtils_getSearchPaths(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getSearchPaths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getSearchPaths();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getSearchPaths : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getSearchPaths)

static bool js_cocos2dx_FileUtils_writeToFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_writeToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ValueMap arg0;
        std::string arg1;
        ok &= seval_to_ccvaluemap(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeToFile : Error processing arguments");
        bool result = cobj->writeToFile(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeToFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_writeToFile)

static bool js_cocos2dx_FileUtils_listFiles(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_listFiles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_listFiles : Error processing arguments");
        std::vector<std::string> result = cobj->listFiles(arg0);
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_listFiles : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_listFiles)

static bool js_cocos2dx_FileUtils_getValueMapFromFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getValueMapFromFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getValueMapFromFile : Error processing arguments");
        cocos2d::ValueMap result = cobj->getValueMapFromFile(arg0);
        ok &= ccvaluemap_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getValueMapFromFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getValueMapFromFile)

static bool js_cocos2dx_FileUtils_getFileSize(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getFileSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getFileSize : Error processing arguments");
        long result = cobj->getFileSize(arg0);
        ok &= long_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getFileSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getFileSize)

static bool js_cocos2dx_FileUtils_getValueMapFromData(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getValueMapFromData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getValueMapFromData : Error processing arguments");
        cocos2d::ValueMap result = cobj->getValueMapFromData(arg0, arg1);
        ok &= ccvaluemap_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getValueMapFromData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getValueMapFromData)

static bool js_cocos2dx_FileUtils_removeDirectory(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_removeDirectory : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_removeDirectory : Error processing arguments");
        bool result = cobj->removeDirectory(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_removeDirectory : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_removeDirectory)

static bool js_cocos2dx_FileUtils_setSearchPaths(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_setSearchPaths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= seval_to_std_vector_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_setSearchPaths : Error processing arguments");
        cobj->setSearchPaths(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_setSearchPaths)

static bool js_cocos2dx_FileUtils_writeStringToFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_writeStringToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeStringToFile : Error processing arguments");
        bool result = cobj->writeStringToFile(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeStringToFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_writeStringToFile)

static bool js_cocos2dx_FileUtils_setSearchResolutionsOrder(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_setSearchResolutionsOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= seval_to_std_vector_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_setSearchResolutionsOrder : Error processing arguments");
        cobj->setSearchResolutionsOrder(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_setSearchResolutionsOrder)

static bool js_cocos2dx_FileUtils_addSearchResolutionsOrder(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_addSearchResolutionsOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_addSearchResolutionsOrder : Error processing arguments");
        cobj->addSearchResolutionsOrder(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_addSearchResolutionsOrder : Error processing arguments");
        cobj->addSearchResolutionsOrder(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_addSearchResolutionsOrder)

static bool js_cocos2dx_FileUtils_addSearchPath(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_addSearchPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_addSearchPath : Error processing arguments");
        cobj->addSearchPath(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        bool arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_addSearchPath : Error processing arguments");
        cobj->addSearchPath(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_addSearchPath)

static bool js_cocos2dx_FileUtils_writeValueVectorToFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_writeValueVectorToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ValueVector arg0;
        std::string arg1;
        ok &= seval_to_ccvaluevector(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeValueVectorToFile : Error processing arguments");
        bool result = cobj->writeValueVectorToFile(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeValueVectorToFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_writeValueVectorToFile)

static bool js_cocos2dx_FileUtils_isFileExist(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_isFileExist : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_isFileExist : Error processing arguments");
        bool result = cobj->isFileExist(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_isFileExist : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_isFileExist)

static bool js_cocos2dx_FileUtils_purgeCachedEntries(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_purgeCachedEntries : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->purgeCachedEntries();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_purgeCachedEntries)

static bool js_cocos2dx_FileUtils_fullPathFromRelativeFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_fullPathFromRelativeFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_fullPathFromRelativeFile : Error processing arguments");
        std::string result = cobj->fullPathFromRelativeFile(arg0, arg1);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_fullPathFromRelativeFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_fullPathFromRelativeFile)

static bool js_cocos2dx_FileUtils_getSuitableFOpen(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getSuitableFOpen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getSuitableFOpen : Error processing arguments");
        std::string result = cobj->getSuitableFOpen(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getSuitableFOpen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getSuitableFOpen)

static bool js_cocos2dx_FileUtils_writeValueMapToFile(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_writeValueMapToFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ValueMap arg0;
        std::string arg1;
        ok &= seval_to_ccvaluemap(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeValueMapToFile : Error processing arguments");
        bool result = cobj->writeValueMapToFile(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_writeValueMapToFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_writeValueMapToFile)

static bool js_cocos2dx_FileUtils_getFileExtension(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getFileExtension : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getFileExtension : Error processing arguments");
        std::string result = cobj->getFileExtension(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getFileExtension : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getFileExtension)

static bool js_cocos2dx_FileUtils_setWritablePath(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_setWritablePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_setWritablePath : Error processing arguments");
        cobj->setWritablePath(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_setWritablePath)

static bool js_cocos2dx_FileUtils_setPopupNotify(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_setPopupNotify : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_setPopupNotify : Error processing arguments");
        cobj->setPopupNotify(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_setPopupNotify)

static bool js_cocos2dx_FileUtils_isDirectoryExist(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_isDirectoryExist : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_isDirectoryExist : Error processing arguments");
        bool result = cobj->isDirectoryExist(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_isDirectoryExist : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_isDirectoryExist)

static bool js_cocos2dx_FileUtils_setDefaultResourceRootPath(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_setDefaultResourceRootPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_setDefaultResourceRootPath : Error processing arguments");
        cobj->setDefaultResourceRootPath(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_setDefaultResourceRootPath)

static bool js_cocos2dx_FileUtils_getSearchResolutionsOrder(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getSearchResolutionsOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getSearchResolutionsOrder();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getSearchResolutionsOrder : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getSearchResolutionsOrder)

static bool js_cocos2dx_FileUtils_createDirectory(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_createDirectory : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_createDirectory : Error processing arguments");
        bool result = cobj->createDirectory(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_createDirectory : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_createDirectory)

static bool js_cocos2dx_FileUtils_listFilesRecursively(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_listFilesRecursively : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::vector<std::string>* arg1 = nullptr;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_listFilesRecursively : Error processing arguments");
        cobj->listFilesRecursively(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_listFilesRecursively)

static bool js_cocos2dx_FileUtils_getWritablePath(se::State& s)
{
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_FileUtils_getWritablePath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getWritablePath();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getWritablePath : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getWritablePath)

static bool js_cocos2dx_FileUtils_setDelegate(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::FileUtils* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_setDelegate : Error processing arguments");
        cocos2d::FileUtils::setDelegate(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_setDelegate)

static bool js_cocos2dx_FileUtils_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::FileUtils* result = cocos2d::FileUtils::getInstance();
        ok &= native_ptr_to_seval<cocos2d::FileUtils>((cocos2d::FileUtils*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_FileUtils_getInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_FileUtils_getInstance)



static bool js_cocos2d_FileUtils_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::FileUtils)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::FileUtils* cobj = (cocos2d::FileUtils*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_FileUtils_finalize)

bool js_register_cocos2dx_FileUtils(se::Object* obj)
{
    auto cls = se::Class::create("FileUtils", obj, nullptr, nullptr);

    cls->defineFunction("writeDataToFile", _SE(js_cocos2dx_FileUtils_writeDataToFile));
    cls->defineFunction("fullPathForFilename", _SE(js_cocos2dx_FileUtils_fullPathForFilename));
    cls->defineFunction("getStringFromFile", _SE(js_cocos2dx_FileUtils_getStringFromFile));
    cls->defineFunction("removeFile", _SE(js_cocos2dx_FileUtils_removeFile));
    cls->defineFunction("getDataFromFile", _SE(js_cocos2dx_FileUtils_getDataFromFile));
    cls->defineFunction("isAbsolutePath", _SE(js_cocos2dx_FileUtils_isAbsolutePath));
    cls->defineFunction("renameFile", _SE(js_cocos2dx_FileUtils_renameFile));
    cls->defineFunction("loadFilenameLookup", _SE(js_cocos2dx_FileUtils_loadFilenameLookupDictionaryFromFile));
    cls->defineFunction("isPopupNotify", _SE(js_cocos2dx_FileUtils_isPopupNotify));
    cls->defineFunction("getValueVectorFromFile", _SE(js_cocos2dx_FileUtils_getValueVectorFromFile));
    cls->defineFunction("getSearchPaths", _SE(js_cocos2dx_FileUtils_getSearchPaths));
    cls->defineFunction("writeToFile", _SE(js_cocos2dx_FileUtils_writeToFile));
    cls->defineFunction("listFiles", _SE(js_cocos2dx_FileUtils_listFiles));
    cls->defineFunction("getValueMapFromFile", _SE(js_cocos2dx_FileUtils_getValueMapFromFile));
    cls->defineFunction("getFileSize", _SE(js_cocos2dx_FileUtils_getFileSize));
    cls->defineFunction("getValueMapFromData", _SE(js_cocos2dx_FileUtils_getValueMapFromData));
    cls->defineFunction("removeDirectory", _SE(js_cocos2dx_FileUtils_removeDirectory));
    cls->defineFunction("setSearchPaths", _SE(js_cocos2dx_FileUtils_setSearchPaths));
    cls->defineFunction("writeStringToFile", _SE(js_cocos2dx_FileUtils_writeStringToFile));
    cls->defineFunction("setSearchResolutionsOrder", _SE(js_cocos2dx_FileUtils_setSearchResolutionsOrder));
    cls->defineFunction("addSearchResolutionsOrder", _SE(js_cocos2dx_FileUtils_addSearchResolutionsOrder));
    cls->defineFunction("addSearchPath", _SE(js_cocos2dx_FileUtils_addSearchPath));
    cls->defineFunction("writeValueVectorToFile", _SE(js_cocos2dx_FileUtils_writeValueVectorToFile));
    cls->defineFunction("isFileExist", _SE(js_cocos2dx_FileUtils_isFileExist));
    cls->defineFunction("purgeCachedEntries", _SE(js_cocos2dx_FileUtils_purgeCachedEntries));
    cls->defineFunction("fullPathFromRelativeFile", _SE(js_cocos2dx_FileUtils_fullPathFromRelativeFile));
    cls->defineFunction("getSuitableFOpen", _SE(js_cocos2dx_FileUtils_getSuitableFOpen));
    cls->defineFunction("writeValueMapToFile", _SE(js_cocos2dx_FileUtils_writeValueMapToFile));
    cls->defineFunction("getFileExtension", _SE(js_cocos2dx_FileUtils_getFileExtension));
    cls->defineFunction("setWritablePath", _SE(js_cocos2dx_FileUtils_setWritablePath));
    cls->defineFunction("setPopupNotify", _SE(js_cocos2dx_FileUtils_setPopupNotify));
    cls->defineFunction("isDirectoryExist", _SE(js_cocos2dx_FileUtils_isDirectoryExist));
    cls->defineFunction("setDefaultResourceRootPath", _SE(js_cocos2dx_FileUtils_setDefaultResourceRootPath));
    cls->defineFunction("getSearchResolutionsOrder", _SE(js_cocos2dx_FileUtils_getSearchResolutionsOrder));
    cls->defineFunction("createDirectory", _SE(js_cocos2dx_FileUtils_createDirectory));
    cls->defineFunction("listFilesRecursively", _SE(js_cocos2dx_FileUtils_listFilesRecursively));
    cls->defineFunction("getWritablePath", _SE(js_cocos2dx_FileUtils_getWritablePath));
    cls->defineStaticFunction("setDelegate", _SE(js_cocos2dx_FileUtils_setDelegate));
    cls->defineStaticFunction("getInstance", _SE(js_cocos2dx_FileUtils_getInstance));
    cls->defineFinalizeFunction(_SE(js_cocos2d_FileUtils_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::FileUtils>(cls);

    __jsb_cocos2d_FileUtils_proto = cls->getProto();
    __jsb_cocos2d_FileUtils_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_SAXParser_proto = nullptr;
se::Class* __jsb_cocos2d_SAXParser_class = nullptr;

static bool js_cocos2dx_SAXParser_init(se::State& s)
{
    cocos2d::SAXParser* cobj = (cocos2d::SAXParser*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_SAXParser_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_SAXParser_init : Error processing arguments");
        bool result = cobj->init(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_SAXParser_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_SAXParser_init)




bool js_register_cocos2dx_SAXParser(se::Object* obj)
{
    auto cls = se::Class::create("PlistParser", obj, nullptr, nullptr);

    cls->defineFunction("init", _SE(js_cocos2dx_SAXParser_init));
    cls->install();
    JSBClassType::registerClass<cocos2d::SAXParser>(cls);

    __jsb_cocos2d_SAXParser_proto = cls->getProto();
    __jsb_cocos2d_SAXParser_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx(se::Object* obj)
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

    js_register_cocos2dx_FileUtils(ns);
    js_register_cocos2dx_SAXParser(ns);
    return true;
}

