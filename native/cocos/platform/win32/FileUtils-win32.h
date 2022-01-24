/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#ifndef __CC_FILEUTILS_WIN32_H__
#define __CC_FILEUTILS_WIN32_H__

#if CC_PLATFORM == CC_PLATFORM_WINDOWS

    #include "platform/FileUtils.h"
    #include "base/Macros.h"
    #include <string>
    #include <vector>

namespace cc {

/**
 * @addtogroup platform
 * @{
 */

//! @brief  Helper class to handle file operations
class CC_DLL FileUtilsWin32 : public FileUtils {
    friend class FileUtils;
    FileUtilsWin32();

public:
    /* override functions */
    bool init();
    virtual std::string getWritablePath() const override;
    virtual bool isAbsolutePath(const std::string &strPath) const override;
    virtual std::string getSuitableFOpen(const std::string &filenameUtf8) const override;
    virtual long getFileSize(const std::string &filepath);

protected:
    virtual bool isFileExistInternal(const std::string &strFilePath) const override;

    /**
    *  Renames a file under the given directory.
    *
    *  @param path     The parent directory path of the file, it must be an absolute path.
    *  @param oldname  The current name of the file.
    *  @param name     The new name of the file.
    *  @return True if the file have been renamed successfully, false if not.
    */
    virtual bool renameFile(const std::string &path, const std::string &oldname, const std::string &name) override;

    /**
    *  Renames a file under the given directory.
    *
    *  @param oldfullpath  The current path + name of the file.
    *  @param newfullpath  The new path + name of the file.
    *  @return True if the file have been renamed successfully, false if not.
    */
    virtual bool renameFile(const std::string &oldfullpath, const std::string &newfullpath) override;

    /**
    *  Checks whether a directory exists without considering search paths and resolution orders.
    *  @param dirPath The directory (with absolute path) to look up for
    *  @return Returns true if the directory found at the given absolute path, otherwise returns false
    */
    virtual bool isDirectoryExistInternal(const std::string &dirPath) const override;

    /**
    *  Removes a file.
    *
    *  @param filepath The full path of the file, it must be an absolute path.
    *  @return True if the file have been removed successfully, false if not.
    */
    virtual bool removeFile(const std::string &filepath) override;

    /**
    *  Creates a directory.
    *
    *  @param dirPath The path of the directory, it must be an absolute path.
    *  @return True if the directory have been created successfully, false if not.
    */
    virtual bool createDirectory(const std::string &dirPath) override;

    /**
    *  Removes a directory.
    *
    *  @param dirPath  The full path of the directory, it must be an absolute path.
    *  @return True if the directory have been removed successfully, false if not.
    */
    virtual bool removeDirectory(const std::string &dirPath) override;

    virtual FileUtils::Status getContents(const std::string &filename, ResizableBuffer *buffer) override;

    /**
     *  Gets full path for filename, resolution directory and search path.
     *
     *  @param filename The file name.
     *  @param searchPath The search path.
     *  @return The full path of the file. It will return an empty string if the full path of the file doesn't exist.
     */
    virtual std::string getPathForFilename(const std::string &filename, const std::string &searchPath) const override;

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
    virtual std::string getFullPathForDirectoryAndFilename(const std::string &directory, const std::string &filename) const override;
};

// end of platform group
/// @}

} // namespace cc

#endif // CC_PLATFORM == CC_PLATFORM_WINDOWS

#endif // __CC_FILEUTILS_WIN32_H__
