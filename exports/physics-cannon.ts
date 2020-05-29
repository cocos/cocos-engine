/**
 * @hidden
 */

import CANNON from '@cocos/cannon';
if (window) window.CANNON = CANNON;

//polyfill config
CANNON['CC_CONFIG'] = {
    'numSegmentsCone': 12,
    'numSegmentsCylinder': 12,
    'ignoreSelfBody': true,
}

import '../cocos/physics/cannon/instantiate';