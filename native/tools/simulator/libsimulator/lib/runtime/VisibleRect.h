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

#ifndef __VISIBLERECT_H__
#define __VISIBLERECT_H__

#include "cocos/math/Geometry.h"
#include "cocos/math/Vec2.h"
class VisibleRect {
public:
    static cc::Rect getVisibleRect();

    static cc::Vec2 left();
    static cc::Vec2 right();
    static cc::Vec2 top();
    static cc::Vec2 bottom();
    static cc::Vec2 center();
    static cc::Vec2 leftTop();
    static cc::Vec2 rightTop();
    static cc::Vec2 leftBottom();
    static cc::Vec2 rightBottom();

private:
    static void lazyInit();
    static cc::Rect s_visibleRect;
};

#endif /* __VISIBLERECT_H__ */
