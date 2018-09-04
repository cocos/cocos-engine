import Asset from './asset';
import { EventEmitter } from '../event-sys';

/**
 * Enums indicating the load mode of an audio clip
 * @property {number} WEB_AUDIO load through Web Audio API interface
 * @property {number} DOM_AUDIO load through an audio DOM element
 */
const enums = {
  UNKNOWN_AUDIO: -1,
  WEB_AUDIO: 0,
  DOM_AUDIO: 1,

  INITIALIZING: 0,
  PLAYING: 1,
  STOPPED: 2,
};

/**
 * The base class for audio clip asset
 */
export default class AudioClip extends Asset {
  /**
   * Create an empty asset
   */
  constructor() {
    super();
    this.__initEventEmitter();
    this._audio = null;
    this._state = AudioClip.INITIALIZING;
    this._duration = 0;
    /**
     * Current load mode
     * @type {number}
     */
    this.loadMode = AudioClip.UNKNOWN_AUDIO;
  }

  /**
   * Set the actual audio clip asset
   * @param {AudioBuffer|HTMLAudioElement} clip
   * @param {Obeject} info
   */
  setNativeAsset(clip, info) {
    this._audio = clip;
    this._duration = info ? info.length : 0;
    if (clip) {
      this._loaded = true;
      this._state = AudioClip.STOPPED;
    } else {
      this._loaded = false;
      this._state = AudioClip.INITIALIZING;
      this.duration = 0;
    }
  }

  /**
   * Get current state of the clip
   * @return {number}
   */
  getState() {
    return this._state;
  }
}

Object.assign(AudioClip, enums);
EventEmitter.mixin(AudioClip);
