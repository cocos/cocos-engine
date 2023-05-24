/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { removeProperty, replaceProperty, js, cclegacy } from '../core';
import Burst from './burst';
import { ParticleSystem } from './particle-system';
import { Billboard } from './billboard';
import { Line } from './line';

removeProperty(Burst.prototype, 'Burst.prototype', [
    {
        name: 'minCount',
    },
    {
        name: 'maxCount',
    },
]);

replaceProperty(ParticleSystem.prototype, 'ParticleSystem.prototype', [
    {
        name: 'enableCulling',
        newName: 'dataCulling',
    },
]);

/**
 * Alias of [[ParticleSystem]]
 * @deprecated Since v1.2
 */
export { ParticleSystem as ParticleSystemComponent };
cclegacy.ParticleSystemComponent = ParticleSystem;
js.setClassAlias(ParticleSystem, 'cc.ParticleSystemComponent');
/**
 * Alias of [[Billboard]]
 * @deprecated Since v1.2
 */
export { Billboard as BillboardComponent };
cclegacy.BillboardComponent = Billboard;
js.setClassAlias(Billboard, 'cc.BillboardComponent');
/**
 * Alias of [[Line]]
 * @deprecated Since v1.2
 */
export { Line as LineComponent };
cclegacy.LineComponent = Line;
js.setClassAlias(Line, 'cc.LineComponent');
