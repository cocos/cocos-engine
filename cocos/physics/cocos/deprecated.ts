/**
 * @hidden
 */

import { removeProperty } from "../../core";
import { BuiltinCapsuleShape } from "./shapes/builtin-capsule-shape";

removeProperty(BuiltinCapsuleShape.prototype, 'shape.prototype', [
    {
        'name': 'setHeight',
        'suggest': 'You should use the interface provided by the component.'
    }
])