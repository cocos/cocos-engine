/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
#pragma once

#include <string>
#include <memory>
#include "base/ccMacros.h"
#include "platform/CCPlatformConfig.h"
#include "platform/CCPlatformDefine.h"
#include "scripting/js-bindings/event/EventDispatcher.h"
#include "base/CCScheduler.h"
#include "base/CCAutoreleasePool.h"
#include "math/Vec2.h"

NS_CC_BEGIN
/**
 * @addtogroup platform
 * @{
 */

class CC_DLL Application
{
public:

    /** Since WINDOWS and ANDROID are defined as macros, we could not just use these keywords in enumeration(Platform).
     *  Therefore, 'OS_' prefix is added to avoid conflicts with the definitions of system macros.
     */
    enum class Platform
    {
        WINDOWS,     /**< Windows */
        LINUX,       /**< Linux */
        MAC,         /**< Mac OS X*/
        ANDROIDOS,   /**< Android, because ANDROID is a macro, so use ANDROIDOS instead */
        IPHONE,      /**< iPhone */
        IPAD,        /**< iPad */
    };

    enum class LanguageType
    {
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
    static Application* getInstance() { return _instance; }

    Application(int width, int height);
    virtual ~Application();

    virtual bool init();
    virtual void onPause();
    virtual void onResume();
    
    void tick()
    {
        static std::chrono::steady_clock::time_point prevTime;
        static std::chrono::steady_clock::time_point now;
        static float dt = 0.f;

        prevTime = std::chrono::steady_clock::now();

        _scheduler->update(dt);
        cocos2d::EventDispatcher::dispatchTickEvent(dt);

        PoolManager::getInstance()->getCurrentPool()->clear();

        now = std::chrono::steady_clock::now();
        dt = std::chrono::duration_cast<std::chrono::microseconds>(now - prevTime).count() / 1000000.f;
    }

    inline std::shared_ptr<Scheduler> getScheduler() const { return _scheduler; }

    /**
     * @brief Sets the preferred frame rate for main loop callback.
     * @param fps The preferred frame rate for main loop callback.
     */
    void setPreferredFramesPerSecond(int fps);

    /**
     * @brief Get the preferred frame rate for main loop callback.
     */
    inline int getPreferredFramesPerSecond() const { return _fps; }

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
    inline const cocos2d::Vec2& getViewLogicalSize() const { return _viewLogicalSize; }

private:
    static Application* _instance;
    static std::shared_ptr<Scheduler> _scheduler;
    void* _delegate = nullptr;
    int _fps = 60;
    cocos2d::Vec2 _viewLogicalSize;
};

// end of platform group
/** @} */

NS_CC_END
