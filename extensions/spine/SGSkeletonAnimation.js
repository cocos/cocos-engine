/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2014 Shengxiang Chen (Nero Chan)
 Copyright (c) 2015-2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var spine = sp.spine;
var animEventType = sp.AnimationEventType;

sp._atlasLoader = {
    spAtlasFile:null,
    setAtlasFile:function(spAtlasFile){
        this.spAtlasFile = spAtlasFile;
    },
    load:function(line){
        var texturePath = cc.path.join(cc.path.dirname(this.spAtlasFile), line);
        var texture = cc.textureCache.addImage(texturePath);
        var tex = new sp.SkeletonTexture({ width: texture.getPixelWidth(), height: texture.getPixelHeight() });
        tex.setRealTexture(texture);
        return tex;
    },
    unload:function(obj){
    }
};


sp.TrackEntryListeners = function(startListener, endListener, completeListener, eventListener, interruptListener, disposeListener){
    this.startListener = startListener || null;
    this.endListener = endListener || null;
    this.completeListener = completeListener || null;
    this.eventListener = eventListener || null;
    this.interruptListener = interruptListener || null;
    this.disposeListener = disposeListener || null;
    this.callback = null;
    this.callbackTarget = null;
    this.skeletonNode = null;
};

var proto = sp.TrackEntryListeners.prototype;
proto.start = function(trackEntry) {
    if (this.startListener) {
        this.startListener(trackEntry);
    }
    if (this.callback) {
        this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, animEventType.START, null, 0);
    }
};

proto.interrupt = function(trackEntry) {
    if (this.interruptListener) {
        this.interruptListener(trackEntry);
    }
    if (this.callback) {
        this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, animEventType.INTERRUPT, null, 0);
    }
};

proto.end = function (trackEntry) {
    if (this.endListener) {
        this.endListener(trackEntry);
    }
    if (this.callback) {
        this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, animEventType.END, null, 0);
    }
};

proto.dispose = function (trackEntry) {
    if (this.disposeListener) {
        this.disposeListener(trackEntry);
    }
    if (this.callback) {
        this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, animEventType.DISPOSE, null, 0);
    }
};

proto.complete = function (trackEntry) {
    var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
    if (this.completeListener) {
        this.completeListener(trackEntry, loopCount);
    }
    if (this.callback) {
        this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, animEventType.COMPLETE, null, loopCount);
    }
};

proto.event = function (trackEntry, event) {
    if (this.eventListener) {
        this.eventListener(trackEntry, event);
    }
    if (this.callback) {
        this.callback.call(this.callbackTarget, this.skeletonNode, trackEntry, animEventType.EVENT, event, 0);
    }
};

sp.TrackEntryListeners.getListeners = function(entry){
    if(!entry.listener){
        entry.listener = new sp.TrackEntryListeners();
    }
    return entry.listener;
};

sp._SGSkeletonAnimation = sp._SGSkeleton.extend({
    _state: null,

    _ownsAnimationStateData: false,
    _listener: null,

    /**
     * Initializes a sp._SGSkeletonAnimation. please do not call this function by yourself, you should pass the parameters to constructor to initialize it.
     * @override
     */
    init: function () {
        sp._SGSkeleton.prototype.init.call(this);
        this._ownsAnimationStateData = true;
        this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data));
    },

    /**
     * Sets animation state data to sp._SGSkeletonAnimation.
     * @param {sp.spine.AnimationStateData} stateData
     */
    setAnimationStateData: function (stateData) {
        var state = new spine.AnimationState(stateData);
        this._listener = new sp.TrackEntryListeners();
        state.rendererObject = this;
        state.addListener(this._listener);
        this._state = state;
    },

    /**
     * Mix applies all keyframe values, interpolated for the specified time and mixed with the current values.  <br/>
     * @param {String} fromAnimation
     * @param {String} toAnimation
     * @param {Number} duration
     */
    setMix: function (fromAnimation, toAnimation, duration) {
        this._state.data.setMixWith(fromAnimation, toAnimation, duration);
    },

    /**
     * Sets event listener of sp._SGSkeletonAnimation.
     * @param {Object} target
     * @param {Function} callback
     */
    setAnimationListener: function (target, callback) {
        this._listener.callbackTarget = target;
        this._listener.callback = callback;
        this._listener.skeletonNode = this;
    },

    /**
     * Set the current animation. Any queued animations are cleared.
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
     * @returns {sp.spine.TrackEntry|null}
     */
    setAnimation: function (trackIndex, name, loop) {
        var animation = this._skeleton.data.findAnimation(name);
        if (!animation) {
            cc.logID(7509, name);
            return null;
        }
        return this._state.setAnimationWith(trackIndex, animation, loop);
    },

    /**
     * Adds an animation to be played delay seconds after the current or last queued animation.
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
     * @param {Number} [delay=0]
     * @returns {sp.spine.TrackEntry|null}
     */
    addAnimation: function (trackIndex, name, loop, delay) {
        delay = delay == null ? 0 : delay;
        var animation = this._skeleton.data.findAnimation(name);
        if (!animation) {
            cc.logID(7510, name);
            return null;
        }
        return this._state.addAnimationWith(trackIndex, animation, loop, delay);
    },

    /**
     * Find animation with specified name
     * @param {String} name
     * @returns {sp.spine.Animation|null}
     */
    findAnimation: function (name) {
        return this._skeleton.data.findAnimation(name);
    },

    /**
     * Returns track entry by trackIndex.
     * @param trackIndex
     * @returns {sp.spine.TrackEntry|null}
     */
    getCurrent: function (trackIndex) {
        return this._state.getCurrent(trackIndex);
    },

    /**
     * Clears all tracks of animation state.
     */
    clearTracks: function () {
        this._state.clearTracks();
    },

    /**
     * Clears track of animation state by trackIndex.
     * @param {Number} trackIndex
     */
    clearTrack: function (trackIndex) {
        this._state.clearTrack(trackIndex);
    },

    /**
     * Update will be called automatically every frame if "scheduleUpdate" is called when the node is "live".
     * It updates animation's state and skeleton's world transform.
     * @param {Number} dt Delta time since last update
     * @override
     */
    update: function (dt) {
        this._super(dt);
        dt *= this._timeScale;
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
        this._state.update(dt);
        this._state.apply(this._skeleton);
        this._skeleton.updateWorldTransform();
        this._renderCmd._updateChild();
    },

    /**
     * Set the start event listener.
     * @param {function} listener
     */
    setStartListener: function(listener){
        this._listener.startListener = listener;
    },

    /**
     * Set the interrupt listener
     * @param {function} listener
     */
    setInterruptListener: function(listener) {
        this._listener.interruptListener = listener;
    },

    /**
     * Set the end event listener.
     * @param {function} listener
     */
    setEndListener: function(listener) {
        this._listener.endListener = listener;
    },

    /**
     * Set the dispose listener
     * @param {function} listener
     */
    setDisposeListener: function(listener) {
        this._listener.disposeListener = listener;
    },

    setCompleteListener: function(listener) {
        this._listener.completeListener = listener;
    },

    setEventListener: function(listener){
        this._listener.eventListener = listener;
    },

    setTrackStartListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).startListener = listener;
    },

    setTrackInterruptListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).interruptListener = listener;
    },

    setTrackEndListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).endListener = listener;
    },

    setTrackDisposeListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).disposeListener = listener;
    },

    setTrackCompleteListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).completeListener = listener;
    },

    setTrackEventListener: function(entry, listener){
        sp.TrackEntryListeners.getListeners(entry).eventListener = listener;
    },

    getState: function(){
        return this._state;
    }
});
