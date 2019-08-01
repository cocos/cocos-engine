/**
 * @hidden
 */

import '../predefine';
import '../cocos/legacy';

// LOAD ENGINE CORE
export * from '../cocos/scene-graph';
export * from '../cocos/core';
import * as renderer from '../cocos/renderer';
export { renderer };
cc.renderer = renderer;

export * from '../cocos/assets';
export * from '../cocos/load-pipeline';
export * from '../cocos/components';
export * from '../cocos/3d';
export * from '../cocos/gfx';
import '../cocos/pipeline';
export * from '../extensions/ccpool/node-pool';

const cclegacy = cc;
export { cclegacy };

export * from '../cocos/deprecated';
export { vmath } from '../cocos/vmath';