/**
 * @category physics
 */

import { Vec3 } from '../../core/math';
import { PhysicsWorldBase } from '../api';
import { createPhysicsWorld } from '../instance';
import { director, Director } from '../../core/director';
import { System } from '../../core/components';

/**
 * @zh
 * 物理系统。
 */
export class PhysicsSystem extends System {

    /**
     * @zh
     * 获取或设置是否启用物理系统，可以用于暂停或继续运行物理系统。
     */
    public get enable (): boolean {
        return this._enable;
    }
    public set enable (value: boolean) {
        this._enable = value;
    }

    /**
     * @zh
     * 获取或设置物理系统是否允许自动休眠，默认为 true
     */
    public get allowSleep (): boolean {
        return this._allowSleep;
    }
    public set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILT_IN) {
                this._world.setAllowSleep(this._allowSleep);
            }
        }
    }

    // shielding for alpha version
    // /**
    //  * @zh
    //  * 获取或设置是否只运行一步。
    //  * @param {boolean} b
    //  */
    // public get singleStep () {
    //     return this._singleStep;
    // }
    // public set singleStep (b: boolean) {
    //     this._singleStep = b;
    // }

    /**
     * @zh
     * 获取或设置每帧模拟的最大子步数。
     */
    public get maxSubStep () {
        return this._maxSubStep;
    }
    public set maxSubStep (value: number) {
        this._maxSubStep = value;
    }

    /**
     * @zh
     * 获取或设置每步模拟消耗的固定时间。
     */
    public get deltaTime () {
        return this._deltaTime;
    }
    public set deltaTime (value: number) {
        this._deltaTime = value;
    }

    /**
     * @zh
     * 获取或设置物理世界的重力数值，默认为 (0, -10, 0)
     */
    public get gravity (): Vec3 {
        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILT_IN) {
                this._world.getGravity(this._gravity);
            }
        }
        return this._gravity;
    }
    public set gravity (gravity: Vec3) {
        this._gravity.x = gravity.x;
        this._gravity.y = gravity.y;
        this._gravity.z = gravity.z;
        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILT_IN) {
                this._world.setGravity(gravity);
            }
        }
    }

    // get world () {
    //     return this._world;
    // }

    // shielding for alpha version
    // /**
    //  * @zh
    //  * 获取或设置物理每秒模拟的帧率。
    //  */
    // public get frameRate () {
    //     return this._frameRate;
    // }
    // public set frameRate (value: number) {
    //     this._frameRate = value;
    //     this._deltaTime = 1 / this._frameRate;
    // }

    public static instance: PhysicsSystem;
    public static ID: 'physics';

    private _world: PhysicsWorldBase;
    private _enable = true;
    private _deltaTime = 1.0 / 60.0;
    private _maxSubStep = 2;
    // private _frameRate = 60;
    // private _singleStep = false;
    private _allowSleep = true;
    private _gravity = new Vec3(0, -10, 0);

    constructor () {
        super();
        this._world = createPhysicsWorld();
        this.gravity = this._gravity;
        this.allowSleep = this._allowSleep;
    }

    /**
     * @zh
     * 执行一次物理系统的模拟，目前将在每帧自动执行一次。
     * @param deltaTime 与上一次执行相差的时间，目前为每帧消耗时间
     */
    public postUpdate (deltaTime: number) {
        if (CC_EDITOR && !this._executeInEditMode) {
            return;
        }
        if (!this._enable) {
            return;
        }

        director.emit(Director.EVENT_BEFORE_PHYSICS);

        this._world.step(this._deltaTime, deltaTime, this._maxSubStep);
        // if (this._singleStep) {
        //     this._enable = false;
        // }

        director.emit(Director.EVENT_AFTER_PHYSICS);
    }
}
cc.PhysicsSystem = PhysicsSystem;

director.on(Director.EVENT_INIT, function () {
    let sys = new PhysicsSystem();
    PhysicsSystem.instance = sys;
    director.registerSystem(PhysicsSystem.ID, sys, 0);
});