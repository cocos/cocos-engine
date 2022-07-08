#pragma once
//clang-format off
#include <cstdint>
//clang-format on
#include <rawfile/raw_dir.h>
#include <rawfile/raw_file.h>
#include <rawfile/raw_file_manager.h>
#include "base/Macros.h"
#include "cocos/platform/FileUtils.h"
#include <napi/native_api.h>

class NativeResourceManager;

namespace cc {

class CC_DLL FileUtilsOpenHarmony : public FileUtils {
public:
    //        FileUtilsOpenHarmony();
     ~FileUtilsOpenHarmony() override;
    static bool initResourceManager(napi_env env, napi_value info);

    static void setRawfilePrefix(const std::string &prefix);

    bool init() override;

    bool isAbsolutePath(const std::string &strPath) const override;

    std::string getWritablePath() const override;

    std::string expandPath(const std::string &input, bool *isRawFile) const;

    std::pair<int, std::function<void()>> getFd(const std::string &path) const;
    
    long getFileSize(const std::string &filepath) override;

    std::string getSuitableFOpen(const std::string &filenameUtf8) const override;

    FileUtils::Status getContents(const std::string &filename, ResizableBuffer *buffer) override;
    
    FileUtils::Status getRawFileDescriptor(const std::string &filename,RawFileDescriptor& descriptor);

private:
    bool isFileExistInternal(const std::string &strFilePath) const override;

    bool isDirectoryExistInternal(const std::string &dirPath) const override;

    friend class FileUtils;
    static NativeResourceManager* _nativeResourceManager;
};

} // namespace cc
