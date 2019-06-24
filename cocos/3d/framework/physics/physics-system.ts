/**
 * @internal
 * @module physics
 */
/**
 * @able
 */

import { PhysicsWorldBase } from '../../physics/api';
import { createPhysicsWorld } from '../../physics/instance';

/**
 * @zh
 * 物理系统。
 */
export class PhysicsSystem {
    private _world: PhysicsWorldBase;
    private _paused = false;
    private _singleStep = false;
    private _deltaTime = 1.0 / 60.0;

    constructor () {
        this._world = createPhysicsWorld();
    }

    /**
     * @zh
     * 设置是否只运行一步。
     * @param b - 布尔值
     */
    public setSingleStep (b: boolean) {
        this._singleStep = b;
    }

    /**
     * @zh
     * 继续。
     */
    public resume () {
        this._paused = false;
    }

    /**
     * @zh
     * 暂停。
     */
    public pause () {
        this._paused = true;
    }

    public update (deltaTime: number) {
        if (CC_EDITOR) {
            return;
        }
        if (this._paused) {
            return;
        }
        this._world.step(this._deltaTime);
        if (this._singleStep) {
            this._paused = true;
        }
    }

    get world () {
        return this._world;
    }
}
