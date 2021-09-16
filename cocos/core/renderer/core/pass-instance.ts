/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @module material
 */

import { EffectAsset } from '../../assets/effect-asset';
import { MaterialInstance } from './material-instance';
import { BatchingSchemes, Pass, PassOverrides } from './pass';
import { overrideMacros, MacroRecord } from './pass-utils';

/**
 * @en A pass instance defines an variant version of the [[Pass]]
 * @zh 表示 [[Pass]] 的一种特殊实例
 */
export class PassInstance extends Pass {
    /**
     * @en The parent pass
     * @zh 相关联的原始 Pass
     */
    get parent () { return this._parent; }

    private _parent: Pass;

    private _owner: MaterialInstance;

    private _dontNotify = false;

    constructor (parent: Pass, owner: MaterialInstance) {
        super(parent.root);
        this._parent = parent;
        this._owner = owner;
        this._doInit(this._parent, true); // defines may change now
        for (let i = 0; i < this._shaderInfo.blocks.length; i++) {
            const u = this._shaderInfo.blocks[i];
            const block = this._blocks[u.binding];
            const parentBlock = this._parent.blocks[u.binding];
            block.set(parentBlock);
        }
        this._setRootBufferDirty(true);
        const paren = this._parent as PassInstance;
        for (let i = 0; i < this._shaderInfo.samplerTextures.length; i++) {
            const u = this._shaderInfo.samplerTextures[i];
            for (let j = 0; j < u.count; j++) {
                const sampler = paren._descriptorSet.getSampler(u.binding, j);
                const texture = paren._descriptorSet.getTexture(u.binding, j);
                this._descriptorSet.bindSampler(u.binding, sampler, j);
                this._descriptorSet.bindTexture(u.binding, texture, j);
            }
        }
        super.tryCompile();
    }

    /**
     * @en Override pipeline states with the given pass override info.
     * This won't affect the original pass
     * @zh 重载当前 Pass 的管线状态。这不会影响原始 Pass
     * @param original The original pass info
     * @param value The override pipeline state info
     */
    public overridePipelineStates (original: EffectAsset.IPassInfo, overrides: PassOverrides): void {
        this._bs.reset();
        this._rs.reset();
        this._dss.reset();

        Pass.fillPipelineInfo(this, original);
        Pass.fillPipelineInfo(this, overrides);
        this._onStateChange();
    }

    public tryCompile (defineOverrides?: MacroRecord) {
        if (defineOverrides) {
            if (!overrideMacros(this._defines, defineOverrides)) {
                return false;
            }
        }
        const res = super.tryCompile();
        this._onStateChange();
        return res;
    }

    /**
     * @en Prepare to change states of the pass and do not notify the material to rebuild the pipeline state object
     * @zh 开始静默修改 Pass 相关状态，不会通知材质去重新构建管线状态对象。
     */
    public beginChangeStatesSilently () {
        this._dontNotify = true;
    }

    /**
     * @en End the silent states changing process, all state changes will be notified.
     * @zh 结束静默状态修改，所有修改将会开始通知材质。
     */
    public endChangeStatesSilently () {
        this._dontNotify = false;
    }

    protected _syncBatchingScheme () {
        this._defines.USE_BATCHING = this._defines.USE_INSTANCING = false;
        this._setBatchingScheme(BatchingSchemes.NONE);
    }

    protected _onStateChange () {
        this._setHash(Pass.getPassHash(this));
        this._owner.onPassStateChange(this._dontNotify);
    }
}
