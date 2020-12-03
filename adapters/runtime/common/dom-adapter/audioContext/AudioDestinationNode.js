import AudioNode from "./AudioNode";

class AudioDestinationNode extends AudioNode {
    /**
     *
     * @param context {BaseAudioContext}
     */
    constructor(context) {
        super(context);

        this.maxChannelCount = 2; // 设备可以处理的最大通道数
    }
}

export default AudioDestinationNode;