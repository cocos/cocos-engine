/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { cclegacy } from '@base/global';
// has to import predefines first
import '../predefine';
import '../cocos/core/legacy';
//TODO(PP): should rename it to render-scene
import * as renderer from '../cocos/render-scene';
import * as gfx from '../cocos/gfx';
import * as math from '@base/math';

// LOAD ENGINE CORE
export * from '../cocos/core';
export * from '@base/utils';
export * from '@base/event';
export * from '@base/math';
export { math };
export { cclegacy, VERSION } from '@base/global';
export { debug, log, error, warn, assert, logID, errorID, warnID, assertID, isDisplayStats, setDisplayStats, getError, DebugMode } from '@base/debug';
export { BitMask, Enum, ccenum, ValueType, CCClass, isCCClassOrFastDefined, CCObject, CCInteger, CCFloat, CCBoolean, CCString, editorExtrasTag, setPropertyEnumType, setPropertyEnumTypeOnAttrs, isCCObject, isValid } from '@base/object';

export * from '../cocos/rendering';
export * from '../cocos/rendering/custom/builtin-pipelines';
export * from '../cocos/scene-graph';
export * from '../cocos/misc';
export * from '../cocos/game';
export { Root } from '../cocos/root';
export * from '../cocos/serialization';

export { gfx };

export * from '../cocos/asset/assets';
export * from '../cocos/asset/asset-manager';

export { renderer };
cclegacy.renderer = renderer;
cclegacy.math = math;

export * from '../extensions/ccpool/node-pool';

export * from '../cocos/input/types';
export * from '../cocos/input';

export * from '../cocos/native-binding/index';

type Constructor_<T = unknown> = Constructor<T>;

export type { Constructor_ as Constructor };
