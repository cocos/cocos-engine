import AudioNode from "./AudioNode"
import AudioParam from "./AudioParam"

class PannerNode extends AudioNode {
    /**
     * @param context {BaseAudioContext} 音频上下文
     * @param options {=} 可选
     panningModel：PannerNode.panningModel你想要的PannerNode（默认是equalpower。）
     distanceModel：PannerNode.distanceModel你想要的PannerNode（默认是inverse。）
     positionX：PannerNode.positionX你想要的PannerNode（默认是0。）
     positionY：PannerNode.positionY你想要的PannerNode（默认是0。）
     positionZ：PannerNode.positionZ你想要的PannerNode（默认是0。）
     orientationX：PannerNode.orientationX你想要的PannerNode（默认是1。）
     orientationY：PannerNode.orientationY你想要的PannerNode（默认是0。）
     orientationZ：PannerNode.orientationZ你想要的PannerNode（默认是0。）
     refDistance：PannerNode.refDistance你想PannerNode拥有的。默认值为1，且不允许使用负值。
     maxDistance：PannerNode.maxDistance你想PannerNode拥有的。默认值为10000，且不允许使用非正值。
     rollOffFactor：PannerNode.rollOffFactor你想PannerNode拥有的。默认值为1，且不允许使用负值。
     coneInnerAngle：PannerNode.coneInnerAngle你想要的PannerNode（默认是360。）
     coneOuterAngle：PannerNode.coneOuterAngle你想要的PannerNode（默认是360。）
     coneOuterGain：PannerNode.coneOuterGain你想PannerNode拥有的。默认值为0，其值可以在0-1范围内。
     */
    constructor(context, options) {
        super(context);

        this.coneInnerAngle = 360; //是一个双重值，用于描述锥体内部的角度（以度为单位），其内部不会减小体积。
        this.coneOuterAngle = 360; // 一个双重值，用于描述锥体的角度（以度为单位），其外部的体积将减少一个由coneOuterGain属性定义的常数值。
        this.coneOuterGain = 0; // 描述coneOuterAngle属性定义的圆锥体外体积减少量的双精度值。它的默认值是0，意味着听不到声音。
        this.distanceModel = "inverse"; // 枚举值，用于确定在远离侦听器时用于减小音频源音量的算法。
        this.maxDistance = 10000; // 一个double值，表示音频源和收听者之间的最大距离，之后音量不会进一步降低。
        this.orientationX = new AudioParam({value: 1}); // 表示右侧笛卡尔坐标系中音频源矢量的水平位置。虽然这AudioParam不能直接更改，但可以使用其value属性更改其值。默认值为1。
        this.orientationY = new AudioParam({value: 0}); // 表示右侧笛卡尔坐标系中音频源矢量的垂直位置。默认值为0.虽然AudioParam无法直接更改，但可以使用其value属性更改其值。默认值为0。
        this.orientationZ = new AudioParam({value: 0}); // 表示右侧笛卡尔坐标系中音频源矢量的纵向（前后）位置。默认值为0.虽然AudioParam无法直接更改，但可以使用其value属性更改其值。默认值为0。
        this.panningModel = "equalpower"; // 枚举值，用于确定用于在3D空间中定位音频的空间化算法。
        this.positionX = new AudioParam({value: 0}); // 表示右侧笛卡尔坐标系中音频的水平位置。默认值为0.虽然AudioParam无法直接更改，但可以使用其value属性更改其值。默认值为0。
        this.positionY = new AudioParam({value: 0}); // 表示右侧笛卡尔坐标系中音频的垂直位置。默认值为0.虽然AudioParam无法直接更改，但可以使用其value属性更改其值。默认值为0。
        this.positionZ = new AudioParam({value: 0}); // 表示右侧笛卡尔坐标系中音频的纵向（前后）位置。默认值为0.虽然AudioParam无法直接更改，但可以使用其value属性更改其值。默认值为0。
        this.refDistance = 1; // 表示当音频源从收听者进一步移动时减小音量的参考距离的double值。
        this.rolloffFactor = 1; // 一个double值，用于描述当源远离侦听器时音量减小的速度。所有距离模型都使用此值。
    }

    /**
     * 定义音频源相对于侦听器的位置（由AudioListener存储在AudioContext.listener属性中的对象表示）。
     * @param x
     * @param y
     * @param z
     */
    setPosition(x, y, z) {
        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
    }

    /**
     * 定义音频源播放的方向。
     * @param x
     * @param y
     * @param z
     */
    setOrientation(x, y, z) {
        this.orientationX = x;
        this.orientationY = y;
        this.orientationZ = z;
    }
    // 定义音频源的速度矢量 - 它移动的速度和方向。在该规范的先前版本中，PannerNode具有可以向上或向下AudioBufferSourceNode连接下游的速度。此功能未明确指定并且存在许多问题，因此已从规范中删除。
    setVelocity() {

    }
}

export default PannerNode;