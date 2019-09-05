/**
 * @hidden
 */

import { PhysicsSystem } from "./physics-system";
import { replaceProperty } from "../../core";

replaceProperty(PhysicsSystem, 'PhysicsSystem', [
    {
        "name": "ins",
        "newName": "instance"
    }
]);