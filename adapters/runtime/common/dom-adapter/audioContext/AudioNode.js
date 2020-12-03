import EventTarget from "../EventTarget";

class AudioNode extends EventTarget {
    constructor(context) {
        super();

        this._context = context; // 只读 返回关联BaseAudioContext的对象，即表示节点所参与的处理图的对象。
        this.numberOfInputs = 1; // 只读 返回馈送节点的输入数。源节点定义为具有numberOfInputs值为的属性的节点0。
        this.numberOfOutputs = 1; // 只读返回来自节点的输出数。目标节点 - 例如AudioDestinationNode- 具有0此属性的值。
        this.channelCount = 2; //表示一个整数，用于确定在向节点的任何输入上混合和向下混合连接时使用的通道数。它的用法和精确的定义取决于它的价值AudioNode.channelCountMode。
        this.channelCountMode = "explicit"; //表示一个枚举值，描述通道必须在节点的输入和输出之间匹配的方式。
        this.channelInterpretation = "speakers"; //表示描述通道含义的枚举值。这种解释将定义音频上混和下混合将如何发生。可能的值是"speakers"或"discrete"。
    }

    /**
     * 允许我们将此节点的输出连接到另一个节点，可以是音频数据，也可以是a的值AudioParam。
     * @param destination
     * @param outputIndex 可选的 一个索引，指定AudioNode要连接到目标的当前输出, 默认值为0
     * @param inputIndex 可选的 一个索引，描述要将当前连接到的目标的哪个输入AudioNode; 默认值为0
     */
    connect(destination, outputIndex, inputIndex) {

    }
    // 允许我们断开当前节点与已连接的节点之间的连接。
    disconnect() {

    }

    /**
     * Check the obj whether is number or not
     * If a number is created by using 'new Number(10086)', the typeof it will be "object"...
     * Then you can use this function if you care about this case.
     * @method isNumber
     * @param {*} obj
     * @returns {Boolean}
     */
    isNumber(obj) {
        return typeof obj === 'number' || obj instanceof Number;
    }

    /**
     * @returns {BaseAudioContext}
     */
    get context() {
        return this._context;
    }
}

export default AudioNode;