/**
 * @hidden
 */

import '../predefine';
import '../cocos/legacy';

// LOAD ENGINE CORE
export * from '../cocos/core';
import * as renderer from '../cocos/core/renderer';
export { renderer };
cc.renderer = renderer;

export * from '../extensions/ccpool/node-pool';

const cclegacy = cc;
export { cclegacy };

export * from '../cocos/core/utils/deprecated';

import * as primitives from '../cocos/core/primitive';
export {
    primitives,
};
cc.primitives = primitives;