/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/java/jni/glue/MessagePipe.h"
#include <fcntl.h>
#include <unistd.h>
#include "platform/java/jni/log.h"
//#include <android/log.h>
//#include "platform/android/jni/JniCocosActivity.h"

namespace cc {
MessagePipe::MessagePipe() {
    int messagePipe[2] = {0};
    if (pipe(messagePipe)) {
        LOGV("Can not create pipe: %s", strerror(errno));
    }

    _pipeRead = messagePipe[0];
    _pipeWrite = messagePipe[1];

    if (fcntl(_pipeRead, F_SETFL, O_NONBLOCK) < 0) {
        LOGV("Can not make pipe read to non blocking mode.");
    }
}

MessagePipe::~MessagePipe() {
    close(_pipeRead);
    close(_pipeWrite);
}

void MessagePipe::writeCommand(int8_t cmd) const {
    write(_pipeWrite, &cmd, sizeof(cmd));
}

int MessagePipe::readCommand(int8_t &cmd) const {
    return read(_pipeRead, &cmd, sizeof(cmd));
}

int MessagePipe::readCommandWithTimeout(void *msg, int32_t size, int delayMS) {
    if (delayMS > 0) {
        static fd_set fdSet;
        static timeval timeout;

        timeout = {delayMS / 1000, (delayMS % 1000) * 1000};
        FD_ZERO(&fdSet);
        FD_SET(_pipeRead, &fdSet);

        auto ret = select(_pipeRead + 1, &fdSet, nullptr, nullptr, &timeout);
        if (ret < 0) {
            LOGV("failed to run select(..): %s\n", strerror(errno));
            return ret;
        }

        if (ret == 0) {
            return 0;
        }
    }
    return readCommand(msg, size);
}

void MessagePipe::writeCommand(void *msg, int32_t size) const {
    write(_pipeWrite, msg, size);
}

int MessagePipe::readCommand(void *msg, int32_t size) const {
    return read(_pipeRead, msg, size);
}
} // namespace cc