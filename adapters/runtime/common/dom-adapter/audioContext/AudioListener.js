import AudioNode from "./AudioNode";
import AudioParam from "./AudioParam";

class AudioListener extends AudioNode {
    constructor(context) {
        super(context);

        this.positionX = new AudioParam({value: 0}); // 表示右侧笛卡尔坐标系中侦听器的水平位置。默认值为0。
        this.positionY = new AudioParam({value: 0}); // 表示右手笛卡尔坐标系中侦听器的垂直位置。默认值为0。
        this.positionZ = new AudioParam({value: 0}); // 表示右手笛卡尔坐标系中听者的纵向（前后）位置。默认值为0。
        this.forwardX = new AudioParam({value: 0}); // 表示听者的向前方向在同一笛卡尔的水平位置坐标系统正作为位置（positionX，positionY，和positionZ）值。向前和向上的值彼此线性相关。默认值为0。
        this.forwardY = new AudioParam({value: 0}); // 表示听者的向前方向在同一笛卡尔垂直位置坐标系统正作为位置（positionX，positionY，和positionZ）值。向前和向上的值彼此线性相关。默认值为0。
        this.forwardZ = new AudioParam({value: -1}); // 表示纵向在同一笛卡尔（来回）听者的向前方向的位置坐标系统正作为位置（positionX，positionY，和positionZ）值。向前和向上的值彼此线性相关。默认值为-1。
        this.upX = new AudioParam({value: 0}); // 表示收听者头部的在同一笛卡尔的顶部的水平位置坐标系统正作为位置（positionX，positionY，和positionZ）值。向前和向上的值彼此线性相关。默认值为0。
        this.upY = new AudioParam({value: 1}); // 表示收听者头部的在同一笛卡尔顶部的垂直位置坐标系统正作为位置（positionX，positionY，和positionZ）值。向前和向上的值彼此线性相关。默认值为1。
        this.upZ = new AudioParam({value: 0}); // 表示纵向在同一笛卡尔（来回）收听者头部的顶部的位置坐标系统正作为位置（positionX，positionY，和positionZ）值。向前和向上的值彼此线性相关。默认值为0。
    }

    setOrientation(x, y, z) {
    }

    /**
     * 设置监听器的位置
     * @param x
     * @param y
     * @param z
     */
    setPosition(x, y, z) {
        x = x || 0;
        y = y || 0;
        z = z || 0;

        this.positionX.value = x;
        this.positionY.value = y;
        this.positionZ.value = z;
    }
}

export default AudioListener;