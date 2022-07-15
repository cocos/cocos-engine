
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
#include "cocos/core/filesystem/archive-filesystem/ZipFileSystem.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/JniImp.h"
#elif CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_MACOS
#include "cocos/core/filesystem/apple/ResourceFileSystem.h"
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
    _subFileSystems.push_back(std::make_unique<ResourceFileSystem>());
    std::string assetsPath(getObbFilePathJNI());
    if (assetsPath.find("/obb/") != std::string::npos) {
        _subFileSystems.push_back(std::make_unique<ZipFileSystem>(assetsPath));
    }
#elif CC_PLATFORM == CC_PLATFORM_MACOS || CC_PLATFORM == CC_PLATFORM_IOS
    _subFileSystems.push_back(std::make_unique<ResourceFileSystem>());
#endif
    
}

bool FileSystem::createDirectory(const FilePath& path) {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->createDirectory(path)) {
            return true;
        }
    }
    return _localFileSystem->createDirectory(path);
}

bool FileSystem::removeDirectory(const FilePath& filePath) {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->removeDirectory(filePath)) {
            return true;
        }
    }
    return _localFileSystem->removeDirectory(filePath);
}

bool FileSystem::exist(const FilePath& filePath) const {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->exist(filePath)) {
            return true;
        }
    }
    return _localFileSystem->exist(filePath);
}

int64_t FileSystem::getFileSize(const FilePath& filePath) {
    for (auto& fileSystem : _subFileSystems) {
        size_t sz = fileSystem->getFileSize(filePath);
        if (sz > 0) {
            return sz;
        }
    }
    return _localFileSystem->getFileSize(filePath);
}

bool FileSystem::removeFile(const FilePath& path) {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->removeFile(path)) {
            return true;
        }
    }
    return _localFileSystem->removeFile(path);
}

bool FileSystem::renameFile(const FilePath& oldFilepath, const FilePath& newFilepath) {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->renameFile(oldFilepath, newFilepath)) {
            return true;
        }
    }
    return _localFileSystem->renameFile(oldFilepath, newFilepath);
}

std::unique_ptr<IFileHandle> FileSystem::open(const FilePath& filePath, AccessFlag flag) {
    for (auto& fileSystem : _subFileSystems) {
        std::unique_ptr<IFileHandle> fileHandle = fileSystem->open(filePath, flag);
        if (fileHandle != nullptr) {
            return fileHandle;
        }
    }
    return _localFileSystem->open(filePath, flag);
}

bool FileSystem::isAbsolutePath(const FilePath& path) const {
    for (auto& fileSystem : _subFileSystems) {
        // FilePath fullPath = fileSystem->rootPath().append(path);
        if (fileSystem->isAbsolutePath(path)) {
            return true;
        }
    }
    return _localFileSystem->isAbsolutePath(path);
}

FilePath FileSystem::getUserAppDataPath() const {
    return _localFileSystem->getUserAppDataPath();
}

FilePath FileSystem::fullPathForFilename(const FilePath& filePath) const {
    if (isAbsolutePath(filePath)) {
        return filePath;
    }
    // rootPath + searchPath
    for (auto& fileSystem : _subFileSystems) {
        FilePath fullPath = fileSystem->rootPath().append(filePath);
        if (fileSystem->exist(fullPath)) {
            return fullPath;
        }
    }
    FilePath fullPath = _localFileSystem->rootPath().append(filePath);
    if (_localFileSystem->exist(fullPath)) {
        return fullPath;
    }
    return FilePath();
}

void FileSystem::listFiles(const ccstd::string& path, ccstd::vector<ccstd::string>* files) const {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->exist(path)) {
            fileSystem->listFiles(path, files);
        }
    }
    if (files && files->empty() && _localFileSystem->exist(path)) {
        _localFileSystem->listFiles(path,files);
    }
}

void FileSystem::listFilesRecursively(const ccstd::string& path, ccstd::vector<ccstd::string>* files) const {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->exist(path)) {
            fileSystem->listFiles(path, files);
        }
    }
    if (files && files->empty() && _localFileSystem->exist(path)) {
        _localFileSystem->listFilesRecursively(path, files);
    }
}

}
// namespace cc
