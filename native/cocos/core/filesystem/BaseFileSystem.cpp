
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

bool BaseFileSystem::isAbsolutePath(const ccstd::string &path) const {
    return (path[0] == '/');
}

void BaseFileSystem::addSearchPath(const ccstd::string &searchpath, bool front) {
    ccstd::string prefix;
    if (!isAbsolutePath(searchpath)) {
        prefix = _defaultResRootPath;
    }

    ccstd::string path = prefix + searchpath;
    if (!path.empty() && path[path.length() - 1] != '/') {
        path += "/";
    }
    if (front) {
        _originalSearchPaths.insert(_originalSearchPaths.begin(), searchpath);
        _searchPathArray.insert(_searchPathArray.begin(), path);
    } else {
        _originalSearchPaths.push_back(searchpath);
        _searchPathArray.push_back(path);
    }
}


ccstd::string BaseFileSystem::getFullPathForDirectoryAndFilename(const ccstd::string &directory, const ccstd::string &filename) const {
    // get directory+filename, safely adding '/' as necessary
    ccstd::string ret = directory;
    if (!directory.empty() && directory[directory.size() - 1] != '/') {
        ret += '/';
    }
    ret += filename;

    // if the file doesn't exist, return an empty string
    if (!exist(ret)) {
        ret = "";
    }
    return ret;
}

ccstd::string BaseFileSystem::getPathForFilename(const ccstd::string &filename, const ccstd::string &searchPath) const {
    ccstd::string file{filename};
    ccstd::string filePath;
    size_t pos = filename.find_last_of('/');
    if (pos != ccstd::string::npos) {
        filePath = filename.substr(0, pos + 1);
        file = filename.substr(pos + 1);
    }

    // searchPath + file_path
    ccstd::string path = searchPath;
    path.append(filePath);

    path = getFullPathForDirectoryAndFilename(path, file);

    return path;
}

ccstd::string BaseFileSystem::fullPathForFilename(const ccstd::string &filename) const {
    if (filename.empty()) {
        return "";
    }

    if (isAbsolutePath(filename)) {
        return filename;
    }
    //if (exist(filename)) {
    //    return filename;
    //}
    // Already Cached ?
    auto cacheIter = _fullPathCache.find(filename);
    if (cacheIter != _fullPathCache.end()) {
        return cacheIter->second;
    }

    ccstd::string fullpath;

    for (const auto &searchIt : _searchPathArray) {
        fullpath = this->getPathForFilename(filename, searchIt);

        if (!fullpath.empty()) {
            // Using the filename passed in as key.
            _fullPathCache.insert(std::make_pair(filename, fullpath));
            return fullpath;
        }
    }

    // The file wasn't found, return empty string.
    return "";
}


}
