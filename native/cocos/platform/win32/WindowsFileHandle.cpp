
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

#include "cocos/platform/win32/WindowsFileHandle.h"
#include "base/Log.h"

namespace cc {

WindowsFileHandle::WindowsFileHandle(HANDLE handle)
: _handle(handle) {
}

WindowsFileHandle::~WindowsFileHandle() {
    close();
}

bool WindowsFileHandle::seek(int64_t pos, MoveMethod moveMethod) {
    CC_ASSERT(_handle != nullptr);
    LARGE_INTEGER filepos;
    filepos.QuadPart = pos;
    LARGE_INTEGER newPos;
    if (moveMethod == MoveMethod::FILE_SEEK_END) {
        _moveMethod = FILE_END;
    } else if (moveMethod == MoveMethod::FILE_SEEK_CUR) {
        _moveMethod = FILE_CURRENT;
    }

    if (!SetFilePointerEx(_handle, filepos, &newPos, _moveMethod)) {
        CC_LOG_ERROR("Can't seek to %d from %d", pos, _moveMethod);
        return false;
    }
    return true;
}

int64_t WindowsFileHandle::tell() {
    CC_ASSERT(_handle != nullptr);
    LARGE_INTEGER seek, pos;
    seek.QuadPart = 0;
    if (!SetFilePointerEx(_handle, seek, &pos, _moveMethod)) {
        CC_LOG_ERROR("Can't get file position from %d", _moveMethod);
        return -1;
    }
    return pos.QuadPart;
}

bool WindowsFileHandle::read(uint8_t* buffer, int64_t buffersize) {
    CC_ASSERT(_handle != nullptr);
    DWORD readCount = 0;
    if (!ReadFile(_handle, buffer, buffersize, &readCount, NULL)) {
        CC_LOG_ERROR("Can't read, the error code is %d", GetLastError());
        return false;
    }
    return true;
}

bool WindowsFileHandle::write(uint8_t* buffer, int64_t buffersize) {
    CC_ASSERT(_handle != nullptr);
    DWORD writeCount = 0;
    if (!WriteFile(_handle, buffer, buffersize, &writeCount, NULL)) {
        CC_LOG_ERROR("Can't write, the error code is %d", GetLastError());
        return false;
    }
    return true;
}

int64_t WindowsFileHandle::size() {
    CC_ASSERT(_handle != nullptr);
    LARGE_INTEGER size;
    if (GetFileSizeEx(_handle, &size)) {
        return size.QuadPart;
    }
    return 0;
}

bool WindowsFileHandle::flush() {
    CC_ASSERT(_handle != nullptr);
    return FlushFileBuffers(_handle) != 0;
}

bool WindowsFileHandle::close() {
    if (_handle) {
        CloseHandle(_handle);
    }
    return true;
}

}
