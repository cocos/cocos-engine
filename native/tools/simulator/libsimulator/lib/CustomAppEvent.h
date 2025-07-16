/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

//
//  AppEvent.h
//  Simulator
//
//

#ifndef __Simulator__AppEvent__
#define __Simulator__AppEvent__

#include <string>
// encode / decode json
#include "SimulatorExport.h"
#include "json/document.h"
#include "json/stringbuffer.h"
#include "json/writer.h"

#include "cocos/core/event/EventBus.h"

enum {
    APP_EVENT_MENU = 1,
    APP_EVENT_DROP = 2
};

#define kAppEventName "APP.EVENT"

struct CC_LIBSIM_DLL CustomAppEvent final {
    /** Constructor */
    CustomAppEvent(const std::string &eventName, int type) : eventName(eventName), eventType(type) {}

    std::string eventName;
    std::string dataString;
    int eventType;
    void *menuItem{nullptr};
};

DECLARE_EVENT_BUS(Simulator)
DECLARE_BUS_EVENT_ARG1(SimulatorAppEvent, Simulator, const CustomAppEvent &)

#endif /* defined(__Simulator__AppEvent__) */
