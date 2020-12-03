import AudioNode from "./AudioNode";

class AnalyserNode extends AudioNode {
    /**
     * @param context AudioContext 的引用.
     * @param options 可选
        fftSize: 用于频域分析的FFT初始尺寸。默认值是2048。
        maxDecibels: 用于FFT分析的初始最大功率（dB）。默认值是-30。
        minDecibels: 用于FFT分析的初始最小功率（dB）。默认值是-100。
        smoothingTimeConstant: 用于FFT分析的初始平滑常数。默认值是0.8。
     */
    constructor(context, options) {
        super(context);

        this._fftSize; // 一个无符号长整形(unsigned long)的值, 用于确定频域的 FFT (快速傅里叶变换) 的大小。
        this.frequencyBinCount; // 只读 一个无符号长整形(unsigned long)的值, 值为fftSize的一半。这通常等于将要用于可视化的数据值的数量。
        this.minDecibels; // Is a double value representing the minimum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using getByteFrequencyData().
        this.maxDecibels; // Is a double value representing the maximum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the maximum value for the range of results when using getByteFrequencyData().
        this.smoothingTimeConstant; // 是一个双精度浮点型(double)的值，表示最后一个分析帧的平均常数 — 基本上，它随时间使值之间的过渡更平滑。
    }

    /**
     * 将当前频域数据拷贝进Float32Array数组。
     * @param array
     */
    getFloatFrequencyData(array) {
    }

    /**
     * 将当前频域数据拷贝进Uint8Array数组（无符号字节数组）。
     * @param dataArray
     * @returns {Uint8Array}
     */
    getByteFrequencyData(dataArray) {
        return new Uint8Array(dataArray.length);
    }

    /**
     * 将当前波形，或者时域数据拷贝进Float32Array数组。
     * @param dataArray
     */
    getFloatTimeDomainData(dataArray) {

    }

    /**
     * 将当前波形，或者时域数据拷贝进 Uint8Array数组（无符号字节数组）。
     * @param dataArray
     */
    getByteTimeDomainData(dataArray) {

    }

    /**
     * @param value
     */
    set fftSize(value) {
        this._fftSize = value;
        this.frequencyBinCount = value / 2;
    }

    get fftSize() {
        return this._fftSize;
    }

}

export default AnalyserNode;