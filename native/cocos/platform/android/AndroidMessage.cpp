/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "AndroidMessage.h"

#include <android/log.h>
#include <cerrno>
#include <fcntl.h>
#include <cstring>
#include <unistd.h>
#include <algorithm>

namespace cc {

#define LOG_TAG "AndroidAppMessage"

#define LOGE(...) \
    ((void)__android_log_print(ANDROID_LOG_ERROR, "AndroidAppMessage", __VA_ARGS__))

#define SLOGW_IF(cond, ...)                                                    \
    ((__predict_false(cond))                                                   \
         ? ((void)__android_log_print(ANDROID_LOG_WARN, LOG_TAG, __VA_ARGS__)) \
         : (void)0)

// value returned by ALooper_pollAll
#define LOOPER_ID_MAIN 1

CocosLooper::CocosLooper() {
    int msgpipe[2];
    if (pipe(msgpipe)) {
        LOGE("could not create pipe: %s", strerror(errno));
        return;
    }
    _readPipe = msgpipe[0];
    _writePipe = msgpipe[1];
}

CocosLooper::~CocosLooper() {
    if (_isMainLooper) {
        if (_looper != nullptr && _readPipe >= 0) {
            ALooper_removeFd(_looper, _readPipe);
        }
        ALooper_release(_looper);
    }
    _looper = nullptr;
    close(_readPipe);
    close(_writePipe);
}

AndroidAppMessage CocosLooper::getMessage() const {
    AndroidAppMessage msg;
    if (read(_readPipe, &msg, sizeof(msg)) != sizeof(msg)) {
        LOGE("No data on command pipe!");
    }

    return msg;
}

void CocosLooper::writeMessage(AndroidAppMessage&& msg) const {
    if (write(_readPipe, &msg, sizeof(msg)) != sizeof(msg)) {
        LOGE("Failure writing android_app cmd: %s", strerror(errno));
    }
}

void CocosLooper::prepare(void* userData) {
    _looper = ALooper_prepare(ALOOPER_PREPARE_ALLOW_NON_CALLBACKS);
    ALooper_addFd(_looper, _readPipe, LOOPER_ID_MAIN,
                  ALOOPER_EVENT_INPUT, nullptr, userData);
}

void CocosLooper::prepareMainLooper(MainCallback* callback) {
    _looper = ALooper_forThread();
    if (_looper == nullptr) {
        LOGE("No Looper exist!");
        return;
    }
    _isMainLooper = true;
    ALooper_acquire(_looper);

    int result = fcntl(_readPipe, F_SETFL, O_NONBLOCK);
    SLOGW_IF(result != 0,
             "Could not make main work read pipe "
             "non-blocking: %s",
             strerror(errno));
    result = fcntl(_writePipe, F_SETFL, O_NONBLOCK);
    SLOGW_IF(result != 0,
             "Could not make main work write pipe "
             "non-blocking: %s",
             strerror(errno));

    ALooper_addFd(_looper, _readPipe, 0, ALOOPER_EVENT_INPUT,
                  reinterpret_cast<ALooper_callbackFunc>(callback), this);
}

MessageHandler::MessageHandler(CocosLooper* looper) {
    _looper = looper;
}

MessageHandler::~MessageHandler() {
    delete _looper;
}

template <typename T>
T* MessageHandler::obtainObject() {
    uint32_t size = sizeof(T);
    if (_offset + size > ANDROID_MESSAGE_BUFFER_SIZE) {
        _offset = 0;
    }
    auto* obj = new (_buffer + _offset) T;
    memset(obj, 0, size);
    _offset += size;
    return obj;
}

void MessageHandler::sendMessage(AndroidAppMessage&& msg) {
    if (_looper) {
        _looper->writeMessage(std::forward<AndroidAppMessage>(msg));
    }
}

} // namespace cc
