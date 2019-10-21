/**
 * @category physics
 */

import { Vec3 } from '../../core/math';
import { PhysicsWorldBase, IRaycastOptions } from '../api';
import { createPhysicsWorld } from '../instance';
import { director, Director } from '../../core/director';
import { System } from '../../core/components';
import { PhysicMaterial } from '../assets/physic-material';
import { Layers, RecyclePool } from '../../core';
import { ray } from '../../core/geom-utils';
import { PhysicsRayResult } from '../physics-ray-result';

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
            if (!CC_PHYSICS_BUILTIN) {
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
            if (!CC_PHYSICS_BUILTIN) {
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
            if (!CC_PHYSICS_BUILTIN) {
                this._world.setGravity(gravity);
            }
        }
    }

    /**
     * @zh
     * 获取全局的默认物理材质，注意：builtin 时为 null
     */
    public get defaultMaterial (): PhysicMaterial | null {
        return this._material;
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

    public static readonly instance: PhysicsSystem;
    public static readonly ID: 'physics';

    public _world: PhysicsWorldBase;

    private _enable = true;
    private _deltaTime = 1.0 / 60.0;
    private _maxSubStep = 2;
    // private _frameRate = 60;
    // private _singleStep = false;
    private _allowSleep = true;
    private readonly _gravity = new Vec3(0, -10, 0);
    private readonly _material: PhysicMaterial | null = null;

    public readonly raycastClosestResult = new PhysicsRayResult();
    public readonly raycastResults: PhysicsRayResult[] = [];

    private readonly raycastOptions: IRaycastOptions = {
        'group': -1,
        'mask': -1,
        'queryTrigger': true,
        'maxDistance': Infinity
    }

    private readonly raycastResultPool = new RecyclePool<PhysicsRayResult>(() => {
        return new PhysicsRayResult();
    }, 1);

    private constructor () {
        super();
        this._world = createPhysicsWorld();
        if (!CC_PHYSICS_BUILTIN) {
            this.gravity = this._gravity;
            this.allowSleep = this._allowSleep;
            this._material = new PhysicMaterial();
            this._material.friction = 0.6;
            this._material.restitution = -1;
            this._material.on('physics_material_update', this._updateMaterial, this);
            this._world.defaultMaterial = this._material;
        }
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

    /**
     * @zh
     * 检测所有的碰撞盒，并记录所有被检测到的结果，通过 PhysicsSystem.instance.raycastResults 访问结果
     * @param worldRay 世界空间下的一条射线
     * @param mask 掩码
     * @param maxDistance 最大检测距离
     * @param queryTrigger 是否检测触发器
     * @return boolean 表示是否有检测到碰撞盒
     * @note 由于目前 Layer 还未完善，mask 暂时失效，请留意更新公告
     */
    public raycast (worldRay: ray, mask: number = Layers.Enum.DEFAULT, maxDistance = Infinity, queryTrigger = true): boolean {
        this.raycastResultPool.reset();
        this.raycastResults.length = 0;
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this._world.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
    }

    /**
     * @zh
     * 检测所有的碰撞盒，并记录与射线距离最短的检测结果，通过 PhysicsSystem.instance.raycastClosestResult 访问结果
     * @param worldRay 世界空间下的一条射线
     * @param mask 掩码
     * @param maxDistance 最大检测距离
     * @param queryTrigger 是否检测触发器
     * @return boolean 表示是否有检测到碰撞盒
     * @note 由于目前 Layer 还未完善，mask 暂时失效，请留意更新公告
     */
    public raycastClosest (worldRay: ray, mask: number = Layers.Enum.DEFAULT, maxDistance = Infinity, queryTrigger = true): boolean {
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this._world.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
    }

    private _updateMaterial () {
        if (!CC_PHYSICS_BUILTIN) {
            this._world.defaultMaterial = this._material;
        }
    }
}
cc.PhysicsSystem = PhysicsSystem;

director.on(Director.EVENT_INIT, function () {
    const sys = new cc.PhysicsSystem();
    cc.PhysicsSystem.instance = sys;
    director.registerSystem(PhysicsSystem.ID, sys, 0);
});
