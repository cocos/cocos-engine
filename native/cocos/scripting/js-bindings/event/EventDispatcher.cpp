/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
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

#include "EventDispatcher.h"
#include <mutex>

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

namespace cocos2d
{

void EventDispatcher::dispatchTouchEvent(const struct TouchEvent& touchEvent)
{
}

void EventDispatcher::dispatchKeyEvent(int key, int action)
{
}
    
void EventDispatcher::dispatchTickEvent()
{
    auto se = se::ScriptEngine::getInstance();
    static se::Value tickVal;
    static std::chrono::steady_clock::time_point prevTime;
    static std::chrono::steady_clock::time_point now;
    static bool firstTime = true;
    float dt = 0.f;
    if (firstTime)
    {
        se->runScript("src/basic.js", &tickVal);
        firstTime = false;
    }
    
    prevTime = std::chrono::steady_clock::now();
    
    se::ValueArray args;
    args.push_back(se::Value(dt));
    tickVal.toObject()->call(args, nullptr);

    now = std::chrono::steady_clock::now();
    dt = std::chrono::duration_cast<std::chrono::microseconds>(now - prevTime).count() / 1000000.f;
}
    
} // end of namespace cocos2d
