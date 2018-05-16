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
#include "base/ccMacros.h"
#include "platform/CCPlatformConfig.h"
#include "platform/CCPlatformDefine.h"

NS_CC_BEGIN

class Scheduler;

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
    
    enum class PixelFormat
    {
        RGB8,
        RGB565,
        RGBA8
    };
    
    enum class DepthFormat
    {
        NONE,                   // no depth and no stencil
        DEPTH_COMPONENT16,
        DEPTH_COMPONENT24,
        DEPTH_COMPONENT32F,
        DEPTH24_STENCIL8,
        DEPTH32F_STENCIL8,
        STENCIL_INDEX8
    };
    
    // This class is useful for internal usage.
    static Application* getInstance() { return _instance; }
    
    Application(const std::string& name);
    virtual ~Application();
    
    virtual bool applicationDidFinishLaunching();
    virtual void applicationDidEnterBackground();
    virtual void applicationWillEnterForeground();
    
    inline void* getView() const { return _view; }
    inline Scheduler* getScheduler() const { return _scheduler; }
    
    void runOnMainThread();
    
    void start();
    
    /**
     * @brief Sets the preferred frame rate for main loop callback.
     * @param fps The preferred frame rate for main loop callback.
     * @js NA
     * @lua NA
     */
    void setPreferredFramesPerSecond(int fps);
    
    void setMultitouch(bool value);
    
    /**
     @brief Get current language config.
     @return Current language config.
     * @js NA
     * @lua NA
     */
    LanguageType getCurrentLanguage() const;
    
    /**
     @brief Get current language iso 639-1 code.
     @return Current language iso 639-1 code.
     * @js NA
     * @lua NA
     */
    std::string getCurrentLanguageCode() const;
    
    /**
     @brief Get target platform.
     * @js NA
     * @lua NA
     */
    Platform getPlatform() const;
    
    /**
     @brief Open url in default browser.
     @param String with url to open.
     @return True if the resource located by the URL was successfully opened; otherwise false.
     * @js NA
     * @lua NA
     */
    bool openURL(const std::string &url);

    std::string getSystemVersion();
    
protected:
    virtual void onCreateView(int& x, int& y, int& width, int& height, 
                              PixelFormat& pixelformat, DepthFormat& depthFormat, int& multisamplingCount);
    
private:
    void createView(const std::string& name);
    
    static Application* _instance;
    
    void* _view = nullptr;
    bool _multiTouch = false;
    void* _delegate = nullptr;
    int _fps = 60;
    Scheduler* _scheduler = nullptr;
};

// end of platform group
/** @} */

NS_CC_END
