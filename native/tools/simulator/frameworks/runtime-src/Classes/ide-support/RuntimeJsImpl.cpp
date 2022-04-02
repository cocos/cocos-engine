/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

//
//  RuntimeJsImpl.cpp
//  Simulator
//
//

// NOTE: fix the conflict typedef 'byte' between C++17 and one Windows header named 'rpcndr.h'
// reference: https://studiofreya.com/2018/01/06/visual-studio-2017-with-cpp17-and-boost/#stdbyte-ambiguous-symbol-and-rpcndr.h
#ifdef WIN32
    #define _HAS_STD_BYTE 0
#endif

#include "RuntimeJsImpl.h"

#if (CC_CODE_IDE_DEBUG_SUPPORT > 0)

    #include "runtime/ConfigParser.h" // config
    #include "runtime/ConfigParser.h"
    #include "runtime/FileServer.h"
    #include "runtime/Runtime.h"

    // js
    #include "cocos/bindings/auto/jsb_cocos_auto.h"
    #include "cocos/bindings/jswrapper/SeApi.h"
    #include "cocos/bindings/manual/jsb_classtype.h"
    #include "cocos/bindings/manual/jsb_conversions.h"
    #include "cocos/bindings/manual/jsb_global.h"
    #include "cocos/bindings/manual/jsb_module_register.h"

static bool reloadScript(const string &file) {
    CC_LOG_DEBUG("------------------------------------------------");
    CC_LOG_DEBUG("RELOAD Js FILE: %s", file.c_str());
    CC_LOG_DEBUG("------------------------------------------------");
    se::ScriptEngine::getInstance()->cleanup();

    string modulefile = file;
    if (modulefile.empty()) {
        modulefile = ConfigParser::getInstance()->getEntryFile().c_str();
    }

    return jsb_run_script(modulefile.c_str());
}

static bool runtime_FileUtils_addSearchPath(se::State &s) {
    const auto &   args = s.args();
    int            argc = (int)args.size();
    bool           ok   = true;
    cc::FileUtils *cobj = (cc::FileUtils *)s.nativeThisObject();
    if (argc == 1 || argc == 2) {
        std::string arg0;
        bool        arg1 = false;

        ok &= sevalue_to_native(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        if (argc == 2) {
            arg1 = args[1].isBoolean() ? args[1].toBoolean() : false;
        }

        if (!cc::FileUtils::getInstance()->isAbsolutePath(arg0)) {
            // add write path to search path
            if (FileServer::getShareInstance()->getIsUsingWritePath()) {
                cobj->addSearchPath(FileServer::getShareInstance()->getWritePath() + arg0, arg1);
            } else {
                cobj->addSearchPath(arg0, arg1);
            }

    #if (CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
            // add project path to search path
            cobj->addSearchPath(RuntimeEngine::getInstance()->getRuntime()->getProjectPath() + arg0, arg1);
    #endif
        }
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(runtime_FileUtils_addSearchPath)

static bool runtime_FileUtils_setSearchPaths(se::State &s) {
    const auto &   args = s.args();
    int            argc = (int)args.size();
    bool           ok   = true;
    cc::FileUtils *cobj = (cc::FileUtils *)s.nativeThisObject();
    if (argc == 1) {
        std::vector<std::string> vecPaths, writePaths;
        ok &= sevalue_to_native(args[0], &vecPaths);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        std::vector<std::string> originPath; // for IOS platform.
        std::vector<std::string> projPath;   // for Desktop platform.
        for (int i = 0; i < vecPaths.size(); i++) {
            if (!cc::FileUtils::getInstance()->isAbsolutePath(vecPaths[i])) {
                originPath.push_back(vecPaths[i]);                                                              // for IOS platform.
                projPath.push_back(RuntimeEngine::getInstance()->getRuntime()->getProjectPath() + vecPaths[i]); //for Desktop platform.
                writePaths.push_back(FileServer::getShareInstance()->getWritePath() + vecPaths[i]);
            }
        }

    #if (CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
        vecPaths.insert(vecPaths.end(), projPath.begin(), projPath.end());
    #endif
        if (FileServer::getShareInstance()->getIsUsingWritePath()) {
            vecPaths.insert(vecPaths.end(), writePaths.begin(), writePaths.end());
        } else {
            vecPaths.insert(vecPaths.end(), originPath.begin(), originPath.end());
        }

        cobj->setSearchPaths(vecPaths);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(runtime_FileUtils_setSearchPaths)

static bool register_FileUtils(se::Object *obj) {
    __jsb_cc_FileUtils_proto->defineFunction("addSearchPath", _SE(runtime_FileUtils_addSearchPath));
    __jsb_cc_FileUtils_proto->defineFunction("setSearchPaths", _SE(runtime_FileUtils_setSearchPaths));
    return true;
}

RuntimeJsImpl *RuntimeJsImpl::create() {
    RuntimeJsImpl *instance = new RuntimeJsImpl();
    return instance;
}

bool RuntimeJsImpl::initJsEnv() {
    if (se::ScriptEngine::getInstance()->isValid()) {
        return true;
    }

    auto se = se::ScriptEngine::getInstance();
    jsb_set_xxtea_key("");
    jsb_init_file_operation_delegate();

    #if defined(CC_DEBUG) && (CC_DEBUG > 0)
    // Enable debugger here
    auto parser = ConfigParser::getInstance();
    jsb_enable_debugger("0.0.0.0", parser->getDebugPort(), parser->isWaitForConnect());
    #endif

    se->setExceptionCallback([](const char *location, const char *message, const char *stack) {
        // Send exception information to server like Tencent Bugly.
    });

    jsb_register_all_modules();

    se->addRegisterCallback(register_FileUtils);
    se->start();
    return true;
}

bool RuntimeJsImpl::startWithDebugger() {
    initJsEnv();

    return true;
}

void RuntimeJsImpl::startScript(const std::string &path) {
    loadScriptFile(path);
}

void RuntimeJsImpl::onStartDebuger(const rapidjson::Document &dArgParse, rapidjson::Document &dReplyParse) {
    if (loadScriptFile(ConfigParser::getInstance()->getEntryFile())) {
        dReplyParse.AddMember("code", 0, dReplyParse.GetAllocator());
    } else {
        dReplyParse.AddMember("code", 1, dReplyParse.GetAllocator());
    }
}

void RuntimeJsImpl::onClearCompile(const rapidjson::Document &dArgParse, rapidjson::Document &dReplyParse) {
}

void RuntimeJsImpl::onPrecompile(const rapidjson::Document &dArgParse, rapidjson::Document &dReplyParse) {
}

void RuntimeJsImpl::onReload(const rapidjson::Document &dArgParse, rapidjson::Document &dReplyParse) {
    if (dArgParse.HasMember("modulefiles")) {
        auto &                  allocator = dReplyParse.GetAllocator();
        rapidjson::Value        bodyvalue(rapidjson::kObjectType);
        const rapidjson::Value &objectfiles = dArgParse["modulefiles"];
        for (rapidjson::SizeType i = 0; i < objectfiles.Size(); i++) {
            if (!reloadScript(objectfiles[i].GetString())) {
                bodyvalue.AddMember(rapidjson::Value(objectfiles[i].GetString(), allocator), rapidjson::Value(1), allocator);
            }
        }
        if (0 == objectfiles.Size()) {
            reloadScript("");
        }
        dReplyParse.AddMember("body", bodyvalue, dReplyParse.GetAllocator());
    } else {
        reloadScript("");
    }

    dReplyParse.AddMember("code", 0, dReplyParse.GetAllocator());
}

void RuntimeJsImpl::onRemove(const std::string &filename) {
}

void RuntimeJsImpl::end() {
    RuntimeProtocol::end();
}

// private

RuntimeJsImpl::RuntimeJsImpl() {
}

bool RuntimeJsImpl::loadScriptFile(const std::string &path) {
    std::string filepath = path;
    if (filepath.empty()) {
        filepath = ConfigParser::getInstance()->getEntryFile();
    }
    CC_LOG_DEBUG("------------------------------------------------");
    CC_LOG_DEBUG("LOAD Js FILE: %s", filepath.c_str());
    CC_LOG_DEBUG("------------------------------------------------");

    initJsEnv();

    this->startWithDebugger();

    return jsb_run_script(filepath);
}

#endif // (CC_DEBUG > 0) && (CC_CODE_IDE_DEBUG_SUPPORT > 0)
