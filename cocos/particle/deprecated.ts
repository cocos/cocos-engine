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

/**
 * @packageDocumentation
 * @module particle
 */

import { removeProperty, replaceProperty } from '../core/utils/x-deprecated';
import Burst from './burst';
import { ParticleSystem } from './particle-system';
import { Billboard } from './billboard';
import { Line } from './line';
import { js } from '../core/utils/js';
import { legacyCC } from '../core/global-exports';

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
legacyCC.ParticleSystemComponent = ParticleSystem;
js.setClassAlias(ParticleSystem, 'cc.ParticleSystemComponent');
/**
 * Alias of [[Billboard]]
 * @deprecated Since v1.2
 */
export { Billboard as BillboardComponent };
legacyCC.BillboardComponent = Billboard;
js.setClassAlias(Billboard, 'cc.BillboardComponent');
/**
 * Alias of [[Line]]
 * @deprecated Since v1.2
 */
export { Line as LineComponent };
legacyCC.LineComponent = Line;
js.setClassAlias(Line, 'cc.LineComponent');
