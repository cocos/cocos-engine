import { PhysicalWorld } from './world';

export class PhysicalSystem {
    private _world: PhysicalWorld;

    constructor() {
        this._world = new PhysicalWorld();
    }

    update(deltaTime: number) {
        this._world.step(deltaTime);
    }

    get world() {
        return this._world;
    }
}