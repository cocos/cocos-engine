/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module physics
 */

import { EDITOR } from 'internal:constants';
import { Vec3 } from '../../core/math';
import { IRaycastOptions } from '../spec/i-physics-world';
import { director, Director } from '../../core/director';
import { System } from '../../core/components';
import { PhysicsMaterial } from './assets/physics-material';
import { RecyclePool, game, Enum } from '../../core';
import { Ray } from '../../core/geometry';
import { PhysicsRayResult } from './physics-ray-result';
import { IPhysicsConfig, ICollisionMatrix } from './physics-config';
import { CollisionMatrix } from './collision-matrix';
import { PhysicsGroup } from './physics-enum';
import { constructDefaultWorld, IWorldInitData, selector } from './physics-selector';
import { legacyCC } from '../../core/global-exports';

legacyCC.internal.PhysicsGroup = PhysicsGroup;

/**
 * @en
 * Physics system.
 * @zh
 * 物理系统。
 */
export class PhysicsSystem extends System implements IWorldInitData {
    public static get PHYSICS_NONE () {
        return !selector.id;
    }

    public static get PHYSICS_BUILTIN () {
        return selector.id === 'builtin';
    }

    public static get PHYSICS_CANNON () {
        return selector.id === 'cannon.js';
    }

    public static get PHYSICS_AMMO () {
        return selector.id === 'ammo.js';
    }

    public static get PHYSICS_PHYSX () {
        return selector.id === 'physx';
    }

    /**
     * @en
     * Gets the ID of the system.
     * @zh
     * 获取此系统的ID。
     */
    public static readonly ID = 'PHYSICS';

    /**
     * @en
     * Gets the predefined physics groups.
     * @zh
     * 获取预定义的物理分组。
     */
    public static get PhysicsGroup () {
        return PhysicsGroup;
    }

    /**
     * @en
     * Gets the physical system instance.
     * @zh
     * 获取物理系统实例。
     */
    public static get instance (): PhysicsSystem {
        return PhysicsSystem._instance!;
    }

    /**
     * @en
     * Gets or sets whether the physical system is enabled, which can be used to pause or continue running the physical system.
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
     * Gets or sets whether the physical system allows automatic sleep, which defaults to true.
     * @zh
     * 获取或设置物理系统是否允许自动休眠，默认为 true。
     */
    public get allowSleep (): boolean {
        return this._allowSleep;
    }

    public set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (this.physicsWorld) {
            this.physicsWorld.setAllowSleep(v);
        }
    }

    /**
     * @en
     * Gets or sets the maximum number of simulated substeps per frame.
     * @zh
     * 获取或设置每帧模拟的最大子步数。
     */
    public get maxSubSteps () {
        return this._maxSubSteps;
    }

    public set maxSubSteps (value: number) {
        this._maxSubSteps = value;
    }

    /**
     * @en
     * Gets or sets the fixed delta time consumed by each simulation step.
     * @zh
     * 获取或设置每步模拟消耗的固定时间。
     */
    public get fixedTimeStep () {
        return this._fixedTimeStep;
    }

    public set fixedTimeStep (value: number) {
        this._fixedTimeStep = value;
    }

    /**
     * @en
     * Gets or sets the value of gravity in the physical world, which defaults to (0, -10, 0).
     * @zh
     * 获取或设置物理世界的重力数值，默认为 (0, -10, 0)。
     */
    public get gravity (): Vec3 {
        return this._gravity;
    }

    public set gravity (gravity: Vec3) {
        this._gravity.set(gravity);
        if (this.physicsWorld) {
            this.physicsWorld.setGravity(gravity);
        }
    }

    /**
     * @en
     * Gets or sets the default speed threshold for going to sleep.
     * @zh
     * 获取或设置进入休眠的默认速度临界值。
     */
    public get sleepThreshold (): number {
        return this._sleepThreshold;
    }

    public set sleepThreshold (v: number) {
        this._sleepThreshold = v;
    }

    /**
     * @en
     * Turn on or off the automatic simulation.
     * @zh
     * 获取或设置是否自动模拟。
     */
    public get autoSimulation () {
        return this._autoSimulation;
    }

    public set autoSimulation (value: boolean) {
        this._autoSimulation = value;
    }

    /**
     * @en
     * Gets the global default physical material.
     * @zh
     * 获取全局的默认物理材质。
     */
    public get defaultMaterial (): PhysicsMaterial {
        return this._material;
    }

    /**
     * @en
     * Gets the wrappered object of the physical world through which you can access the actual underlying object.
     * @zh
     * 获取物理世界的封装对象，通过它你可以访问到实际的底层对象。
     */
    public get physicsWorld () {
        return selector.physicsWorld;
    }

    /**
     * @en
     * Gets the raycastClosest test result.
     * @zh
     * 获取 raycastClosest 的检测结果。
     */
    public readonly raycastClosestResult = new PhysicsRayResult();

    /**
    * @en
    * Gets the raycast test results.
    * @zh
    * 获取 raycast 的检测结果。
    */
    public readonly raycastResults: PhysicsRayResult[] = [];

    /**
    * @en
    * Gets the collision matrix that used for initialization only.
    * @zh
    * 获取碰撞矩阵，它仅用于初始化。
    */
    public readonly collisionMatrix: ICollisionMatrix = new CollisionMatrix(1) as ICollisionMatrix;

    public readonly useNodeChains: boolean = false;

    private _enable = true;
    private _allowSleep = true;
    private _maxSubSteps = 1;
    private _subStepCount = 0;
    private _fixedTimeStep = 1.0 / 60.0;
    private _autoSimulation = true;
    private _accumulator = 0;
    private _sleepThreshold = 0.1;
    private readonly _gravity = new Vec3(0, -10, 0);
    private readonly _material = new PhysicsMaterial();
    private static readonly _instance: PhysicsSystem | null = null;

    private readonly raycastOptions: IRaycastOptions = {
        group: -1,
        mask: -1,
        queryTrigger: true,
        maxDistance: 10000000,
    }

    private readonly raycastResultPool = new RecyclePool<PhysicsRayResult>(() => new PhysicsRayResult(), 1);

    private constructor () {
        super();
        this._material.on(PhysicsMaterial.EVENT_UPDATE, this._updateMaterial, this);
    }

    postUpdate (deltaTime: number) {
        if (!this.physicsWorld || EDITOR && !legacyCC.GAME_VIEW && !this._executeInEditMode) {
            return;
        }

        if (!this._enable) {
            this.physicsWorld.syncSceneToPhysics();
            return;
        }

        if (this._autoSimulation) {
            this._subStepCount = 0;
            this._accumulator += deltaTime;
            director.emit(Director.EVENT_BEFORE_PHYSICS);
            while (this._subStepCount < this._maxSubSteps) {
                if (this._accumulator > this._fixedTimeStep) {
                    this.physicsWorld.syncSceneToPhysics();
                    this.physicsWorld.step(this._fixedTimeStep);
                    this._accumulator -= this._fixedTimeStep;
                    this._subStepCount++;
                    this.physicsWorld.emitEvents();
                    // TODO: nesting the dirty flag reset between the syncScenetoPhysics and the simulation to reduce calling syncScenetoPhysics.
                    this.physicsWorld.syncAfterEvents();
                } else {
                    this.physicsWorld.syncSceneToPhysics();
                    break;
                }
            }
            director.emit(Director.EVENT_AFTER_PHYSICS);
        }
    }

    /**
     * @en
     * Reset the physics configuration.
     * @zh
     * 重置物理配置。
     */
    resetConfiguration () {
        const config = game.config ? game.config.physics as IPhysicsConfig : null;
        if (config && config.physicsEngine) {
            Vec3.copy(this._gravity, config.gravity);
            this._allowSleep = config.allowSleep;
            this._fixedTimeStep = config.fixedTimeStep;
            this._maxSubSteps = config.maxSubSteps;
            this._sleepThreshold = config.sleepThreshold;
            this.autoSimulation = config.autoSimulation;

            if (config.defaultMaterial) {
                this._material.setValues(
                    config.defaultMaterial.friction,
                    config.defaultMaterial.rollingFriction,
                    config.defaultMaterial.spinningFriction,
                    config.defaultMaterial.restitution,
                );
            }

            if (config.collisionMatrix) {
                for (const i in config.collisionMatrix) {
                    this.collisionMatrix[`${1 << parseInt(i)}`] = config.collisionMatrix[i];
                }
            }

            const cg = config.collisionGroups;
            if (cg instanceof Array) {
                cg.forEach((v) => { PhysicsGroup[v.name] = 1 << v.index; });
                Enum.update(PhysicsGroup);
            }
        }

        if (this.physicsWorld) {
            this.physicsWorld.setGravity(this._gravity);
            this.physicsWorld.setAllowSleep(this._allowSleep);
            this.physicsWorld.setDefaultMaterial(this._material);
        }
    }

    /**
     * @en
     * Reset the accumulator of time to given value.
     * @zh
     * 重置时间累积总量为给定值。
     */
    resetAccumulator (time = 0) {
        this._accumulator = time;
    }

    /**
     * @en
     * Perform simulation steps for the physics world.
     * @zh
     * 执行物理世界的模拟步进。
     * @param fixedTimeStep
     */
    step (fixedTimeStep: number, deltaTime?: number, maxSubSteps?: number) {
        if (this.physicsWorld) this.physicsWorld.step(fixedTimeStep, deltaTime, maxSubSteps);
    }

    /**
     * @en
     * Sync the scene world transform changes to the physics world.
     * @zh
     * 同步场景世界的变化信息到物理世界中。
     */
    syncSceneToPhysics () {
        if (this.physicsWorld) this.physicsWorld.syncSceneToPhysics();
    }

    /**
     * @en
     * Emit trigger and collision events.
     * @zh
     * 触发`trigger`和`collision`事件。
     */
    emitEvents () {
        if (this.physicsWorld) this.physicsWorld.emitEvents();
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
    raycast (worldRay: Ray, mask = 0xffffffff, maxDistance = 10000000, queryTrigger = true): boolean {
        if (!this.physicsWorld) return false;
        this.raycastResultPool.reset();
        this.raycastResults.length = 0;
        this.raycastOptions.mask = mask >>> 0;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
    }

    /**
     * @en
     * Collision detect all collider, and record and ray test results with the shortest distance
     * by PhysicsSystem.Instance.RaycastClosestResult access to the results.
     * @zh
     * 检测所有的碰撞盒，并记录与射线距离最短的检测结果，通过 PhysicsSystem.instance.raycastClosestResult 访问结果。
     * @param worldRay 世界空间下的一条射线
     * @param mask 掩码，默认为 0xffffffff
     * @param maxDistance 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
     * @param queryTrigger 是否检测触发器
     * @return boolean 表示是否有检测到碰撞盒
     */
    raycastClosest (worldRay: Ray, mask = 0xffffffff, maxDistance = 10000000, queryTrigger = true): boolean {
        if (!this.physicsWorld) return false;
        this.raycastOptions.mask = mask >>> 0;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
    }

    private _updateMaterial () {
        if (this.physicsWorld) this.physicsWorld.setDefaultMaterial(this._material);
    }

    /**
     * @en
     * Construct and register the system singleton.
     * If the module is pre-loaded, it will be executed automatically.
     * @zh
     * 构造并注册系统单例。
     * 预先加载模块的情况下，会自动执行。
     */
    static constructAndRegister () {
        if (!PhysicsSystem._instance) {
            // Construct physics world and physics system only once
            const sys = new PhysicsSystem();
            sys.resetConfiguration();
            constructDefaultWorld(sys);
            (PhysicsSystem._instance as unknown as PhysicsSystem) = sys;
            director.registerSystem(PhysicsSystem.ID, sys, sys.priority);
        }
    }
}

/**
 * By registering the initialization event, the system can be automatically
 * constructed and registered when the module is pre-loaded
 */
director.once(Director.EVENT_INIT, () => { PhysicsSystem.constructAndRegister(); });
