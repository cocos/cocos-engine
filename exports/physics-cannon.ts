/**
 * @hidden
 */

import CANNON from '@cocos/cannon';
if (window) window.CANNON = CANNON;

// polyfill config
CANNON['CC_CONFIG'] = {
    'numSegmentsCone': 12,
    'numSegmentsCylinder': 12,
    'ignoreSelfBody': true,
}

// overwrite
CANNON.ArrayCollisionMatrix.prototype.reset = function () {
    for (let key in this.matrix) {
        delete this.matrix[key];
    }
}


import '../cocos/physics/cannon/instantiate';