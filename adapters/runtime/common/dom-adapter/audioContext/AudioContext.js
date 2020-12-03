import BaseAudioContext from "./BaseAudioContext";
import MediaElementAudioSourceNode from "./MediaElementAudioSourceNode";

class AudioContext extends BaseAudioContext {
    /**
     *
     * @param options 可选的 基于AudioContextOptions字典的对象，包含零个或多个可选属性以配置新上下文。可用属性如下：
        latencyHint 可选的
            上下文将用于的回放类型，作为AudioContextLatencyCategory枚举值或双精度浮点值，指示上下文的首选最大延迟（以秒为单位）。用户代理可能会也可能不会选择满足此请求; AudioContext.baseLatency在创建上下文后检查值以确定真正的延迟。
        sampleRate 可选的
            在sampleRate由使用AudioContext，以每秒的样本指定。该值可以是支持的任何值AudioBuffer。如果未指定，则默认使用上下文输出设备的首选采样率。
     * @example
         let audioCtx = new AudioContext();
         let audioCtx = new AudioContext({
            latencyHint: 'interactive',
            sampleRate: 44100,
        });
     */
    constructor(options) {
        super();

        this.baseLatency; // 只读 返回将AudioContext音频从AudioDestinationNode音频子系统传递到音频子系统所引起的处理延迟的秒数。
        this.outputLatency; // 只读 返回当前音频上下文的输出延迟估计。
    }
    // 关闭音频上下文，释放它使用的任何系统音频资源。
    close() {
        console.log("AudioContext close");
    }

    /**
     * 创建与... MediaElementAudioSourceNode关联HTMLMediaElement。这可用于播放和操纵音频<video>或<audio>元素。
     * @param myMediaElement {HTMLMediaElement}
     */
    createMediaElementSource(myMediaElement) {
        return new MediaElementAudioSourceNode(this, {mediaElement: myMediaElement});
    }
    // 创建MediaStreamAudioSourceNode与MediaStream表示可能来自本地计算机麦克风或其他来源的音频流相关联的。
    createMediaStreamSource() {

    }
    // 创建MediaStreamAudioDestinationNode与MediaStream表示音频流相关联的音频流，该音频流可以存储在本地文件中或发送到另一台计算机。
    createMediaStreamDestination() {

    }
    // 创建MediaStreamTrackAudioSourceNode与MediaStream表示媒体流轨道关联的关联。
    createMediaStreamTrackSource() {

    }
    // 返回AudioTimestamp包含两个相关上下文的音频流位置值的新对象。
    getOutputTimestamp() {

    }
    // 恢复先前已暂停/暂停的音频上下文中的时间进度。
    resume() {

    }
    // 暂停音频上下文中的时间进度，暂时停止音频硬件访问并减少过程中的CPU /电池使用量。
    suspend() {

    }
}

export default AudioContext;