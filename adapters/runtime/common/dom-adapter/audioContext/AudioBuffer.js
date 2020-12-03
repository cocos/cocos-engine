import fileCache from "../util/FileCache";
let ae = jsb.AudioEngine;

class AudioBuffer {
    constructor(context, buffer) {
        this.context = context;

        this.url = "";
        this._sampleRate = 48000;   // 存储在缓冲区中的PCM数据的采样率（以每秒采样数为单位）。
        this._length = 386681;   // 储在缓冲区中的PCM数据的样本帧长度。
        this._duration = 0;   // 表示存储在缓冲区中的PCM数据的持续时间（以秒为单位）。
        this._numberOfChannels = 48000;   // 存储在缓冲区中的PCM数据描述的离散音频通道的数量。

        fileCache.getPath(buffer, function (url) {
            if (!url) {
                return;
            }
            this.url = url;
            ae.preload(url, function (isSucceed, duration) {
                if (isSucceed) {
                    this._duration = duration;
                }
            }.bind(this));
        }.bind(this));
    }

    get sampleRate() {
        return this._sampleRate;
    }

    get length() {
        return this._length;
    }

    get duration() {
        return this._duration;
    }

    get numberOfChannels() {
        return this._numberOfChannels;
    }
}

export default AudioBuffer;