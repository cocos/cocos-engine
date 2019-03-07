
import { PhysicsMaterial } from '../../assets/physics/material';

export const DefaultPhysicsMaterial: PhysicsMaterial = (() => {
    const result = new PhysicsMaterial();
    result.friction = -1;
    result.restitution = -1;
    return result;
})();

cc.DefaultPhysicsMaterial = DefaultPhysicsMaterial;
