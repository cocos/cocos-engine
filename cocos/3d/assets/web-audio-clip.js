import AudioClip from './audio-clip';

export default class WebAudioClip extends AudioClip {
  constructor(context, app) {
    super();
    this.loadMode = AudioClip.WEB_AUDIO;
    this._currentTimer = 0;
    this._startTime = 0;
    this._offset = 0;
    this._loop = false;
    this._volume = 1;

    this._app = app;
    this._context = context;
    this._sourceNode = this._context.createBufferSource();
    this._gainNode = this._context.createGain();
    this._gainNode.connect(this._context.destination);

    this._on_ended = () => {
      this._offset = 0;
      this._startTime = this._context.currentTime;
      if (this._sourceNode.loop) return;
      this.emit('ended');
      this._state = AudioClip.STOPPED;
    };

    this._do_play = () => {
      this._sourceNode = this._context.createBufferSource();
      this._sourceNode.buffer = this._audio;
      this._sourceNode.loop = this._loop;
      this._sourceNode.connect(this._gainNode);
      this._sourceNode.start(0, this._offset);
      this._state = AudioClip.PLAYING;
      this._startTime = this._context.currentTime;
      // delay eval here to yield uniform behavior with other platforms
      this._app.once('tick', () => { this.emit('started'); });
      /* still not supported by all platforms *
      this._sourceNode.onended = this._on_ended;
      /* doing it manually for now */
      clearInterval(this._currentTimer);
      this._currentTimer = setInterval(() => {
        this._on_ended();
        clearInterval(this._currentTimer);
        if (this._sourceNode.loop) {
          this._currentTimer = setInterval(this._on_ended, this._audio.duration * 1000);
        }
      }, (this._audio.duration - this._offset) * 1000);
    };

    this._on_gesture = () => {
      this._context.resume().then(() => {
        if (this._alreadyDelayed) this._do_play();
        window.removeEventListener('touchend', this._on_gesture);
        document.removeEventListener('mouseup', this._on_gesture);
      });
    };
  }

  setNativeAsset(clip, info) {
    super.setNativeAsset(clip, info);
    if (this._context.state === 'running') return;
    window.addEventListener('touchend', this._on_gesture);
    document.addEventListener('mouseup', this._on_gesture);
  }

  play() {
    if (!this._audio || this._state === AudioClip.PLAYING) return;
    if (this._context.state === 'running') {
      this._do_play();
    } else this._alreadyDelayed = true;
  }

  pause() {
    if (this._state !== AudioClip.PLAYING) return;
    this._sourceNode.stop();
    this._offset += this._context.currentTime - this._startTime;
    this._state = AudioClip.STOPPED;
    clearInterval(this._currentTimer);
  }

  stop() {
    this._offset = 0;
    if (this._state !== AudioClip.PLAYING) return;
    this._sourceNode.stop();
    this._state = AudioClip.STOPPED;
    clearInterval(this._currentTimer);
  }

  playOneShot(volume = 1) {
    if (!this._audio) return;
    let gainNode = this._context.createGain();
    gainNode.connect(this._context.destination);
    gainNode.gain.value = volume;
    let sourceNode = this._context.createBufferSource();
    sourceNode.buffer = this._audio;
    sourceNode.loop = false;
    sourceNode.connect(gainNode);
    sourceNode.start();
  }

  setCurrentTime(val) {
    this._offset = val;
    if (this._state !== AudioClip.PLAYING) return;
    this._sourceNode.stop(); this._do_play();
  }

  getCurrentTime() {
    if (this._state !== AudioClip.PLAYING) return this._offset;
    return this._context.currentTime - this._startTime + this._offset;
  }

  getDuration() {
    return this._audio ? this._audio.duration : 0;
  }

  setVolume(val) {
    this._volume = val;
    if (this._gainNode.gain.setTargetAtTime) {
      this._gainNode.gain.setTargetAtTime(val, this._context.currentTime, 0.01);
    } else {
      this._gainNode.gain.value = val;
    }
  }

  getVolume() {
    return this._volume;
  }

  setLoop(val) {
    this._loop = val;
    this._sourceNode.loop = val;
  }

  getLoop() {
    return this._loop;
  }
}
