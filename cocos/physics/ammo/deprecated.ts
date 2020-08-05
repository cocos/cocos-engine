import { removeProperty, replaceProperty, Vec3 } from "../../core";
import { AmmoCapsuleShape } from "./shapes/ammo-capsule-shape";
import { AmmoContactEquation } from "./ammo-contact-equation";

removeProperty(AmmoCapsuleShape.prototype, 'shape.prototype', [
    {
        'name': 'setHeight',
        'suggest': 'You should use the interface provided by the component.'
    }
])

replaceProperty(AmmoContactEquation.prototype, 'IContactEquation.prototype', [
    {
        'name': 'contactA',
        'newName': 'getLocalPointOnA',
        'customGetter': function (this: AmmoContactEquation) {
            const out = new Vec3();
            AmmoContactEquation.prototype.getLocalPointOnA.call(this, out);
            return out;
        }
    },
    {
        'name': 'contactB',
        'newName': 'getLocalPointOnB',
        'customGetter': function (this: AmmoContactEquation) {
            const out = new Vec3();
            AmmoContactEquation.prototype.getLocalPointOnB.call(this, out);
            return out;
        }
    },
    {
        'name': 'normal',
        'newName': 'getLocalNormalOnB',
        'customGetter': function (this: AmmoContactEquation) {
            const out = new Vec3();
            AmmoContactEquation.prototype.getLocalNormalOnB.call(this, out);
            return out;
        }
    },
])
