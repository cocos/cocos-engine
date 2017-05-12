var JS = cc.js;

var AnimationManager = cc.Class({
    ctor: function () {
        this.__instanceId = cc.ClassManager.getNewInstanceId();

        this._animators = new JS.array.MutableForwardIterator([]);

        this._delayEvents = [];
    },

    // for manager

    update: function (dt) {
        var iterator = this._animators;
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            var animator = array[iterator.i];
            if (animator._isPlaying && !animator._isPaused) {
                animator.update(dt);
            }
        }

        var events = this._delayEvents;
        for (i = 0, l = events.length; i < l; i++) {
            var event = events[i];
            event.target[event.func].apply(event.target, event.args);
        }
        events.length = 0;
    },

    destruct: function () {},

    // for animator

    /**
     * @param {Animator} animator
     */
    addAnimator: function (animator) {
        var index = this._animators.array.indexOf(animator);
        if (index === -1) {
            this._animators.push(animator);
        }
    },

    /**
     * @param {Animator} animator
     */
    removeAnimator: function (animator) {
        var index = this._animators.array.indexOf(animator);
        if (index >= 0) {
            this._animators.fastRemoveAt(index);
        }
        else {
            cc.errorID(3907);
        }
    },

    pushDelayEvent: function (target, func, args) {
        this._delayEvents.push({
            target: target,
            func: func,
            args: args
        });
    }
});


cc.AnimationManager = module.exports = AnimationManager;
