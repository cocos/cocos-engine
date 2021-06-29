#pragma once
//clang-format off
#include <cstdint>
//clang-format on
#include <rawfile/raw_dir.h>
#include <rawfile/raw_file.h>
#include <rawfile/resource_manager.h>
#include "base/Macros.h"
#include "cocos/platform/FileUtils.h"

namespace cc {

class CC_DLL FileUtilsOHOS : public FileUtils {
public:
    //        FileUtilsOHOS();
    //        virtual ~FileUtilsOHOS();

    static bool initResourceManager(ResourceManager *mgr, const std::string &assetPath, const std::string &moduleName);

    static void setRawfilePrefix(const std::string &prefix);

    static ResourceManager *getResourceManager();

    bool init() override;

    FileUtils::Status getContents(const std::string &filename, ResizableBuffer *buffer) override;

    bool isAbsolutePath(const std::string &strPath) const override;

    std::string getWritablePath() const override;

    std::string expandPath(const std::string &input, bool *isRawFile) const;

    std::pair<int, std::function<void()>> getFd(const std::string &path) const;

private:
    bool isFileExistInternal(const std::string &strFilePath) const override;

    bool isDirectoryExistInternal(const std::string &dirPath) const override;

    /* weak ref, do not need release */
    static ResourceManager *ohosResourceMgr;
    static std::string      ohosAssetPath;

    friend class FileUtils;
};

} // namespace cc
