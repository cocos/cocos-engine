
/**
 * @category particle
 */

import { ccclass, tooltip, displayOrder, range, type, serializable } from 'cc.decorator';
import { pseudoRandom, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { calculateTransform } from '../particle-general-function';
import CurveRange from './curve-range';
import { ModuleRandSeed } from '../enum';
import { ParticleModuleBase, PARTICLE_MODULE_NAME} from '../particle';

// tslint:disable: max-line-length
const FORCE_OVERTIME_RAND_OFFSET = ModuleRandSeed.FORCE;

const _temp_v3 = new Vec3();

@ccclass('cc.ForceOvertimeModule')
export default class ForceOvertimeModule extends ParticleModuleBase {
    @serializable
    _enable: Boolean = false;
    /**
     * @zh 是否启用。
     */
    @displayOrder(0)
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
     * @zh X 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(2)
    @tooltip('X 轴方向上的加速度分量')
    public x = new CurveRange();

    /**
     * @zh Y 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(3)
    @tooltip('Y 轴方向上的加速度分量')
    public y = new CurveRange();

    /**
     * @zh Z 轴方向上的加速度分量。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(4)
    @tooltip('Z 轴方向上的加速度分量')
    public z = new CurveRange();

    /**
     * @zh 加速度计算时采用的坐标系 [[Space]]。
     */
    @type(Space)
    @serializable
    @displayOrder(1)
    @tooltip('加速度计算时采用的坐标')
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
