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
#include "cocos2d.h"

// encode / decode json
#include "json/document.h"
#include "json/stringbuffer.h"
#include "json/writer.h"
#include "SimulatorExport.h"

#include "cocos/scripting/js-bindings/event/EventDispatcher.h"
#include "cocos/scripting/js-bindings/event/CustomEventTypes.h"

enum
{
    APP_EVENT_MENU = 1,
    APP_EVENT_DROP = 2
};

#define kAppEventName     "APP.EVENT"

class CC_LIBSIM_DLL AppEvent : public cocos2d::CustomEvent
{
public:
    /** Constructor */
    AppEvent(const std::string& eventName, int type);
    
    /** Gets event name */
    inline const std::string& getEventName() const { return _eventName; };
    
    void setEventType(int type);
    int  getEventType();
    void setDataString(std::string data);
    std::string getDataString();
protected:
    std::string _eventName;
    std::string _dataString;
    int         _eventType;
};

#endif /* defined(__Simulator__AppEvent__) */
