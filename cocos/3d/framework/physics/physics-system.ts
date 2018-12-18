import { PhysicalWorld } from './world';

export class PhysicsSystem {
    private _world: PhysicalWorld;

    constructor() {
        this._world = new PhysicalWorld();
    }

    public update(deltaTime: number) {
        this._world.step(deltaTime);
    }

    get world() {
        return this._world;
    }
}