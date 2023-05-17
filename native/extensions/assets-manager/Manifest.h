/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
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

#include <string>
#include <unordered_map>
#include <vector>

#include "base/RefCounted.h"
#include "extensions/ExtensionExport.h"
#include "extensions/ExtensionMacros.h"
#include "network/Downloader.h"
#include "platform/FileUtils.h"

#include "json/document-wrapper.h"

NS_CC_EXT_BEGIN

struct DownloadUnit {
    std::string srcUrl;
    std::string storagePath;
    std::string customId;
    float size;
};

struct ManifestAsset {
    std::string md5;
    std::string path;
    bool compressed;
    float size;
    int downloadState;
};

using DownloadUnits = std::unordered_map<std::string, DownloadUnit>;

class CC_EX_DLL Manifest : public RefCounted {
public:
    friend class AssetsManagerEx;

    //! The type of difference
    enum class DiffType {
        ADDED,
        DELETED,
        MODIFIED
    };

    enum DownloadState {
        UNSTARTED,
        DOWNLOADING,
        SUCCESSED,
        UNMARKED
    };

    //! Asset object
    using Asset = ManifestAsset;

    //! Object indicate the difference between two Assets
    struct AssetDiff {
        Asset asset;
        DiffType type;
    };

    /** @brief Check whether the version informations have been fully loaded
     */
    bool isVersionLoaded() const;

    /** @brief Check whether the manifest have been fully loaded
     */
    bool isLoaded() const;

    /** @brief Gets remote package url.
     */
    const std::string &getPackageUrl() const;

    /** @brief Gets remote manifest file url.
     */
    const std::string &getManifestFileUrl() const;

    /** @brief Gets remote version file url.
     */
    const std::string &getVersionFileUrl() const;

    /** @brief Gets manifest version.
     */
    const std::string &getVersion() const;

    /** @brief Get the search paths list related to the Manifest.
     */
    std::vector<std::string> getSearchPaths() const;

    /** @brief Get the manifest root path, normally it should also be the local storage path.
     */
    const std::string &getManifestRoot() const {
        return _manifestRoot;
    };

    /** @brief Constructor for Manifest class, create manifest by parsing a json file
     * @param manifestUrl Url of the local manifest
     */
    explicit Manifest(const std::string &manifestUrl = "");

    /** @brief Constructor for Manifest class, create manifest by parsing a json string
     * @param content Json string content
     * @param manifestRoot The root path of the manifest file (It should be local path, so that we can find assets path relative to the root path)
     */
    Manifest(const std::string &content, const std::string &manifestRoot);

    /** @brief Parse the manifest file information into this manifest
     * @param manifestUrl Url of the local manifest
     */
    void parseFile(const std::string &manifestUrl);

    /** @brief Parse the manifest from json string into this manifest
     * @param content Json string content
     * @param manifestRoot The root path of the manifest file (It should be local path, so that we can find assets path relative to the root path)
     */
    void parseJSONString(const std::string &content, const std::string &manifestRoot);

    /** @brief Get whether the manifest is being updating
     * @return Updating or not
     */
    bool isUpdating() const {
        return _updating;
    };

    /** @brief Set whether the manifest is being updating
     * @param updating Updating or not
     */
    void setUpdating(bool updating);

protected:
    /** @brief Load the json file into local json object
     * @param url Url of the json file
     */
    void loadJson(const std::string &url);

    /** @brief Load the json from a string into local json object
     * @param content The json content string
     */
    void loadJsonFromString(const std::string &content);

    /** @brief Parse the version file information into this manifest
     * @param versionUrl Url of the local version file
     */
    void parseVersion(const std::string &versionUrl);

    /** @brief Check whether the version of this manifest equals to another.
     * @param b   The other manifest
     * @return Equal or not
     */
    bool versionEquals(const Manifest *b) const;

    /** @brief Check whether the version of this manifest is greater or equals than another.
     * @param b         The other manifest
     * @param [handle]  Customized comparasion handle function
     * @return Greater or not
     */
    bool versionGreaterOrEquals(const Manifest *b, const std::function<int(const std::string &versionA, const std::string &versionB)> &handle) const;

    /** @brief Check whether the version of this manifest is greater or equals than another.
     * @param b         The other manifest
     * @param [handle]  Customized comparasion handle function
     * @return Greater or not
     */
    bool versionGreater(const Manifest *b, const std::function<int(const std::string &versionA, const std::string &versionB)> &handle) const;

    /** @brief Generate difference between this Manifest and another.
     * @param b   The other manifest
     */
    std::unordered_map<std::string, AssetDiff> genDiff(const Manifest *b) const;

    /** @brief Generate resuming download assets list
     * @param units   The download units reference to be modified by the generation result
     */
    void genResumeAssetsList(DownloadUnits *units) const;

    /** @brief Prepend all search paths to the FileUtils.
     */
    void prependSearchPaths();

    void loadVersion(const rapidjson::Document &json);

    void loadManifest(const rapidjson::Document &json);

    void saveToFile(const std::string &filepath);

    static Asset parseAsset(const std::string &path, const rapidjson::Value &json);

    void clear();

    /** @brief Gets all groups.
     */
    const std::vector<std::string> &getGroups() const;

    /** @brief Gets all groups version.
     */
    const std::unordered_map<std::string, std::string> &getGroupVerions() const;

    /** @brief Gets version for the given group.
     * @param group   Key of the requested group
     */
    const std::string &getGroupVersion(const std::string &group) const;

    /** 
     * @brief Gets assets.
     * @lua NA
     */
    const std::unordered_map<std::string, Asset> &getAssets() const;

    /** @brief Set the download state for an asset
     * @param key   Key of the asset to set
     * @param state The current download state of the asset
     */
    void setAssetDownloadState(const std::string &key, const DownloadState &state);

    void setManifestRoot(const std::string &root) {
        _manifestRoot = root;
    };

private:
    //! Indicate whether the version informations have been fully loaded
    bool _versionLoaded;

    //! Indicate whether the manifest have been fully loaded
    bool _loaded;

    //! Indicate whether the manifest is updating and can be resumed in the future
    bool _updating;

    //! Reference to the global file utils
    FileUtils *_fileUtils;

    //! The local manifest root
    std::string _manifestRoot;

    //! The remote package url
    std::string _packageUrl;

    //! The remote path of manifest file
    std::string _remoteManifestUrl;

    //! The remote path of version file [Optional]
    std::string _remoteVersionUrl;

    //! The version of local manifest
    std::string _version;

    //! All groups exist in manifest [Optional]
    std::vector<std::string> _groups;

    //! The versions of all local group [Optional]
    std::unordered_map<std::string, std::string> _groupVer;

    //! The version of local engine
    std::string _engineVer;

    //! Full assets list
    std::unordered_map<std::string, Asset> _assets;

    //! All search paths
    std::vector<std::string> _searchPaths;

    rapidjson::Document _json;
};

NS_CC_EXT_END
