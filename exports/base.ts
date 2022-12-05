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

import { legacyCC } from '../cocos/core/global-exports';
// has to import predefines first
import '../predefine';

// tslint:disable-next-line: ordered-imports
import '../cocos/core/legacy';
//TODO(PP): should rename it to render-scene
import * as renderer from '../cocos/render-scene';
import * as gfx from '../cocos/gfx';

// LOAD ENGINE CORE
export * from '../cocos/core';

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
legacyCC.renderer = renderer;

export * from '../extensions/ccpool/node-pool';

export * from '../cocos/input/types';
export * from '../cocos/input';

export * from '../cocos/native-binding/index';

type Constructor_<T = unknown> = Constructor<T>;

export type { Constructor_ as Constructor };
