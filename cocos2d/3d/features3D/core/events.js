
cc3d.events = function () {

    var Events = {
        attach: function (target) {
            var ev = cc3d.events;
            target.on = ev.on;
            target.off = ev.off;
            target.fire = ev.fire;
            target.once = ev.once;
            target.hasEvent = ev.hasEvent;
            target.bind = ev.on;
            target.unbind = ev.off;
            return target;
        },

        on: function (name, callback, scope) {
            if (cc3d.type(name) != "string") {
                throw new TypeError("Event name must be a string");
            }
            var callbacks = this._callbacks || (this._callbacks = {});
            var events = callbacks[name] || (callbacks[name] = []);
            events.push({
                callback: callback,
                scope: scope || this
            });

            return this;
        },

        off: function (name, callback, scope) {
            var callbacks = this._callbacks;
            var events;
            var index;

            if (!callbacks) {
                return; // no callbacks at all
            }

            if (!callback) {
                // Clear all callbacks
                callbacks[name] = [];
            } else {
                events = callbacks[name];
                if (!events) {
                    return this;
                }

                for (index = 0; index < events.length; index++) {
                    if (events[index].callback === callback) {
                        if (!scope || (scope === events[index].scope)) {
                            events.splice(index, 1);
                            index--;
                        }
                    }
                }
            }

            return this;
        },

        fire: function (name) {
            var index;
            var length;
            var args;
            var callbacks;

            if (this._callbacks && this._callbacks[name]) {
                length = this._callbacks[name].length;
                if (length) {
                    callbacks = this._callbacks[name].slice(); // clone list so that deleting inside callbacks works
                    var originalIndex = 0;
                    for (index = 0; index < length; ++index) {
                        var scope = callbacks[index].scope;
                        callbacks[index].callback.call(scope, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        if (callbacks[index].callback.once) {
                            this._callbacks[name].splice(originalIndex, 1);
                        } else {
                            originalIndex++;
                        }
                    }
                }
            }

            return this;
        },

        once: function (name, callback, scope) {
            callback.once = true;
            this.on(name, callback, scope);
        },

        hasEvent: function (name) {
            return (this._callbacks !== undefined && this._callbacks[name] !== undefined && this._callbacks[name].length > 0);
        }
    };

    // For compatibility
    Events.bind = Events.on;
    Events.unbind = Events.off;

    return Events;
}();
