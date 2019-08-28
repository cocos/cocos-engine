/****************************************************************************
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

var js = cc.js;

var AnimationManager = cc.Class({
    ctor: function () {
        this._anims = new js.array.MutableForwardIterator([]);
        this._delayEvents = [];

        cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
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

        var events = this._delayEvents;
        for (let i = 0; i < events.length; i++) {
            var event = events[i];
            event.target[event.func].apply(event.target, event.args);
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
