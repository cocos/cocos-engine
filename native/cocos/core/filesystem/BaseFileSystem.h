
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

#pragma once
#include "base/Macros.h"
#include "core/filesystem/FilePath.h"
#include "base/std/container/unordered_map.h"

namespace cc {
class BaseFileHandle;
class CC_DLL BaseFileSystem {
public:
    enum class AccessFlag {
        READ_ONLY  = 0x0000,
        WRITE_ONLY = 0x0001 << 0,
        READ_WRITE = 0x0001 << 1,
        APPEND     = 0x0001 << 2,
    };
    virtual ~BaseFileSystem() = default;
    virtual bool createDirectory(const FilePath& path) = 0;
    virtual bool removeDirectory(const FilePath& path) = 0; 
    virtual bool exist(const FilePath& path) const = 0;
    virtual bool isAbsolutePath(const FilePath& path) const;

    virtual bool removeFile(const FilePath& filepath) = 0;
    virtual bool renameFile(const FilePath& oldFilepath, const FilePath& newFilepath) = 0;
    virtual FilePath getUserAppDataPath() const = 0;

    virtual BaseFileHandle* open(const FilePath& filepath, AccessFlag flag) = 0;
    virtual int64_t getFileSize(const FilePath& filepath) = 0;

    void addSearchPath(const FilePath& searchpath, bool front);
    virtual ccstd::string fullPathForFilename(const FilePath& filename) const;
    ccstd::string getPathForFilename(const FilePath& filename, const FilePath& searchPath) const;
    virtual ccstd::string getFullPathForDirectoryAndFilename(const FilePath& directory, const FilePath& filename) const;

protected:
    /**
     * Writable path.
     */
    ccstd::string _writablePath;

    /**
     *  The full path cache. When a file is found, it will be added into this cache.
     *  This variable is used for improving the performance of file search.
     */
    mutable ccstd::unordered_map<ccstd::string, ccstd::string> _fullPathCache;

    ccstd::string _defaultResRootPath;
    ccstd::vector<ccstd::string> _searchPathArray;
    ccstd::vector<ccstd::string> _originalSearchPaths;
};

}
