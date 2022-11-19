/**
 * @en the device accelerometer reports values for each axis in units of g-force.
 * @zh 设备重力传感器传递的各个轴的数据。
 */
export class Acceleration {
    public x: number;
    public y: number;
    public z: number;
    public timestamp: number;
    constructor (x = 0, y = 0, z = 0, timestamp = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.timestamp = timestamp;
    }
}
