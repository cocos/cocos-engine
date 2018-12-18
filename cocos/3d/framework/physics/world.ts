
// @ts-check

import { PhysicalBody } from './body';
import CANNON from 'cannon';

export class PhysicalWorld {
    private _cannonWorld: CANNON.World;

    constructor() {
        this._cannonWorld = new CANNON.World();
        this._cannonWorld.gravity.set(0, -9.82, 0);
    }

    addBody(body: PhysicalBody) {
        this._cannonWorld.addBody(body._getCannonBody());
    }

    removeBody(body: PhysicalBody) {
        this._cannonWorld.remove(body._getCannonBody());
    }

    step(deltaTime: number) {
        this._cannonWorld.step(deltaTime);
    }
}