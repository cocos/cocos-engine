/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/interfaces/modules/ISystem.h"

namespace cc {

class CC_DLL System : public ISystem {
public:
    /**
     @brief Get target system type.
     */
    OSType getOSType() const override;
    /**
     @brief Get target device model.
     */
    ccstd::string getDeviceModel() const override;
    /**
     @brief Get current language config.
     @return Current language config.
     */
    LanguageType getCurrentLanguage() const override;
    /**
     @brief Get current language iso 639-1 code.
     @return Current language iso 639-1 code.
     */
    ccstd::string getCurrentLanguageCode() const override;
    /**
     @brief Get system version.
     @return system version.
     */
    ccstd::string getSystemVersion() const override;
    /**
     @brief Open url in default browser.
     @param String with url to open.
     @return True if the resource located by the URL was successfully opened; otherwise false.
     */
    bool openURL(const ccstd::string& url) override;
    void copyTextToClipboard(const std::string& text) override;
};

} // namespace cc
