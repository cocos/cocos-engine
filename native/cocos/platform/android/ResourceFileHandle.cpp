
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

#include "cocos/platform/android/ResourceFileHandle.h"
#include "base/Log.h"

namespace cc {

ResourceFileHandle::ResourceFileHandle(AAsset* asset)
: _asset(asset) {
}

ResourceFileHandle::~ResourceFileHandle() {
    if (_asset != nullptr) {
        AAsset_close(_asset);
        _asset = nullptr;
    }
}

bool ResourceFileHandle::seek(int64_t pos, MoveMethod moveMethod) {
    CC_UNUSED_PARAM(pos);
    CC_UNUSED_PARAM(moveMethod);
    return true;
}

int64_t ResourceFileHandle::tell() {
    return 0;
}

bool ResourceFileHandle::read(uint8_t* buffer, int64_t bufferSize) {
    auto size = AAsset_getLength(_asset);
    if (size > bufferSize) {
        size = bufferSize;
    }
    int readSize = AAsset_read(_asset, buffer, size);
    if (readSize < size) {
        return false;
    }
    return true;
}

bool ResourceFileHandle::write(uint8_t* buffer, int64_t bufferSize) {
    CC_UNUSED_PARAM(buffer);
    CC_UNUSED_PARAM(bufferSize);
    assert(false);
    return false;
}

int64_t ResourceFileHandle::size() {
    return AAsset_getLength(_asset);
}

bool ResourceFileHandle::flush() {
    return true;
}

bool ResourceFileHandle::close() {
    return true;
}

} // namespace cc
