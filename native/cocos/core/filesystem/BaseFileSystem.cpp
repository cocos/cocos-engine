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
#include "core/filesystem/BaseFileSystem.h"

namespace cc {

bool BaseFileSystem::isAbsolutePath(const FilePath &path) const {
    return (path.value()[0] == '/');
}

void BaseFileSystem::addSearchPath(const FilePath &searchpath, bool front) {
    FilePath rootPath;
    if (!isAbsolutePath(searchpath)) {
        rootPath = _defaultResRootPath;
    }

    FilePath path = rootPath.append(searchpath);
    if (front) {
        _originalSearchPaths.insert(_originalSearchPaths.begin(), searchpath);
        _searchPathArray.insert(_searchPathArray.begin(), path);
    } else {
        _originalSearchPaths.push_back(searchpath);
        _searchPathArray.push_back(path);
    }
}


ccstd::string BaseFileSystem::getFullPathForDirectoryAndFilename(const FilePath &directory, const FilePath &filename) const {
    // get directory+filename, safely adding '/' as necessary
    FilePath path = directory.append(filename);

    // if the file doesn't exist, return an empty string
    if (!exist(path)) {
        return "";
    }
    return path.value();
}

ccstd::string BaseFileSystem::getPathForFilename(const FilePath &filename, const FilePath &searchPath) const {
    // searchPath + file_path
    FilePath path = searchPath.append(filename.dirName());
    path = getFullPathForDirectoryAndFilename(path, filename.baseName());
    return path.value();
}

ccstd::string BaseFileSystem::fullPathForFilename(const FilePath &filename) const {
    if (isAbsolutePath(filename)) {
        return filename.value();
    }
    //if (exist(filename)) {
    //    return filename;
    //}
    // Already Cached ?
    auto cacheIter = _fullPathCache.find(filename.value());
    if (cacheIter != _fullPathCache.end()) {
        return cacheIter->second;
    }

    ccstd::string fullpath;

    for (const auto &searchIt : _searchPathArray) {
        fullpath = this->getPathForFilename(filename, searchIt);

        if (!fullpath.empty()) {
            // Using the filename passed in as key.
            _fullPathCache.insert(std::make_pair(filename.value(), fullpath));
            return fullpath;
        }
    }

    // The file wasn't found, return empty string.
    return "";
}


}
