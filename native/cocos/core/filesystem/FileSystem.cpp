
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
#include "cocos/core/filesystem/FileSystem.h"
#include "cocos/core/filesystem/LocalFileSystem.h"
#if CC_PLATFORM == CC_PLATFORM_ANDROID
#include "cocos/core/filesystem/android/ResourceFileSystem.h"
#include "cocos/core/filesystem/zipfilesystem/ZipFileSystem.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/JniImp.h"
#endif

namespace cc {
FileSystem* FileSystem::_instance = nullptr;

// static
FileSystem* FileSystem::getInstance() {
    return _instance;
}

FileSystem::FileSystem() {
    _instance = this;
    _localFileSystem.reset(LocalFileSystem::createLocalFileSystem());
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    _subFileSystems.push_back(new ResourceFileSystem);
    std::string assetsPath(getObbFilePathJNI());
    if (assetsPath.find("/obb/") != std::string::npos) {
        _subFileSystems.push_back(new ZipFileSystem(assetsPath));
    }
#endif
}

bool FileSystem::createDirectory(const FilePath& path) {
    for (auto& filesystem : _subFileSystems) {
        if (filesystem->createDirectory(path)) {
            return true;
        }
    }
    return _localFileSystem->createDirectory(path);
}

int64_t FileSystem::getFileSize(const FilePath& filepath) {
    for (auto& filesystem : _subFileSystems) {
        size_t sz = filesystem->getFileSize(filepath);
        if (sz > 0) {
            return sz;
        }
    }
    return _localFileSystem->getFileSize(filepath);
}

bool FileSystem::removeFile(const FilePath& path) {
    for (auto& filesystem : _subFileSystems) {
        if (filesystem->removeFile(path)) {
            return true;
        }
    }
    return _localFileSystem->removeFile(path);
}

bool FileSystem::renameFile(const FilePath& oldFilepath, const FilePath& newFilepath) {
    for (auto& filesystem : _subFileSystems) {
        if (filesystem->renameFile(oldFilepath, newFilepath)) {
            return true;
        }
    }
    return _localFileSystem->renameFile(oldFilepath, newFilepath);
}

BaseFileHandle* FileSystem::open(const FilePath& filepath, AccessFlag flag) {
    for (auto& filesystem : _subFileSystems) {
        BaseFileHandle* fileHandle = filesystem->open(filepath, flag);
        if(fileHandle != nullptr) {
            return fileHandle;
        }
    }
    return _localFileSystem->open(filepath, flag);
}

bool FileSystem::exist(const FilePath& filepath) const {
    for (auto& filesystem : _subFileSystems) {
        if (filesystem->exist(filepath)) {
            return true;
        }
    }
    return _localFileSystem->exist(filepath);
}

FilePath FileSystem::getUserAppDataPath() const {
    return _localFileSystem->getUserAppDataPath();
}

bool FileSystem::removeDirectory(const FilePath& path) {
    for (auto& filesystem : _subFileSystems) {
        if (filesystem->removeDirectory(path)) {
            return true;
        }
    }
    return _localFileSystem->removeDirectory(path);
}

ccstd::string FileSystem::fullPathForFilename(const FilePath& path) const {
    for (auto& filesystem : _subFileSystems) {
        std::string fullpath = filesystem->fullPathForFilename(path);
        if (!fullpath.empty()) {
            return fullpath;
        }
    }
    return _localFileSystem->fullPathForFilename(path);
}

bool FileSystem::isAbsolutePath(const FilePath& path) const {
    for (auto& filesystem : _subFileSystems) {
        if (filesystem->isAbsolutePath(path)) {
            return true;
        }
    }
    return _localFileSystem->isAbsolutePath(path);
}

}
// namespace cc
