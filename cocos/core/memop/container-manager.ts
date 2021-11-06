import { js } from '../utils/js';
import { ScalableContainer } from './scalable-container';

class ContainerManager {
    private _pools: ScalableContainer[] = [];
    private _lastShrinkPassed = 0;
    public shrinkTimeSpan = 5;

    addContainer (pool: ScalableContainer) {
        if (pool._poolHandle !== -1) return;
        this._pools.push(pool);
        pool._poolHandle = this._pools.length;
    }

    removeContainer (pool: ScalableContainer) {
        if (pool._poolHandle === -1) return;
        this._pools[this._pools.length - 1]._poolHandle = pool._poolHandle;
        js.array.fastRemoveAt(this._pools, pool._poolHandle);
        pool._poolHandle = -1;
    }

    tryShrink () {
        for (let i = 0; i < this._pools.length; i++) {
            this._pools[i].tryShrink();
        }
    }

    update (dt: number) {
        this._lastShrinkPassed += dt;
        if (this._lastShrinkPassed > this.shrinkTimeSpan) {
            this.tryShrink();
            this._lastShrinkPassed -= this.shrinkTimeSpan;
        }
    }
}

export const containerManager = new ContainerManager();
