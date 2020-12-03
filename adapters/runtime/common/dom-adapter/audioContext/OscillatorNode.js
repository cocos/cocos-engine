import AudioScheduledSourceNode from "./AudioScheduledSourceNode";
import AudioParam from "./AudioParam";

let types = {"sine":0, "square":0, "sawtooth":0, "triangle":0, "custom":0};

class OscillatorNode extends AudioScheduledSourceNode {
    /**
     * @param context AudioContext的一个引用
     * @param options 可选的 一个对象，其属性指定振荡器节点属性的初始值。从对象中省略的任何属性都将采用记录的
     type
     节点产生的波形。有效值为' sine'，' square'，' sawtooth'，' triangle'和' custom'。默认为' sine'。
     detune
     失谐值（以美分计）将抵消  frequency 给定数量。默认值为0。
     frequency
     周期波形的频率（以赫兹为单位）。默认值为440。
     periodicWave
     由PeriodicWave对象描述的任意周期波形。
     */
    constructor(context, options) {
        super();
        options = options || {};

        // 表示以赫兹为单位的振荡频率的a速率 AudioParam（尽管  AudioParam 返回的是只读的，但它表示的值不是）。默认值为440 Hz（标准中间A音符）。
        this.frequency = new AudioParam({value: this.isNumber(options.frequency) ? options.frequency : 440});
        // 的一个速率 AudioParam表示美分振荡的失谐（虽然  AudioParam 返回是只读的，它代表的值不是）。默认值为0。
        this.detune = new AudioParam({value:this.isNumber(options.detune) ? options.detune : 0});
        // 一个字符串，指定要播放的波形的形状; 这可以是许多标准值之一，或custom使用a PeriodicWave来描述自定义波形。不同的波浪会产生不同的音调。标准值是"sine"，"square"，"sawtooth"，"triangle"和"custom"。默认是"sine"。
        this.type = (options.type in types) ? options.type : "sine";

    }

    /**
     * 设置a PeriodicWave描述要使用的周期波形而不是标准波形之一; 调用它设置type为custom。这取代了现在过时的OscillatorNode.setWaveTable()方法。
     * @param wave {PeriodicWave}
     */
    setPeriodicWave(wave) {

    }

    /**
     * 指定开始播放音调的确切时间。
     * @param when 可选 一个可选的double表示振荡器应该在与AudioContexts currentTime属性相同的坐标系中启动的时间（以秒为单位）。如果未包含或小于某个值currentTime，则振荡器立即开始播放。
     */
    start(when) {

    }

    /**
     * 指定停止播放音调的时间。
     * @param wen 可选 一个可选的双精度表示振荡器停止时的音频上下文时间。如果未包含值，则默认为0。如果时间等于当前音频上下文时间或之前，振荡器将立即停止播放。
     */
    stop(wen) {

    }

}

export default OscillatorNode;