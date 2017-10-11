//
//  RuntimeJsImpl.cpp
//  Simulator
//
//

#include "RuntimeJsImpl.h"

#include "cocos/base/CCDirector.h"        // 2dx engine

#if (CC_CODE_IDE_DEBUG_SUPPORT > 0)

#include "runtime/ConfigParser.h"   // config
#include "runtime/Runtime.h"
#include "runtime/FileServer.h"

// js
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_module_register.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"

static bool reloadScript(const string& file)
{
    auto director = cocos2d::Director::getInstance();
    cocos2d::FontFNT::purgeCachedData();
    if (director->getOpenGLView())
    {
        cocos2d::SpriteFrameCache::getInstance()->removeSpriteFrames();
        director->getTextureCache()->removeAllTextures();
    }
    cocos2d::FileUtils::getInstance()->purgeCachedEntries();
    
    //director->getScheduler()->unscheduleAll();
    //director->getScheduler()->scheduleUpdate(director->getActionManager(), Scheduler::PRIORITY_SYSTEM, false);
    
    string modulefile = file;
    if (modulefile.empty())
    {
        modulefile = ConfigParser::getInstance()->getEntryFile().c_str();
    }
    
    return jsb_run_script(modulefile.c_str());
}

static bool runtime_FileUtils_addSearchPath(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = true;
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)s.nativeThisObject();
    if (argc == 1 || argc == 2) {
        std::string arg0;
        bool arg1 = false;
        
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        
        if (argc == 2)
        {
            arg1 = args[1].isBoolean() ? args[1].toBoolean() : false;
        }
        
        if (! cocos2d::FileUtils::getInstance()->isAbsolutePath(arg0))
        {
            // add write path to search path
            if (FileServer::getShareInstance()->getIsUsingWritePath())
            {
                cobj->addSearchPath(FileServer::getShareInstance()->getWritePath() + arg0, arg1);
            } else
            {
                cobj->addSearchPath(arg0, arg1);
            }
            
#if(CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
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

static bool runtime_FileUtils_setSearchPaths(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = true;
    cocos2d::FileUtils* cobj = (cocos2d::FileUtils *)s.nativeThisObject();
    if (argc == 1) {
        std::vector<std::string> vecPaths, writePaths;
        ok &= seval_to_std_vector_string(args[0], &vecPaths);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        
        std::vector<std::string> originPath; // for IOS platform.
        std::vector<std::string> projPath; // for Desktop platform.
        for (int i = 0; i < vecPaths.size(); i++)
        {
            if (!cocos2d::FileUtils::getInstance()->isAbsolutePath(vecPaths[i]))
            {
                originPath.push_back(vecPaths[i]); // for IOS platform.
                projPath.push_back(RuntimeEngine::getInstance()->getRuntime()->getProjectPath()+vecPaths[i]); //for Desktop platform.
                writePaths.push_back(FileServer::getShareInstance()->getWritePath() + vecPaths[i]);
            }
        }
        
#if(CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
        vecPaths.insert(vecPaths.end(), projPath.begin(), projPath.end());
#endif
        if (FileServer::getShareInstance()->getIsUsingWritePath())
        {
            vecPaths.insert(vecPaths.end(), writePaths.begin(), writePaths.end());
        } else
        {
            vecPaths.insert(vecPaths.end(), originPath.begin(), originPath.end());
        }
        
        cobj->setSearchPaths(vecPaths);
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(runtime_FileUtils_setSearchPaths)

static bool register_FileUtils(se::Object* obj)
{
    __jsb_cocos2d_FileUtils_proto->defineFunction("addSearchPath", _SE(runtime_FileUtils_addSearchPath));
    __jsb_cocos2d_FileUtils_proto->defineFunction("setSearchPaths", _SE(runtime_FileUtils_setSearchPaths));
    return true;
}

RuntimeJsImpl* RuntimeJsImpl::create()
{
    RuntimeJsImpl *instance = new RuntimeJsImpl();
    return instance;
}

bool RuntimeJsImpl::initJsEnv()
{
    if (se::ScriptEngine::getInstance()->isValid())
    {
        return true;
    }

    cocos2d::ScriptEngineProtocol *engine = ScriptingCore::getInstance();
    cocos2d::ScriptEngineManager::getInstance()->setScriptEngine(engine);

    auto se = se::ScriptEngine::getInstance();
    jsb_set_xxtea_key("");
    jsb_init_file_operation_delegate();

#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
    // Enable debugger here
    jsb_enable_debugger("0.0.0.0", 5086);
#endif

    se->setExceptionCallback([](const char* location, const char* message, const char* stack){
        // Send exception information to server like Tencent Bugly.

    });

    jsb_register_all_modules();
    
    se->addRegisterCallback(register_FileUtils);
    se->start();
    return true;
}

bool RuntimeJsImpl::startWithDebugger()
{
    initJsEnv();
    
    return true;
}

void RuntimeJsImpl::startScript(const std::string& path)
{
    loadScriptFile(path);
}

void RuntimeJsImpl::onStartDebuger(const rapidjson::Document& dArgParse, rapidjson::Document& dReplyParse)
{
    if (loadScriptFile(ConfigParser::getInstance()->getEntryFile()))
    {
        dReplyParse.AddMember("code",0,dReplyParse.GetAllocator());
    }
    else
    {
        dReplyParse.AddMember("code",1,dReplyParse.GetAllocator());
    }
}

void RuntimeJsImpl::onClearCompile(const rapidjson::Document& dArgParse, rapidjson::Document& dReplyParse)
{
//TODO    if (dArgParse.HasMember("modulefiles") && dArgParse["modulefiles"].Size() != 0)
//    {
//        const rapidjson::Value& objectfiles = dArgParse["modulefiles"];
//        for (rapidjson::SizeType i = 0; i < objectfiles.Size(); i++)
//        {
//            ScriptingCore::getInstance()->cleanScript(objectfiles[i].GetString());
//        }
//    }
//    else
//    {
//        std::unordered_map<std::string, JS::PersistentRootedScript*> *filenameScript = ScriptingCore::getInstance()->getFileScript();
//        filenameScript->clear();
//    }
//    
//    dReplyParse.AddMember("code",0,dReplyParse.GetAllocator());
}

void RuntimeJsImpl::onPrecompile(const rapidjson::Document& dArgParse, rapidjson::Document& dReplyParse)
{
//    const rapidjson::Value& objectfiles = dArgParse["modulefiles"];
//    for (rapidjson::SizeType i = 0; i < objectfiles.Size(); i++)
//    {
//TODO cjh        ScriptingCore* sc = ScriptingCore::getInstance();
//        JSContext* gc = sc->getGlobalContext();
//        JS::RootedObject global(gc, sc->getGlobalObject());
//        JS::RootedScript script(gc);
//        
//        sc->compileScript(objectfiles[i].GetString(), global, &script);
//    }
//    
//    dReplyParse.AddMember("code",0,dReplyParse.GetAllocator());
}

void RuntimeJsImpl::onReload(const rapidjson::Document &dArgParse, rapidjson::Document &dReplyParse)
{
    if (dArgParse.HasMember("modulefiles")){
        auto& allocator = dReplyParse.GetAllocator();
        rapidjson::Value bodyvalue(rapidjson::kObjectType);
        const rapidjson::Value& objectfiles = dArgParse["modulefiles"];
        for (rapidjson::SizeType i = 0; i < objectfiles.Size(); i++){
            if (!reloadScript(objectfiles[i].GetString())) {
                bodyvalue.AddMember(rapidjson::Value(objectfiles[i].GetString(), allocator)
                                    , rapidjson::Value(1)
                                    , allocator);
            }
        }
        if (0 == objectfiles.Size())
        {
            reloadScript("");
        }
        dReplyParse.AddMember("body", bodyvalue, dReplyParse.GetAllocator());
    }else
    {
        reloadScript("");
    }
    
    dReplyParse.AddMember("code", 0, dReplyParse.GetAllocator());
}

void RuntimeJsImpl::onRemove(const std::string &filename)
{
//TODO cjh    ScriptingCore::getInstance()->cleanScript(filename.c_str());
}

void RuntimeJsImpl::end()
{
    cocos2d::ScriptEngineManager::destroyInstance();
    RuntimeProtocol::end();
}

// private

RuntimeJsImpl::RuntimeJsImpl()
{
}

bool RuntimeJsImpl::loadScriptFile(const std::string& path)
{
    std::string filepath = path;
    if (filepath.empty())
    {
        filepath = ConfigParser::getInstance()->getEntryFile();
    }
    CCLOG("------------------------------------------------");
    CCLOG("LOAD Js FILE: %s", filepath.c_str());
    CCLOG("------------------------------------------------");
    
    initJsEnv();
    auto engine = ScriptingCore::getInstance();

    // if (RuntimeEngine::getInstance()->getProjectConfig().getDebuggerType() != kCCRuntimeDebuggerNone)
    // {
    this->startWithDebugger();
    // }
    
    cocos2d::ScriptEngineManager::getInstance()->setScriptEngine(engine);
    return jsb_run_script(filepath);
}


#endif // (COCOS2D_DEBUG > 0) && (CC_CODE_IDE_DEBUG_SUPPORT > 0)
