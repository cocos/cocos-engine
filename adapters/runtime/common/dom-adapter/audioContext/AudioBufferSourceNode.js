import AudioNode from "./AudioNode";
import AudioParam from "./AudioParam";

class AudioBufferSourceNode extends AudioNode {
    /**
     * @param context {AudioContext}
     * @param options Optional
     buffer: AudioBuffer要播放的实例。
     detune: 以美分为单位调整音频流渲染速度的值。它的标称范围是（ - ＆infin;，＆infin;）。默认是0。
     loop: 一个布尔值，指示音频是否应该循环播放。默认是false。如果在回放期间动态修改循环，则新值将对下一个音频处理块生效。
     loopEnd: 一个可选值，以秒为单位，如果循环属性为循环，则循环应该结束true。默认是0。它的值仅限于循环的内容。包含循环的样本帧从值loopStart到loopEnd- （1 / sampleRate）运行。将此值设置为0到缓冲区持续时间之间的值是明智的。如果loopEnd小于0，则循环将结束于0.如果loopEnd大于缓冲区的持续时间，则循环将在缓冲区的末尾结束。通过乘以缓冲区的采样率并舍入到最接近的整数值，将此属性转换为缓冲区内的精确样本帧偏移量。因此，其行为与playbackRate参数的值无关。
     loopStart: 以秒为单位的可选值，如果循环属性为，则循环应该结束true。默认是0。将此值设置为0到缓冲区持续时间之间的值是明智的。如果loopStart小于0，则循环将从0开始。如果loopStart大于缓冲区的持续时间，则循环将从缓冲区的末尾开始。通过乘以缓冲区的采样率并舍入到最接近的整数值，将此属性转换为缓冲区内的精确样本帧偏移量。因此，其行为与playbackRate参数的值无关。
     playbackRate: 呈现音频流的速度。它的默认值是1。该参数是k-rate。这是一个带有detune的复合参数。它的标称范围是（-infinity;到+ infinity;）。
     */
    constructor(context, options) {
        super(context);

        this.buffer = null; // 一个AudioBuffer定义音频资产被播放时，或当设置为值null，定义的沉默的单个信道（其中每个样本是0.0）。

        this.detune = new AudioParam({value: 0}); // 是K-率 AudioParam表示的播放失谐美分。该值与playbackRate确定播放声音的速度相结合。它的默认值是0（意味着没有失谐），其标称范围是-∞到∞。
        this._loop = false; // 一个布尔属性，指示在到达结尾时是否必须重播音频资产AudioBuffer。它的默认值是false。
        this.loopStart = 0; // 可选的 一个浮点值，指示AudioBuffer必须在何时开始播放的时间（以秒loop为单位）true。它的默认值是0（意味着在每个循环开始时，播放从音频缓冲区的开始处开始）。
        this.loopEnd = 0; // 可选的 一个浮点数，表示AudioBuffer停止和循环回放到指示时间的时间（以秒为单位）loopStart，如果loop是true。默认值为0。
        this._playbackRate = new AudioParam({value: 1.0}); // 的一个速率 AudioParam限定的速度因子在该音频资产将播放，其中值1.0是声音的自然采样率。由于没有对输出应用音调校正，因此可以使用它来改变样本的音高。该值与复合detune以确定最终回放速率。

        this.audioEngine = jsb.AudioEngine;
        this.audioID = -1;
    }

    /**
     * 用于安排缓冲区中包含的音频数据的播放，或立即开始播放。
     * @param when 可选的
     * @param offset 可选的
     * @param duration 可选的
     */
    start(when, offset, duration) {
        if(!this.buffer) {
            return;
        }
        let audioEngine = this.audioEngine;

        if(this.audioID !== -1) {
            audioEngine.stop(this.audioID);
        }
        let audioID = this.audioID = audioEngine.play(this.buffer.url, this.loop, 1);
        audioEngine.setFinishCallback(audioID, this.onended);
        audioEngine.setCurrentTime(audioID, this.loopStart);
    }

    /**
     * 声音安排在指定的时间停止播放。如果没有指定时间，声音将立即停止播放。
     * @param when
     */
    stop(when) {
        let audioEngine = this.audioEngine;
        if(this.audioID === -1) {
            return;
        }
        audioEngine.stop(this.audioID);
        this.audioID = -1;
    }

    onended() {

    }

    set playbackRate(value) {
        console.warn("playbackRate nonsupport");
        this._playbackRate = value;
    }

    get playbackRate() {
        return this._playbackRate;
    }

    set loop(value) {
        let audioEngine = this.audioEngine;
        let audioID = this.audioID;
        let loop = !!value;

        if(audioID !== -1 && audioEngine) {
            audioEngine.setLoop(audioID, loop);
        }
        this._loop = loop;
    }

    get loop() {
        return this._loop;
    }

}

export default AudioBufferSourceNode;