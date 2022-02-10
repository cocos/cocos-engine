/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#ifndef __cocos2d_libs__CCEventAssetsManagerEx__
#define __cocos2d_libs__CCEventAssetsManagerEx__

#include <string>
#include "base/RefCounted.h"
#include "extensions/ExtensionExport.h"
#include "extensions/ExtensionMacros.h"

NS_CC_EXT_BEGIN

class AssetsManagerEx;

class CC_EX_DLL EventAssetsManagerEx : public cc::RefCounted {
public:
    //! Update events code
    enum class EventCode {
        ERROR_NO_LOCAL_MANIFEST,
        ERROR_DOWNLOAD_MANIFEST,
        ERROR_PARSE_MANIFEST,
        NEW_VERSION_FOUND,
        ALREADY_UP_TO_DATE,
        UPDATE_PROGRESSION,
        ASSET_UPDATED,
        ERROR_UPDATING,
        UPDATE_FINISHED,
        UPDATE_FAILED,
        ERROR_DECOMPRESS
    };

    inline EventCode getEventCode() const {
        return _code;
    };

    inline int getCURLECode() const {
        return _curle_code;
    };

    inline int getCURLMCode() const {
        return _curlm_code;
    };

    inline std::string getMessage() const {
        return _message;
    };

    inline std::string getAssetId() const {
        return _assetId;
    };

    inline cc::extension::AssetsManagerEx *getAssetsManagerEx() const {
        return _manager;
    };

    bool isResuming() const;

    float getPercent() const;

    float getPercentByFile() const;

    double getDownloadedBytes() const;

    double getTotalBytes() const;

    int getDownloadedFiles() const;

    int getTotalFiles() const;

    /** Constructor */
    EventAssetsManagerEx(const std::string &eventName, cc::extension::AssetsManagerEx *manager, const EventCode &code, std::string assetId = "", std::string message = "", int curleCode = 0, int curlmCode = 0);

private:
    ~EventAssetsManagerEx() override = default;

    EventCode _code;

    cc::extension::AssetsManagerEx *_manager;

    std::string _message;

    std::string _assetId;

    int _curle_code;

    int _curlm_code;
};

NS_CC_EXT_END

#endif /* defined(__cocos2d_libs__CCEventAssetsManagerEx__) */
