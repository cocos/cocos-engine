import EventTarget from "../EventTarget";
import AudioListener from "./AudioListener";
import PeriodicWave from "./PeriodicWave";
import AudioBuffer from "./AudioBuffer";

import DynamicsCompressorNode from "./DynamicsCompressorNode";
import AudioBufferSourceNode from "./AudioBufferSourceNode";
import AudioDestinationNode from "./AudioDestinationNode";
import OscillatorNode from "./OscillatorNode";
import AnalyserNode from "./AnalyserNode";
import PannerNode from "./PannerNode";
import GainNode from "./GainNode";

class BaseAudioContext extends EventTarget {
    constructor() {
        super();

        // 一下属性全为只读
        this.audioWorklet;  // 返回AudioWorklet对象，该对象可用于创建和管理AudioNode实现AudioWorkletProcessor接口的JavaScript代码在后台运行以处理音频数据。
        this.currentTime = 0; // 返回一个double，表示用于调度的不断增加的硬件时间（以秒为单位）。它始于0。
        this.destination = new AudioDestinationNode(this); // 返回AudioDestinationNode表示上下文中所有音频的最终目标。它可以被认为是音频呈现设备。
        this.listener = new AudioListener(this);  // 返回AudioListener用于3D空间化的对象。
        this.sampleRate;    // 返回表示此上下文中所有节点使用的采样率（以每秒采样数为单位）的浮点数。a的采样率AudioContext无法改变。
        this.state = "running"; // 返回的当前状态AudioContext。
    }

    // 创建一个AnalyserNode，可用于公开音频时间和频率数据，例如创建数据可视化。
    createAnalyser() {
        return new AnalyserNode(this);
    }
    // 创建一个BiquadFilterNode，表示二阶滤波器，可配置为几种不同的常见滤波器类型：高通，低通，带通等
    createBiquadFilter() {

    }
    // 创建一个新的空AudioBuffer对象，然后可以通过数据填充并通过AudioBufferSourceNode。
    createBuffer() {

    }
    // 创建一个AudioBufferSourceNode，可用于播放和操作AudioBuffer对象中包含的音频数据。AudioBuffers 在成功解码音频轨道时使用AudioContext.createBuffer或返回创建AudioContext.decodeAudioData。
    createBufferSource() {
        return new AudioBufferSourceNode(this);
    }
    // 创建一个ConstantSourceNode对象，这是一个连续输出单声道（单声道）声音信号的音频源，其声音信号的样本都具有相同的值。
    createConstantSource() {

    }
    // 创建一个ChannelMergerNode，用于将来自多个音频流的通道组合成单个音频流。
    createChannelMerger() {

    }
    // 创建一个ChannelSplitterNode，用于访问音频流的各个通道并单独处理它们。
    createChannelSplitter() {

    }
    // 创建一个OscillatorNode表示周期性波形的源。它基本上会产生一种音调。
    createConvolver() {

    }
    // 创建一个DelayNode，用于将传入的音频信号延迟一定量。此节点还可用于在Web Audio API图中创建反馈循环。
    createDelay() {

    }
    // 创建一个DynamicsCompressorNode，可用于将声压缩应用于音频信号。
    createDynamicsCompressor() {
        return new DynamicsCompressorNode(this);
    }
    // 创建一个GainNode，可用于控制音频图形的整体音量。
    createGain() {
        return new GainNode(this)
    }
    // 创建一个IIRFilterNode，表示可配置为几种不同的常见过滤器类型的二阶过滤器。
    createIIRFilter() {

    }
    // 创建一个OscillatorNode表示周期性波形的源。它基本上会产生一种音调。
    createOscillator() {
        return new OscillatorNode(this);
    }
    // 创建一个PannerNode，用于在3D空间中对传入的音频流进行空间化。
    createPanner() {
        return new PannerNode(this);
    }
    // 创建一个PeriodicWave，用于定义可用于确定输出的周期性波形OscillatorNode。
    createPeriodicWave() {
        return new PeriodicWave(this);
    }
    // 创建一个ScriptProcessorNode，可用于通过JavaScript直接进行音频处理。
    createScriptProcessor() {

    }
    // 创建一个StereoPannerNode，可用于将立体声声像应用于音频源。
    createStereoPanner() {

    }
    // 创建一个WaveShaperNode，用于实现非线性失真效果。
    createWaveShaper() {

    }

    /**
     * 异步解码一个包含的音频文件数据ArrayBuffer。在这种情况下，ArrayBuffer通常是从一个加载XMLHttpRequest的response属性设定后responseType到arraybuffer。此方法仅适用于完整文件，而不适用于音频文件的片段。
     * @param audioData {ArrayBuffer}
     * @param callFunc
     */
    decodeAudioData(audioData, callFunc) {
        callFunc(new AudioBuffer(this, audioData));
    }

    // statechange触发类型事件时运行的事件处理程序。当AudioContext状态发生变化时，由于调用了一种状态变化方法（，或）AudioContext.suspend，就会发生这种情况。AudioContext.resumeAudioContext.close
    onstatechange() {

    }
}

export default BaseAudioContext;