const EventTarget = require('./jsb-adapter/EventTarget');
const Event = require('./jsb-adapter/Event');

var eventTarget = new EventTarget();

var callbackWrappers = {};
var callbacks = {};
var index = 1;
var callbackWrapper = function(cb) {
    if (!cb)
    	return null;

	var func = function(event) {
		cb({value: event.text})
	};
	cb.___index = index++;
	callbackWrappers[cb.___index] = func;

	return func;
};
var getCallbackWrapper = function(cb) {
	if (cb && cb.___index) {
		var ret = callbackWrappers[cb.___index];
		delete callbackWrappers[cb.___index];
		return ret;
	}
	else
		return null;
};
var removeListener = function(name, cb) {
	if (cb)
	    eventTarget.removeEventListener(name, getCallbackWrapper(cb))
	else {
		// remove all listeners of name
		var cbs = callbacks[name];
		if (! cbs)
			return;

		for (var i = 0, len = cbs.length; i < len; ++i)
			eventTarget.removeEventListener(name, cbs[i]);

		delete callbacks[name];
	}
};
var recordCallback = function(name, cb) {
	if (!cb || !name || name ==='')
		return;

	if (! callbacks[name])
		callbacks[name] = [];

	callbacks[name].push(cb);
}

jsb.inputBox = {
	onConfirm: function(cb) {
		var newCb = callbackWrapper(cb);
		eventTarget.addEventListener('confirm', newCb);
		recordCallback('confirm', newCb);
	},
	offConfirm: function(cb) {
		removeListener('confirm', cb);
	},

	onComplete: function(cb) {
		var newCb = callbackWrapper(cb);
		eventTarget.addEventListener('complete', newCb);
		recordCallback('complete', newCb);
	},
	offComplete: function(cb) {
		removeListener('complete', cb);
	},

	onInput: function(cb) {
		var newCb = callbackWrapper(cb);
		eventTarget.addEventListener('input', newCb);
		recordCallback('input', newCb);
	},
	offInput: function(cb) {
		removeListener('input', cb);
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
};
