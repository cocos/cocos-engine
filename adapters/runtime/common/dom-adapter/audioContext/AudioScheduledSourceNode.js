import AudioNode from "./AudioNode";

class AudioScheduledSourceNode extends AudioNode {
    constructor(context) {
        super(context);

    }

    /**
     * ended触发事件时要调用的函数，表示节点已完成播放。
     * @param event
     */
    onended(event) {

    }

    /**
     * TODO 安排节点在指定时间开始播放恒定声音。如果未指定时间，则节点立即开始播放。
     * @param when 可选的 声音开始播放的时间（以秒为单位）。该值在AudioContext与其currentTime属性相同的时间坐标系中指定。值0（或when完全省略参数）会使声音立即开始播放。
     * @param offset 可选的 一个浮点数，指示应该开始播放的音频缓冲区的偏移量（以秒为单位）。如果传递0，则播放将从头开始
     * @param duration 可选的 一个浮点数，表示要播放的持续时间（以秒为单位）。如果没有传递值，则持续时间将等于音频缓冲区的长度减去偏移值
     */
    start(when, offset, duration) {

    }

    /**
     * TODO 安排节点在指定时间停止播放。如果未指定时间，则节点立即停止播放。
     * @param when 可选的 声音停止播放的时间（以秒为单位）。该值在AudioContext与其currentTime属性相同的时间坐标系中指定。省略此参数，指定值0或传递负值会导致声音立即停止播放。
     */
    stop(when) {

    }
}

export default AudioScheduledSourceNode;