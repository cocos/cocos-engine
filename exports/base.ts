/**
 * @hidden
 */

import { legacyGlobalExports } from '../cocos/core/global-exports';
// has to import predefines first
import '../predefine';

// tslint:disable-next-line: ordered-imports
import '../cocos/core/legacy';

// LOAD ENGINE CORE
export * from '../cocos/core';
import * as renderer from '../cocos/core/renderer';
export { renderer };
legacyGlobalExports.renderer = renderer;

export * from '../extensions/ccpool/node-pool';

export { legacyGlobalExports as cclegacy };

import * as primitives from '../cocos/core/primitive';
export {
    primitives,
};
legacyGlobalExports.primitives = primitives;
export * from '../cocos/core/primitive/primitive';
