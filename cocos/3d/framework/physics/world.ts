import CANNON from 'cannon';
import { RigidBody, RigidBodyType } from './body';

export class PhysicsWorld {
    private _cannonWorld: CANNON.World;
    private _bodys: Set<RigidBody>;

    constructor() {
        this._cannonWorld = new CANNON.World();
        this._cannonWorld.gravity.set(0, -9.82, 0);
        this._bodys = new Set();
    }

    public addBody(body: RigidBody) {
        this._cannonWorld.addBody(body._getCannonBody());
    }

    public removeBody(body: RigidBody) {
        this._cannonWorld.remove(body._getCannonBody());
    }

    public step(deltaTime: number) {
        this._bodys.forEach((physicalBody) => {
            if (physicalBody.type !== RigidBodyType.STATIC) {
                physicalBody.pull();
            }
        });

        this._cannonWorld.step(deltaTime);
    }
}
