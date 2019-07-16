
import { instantiate } from '../impl-selector';
import { BuiltInBody } from './builtin-body';
import { BuiltInWorld } from './builtin-world';
import { BuiltinBoxShape } from './shapes/builtin-box-shape';
import { BuiltinSphereShape } from './shapes/builtin-sphere-shape';

instantiate(
    BuiltinBoxShape,
    BuiltinSphereShape,
    BuiltInBody,
    BuiltInWorld,
    );
