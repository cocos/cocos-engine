/**
 * @category physics
 */

import { PhysicsWorldBase } from '../../physics/api';
import { createPhysicsWorld } from '../../physics/instance';

/**
 * @zh
 * 物理系统。
 */
export class PhysicsSystem {
    private _world: PhysicsWorldBase;
    private _enable = true;
    private _deltaTime = 1.0 / 60.0;
    private _maxSubStep = 2;
    // private _frameRate = 60;
    // private _singleStep = false;

    constructor () {
        this._world = createPhysicsWorld();
    }

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

    public update (deltaTime: number) {
        if (CC_EDITOR) {
            return;
        }
        if (!this._enable) {
            return;
        }
        this._world.step(this._deltaTime, deltaTime, this._maxSubStep);
        // if (this._singleStep) {
        //     this._enable = false;
        // }
    }

    get world () {
        return this._world;
    }
}
