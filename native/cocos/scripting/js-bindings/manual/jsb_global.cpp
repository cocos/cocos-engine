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

#include "jsb_global.h"
#include "jsb_conversions.hpp"
#include "xxtea/xxtea.h"

#include "base/CCScheduler.h"
#include "base/CCThreadPool.h"
#include "network/HttpClient.h"
#include "platform/CCApplication.h"
#include "ui/edit-box/EditBox.h"

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "platform/android/jni/JniImp.h"
#endif

#include <regex>

using namespace cocos2d;

se::Object* __jsbObj = nullptr;
se::Object* __glObj = nullptr;

static ThreadPool* __threadPool = nullptr;

static std::shared_ptr<cocos2d::network::Downloader> _localDownloader = nullptr;
static std::map<std::string, std::function<void(const std::string&, unsigned char*, int )>> _localDownloaderHandlers;
static uint64_t _localDownloaderTaskId = 1000000;
static std::string xxteaKey = "";
void jsb_set_xxtea_key(const std::string& key)
{
    xxteaKey = key;
}

static cocos2d::network::Downloader *localDownloader()
{
    if(!_localDownloader)
    {
        _localDownloader = std::make_shared<cocos2d::network::Downloader>();
        _localDownloader->onDataTaskSuccess = [=](const cocos2d::network::DownloadTask& task,
                                            std::vector<unsigned char>& data) {
            if(data.empty())
            {
                SE_REPORT_ERROR("Getting image from (%s) failed!", task.requestURL.c_str());
                return;
            }

            auto callback = _localDownloaderHandlers.find(task.identifier);
            if(callback == _localDownloaderHandlers.end())
            {
                SE_REPORT_ERROR("Getting image from (%s), callback not found!!", task.requestURL.c_str());
                return;
            }
            size_t imageBytes = data.size();
            unsigned char* imageData = (unsigned char*)malloc(imageBytes);
            memcpy(imageData, data.data(), imageBytes);

            (callback->second)("", imageData, imageBytes);
            //initImageFunc("", imageData, imageBytes);
            _localDownloaderHandlers.erase(callback);
        };
        _localDownloader->onTaskError = [=](const cocos2d::network::DownloadTask& task,
                                      int errorCode,
                                      int errorCodeInternal,
                                      const std::string& errorStr) {

            SE_REPORT_ERROR("Getting image from (%s) failed!", task.requestURL.c_str());
            _localDownloaderHandlers.erase(task.identifier);
        };
    }
    return _localDownloader.get();
}

static void localDownloaderCreateTask(const std::string &url, std::function<void(const std::string&, unsigned char*, int )> callback)
{
    std::stringstream ss;
    ss << "jsb_loadimage_" << (_localDownloaderTaskId++);
    std::string key = ss.str();
    auto task = localDownloader()->createDownloadDataTask(url, key);
    _localDownloaderHandlers.emplace(std::make_pair(task->identifier, callback));
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

                if (ZipUtils::isGZipBuffer(data,dataLen)) {
                    uint8_t* unpackedData;
                    ssize_t unpackedLen = ZipUtils::inflateMemory(data, dataLen,&unpackedData);

                    if (unpackedData == nullptr) {
                        SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                        return;
                    }

                    readCallback(unpackedData, unpackedLen);
                    free(data);
                    free(unpackedData);
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

                if (ZipUtils::isGZipBuffer(data,dataLen)) {
                    uint8_t* unpackedData;
                    ssize_t unpackedLen = ZipUtils::inflateMemory(data, dataLen,&unpackedData);
                    if (unpackedData == nullptr) {
                        SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                        return "";
                    }

                    std::string ret(reinterpret_cast<const char*>(unpackedData), unpackedLen);
                    free(unpackedData);
                    free(data);

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

bool jsb_enable_debugger(const std::string& debuggerServerAddr, uint32_t port, bool isWaitForConnect)
{
    if (debuggerServerAddr.empty() || port == 0)
        return false;

    auto se = se::ScriptEngine::getInstance();
    se->enableDebugger(debuggerServerAddr.c_str(), port, isWaitForConnect);

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
    //cjh IDEA:    Director::getInstance()->getScheduler()->scheduleUpdate(&runLoop, 0, false);
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
    assert(false); //IDEA:
    return true;
}
SE_BIND_FUNC(JSB_cleanScript)

static bool JSB_core_restartVM(se::State& s)
{
    //REFINE: release AudioEngine, waiting HttpClient & WebSocket threads to exit.
    Application::getInstance()->restart();
    return true;
}
SE_BIND_FUNC(JSB_core_restartVM)

static bool JSB_closeWindow(se::State& s)
{
    Application::getInstance()->end();
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

namespace
{
    struct ImageInfo
    {
        ~ImageInfo()
        {
            if (freeData)
                delete [] data;
        }

        uint32_t length = 0;
        uint32_t width = 0;
        uint32_t height = 0;
        uint8_t* data = nullptr;
        GLenum glFormat = GL_RGBA;
        GLenum glInternalFormat = GL_RGBA;
        GLenum type = GL_UNSIGNED_BYTE;
        uint8_t bpp = 0;
        uint8_t numberOfMipmaps = 0;
        bool hasAlpha = false;
        bool hasPremultipliedAlpha = false;
        bool compressed = false;

        bool freeData = false;
    };

    struct ImageInfo* createImageInfo(const Image* img)
    {
        struct ImageInfo* imgInfo = new struct ImageInfo();
        imgInfo->length = (uint32_t)img->getDataLen();
        imgInfo->width = img->getWidth();
        imgInfo->height = img->getHeight();
        imgInfo->data = img->getData();

        const auto& pixelFormatInfo = img->getPixelFormatInfo();
        imgInfo->glFormat = pixelFormatInfo.format;
        imgInfo->glInternalFormat = pixelFormatInfo.internalFormat;
        imgInfo->type = pixelFormatInfo.type;

        imgInfo->bpp = img->getBitPerPixel();
        imgInfo->numberOfMipmaps = img->getNumberOfMipmaps();
        imgInfo->hasAlpha = img->hasAlpha();
        imgInfo->hasPremultipliedAlpha = img->hasPremultipliedAlpha();
        imgInfo->compressed = img->isCompressed();

        // Convert to RGBA888 because standard web api will return only RGBA888.
        // If not, then it may have issue in glTexSubImage. For example, engine
        // will create a big texture, and update its content with small pictures.
        // The big texture is RGBA888, then the small picture should be the same
        // format, or it will cause 0x502 error on OpenGL ES 2.
        if (GL_RGB == imgInfo->glFormat)
        {
            imgInfo->length = img->getWidth() * img->getHeight() * 4;
            uint8_t* dst = new uint8_t[imgInfo->length];
            uint8_t* src = imgInfo->data;
            for (uint32_t i = 0, length = imgInfo->length; i < length; i += 4)
            {
                dst[i] = *src++;
                dst[i + 1] = *src++;
                dst[i + 2] = *src++;
                dst[i + 3] = 255;
            }
            imgInfo->data = dst;
            imgInfo->hasAlpha = true;
            imgInfo->bpp = 32;
            imgInfo->glFormat = GL_RGBA;
            imgInfo->glInternalFormat = GL_RGBA;
            imgInfo->freeData = true;
        }

        return imgInfo;
    }
}
bool jsb_global_load_image(const std::string& path, const se::Value& callbackVal) {
    if (path.empty())
    {
        se::ValueArray seArgs;
        callbackVal.toObject()->call(seArgs, nullptr);
        return true;
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

            struct ImageInfo* imgInfo = nullptr;
            if(loadSucceed)
            {
                imgInfo = createImageInfo(img);
            }

            Application::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
                se::AutoHandleScope hs;
                se::ValueArray seArgs;

                if (loadSucceed)
                {
                    se::HandleObject retObj(se::Object::createPlainObject());
                    Data data;
                    data.copy(imgInfo->data, imgInfo->length);
                    se::Value dataVal;
                    Data_to_seval(data, &dataVal);
                    retObj->setProperty("data", dataVal);
                    retObj->setProperty("width", se::Value(imgInfo->width));
                    retObj->setProperty("height", se::Value(imgInfo->height));
                    retObj->setProperty("premultiplyAlpha", se::Value(imgInfo->hasPremultipliedAlpha));
                    retObj->setProperty("bpp", se::Value(imgInfo->bpp));
                    retObj->setProperty("hasAlpha", se::Value(imgInfo->hasAlpha));
                    retObj->setProperty("compressed", se::Value(imgInfo->compressed));
                    retObj->setProperty("numberOfMipmaps", se::Value(imgInfo->numberOfMipmaps));
                    if (imgInfo->numberOfMipmaps > 0)
                    {
                        se::HandleObject mipmapArray(se::Object::createArrayObject(imgInfo->numberOfMipmaps));
                        retObj->setProperty("mipmaps", se::Value(mipmapArray));
                        auto mipmapInfo = img->getMipmaps();
                        for (int i = 0; i < imgInfo->numberOfMipmaps; ++i)
                        {
                            se::HandleObject info(se::Object::createPlainObject());
                            info->setProperty("offset", se::Value(mipmapInfo[i].offset));
                            info->setProperty("length", se::Value(mipmapInfo[i].len));
                            mipmapArray->setArrayElement(i, se::Value(info));
                        }
                    }

                    retObj->setProperty("glFormat", se::Value(imgInfo->glFormat));
                    retObj->setProperty("glInternalFormat", se::Value(imgInfo->glInternalFormat));
                    retObj->setProperty("glType", se::Value(imgInfo->type));

                    seArgs.push_back(se::Value(retObj));

                    delete imgInfo;
                }
                else
                {
                    SE_REPORT_ERROR("initWithImageFile: %s failed!", path.c_str());
                }

                callbackVal.toObject()->call(seArgs, nullptr);
                img->release();
            });

        });
    };

    size_t pos = std::string::npos;
    if (path.find("http://") == 0 || path.find("https://") == 0)
    {
#if USE_NET_WORK
        localDownloaderCreateTask(path, initImageFunc);
#else
        SE_REPORT_ERROR("can't load remote image if you disable network module!");
#endif // USE_NET_WORK
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
        std::string fullPath(FileUtils::getInstance()->fullPathForFilename(path));
        if (0 == path.find("file://"))
            fullPath = FileUtils::getInstance()->fullPathForFilename(path.substr(strlen("file://")));

        if (fullPath.empty())
        {
            SE_REPORT_ERROR("File (%s) doesn't exist!", path.c_str());
            return false;
        }
        initImageFunc(fullPath, nullptr, 0);
    }
    return true;
}

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

        return jsb_global_load_image(path, callbackVal);
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_loadImage)

//pixels(RGBA), width, height, fullFilePath(*.png/*.jpg)
static bool js_saveImageData(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::Data data;
        ok &= seval_to_Data(args[0], &data);

        uint32_t width, height;
        ok &= seval_to_uint32(args[1], &width);
        ok &= seval_to_uint32(args[2], &height);

        std::string filePath;
        ok &= seval_to_std_string(args[3], &filePath);
        SE_PRECONDITION2(ok, false, "js_saveImageData : Error processing arguments");

        Image* img = new Image();
        img->initWithRawData(data.getBytes(), data.getSize(), width, height, 8);
        // isToRGB = false, to keep alpha channel
        bool ret = img->saveToFile(filePath, false);
        s.rval().setBoolean(ret);

        img->release();
        return ret;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_saveImageData)

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

static bool JSB_showInputBox(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1)
    {
        bool ok;
        se::Value tmp;
        const auto& obj = args[0].toObject();

        cocos2d::EditBox::ShowInfo showInfo;

        ok = obj->getProperty("defaultValue", &tmp);
        SE_PRECONDITION2(ok && tmp.isString(), false, "defaultValue is invalid!");
        showInfo.defaultValue = tmp.toString();


        ok = obj->getProperty("maxLength", &tmp);
        SE_PRECONDITION2(ok && tmp.isNumber(), false, "maxLength is invalid!");
        showInfo.maxLength = tmp.toInt32();

        ok = obj->getProperty("multiple", &tmp);
        SE_PRECONDITION2(ok && tmp.isBoolean(), false, "multiple is invalid!");
        showInfo.isMultiline = tmp.toBoolean();

        if (obj->getProperty("confirmHold", &tmp))
        {
            SE_PRECONDITION2(tmp.isBoolean(), false, "confirmHold is invalid!");
            if (! tmp.isUndefined())
                showInfo.confirmHold = tmp.toBoolean();
        }


        if (obj->getProperty("confirmType", &tmp))
        {
            SE_PRECONDITION2(tmp.isString(), false, "confirmType is invalid!");
            if (!tmp.isUndefined())
                showInfo.confirmType = tmp.toString();
        }

        if (obj->getProperty("inputType", &tmp))
        {
            SE_PRECONDITION2(tmp.isString(), false, "inputType is invalid!");
            if (! tmp.isUndefined())
                showInfo.inputType = tmp.toString();
        }


        if (obj->getProperty("originX", &tmp))
        {
            SE_PRECONDITION2(tmp.isNumber(), false, "originX is invalid!");
            if (! tmp.isUndefined())
                showInfo.x = tmp.toInt32();
        }

        if (obj->getProperty("originY", &tmp))
        {
            SE_PRECONDITION2(tmp.isNumber(), false, "originY is invalid!");
            if (! tmp.isUndefined())
                showInfo.y = tmp.toInt32();
        }

        if (obj->getProperty("width", &tmp))
        {
            SE_PRECONDITION2(tmp.isNumber(), false, "width is invalid!");
            if (! tmp.isUndefined())
                showInfo.width = tmp.toInt32();
        }

        if (obj->getProperty("height", &tmp))
        {
            SE_PRECONDITION2(tmp.isNumber(), false, "height is invalid!");
            if (! tmp.isUndefined())
                showInfo.height = tmp.toInt32();
        }

        EditBox::show(showInfo);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_showInputBox);

static bool JSB_hideInputBox(se::State& s)
{
    EditBox::hide();
    return true;
}
SE_BIND_FUNC(JSB_hideInputBox)

bool jsb_register_global_variables(se::Object* global)
{
    __threadPool = ThreadPool::newFixedThreadPool(3);

    global->defineFunction("require", _SE(require));
    global->defineFunction("requireModule", _SE(moduleRequire));

    getOrCreatePlainObject_r("jsb", global, &__jsbObj);

    auto glContextCls = se::Class::create("WebGLRenderingContext", global, nullptr, nullptr);
    glContextCls->install();

    SAFE_DEC_REF(__glObj);
    __glObj = se::Object::createObjectWithClass(glContextCls);
    global->setProperty("__gl", se::Value(__glObj));

    __jsbObj->defineFunction("garbageCollect", _SE(jsc_garbageCollect));
    __jsbObj->defineFunction("dumpNativePtrToSeObjectMap", _SE(jsc_dumpNativePtrToSeObjectMap));

    __jsbObj->defineFunction("loadImage", _SE(js_loadImage));
    __jsbObj->defineFunction("saveImageData", _SE(js_saveImageData));
    __jsbObj->defineFunction("setDebugViewText", _SE(js_setDebugViewText));
    __jsbObj->defineFunction("openDebugView", _SE(js_openDebugView));
    __jsbObj->defineFunction("disableBatchGLCommandsToNative", _SE(js_disableBatchGLCommandsToNative));
    __jsbObj->defineFunction("openURL", _SE(JSB_openURL));
    __jsbObj->defineFunction("setPreferredFramesPerSecond", _SE(JSB_setPreferredFramesPerSecond));
    __jsbObj->defineFunction("showInputBox", _SE(JSB_showInputBox));
    __jsbObj->defineFunction("hideInputBox", _SE(JSB_hideInputBox));

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

        SAFE_DEC_REF(__jsbObj);
        SAFE_DEC_REF(__glObj);
    });

    return true;
}
