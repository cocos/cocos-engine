/**
 * @hidden
 */

import { instantiate } from '../impl-selector';
import { BuiltInBody } from './builtin-body';
import { BuiltInWorld } from './builtin-world';
import { BuiltinBoxShape } from './shapes/builtin-box-shape';
import { BuiltinSphereShape } from './shapes/builtin-sphere-shape';

if (CC_PHYSICS_BUILT_IN) {
    instantiate(
        BuiltinBoxShape,
        BuiltinSphereShape,
        BuiltInBody,
        BuiltInWorld,
        );
}
