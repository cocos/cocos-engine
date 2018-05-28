//
// Created by James Chen on 4/28/17.
//

#include "jsb_global.h"
#include "jsb_conversions.hpp"
#include "xxtea/xxtea.h"

#include "base/CCScheduler.h"
#include "base/CCThreadPool.h"
#include "network/HttpClient.h"
#include "platform/CCApplication.h"

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "platform/android/jni/JniImp.h"
#endif

#include <regex>

using namespace cocos2d;
using namespace cocos2d::experimental;

se::Object* __jscObj = nullptr;
se::Object* __ccObj = nullptr;
se::Object* __jsbObj = nullptr;
se::Object* __glObj = nullptr;

static ThreadPool* __threadPool = nullptr;

static std::string xxteaKey = "";
void jsb_set_xxtea_key(const std::string& key)
{
    xxteaKey = key;
}

static const char* BYTE_CODE_FILE_EXT = ".jsc";

static std::string removeFileExt(const std::string& filePath)
{
    size_t pos = filePath.rfind('.');
    if (0 < pos)
    {
        return filePath.substr(0, pos);
    }
    return filePath;
}

void jsb_init_file_operation_delegate()
{
    static se::ScriptEngine::FileOperationDelegate delegate;
    if (!delegate.isValid())
    {
        delegate.onGetDataFromFile = [](const std::string& path, const std::function<void(const uint8_t*, size_t)>& readCallback) -> void{
            assert(!path.empty());

            Data fileData;

            std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                fileData = FileUtils::getInstance()->getDataFromFile(byteCodePath);

                size_t dataLen = 0;
                uint8_t* data = xxtea_decrypt((unsigned char*)fileData.getBytes(), (uint32_t)fileData.getSize(), (unsigned char*)xxteaKey.c_str(), (uint32_t)xxteaKey.size(), (uint32_t*)&dataLen);

                if (data == nullptr) {
                    SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                    return;
                }
                
                ZipFile* zip = ZipFile::createWithBuffer(data, dataLen);
                if (zip) {
                    ssize_t unpackedLen = 0;
                    uint8_t* unpackedData = zip->getFileData("encrypt.js", &unpackedLen);
                    
                    if (unpackedData == nullptr) {
                        SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                        return;
                    }
                    
                    readCallback(unpackedData, unpackedLen);
                    free(data);
                    free(unpackedData);
                    delete zip;
                }
                else {
                    readCallback(data, dataLen);
                    free(data);
                }

                return;
            }

            fileData = FileUtils::getInstance()->getDataFromFile(path);
            readCallback(fileData.getBytes(), fileData.getSize());
        };

        delegate.onGetStringFromFile = [](const std::string& path) -> std::string{
            assert(!path.empty());

            std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                Data fileData = FileUtils::getInstance()->getDataFromFile(byteCodePath);

                uint32_t dataLen;
                uint8_t* data = xxtea_decrypt((uint8_t*)fileData.getBytes(), (uint32_t)fileData.getSize(), (uint8_t*)xxteaKey.c_str(), (uint32_t)xxteaKey.size(), &dataLen);
                
                if (data == nullptr) {
                    SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                    return "";
                }
                
                ZipFile* zip = ZipFile::createWithBuffer(data, dataLen);
                if (zip) {
                    ssize_t unpackedLen = 0;
                    uint8_t* unpackedData = zip->getFileData("encrypt.js", &unpackedLen);
                    
                    if (unpackedData == nullptr) {
                        SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                        return "";
                    }
                    
                    std::string ret(reinterpret_cast<const char*>(unpackedData), unpackedLen);
                    free(unpackedData);
                    free(data);
                    delete zip;
                    
                    return ret;
                }
                else {
                    std::string ret(reinterpret_cast<const char*>(data), dataLen);
                    free(data);
                    return ret;
                }
            }

            return FileUtils::getInstance()->getStringFromFile(path);
        };

        delegate.onGetFullPath = [](const std::string& path) -> std::string{
            assert(!path.empty());
            std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                return FileUtils::getInstance()->fullPathForFilename(byteCodePath);
            }
            return FileUtils::getInstance()->fullPathForFilename(path);
        };

        delegate.onCheckFileExist = [](const std::string& path) -> bool{
            assert(!path.empty());
            return FileUtils::getInstance()->isFileExist(path);
        };

        assert(delegate.isValid());

        se::ScriptEngine::getInstance()->setFileOperationDelegate(delegate);
    }
}

bool jsb_enable_debugger(const std::string& debuggerServerAddr, uint32_t port)
{
    if (debuggerServerAddr.empty() || port == 0)
        return false;

    auto se = se::ScriptEngine::getInstance();
    se->enableDebugger(debuggerServerAddr.c_str(), port);

    // For debugger main loop
    class SimpleRunLoop
    {
    public:
        void update(float dt)
        {
            se::ScriptEngine::getInstance()->mainLoopUpdate();
        }
    };
//    static SimpleRunLoop runLoop;
    //cjh FIXME:    Director::getInstance()->getScheduler()->scheduleUpdate(&runLoop, 0, false);
    return true;
}

bool jsb_set_extend_property(const char* ns, const char* clsName)
{
    se::Object* globalObj = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value nsVal;
    if (globalObj->getProperty(ns, &nsVal) && nsVal.isObject())
    {
        se::Value ccVal;
        if (globalObj->getProperty("cc", &ccVal) && ccVal.isObject())
        {
            se::Value ccClassVal;
            if (ccVal.toObject()->getProperty("Class", &ccClassVal) && ccClassVal.isObject())
            {
                se::Value extendVal;
                if (ccClassVal.toObject()->getProperty("extend", &extendVal) && extendVal.isObject() && extendVal.toObject()->isFunction())
                {
                    se::Value targetClsVal;
                    if (nsVal.toObject()->getProperty(clsName, &targetClsVal) && targetClsVal.isObject())
                    {
                        return targetClsVal.toObject()->setProperty("extend", extendVal);
                    }
                }
            }
        }
    }
    return false;
}

namespace {

    std::unordered_map<std::string, se::Value> __moduleCache;

    static bool require(se::State& s)
    {
        const auto& args = s.args();
        int argc = (int)args.size();
        assert(argc >= 1);
        assert(args[0].isString());

        return jsb_run_script(args[0].toString(), &s.rval());
    }
    SE_BIND_FUNC(require)

    static bool doModuleRequire(const std::string& path, se::Value* ret, const std::string& prevScriptFileDir)
    {
        se::AutoHandleScope hs;
        assert(!path.empty());

        const auto& fileOperationDelegate = se::ScriptEngine::getInstance()->getFileOperationDelegate();
        assert(fileOperationDelegate.isValid());

        std::string fullPath;

        std::string pathWithSuffix = path;
        if (pathWithSuffix.rfind(".js") != (pathWithSuffix.length() - 3))
            pathWithSuffix += ".js";
        std::string scriptBuffer = fileOperationDelegate.onGetStringFromFile(pathWithSuffix);

        if (scriptBuffer.empty() && !prevScriptFileDir.empty())
        {
            std::string secondPath = prevScriptFileDir;
            if (secondPath[secondPath.length()-1] != '/')
                secondPath += "/";

            secondPath += path;

            if (FileUtils::getInstance()->isDirectoryExist(secondPath))
            {
                if (secondPath[secondPath.length()-1] != '/')
                    secondPath += "/";
                secondPath += "index.js";
            }
            else
            {
                if (path.rfind(".js") != (path.length() - 3))
                    secondPath += ".js";
            }

            fullPath = fileOperationDelegate.onGetFullPath(secondPath);
            scriptBuffer = fileOperationDelegate.onGetStringFromFile(fullPath);
        }
        else
        {
            fullPath = fileOperationDelegate.onGetFullPath(pathWithSuffix);
        }


        if (!scriptBuffer.empty())
        {
            const auto& iter = __moduleCache.find(fullPath);
            if (iter != __moduleCache.end())
            {
                *ret = iter->second;
//                printf("Found cache: %s, value: %d\n", fullPath.c_str(), (int)ret->getType());
                return true;
            }
            std::string currentScriptFileDir = FileUtils::getInstance()->getFileDir(fullPath);

            // Add closure for evalutate the script
            char prefix[] = "(function(currentScriptDir){ window.module = window.module || {}; var exports = window.module.exports = {}; ";
            char suffix[512] = {0};
            snprintf(suffix, sizeof(suffix), "\nwindow.module.exports = window.module.exports || exports;\n})('%s'); ", currentScriptFileDir.c_str());

            // Add current script path to require function invocation
            scriptBuffer = prefix + std::regex_replace(scriptBuffer, std::regex("([^A-Za-z0-9]|^)requireModule\\((.*?)\\)"), "$1requireModule($2, currentScriptDir)") + suffix;

//            FILE* fp = fopen("/Users/james/Downloads/test.txt", "wb");
//            fwrite(scriptBuffer.c_str(), scriptBuffer.length(), 1, fp);
//            fclose(fp);

            std::string reletivePath = fullPath;
#if CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    #if CC_TARGET_PLATFORM == CC_PLATFORM_MAC
            const std::string reletivePathKey = "/Contents/Resources";
    #else
            const std::string reletivePathKey = ".app";
    #endif

            size_t pos = reletivePath.find(reletivePathKey);
            if (pos != std::string::npos)
            {
                reletivePath = reletivePath.substr(pos + reletivePathKey.length() + 1);
            }
#endif


//            RENDERER_LOGD("Evaluate: %s", fullPath.c_str());

            auto se = se::ScriptEngine::getInstance();
            bool succeed = se->evalString(scriptBuffer.c_str(), scriptBuffer.length(), nullptr, reletivePath.c_str());
            se::Value moduleVal;
            if (succeed && se->getGlobalObject()->getProperty("module", &moduleVal) && moduleVal.isObject())
            {
                se::Value exportsVal;
                if (moduleVal.toObject()->getProperty("exports", &exportsVal))
                {
                    if (ret != nullptr)
                        *ret = exportsVal;

                    __moduleCache[fullPath] = std::move(exportsVal);
                }
                else
                {
                    __moduleCache[fullPath] = se::Value::Undefined;
                }
                // clear module.exports
                moduleVal.toObject()->setProperty("exports", se::Value::Undefined);
            }
            else
            {
                __moduleCache[fullPath] = se::Value::Undefined;
            }
            assert(succeed);
            return succeed;
        }

        SE_LOGE("doModuleRequire %s, buffer is empty!\n", path.c_str());
        assert(false);
        return false;
    }

    static bool moduleRequire(se::State& s)
    {
        const auto& args = s.args();
        int argc = (int)args.size();
        assert(argc >= 2);
        assert(args[0].isString());
        assert(args[1].isString());

        return doModuleRequire(args[0].toString(), &s.rval(), args[1].toString());
    }
    SE_BIND_FUNC(moduleRequire)
} // namespace {

bool jsb_run_script(const std::string& filePath, se::Value* rval/* = nullptr */)
{
    se::AutoHandleScope hs;
    return se::ScriptEngine::getInstance()->runScript(filePath, rval);
}

bool jsb_run_script_module(const std::string& filePath, se::Value* rval/* = nullptr */)
{
    return doModuleRequire(filePath, rval, "");
}

static bool jsc_garbageCollect(se::State& s)
{
    se::ScriptEngine::getInstance()->garbageCollect();
    return true;
}
SE_BIND_FUNC(jsc_garbageCollect)

static bool jsc_dumpNativePtrToSeObjectMap(se::State& s)
{
    cocos2d::log(">>> total: %d, Dump (native -> jsobj) map begin", (int)se::NativePtrToObjectMap::size());

    struct NamePtrStruct
    {
        const char* name;
        void* ptr;
    };

    std::vector<NamePtrStruct> namePtrArray;

    for (const auto& e : se::NativePtrToObjectMap::instance())
    {
        se::Object* jsobj = e.second;
        assert(jsobj->_getClass() != nullptr);
        NamePtrStruct tmp;
        tmp.name = jsobj->_getClass()->getName();
        tmp.ptr = e.first;
        namePtrArray.push_back(tmp);
    }

    std::sort(namePtrArray.begin(), namePtrArray.end(), [](const NamePtrStruct& a, const NamePtrStruct& b) -> bool {
        std::string left = a.name;
        std::string right = b.name;
        for( std::string::const_iterator lit = left.begin(), rit = right.begin(); lit != left.end() && rit != right.end(); ++lit, ++rit )
            if( ::tolower( *lit ) < ::tolower( *rit ) )
                return true;
            else if( ::tolower( *lit ) > ::tolower( *rit ) )
                return false;
        if( left.size() < right.size() )
            return true;
        return false;
    });

    for (const auto& e : namePtrArray)
    {
        cocos2d::log("%s: %p", e.name, e.ptr);
    }
    cocos2d::log(">>> total: %d, nonRefMap: %d, Dump (native -> jsobj) map end", (int)se::NativePtrToObjectMap::size(), (int)se::NonRefNativePtrCreatedByCtorMap::size());
    return true;
}
SE_BIND_FUNC(jsc_dumpNativePtrToSeObjectMap)

static bool jsc_dumpRoot(se::State& s)
{
    assert(false);
    return true;
}
SE_BIND_FUNC(jsc_dumpRoot)

static bool JSBCore_platform(se::State& s)
{
    Application::Platform platform = Application::getInstance()->getPlatform();
    s.rval().setInt32((int32_t)platform);
    return true;
}
SE_BIND_FUNC(JSBCore_platform)

static bool JSBCore_version(se::State& s)
{
//cjh    char version[256];
//    snprintf(version, sizeof(version)-1, "%s", cocos2dVersion());
//
//    s.rval().setString(version);
    return true;
}
SE_BIND_FUNC(JSBCore_version)

static bool JSBCore_os(se::State& s)
{
    se::Value os;

    // osx, ios, android, windows, linux, etc..
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    os.setString("iOS");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    os.setString("Android");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
    os.setString("Windows");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MARMALADE)
    os.setString("Marmalade");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_LINUX)
    os.setString("Linux");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_BADA)
    os.setString("Bada");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_BLACKBERRY)
    os.setString("Blackberry");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    os.setString("OS X");
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    os.setString("WINRT");
#else
    os.setString("Unknown");
#endif

    s.rval() = os;
    return true;
}
SE_BIND_FUNC(JSBCore_os)

static bool JSBCore_getCurrentLanguage(se::State& s)
{
    std::string languageStr;
    Application::LanguageType language = Application::getInstance()->getCurrentLanguage();
    switch (language)
    {
        case Application::LanguageType::ENGLISH:
            languageStr = "en";
            break;
        case Application::LanguageType::CHINESE:
            languageStr = "zh";
            break;
        case Application::LanguageType::FRENCH:
            languageStr = "fr";
            break;
        case Application::LanguageType::ITALIAN:
            languageStr = "it";
            break;
        case Application::LanguageType::GERMAN:
            languageStr = "de";
            break;
        case Application::LanguageType::SPANISH:
            languageStr = "es";
            break;
        case Application::LanguageType::DUTCH:
            languageStr = "du";
            break;
        case Application::LanguageType::RUSSIAN:
            languageStr = "ru";
            break;
        case Application::LanguageType::KOREAN:
            languageStr = "ko";
            break;
        case Application::LanguageType::JAPANESE:
            languageStr = "ja";
            break;
        case Application::LanguageType::HUNGARIAN:
            languageStr = "hu";
            break;
        case Application::LanguageType::PORTUGUESE:
            languageStr = "pt";
            break;
        case Application::LanguageType::ARABIC:
            languageStr = "ar";
            break;
        case Application::LanguageType::NORWEGIAN:
            languageStr = "no";
            break;
        case Application::LanguageType::POLISH:
            languageStr = "pl";
            break;
        case Application::LanguageType::TURKISH:
            languageStr = "tr";
            break;
        case Application::LanguageType::UKRAINIAN:
            languageStr = "uk";
            break;
        case Application::LanguageType::ROMANIAN:
            languageStr = "ro";
            break;
        case Application::LanguageType::BULGARIAN:
            languageStr = "bg";
            break;
        default:
            languageStr = "unknown";
            break;
    }
    s.rval().setString(languageStr);
    return true;
}
SE_BIND_FUNC(JSBCore_getCurrentLanguage)

static bool JSB_getOSVersion(se::State& s)
{
    std::string systemVersion = Application::getInstance()->getSystemVersion();
    s.rval().setString(systemVersion);
    return true;
}
SE_BIND_FUNC(JSB_getOSVersion)

static bool JSB_cleanScript(se::State& s)
{
    assert(false); //FIXME:
    return true;
}
SE_BIND_FUNC(JSB_cleanScript)

static bool JSB_core_restartVM(se::State& s)
{
    //TODO: release AudioEngine, waiting HttpClient & WebSocket threads to exit.
    Application::getInstance()->restart();
    return true;
}
SE_BIND_FUNC(JSB_core_restartVM)

static bool JSB_closeWindow(se::State& s)
{
//cjh    EventListenerCustom* _event = Director::getInstance()->getEventDispatcher()->addCustomEventListener(Director::EVENT_AFTER_DRAW, [&](EventCustom *event) {
//        Director::getInstance()->getEventDispatcher()->removeEventListener(_event);
//        CC_SAFE_RELEASE(_event);
//
//        se::ScriptEngine::getInstance()->cleanup();
//    });
//    _event->retain();
//    Director::getInstance()->end();
//#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
//    exit(0);
//#endif
    return true;
}
SE_BIND_FUNC(JSB_closeWindow)

static bool JSB_isObjectValid(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        void* nativePtr = nullptr;
        seval_to_native_ptr(args[0], &nativePtr);
        s.rval().setBoolean(nativePtr != nullptr);
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments: %d. Expecting: 1", argc);
    return false;
}
SE_BIND_FUNC(JSB_isObjectValid)

static bool getOrCreatePlainObject_r(const char* name, se::Object* parent, se::Object** outObj)
{
    assert(parent != nullptr);
    assert(outObj != nullptr);
    se::Value tmp;

    if (parent->getProperty(name, &tmp) && tmp.isObject())
    {
        *outObj = tmp.toObject();
        (*outObj)->incRef();
    }
    else
    {
        *outObj = se::Object::createPlainObject();
        parent->setProperty(name, se::Value(*outObj));
    }

    return true;
}

static bool js_performance_now(se::State& s)
{
    auto now = std::chrono::steady_clock::now();
    auto micro = std::chrono::duration_cast<std::chrono::microseconds>(now - se::ScriptEngine::getInstance()->getStartTime()).count();
    s.rval().setNumber((double)micro * 0.001);
    return true;
}
SE_BIND_FUNC(js_performance_now)

static bool js_loadImage(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string path;
        ok &= seval_to_std_string(args[0], &path);
        SE_PRECONDITION2(ok, false, "js_loadImage : Error processing arguments");

        se::Value callbackVal = args[1];
        assert(callbackVal.isObject());
        assert(callbackVal.toObject()->isFunction());

        if (path.empty())
        {
            SE_REPORT_ERROR("src is empty!");
            return false;
        }

        auto initImageFunc = [path, callbackVal](const std::string& fullPath, unsigned char* imageData, int imageBytes){
            Image* img = new (std::nothrow) Image();

            __threadPool->pushTask([=](int tid){
                // NOTE: FileUtils::getInstance()->fullPathForFilename isn't a threadsafe method,
                // Image::initWithImageFile will call fullPathForFilename internally which may
                // cause thread race issues. Therefore, we get the full path of file before
                // going into task callback.
                // Be careful of invoking any Cocos2d-x interface in a sub-thread.
                bool loadSucceed = false;
                if (fullPath.empty())
                {
                    loadSucceed = img->initWithImageData(imageData, imageBytes);
                    free(imageData);
                }
                else
                {
                    loadSucceed = img->initWithImageFile(fullPath);
                }

                Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
                    if (loadSucceed)
                    {
                        se::AutoHandleScope hs;
                        se::HandleObject retObj(se::Object::createPlainObject());
                        Data data;
                        data.copy(img->getData(), img->getDataLen());
                        se::Value dataVal;
                        Data_to_seval(data, &dataVal);
                        retObj->setProperty("data", dataVal);
                        retObj->setProperty("width", se::Value(img->getWidth()));
                        retObj->setProperty("height", se::Value(img->getHeight()));
                        retObj->setProperty("premultiplyAlpha", se::Value(img->hasPremultipliedAlpha()));
                        retObj->setProperty("bpp", se::Value(img->getBitPerPixel()));
                        retObj->setProperty("hasAlpha", se::Value(img->hasAlpha()));
                        retObj->setProperty("compressed", se::Value(img->isCompressed()));
                        int numberOfMipmaps = img->getNumberOfMipmaps();
                        retObj->setProperty("numberOfMipmaps", se::Value(numberOfMipmaps));
                        if (numberOfMipmaps > 0)
                        {
                            se::HandleObject mipmapArray(se::Object::createArrayObject(numberOfMipmaps));
                            retObj->setProperty("mipmaps", se::Value(mipmapArray));
                            MipmapInfo* mipmapInfo = img->getMipmaps();
                            for (int i = 0; i < numberOfMipmaps; ++i)
                            {
                                se::HandleObject info(se::Object::createPlainObject());
                                info->setProperty("offset", se::Value(mipmapInfo[i].offset));
                                info->setProperty("length", se::Value(mipmapInfo[i].len));
                                mipmapArray->setArrayElement(i, se::Value(info));
                            }
                        }

                        const auto& pixelFormatInfo = img->getPixelFormatInfo();
                        retObj->setProperty("glFormat", se::Value(pixelFormatInfo.format));
                        retObj->setProperty("glInternalFormat", se::Value(pixelFormatInfo.internalFormat));
                        retObj->setProperty("glType", se::Value(pixelFormatInfo.type));
                        se::ValueArray seArgs;
                        seArgs.push_back(se::Value(retObj));
                        callbackVal.toObject()->call(seArgs, nullptr);
                    }
                    else
                    {
                        SE_REPORT_ERROR("initWithImageFile: %s failed!", path.c_str());
                        assert(false);
                    }

                    img->release();
                });

            });
        };

        size_t pos = std::string::npos;
        if (path.find("http://") == 0 || path.find("https://") == 0)
        {
            auto request = new cocos2d::network::HttpRequest();
            request->setRequestType(cocos2d::network::HttpRequest::Type::GET);
            request->setUrl(path);
            request->setResponseCallback([=](cocos2d::network::HttpClient* client, cocos2d::network::HttpResponse* response){
                auto data = response->getResponseData();
                if (data != nullptr && !data->empty())
                {
                    int imageBytes = (int)data->size();
                    unsigned char* imageData = (unsigned char*)malloc(imageBytes);
                    memcpy(imageData, data->data(), imageBytes);
                    initImageFunc("", imageData, imageBytes);
                }
                else
                {
                    SE_REPORT_ERROR("Getting image from (%s) failed!", path.c_str());
                }
            });
            cocos2d::network::HttpClient::getInstance()->send(request);
            request->release();
        }
        else if (path.find("data:") == 0 && (pos = path.find("base64,")) != std::string::npos)
        {
            int imageBytes = 0;
            unsigned char* imageData = nullptr;
            size_t dataStartPos = pos + strlen("base64,");
            const char* base64Data = path.data() + dataStartPos;
            size_t dataLen = path.length() - dataStartPos;
            imageBytes = base64Decode((const unsigned char *)base64Data, (unsigned int)dataLen, &imageData);
            if (imageBytes <= 0 || imageData == nullptr)
            {
                SE_REPORT_ERROR("Decode base64 image data failed!");
                return false;
            }
            initImageFunc("", imageData, imageBytes);
        }
        else
        {
            if (0 == path.find("file://"))
                path = path.substr(strlen("file://"));
            std::string fullPath = FileUtils::getInstance()->fullPathForFilename(path);
            if (fullPath.empty())
            {
                SE_REPORT_ERROR("File (%s) doesn't exist!", path.c_str());
                return false;
            }
            initImageFunc(fullPath, nullptr, 0);
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_loadImage)

static bool js_setDebugViewText(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        int32_t index;
        ok = seval_to_int32(args[0], &index);
        SE_PRECONDITION2(ok, false, "Convert arg0 index failed!");

        std::string text;
        ok = seval_to_std_string(args[1], &text);
        SE_PRECONDITION2(ok, false, "Convert arg1 text failed!");


#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
        setGameInfoDebugViewTextJNI(index, text);
#endif
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_setDebugViewText)

static bool js_openDebugView(se::State& s)
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    openDebugViewJNI();
#endif
    return true;
}
SE_BIND_FUNC(js_openDebugView)

static bool js_disableBatchGLCommandsToNative(se::State& s)
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    disableBatchGLCommandsToNativeJNI();
#endif
    return true;
}
SE_BIND_FUNC(js_disableBatchGLCommandsToNative)

static bool JSB_openURL(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc > 0) {
        std::string url;
        ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "url is invalid!");
        Application::getInstance()->openURL(url);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_openURL)

static bool JSB_setPreferredFramesPerSecond(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc > 0) {
        int32_t fps;
        ok = seval_to_int32(args[0], &fps);
        SE_PRECONDITION2(ok, false, "fps is invalid!");
        Application::getInstance()->setPreferredFramesPerSecond(fps);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_setPreferredFramesPerSecond)

bool jsb_register_global_variables(se::Object* global)
{
    __threadPool = ThreadPool::newFixedThreadPool(3);

    global->defineFunction("require", _SE(require));
    global->defineFunction("requireModule", _SE(moduleRequire));

    getOrCreatePlainObject_r("cc", global, &__ccObj);

    getOrCreatePlainObject_r("jsb", global, &__jsbObj);
    getOrCreatePlainObject_r("__jsc__", global, &__jscObj);

    auto glContextCls = se::Class::create("WebGLRenderingContext", global, nullptr, nullptr);
    glContextCls->install();

    SAFE_DEC_REF(__glObj);
    __glObj = se::Object::createObjectWithClass(glContextCls);
    global->setProperty("__ccgl", se::Value(__glObj));

    __jscObj->defineFunction("garbageCollect", _SE(jsc_garbageCollect));
    __jscObj->defineFunction("dumpNativePtrToSeObjectMap", _SE(jsc_dumpNativePtrToSeObjectMap));

    __jsbObj->defineFunction("loadImage", _SE(js_loadImage));
    __jsbObj->defineFunction("setDebugViewText", _SE(js_setDebugViewText));
    __jsbObj->defineFunction("openDebugView", _SE(js_openDebugView));
    __jsbObj->defineFunction("disableBatchGLCommandsToNative", _SE(js_disableBatchGLCommandsToNative));
    __jsbObj->defineFunction("openURL", _SE(JSB_openURL));
    __jsbObj->defineFunction("setPreferredFramesPerSecond", _SE(JSB_setPreferredFramesPerSecond));

    global->defineFunction("__getPlatform", _SE(JSBCore_platform));
    global->defineFunction("__getOS", _SE(JSBCore_os));
    global->defineFunction("__getOSVersion", _SE(JSB_getOSVersion));
    global->defineFunction("__getCurrentLanguage", _SE(JSBCore_getCurrentLanguage));
    global->defineFunction("__getVersion", _SE(JSBCore_version));
    global->defineFunction("__restartVM", _SE(JSB_core_restartVM));
    global->defineFunction("__cleanScript", _SE(JSB_cleanScript));
    global->defineFunction("__isObjectValid", _SE(JSB_isObjectValid));
    global->defineFunction("close", _SE(JSB_closeWindow));

    se::HandleObject performanceObj(se::Object::createPlainObject());
    performanceObj->defineFunction("now", _SE(js_performance_now));
    global->setProperty("performance", se::Value(performanceObj));

    se::ScriptEngine::getInstance()->clearException();

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([](){
        delete __threadPool;
        __threadPool = nullptr;

        PoolManager::getInstance()->getCurrentPool()->clear();
    });

    se::ScriptEngine::getInstance()->addAfterCleanupHook([](){

        PoolManager::getInstance()->getCurrentPool()->clear();

        __moduleCache.clear();

        SAFE_DEC_REF(__ccObj);
        SAFE_DEC_REF(__jsbObj);
        SAFE_DEC_REF(__jscObj);
        SAFE_DEC_REF(__glObj);
    });

    return true;
}
