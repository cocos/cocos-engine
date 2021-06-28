/****************************************************************************
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

#pragma once

#include <memory>
#include <string>
#include <thread> // // std::this_thread::sleep_for
#include "base/Macros.h"

#include "base/AutoreleasePool.h"
#include "base/Scheduler.h"
#include "base/TypeDef.h"
#include "bindings/event/EventDispatcher.h"
#include "math/Vec2.h"

#define NANOSECONDS_PER_SECOND 1000000000
#define NANOSECONDS_60FPS      16666667L

namespace cc {
/**
 * @addtogroup platform
 * @{
 */

class CC_DLL Application {
public:
    /** Since WINDOWS and ANDROID are defined as macros, we could not just use these keywords in enumeration(Platform).
     *  Therefore, 'OS_' prefix is added to avoid conflicts with the definitions of system macros.
     */
    enum class Platform {
        WINDOWS,   /**< Windows */
        LINUX,     /**< Linux */
        MAC,       /**< Mac OS X*/
        ANDROIDOS, /**< Android, because ANDROID is a macro, so use ANDROIDOS instead */
        IPHONE,    /**< iPhone */
        IPAD,      /**< iPad */
        OHOS,      /**< Open Harmony OS> */
    };

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

    // This class is useful for internal usage.
    static Application *getInstance() { return Application::instance; }

    Application(int width, int height);
    virtual ~Application();

    virtual bool init();
    virtual void onPause();
    virtual void onResume();
    virtual void onClose();

    void restart() { _needRestart = true; }
    void tick();
    void restartVM();

    inline std::shared_ptr<Scheduler> getScheduler() const { return Application::scheduler; } //NOLINT(readability-convert-member-functions-to-static)
    void close();

    /**
     * @brief Sets the preferred frame rate for main loop callback.
     * @param fps The preferred frame rate for main loop callback.
     */
    void setPreferredFramesPerSecond(int fps);

    /**
     * @brief Get the preferred frame rate for main loop callback.
     */
    inline int getPreferredFramesPerSecond() const { return _fps; }

    inline uint getTotalFrames() const { return _totalFrames; }

    /**
     @brief Get current language config.
     @return Current language config.
     */
    LanguageType getCurrentLanguage() const;

    /**
     @brief Get current language iso 639-1 code.
     @return Current language iso 639-1 code.
     */
    std::string getCurrentLanguageCode() const;

    /**
     @brief Get current display stats.
     @return bool, is displaying stats or not.
     */
    bool isDisplayStats();

    /**
     @brief set display stats information.
     */
    void setDisplayStats(bool isShow);

    /**
     @brief enable/disable(lock) the cursor, default is enabled
     */
    void setCursorEnabled(bool value);

    /**
     @brief Get target platform.
     */
    Platform getPlatform() const;

    /**
     @brief Open url in default browser.
     @param String with url to open.
     @return True if the resource located by the URL was successfully opened; otherwise false.
     */
    bool openURL(const std::string &url);

    void copyTextToClipboard(const std::string &text);

    std::string getSystemVersion();

    // return size in logical pixel unit.
    inline const cc::Vec2 &getViewLogicalSize() const { return _viewLogicalSize; }

private:
    static Application *              instance;
    static std::shared_ptr<Scheduler> scheduler;
    int                               _fps                            = 60;
    int64_t                           _prefererredNanosecondsPerFrame = NANOSECONDS_60FPS;
    uint                              _totalFrames                    = 0;
    cc::Vec2                          _viewLogicalSize;
    bool                              _needRestart = false;
};

// end of platform group
/** @} */

} // namespace cc
