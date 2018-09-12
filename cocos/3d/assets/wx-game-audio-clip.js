import AudioClip from './audio-clip';

/**
 * WeChat audio to port. https://developers.weixin.qq.com/minigame/dev/document/media/audio/InnerAudioContext.html
 */
export default class WxGameAudioClip extends AudioClip {
  constructor() {
    super();
    this.loadMode = AudioClip.WX_GAME_AUDIO;
    this._volume = 1;
    this._loop = false;
    this._oneShoting = false;
    this._currentTime = 0.0;
  }

  setNativeAsset(clip, info) {
    // typeof clip === innerAudioContext
    if (!clip) {
      console.warn('There is no audio in the current clip');
      return;
    }

    super.setNativeAsset(clip, info);
    this._initEventsListener();
    clip.volume = this._volume;
    clip.loop = this._loop;
  }

  _initEventsListener() {
    this._audio.onPlay(() => {
      this._state = AudioClip.PLAYING;
      this._currentTime = this._audio.currentTime;
      this.emit('started');
    });

    this._audio.onPause(() => {
      this._state = AudioClip.STOPPED;
      this._oneShoting = false;
    });

    this._audio.onStop(() => {
      this._state = AudioClip.STOPPED;
      this._oneShoting = false;
      this._currentTime = 0;
    });

    this._audio.onEnded(() => {
      this._state = AudioClip.STOPPED;
      this._currentTime = 0;
      this.emit('ended');
      if (this._oneShoting) {
        this._audio.volume = this._volume;
        this._audio.loop = this._loop;
        this._oneShoting = false;
      }
    });
  }

  play() {
    if (!this._audio || this._state === AudioClip.PLAYING) {
      return;
    }

    this._audio.play();
  }

  pause() {
    if (this._state !== AudioClip.PLAYING) {
      return;
    }

    this._audio.pause();
  }

  stop() {
    if (this._state === AudioClip.STOPPED) {
      return;
    }

    this._audio.stop();
  }

  playOneShot(volume = 1) {
    /* HTMLMediaElement doesn't support multiple playback at the
       same time so here we fall back to re-start style cc.gameroach */
    if (!this._audio) return;
    this._audio.volume = volume;
    if (this._oneShoting) return;
    this._audio.loop = false;
    this._oneShoting = true;
    this._audio.play();
  }

  getCurrentTime() {
    return this._currentTime;
  }

  setCurrentTime(val) {
    this._currentTime = val;
    this._audio.seek(this._currentTime);
  }

  getDuration() {
    return this._audio ? this._audio.duration : 0;
  }

  getVolume() {
    return this._audio ? this._audio.volume : this._volume;
  }

  setVolume(val) {
    this._volume = val;
    if (this._audio) this._audio.volume = val;
  }

  getLoop() {
    return this._loop;
  }

  setLoop(val) {
    this._loop = val;
    if (this._audio) this._audio.loop = val;
  }
}