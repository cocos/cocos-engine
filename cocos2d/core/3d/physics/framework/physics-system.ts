/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { createPhysicsWorld } from './instance';
import { RecyclePool } from '../../../../renderer/memop';
import { Layers } from '../layers'
import { Ray } from '../../../geom-utils';
import { PhysicsRayResult } from './physics-ray-result';
import { property, ccclass } from '../../../platform/CCClassDecorator';

let director = cc.director;
let Director = cc.Director;

/**
 * @zh
 * 物理系统。
 */
@ccclass("cc.PhysicsSystem")
export class PhysicsSystem {
    protected _executeInEditMode = false;

    /**
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
     * 获取或设置物理系统是否允许自动休眠，默认为 true
     */
    get allowSleep (): boolean {
        return this._allowSleep;
    }
    set allowSleep (v: boolean) {
        this._allowSleep = v;
    }

    /**
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
     * @zh
     * 获取或设置是否使用固定的时间步长。
     */
    get useFixedTime () {
        return this._useFixedTime;
    }

    set useFixedTime (value: boolean) {
        this._useFixedTime = value;
    }

    static readonly instance: PhysicsSystem;
    static readonly ID: 'physics';

    readonly physicsWorld: IPhysicsWorld;
    readonly raycastClosestResult = new PhysicsRayResult();
    readonly raycastResults: PhysicsRayResult[] = [];

    @property
    private _enable = true;

    @property
    private _allowSleep = true;

    @property
    private _maxSubStep = 1;

    @property
    private _deltaTime = 1.0 / 60.0;

    @property
    private _useFixedTime = true;

    private readonly raycastOptions: IRaycastOptions = {
        'group': -1,
        'mask': -1,
        'queryTrigger': true,
        'maxDistance': Infinity
    }

    private readonly raycastResultPool = new RecyclePool(() => {
        return new PhysicsRayResult();
    }, 1);

    private constructor () {
        director._scheduler && director._scheduler.enableForTarget(this);
        this.physicsWorld = createPhysicsWorld();
    }

    /**
     * @zh
     * 执行一次物理系统的模拟，目前将在每帧自动执行一次。
     * @param deltaTime 与上一次执行相差的时间，目前为每帧消耗时间
     */
    update (deltaTime: number) {
        if (CC_EDITOR && !this._executeInEditMode) {
            return;
        }
        if (!this._enable) {
            return;
        }

        director.emit(Director.EVENT_BEFORE_PHYSICS);

        if (this._useFixedTime) {
            this.physicsWorld.step(this._deltaTime);
        } else {
            this.physicsWorld.step(this._deltaTime, deltaTime, this._maxSubStep);
        }
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
    raycast (worldRay: Ray, mask: number = Layers.Enum.DEFAULT, maxDistance = Infinity, queryTrigger = true): boolean {
        this.raycastResultPool.reset();
        this.raycastResults.length = 0;
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
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
    raycastClosest (worldRay: Ray, mask: number = Layers.Enum.DEFAULT, maxDistance = Infinity, queryTrigger = true): boolean {
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
    }
}
