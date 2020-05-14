/**
 * @hidden
 */

import { legacyCC } from '../cocos/core/global-exports';
// has to import predefines first
import '../predefine';

// tslint:disable-next-line: ordered-imports
import '../cocos/core/legacy';

// LOAD ENGINE CORE
export * from '../cocos/core';
import * as renderer from '../cocos/core/renderer';
export { renderer };
legacyCC.renderer = renderer;

export * from '../extensions/ccpool/node-pool';

export { legacyCC as cclegacy };

import * as primitives from '../cocos/core/primitive';
export {
    primitives,
};
legacyCC.primitives = primitives;
export * from '../cocos/core/primitive/primitive';
