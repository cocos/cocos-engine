/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
// @ts-check
import { _decorator } from "../../core/data/index";
import Asset from "../../assets/CCAsset";
import { EventTarget } from "../../core/event/index";
const { ccclass, mixins } = _decorator;

/**
 * @typedef {number} PlayingState
 * @enum {number}
 */
export const PlayingState = {
  INITIALIZING: 0,
  PLAYING: 1,
  STOPPED: 2,
};

/**
 * Enums indicating the load mode of an audio clip
 * @typedef {number} AudioSourceType
 * @enum {number}
 */
export const AudioSourceType = {
  UNKNOWN_AUDIO: -1,

  /**
   * load through Web Audio API interface
   */
  WEB_AUDIO: 0,

  /**
   * load through an audio DOM element
   */
  DOM_AUDIO: 1,

  WX_GAME_AUDIO: 2,
};

/**
 * @typedef {AudioBuffer|HTMLAudioElement|any} AudioSource
 */

/**
 * The base class for audio clip asset.
 * @mixes {EventTarget}
 */
@ccclass('cc.AudioClip')
@mixins(EventTarget)
export class AudioClip extends Asset {
  /**
   * @type {AudioSource}
   */
  _audio = null;

  /**
   * @type {number}
   */
  _duration = 0;

  /**
   * @type { PlayingState }
   */
  _state = PlayingState.INITIALIZING;

  /**
   * @type { AudioSourceType }
   */
  loadMode = AudioSourceType.UNKNOWN_AUDIO;

  /**
   * Set the actual audio clip asset
   * @param {AudioSource} clip
   * @param {Object} info
   */
  setNativeAsset(clip, info) {
    this._audio = clip;
    this._duration = info ? info.length : 0;
    if (clip) {
      super.loaded = true;
      this._state = PlayingState.STOPPED;
    } else {
      super.loaded = false;
      this._state = PlayingState.INITIALIZING;
      this.duration = 0;
    }
  }

  /**
   * Get current state of the clip
   * @return {PlayingState}
   */
  getState() {
    return this._state;
  }
}

cc.AudioClip = AudioClip;