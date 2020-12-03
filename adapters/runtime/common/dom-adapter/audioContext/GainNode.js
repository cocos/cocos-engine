import AudioNode from "./AudioNode";
import AudioParam from "./AudioParam";

class GainNode extends AudioNode {
    /**
     * @param context {BaseAudioContext} 音频模块
     * @param options 可选的 可用属性如下：
     *  gain 默认1，可选范围（-∞,+∞）
     */
    constructor(context, options) {
        super(context);

        this._gain = options && options.gain || new AudioParam();
    }

    get gain() {
        return this._gain;
    }
}

export default GainNode;