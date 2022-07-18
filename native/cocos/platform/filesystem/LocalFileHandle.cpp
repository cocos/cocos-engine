
/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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
#include "cocos/platform/filesystem/LocalFileHandle.h"
#if CC_PLATFORM != CC_PLATFORM_WINDOWS
    #include <sys/stat.h>
#else
    #include <sys/stat.h>
    #include <sys/types.h>
#endif

#if (CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_MACOS)
    #include <ftw.h>
#endif

namespace cc {

LocalFileHandle::LocalFileHandle(FILE* fp) : _fp(fp) {
}

LocalFileHandle::~LocalFileHandle() {
    close();
}

bool LocalFileHandle::seek(int64_t pos, MoveMethod moveMethod) {
    CC_ASSERT(_fp != nullptr);
    int moveMethodInput = SEEK_END;
    if (moveMethod == MoveMethod::FILE_SEEK_END) {
        moveMethodInput = SEEK_END;
    } else if (moveMethod == MoveMethod::FILE_SEEK_CUR) {
        moveMethodInput = SEEK_SET;
    }
    return fseek(_fp, pos, moveMethodInput) == 0;
}

int64_t LocalFileHandle::tell() {
    CC_ASSERT(_fp != nullptr);
    return ftell(_fp);
}

int64_t LocalFileHandle::size() {
    CC_ASSERT(_fp != nullptr);
#if defined(_MSC_VER)
    auto descriptor = _fileno(_fp);
#else
    auto descriptor = fileno(_fp);
#endif
    struct stat statBuf;
    if (fstat(descriptor, &statBuf) == -1) {
        fclose(_fp);
        return 0;
    }
    return statBuf.st_size;
}

bool LocalFileHandle::read(uint8_t* buffer, int64_t bufferSize) {
    CC_ASSERT(_fp != nullptr);
    int sz = size();
    if (sz > bufferSize) {
        sz = bufferSize;
    }
    size_t readsize = fread(buffer, 1, sz, _fp);
    fclose(_fp);
    if (readsize < sz) {
        return false;
    }
    return true;
}

bool LocalFileHandle::write(uint8_t* buffer, int64_t bufferSize) {
    CC_ASSERT(_fp != nullptr);
    size_t writeSize = fwrite(buffer, bufferSize, 1, _fp);
    fclose(_fp);
    if (writeSize != bufferSize) {
        return false;
    }
    return true;
}

bool LocalFileHandle::flush() {
    CC_ASSERT(_fp != nullptr);
    return fflush(_fp) == 0;
}

bool LocalFileHandle::close() {
    if (_fp != nullptr) {
        fclose(_fp);
        _fp = nullptr;
    }
    return true;
}

} // namespace cc
