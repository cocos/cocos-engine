import { PhysicsWorld } from './world';

export class PhysicsSystem {
    private _world: PhysicsWorld;

    constructor() {
        this._world = new PhysicsWorld();
    }

    public update(deltaTime: number) {
        if (CC_EDITOR) {
            return;
        }
        this._world.step(deltaTime);
    }

    get world() {
        return this._world;
    }
}