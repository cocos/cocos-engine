import { replaceProperty } from '../utils';
import { Mesh } from './mesh';

replaceProperty(Mesh.prototype, 'Mesh.prototype', [
    {
        name: 'renderingMesh',
        newName: 'renderingSubMeshes',
    },
]);
