// @copyright

// @ts-check
import { _decorator } from "../../core/data/index";
import Asset from "../../assets/CCAsset";
import { EventEmitter } from "";
const { ccclass, property, mixins } = _decorator;

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
};

/**
 * The base class for audio clip asset
 */
@ccclass
@mixins(EventEmitter)
export class AudioClip extends Asset {
  /**
   * @typedef {AudioBuffer|HTMLAudioElement} AudioSource
   */

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
}