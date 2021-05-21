/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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
#include "base/CoreStd.h"
#include "base/Scheduler.h"
#include "base/ThreadPool.h"
#include "base/ZipUtils.h"
#include "base/base64.h"
#include "gfx-base/GFXDef.h"
#include "jsb_conversions.h"
#include "network/HttpClient.h"
#include "platform/Application.h"
#include "platform/Image.h"
#include "ui/edit-box/EditBox.h"
#include "xxtea/xxtea.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include "platform/android/jni/JniImp.h"
#endif

#include <chrono>
#include <regex>
#include <sstream>

using cc::Application;
using cc::FileUtils;
using cc::LegacyThreadPool;

static LegacyThreadPool *threadPool = nullptr;

static std::shared_ptr<cc::network::Downloader>                                               localDownloader = nullptr;
static std::map<std::string, std::function<void(const std::string &, unsigned char *, uint)>> localDownloaderHandlers;
static uint64_t                                                                               localDownloaderTaskId = 1000000;

static cc::network::Downloader *localDownloaderInstance() {
    if (!localDownloader) {
        localDownloader                    = std::make_shared<cc::network::Downloader>();
        localDownloader->onDataTaskSuccess = [=](const cc::network::DownloadTask & task,
                                                 const std::vector<unsigned char> &data) {
            if (data.empty()) {
                SE_REPORT_ERROR("Getting image from (%s) failed!", task.requestURL.c_str());
                return;
            }

            auto callback = localDownloaderHandlers.find(task.identifier);
            if (callback == localDownloaderHandlers.end()) {
                SE_REPORT_ERROR("Getting image from (%s), callback not found!!", task.requestURL.c_str());
                return;
            }
            size_t imageBytes = data.size();
            auto * imageData  = static_cast<unsigned char *>(malloc(imageBytes));
            memcpy(imageData, data.data(), imageBytes);

            (callback->second)("", imageData, static_cast<uint>(imageBytes));
            //initImageFunc("", imageData, imageBytes);
            localDownloaderHandlers.erase(callback);
        };
        localDownloader->onTaskError = [=](const cc::network::DownloadTask &task,
                                           int /*errorCode*/,
                                           int /*errorCodeInternal*/,
                                           const std::string & /*errorStr*/) {
            SE_REPORT_ERROR("Getting image from (%s) failed!", task.requestURL.c_str());
            localDownloaderHandlers.erase(task.identifier);
        };
    }
    return localDownloader.get();
}

static void localDownloaderCreateTask(const std::string &url, const std::function<void(const std::string &, unsigned char *, int)> &callback) {
    std::stringstream ss;
    ss << "jsb_loadimage_" << (localDownloaderTaskId++);
    std::string key  = ss.str();
    auto        task = localDownloaderInstance()->createDownloadDataTask(url, key);
    localDownloaderHandlers.emplace(std::make_pair(task->identifier, callback));
}

bool jsb_set_extend_property(const char *ns, const char *clsName) {
    se::Object *globalObj = se::ScriptEngine::getInstance()->getGlobalObject();
    se::Value   nsVal;
    if (globalObj->getProperty(ns, &nsVal) && nsVal.isObject()) {
        se::Value ccVal;
        if (globalObj->getProperty("cc", &ccVal) && ccVal.isObject()) {
            se::Value ccClassVal;
            if (ccVal.toObject()->getProperty("Class", &ccClassVal) && ccClassVal.isObject()) {
                se::Value extendVal;
                if (ccClassVal.toObject()->getProperty("extend", &extendVal) && extendVal.isObject() && extendVal.toObject()->isFunction()) {
                    se::Value targetClsVal;
                    if (nsVal.toObject()->getProperty(clsName, &targetClsVal) && targetClsVal.isObject()) {
                        return targetClsVal.toObject()->setProperty("extend", extendVal);
                    }
                }
            }
        }
    }
    return false;
}

std::unordered_map<std::string, se::Value> moduleCache;

bool require(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    assert(argc >= 1);
    assert(args[0].isString());

    return jsb_run_script(args[0].toString(), &s.rval());
}
SE_BIND_FUNC(require)

bool doModuleRequire(const std::string &path, se::Value *ret, const std::string &prevScriptFileDir) {
    se::AutoHandleScope hs;
    assert(!path.empty());

    const auto &fileOperationDelegate = se::ScriptEngine::getInstance()->getFileOperationDelegate();
    assert(fileOperationDelegate.isValid());

    std::string fullPath;

    std::string pathWithSuffix = path;
    if (pathWithSuffix.rfind(".js") != (pathWithSuffix.length() - 3)) {
        pathWithSuffix += ".js";
    }
    std::string scriptBuffer = fileOperationDelegate.onGetStringFromFile(pathWithSuffix);

    if (scriptBuffer.empty() && !prevScriptFileDir.empty()) {
        std::string secondPath = prevScriptFileDir;
        if (secondPath[secondPath.length() - 1] != '/') {
            secondPath += "/";
        }

        secondPath += path;

        if (FileUtils::getInstance()->isDirectoryExist(secondPath)) {
            if (secondPath[secondPath.length() - 1] != '/') {
                secondPath += "/";
            }
            secondPath += "index.js";
        } else {
            if (path.rfind(".js") != (path.length() - 3)) {
                secondPath += ".js";
            }
        }

        fullPath     = fileOperationDelegate.onGetFullPath(secondPath);
        scriptBuffer = fileOperationDelegate.onGetStringFromFile(fullPath);
    } else {
        fullPath = fileOperationDelegate.onGetFullPath(pathWithSuffix);
    }

    if (!scriptBuffer.empty()) {
        const auto &iter = moduleCache.find(fullPath);
        if (iter != moduleCache.end()) {
            *ret = iter->second;
            //                printf("Found cache: %s, value: %d\n", fullPath.c_str(), static_cast<int>(ret->getType()));
            return true;
        }
        std::string currentScriptFileDir = FileUtils::getInstance()->getFileDir(fullPath);

        // Add closure for evalutate the script
        char prefix[]    = "(function(currentScriptDir){ window.module = window.module || {}; var exports = window.module.exports = {}; ";
        char suffix[512] = {0};
        snprintf(suffix, sizeof(suffix), "\nwindow.module.exports = window.module.exports || exports;\n})('%s'); ", currentScriptFileDir.c_str());

        // Add current script path to require function invocation
        scriptBuffer = prefix + std::regex_replace(scriptBuffer, std::regex("([^A-Za-z0-9]|^)requireModule\\((.*?)\\)"), "$1requireModule($2, currentScriptDir)") + suffix;

        //            FILE* fp = fopen("/Users/james/Downloads/test.txt", "wb");
        //            fwrite(scriptBuffer.c_str(), scriptBuffer.length(), 1, fp);
        //            fclose(fp);

        std::string relativePath;

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_MAC_IOS

        std::string relativePathKey;

    #if CC_PLATFORM == CC_PLATFORM_MAC_OSX
        relativePathKey = "/Contents/Resources";
    #else
        relativePathKey = ".app";
    #endif

        size_t pos = fullPath.find(relativePathKey);
        if (pos != std::string::npos) {
            relativePath = fullPath.substr(pos + relativePathKey.length() + 1);
        }
#else
        relativePath = fullPath;
#endif

        //            RENDERER_LOGD("Evaluate: %s", fullPath.c_str());

        auto *    se      = se::ScriptEngine::getInstance();
        bool      succeed = se->evalString(scriptBuffer.c_str(), static_cast<ssize_t>(scriptBuffer.length()), nullptr, relativePath.c_str());
        se::Value moduleVal;
        if (succeed && se->getGlobalObject()->getProperty("module", &moduleVal) && moduleVal.isObject()) {
            se::Value exportsVal;
            if (moduleVal.toObject()->getProperty("exports", &exportsVal)) {
                if (ret != nullptr) {
                    *ret = exportsVal;
                }

                moduleCache[fullPath] = std::move(exportsVal);
            } else {
                moduleCache[fullPath] = se::Value::Undefined;
            }
            // clear module.exports
            moduleVal.toObject()->setProperty("exports", se::Value::Undefined);
        } else {
            moduleCache[fullPath] = se::Value::Undefined;
        }
        assert(succeed);
        return succeed;
    }

    SE_LOGE("doModuleRequire %s, buffer is empty!\n", path.c_str());
    assert(false);
    return false;
}

bool moduleRequire(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    assert(argc >= 2);
    assert(args[0].isString());
    assert(args[1].isString());

    return doModuleRequire(args[0].toString(), &s.rval(), args[1].toString());
}
SE_BIND_FUNC(moduleRequire)

bool jsb_run_script(const std::string &filePath, se::Value *rval /* = nullptr */) {
    se::AutoHandleScope hs;
    return se::ScriptEngine::getInstance()->runScript(filePath, rval);
}

bool jsb_run_script_module(const std::string &filePath, se::Value *rval /* = nullptr */) {
    return doModuleRequire(filePath, rval, "");
}

static bool jscGarbageCollect(se::State &s) {
    se::ScriptEngine::getInstance()->garbageCollect();
    return true;
}
SE_BIND_FUNC(jscGarbageCollect)

static bool jscDumpNativePtrToSeObjectMap(se::State &s) {
    CC_LOG_DEBUG(">>> total: %d, Dump (native -> jsobj) map begin", static_cast<int>(se::NativePtrToObjectMap::size()));

    struct NamePtrStruct {
        const char *name;
        void *      ptr;
    };

    std::vector<NamePtrStruct> namePtrArray;

    for (const auto &e : se::NativePtrToObjectMap::instance()) {
        se::Object *jsobj = e.second;
        assert(jsobj->_getClass() != nullptr);
        NamePtrStruct tmp;
        tmp.name = jsobj->_getClass()->getName();
        tmp.ptr  = e.first;
        namePtrArray.push_back(tmp);
    }

    std::sort(namePtrArray.begin(), namePtrArray.end(), [](const NamePtrStruct &a, const NamePtrStruct &b) -> bool {
        std::string left  = a.name;
        std::string right = b.name;
        for (std::string::const_iterator lit = left.begin(), rit = right.begin(); lit != left.end() && rit != right.end(); ++lit, ++rit) {
            if (::tolower(*lit) < ::tolower(*rit)) {
                return true;
            }
            if (::tolower(*lit) > ::tolower(*rit)) {
                return false;
            }
        }
        return left.size() < right.size();
    });

    for (const auto &e : namePtrArray) {
        CC_LOG_DEBUG("%s: %p", e.name, e.ptr);
    }
    CC_LOG_DEBUG(">>> total: %d, nonRefMap: %d, Dump (native -> jsobj) map end", static_cast<int>(se::NativePtrToObjectMap::size()), static_cast<int>(se::NonRefNativePtrCreatedByCtorMap::size()));
    return true;
}
SE_BIND_FUNC(jscDumpNativePtrToSeObjectMap)

static bool jscDumpRoot(se::State &s) {
    assert(false);
    return true;
}
SE_BIND_FUNC(jscDumpRoot)

static bool jsbCorePlatform(se::State &s) {
    Application::Platform platform = Application::getInstance()->getPlatform();
    s.rval().setInt32(static_cast<int32_t>(platform));
    return true;
}
SE_BIND_FUNC(jsbCorePlatform)

static bool jsbCoreOs(se::State &s) {
    se::Value os;

    // osx, ios, android, windows, linux, etc..
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    os.setString("iOS");
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    os.setString("Android");
#elif (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    os.setString("Windows");
#elif (CC_PLATFORM == CC_PLATFORM_LINUX)
    os.setString("Linux");
#elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    os.setString("OS X");
#endif

    s.rval() = os;
    return true;
}
SE_BIND_FUNC(jsbCoreOs)

static bool jsbCoreGetCurrentLanguage(se::State &s) {
    std::string               languageStr;
    Application::LanguageType language = Application::getInstance()->getCurrentLanguage();
    switch (language) {
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
SE_BIND_FUNC(jsbCoreGetCurrentLanguage)

static bool jsbCoreGetCurrentLanguageCode(se::State &s) {
    std::string language = Application::getInstance()->getCurrentLanguageCode();
    s.rval().setString(language);
    return true;
}
SE_BIND_FUNC(jsbCoreGetCurrentLanguageCode)

static bool jsbGetOsVersion(se::State &s) {
    std::string systemVersion = Application::getInstance()->getSystemVersion();
    s.rval().setString(systemVersion);
    return true;
}
SE_BIND_FUNC(jsbGetOsVersion)

static bool jsbCoreRestartVm(se::State &s) {
    //REFINE: release AudioEngine, waiting HttpClient & WebSocket threads to exit.
    Application::getInstance()->restart();
    return true;
}
SE_BIND_FUNC(jsbCoreRestartVm)

static bool jsbCloseWindow(se::State &s) {
    Application::getInstance()->close();
    return true;
}
SE_BIND_FUNC(jsbCloseWindow)

static bool jsbIsObjectValid(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    if (argc == 1) {
        void *nativePtr = nullptr;
        seval_to_native_ptr(args[0], &nativePtr);
        s.rval().setBoolean(nativePtr != nullptr);
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments: %d. Expecting: 1", argc);
    return false;
}
SE_BIND_FUNC(jsbIsObjectValid)

static bool jsbSetCursorEnabled(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments");
    bool ok    = true;
    bool value = true;
    ok &= seval_to_boolean(args[0], &value);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    Application::getInstance()->setCursorEnabled(value);
    return true;
}
SE_BIND_FUNC(jsbSetCursorEnabled)

static bool jsbSaveByteCode(se::State &s) {
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    SE_PRECONDITION2(argc == 2, false, "Invalid number of arguments");
    bool        ok = true;
    std::string srcfile;
    std::string dstfile;
    ok &= seval_to_std_string(args[0], &srcfile);
    ok &= seval_to_std_string(args[1], &dstfile);
    SE_PRECONDITION2(ok, false, "Error processing arguments");
    ok = se::ScriptEngine::getInstance()->saveByteCodeToFile(srcfile, dstfile);
    s.rval().setBoolean(ok);
    return true;
}
SE_BIND_FUNC(jsbSaveByteCode)

static bool getOrCreatePlainObjectR(const char *name, se::Object *parent, se::Object **outObj) {
    assert(parent != nullptr);
    assert(outObj != nullptr);
    se::Value tmp;

    if (parent->getProperty(name, &tmp) && tmp.isObject()) {
        *outObj = tmp.toObject();
        (*outObj)->incRef();
    } else {
        *outObj = se::Object::createPlainObject();
        parent->setProperty(name, se::Value(*outObj));
    }

    return true;
}

static bool jsPerformanceNow(se::State &s) {
    auto now   = std::chrono::steady_clock::now();
    auto micro = std::chrono::duration_cast<std::chrono::microseconds>(now - se::ScriptEngine::getInstance()->getStartTime()).count();
    s.rval().setNumber(static_cast<double>(micro) * 0.001);
    return true;
}
SE_BIND_FUNC(jsPerformanceNow)

struct ImageInfo {
    uint32_t        length     = 0;
    uint32_t        width      = 0;
    uint32_t        height     = 0;
    uint8_t *       data       = nullptr;
    cc::gfx::Format format     = cc::gfx::Format::UNKNOWN;
    bool            hasAlpha   = false;
    bool            compressed = false;
};

uint8_t *convertRGB2RGBA(uint32_t length, uint8_t *src) {
    auto *dst = reinterpret_cast<uint8_t *>(malloc(length));
    for (uint32_t i = 0; i < length; i += 4) {
        dst[i]     = *src++;
        dst[i + 1] = *src++;
        dst[i + 2] = *src++;
        dst[i + 3] = 255;
    }
    return dst;
}

uint8_t *convertIA2RGBA(uint32_t length, uint8_t *src) {
    auto *dst = reinterpret_cast<uint8_t *>(malloc(length));
    for (uint32_t i = 0; i < length; i += 4) {
        dst[i]     = *src;
        dst[i + 1] = *src;
        dst[i + 2] = *src++;
        dst[i + 3] = *src++;
    }
    return dst;
}

uint8_t *convertI2RGBA(uint32_t length, uint8_t *src) {
    auto *dst = reinterpret_cast<uint8_t *>(malloc(length));
    for (uint32_t i = 0; i < length; i += 4) {
        dst[i]     = *src;
        dst[i + 1] = *src;
        dst[i + 2] = *src++;
        dst[i + 3] = 255;
    }
    return dst;
}

struct ImageInfo *createImageInfo(cc::Image *img) {
    auto *imgInfo   = new struct ImageInfo();
    imgInfo->length = static_cast<uint32_t>(img->getDataLen());
    imgInfo->width  = img->getWidth();
    imgInfo->height = img->getHeight();
    img->takeData(&imgInfo->data);
    imgInfo->format     = img->getRenderFormat();
    imgInfo->compressed = img->isCompressed();

    // Convert to RGBA888 because standard web api will return only RGBA888.
    // If not, then it may have issue in glTexSubImage. For example, engine
    // will create a big texture, and update its content with small pictures.
    // The big texture is RGBA888, then the small picture should be the same
    // format, or it will cause 0x502 error on OpenGL ES 2.
    if (!imgInfo->compressed && imgInfo->format != cc::gfx::Format::RGBA8) {
        imgInfo->length = img->getWidth() * img->getHeight() * 4;
        uint8_t *dst    = nullptr;
        uint32_t length = imgInfo->length;
        uint8_t *src    = imgInfo->data;
        switch (imgInfo->format) {
            case cc::gfx::Format::A8:
            case cc::gfx::Format::LA8:
                dst = convertIA2RGBA(length, src);
                break;
            case cc::gfx::Format::L8:
            case cc::gfx::Format::R8:
            case cc::gfx::Format::R8I:
                dst = convertI2RGBA(length, src);
                break;
            case cc::gfx::Format::RGB8:
                dst = convertRGB2RGBA(length, src);
                break;
            default:
                SE_LOGE("unknown image format");
                break;
        }

        if (dst != imgInfo->data) free(imgInfo->data);
        imgInfo->data     = dst;
        imgInfo->hasAlpha = true;
    }

    return imgInfo;
}

bool jsb_global_load_image(const std::string &path, const se::Value &callbackVal) {
    if (path.empty()) {
        se::ValueArray seArgs;
        callbackVal.toObject()->call(seArgs, nullptr);
        return true;
    }

    std::shared_ptr<se::Value> callbackPtr = std::make_shared<se::Value>(callbackVal);

    auto initImageFunc = [path, callbackPtr](const std::string &fullPath, unsigned char *imageData, int imageBytes) {
        auto *img = new (std::nothrow) cc::Image();

        threadPool->pushTask([=](int /*tid*/) {
            // NOTE: FileUtils::getInstance()->fullPathForFilename isn't a threadsafe method,
            // Image::initWithImageFile will call fullPathForFilename internally which may
            // cause thread race issues. Therefore, we get the full path of file before
            // going into task callback.
            // Be careful of invoking any Cocos2d-x interface in a sub-thread.
            bool loadSucceed = false;
            if (fullPath.empty()) {
                loadSucceed = img->initWithImageData(imageData, imageBytes);
                free(imageData);
            } else {
                loadSucceed = img->initWithImageFile(fullPath);
            }

            struct ImageInfo *imgInfo = nullptr;
            if (loadSucceed) {
                imgInfo = createImageInfo(img);
            }

            Application::getInstance()->getScheduler()->performFunctionInCocosThread([=]() {
                se::AutoHandleScope hs;
                se::ValueArray      seArgs;
                se::Value           dataVal;

                if (loadSucceed) {
                    se::HandleObject retObj(se::Object::createPlainObject());
                    ulong_to_seval((unsigned long)imgInfo->data, &dataVal); //NOLINT
                    retObj->setProperty("data", dataVal);
                    retObj->setProperty("width", se::Value(imgInfo->width));
                    retObj->setProperty("height", se::Value(imgInfo->height));

                    seArgs.push_back(se::Value(retObj));

                    delete imgInfo;
                } else {
                    SE_REPORT_ERROR("initWithImageFile: %s failed!", path.c_str());
                }
                callbackPtr->toObject()->call(seArgs, nullptr);
                img->release();
            });
        });
    };
    size_t pos = std::string::npos;
    if (path.find("http://") == 0 || path.find("https://") == 0) {
        localDownloaderCreateTask(path, initImageFunc);

    } else if (path.find("data:") == 0 && (pos = path.find("base64,")) != std::string::npos) {
        int            imageBytes   = 0;
        unsigned char *imageData    = nullptr;
        size_t         dataStartPos = pos + strlen("base64,");
        const char *   base64Data   = path.data() + dataStartPos;
        size_t         dataLen      = path.length() - dataStartPos;
        imageBytes                  = cc::base64Decode(reinterpret_cast<const unsigned char *>(base64Data), static_cast<unsigned int>(dataLen), &imageData);
        if (imageBytes <= 0 || imageData == nullptr) {
            SE_REPORT_ERROR("Decode base64 image data failed!");
            return false;
        }
        initImageFunc("", imageData, imageBytes);
    } else {
        std::string fullPath(FileUtils::getInstance()->fullPathForFilename(path));
        if (0 == path.find("file://")) {
            fullPath = FileUtils::getInstance()->fullPathForFilename(path.substr(strlen("file://")));
        }

        if (fullPath.empty()) {
            SE_REPORT_ERROR("File (%s) doesn't exist!", path.c_str());
            return false;
        }
        initImageFunc(fullPath, nullptr, 0);
    }
    return true;
}

static bool jsLoadImage(se::State &s) {
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc == 2) {
        std::string path;
        ok &= seval_to_std_string(args[0], &path);
        SE_PRECONDITION2(ok, false, "js_loadImage : Error processing arguments");

        se::Value callbackVal = args[1];
        assert(callbackVal.isObject());
        assert(callbackVal.toObject()->isFunction());

        return jsb_global_load_image(path, callbackVal);
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", static_cast<int>(argc), 2);
    return false;
}
SE_BIND_FUNC(jsLoadImage)

static bool jsDestroyImage(se::State &s) {
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc == 1) {
        char *data = nullptr;
        ok &= seval_to_ulong(args[0], reinterpret_cast<unsigned long *>(&data)); //NOLINT google-runtime-int
        SE_PRECONDITION2(ok, false, "js_destroyImage : Error processing arguments");
        free(data);

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", static_cast<int>(argc), 1);
    return false;
}
SE_BIND_FUNC(jsDestroyImage)

static bool jsbOpenUrl(se::State &s) {
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc > 0) {
        std::string url;
        ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "url is invalid!");
        Application::getInstance()->openURL(url);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", static_cast<int>(argc), 1);
    return false;
}
SE_BIND_FUNC(jsbOpenUrl)

static bool jsbCopyTextToClipboard(se::State &s) {
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc > 0) {
        std::string text;
        ok = seval_to_std_string(args[0], &text);
        SE_PRECONDITION2(ok, false, "text is invalid!");
        Application::getInstance()->copyTextToClipboard(text);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", static_cast<int>(argc), 1);
    return false;
}
SE_BIND_FUNC(jsbCopyTextToClipboard)

static bool jsbSetPreferredFramesPerSecond(se::State &s) {
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc > 0) {
        int32_t fps;
        ok = seval_to_int32(args[0], &fps);
        SE_PRECONDITION2(ok, false, "fps is invalid!");
        // cc::log("EMPTY IMPLEMENTATION OF jsb.setPreferredFramesPerSecond");
        Application::getInstance()->setPreferredFramesPerSecond(fps);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", static_cast<int>(argc), 1);
    return false;
}
SE_BIND_FUNC(jsbSetPreferredFramesPerSecond)

#if CC_USE_EDITBOX
static bool jsbShowInputBox(se::State &s) {
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc == 1) {
        bool        ok;
        se::Value   tmp;
        const auto &obj = args[0].toObject();

        cc::EditBox::ShowInfo showInfo;

        ok = obj->getProperty("defaultValue", &tmp);
        SE_PRECONDITION2(ok && tmp.isString(), false, "defaultValue is invalid!");
        showInfo.defaultValue = tmp.toString();

        ok = obj->getProperty("maxLength", &tmp);
        SE_PRECONDITION2(ok && tmp.isNumber(), false, "maxLength is invalid!");
        showInfo.maxLength = tmp.toInt32();

        ok = obj->getProperty("multiple", &tmp);
        SE_PRECONDITION2(ok && tmp.isBoolean(), false, "multiple is invalid!");
        showInfo.isMultiline = tmp.toBoolean();

        if (obj->getProperty("confirmHold", &tmp)) {
            SE_PRECONDITION2(tmp.isBoolean(), false, "confirmHold is invalid!");
            if (!tmp.isUndefined()) {
                showInfo.confirmHold = tmp.toBoolean();
            }
        }

        if (obj->getProperty("confirmType", &tmp)) {
            SE_PRECONDITION2(tmp.isString(), false, "confirmType is invalid!");
            if (!tmp.isUndefined()) {
                showInfo.confirmType = tmp.toString();
            }
        }

        if (obj->getProperty("inputType", &tmp)) {
            SE_PRECONDITION2(tmp.isString(), false, "inputType is invalid!");
            if (!tmp.isUndefined()) {
                showInfo.inputType = tmp.toString();
            }
        }

        if (obj->getProperty("originX", &tmp)) {
            SE_PRECONDITION2(tmp.isNumber(), false, "originX is invalid!");
            if (!tmp.isUndefined()) {
                showInfo.x = tmp.toInt32();
            }
        }

        if (obj->getProperty("originY", &tmp)) {
            SE_PRECONDITION2(tmp.isNumber(), false, "originY is invalid!");
            if (!tmp.isUndefined()) {
                showInfo.y = tmp.toInt32();
            }
        }

        if (obj->getProperty("width", &tmp)) {
            SE_PRECONDITION2(tmp.isNumber(), false, "width is invalid!");
            if (!tmp.isUndefined()) {
                showInfo.width = tmp.toInt32();
            }
        }

        if (obj->getProperty("height", &tmp)) {
            SE_PRECONDITION2(tmp.isNumber(), false, "height is invalid!");
            if (!tmp.isUndefined()) {
                showInfo.height = tmp.toInt32();
            }
        }

        cc::EditBox::show(showInfo);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", static_cast<int>(argc), 1);
    return false;
}
SE_BIND_FUNC(jsbShowInputBox);

static bool jsbHideInputBox(se::State &s) {
    cc::EditBox::hide();
    return true;
}
SE_BIND_FUNC(jsbHideInputBox)

#endif

bool jsb_register_global_variables(se::Object *global) {
    threadPool = LegacyThreadPool::newFixedThreadPool(3);

    global->defineFunction("require", _SE(require));
    global->defineFunction("requireModule", _SE(moduleRequire));

    getOrCreatePlainObjectR("jsb", global, &__jsbObj);

    auto *glContextCls = se::Class::create("WebGLRenderingContext", global, nullptr, nullptr);
    glContextCls->install();

    __jsbObj->defineFunction("garbageCollect", _SE(jscGarbageCollect));
    __jsbObj->defineFunction("dumpNativePtrToSeObjectMap", _SE(jscDumpNativePtrToSeObjectMap));

    __jsbObj->defineFunction("loadImage", _SE(jsLoadImage));
    __jsbObj->defineFunction("openURL", _SE(jsbOpenUrl));
    __jsbObj->defineFunction("copyTextToClipboard", _SE(jsbCopyTextToClipboard));
    __jsbObj->defineFunction("setPreferredFramesPerSecond", _SE(jsbSetPreferredFramesPerSecond));
    __jsbObj->defineFunction("destroyImage", _SE(jsDestroyImage));
#if CC_USE_EDITBOX
    __jsbObj->defineFunction("showInputBox", _SE(jsbShowInputBox));
    __jsbObj->defineFunction("hideInputBox", _SE(jsbHideInputBox));
#endif
    __jsbObj->defineFunction("setCursorEnabled", _SE(jsbSetCursorEnabled));
    __jsbObj->defineFunction("saveByteCode", _SE(jsbSaveByteCode));
    global->defineFunction("__getPlatform", _SE(jsbCorePlatform));
    global->defineFunction("__getOS", _SE(jsbCoreOs));
    global->defineFunction("__getOSVersion", _SE(jsbGetOsVersion));
    global->defineFunction("__getCurrentLanguage", _SE(jsbCoreGetCurrentLanguage));
    global->defineFunction("__getCurrentLanguageCode", _SE(jsbCoreGetCurrentLanguageCode));
    global->defineFunction("__restartVM", _SE(jsbCoreRestartVm));
    global->defineFunction("__isObjectValid", _SE(jsbIsObjectValid));
    global->defineFunction("__close", _SE(jsbCloseWindow));

    se::HandleObject performanceObj(se::Object::createPlainObject());
    performanceObj->defineFunction("now", _SE(jsPerformanceNow));
    global->setProperty("performance", se::Value(performanceObj));

    se::ScriptEngine::getInstance()->clearException();

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
        delete threadPool;
        threadPool = nullptr;

        cc::PoolManager::getInstance()->getCurrentPool()->clear();
    });

    se::ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        cc::PoolManager::getInstance()->getCurrentPool()->clear();

        moduleCache.clear();

        SAFE_DEC_REF(__jsbObj);
        SAFE_DEC_REF(__glObj);
    });

    return true;
}
