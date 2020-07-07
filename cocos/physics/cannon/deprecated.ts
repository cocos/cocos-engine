import { replaceProperty, Vec3 } from "../../core";
import { CannonContactEquation } from "./cannon-contact-equation";

replaceProperty(CannonContactEquation.prototype, 'IContactEquation.prototype', [
    {
        'name': 'contactA',
        'newName': 'getLocalPointOnA',
        'customGetter': function (this: CannonContactEquation) {
            const out = new Vec3();
            CannonContactEquation.prototype.getLocalPointOnA.call(this, out);
            return out;
        }
    },
    {
        'name': 'contactB',
        'newName': 'getLocalPointOnB',
        'customGetter': function (this: CannonContactEquation) {
            const out = new Vec3();
            CannonContactEquation.prototype.getLocalPointOnB.call(this, out);
            return out;
        }
    },
    {
        'name': 'normal',
        'newName': 'getLocalNormalOnB',
        'customGetter': function (this: CannonContactEquation) {
            const out = new Vec3();
            CannonContactEquation.prototype.getLocalNormalOnB.call(this, out);
            return out;
        }
    },
])
