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

#include "VisibleRect.h"
#include "cocos/base/Log.h"

cc::Rect VisibleRect::s_visibleRect;

void VisibleRect::lazyInit() {
    // no lazy init
    // Useful if we change the resolution in runtime
    //    s_visibleRect = cc::Director::getInstance()->getOpenGLView()->getVisibleRect();
    CC_LOG_DEBUG("lazyInit");
}

cc::Rect VisibleRect::getVisibleRect() {
    lazyInit();
    return s_visibleRect;
}

cc::Vec2 VisibleRect::left() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x, s_visibleRect.origin.y + s_visibleRect.size.height / 2);
}

cc::Vec2 VisibleRect::right() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x + s_visibleRect.size.width, s_visibleRect.origin.y + s_visibleRect.size.height / 2);
}

cc::Vec2 VisibleRect::top() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x + s_visibleRect.size.width / 2, s_visibleRect.origin.y + s_visibleRect.size.height);
}

cc::Vec2 VisibleRect::bottom() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x + s_visibleRect.size.width / 2, s_visibleRect.origin.y);
}

cc::Vec2 VisibleRect::center() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x + s_visibleRect.size.width / 2, s_visibleRect.origin.y + s_visibleRect.size.height / 2);
}

cc::Vec2 VisibleRect::leftTop() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x, s_visibleRect.origin.y + s_visibleRect.size.height);
}

cc::Vec2 VisibleRect::rightTop() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x + s_visibleRect.size.width, s_visibleRect.origin.y + s_visibleRect.size.height);
}

cc::Vec2 VisibleRect::leftBottom() {
    lazyInit();
    return s_visibleRect.origin;
}

cc::Vec2 VisibleRect::rightBottom() {
    lazyInit();
    return cc::Vec2(s_visibleRect.origin.x + s_visibleRect.size.width, s_visibleRect.origin.y);
}
