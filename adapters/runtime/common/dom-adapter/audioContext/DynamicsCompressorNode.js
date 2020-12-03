import AudioNode from "./AudioNode";
import AudioParam from "./AudioParam";

class DynamicsCompressorNode extends AudioNode {
    /**
     *
     * @param context {BaseAudioContext}
     */
    constructor(context) {
        super(context);

        // 是表示压缩将开始生效的分贝值的  k率 AudioParam。
        this._threshold = new AudioParam({
            value: -24,
            defaultValue: -24,
            maxValue: 0,
            minValue: -100
        });

        // 是K-速率 AudioParam包含表示上述其中，该曲线平滑地过渡到压缩部分的阈值的范围内的分贝值。
        this._knee = new AudioParam({
            value: 30,
            defaultValue: 30,
            maxValue: 40,
            minValue: 0
        });

        // 是K-率 AudioParam表示的变化量，以dB为单位，在输入所需的输出1dB的变化。
        this._ratio = new AudioParam({
            value: 12,
            defaultValue: 12,
            maxValue: 20,
            minValue: 1
        });

        // 是float表示压缩器当前应用于信号的增益减少量。
        this._reduction = new AudioParam({
            value: 0,
            defaultValue: 0,
            maxValue: 0,
            minValue: -20
        });

        // 是K-率 AudioParam表示的时间量，以秒为10 dB到降低增益必需的。
        this._attack = new AudioParam({
            value: 0.003,
            defaultValue: 0.003,
            maxValue: 1,
            minValue: 0
        });

        // 是K-率 AudioParam表示的时间量，以秒为10 dB到增加增益要求。
        this._release = new AudioParam({
            value: 0.25,
            defaultValue: 0.25,
            maxValue: 1,
            minValue: 0
        });
    }

    get threshold() {
        return this._threshold;
    }

    get keen() {
        return this._keen;
    }

    get ratio() {
        return this._ratio;
    }

    get reduction() {
        return this._reduction;
    }

    get attack() {
        return this._attack;
    }

    get release() {
        return this._release;
    }
}

export default DynamicsCompressorNode;