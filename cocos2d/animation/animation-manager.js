var JS = cc.js;

var AnimationManager = cc.Class({
    ctor: function () {
        this.__instanceId = cc.ClassManager.getNewInstanceId();

        this._anims = new JS.array.MutableForwardIterator([]);

        this._delayEvents = [];
    },

    // for manager

    update: function (dt) {
        var iterator = this._anims;
        var array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            var anim = array[iterator.i];
            if (anim._isPlaying && !anim._isPaused) {
                anim.update(dt);
            }
        }

        try {
            var events = this._delayEvents;
            for (i = 0, l = events.length; i < l; i++) {
                var event = events[i];
                event.target[event.func].apply(event.target, event.args);
            }
        } catch (e) {
            if (Log && Log.Error) {
                Log.Error(e.message);
            } else {
                console.error(e.message);
            }
        }
        events.length = 0;
    },

    destruct: function () {},


    /**
     * @param {AnimationState} anim
     */
    addAnimation: function (anim) {
        var index = this._anims.array.indexOf(anim);
        if (index === -1) {
            this._anims.push(anim);
        }
    },

    /**
     * @param {AnimationState} anim
     */
    removeAnimation: function (anim) {
        var index = this._anims.array.indexOf(anim);
        if (index >= 0) {
            this._anims.fastRemoveAt(index);
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
