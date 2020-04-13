import { removeProperty } from "../../core";
import { AmmoCapsuleShape } from "./shapes/ammo-capsule-shape";

removeProperty(AmmoCapsuleShape.prototype, 'shape.prototype', [
    {
        'name': 'setHeight',
        'suggest': 'You should use the interface provided by the component.'
    }
])