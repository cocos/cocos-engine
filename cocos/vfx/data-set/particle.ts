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

import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../../core';
import { ArrayParameter, Handle, VFXParameterIdentity, VFXParameterNameSpace } from '../vfx-parameter';
import { VFXDataSet } from '../vfx-data-set';

export class ParticleDataSet extends VFXDataSet {
    public get capacity () {
        return this._capacity;
    }

    public get count () {
        return this._count;
    }

    private _count = 0;
    private _capacity = 16;

    constructor () {
        super(VFXParameterNameSpace.PARTICLE, true);
    }

    public addParticles (count: number) {
        if (DEBUG) {
            assertIsTrue(count >= 0);
        }
        let reservedCount = this.capacity;
        while (this._count + count > reservedCount) {
            reservedCount *= 2;
        }
        this.reserve(reservedCount);
        this._count += count;
    }

    public removeParticle (handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle >= 0 && handle < this._count);
        }
        const lastParticle = this._count - 1;
        if (lastParticle !== handle) {
            const parameters = this.parameters;
            for (let i = 0, length = this.parameterCount; i < length; i++) {
                (parameters[i] as ArrayParameter).move(lastParticle, handle);
            }
        }
        this._count -= 1;
    }

    public reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const parameters = this.parameters;
        for (let i = 0, length = this.parameterCount; i < length; i++) {
            (parameters[i] as ArrayParameter).reserve(capacity);
        }
    }

    public clear () {
        this._count = 0;
    }

    public reset () {
        this._count = 0;
        super.reset();
    }

    public markRequiredParameter (identity: VFXParameterIdentity) {
        if (!this.hasParameter(identity)) {
            this.addParameter(identity);
        }
    }

    protected doAddParameter (identity: VFXParameterIdentity) {
        const parameter = this.getParameterUnsafe<ArrayParameter>(identity);
        parameter.reserve(this._capacity);
    }
}
