
import { PhysicsMaterial } from '../../assets/physics/material';

export const DefaultPhysicsMaterial: PhysicsMaterial = (() => {
    const result = new PhysicsMaterial();
    result.friction = 0.3;
    result.restitution = 0.3;
    return result;
})();

cc.DefaultPhysicsMaterial = DefaultPhysicsMaterial;
