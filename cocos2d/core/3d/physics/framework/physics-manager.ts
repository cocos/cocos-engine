/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { createPhysicsWorld } from './instance';
import { PhysicsMaterial } from './assets/physics-material';
import { PhysicsRayResult } from './physics-ray-result';

const { property, ccclass } = cc._decorator;

/**
 * !#en
 * Physical systems manager.
 * !#zh
 * 物理系统管理器。
 * @class Physics3DManager
 */
@ccclass("cc.Physics3DManager")
export class Physics3DManager {

    /**
     * !#en
     * Gets or sets whether to enable physical systems, which are not enabled by default.
     * !#zh
     * 获取或设置是否启用物理系统，默认不启用。
     * @property {boolean} enabled
     */
    get enabled (): boolean {
        return this._enabled;
    }
    set enabled (value: boolean) {
        this._enabled = value;
    }

    /**
     * !#en
     * Gets or sets whether the physical system allows automatic sleep, which defaults to true.
     * !#zh
     * 获取或设置物理系统是否允许自动休眠，默认为 true
     * @property {boolean} allowSleep
     */
    get allowSleep (): boolean {
        return this._allowSleep;
    }
    set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this.physicsWorld.allowSleep = this._allowSleep;
        }
    }

    /**
     * !#en
     * Gets or sets the maximum number of child steps per frame simulated.
     * !#zh
     * 获取或设置每帧模拟的最大子步数。
     * @property {number} maxSubStep
     */
    get maxSubStep (): number {
        return this._maxSubStep;
    }
    set maxSubStep (value: number) {
        this._maxSubStep = value;
    }

    /**
     * !#en
     * Gets or sets the fixed time consumed by each simulation step.
     * !#zh
     * 获取或设置每步模拟消耗的固定时间。
     * @property {number} deltaTime
     */
    get deltaTime (): number {
        return this._deltaTime;
    }
    set deltaTime (value: number) {
        this._deltaTime = value;
    }

    /**
     * !#en
     * Gets or sets whether to use a fixed time step.
     * !#zh
     * 获取或设置是否使用固定的时间步长。
     * @property {boolean} useFixedTime
     */
    get useFixedTime (): boolean {
        return this._useFixedTime;
    }
    set useFixedTime (value: boolean) {
        this._useFixedTime = value;
    }

    /**
     * !#en
     * Gets or sets the gravity value of the physical world, by default (0, -10, 0)
     * !#zh
     * 获取或设置物理世界的重力数值，默认为 (0, -10, 0)
     * @property {Vec3} gravity
     */
    get gravity (): cc.Vec3 {
        return this._gravity;
    }
    set gravity (gravity: cc.Vec3) {
        this._gravity.set(gravity);
        if (!CC_EDITOR && !CC_PHYSICS_BUILTIN) {
            this.physicsWorld.gravity = gravity;
        }
    }

    /**
     * !#en
     * Gets the global default physical material. Note that builtin is null
     * !#zh
     * 获取全局的默认物理材质，注意：builtin 时为 null
     * @property {PhysicsMaterial | null} defaultMaterial
     * @readonly
     */
    get defaultMaterial (): PhysicsMaterial | null {
        return this._material;
    }

    readonly physicsWorld: IPhysicsWorld;
    readonly raycastClosestResult = new PhysicsRayResult();
    readonly raycastResults: PhysicsRayResult[] = [];

    @property
    private _enabled = false;

    @property
    private _allowSleep = true;

    @property
    private readonly _gravity = new cc.Vec3(0, -10, 0);

    @property
    private _maxSubStep = 1;

    @property
    private _deltaTime = 1.0 / 60.0;

    @property
    private _useFixedTime = true;

    private readonly _material: cc.PhysicsMaterial | null = null;

    private readonly raycastOptions: IRaycastOptions = {
        'groupIndex': -1,
        'queryTrigger': true,
        'maxDistance': Infinity
    }

    private readonly raycastResultPool = new cc.RecyclePool(() => {
        return new PhysicsRayResult();
    }, 1);

    private constructor () {
        cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
        this.physicsWorld = createPhysicsWorld();
        if (!CC_PHYSICS_BUILTIN) {
            this.gravity = this._gravity;
            this.allowSleep = this._allowSleep;
            this._material = new PhysicsMaterial();
            this._material.friction = 0.1;
            this._material.restitution = 0.1;
            this._material.on('physics_material_update', this._updateMaterial, this);
            this.physicsWorld.defaultMaterial = this._material;
        }
    }

    /**
     * !#en
     * A physical system simulation is performed once and will now be performed automatically once per frame.
     * !#zh
     * 执行一次物理系统的模拟，目前将在每帧自动执行一次。
     * @method update
     * @param {number} deltaTime The time difference from the last execution is currently elapsed per frame
     */
    update (deltaTime: number) {
        if (CC_EDITOR) {
            return;
        }
        if (!this._enabled) {
            return;
        }

        cc.director.emit(cc.Director.EVENT_BEFORE_PHYSICS);

        if (this._useFixedTime) {
            this.physicsWorld.step(this._deltaTime);
        } else {
            this.physicsWorld.step(this._deltaTime, deltaTime, this._maxSubStep);
        }

        cc.director.emit(cc.Director.EVENT_AFTER_PHYSICS);
    }

    /**
     * !#en Detect all collision boxes and return all detected results, or null if none is detected. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
     * !#zh 检测所有的碰撞盒，并返回所有被检测到的结果，若没有检测到，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
     * @method raycast
     * @param {Ray} worldRay A ray in world space
     * @param {number|string} groupIndexOrName Collision group index or group name
     * @param {number} maxDistance Maximum detection distance
     * @param {boolean} queryTrigger Detect trigger or not
     * @return {PhysicsRayResult[] | null} Detected result
     */
    raycast (worldRay: cc.geomUtils.Ray, groupIndexOrName: number|string = 0, maxDistance = Infinity, queryTrigger = true): PhysicsRayResult[] | null {
        this.raycastResultPool.reset();
        this.raycastResults.length = 0;
        if (typeof groupIndexOrName == "string") {
            let groupIndex = cc.game.groupList.indexOf(groupIndexOrName);
            if (groupIndex == -1) groupIndex = 0;
            this.raycastOptions.groupIndex = groupIndex;
        } else {
            this.raycastOptions.groupIndex = groupIndexOrName;
        }
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        let result = this.physicsWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
        if (result) return this.raycastResults;
        return null;
    }

    /**
     * !#en Detect all collision boxes and return the detection result with the shortest ray distance. If not, return null value. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
     * !#zh 检测所有的碰撞盒，并返回射线距离最短的检测结果，若没有，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
     * @method raycastClosest
     * @param {Ray} worldRay A ray in world space
     * @param {number|string} groupIndexOrName Collision group index or group name
     * @param {number} maxDistance Maximum detection distance
     * @param {boolean} queryTrigger Detect trigger or not
     * @return {PhysicsRayResult|null} Detected result
     */
    raycastClosest (worldRay: cc.geomUtils.Ray, groupIndexOrName: number|string = 0, maxDistance = Infinity, queryTrigger = true): PhysicsRayResult|null {
        if (typeof groupIndexOrName == "string") {
            let groupIndex = cc.game.groupList.indexOf(groupIndexOrName);
            if (groupIndex == -1) groupIndex = 0;
            this.raycastOptions.groupIndex = groupIndex;
        } else {
            this.raycastOptions.groupIndex = groupIndexOrName;
        }
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        let result = this.physicsWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
        if (result) return this.raycastClosestResult;
        return null;
    }

    private _updateMaterial () {
        if (!CC_PHYSICS_BUILTIN) {
            this.physicsWorld.defaultMaterial = this._material;
        }
    }
}
