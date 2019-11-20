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

import { IColliderWorld, IRaycastOptions } from '../spec/i-collider-world';
import { createColliderWorld } from './instance';
import { RecyclePool } from '../../../../renderer/memop';
import { Ray } from '../../../geom-utils';
import { ColliderRayResult } from './collider-ray-result';
import { property, ccclass } from '../../../platform/CCClassDecorator';

/**
 * !#en The collision system.
 * !#zh 碰撞系统。
 */
@ccclass("cc.Collision3DManager")
export class Collision3DManager {
    protected _executeInEditMode = false;

    /**
     * !#en Gets or sets whether the collision system is enabled and can be used to suspend or continue running the collision system.
     * !#zh 获取或设置是否启用碰撞系统，可以用于暂停或继续运行碰撞系统。
     */
    get enable (): boolean {
        return this._enable;
    }
    set enable (value: boolean) {
        this._enable = value;
    }

    readonly colliderWorld: IColliderWorld;
    readonly raycastClosestResult = new ColliderRayResult();
    readonly raycastResults: ColliderRayResult[] = [];

    @property
    private _enable = true;

    private readonly raycastOptions: IRaycastOptions = {
        'groupIndex': -1,
        'maxDistance': Infinity
    }

    private readonly raycastResultPool = new RecyclePool(() => {
        return new ColliderRayResult();
    }, 1);

    private constructor () {
        cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
        this.colliderWorld = createColliderWorld();
    }

    /**
     * !#en A physical system simulation is performed once and will now be performed automatically once per frame.
     * !#zh 执行一次物理系统的模拟，目前将在每帧自动执行一次。
     * @param deltaTime A physical system simulation is performed once and will now be performed automatically once per frame.
     */
    update (deltaTime: number) {
        if (CC_EDITOR && !this._executeInEditMode) {
            return;
        }
        if (!this._enable) {
            return;
        }
        this.colliderWorld.step(deltaTime);
    }

    /**
     * !#en Detect all collision boxes and return all detected results, or null if none is detected. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
     * !#zh 检测所有的碰撞盒，并返回所有被检测到的结果，若没有检测到，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
     * @param worldRay A ray in world space
     * @param groupIndexOrName Collision group index or group name
     * @param maxDistance Maximum detection distance
     * @return {ColliderRayResult[] | null} Detected result
     */
    raycast (worldRay: Ray, groupIndexOrName: number|string = 0, maxDistance = Infinity): ColliderRayResult[] | null {
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
        let result = this.colliderWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
        if (result) return this.raycastResults;
        return null;
    }

    /**
     * !#en Detect all collision boxes and return the detection result with the shortest ray distance. If not, return null value. Note that the return value is taken from the object pool, so do not save the result reference or modify the result.
     * 检测所有的碰撞盒，并返回射线距离最短的检测结果，若没有，则返回空值。注意返回值是从对象池中取的，所以请不要保存结果引用或者修改结果。
     * @param worldRay A ray in world space
     * @param groupIndexOrName Collision group index or group name
     * @param maxDistance Maximum detection distance
     * @return {ColliderRayResult | null} Detected result
     */
    raycastClosest (worldRay: Ray, groupIndexOrName: number|string = 0, maxDistance = Infinity): ColliderRayResult | null {
        if (typeof groupIndexOrName == "string") {
            let groupIndex = cc.game.groupList.indexOf(groupIndexOrName);
            if (groupIndex == -1) groupIndex = 0;
            this.raycastOptions.groupIndex = groupIndex;
        } else {
            this.raycastOptions.groupIndex = groupIndexOrName;
        }
        this.raycastOptions.maxDistance = maxDistance;
        let result = this.colliderWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
        if (result) return this.raycastClosestResult;
        return null;
    }
}
