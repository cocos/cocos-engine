const EventTarget = require('./jsb-adapter/EventTarget');
const Event = require('./jsb-adapter/Event');

const eventTarget = new EventTarget();

const callbackWrappers = {};
const callbacks = {};
let index = 1;
const callbackWrapper = function (cb) {
    if (!cb) { return null; }

	const func = function (event) {
		cb({ value: event.text });
	};
	cb.___index = index++;
	callbackWrappers[cb.___index] = func;

	return func;
};
const getCallbackWrapper = function (cb) {
	if (cb && cb.___index) {
		const ret = callbackWrappers[cb.___index];
		delete callbackWrappers[cb.___index];
		return ret;
	} else { return null; }
};
const removeListener = function (name, cb) {
	if (cb) {
		eventTarget.removeEventListener(name, getCallbackWrapper(cb));
	} else {
		// remove all listeners of name
		const cbs = callbacks[name];
		if (!cbs) { return; }

		for (let i = 0, len = cbs.length; i < len; ++i) { eventTarget.removeEventListener(name, cbs[i]); }

		delete callbacks[name];
	}
};
const recordCallback = function (name, cb) {
	if (!cb || !name || name === '') { return; }

	if (!callbacks[name]) { callbacks[name] = []; }

	callbacks[name].push(cb);
};

jsb.inputBox = {
	onConfirm (cb) {
		const newCb = callbackWrapper(cb);
		eventTarget.addEventListener('confirm', newCb);
		recordCallback('confirm', newCb);
	},
	offConfirm (cb) {
		removeListener('confirm', cb);
	},

	onComplete (cb) {
		const newCb = callbackWrapper(cb);
		eventTarget.addEventListener('complete', newCb);
		recordCallback('complete', newCb);
	},
	offComplete (cb) {
		removeListener('complete', cb);
	},

	onInput (cb) {
		const newCb = callbackWrapper(cb);
		eventTarget.addEventListener('input', newCb);
		recordCallback('input', newCb);
	},
	offInput (cb) {
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
	show (options) {
		jsb.showInputBox(options);
	},
	hide () {
		jsb.hideInputBox();
	},
};

jsb.onTextInput = function (eventName, text) {
	const event = new Event(eventName);
	event.text = text;
	eventTarget.dispatchEvent(event);
};
