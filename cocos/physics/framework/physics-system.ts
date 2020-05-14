/**
 * @category physics
 */

import { Vec3 } from '../../core/math';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { createPhysicsWorld, checkPhysicsModule } from './instance';
import { director, Director } from '../../core/director';
import { System } from '../../core/components';
import { PhysicMaterial } from './assets/physic-material';
import { Layers, RecyclePool } from '../../core';
import { ray } from '../../core/geometry';
import { PhysicsRayResult } from './physics-ray-result';
import { EDITOR, PHYSICS_BUILTIN, DEBUG, PHYSICS_CANNON, PHYSICS_AMMO } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';

/**
 * @en
 * Physics system.
 * @zh
 * 物理系统。
 */
export class PhysicsSystem extends System {

    /**
     * @en
     * Gets or sets whether the physical system is enabled, which can be used to pause or continue running the physical system.
     * @zh
     * 获取或设置是否启用物理系统，可以用于暂停或继续运行物理系统。
     */
    get enable (): boolean {
        return this._enable;
    }
    set enable (value: boolean) {
        if (!value) this._timeReset = true;
        this._enable = value;
    }

    /**
     * @zh
     * Gets or sets whether the physical system allows automatic sleep, which defaults to true.
     * @zh
     * 获取或设置物理系统是否允许自动休眠，默认为 true。
     */
    get allowSleep (): boolean {
        return this._allowSleep;
    }
    set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this.physicsWorld.setAllowSleep(v);
        }
    }

    /**
     * @en
     * Gets or sets the maximum number of simulated substeps per frame.
     * @zh
     * 获取或设置每帧模拟的最大子步数。
     */
    get maxSubStep () {
        return this._maxSubStep;
    }

    set maxSubStep (value: number) {
        this._maxSubStep = value;
    }

    /**
     * @en
     * Gets or sets the fixed time consumed by each simulation step.
     * @zh
     * 获取或设置每步模拟消耗的固定时间。
     */
    get deltaTime () {
        return this._deltaTime;
    }

    set deltaTime (value: number) {
        this._deltaTime = value;
    }

    /**
     * @en
     * Gets or sets whether to simulate with a fixed time step, which defaults to true.
     * @zh
     * 获取或设置是否使用固定的时间步长进行模拟，默认为 true。
     */
    get useFixedTime () {
        return this._useFixedTime;
    }

    set useFixedTime (value: boolean) {
        this._useFixedTime = value;
    }

    /**
     * @en
     * Gets or sets the value of gravity in the physical world, which defaults to (0, -10, 0).
     * @zh
     * 获取或设置物理世界的重力数值，默认为 (0, -10, 0)。
     */
    get gravity (): Vec3 {
        return this._gravity;
    }
    set gravity (gravity: Vec3) {
        this._gravity.set(gravity);
        if (!EDITOR && !PHYSICS_BUILTIN) {
            this.physicsWorld.setGravity(gravity);
        }
    }

    /**
     * @en
     * Gets the global default physical material.
     * @zh
     * 获取全局的默认物理材质。
     */
    get defaultMaterial (): PhysicMaterial {
        return this._material;
    }

    /**
     * @en
     * Gets the wrappered object of the physical world through which you can access the actual underlying object.
     * @zh
     * 获取物理世界的封装对象，通过它你可以访问到实际的底层对象。
     */
    readonly physicsWorld: IPhysicsWorld;

    /**
     * @en
     * Gets the raycastClosest test result.
     * @zh
     * 获取 raycastClosest 的检测结果。
     */
    readonly raycastClosestResult = new PhysicsRayResult();

    /**
     * @en
     * Gets the raycast test results.
     * @zh
     * 获取 raycast 的检测结果。
     */
    readonly raycastResults: PhysicsRayResult[] = [];

    /**
     * @en
     * Gets the ID of the system.
     * @zh
     * 获取此系统的ID。
     */
    static readonly ID = 'PHYSICS';

    /**
     * @en
     * Gets the physical system instance.
     * @zh
     * 获取物理系统实例。
     */
    static get instance (): PhysicsSystem {
        if (DEBUG && checkPhysicsModule(PhysicsSystem._instance)) { return null as any; }
        return PhysicsSystem._instance;
    }

    private static readonly _instance: PhysicsSystem;

    private _enable = true;
    private _allowSleep = true;
    private readonly _gravity = new Vec3(0, -10, 0);
    private _maxSubStep = 1;
    private _deltaTime = 1.0 / 60.0;
    private _useFixedTime = true;
    private _timeSinceLastUpdate = 0;
    private _timeReset = true;
    private readonly _material!: PhysicMaterial;

    private readonly raycastOptions: IRaycastOptions = {
        'group': -1,
        'mask': -1,
        'queryTrigger': true,
        'maxDistance': 10000000
    }

    private readonly raycastResultPool = new RecyclePool<PhysicsRayResult>(() => {
        return new PhysicsRayResult();
    }, 1);

    private constructor () {
        super();
        this.physicsWorld = createPhysicsWorld();
        this.gravity = this._gravity;
        this.allowSleep = this._allowSleep;
        this._material = new PhysicMaterial();
        this._material.friction = 0.5;
        this._material.restitution = 0.1;
        this._material.on('physics_material_update', this._updateMaterial, this);
        this.physicsWorld.setDefaultMaterial(this._material);
    }

    /**
     * @en
     * Perform a simulation of the physics system, which will now be performed automatically on each frame.
     * @zh
     * 执行一次物理系统的模拟，目前将在每帧自动执行一次。
     * @param deltaTime 与上一次执行相差的时间，目前为每帧消耗时间
     */
    postUpdate (deltaTime: number) {
        if (EDITOR && !this._executeInEditMode) {
            return;
        }

        if (!this._enable) {
            this.physicsWorld.syncSceneToPhysics();
            return;
        }

        this._timeSinceLastUpdate = this._timeReset ? 0 : deltaTime;
        this.physicsWorld.emitEvents();
        director.emit(Director.EVENT_BEFORE_PHYSICS);
        this.physicsWorld.syncSceneToPhysics();
        if (this._useFixedTime) {
            this.physicsWorld.step(this._deltaTime);
        } else {
            this.physicsWorld.step(this._deltaTime, this._timeSinceLastUpdate, this._maxSubStep);
        }
        director.emit(Director.EVENT_AFTER_PHYSICS);
    }

    /**
     * @en
     * Collision detect all collider, and record all the detected results, through PhysicsSystem.Instance.RaycastResults access to the results.
     * @zh
     * 检测所有的碰撞盒，并记录所有被检测到的结果，通过 PhysicsSystem.instance.raycastResults 访问结果。
     * @param worldRay 世界空间下的一条射线
     * @param mask 掩码，默认为 0xffffffff
     * @param maxDistance 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     * @param queryTrigger 是否检测触发器
     * @return boolean 表示是否有检测到碰撞盒
     */
    raycast (worldRay: ray, mask: number = 0xffffffff, maxDistance = 10000000, queryTrigger = true): boolean {
        this.raycastResultPool.reset();
        this.raycastResults.length = 0;
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
    }

    /**
     * @en
     * Collision detect all collider, and record and ray test results with the shortest distance by PhysicsSystem.Instance.RaycastClosestResult access to the results.
     * @zh
     * 检测所有的碰撞盒，并记录与射线距离最短的检测结果，通过 PhysicsSystem.instance.raycastClosestResult 访问结果。
     * @param worldRay 世界空间下的一条射线
     * @param mask 掩码，默认为 0xffffffff
     * @param maxDistance 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     * @param queryTrigger 是否检测触发器
     * @return boolean 表示是否有检测到碰撞盒
     */
    raycastClosest (worldRay: ray, mask: number = 0xffffffff, maxDistance = 10000000, queryTrigger = true): boolean {
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
    }

    private _updateMaterial () {
        if (!PHYSICS_BUILTIN) {
            this.physicsWorld.setDefaultMaterial(this._material);
        }
    }
}

if (PHYSICS_BUILTIN || PHYSICS_CANNON || PHYSICS_AMMO) {
    director.on(Director.EVENT_INIT, function () {
        const sys = new legacyCC.PhysicsSystem();
        legacyCC.PhysicsSystem._instance = sys;
        director.registerSystem(PhysicsSystem.ID, sys, 0);
    });
}
