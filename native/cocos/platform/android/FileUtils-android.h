/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#ifndef __CC_FILEUTILS_ANDROID_H__
#define __CC_FILEUTILS_ANDROID_H__

#if CC_PLATFORM == CC_PLATFORM_ANDROID

    #include "platform/FileUtils.h"
    #include "base/Macros.h"
    #include <string>
    #include <vector>
    #include "jni.h"
    #include "android/asset_manager.h"

namespace cc {

class ZipFile;

/**
 * @addtogroup platform
 * @{
 */

//! @brief  Helper class to handle file operations
class CC_DLL FileUtilsAndroid : public FileUtils {
    friend class FileUtils;

public:
    FileUtilsAndroid();
    /**
     * @js NA
     * @lua NA
     */
    virtual ~FileUtilsAndroid();

    static void setassetmanager(AAssetManager *a);
    static AAssetManager *getAssetManager() { return assetmanager; }
    static ZipFile *getObbFile() { return obbfile; }

    /* override functions */
    bool init() override;
    virtual FileUtils::Status getContents(const std::string &filename, ResizableBuffer *buffer) override;

    virtual std::string getWritablePath() const override;
    virtual bool isAbsolutePath(const std::string &strPath) const override;

private:
    virtual bool isFileExistInternal(const std::string &strFilePath) const override;
    virtual bool isDirectoryExistInternal(const std::string &dirPath) const override;

    static AAssetManager *assetmanager;
    static ZipFile *obbfile;
};

// end of platform group
/// @}

} // namespace cc

#endif // CC_PLATFORM == CC_PLATFORM_ANDROID

#endif // __CC_FILEUTILS_ANDROID_H__
