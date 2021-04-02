import { ccclass, property } from '../../../platform/CCClassDecorator';
import { pseudoRandom } from '../../../value-types';
import CurveRange from './curve-range';

// tslint:disable: max-line-length
const ROTATION_OVERTIME_RAND_OFFSET = 125292;

/**
 * !#en The rotation module of 3d particle.
 * !#zh 3D 粒子的旋转模块
 * @class RotationOvertimeModule
 */
@ccclass('cc.RotationOvertimeModule')
export default class RotationOvertimeModule {

    /**
     * !#en The enable of RotationOvertimeModule.
     * !#zh 是否启用
     * @property {Boolean} enable
     */
    @property
    enable = false;

    @property
    _separateAxes = false;

    /**
     * !#en Whether to set the rotation of three axes separately (not currently supported)
     * !#zh 是否三个轴分开设定旋转（暂不支持）。
     * @property {Boolean} separateAxes
     */
    @property
    get separateAxes () {
        return this._separateAxes;
    }

    set separateAxes (val) {
        this._separateAxes = val;
    }

    /**
     * !#en Set rotation around X axis.
     * !#zh 绕 X 轴设定旋转。
     * @property {CurveRange} x
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        visible: function (this) {
            return this._separateAxes;
        }
    })
    x = new CurveRange();

    /**
     * !#en Set rotation around Y axis.
     * !#zh 绕 Y 轴设定旋转。
     * @property {CurveRange} y
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        visible: function (this) {
            return this._separateAxes;
        }
    })
    y = new CurveRange();

    /**
     * !#en Set rotation around Z axis.
     * !#zh 绕 Z 轴设定旋转。
     * @property {CurveRange} z
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
    })
    z = new CurveRange();

    constructor () {

    }

    animate (p, dt) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        if (!this._separateAxes) {
            p.rotation.x += this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET)) * dt;
        } else {
            // TODO: separateAxes is temporarily not supported!
            const rotationRand = pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET);
            p.rotation.x += this.x.evaluate(normalizedTime, rotationRand) * dt;
            p.rotation.y += this.y.evaluate(normalizedTime, rotationRand) * dt;
            p.rotation.z += this.z.evaluate(normalizedTime, rotationRand) * dt;
        }
    }
}
