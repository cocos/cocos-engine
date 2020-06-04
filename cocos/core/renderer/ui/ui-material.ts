/*
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @hidden
 */

import { Material } from '../../assets/material';
import { Pool } from '../../memop';
import { Pass } from '../../renderer/core/pass';
import { IPSOCreateInfo } from '../scene/submodel';

export interface IUIMaterialInfo {
    material: Material;
}

export class UIMaterial {

    public get material (): Material {
        return this._material!;
    }

    public get pass (): Pass {
        return this._pass!;
    }

    protected _material: Material | null = null;
    protected _pass: Pass | null = null;
    private _psoCreateInfo: Pool<IPSOCreateInfo> | null;
    private _refCount: number = 0;

    constructor () {
        this._psoCreateInfo = null;
    }

    public initialize (info: IUIMaterialInfo): boolean {

        if (!info.material) {
            return false;
        }

        this._material = new Material();

        this._material.copy(info.material);

        this._pass = info.material.passes[0];
        this._pass.update();

        this._psoCreateInfo = new Pool(() => {
            const pso = this._pass!.createPipelineStateCI()!;
            return pso;
        }, 1);

        return true;
    }

    public increase () {
        this._refCount++;
        return this._refCount;
    }

    public decrease () {
        this._refCount--;
        if (this._refCount === 0) {
            this.destroy();
        }
        return this._refCount;
    }

    public getPipelineCreateInfo (): IPSOCreateInfo {
        return this._psoCreateInfo!.alloc();
    }

    public revertPipelineCreateInfo (psoCeateInfo: IPSOCreateInfo) {
        this._psoCreateInfo!.free(psoCeateInfo);
    }

    public destroy () {
        if (this._psoCreateInfo) {
            this._psoCreateInfo.clear((obj: IPSOCreateInfo) => {
                obj.bindingLayout.destroy();
            });
        }
        if (this._material) {
            this._material.destroy();
            this._material = null;
        }
        this._refCount = 0;
    }
}
