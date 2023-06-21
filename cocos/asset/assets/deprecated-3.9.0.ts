import { replaceProperty } from '../../core/utils/x-deprecated';
import { BufferAsset } from './buffer-asset';

replaceProperty(
    BufferAsset.prototype,
    'BufferAsset',
    [{
        name: 'buffer',
        newName: 'bytes',
        target: BufferAsset.prototype,
        targetName: 'BufferAsset',
        customFunction: BufferAsset.prototype.buffer,
        logTimes: 1,
    }],
);
