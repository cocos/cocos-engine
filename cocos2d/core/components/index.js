/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

require('./CCComponent');
require('./CCComponentEventHandler');
require('./missing-script');

// In case subContextView modules are excluded
let WXSubContextView = require('./WXSubContextView');
let SwanSubContextView = require('./SwanSubContextView');

if (!WXSubContextView) {
    WXSubContextView = cc.Class({
        name: 'cc.WXSubContextView',
        extends: cc.Component,
    });
}

if (!SwanSubContextView) {
    SwanSubContextView = cc.Class({
        name: 'cc.SwanSubContextView',
        extends: cc.Component,
    });
}

var components = [
    require('./CCSprite'),
    require('./CCWidget'),
    require('./CCCanvas'),
    require('./CCAudioSource'),
    require('./CCAnimation'),
    require('./CCButton'),
    require('./CCLabel'),
    require('./CCProgressBar'),
    require('./CCMask'),
    require('./CCScrollBar'),
    require('./CCScrollView'),
    require('./CCPageViewIndicator'),
    require('./CCPageView'),
    require('./CCSlider'),
    require('./CCLayout'),
    require('./editbox/CCEditBox'),
    require('./CCLabelOutline'),
    require('./CCLabelShadow'),
    require('./CCRichText'),
    require('./CCToggleContainer'),
    require('./CCToggleGroup'),
    require('./CCToggle'),
    require('./CCBlockInputEvents'),
    require('./CCMotionStreak'),
    WXSubContextView,
    SwanSubContextView,
];

module.exports = components;