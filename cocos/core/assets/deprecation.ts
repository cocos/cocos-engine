/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../utils';
import { Mesh } from './mesh';
import { TextureBase } from './texture-base';

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

removeProperty(TextureBase.prototype, 'TextureBase.prototype', [
    {
        name: 'hasPremultipliedAlpha',
    },
    {
        name: 'setPremultiplyAlpha',
    },
    {
        name: 'setFlipY',
    },
]);
