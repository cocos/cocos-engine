/**
 * @packageDocumentation
 * @module physics2d
 */

 import { EDITOR, DEBUG } from 'internal:constants';
 import { System, Vec2, director, Director, game, error, IVec2Like, Rect, Eventify, Enum } from '../../core';
 import { IPhysicsWorld } from '../spec/i-physics-world';
 import { createPhysicsWorld } from './instance';
 import { physicsEngineId } from './physics-selector';
 import { DelayEvent } from './physics-internal-types';
 import { IPhysicsConfig, ICollisionMatrix } from '../../physics/framework/physics-config';
 import { CollisionMatrix } from '../../physics/framework/collision-matrix';
 import { ERaycast2DType, RaycastResult2D, PHYSICS_2D_PTM_RATIO, PhysicsGroup } from './physics-types';
 import { Collider2D } from './components/colliders/collider-2d';
 import { legacyCC } from '../../core/global-exports';
 
 legacyCC.internal.PhysicsGroup = PhysicsGroup;
 
 let instance: PhysicsSystem2D | null = null;
 
 export class PhysicsSystem2D extends Eventify(System) {
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
        if (!EDITOR) {
            this.physicsWorld.setAllowSleep(v);
        }
    }

    /**
     * @en
     * Gets or sets the value of gravity in the physical world, which defaults to (0, -10).
     * @zh
     * 获取或设置物理世界的重力数值，默认为 (0, -10)。
     */
    get gravity (): Vec2 {
        return this._gravity;
    }
    set gravity (gravity: Vec2) {
        this._gravity.set(gravity);
        if (!EDITOR) {
            this.physicsWorld.setGravity(new Vec2(gravity.x / PHYSICS_2D_PTM_RATIO, gravity.y / PHYSICS_2D_PTM_RATIO));
        }
    }

    /**
     * @en
     * Gets or sets the maximum number of simulated substeps per frame.
     * @zh
     * 获取或设置每帧模拟的最大子步数。
     */
    get maxSubSteps () {
        return this._maxSubSteps;
    }

    set maxSubSteps (value: number) {
        this._maxSubSteps = value;
    }

    /**
     * @en
     * Gets or sets the fixed delta time consumed by each simulation step.
     * @zh
     * 获取或设置每步模拟消耗的固定时间。
     */
    get fixedTimeStep () {
        return this._fixedTimeStep;
    }

    set fixedTimeStep (value: number) {
        this._fixedTimeStep = value;
    }

    /**
     * @en
     * Turn on or off the automatic simulation.
     * @zh
     * 获取或设置是否自动模拟。
     */
    get autoSimulation () {
        return this._autoSimulation;
    }

    set autoSimulation (value: boolean) {
        this._autoSimulation = value;
    }

    get debugDrawFlags () {
        return this.physicsWorld.debugDrawFlags;
    }
    set debugDrawFlags (v) {
        this.physicsWorld.debugDrawFlags = v;
    }

    /**
     * @en
     * The velocity iterations for the velocity constraint solver.
     * @zh
     * 速度更新迭代数
     */
    public velocityIterations = 10;
    /**
     * @en
     * The position Iterations for the position constraint solver.
     * @zh
     * 位置迭代更新数
     */
    public positionIterations = 10;

    /**
     * @en
     * Gets the wrappered object of the physical world through which you can access the actual underlying object.
     * @zh
     * 获取物理世界的封装对象，通过它你可以访问到实际的底层对象。
     */
    readonly physicsWorld: IPhysicsWorld;

    /**
     * @en
     * Gets the ID of the system.
     * @zh
     * 获取此系统的ID。
     */
    static readonly ID = 'PHYSICS_2D';

    static get PHYSICS_NONE () {
        return !physicsEngineId;
    }

    static get PHYSICS_BUILTIN () {
        return physicsEngineId === 'builtin';
    }

    static get PHYSICS_BOX2D () {
        return physicsEngineId === 'box2d';
    }

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
    static get instance (): PhysicsSystem2D {
        if (!instance) {
            instance = new PhysicsSystem2D();
        }
        return instance;
    }

    /**
     * @en
     * Gets the collision matrix。
     * @zh
     * 获取碰撞矩阵。
     */
    readonly collisionMatrix: ICollisionMatrix = new CollisionMatrix() as unknown as ICollisionMatrix;

    private _enable = true;
    private _allowSleep = true;
    private _maxSubSteps = 1;
    private _fixedTimeStep = 1.0 / 60.0;
    private _autoSimulation = true;
    private _accumulator = 0;
    private _steping = false;
    private readonly _gravity = new Vec2(0, -10 * PHYSICS_2D_PTM_RATIO);

    private _delayEvents: DelayEvent[] = [];

    get stepping () {
        return this._steping;
    }

    private constructor () {
        super();

        const config = game.config ? game.config.physics as IPhysicsConfig : null;
        if (config) {
            Vec2.copy(this._gravity, config.gravity as IVec2Like);
            this._gravity.multiplyScalar(PHYSICS_2D_PTM_RATIO);

            this._allowSleep = config.allowSleep as boolean;
            this._fixedTimeStep = config.fixedTimeStep as number;
            this._maxSubSteps = config.maxSubSteps as number;
            this._autoSimulation = config.autoSimulation as boolean;

            if (config.collisionMatrix) {
                for (const i in config.collisionMatrix) {
                    const bit = parseInt(i);
                    const value = 1 << parseInt(i);
                    this.collisionMatrix[`${value}`] = config.collisionMatrix[bit];
                }
            }

            if (config.collisionGroups) {
                const cg = config.collisionGroups;
                if (cg instanceof Array) {
                    cg.forEach((v) => { PhysicsGroup[v.name] = 1 << v.index; });
                    Enum.update(PhysicsGroup);
                }
            }
        }

        this.physicsWorld = createPhysicsWorld();
        this.gravity = this._gravity;
        this.allowSleep = this._allowSleep;
    }

    /**
     * @en
     * Perform a simulation of the physics system, which will now be performed automatically on each frame.
     * @zh
     * 执行一次物理系统的模拟，目前将在每帧自动执行一次。
     * @param deltaTime 与上一次执行相差的时间，目前为每帧消耗时间
     */
    postUpdate (deltaTime: number) {
        if (!this._enable) {
            return;
        }
        if (!this._autoSimulation) {
            return;
        }

        director.emit(Director.EVENT_BEFORE_PHYSICS);

        this._steping = true;

        const fixedTimeStep = this._fixedTimeStep;
        const velocityIterations = this.velocityIterations;
        const positionIterations = this.positionIterations;

        this._accumulator += deltaTime;
        let substepIndex = 0;
        while (substepIndex++ < this._maxSubSteps && this._accumulator > fixedTimeStep) {
            this.physicsWorld.step(fixedTimeStep, velocityIterations, positionIterations);
            this._accumulator -= fixedTimeStep;
        }

        const events = this._delayEvents;
        for (let i = 0, l = events.length; i < l; i++) {
            const event = events[i];
            event.func.call(event.target);
        }
        events.length = 0;

        this.physicsWorld.syncPhysicsToScene();

        if (this.debugDrawFlags) {
            this.physicsWorld.drawDebug();
        }

        this._steping = false;
        director.emit(Director.EVENT_AFTER_PHYSICS);
    }

    _callAfterStep (target: object, func: Function) {
        if (this._steping) {
            this._delayEvents.push({
                target,
                func,
            });
        } else {
            func.call(target);
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
    step (fixedTimeStep: number) {
        this.physicsWorld.step(fixedTimeStep, this.velocityIterations, this.positionIterations);
    }

    /**
     * @en
     * Raycast the world for all colliders in the path of the ray.
     * The raycast ignores colliders that contain the starting point.
     * @zh
     * 检测哪些碰撞体在给定射线的路径上，射线检测将忽略包含起始点的碰撞体。
     * @method rayCast
     * @param {Vec2} p1 - start point of the raycast
     * @param {Vec2} p2 - end point of the raycast
     * @param {RayCastType} type - optional, default is RayCastType.Closest
     * @param {number} mask - optional, default is 0xffffffff
     * @return {[PhysicsRayCastResult]}
     */
    raycast (p1: IVec2Like, p2: IVec2Like, type: ERaycast2DType = ERaycast2DType.Closest, mask = 0xffffffff): readonly Readonly<RaycastResult2D>[] {
        return this.physicsWorld.raycast(p1, p2, type, mask);
    }

    /**
     * @en Test which colliders contain the point.
     * @zh 检测给定点在哪些碰撞体内。
     */
    testPoint (p: Vec2): readonly Collider2D[] {
        return this.physicsWorld.testPoint(p);
    }

    /**
     * @en Test which colliders contain the point.
     * @zh 检测给定点在哪些碰撞体内。
     */
    testAABB (rect: Rect): readonly Collider2D[] {
        return this.physicsWorld.testAABB(rect);
    }
}

director.once(Director.EVENT_INIT, () => {
    initPhysicsSystem();
});

function initPhysicsSystem () {
    if (!PhysicsSystem2D.PHYSICS_NONE && !EDITOR) {
        const sys = PhysicsSystem2D.instance;
        director.registerSystem(PhysicsSystem2D.ID, sys, sys.priority);
    }
}
