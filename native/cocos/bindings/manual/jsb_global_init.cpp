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

// clang-format off
#include "base/Macros.h"
// clang-format: off
#include <string>
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    // Fix ssize_t defination
    #include "cocos/bindings/jswrapper/config.h"
#endif
#include "uv.h"
// clang-format on

#include "jsb_global_init.h"
#include <type_traits>
#include <utility>

#include "base/CoreStd.h"
#include "base/Scheduler.h"
#include "base/ZipUtils.h"
#include "base/base64.h"
#include "base/memory/Memory.h"
#include "jsb_conversions.h"
#include "xxtea/xxtea.h"

#include <chrono>
#include <regex>
#include <sstream>
#include <vector>

using namespace cc; //NOLINT

se::Object *__jsbObj = nullptr; //NOLINT
se::Object *__glObj  = nullptr; //NOLINT

static std::basic_string<unsigned char> xxteaKey;
void                                    jsb_set_xxtea_key(const std::string &key) { //NOLINT
    xxteaKey.assign(key.begin(), key.end());
}

static const char *BYTE_CODE_FILE_EXT = ".jsc"; //NOLINT

static std::string removeFileExt(const std::string &filePath) {
    size_t pos = filePath.rfind('.');
    if (0 < pos) {
        return filePath.substr(0, pos);
    }
    return filePath;
}

static int selectPort(int port) {
    uv_tcp_t           server;
    struct sockaddr_in addr;
    uv_loop_t *        loop      = uv_default_loop();
    int                tryTimes  = 200;
    int                startPort = port;
    uv_tcp_init(loop, &server);
    while (true) {
        if (tryTimes-- < 0) {
            return port; // allow failure
        }
        uv_ip4_addr("0.0.0.0", startPort, &addr);
        uv_tcp_bind(&server, reinterpret_cast<const struct sockaddr *>(&addr), 0);
        int r = uv_listen(reinterpret_cast<uv_stream_t *>(&server), 5, nullptr);
        if (r) {
            SE_LOGD("Failed to listen port %d, error: %s. Try next port\n", startPort, uv_strerror(r));
            startPort += 1;
            uv_close(reinterpret_cast<uv_handle_t *>(&server), nullptr);
        } else {
            uv_close(reinterpret_cast<uv_handle_t *>(&server), nullptr);
            return startPort;
        }
    }
}

void jsb_init_file_operation_delegate() { //NOLINT

    static se::ScriptEngine::FileOperationDelegate delegate;
    if (!delegate.isValid()) {
        delegate.onGetDataFromFile = [](const std::string &path, const std::function<void(const uint8_t *, size_t)> &readCallback) -> void {
            assert(!path.empty());

            Data fileData;

            std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                fileData = FileUtils::getInstance()->getDataFromFile(byteCodePath);

                size_t   dataLen = 0;
                uint8_t *data    = xxtea_decrypt(fileData.getBytes(), static_cast<uint32_t>(fileData.getSize()),
                                              const_cast<unsigned char *>(xxteaKey.data()),
                                              static_cast<uint32_t>(xxteaKey.size()), reinterpret_cast<uint32_t *>(&dataLen));

                if (data == nullptr) {
                    SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                    return;
                }

                if (ZipUtils::isGZipBuffer(data, dataLen)) {
                    uint8_t *unpackedData;
                    ssize_t  unpackedLen = ZipUtils::inflateMemory(data, dataLen, &unpackedData);

                    if (unpackedData == nullptr) {
                        SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                        return;
                    }

                    readCallback(unpackedData, unpackedLen);
                    free(data);
                    free(unpackedData);
                } else {
                    readCallback(data, dataLen);
                    free(data);
                }

                return;
            }

            fileData = FileUtils::getInstance()->getDataFromFile(path);
            readCallback(fileData.getBytes(), fileData.getSize());
        };

        delegate.onGetStringFromFile = [](const std::string &path) -> std::string {
            assert(!path.empty());

            std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                Data fileData = FileUtils::getInstance()->getDataFromFile(byteCodePath);

                uint32_t dataLen;
                uint8_t *data = xxtea_decrypt(static_cast<uint8_t *>(fileData.getBytes()), static_cast<uint32_t>(fileData.getSize()),
                                              const_cast<unsigned char *>(xxteaKey.data()),
                                              static_cast<uint32_t>(xxteaKey.size()), &dataLen);

                if (data == nullptr) {
                    SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                    return "";
                }

                if (ZipUtils::isGZipBuffer(data, dataLen)) {
                    uint8_t *unpackedData;
                    ssize_t  unpackedLen = ZipUtils::inflateMemory(data, dataLen, &unpackedData);
                    if (unpackedData == nullptr) {
                        SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                        return "";
                    }

                    std::string ret(reinterpret_cast<const char *>(unpackedData), unpackedLen);
                    free(unpackedData);
                    free(data);

                    return ret;
                }
                std::string ret(reinterpret_cast<const char *>(data), dataLen);
                free(data);
                return ret;
            }

            if (FileUtils::getInstance()->isFileExist(path)) {
                return FileUtils::getInstance()->getStringFromFile(path);
            }
            SE_LOGE("ScriptEngine::onGetStringFromFile %s not found, possible missing file.\n", path.c_str());
            return "";
        };

        delegate.onGetFullPath = [](const std::string &path) -> std::string {
            assert(!path.empty());
            std::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                return FileUtils::getInstance()->fullPathForFilename(byteCodePath);
            }
            return FileUtils::getInstance()->fullPathForFilename(path);
        };

        delegate.onCheckFileExist = [](const std::string &path) -> bool {
            assert(!path.empty());
            return FileUtils::getInstance()->isFileExist(path);
        };

        assert(delegate.isValid());

        se::ScriptEngine::getInstance()->setFileOperationDelegate(delegate);
    }
}

bool jsb_enable_debugger(const std::string &debuggerServerAddr, uint32_t port, bool isWaitForConnect) { //NOLINT
    if (debuggerServerAddr.empty() || port == 0) {
        return false;
    }

    port = static_cast<uint32_t>(selectPort(static_cast<int>(port)));

    auto *se = se::ScriptEngine::getInstance();
    se->enableDebugger(debuggerServerAddr, port, isWaitForConnect);

    // For debugger main loop
    class SimpleRunLoop {
    public:
        void update(float dt) { //NOLINT
            se::ScriptEngine::getInstance()->mainLoopUpdate();
        }
    };
    //    static SimpleRunLoop runLoop;
    //cjh IDEA:    Director::getInstance()->getScheduler()->scheduleUpdate(&runLoop, 0, false);
    return true;
}
