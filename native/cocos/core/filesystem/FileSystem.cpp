
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

namespace cc {
FileSystem* FileSystem::_instance = nullptr;

// static 
FileSystem* FileSystem::getInstance() {
    return _instance;
}

FileSystem::FileSystem() {
    _instance = this;
    _localFileSystem.reset(LocalFileSystem::createLocalFileSystem());
}

bool FileSystem::createDirectory(const FilePath& path) {
    return _localFileSystem->createDirectory(path);
}

int64_t FileSystem::getFileSize(const FilePath& filepath) {
    return _localFileSystem->getFileSize(filepath);
}

bool FileSystem::removeFile(const FilePath& filepath) {
    return _localFileSystem->removeFile(filepath);
}

bool FileSystem::renameFile(const FilePath& oldFilepath, const FilePath& newFilepath) {
    return _localFileSystem->renameFile(oldFilepath, newFilepath);
}

BaseFileHandle* FileSystem::open(const FilePath& filepath) {
    return _localFileSystem->open(filepath);
}

bool FileSystem::exist(const FilePath& filepath) const {
    return _localFileSystem->exist(filepath);
}
ccstd::string FileSystem::getWritablePath() const {
    return _localFileSystem->getWritablePath();
}

bool FileSystem::removeDirectory(const FilePath& dirPath) {
    return _localFileSystem->removeDirectory(dirPath);
}

ccstd::string FileSystem::fullPathForFilename(const ccstd::string& dirPath) const {
    return _localFileSystem->fullPathForFilename(dirPath);
}

}
// namespace cc
