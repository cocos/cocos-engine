/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/interfaces/OSInterface.h"

#include <iostream>

namespace cc {

class ISystem : public OSInterface {
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
        BULGARIAN
    };
    enum class OSType {
        WINDOWS,   /**< Windows */
        LINUX,     /**< Linux */
        MAC,       /**< Mac OS X*/
        ANDROIDOS, /**< Android, because ANDROID is a macro, so use ANDROIDOS instead */
        IPHONE,    /**< iPhone */
        IPAD,      /**< iPad */
        OHOS,      /**< Open Harmony OS> */
        QNX,       /**< QNX */
    };
    /**
     @brief Get target system type.
     */
    virtual OSType getOSType() const = 0;

    //
    virtual std::string  getDeviceModel() const         = 0;
    virtual LanguageType getCurrentLanguage() const     = 0;
    virtual std::string  getCurrentLanguageCode() const = 0;
    virtual std::string  getSystemVersion() const       = 0;

    virtual std::string getCurrentLanguageToString();

    /**
     @brief Open url in default browser.
     @param String with url to open.
     @return True if the resource located by the URL was successfully opened; otherwise false.
     */
    virtual bool openURL(const std::string& url) = 0;
    /**
     @brief Create default sytem interface.
     @return sytem interface.
     */
    static OSInterface::Ptr createSystemInterface();

private:
};

} // namespace cc