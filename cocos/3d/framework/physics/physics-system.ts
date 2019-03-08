import { PhysicsWorldBase } from '../../physics/api';
import { createPhysicsWorld } from '../../physics/instance';

export class PhysicsSystem {
    private _world: PhysicsWorldBase;

    constructor () {
        this._world = createPhysicsWorld();
    }

    public update (deltaTime: number) {
        if (CC_EDITOR) {
            return;
        }
        this._world.step(deltaTime);
    }

    get world () {
        return this._world;
    }
}
