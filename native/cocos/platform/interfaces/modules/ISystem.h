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

#include "platform/interfaces/OSInterface.h"

#include <iostream>

namespace cc {

class CC_DLL ISystem : public OSInterface {
public:
    ~ISystem() override;
    enum class LanguageType {
        ENGLISH = 0,
        CHINESE,
        FRENCH,
        ITALIAN,
        GERMAN,
        SPANISH,
        DUTCH,
        RUSSIAN,
        KOREAN,
        JAPANESE,
        HUNGARIAN,
        PORTUGUESE,
        ARABIC,
        NORWEGIAN,
        POLISH,
        TURKISH,
        UKRAINIAN,
        ROMANIAN,
        BULGARIAN,
        HINDI
    };
    enum class OSType {
        WINDOWS,     /**< Windows */
        LINUX,       /**< Linux */
        MAC,         /**< Mac OS X*/
        ANDROIDOS,   /**< Android, because ANDROID is a macro, so use ANDROIDOS instead */
        IPHONE,      /**< iPhone */
        IPAD,        /**< iPad */
        OHOS,        /**< HarmonyOS> */
        OPENHARMONY, /**< OpenHarmony> */
        QNX,         /**< QNX */
    };
    /**
     @brief Get target system type.
     */
    virtual OSType getOSType() const = 0;

    //
    virtual ccstd::string getDeviceModel() const = 0;
    virtual LanguageType getCurrentLanguage() const = 0;
    virtual ccstd::string getCurrentLanguageCode() const = 0;
    virtual ccstd::string getSystemVersion() const = 0;

    virtual ccstd::string getCurrentLanguageToString();

    virtual void copyTextToClipboard(const ccstd::string& text) = 0;
    /**
     @brief Open url in default browser.
     @param String with url to open.
     @return True if the resource located by the URL was successfully opened; otherwise false.
     */
    virtual bool openURL(const ccstd::string& url) = 0;
};

} // namespace cc
