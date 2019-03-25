import { PhysicsWorldBase } from '../../physics/api';
import { createPhysicsWorld } from '../../physics/instance';

export class PhysicsSystem {
    private _world: PhysicsWorldBase;
    private _paused = false;
    private _singleStep = false;
    private _deltaTime = 1.0 / 60.0;

    constructor () {
        this._world = createPhysicsWorld();
    }

    public setSingleStep (b: boolean) {
        this._singleStep = b;
    }

    public resume () {
        this._paused = false;
    }

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
