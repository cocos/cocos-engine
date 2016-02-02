/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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

var AnimationAnimator = require('../../animation/animation-animator');
var AnimationClip = require('../../animation/animation-clip');

function equalClips (clip1, clip2) {
    if (clip1 === clip2) {
        return true;
    }

    return clip1 && clip2 && (clip1.name === clip2.name || clip1._uuid === clip2._uuid);
}

/**
 * @class Animation
 * @extends CCComponent
 */
var Animation = cc.Class({
    name: 'cc.Animation',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/Animation',
        executeInEditMode: true
    },

    ctor: function () {
        // The actual implement for Animation
        this._animator = null;

        this._nameToState = {};
        this._didInit = false;

        this._currentClip = null;
    },

    properties: {

        _defaultClip: {
            default: null,
            type: AnimationClip,
        },

        /**
         * Animation will play the default clip when start game
         * @property defaultClip
         * @type {AnimationClip}
         */
        defaultClip: {
            type: AnimationClip,
            get: function () {
                return this._defaultClip;
            },
            set: function (value) {
                var engine = cc.engine;
                if (!CC_EDITOR || (engine && engine.isPlaying)) {
                    return;
                }

                this._defaultClip = value;

                var clips = this._clips;

                for (var i = 0, l = clips.length; i < l; i++) {
                    if (equalClips(value, clips[i])) {
                        return;
                    }
                }

                this.addClip(value);
            },
            tooltip: 'i18n:COMPONENT.animation.default_clip'
        },

        /**
         * Current played clip
         * @property currentClip
         * @type {AnimationClip}
         */
        currentClip: {
            get: function () {
                return this._currentClip;
            },
            set: function (value, force) {
                this._currentClip = value;

                if (CC_EDITOR && force && value) {
                    this._updateClip(value);
                }
            },
            type: AnimationClip,
            visible: false
        },

        /**
         * All the clips used in this animation
         * @property _clips
         * @type {AnimationClip[]}
         * @private
         */
        _clips: {
            default: [],
            type: [AnimationClip],
            tooltip: 'i18n:COMPONENT.animation.clips',
            visible: true
        },

        /**
         * Whether the animation should auto play the default clip when start game.
         * @property playOnLoad
         * @type {Boolean}
         * @default true
         */
        playOnLoad: {
            default: false,
            tooltip: 'i18n:COMPONENT.animation.play_on_load'
        }
    },

    onLoad: function () {
        if (CC_EDITOR) return;

        this._init();

        if (this.playOnLoad && this._defaultClip) {
            var state = this.getAnimationState(this._defaultClip.name);
            this._animator.playState(state);
        }
    },

    onDisable: function () {
        this.stop();
    },

    ///////////////////////////////////////////////////////////////////////////////
    // Public Methods
    ///////////////////////////////////////////////////////////////////////////////

    /**
     * Get all the clips used in this animation
     * @method getClips
     * @return {AnimationClip[]}
     */
    getClips: function () {
        return this._clips;
    },

    /**
     * Plays an animation.
     * @method play
     * @param {String} [name] - The name of animation to play. If no name is supplied then the default animation will be played.
     * @param {Number} [startTime] - play an animation from startTime
     * @return {AnimationState} - The AnimationState of playing animation. In cases where the animation can't be played (ie, there is no default animation or no animation with the specified name), the function will return null.
     */
    play: function (name, startTime) {
        this._init();
        var state = this.getAnimationState(name || this._defaultClip.name);
        if (state) {
            var animator = this._animator;

            if (animator.isPlaying && state.isPlaying) {
                if (state.isPaused) {
                    animator.resumeState(state);
                }
                else {
                    animator.stopState(state);
                    animator.playState(state, startTime);
                }
            }
            else {
                animator.playState(state, startTime);
            }

            this.currentClip = state.clip;
        }
        return state;
    },

    /**
     * Stops an animation named name. If no name is supplied then stops all playing animations that were started with this Animation.
     * Stopping an animation also Rewinds it to the Start.
     * @method stop
     * @param {String} [name] - The animation to stop, if not supplied then stops all playing animations.
     */
    stop: function (name) {
        if (!this._didInit) {
            return;
        }
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.stopState(state);
            }
        }
        else {
            this._animator.stop();
        }
    },

    /**
     * Pauses an animation named name. If no name is supplied then pauses all playing animations that were started with this Animation.
     * @method pause
     * @param {String} [name] - The animation to pauses, if not supplied then pauses all playing animations.
     */
    pause: function (name) {
        if (!this._didInit) {
            return;
        }
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.pauseState(state);
            }
        }
        else {
            this._animator.pause();
        }
    },

    /**
     * Resumes an animation named name. If no name is supplied then resumes all paused animations that were started with this Animation.
     * @method pause
     * @param {String} [name] - The animation to resumes, if not supplied then resumes all paused animations.
     */
    resume: function (name) {
        if (!this._didInit) {
            return;
        }
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.resumeState(state);
            }
        }
        else {
            this._animator.resume();
        }
    },

    /**
     * Make an animation named name go to the specified time. If no name is supplied then make all animations go to the specified time.
     * @method setCurrentTime
     * @param {Number} [time] - The time to go to
     * @param {String} [name] - Specified animation name, if not supplied then make all animations go to the time.
     */
    setCurrentTime: function (time, name) {
        this._init();
        if (name) {
            var state = this._nameToState[name];
            if (state) {
                this._animator.setStateTime(state, time);
            }
        }
        else {
            for (var name in this._nameToState) {
                state = this._nameToState[name];
                this._animator.setStateTime(state, time);
            }
        }
    },

    /**
     * Returns the animation state named name. If no animation with the specified name, the function will return null.
     * @method getAnimationState
     * @param {String} name
     * @return {AnimationState}
     */
    getAnimationState: function (name) {
        this._init();
        var state = this._nameToState[name];

        if (CC_EDITOR && !state) {
            this._didInit = false;

            if (this.animator) {
                this.animator.stop();
            }

            this._init();
            state = this._nameToState[name];
        }

        return state || null;
    },

    /**
     * Adds a clip to the animation with name newName. If a clip with that name already exists it will be replaced with the new clip.
     * @method addClip
     * @param {AnimationClip} clip - the clip to add
     * @param {String} [newName]
     * @return {AnimationState} - The AnimationState which gives full control over the animation clip.
     */
    addClip: function (clip, newName) {
        if (!clip) {
            cc.warn('Invalid clip to add');
            return;
        }
        this._init();

        // add clip
        if (!cc.js.array.contains(this._clips, clip)) {
            this._clips.push(clip);
        }

        // replace same name clip
        newName = newName || clip.name;
        var oldState = this._nameToState[newName];
        if (oldState) {
            if (oldState.clip === clip) {
                return oldState;
            }
            else {
                this._clips.splice(this._clips.indexOf(oldState.clip), 1);
            }
        }

        // replace state
        var newState = new cc.AnimationState(clip, newName);
        this._nameToState[newName] = newState;
        return newState;
    },

    _removeStateIfNotUsed: function (state, force) {
        var needRemove = state.clip !== this._defaultClip && !cc.js.array.contains(this._clips, state.clip);
        if (force || needRemove) {
            if (state.isPlaying) {
                this.stop(state.name);
            }
            delete this._nameToState[state.name];
        }
    },

    /**
     * Remove clip from the animation list. This will remove the clip and any animation states based on it.
     * @method removeClip
     * @param {AnimationClip} clip
     * @param {Boolean} force If force is true, then will always remove the clip and any animation states based on it.
     */
    removeClip: function (clip, force) {
        if (!clip) {
            cc.warn('Invalid clip to remove');
            return;
        }
        this._init();

        this._clips = this._clips.filter(function (item) {
            return item !== clip;
        });

        var state;
        for (var name in this._nameToState) {
            state = this._nameToState[name];
            var stateClip = state.clip;
            if (stateClip === clip) {
                this._removeStateIfNotUsed(state, force);
            }
        }
    },

    /**
     * Samples animations at the current state.
     * This is useful when you explicitly want to set up some animation state, and sample it once.
     * @method sample
     */
    sample: function () {
        this._init();
        this._animator.sample();
    },

    ///////////////////////////////////////////////////////////////////////////////
    // Internal Methods
    ///////////////////////////////////////////////////////////////////////////////

    // Dont forget to call _init before every actual process in public methods.
    // Just invoking _init by onLoad is not enough because onLoad is called only if the entity is active.

    _init: function () {
        if (this._didInit) {
            return;
        }
        this._didInit = true;
        this._animator = new AnimationAnimator(this.node, this);
        this._createStates();
    },

    _createStates: function() {
        // create animation states
        var state = null;
        var defaultClipState = false;
        for (var i = 0; i < this._clips.length; ++i) {
            var clip = this._clips[i];
            if (clip) {
                state = new cc.AnimationState(clip);

                if (CC_EDITOR) {
                    this._animator.reloadClip(state);
                }

                this._nameToState[state.name] = state;
                if (equalClips(this._defaultClip, clip)) {
                    defaultClipState = state;
                }
            }
        }
        if (this._defaultClip && !defaultClipState) {
            state = new cc.AnimationState(this._defaultClip);

            if (CC_EDITOR) {
                this._animator.reloadClip(state);
            }

            this._nameToState[state.name] = state;
        }
    },

    _updateClip: (CC_TEST || CC_EDITOR) && function (clip, clipName) {
        this._init();

        clipName = clipName || clip.name;

        var oldState;
        for (var name in this._nameToState) {
            var state = this._nameToState[name];
            var stateClip = state.clip;
            if (equalClips(stateClip, clip)) {
                if (!clip._uuid) clip._uuid = stateClip._uuid;
                oldState = state;
                break;
            }
        }

        if (!oldState) {
            cc.error('Can\'t find state from clip [' + clipName + ']');
            return;
        }

        var clips = this._clips;
        var index = clips.indexOf(oldState.clip);
        clips[index] = clip;

        // clip name changed
        if (oldState.name !== clipName) {
            delete this._nameToState[oldState.name];
            this._nameToState[clipName] = oldState;
            oldState._name = clipName;
        }

        // wrap time when change wrapMode
        if (oldState.wrapMode !== clip.wrapMode) {
            var wrappedInfo = oldState.getWrappedInfo(oldState.time);

            oldState.time = wrappedInfo.time;

            var isNewReverseMode = (clip.wrapMode & cc.WrapMode.Reverse) === cc.WrapMode.Reverse;
            var isOldReverseMode = (oldState.wrapMode & cc.WrapMode.Reverse) === cc.WrapMode.Reverse;

            if (isNewReverseMode !== isOldReverseMode) {
                oldState.time = Math.abs(oldState.time - oldState.duration);
            }
        }


        oldState._clip = clip;
        this._animator.reloadClip(oldState);
    }
});


cc.Animation = module.exports = Animation;
