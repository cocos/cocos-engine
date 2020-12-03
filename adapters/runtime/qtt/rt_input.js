/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
let rt = loadRuntime();

jsb.inputBox = {
	onConfirm: function(cb) {
		rt.onKeyboardConfirm(cb);
	},
	offConfirm: function(cb) {
		rt.offKeyboardConfirm(cb);
	},

	onComplete: function(cb) {
		rt.onKeyboardComplete(cb);
	},
	offComplete: function(cb) {
		rt.offKeyboardComplete(cb);
	},

	onInput: function(cb) {
		rt.onKeyboardInput(cb);
	},
	offInput: function(cb) {
		rt.offKeyboardInput(cb);
	},

    /**
     * @param {string}		options.defaultValue
     * @param {number}		options.maxLength
     * @param {bool}        options.multiple
     * @param {bool}        options.confirmHold
     * @param {string}      options.confirmType
     * @param {string}      options.inputType
     * 
     * Values of options.confirmType can be [done|next|search|go|send].
     * Values of options.inputType can be [text|email|number|phone|password].
     */
	show: function(options) {
		rt.showKeyboard(options);
	},
	hide: function() {
		rt.hideKeyboard();
	},
};
