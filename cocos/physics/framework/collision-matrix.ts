
import { PhysicsGroup } from './physics-enum';

export class CollisionMatrix {
    constructor () {
        for (let i = 0; i < 32; i++) {
            const key = 1 << i;
            this[`${key}`] = 0;
        }
        this[`1`] = PhysicsGroup.DEFAULT;
    }
}