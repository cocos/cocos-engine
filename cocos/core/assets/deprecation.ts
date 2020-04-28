/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../utils';
import { Mesh } from './mesh';

replaceProperty(Mesh.prototype, 'Mesh.prototype', [
    {
        name: 'renderingMesh',
        newName: 'renderingSubMeshes',
    },
]);

removeProperty(Mesh.prototype, 'Mesh.prototype', [
    {
        name: 'hasFlatBuffers',
    },
    {
        name: 'destroyFlatBuffers',
    },
]);
