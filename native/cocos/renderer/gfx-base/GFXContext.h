/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "GFXObject.h"

namespace cc {
namespace gfx {

class CC_DLL Context : public Object {
public:
    Context();
    ~Context() override;

    bool initialize(const ContextInfo &info);
    void destroy();

    virtual void present() = 0;

    inline Context * getSharedContext() const { return _sharedContext; }
    inline VsyncMode getVsyncMode() const { return _vsyncMode; }
    inline Format    getColorFormat() const { return _colorFmt; }
    inline Format    getDepthStencilFormat() const { return _depthStencilFmt; }

protected:
    virtual bool doInit(const ContextInfo &info) = 0;
    virtual void doDestroy()                     = 0;

    uintptr_t _windowHandle    = 0;
    Context * _sharedContext   = nullptr;
    VsyncMode _vsyncMode       = VsyncMode::OFF;
    Format    _colorFmt        = Format::UNKNOWN;
    Format    _depthStencilFmt = Format::UNKNOWN;
};

} // namespace gfx
} // namespace cc
