/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
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
'use strict';

const sys = cc.sys;

sys.getNetworkType = jsb.Device.getNetworkType;
sys.getBatteryLevel = jsb.Device.getBatteryLevel;
sys.garbageCollect = jsb.garbageCollect;
sys.restartVM = __restartVM;
sys.isObjectValid = __isObjectValid;

sys.getSafeAreaRect = function() {
    // x(top), y(left), z(bottom), w(right)
    var edge = jsb.Device.getSafeAreaEdge();
    var screenSize = cc.view.getFrameSize();

    // Get leftBottom and rightTop point in UI coordinates
    var leftBottom = new cc.Vec2(edge.y, screenSize.height - edge.z);
    var rightTop = new cc.Vec2(screenSize.width - edge.w, edge.x);

    // Returns the real location in view.
    var relatedPos = {left: 0, top: 0, width: screenSize.width, height: screenSize.height};
    cc.view.convertToLocationInView(leftBottom.x, leftBottom.y, relatedPos, leftBottom);
    cc.view.convertToLocationInView(rightTop.x, rightTop.y, relatedPos, rightTop);
    // convert view point to design resolution size
    cc.view._convertPointWithScale(leftBottom);
    cc.view._convertPointWithScale(rightTop);

    return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
}
