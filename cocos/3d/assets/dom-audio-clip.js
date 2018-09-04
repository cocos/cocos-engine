import AudioClip from './audio-clip';

export default class DOMAudioClip extends AudioClip {
  constructor() {
    super();
    this.loadMode = AudioClip.DOM_AUDIO;
    this._volume = 1;
    this._loop = false;
    this._currentTimer = 0;
    this._oneShoting = false;

    this._post_play = () => {
      this._state = AudioClip.PLAYING;
      this.emit('started');
    };

    this._on_gesture = () => {
      let promise = this._audio.play();
      if (!promise) {
        console.warn('no promise returned from HTMLMediaElement.play()');
        return;
      }
      promise.then(() => {
        if (this._alreadyDelayed) this._post_play();
        else { this._audio.pause(); this._audio.currentTime = 0; }
        window.removeEventListener('touchend', this._on_gesture);
        document.removeEventListener('mouseup', this._on_gesture);
      });
    };
  }

  setNativeAsset(clip, info) {
    super.setNativeAsset(clip, info);
    clip.volume = this._volume;
    clip.loop = this._loop;
    // callback on audio ended
    clip.addEventListener('ended', () => {
      if (this._oneShoting) return;
      this._state = AudioClip.STOPPED;
      this._audio.currentTime = 0;
      this.emit('ended');
    });
    /* play & stop immediately after receiving a gesture so that
       we can freely invoke play() outside event listeners later */
    window.addEventListener('touchend', this._on_gesture);
    document.addEventListener('mouseup', this._on_gesture);
  }

  play() {
    if (!this._audio || this._state === AudioClip.PLAYING) return;
    let promise = this._audio.play();
    if (!promise) {
      console.warn('no promise returned from HTMLMediaElement.play()');
      return;
    }
    promise.then(this._post_play).catch(() => { this._alreadyDelayed = true; });
  }

  pause() {
    if (this._state !== AudioClip.PLAYING) return;
    this._audio.pause();
    this._state = AudioClip.STOPPED;
    this._oneShoting = false;
  }

  stop() {
    this._audio.currentTime = 0;
    if (this._state !== AudioClip.PLAYING) return;
    this._audio.pause();
    this._state = AudioClip.STOPPED;
    this._oneShoting = false;
  }

  playOneShot(volume = 1) {
    /* HTMLMediaElement doesn't support multiple playback at the
       same time so here we fall back to re-start style approach */
    if (!this._audio) return;
    this._audio.currentTime = 0;
    this._audio.volume = volume;
    if (this._oneShoting) return;
    this._audio.loop = false;
    this._oneShoting = true;
    this._audio.play().then(() => {
      this._audio.addEventListener('ended', () => {
        this._audio.currentTime = 0;
        this._audio.volume = this._volume;
        this._audio.loop = this._loop;
        this._oneShoting = false;
      }, { once: true });
    }).catch(() => { this._oneShoting = false; });
  }

  setCurrentTime(val) {
    if (!this._audio) return;
    this._audio.currentTime = val;
  }

  getCurrentTime() {
    return this._audio ? this._audio.currentTime : 0;
  }

  getDuration() {
    if (!this._audio) return this._duration;
    // ios wechat browser doesn't have duration
    return isNaN(this._audio.duration) ? this._duration : this._audio.duration;
  }

  setVolume(val) {
    this._volume = val;
    /* note this won't work for ios devices, for there
       is just no way to set HTMLMediaElement's volume */
    if (this._audio) this._audio.volume = val;
  }

  getVolume() {
    if (this._audio) return this._audio.volume;
    return this._volume;
  }

  setLoop(val) {
    this._loop = val;
    if (this._audio) this._audio.loop = val;
  }
  
  getLoop() {
    return this._loop;
  }
}
