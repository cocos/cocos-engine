const _events = new WeakMap();

export default class EventTarget {
    constructor() {
        _events.set(this, {});
    }

    addEventListener(type, listener, options = {}) {
        let events = _events.get(this);

        if(!events) {
            events = {};
            _events.set(this, events);
        }

        if (!events[type]) {
            events[type] = [];
        }
        events[type].push(listener);
  
    }

    removeEventListener(type, listener) {
        const events = _events.get(this);
        if (events) {
            const listeners = events[type];
            if (listeners && listeners.length > 0) {
                for (var i = listeners.length; i--; i > 0) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    dispatchEvent(event = {}) {
        if(typeof event.type !== "string") {
            return;
        }

        if (!_events.get(this)) {
            return ;
        }
        
        const listeners = _events.get(this)[event.type];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                listener.call(this, event);

            }
        }
    }
}