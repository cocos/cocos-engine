
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
#include "cocos/core/filesystem/LocalFileSystem.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include "cocos/core/filesystem/windows/WindowsFileSystem.h"
#endif

namespace cc {
ccstd::string LocalFileSystem::getFullPathForDirectoryAndFilename(const ccstd::string& directory, const ccstd::string& filename) const {
    // get directory+filename, safely adding '/' as necessary
    ccstd::string ret = directory;
    if (!directory.empty() && directory[directory.size() - 1] != '/') {
        ret += '/';
    }
    ret += filename;

    // if the file doesn't exist, return an empty string
    if (!existInternal(ret)) {
        ret = "";
    }
    return ret;
}

bool LocalFileSystem::exist(const FilePath& filepath) const {
    CC_ASSERT(!filepath.value().empty());

    if (isAbsolutePath(filepath.value())) {
        return existInternal(filepath);
    }
    ccstd::string fullpath = fullPathForFilename(filepath.value());
    return !fullpath.empty();
}

LocalFileSystem* LocalFileSystem::createLocalFileSystem() {
    return new WindowsFileSystem;
}

}
