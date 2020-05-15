
/**
 * @category particle
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { pseudoRandom, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';
import { ModuleRandSeed } from '../enum';
import { ParticleModuleBase, PARTICLE_MODULE_NAME} from '../particle';

// tslint:disable: max-line-length
const FORCE_OVERTIME_RAND_OFFSET = ModuleRandSeed.FORCE;

const _temp_v3 = new Vec3();

/**
 * @en The force over time module of 3d particle.
 * @zh 3D 粒子的加速度模块
 * @class ForceOvertimeModule
 */
@ccclass('cc.ForceOvertimeModule')
export default class ForceOvertimeModule extends ParticleModuleBase {
    @property
    _enable: Boolean = false;
    /**
     * @en The enable of ColorOvertimeModule.
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

    /**
     * @en X-axis acceleration component.
     * @zh X 轴方向上的加速度分量。
     * @property {CurveRange} x
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 2,
        tooltip:'i18n:particle.force_x',
    })
    public x = new CurveRange();

    /**
     * @en Y-axis acceleration component.
     * @zh Y 轴方向上的加速度分量。
     * @property {CurveRange} y
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 3,
        tooltip:'i18n:particle.force_y',
    })
    public y = new CurveRange();

    /**
     * @en Z-axis acceleration component.
     * @zh Z 轴方向上的加速度分量。
     * @property {CurveRange} z
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 4,
        tooltip:'i18n:particle.force_z',
    })
    public z = new CurveRange();

    /**
     * @en Coordinate system used in acceleration calculation.
     * @zh 加速度计算时采用的坐标系。
     * @property {Space} space
     */
    @property({
        type: Space,
        displayOrder: 1,
        tooltip:'i18n:particle.force_space',
    })
    public space = Space.Local;

    // TODO:currently not supported
    public randomized = false;

    private rotation: Quat;
    private needTransform: boolean;
    public name = PARTICLE_MODULE_NAME.FORCE;

    constructor () {
        super();
        this.rotation = new Quat();
        this.needTransform = false;
        this.needUpdate = true;
    }

    public update (space, worldTransform) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    public animate (p, dt) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const force = Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET))!, this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET))!, this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET))!);
        if (this.needTransform) {
            Vec3.transformQuat(force, force, this.rotation);
        }
        Vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
        Vec3.copy(p.ultimateVelocity, p.velocity);
    }
}

// CCClass.fastDefine('cc.ForceOvertimeModule',ForceOvertimeModule,{
//     enable : false,
//     x : new CurveRange(),
//     y : new CurveRange(),
//     z : new CurveRange(),
//     space : Space.Local,
//     randomized : false
// });
