/*
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
import { fastRemoveAt } from '../utils/array';
import { ScalableContainer } from './scalable-container';

/**
 * @en ContainerManager is a sequence container that stores ScalableContainers.
 * It will shrink all managed ScalableContainer in a fixed interval.
 */
class ContainerManager {
    private _pools: ScalableContainer[] = [];
    private _lastShrinkPassed = 0;
    /**
     * @en Shrink interval in seconds.
     */
    public shrinkTimeSpan = 5;

    /**
     * @en Add a ScalableContainer. Will add the same ScalableContainer instance once.
     * @param pool @en The ScalableContainer to add.
     */
    addContainer (pool: ScalableContainer) {
        if (pool._poolHandle !== -1) return;
        pool._poolHandle = this._pools.length;
        this._pools.push(pool);
    }

    /**
     * @en Remove a ScalableContainer.
     * @param pool @en The ScalableContainer to remove.
     */
    removeContainer (pool: ScalableContainer) {
        if (pool._poolHandle === -1) return;
        this._pools[this._pools.length - 1]._poolHandle = pool._poolHandle;
        fastRemoveAt(this._pools, pool._poolHandle);
        pool._poolHandle = -1;
    }

    /**
     * @en Try to shrink all managed ScalableContainers.
     */
    tryShrink () {
        for (let i = 0; i < this._pools.length; i++) {
            this._pools[i].tryShrink();
        }
    }

    /**
     * @en An update function invoked every frame.
     * @param dt @en Delta time of frame interval in secondes.
     */
    update (dt: number) {
        this._lastShrinkPassed += dt;
        if (this._lastShrinkPassed > this.shrinkTimeSpan) {
            this.tryShrink();
            this._lastShrinkPassed -= this.shrinkTimeSpan;
        }
    }
}

/**
 * @en A global ContainerManager instance.
 */
export const containerManager = new ContainerManager();
