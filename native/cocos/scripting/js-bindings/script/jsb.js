/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//
// JavaScript Bindings helper file
//

// DO NOT ALTER THE ORDER
require('script/jsb_cocos2d.js');
require('script/jsb_common.js');
require('script/jsb_property_impls.js');
require('script/jsb_property_apis.js');
require('script/jsb_create_apis.js');
require('script/extension/jsb_cocos2d_extension.js');

if (window.ccui) {
    require('script/ccui/jsb_cocos2d_ui.js');
    require('script/ccui/jsb_ccui_property_impls.js');
    require('script/ccui/jsb_ccui_property_apis.js');
    require('script/ccui/jsb_ccui_create_apis.js');
}

require('script/jsb_opengl_constants.js');
require('script/jsb_opengl.js');

if (window.sp) {
    require('script/jsb_spine.js');
}

if (window.dragonBones) {
    require('script/jsb_dragonbones.js');
}

require("script/jsb_audioengine.js");
