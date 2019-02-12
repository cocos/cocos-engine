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
#include "base/CCRenderTexture.h"

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
    
    Application(const std::string& name, int width, int height);
    virtual ~Application();
    
    virtual bool applicationDidFinishLaunching();
    virtual void applicationDidEnterBackground();
    virtual void applicationWillEnterForeground();
    
    inline void* getView() const { return _view; }
    inline Scheduler* getScheduler() const { return _scheduler.get(); }
    inline RenderTexture* getRenderTexture() const { return _renderTexture; }
    
    void runOnMainThread();
    
    void start();
    void restart();
    void end();

    /**
     * @brief Sets the preferred frame rate for main loop callback.
     * @param fps The preferred frame rate for main loop callback.
     */
    void setPreferredFramesPerSecond(int fps);
    
    void setMultitouch(bool value);
    
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

    void setDevicePixelRatio(uint8_t ratio)
    {
        if (ratio <= 1)
            return;
        
        _devicePixelRatio = ratio;
        _isDownsampleEnabled = true;
        _renderTexture->init(ratio);
    }
    inline uint8_t getDevicePixelRatio() const { return _devicePixelRatio; }
    inline bool isDownsampleEnabled() const { return _isDownsampleEnabled; }
    
    /** The value is (framebuffer size) / (window size), but on iOS, it is special, its value is 1.
     */
    float getScreenScale() const;
    
    GLint getMainFBO() const;
    
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
    
protected:
    virtual void onCreateView(PixelFormat& pixelformat, DepthFormat& depthFormat, int& multisamplingCount);
    
private:
    void createView(const std::string& name, int width, int height);
    
    static Application* _instance;
    static std::shared_ptr<Scheduler> _scheduler;
    
    void* _view = nullptr;
    void* _delegate = nullptr;
    RenderTexture* _renderTexture = nullptr;
    int _fps = 60;
    GLint _mainFBO = 0;

    // The ratio to downsample, for example, if its value is 2,
    // then the rendering size of render texture is device_resolution/2.
    uint8_t _devicePixelRatio = 1;
    bool _multiTouch = false;
    bool _isStarted = false;
    bool _isDownsampleEnabled = false;
};

// end of platform group
/** @} */

NS_CC_END
