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
#include "application/ApplicationManager.h"
#include "base/AutoreleasePool.h"
#include "base/CoreStd.h"
#include "base/Scheduler.h"
#include "base/ThreadPool.h"
#include "base/ZipUtils.h"
#include "base/base64.h"
#include "gfx-base/GFXDef.h"
#include "jsb_conversions.h"
#include "network/HttpClient.h"
#include "platform/Image.h"
#include "platform/interfaces/modules/ISystem.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "ui/edit-box/EditBox.h"
#include "xxtea/xxtea.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include "platform/java/jni/JniImp.h"
#endif
#include <chrono>
#include <regex>
#include <sstream>

using namespace cc; //NOLINT

static LegacyThreadPool *gThreadPool = nullptr;

static std::shared_ptr<cc::network::Downloader>                                               gLocalDownloader = nullptr;
static std::map<std::string, std::function<void(const std::string &, unsigned char *, uint)>> gLocalDownloaderHandlers;
static uint64_t                                                                               gLocalDownloaderTaskId = 1000000;

static cc::network::Downloader *localDownloader() {
    if (!gLocalDownloader) {
        gLocalDownloader                    = std::make_shared<cc::network::Downloader>();
        gLocalDownloader->onDataTaskSuccess = [=](const cc::network::DownloadTask & task,
                                                  const std::vector<unsigned char> &data) {
            if (data.empty()) {
                SE_REPORT_ERROR("Getting image from (%s) failed!", task.requestURL.c_str());
                return;
            }

            auto callback = gLocalDownloaderHandlers.find(task.identifier);
            if (callback == gLocalDownloaderHandlers.end()) {
                SE_REPORT_ERROR("Getting image from (%s), callback not found!!", task.requestURL.c_str());
                return;
            }
            size_t imageBytes = data.size();
            auto * imageData  = static_cast<unsigned char *>(malloc(imageBytes));
            memcpy(imageData, data.data(), imageBytes);

            (callback->second)("", imageData, static_cast<uint>(imageBytes));
            //initImageFunc("", imageData, imageBytes);
            gLocalDownloaderHandlers.erase(callback);
        };
        gLocalDownloader->onTaskError = [=](const cc::network::DownloadTask &task,
                                            int                              errorCode,         //NOLINT
                                            int                              errorCodeInternal, //NOLINT
                                            const std::string &              errorStr) {                      //NOLINT
            SE_REPORT_ERROR("Getting image from (%s) failed!", task.requestURL.c_str());
            gLocalDownloaderHandlers.erase(task.identifier);
        };
    }
    return gLocalDownloader.get();
}

static void localDownloaderCreateTask(const std::string &url, const std::function<void(const std::string &, unsigned char *, int)> &callback) {
    std::stringstream ss;
    ss << "jsb_loadimage_" << (gLocalDownloaderTaskId++);
    std::string key  = ss.str();
    auto        task = localDownloader()->createDownloadDataTask(url, key);
    gLocalDownloaderHandlers.emplace(std::make_pair(task->identifier, callback));
}

bool jsb_set_extend_property(const char *ns, const char *clsName) { //NOLINT
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

namespace {

std::unordered_map<std::string, se::Value> gModuleCache;

static bool require(se::State &s) { //NOLINT
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    assert(argc >= 1);
    assert(args[0].isString());

    return jsb_run_script(args[0].toString(), &s.rval());
}
SE_BIND_FUNC(require)

static bool doModuleRequire(const std::string &path, se::Value *ret, const std::string &prevScriptFileDir) { //NOLINT
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
        const auto &iter = gModuleCache.find(fullPath);
        if (iter != gModuleCache.end()) {
            *ret = iter->second;
            //                printf("Found cache: %s, value: %d\n", fullPath.c_str(), (int)ret->getType());
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

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_MAC_IOS
        std::string reletivePath = fullPath;
    #if CC_PLATFORM == CC_PLATFORM_MAC_OSX
        const std::string reletivePathKey = "/Contents/Resources";
    #else
        const std::string reletivePathKey = ".app";
    #endif

        size_t pos = reletivePath.find(reletivePathKey);
        if (pos != std::string::npos) {
            reletivePath = reletivePath.substr(pos + reletivePathKey.length() + 1);
        }
#else
        const std::string &reletivePath = fullPath;
#endif

        auto      se      = se::ScriptEngine::getInstance();
        bool      succeed = se->evalString(scriptBuffer.c_str(), scriptBuffer.length(), nullptr, reletivePath.c_str());
        se::Value moduleVal;
        if (succeed && se->getGlobalObject()->getProperty("module", &moduleVal) && moduleVal.isObject()) {
            se::Value exportsVal;
            if (moduleVal.toObject()->getProperty("exports", &exportsVal)) {
                if (ret != nullptr) {
                    *ret = exportsVal;
                }
                gModuleCache[fullPath] = std::move(exportsVal);
            } else {
                gModuleCache[fullPath] = se::Value::Undefined;
            }
            // clear module.exports
            moduleVal.toObject()->setProperty("exports", se::Value::Undefined);
        } else {
            gModuleCache[fullPath] = se::Value::Undefined;
        }
        assert(succeed);
        return succeed;
    }

    SE_LOGE("doModuleRequire %s, buffer is empty!\n", path.c_str());
    assert(false);
    return false;
}

static bool moduleRequire(se::State &s) { //NOLINT
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    assert(argc >= 2);
    assert(args[0].isString());
    assert(args[1].isString());

    return doModuleRequire(args[0].toString(), &s.rval(), args[1].toString());
}
SE_BIND_FUNC(moduleRequire)
} // namespace

bool jsb_run_script(const std::string &filePath, se::Value *rval /* = nullptr */) { //NOLINT
    se::AutoHandleScope hs;
    return se::ScriptEngine::getInstance()->runScript(filePath, rval);
}

bool jsb_run_script_module(const std::string &filePath, se::Value *rval /* = nullptr */) { //NOLINT
    return doModuleRequire(filePath, rval, "");
}

static bool jsc_garbageCollect(se::State &s) { //NOLINT
    se::ScriptEngine::getInstance()->garbageCollect();
    return true;
}
SE_BIND_FUNC(jsc_garbageCollect)

static bool jsc_dumpNativePtrToSeObjectMap(se::State &s) { //NOLINT
    CC_LOG_DEBUG(">>> total: %d, Dump (native -> jsobj) map begin", (int)se::NativePtrToObjectMap::size());

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
    CC_LOG_DEBUG(">>> total: %d, nonRefMap: %d, Dump (native -> jsobj) map end", (int)se::NativePtrToObjectMap::size(), (int)se::NonRefNativePtrCreatedByCtorMap::size());
    return true;
}
SE_BIND_FUNC(jsc_dumpNativePtrToSeObjectMap)

static bool jsc_dumpRoot(se::State &s) { //NOLINT
    assert(false);
    return true;
}
SE_BIND_FUNC(jsc_dumpRoot)

static bool JSBCore_platform(se::State &s) { //NOLINT
    //Application::Platform platform = CC_CURRENT_ENGINE()->getPlatform();
    cc::BasePlatform::OSType type =
        cc::BasePlatform::getPlatform()->getOSType();
    s.rval().setInt32(static_cast<int32_t>(type));
    return true;
}
SE_BIND_FUNC(JSBCore_platform)

static bool JSBCore_os(se::State &s) { //NOLINT
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
#elif (CC_PLATFORM == CC_PLATFORM_QNX)
    os.setString("Qnx");
#elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    os.setString("OS X");
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    os.setString("OHOS");
#endif

    s.rval() = os;
    return true;
}
SE_BIND_FUNC(JSBCore_os)

static bool JSBCore_getCurrentLanguage(se::State &s) { //NOLINT
    ISystem *   systemIntf  = CC_GET_PLATFORM_INTERFACE(ISystem);
    CCASSERT(systemIntf != nullptr, "System interface does not exist");
    std::string languageStr = systemIntf->getCurrentLanguageToString();
    s.rval().setString(languageStr);
    return true;
}
SE_BIND_FUNC(JSBCore_getCurrentLanguage)

static bool JSBCore_getCurrentLanguageCode(se::State &s) { //NOLINT
    ISystem *   systemIntf = CC_GET_PLATFORM_INTERFACE(ISystem);
    CCASSERT(systemIntf != nullptr, "System interface does not exist");
    std::string language   = systemIntf->getCurrentLanguageCode();
    s.rval().setString(language);
    return true;
}
SE_BIND_FUNC(JSBCore_getCurrentLanguageCode)

static bool JSB_getOSVersion(se::State &s) { //NOLINT
    ISystem *   systemIntf    = CC_GET_PLATFORM_INTERFACE(ISystem);
    CCASSERT(systemIntf != nullptr, "System interface does not exist");
    std::string systemVersion = systemIntf->getSystemVersion();
    s.rval().setString(systemVersion);
    return true;
}
SE_BIND_FUNC(JSB_getOSVersion)

static bool JSB_core_restartVM(se::State &s) { //NOLINT
    //REFINE: release AudioEngine, waiting HttpClient & WebSocket threads to exit.
    CC_CURRENT_APPLICATION()->restart();
    return true;
}
SE_BIND_FUNC(JSB_core_restartVM)

static bool JSB_closeWindow(se::State &s) {
    CC_CURRENT_APPLICATION()->close();
    return true;
}
SE_BIND_FUNC(JSB_closeWindow)

static bool JSB_isObjectValid(se::State &s) { //NOLINT
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
SE_BIND_FUNC(JSB_isObjectValid)

static bool JSB_setCursorEnabled(se::State &s) { //NOLINT
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    SE_PRECONDITION2(argc == 1, false, "Invalid number of arguments");
    bool ok    = true;
    bool value = true;
    ok &= seval_to_boolean(args[0], &value);
    SE_PRECONDITION2(ok, false, "Error processing arguments");

    auto *systemWindowIntf = CC_GET_PLATFORM_INTERFACE(ISystemWindow);
    CCASSERT(systemWindowIntf != nullptr, "System window interface does not exist");
    systemWindowIntf->setCursorEnabled(value);
    return true;
}
SE_BIND_FUNC(JSB_setCursorEnabled)

static bool JSB_saveByteCode(se::State &s) { //NOLINT
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
SE_BIND_FUNC(JSB_saveByteCode)

static bool getOrCreatePlainObject_r(const char *name, se::Object *parent, se::Object **outObj) { //NOLINT
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

static bool js_performance_now(se::State &s) { //NOLINT
    auto now   = std::chrono::steady_clock::now();
    auto micro = std::chrono::duration_cast<std::chrono::microseconds>(now - se::ScriptEngine::getInstance()->getStartTime()).count();
    s.rval().setDouble(static_cast<double>(micro) * 0.001);
    return true;
}
SE_BIND_FUNC(js_performance_now)

namespace {
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

struct ImageInfo *createImageInfo(Image *img) {
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
} // namespace

bool jsb_global_load_image(const std::string &path, const se::Value &callbackVal) { //NOLINT(readability-identifier-naming)
    if (path.empty()) {
        se::ValueArray seArgs;
        callbackVal.toObject()->call(seArgs, nullptr);
        return true;
    }

    std::shared_ptr<se::Value> callbackPtr = std::make_shared<se::Value>(callbackVal);

    auto initImageFunc = [path, callbackPtr](const std::string &fullPath, unsigned char *imageData, int imageBytes) {
        auto *img = new (std::nothrow) Image();

        gThreadPool->pushTask([=](int /*tid*/) {
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

            CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([=]() {
                se::AutoHandleScope hs;
                se::ValueArray      seArgs;
                se::Value           dataVal;

                if (loadSucceed) {
                    se::HandleObject retObj(se::Object::createPlainObject());
                    dataVal.setUint64(reinterpret_cast<uintptr_t>(imgInfo->data));
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
        imageBytes                  = base64Decode(reinterpret_cast<const unsigned char *>(base64Data), static_cast<unsigned int>(dataLen), &imageData);
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

static bool js_loadImage(se::State &s) { //NOLINT
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
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_loadImage)

static bool js_destroyImage(se::State &s) { //NOLINT
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc == 1) {
        auto *data = reinterpret_cast<char *>(args[0].asPtr());
        SE_PRECONDITION2(ok, false, "js_destroyImage : Error processing arguments");
        free(data);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_destroyImage)

static bool JSB_openURL(se::State &s) { //NOLINT
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc > 0) {
        std::string url;
        ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "url is invalid!");
        ISystem *systemIntf = CC_GET_PLATFORM_INTERFACE(ISystem);
        CCASSERT(systemIntf != nullptr, "System interface does not exist");
        systemIntf->openURL(url);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_openURL)

static bool JSB_copyTextToClipboard(se::State &s) { //NOLINT
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc > 0) {
        std::string text;
        ok = seval_to_std_string(args[0], &text);
        SE_PRECONDITION2(ok, false, "text is invalid!");
        ISystemWindow *systemWindowIntf = CC_GET_PLATFORM_INTERFACE(ISystemWindow);
        CCASSERT(systemWindowIntf != nullptr, "System window interface does not exist");
        systemWindowIntf->copyTextToClipboard(text);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_copyTextToClipboard)

static bool JSB_setPreferredFramesPerSecond(se::State &s) { //NOLINT
    const auto &   args = s.args();
    size_t         argc = args.size();
    CC_UNUSED bool ok   = true;
    if (argc > 0) {
        int32_t fps;
        ok = seval_to_int32(args[0], &fps);
        SE_PRECONDITION2(ok, false, "fps is invalid!");
        // cc::log("EMPTY IMPLEMENTATION OF jsb.setPreferredFramesPerSecond");
        CC_CURRENT_ENGINE()->setPreferredFramesPerSecond(fps);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_setPreferredFramesPerSecond)

#if CC_USE_EDITBOX
static bool JSB_showInputBox(se::State &s) { //NOLINT
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

        EditBox::show(showInfo);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(JSB_showInputBox);

static bool JSB_hideInputBox(se::State &s) { //NOLINT
    EditBox::hide();
    return true;
}
SE_BIND_FUNC(JSB_hideInputBox)

#endif

bool jsb_register_global_variables(se::Object *global) { //NOLINT
    gThreadPool = LegacyThreadPool::newFixedThreadPool(3);

    global->defineFunction("require", _SE(require));
    global->defineFunction("requireModule", _SE(moduleRequire));

    getOrCreatePlainObject_r("jsb", global, &__jsbObj);

    auto glContextCls = se::Class::create("WebGLRenderingContext", global, nullptr, nullptr);
    glContextCls->install();

    __jsbObj->defineFunction("garbageCollect", _SE(jsc_garbageCollect));
    __jsbObj->defineFunction("dumpNativePtrToSeObjectMap", _SE(jsc_dumpNativePtrToSeObjectMap));

    __jsbObj->defineFunction("loadImage", _SE(js_loadImage));
    __jsbObj->defineFunction("openURL", _SE(JSB_openURL));
    __jsbObj->defineFunction("copyTextToClipboard", _SE(JSB_copyTextToClipboard));
    __jsbObj->defineFunction("setPreferredFramesPerSecond", _SE(JSB_setPreferredFramesPerSecond));
    __jsbObj->defineFunction("destroyImage", _SE(js_destroyImage));
#if CC_USE_EDITBOX
    __jsbObj->defineFunction("showInputBox", _SE(JSB_showInputBox));
    __jsbObj->defineFunction("hideInputBox", _SE(JSB_hideInputBox));
#endif
    __jsbObj->defineFunction("setCursorEnabled", _SE(JSB_setCursorEnabled));
    __jsbObj->defineFunction("saveByteCode", _SE(JSB_saveByteCode));
    global->defineFunction("__getPlatform", _SE(JSBCore_platform));
    global->defineFunction("__getOS", _SE(JSBCore_os));
    global->defineFunction("__getOSVersion", _SE(JSB_getOSVersion));
    global->defineFunction("__getCurrentLanguage", _SE(JSBCore_getCurrentLanguage));
    global->defineFunction("__getCurrentLanguageCode", _SE(JSBCore_getCurrentLanguageCode));
    global->defineFunction("__restartVM", _SE(JSB_core_restartVM));
    global->defineFunction("__close", _SE(JSB_closeWindow));
    global->defineFunction("__isObjectValid", _SE(JSB_isObjectValid));

    se::HandleObject performanceObj(se::Object::createPlainObject());
    performanceObj->defineFunction("now", _SE(js_performance_now));
    global->setProperty("performance", se::Value(performanceObj));

    se::ScriptEngine::getInstance()->clearException();

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
        delete gThreadPool;
        gThreadPool = nullptr;

        PoolManager::getInstance()->getCurrentPool()->clear();
    });

    se::ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        PoolManager::getInstance()->getCurrentPool()->clear();

        gModuleCache.clear();

        SAFE_DEC_REF(__jsbObj);
        SAFE_DEC_REF(__glObj);
    });

    return true;
}
