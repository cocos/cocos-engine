
/**
 * @category particle
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { pseudoRandom } from '../../core/math';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';
import { ModuleRandSeed } from '../enum';

// tslint:disable: max-line-length
const ROTATION_OVERTIME_RAND_OFFSET = ModuleRandSeed.ROTATION;
/**
 * @en The rotation module of 3d particle.
 * @zh 3D 粒子的旋转模块
 * @class RotationOvertimeModule
 */
@ccclass('cc.RotationOvertimeModule')
export default class RotationOvertimeModule extends ParticleModuleBase {
    @property
    _enable: Boolean = false;
    /**
     * @en The enable of RotationOvertimeModule.
     * @zh 是否启用
     * @property {Boolean} enable
     */
    @property({
        displayOrder: 0,
    })
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
    }

    @property
    private _separateAxes = false;

    /**
     * @en Whether to set the rotation of three axes separately (not currently supported)
     * @zh 是否三个轴分开设定旋转（暂不支持）。
     * @property {Boolean} separateAxes
     */
    @property({
        displayOrder: 1,
        tooltip:'i18n:particle.rotation_separate）',
    })
    get separateAxes () {
        return this._separateAxes;
    }

    set separateAxes (val) {
        this._separateAxes = val;
    }

    /**
     * @en Set rotation around X axis.
     * @zh 绕 X 轴设定旋转。
     * @property {CurveRange} x
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 2,
        tooltip:'i18n:particle.rotation_x',
    })
    public x = new CurveRange();

    /**
     * @en Set rotation around Y axis.
     * @zh 绕 Y 轴设定旋转。
     * @property {CurveRange} y
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 3,
        tooltip:'i18n:particle.rotation_y',
    })
    public y = new CurveRange();

    /**
     * @en Set rotation around Z axis.
     * @zh 绕 Z 轴设定旋转。
     * @property {CurveRange} z
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        radian: true,
        displayOrder: 4,
        tooltip:'i18n:particle.rotation_z',
    })
    public z = new CurveRange();

    public name = PARTICLE_MODULE_NAME.ROTATION;

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        if (!this._separateAxes) {
            p.rotation.z += this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET))! * dt;
        }
        else {
            // TODO: separateAxes is temporarily not supported!
            const rotationRand = pseudoRandom(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET);
            p.rotation.x += this.x.evaluate(normalizedTime, rotationRand)! * dt;
            p.rotation.y += this.y.evaluate(normalizedTime, rotationRand)! * dt;
            p.rotation.z += this.z.evaluate(normalizedTime, rotationRand)! * dt;
        }
    }
}

// CCClass.fastDefine('cc.RotationOvertimeModule', RotationOvertimeModule, {
//     enable: false,
//     _separateAxes: false,
//     x: new CurveRange(),
//     y: new CurveRange(),
//     z: new CurveRange()
// });
