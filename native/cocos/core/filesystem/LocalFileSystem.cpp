
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
#include "cocos/core/filesystem/LocalFileHandle.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include "cocos/core/filesystem/windows/WindowsFileSystem.h"
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "cocos/core/filesystem/android/AndroidFileSystem.h"
    #include <sys/stat.h>
#elif (CC_PLATFORM == CC_PLATFORM_MACOS || CC_PLATFORM == CC_PLATFORM_IOS)
    #include "cocos/core/filesystem/apple/AppleFileSystem.h"
#endif

namespace cc {

LocalFileSystem::LocalFileSystem() {
    _searchPathArray.push_back(_defaultResRootPath);
}

LocalFileSystem::~LocalFileSystem() {

}

BaseFileHandle* LocalFileSystem::open(const FilePath& path, AccessFlag flag) {
    std::string assert = "";
    if (flag == AccessFlag::READ_ONLY) {
        assert = "rb";
    } else if (flag == AccessFlag::WRITE_ONLY) {
        assert = "wb";
    } else if (flag == AccessFlag::READ_WRITE) {
        assert = "w+";
    } else if (flag == AccessFlag::APPEND) {
        assert = "ab+";
    }
    FILE* fp = fopen(path.value().c_str(), assert.c_str());
    if(!fp) {
        return nullptr;
    }
    return new LocalFileHandle(fp);
}

bool LocalFileSystem::isAbsolutePath(const FilePath& strPath) const {
    // On Android, there are two situations for full path.
    // 1) Files in APK, e.g. assets/path/path/file.png
    // 2) Files not in APK, e.g. /data/data/org.cocos2dx.hellocpp/cache/path/path/file.png, or /sdcard/path/path/file.png.
    // So these two situations need to be checked on Android.
    return strPath.value()[0] == '/';
}

ccstd::string LocalFileSystem::getFullPathForDirectoryAndFilename(const FilePath& directory, const FilePath&filename) const {
    // get directory+filename, safely adding '/' as necessary
    FilePath ret = directory.append(filename);

    // if the file doesn't exist, return an empty string
    if (!existInternal(ret)) {
        return "";
    }
    return ret.value();
}

bool LocalFileSystem::exist(const FilePath& filepath) const {
    CC_ASSERT(!filepath.value().empty());

    if (isAbsolutePath(filepath.value())) {
        return existInternal(filepath);
    }
    ccstd::string fullpath = fullPathForFilename(filepath.value());
    return !fullpath.empty();
    /*
    struct stat st;
    if (stat(fullpath.c_str(), &st) == 0) {
        #if CC_PLATFORM == CC_PLATFORM_WINDOWS
            #if !defined(S_ISREG) && defined(S_IFMT) && defined(S_IFREG)
                #define S_ISREG(m) (((m)&S_IFMT) == S_IFREG)
            #endif
            #if !defined(S_ISDIR) && defined(S_IFMT) && defined(S_IFDIR)
                #define S_ISDIR(m) (((m)&S_IFMT) == S_IFDIR)
            #endif
            return S_ISDIR(st.st_mode) || S_ISREG(st.st_mode);
        #else
            return S_ISDIR(st.st_mode) || S_ISREG(st.st_mode);
        #endif
    }
    */
    return false;
}

LocalFileSystem* LocalFileSystem::createLocalFileSystem() {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    return new WindowsFileSystem;
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    return new AndroidFileSystem;
#elif (CC_PLATFORM == CC_PLATFORM_MACOS || CC_PLATFORM == CC_PLATFORM_IOS)
    return new AppleFileSystem;
#endif
    return nullptr;
}

}
