/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
#include "base/std/container/string.h"
#include "platform/FileUtils.h"

namespace cc {

//! @brief  Helper class to handle file operations
class CC_DLL FileUtilsWin32 : public FileUtils {
public:
    FileUtilsWin32();
    /* override functions */
    bool init();
    ccstd::string getWritablePath() const override;
    bool isAbsolutePath(const ccstd::string &strPath) const override;
    ccstd::string getSuitableFOpen(const ccstd::string &filenameUtf8) const override;
    long getFileSize(const ccstd::string &filepath);

protected:
    bool isFileExistInternal(const ccstd::string &strFilePath) const override;

    /**
    *  Renames a file under the given directory.
    *
    *  @param path     The parent directory path of the file, it must be an absolute path.
    *  @param oldname  The current name of the file.
    *  @param name     The new name of the file.
    *  @return True if the file have been renamed successfully, false if not.
    */
    bool renameFile(const ccstd::string &path, const ccstd::string &oldname, const ccstd::string &name) override;

    /**
    *  Renames a file under the given directory.
    *
    *  @param oldfullpath  The current path + name of the file.
    *  @param newfullpath  The new path + name of the file.
    *  @return True if the file have been renamed successfully, false if not.
    */
    bool renameFile(const ccstd::string &oldfullpath, const ccstd::string &newfullpath) override;

    /**
    *  Checks whether a directory exists without considering search paths and resolution orders.
    *  @param dirPath The directory (with absolute path) to look up for
    *  @return Returns true if the directory found at the given absolute path, otherwise returns false
    */
    bool isDirectoryExistInternal(const ccstd::string &dirPath) const override;

    /**
    *  Removes a file.
    *
    *  @param filepath The full path of the file, it must be an absolute path.
    *  @return True if the file have been removed successfully, false if not.
    */
    bool removeFile(const ccstd::string &filepath) override;

    /**
    *  Creates a directory.
    *
    *  @param dirPath The path of the directory, it must be an absolute path.
    *  @return True if the directory have been created successfully, false if not.
    */
    bool createDirectory(const ccstd::string &dirPath) override;

    /**
    *  Removes a directory.
    *
    *  @param dirPath  The full path of the directory, it must be an absolute path.
    *  @return True if the directory have been removed successfully, false if not.
    */
    bool removeDirectory(const ccstd::string &dirPath) override;

    FileUtils::Status getContents(const ccstd::string &filename, ResizableBuffer *buffer) override;

    /**
     *  Gets full path for filename, resolution directory and search path.
     *
     *  @param filename The file name.
     *  @param searchPath The search path.
     *  @return The full path of the file. It will return an empty string if the full path of the file doesn't exist.
     */
    ccstd::string getPathForFilename(const ccstd::string &filename, const ccstd::string &searchPath) const override;

    /**
     *  Gets full path for the directory and the filename.
     *
     *  @note Only iOS and Mac need to override this method since they are using
     *        `[[NSBundle mainBundle] pathForResource: ofType: inDirectory:]` to make a full path.
     *        Other platforms will use the default implementation of this method.
     *  @param directory The directory contains the file we are looking for.
     *  @param filename  The name of the file.
     *  @return The full path of the file, if the file can't be found, it will return an empty string.
     */
    ccstd::string getFullPathForDirectoryAndFilename(const ccstd::string &directory, const ccstd::string &filename) const override;
};

} // namespace cc
