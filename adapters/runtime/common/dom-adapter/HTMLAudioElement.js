import HTMLMediaElement from './HTMLMediaElement';
import Event from './Event';
import _weakMap from "./util/WeakMap"

const _PLAYING = 1;
const _PAUSE = 2;

export default class HTMLAudioElement extends HTMLMediaElement {
    constructor(url) {
        super(url, 'AUDIO');
    }

    get currentTime() {
        let audioID = _weakMap.get(this).audioID;
        if (typeof audioID === "number") {
            return jsb.AudioEngine.getCurrentTime(audioID);
        } else {
            return super.currentTime;
        }
    }

    set currentTime(value) {
        let audioID = _weakMap.get(this).audioID;
        if (typeof audioID === "number") {
            jsb.AudioEngine.setCurrentTime(audioID, value);
        }
        super.currentTime = value;
    }

    get duration() {
        let audioID = _weakMap.get(this).audioID;
        if (typeof audioID === "number") {
            return jsb.AudioEngine.getDuration(audioID);
        } else {
            return super.duration;
        }
    }

    get loop() {
        let audioID = _weakMap.get(this).audioID;
        if (typeof audioID === "number") {
            return jsb.AudioEngine.isLoop(audioID);
        } else {
            return super.loop;
        }
    }

    set loop(value) {
        let audioID = _weakMap.get(this).audioID;
        if (typeof audioID === "number") {
            jsb.AudioEngine.setLoop(audioID, value);
        }
        super.loop = value;
    }

    get volume() {
        let audioID = _weakMap.get(this).audioID;
        if (typeof audioID === "number") {
            return jsb.AudioEngine.getVolume(audioID);
        } else {
            return super.volume;
        }
    }

    set volume(value) {
        let audioID = _weakMap.get(this).audioID;
        if (typeof audioID === "number") {
            jsb.AudioEngine.setVolume(audioID, value);
        }
        super.volume = value;
    }

    canPlayType(mediaType = '') {
        if (typeof mediaType !== 'string') {
            return ''
        }

        if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
            return 'probably'
        }
        return ''
    }

    load() {
        if (this.src !== "") {
            this.dispatchEvent({type: "loadstart"});
            let self = this;
            jsb.AudioEngine.preload(this.src, function () {
                setTimeout(function () {
                    self.dispatchEvent(new Event("loadedmetadata"));
                    self.dispatchEvent(new Event("loadeddata"));
                    self.dispatchEvent(new Event("canplay"));
                    self.dispatchEvent(new Event("canplaythrough"));
                });
            });
        }
    }

    pause() {
        let audioID = _weakMap.get(this).audioID;
        if (audioID !== undefined) {
            if (jsb.AudioEngine.getState(audioID) !== _PAUSE) {
                jsb.AudioEngine.pause(audioID);
                this.dispatchEvent(new Event("pause"));
            } else {
                console.warn("Audio pause: music has been paused.");
            }
        } else {
            console.warn("Audio pause: no music is playing.");
        }
    }

    play() {
        if (this.src === "") {
            this.dispatchEvent({ type: "emptied" });
            console.error("Audio play: please define src before play");
            return;
        }

        let audioID = _weakMap.get(this).audioID;
        if (audioID !== undefined && jsb.AudioEngine.getState(audioID) === _PAUSE) {
            jsb.AudioEngine.resume(audioID);

            this.dispatchEvent(new Event("play"));
            this.dispatchEvent(new Event("playing"));
        } else {
            let self = this;
            audioID = jsb.AudioEngine.play(this.src, this.loop, this.volume);
            if (audioID === -1) {
                this.dispatchEvent(new Event("error"));
                return;
            }
            jsb.AudioEngine.setCurrentTime(audioID, this.currentTime);

            this.dispatchEvent(new Event("play"));
            jsb.AudioEngine.setFinishCallback(audioID, function () {
                _weakMap.get(self).audioID = null;
                self.dispatchEvent(new Event("ended"));
            });
            if (typeof jsb.AudioEngine.setErrorCallback !== "undefined") {
                jsb.AudioEngine.setErrorCallback(audioID, function () {
                    _weakMap.get(self).audioID = null;
                    self.dispatchEvent(new Event("error"));
                });
            }
            if (typeof jsb.AudioEngine.setWaitingCallback !== "undefined") {
                jsb.AudioEngine.setWaitingCallback(audioID, function () {
                    self.dispatchEvent(new Event("waiting"));
                });
            }
            if (typeof jsb.AudioEngine.setCanPlayCallback === "function") {
                jsb.AudioEngine.setCanPlayCallback(audioID, function () {
                    self.dispatchEvent(new Event("canplay"));
                });
            }
            _weakMap.get(this).audioID = audioID;
        }
    }
}
