/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
#include "base/std/container/string.h"
#include "uv.h"
// clang-format on

#include "jsb_global_init.h"
#include <type_traits>
#include <utility>

#include "base/Scheduler.h"
#include "base/ZipUtils.h"
#include "base/base64.h"
#include "base/memory/Memory.h"
#include "jsb_conversions.h"
#include "xxtea/xxtea.h"

#include <chrono>
#include <regex>
#include <sstream>

using namespace cc; //NOLINT

se::Object *__jsbObj = nullptr; //NOLINT
se::Object *__glObj = nullptr;  //NOLINT

static std::basic_string<unsigned char> xxteaKey;

void jsb_set_xxtea_key(const ccstd::string &key) { //NOLINT
    xxteaKey.assign(key.begin(), key.end());
}

static const char *BYTE_CODE_FILE_EXT = ".jsc"; //NOLINT

static ccstd::string removeFileExt(const ccstd::string &filePath) {
    size_t pos = filePath.rfind('.');
    if (0 < pos) {
        return filePath.substr(0, pos);
    }
    return filePath;
}

static int selectPort(int port) {
    struct sockaddr_in addr;
    static uv_tcp_t server;
    uv_loop_t loop;
    uv_loop_init(&loop);
    int tryTimes = 200;
    int startPort = port;
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    constexpr int localPortMin = 37000; // query from /proc/sys/net/ipv4/ip_local_port_range
    if (startPort < localPortMin) {
        uv_interface_address_t *info = nullptr;
        int count = 0;

        uv_interface_addresses(&info, &count);
        if (count == 0) {
            SE_LOGE("Failed to accquire interfaces, error: %s\n Re-select port after 37000", strerror(errno));
            startPort = localPortMin + port;
        }
        if (info) {
            uv_free_interface_addresses(info, count);
        }
    }
#endif
    while (tryTimes-- > 0) {
        uv_tcp_init(&loop, &server);
        uv_ip4_addr("0.0.0.0", startPort, &addr);
        uv_tcp_bind(&server, reinterpret_cast<const struct sockaddr *>(&addr), 0);
        int r = uv_listen(reinterpret_cast<uv_stream_t *>(&server), 5, nullptr);
        uv_close(reinterpret_cast<uv_handle_t *>(&server), nullptr);
        if (r) {
            SE_LOGD("Failed to listen port %d, error: %s. Try next port\n", startPort, uv_strerror(r));
            startPort += 1;
        } else {
            break;
        }
    }
    uv_loop_close(&loop);
    return startPort;
}

void jsb_init_file_operation_delegate() { //NOLINT

    static se::ScriptEngine::FileOperationDelegate delegate;
    if (!delegate.isValid()) {
        delegate.onGetDataFromFile = [](const ccstd::string &path, const std::function<void(const uint8_t *, size_t)> &readCallback) -> void {
            CC_ASSERT(!path.empty());

            Data fileData;

            ccstd::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                fileData = FileUtils::getInstance()->getDataFromFile(byteCodePath);

                uint32_t dataLen = 0;
                uint8_t *data = xxtea_decrypt(fileData.getBytes(), static_cast<uint32_t>(fileData.getSize()),
                                              const_cast<unsigned char *>(xxteaKey.data()),
                                              static_cast<uint32_t>(xxteaKey.size()), reinterpret_cast<uint32_t *>(&dataLen));

                if (data == nullptr) {
                    SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                    return;
                }

                if (ZipUtils::isGZipBuffer(data, dataLen)) {
                    uint8_t *unpackedData;
                    uint32_t unpackedLen = ZipUtils::inflateMemory(data, dataLen, &unpackedData);

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

        delegate.onGetStringFromFile = [](const ccstd::string &path) -> ccstd::string {
            CC_ASSERT(!path.empty());

            ccstd::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
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
                    uint32_t unpackedLen = ZipUtils::inflateMemory(data, dataLen, &unpackedData);
                    if (unpackedData == nullptr) {
                        SE_REPORT_ERROR("Can't decrypt code for %s", byteCodePath.c_str());
                        return "";
                    }

                    ccstd::string ret(reinterpret_cast<const char *>(unpackedData), unpackedLen);
                    free(unpackedData);
                    free(data);

                    return ret;
                }
                ccstd::string ret(reinterpret_cast<const char *>(data), dataLen);
                free(data);
                return ret;
            }

            if (FileUtils::getInstance()->isFileExist(path)) {
                return FileUtils::getInstance()->getStringFromFile(path);
            }
            SE_LOGE("ScriptEngine::onGetStringFromFile %s not found, possible missing file.\n", path.c_str());
            return "";
        };

        delegate.onGetFullPath = [](const ccstd::string &path) -> ccstd::string {
            CC_ASSERT(!path.empty());
            ccstd::string byteCodePath = removeFileExt(path) + BYTE_CODE_FILE_EXT;
            if (FileUtils::getInstance()->isFileExist(byteCodePath)) {
                return FileUtils::getInstance()->fullPathForFilename(byteCodePath);
            }
            return FileUtils::getInstance()->fullPathForFilename(path);
        };

        delegate.onCheckFileExist = [](const ccstd::string &path) -> bool {
            CC_ASSERT(!path.empty());
            return FileUtils::getInstance()->isFileExist(path);
        };

        CC_ASSERT(delegate.isValid());

        se::ScriptEngine::getInstance()->setFileOperationDelegate(delegate);
    } else {
        // Games may be restarted in the same process and run in different threads. Android may restart from recent task list.
        se::ScriptEngine::getInstance()->setFileOperationDelegate(delegate);
    }
}

bool jsb_enable_debugger(const ccstd::string &debuggerServerAddr, uint32_t port, bool isWaitForConnect) { //NOLINT
#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
    if (debuggerServerAddr.empty() || port == 0) {
        return false;
    }

    port = static_cast<uint32_t>(selectPort(static_cast<int>(port)));

    auto *se = se::ScriptEngine::getInstance();
    if (se != nullptr) {
        se->enableDebugger(debuggerServerAddr, port, isWaitForConnect);
    } else {
        // NOTE: jsb_enable_debugger may be invoked before se::ScriptEngine is initialized,
        // So cache the debugger information in global and use it in se::ScriptEngine::start.
        // This strategy keeps the compatibility of se::ScriptEngine::enableDebugger.
        se::ScriptEngine::DebuggerInfo debuggerInfo;
        debuggerInfo.serverAddr = debuggerServerAddr;
        debuggerInfo.port = port;
        debuggerInfo.isWait = isWaitForConnect;
        se::ScriptEngine::_setDebuggerInfo(debuggerInfo);
    }
#endif
    return true;
}
