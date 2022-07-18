
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
#include "cocos/platform/filesystem/FileSystem.h"
#include "cocos/platform/filesystem/LocalFileSystem.h"
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include "cocos/platform/android/ResourceFileSystem.h"
    #include "cocos/platform/filesystem/archive-filesystem/ZipFileSystem.h"
    #include "platform/java/jni/JniHelper.h"
    #include "platform/java/jni/JniImp.h"
#elif CC_PLATFORM == CC_PLATFORM_IOS || CC_PLATFORM == CC_PLATFORM_MACOS
    #include "cocos/platform/apple/ResourceFileSystem.h"
#endif

namespace cc {
FileSystem* FileSystem::instance = nullptr;

// static
FileSystem* FileSystem::getInstance() {
    if (!instance) {
        instance = new FileSystem;
    }
    return instance;
}

FileSystem::FileSystem() {
    _localFileSystem.reset(LocalFileSystem::createLocalFileSystem());
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    _subFileSystems.push_back(std::make_unique<ResourceFileSystem>());
    ccstd::string assetsPath(getObbFilePathJNI());
    if (assetsPath.find("/obb/") != ccstd::string::npos) {
        _subFileSystems.push_back(std::make_unique<ZipFileSystem>(FilePath(assetsPath)));
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

bool FileSystem::removeDirectory(const FilePath& path) {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->removeDirectory(path)) {
            return true;
        }
    }
    return _localFileSystem->removeDirectory(path);
}

bool FileSystem::removeFile(const FilePath& filePath) {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->removeFile(filePath)) {
            return true;
        }
    }
    return _localFileSystem->removeFile(filePath);
}

bool FileSystem::renameFile(const FilePath& oldFilePath, const FilePath& newFilePath) {
    for (auto& fileSystem : _subFileSystems) {
        if (fileSystem->renameFile(oldFilePath, newFilePath)) {
            return true;
        }
    }
    return _localFileSystem->renameFile(oldFilePath, newFilePath);
}

int64_t FileSystem::getFileSize(const FilePath& filePath) const {
    for (const auto& fileSystem : _subFileSystems) {
        size_t sz = fileSystem->getFileSize(filePath);
        if (sz > 0) {
            return sz;
        }
    }
    return _localFileSystem->getFileSize(filePath);
}

bool FileSystem::isAbsolutePath(const FilePath& path) const {
    for (const auto& fileSystem : _subFileSystems) {
        // FilePath fullPath = fileSystem->rootPath().append(path);
        if (fileSystem->isAbsolutePath(path)) {
            return true;
        }
    }
    return _localFileSystem->isAbsolutePath(path);
}

bool FileSystem::pathExists(const FilePath& path) const {
    for (const auto& fileSystem : _subFileSystems) {
        if (fileSystem->pathExists(path)) {
            return true;
        }
    }
    return _localFileSystem->pathExists(path);
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

FilePath FileSystem::getUserAppDataPath() const {
    return _localFileSystem->getUserAppDataPath();
}

FilePath FileSystem::fullPathForFilename(const FilePath& filePath) const {
    if (isAbsolutePath(filePath)) {
        return filePath;
    }
    // rootPath + searchPath
    for (const auto& fileSystem : _subFileSystems) {
        FilePath fullPath = fileSystem->rootPath().append(filePath);
        if (fileSystem->pathExists(fullPath)) {
            return fullPath;
        }
    }
    FilePath fullPath = _localFileSystem->rootPath().append(filePath);
    if (_localFileSystem->pathExists(fullPath)) {
        return fullPath;
    }
    return FilePath();
}

void FileSystem::listFiles(const FilePath& path, ccstd::vector<ccstd::string>* files) const {
    for (const auto& fileSystem : _subFileSystems) {
        if (fileSystem->pathExists(path)) {
            fileSystem->listFiles(path, files);
        }
    }
    if (files && files->empty() && _localFileSystem->pathExists(path)) {
        _localFileSystem->listFiles(path, files);
    }
}

void FileSystem::listFilesRecursively(const FilePath& path, ccstd::vector<ccstd::string>* files) const {
    for (const auto& fileSystem : _subFileSystems) {
        if (fileSystem->pathExists(path)) {
            fileSystem->listFiles(path, files);
        }
    }
    if (files && files->empty() && _localFileSystem->pathExists(path)) {
        _localFileSystem->listFilesRecursively(path, files);
    }
}

} // namespace cc
