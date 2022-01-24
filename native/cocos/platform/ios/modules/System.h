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

#include "platform/interfaces/modules/ISystem.h"

namespace cc {

class System : public ISystem {
public:
    /**
     * @brief Get target system type.
     */
    OSType getOSType() const override;
    /**
     * @brief Get target device model.
     */
    std::string getDeviceModel() const override;
    /**
     * @brief Get current language config.
     * @return Current language config.
     */
    LanguageType getCurrentLanguage() const override;
    /**
     * @brief Get current language iso 639-1 code.
     * @return Current language iso 639-1 code.
     */
    std::string getCurrentLanguageCode() const override;
    /**
     * @brief Get system version.
     * @return system version.
     */
    std::string getSystemVersion() const override;
    /**
     * @brief Open url in default browser.
     * @param String with url to open.
     * @return True if the resource located by the URL was successfully opened; otherwise false.
     */
    bool openURL(const std::string& url) override;
};

} // namespace cc
