
/**
 * @category particle
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { lerp, pseudoRandom, Vec3, Mat4, Quat } from '../../core/math';
import { Space, ModuleRandSeed } from '../enum';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';
import { calculateTransform } from '../particle-general-function';

// tslint:disable: max-line-length
const LIMIT_VELOCITY_RAND_OFFSET = ModuleRandSeed.LIMIT;

const _temp_v3 = new Vec3();
const _temp_v3_1 = new Vec3();

/**
 * @en The limit velocity module of 3d particle.
 * @zh 3D 粒子的限速模块
 * @class LimitVelocityOvertimeModule
 */
@ccclass('cc.LimitVelocityOvertimeModule')
export default class LimitVelocityOvertimeModule extends ParticleModuleBase {

    @property
    _enable: Boolean = false;
    /**
     * @en The enable of LimitVelocityOvertimeModule.
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
     * @en Lower speed limit in X direction.
     * @zh X 轴方向上的速度下限。
     * @property {CurveRange} limitX
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 4,
        tooltip:'i18n:particle.limit_x',
    })
    public limitX = new CurveRange();

    /**
     * @en Lower speed limit in Y direction.
     * @zh Y 轴方向上的速度下限。
     * @property {CurveRange} limitY
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 5,
        tooltip:'i18n:particle.limit_y',
    })
    public limitY = new CurveRange();

    /**
     * @en Lower speed limit in Z direction.
     * @zh Z 轴方向上的速度下限。
     * @property {CurveRange} limitZ
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 6,
        tooltip:'i18n:particle.limit_z',
    })
    public limitZ = new CurveRange();

    /**
     * @en Lower speed limit
     * @zh 速度下限。
     * @property {CurveRange} limit
     */
    @property({
        type: CurveRange,
        range: [-1, 1],
        displayOrder: 3,
        tooltip:'i18n:particle.limit_v',
    })
    public limit = new CurveRange();

    /**
     * @en Interpolation of current speed and lower speed limit.
     * @zh 当前速度与速度下限的插值。
     * @property {Number} dampen
     */
    @property({
        displayOrder: 7,
        tooltip:'i18n:particle.limit_dampen',
    })
    public dampen = 3;

    /**
     * @en Whether to limit the three axes separately.
     * @zh 是否三个轴分开限制。
     * @property {Boolean} separateAxes
     */
    @property({
        displayOrder: 2,
        tooltip:'i18n:particle.limit_separate',
    })
    public separateAxes = false;

    /**
     * @en The coordinate system used when calculating the lower speed limit.
     * @zh 计算速度下限时采用的坐标系。
     * @property {Space} space
     */
    @property({
        type: Space,
        displayOrder: 1,
        tooltip:'i18n:particle.limit_space',
    })
    public space = Space.Local;

    // TODO:functions related to drag are temporarily not supported
    public drag = null;
    public multiplyDragByParticleSize = false;
    public multiplyDragByParticleVelocity = false;
    public name = PARTICLE_MODULE_NAME.LIMIT;
    private rotation: Quat;
    private needTransform: boolean;

    constructor () {
        super();
        this.rotation = new Quat();
        this.needTransform = false;
        this.needUpdate = true;
    }

    public update (space: number, worldTransform: Mat4) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const dampedVel = _temp_v3;
        if (this.separateAxes) {
            Vec3.set(_temp_v3_1, this.limitX.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!,
                this.limitY.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!,
                this.limitZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!);
            if (this.needTransform) {
                Vec3.transformQuat(_temp_v3_1, _temp_v3_1, this.rotation);
            }
            Vec3.set(dampedVel,
                dampenBeyondLimit(p.ultimateVelocity.x, _temp_v3_1.x, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.y, _temp_v3_1.y, this.dampen),
                dampenBeyondLimit(p.ultimateVelocity.z, _temp_v3_1.z, this.dampen));
        }
        else {
            Vec3.normalize(dampedVel, p.ultimateVelocity);
            Vec3.multiplyScalar(dampedVel, dampedVel, dampenBeyondLimit(p.ultimateVelocity.length(), this.limit.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET))!, this.dampen));
        }
        Vec3.copy(p.ultimateVelocity, dampedVel);
    }

}

function dampenBeyondLimit (vel: number, limit: number, dampen: number) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}

// CCClass.fastDefine('cc.LimitVelocityOvertimeModule', LimitVelocityOvertimeModule, {
//     enable: false,
//     limitX: null,
//     limitY: null,
//     limitZ: null,
//     limit: null,
//     dampen: null,
//     separateAxes: false,
//     space: Space.Local,
//     // TODO:functions related to drag are temporarily not supported
//     drag: null,
//     multiplyDragByParticleSize: false,
//     multiplyDragByParticleVelocity: false
// });
