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
const EventTarget = require('./jsb-adapter/EventTarget');
const Event = require('./jsb-adapter/Event');

var eventTarget = new EventTarget();

var callbackMap = {};
var index = 0;
var callbackWrapper = function(cb) {
    if (!cb)
    	return null;

	var func = function(event) {
		cb({value: event.text})
	};

	cb.___index = index++;
	callbackMap[cb.___index] = func;

	return func;
};
var getCallbackWrapper = function(cb) {
	if (cb && cb.___index) {
		var ret = callbackMap[cb.___index];
		delete callbackMap[cb.___index];
		return callbackMap[cb.___index];
	}
	else
		return null;
}

jsb.inputBox = {
	onConfirm: function(cb) {
		eventTarget.addEventListener('confirm', callbackWrapper(cb));
	},
	offConfirm: function(cb) {
		eventTarget.removeEventListener('confirm', getCallbackWrapper(cb));
	},

	onComplete: function(cb) {
		eventTarget.addEventListener('complete', callbackWrapper(cb));
	},
	offComplete: function(cb) {
		eventTarget.removeEventListener('complete', getCallbackWrapper(cb));
	},

	onInput: function(cb) {
		eventTarget.addEventListener('input', callbackWrapper(cb));
	},
	offInput: function(cb) {
		eventTarget.removeEventListener('input', getCallbackWrapper(cb));
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
		jsb.showInputBox(options);
	},
	hide: function() {
		jsb.hideInputBox();
	},
};

jsb.onTextInput = function(eventName, text) {
	var event = new Event(eventName);
	event.text = text;
	eventTarget.dispatchEvent(event);
}
