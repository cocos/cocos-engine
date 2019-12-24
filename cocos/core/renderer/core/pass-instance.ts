/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category material
 */

import { IPassInfo } from '../../assets/effect-asset';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../../gfx/pipeline-state';
import { isBuiltinBinding } from '../../pipeline/define';
import { MaterialInstance } from './material-instance';
import { IBlock, Pass, PassOverrides } from './pass';
import { assignDefines, IDefineMap } from './pass-utils';

export class PassInstance extends Pass {

    get parent () { return this._parent; }

    private _parent: Pass;
    private _owner: MaterialInstance;
    private _dontNotify = false;

    constructor (parent: Pass, owner: MaterialInstance) {
        super(parent.device);
        this._parent = parent;
        this._owner = owner;
        this.resetPassInfo(this._parent);
        for (const u of this._shaderInfo.blocks) {
            if (isBuiltinBinding(u.binding)) {
                continue;
            }
            const block: IBlock = this._blocks[u.binding];
            const parentBlock: IBlock = this._parent.blocks[u.binding];
            block.view.set(parentBlock.view);
            block.dirty = true;
        }

        for (const u of this._shaderInfo.samplers) {
            if (isBuiltinBinding(u.binding)) {
                continue;
            }
            // @ts-ignore 2466
            this._textureViews[u.binding] = this._parent._textureViews[u.binding];
            // @ts-ignore 2466
            this._samplers[u.binding] = this._parent._samplers[u.binding];
        }
        this.tryCompile();
    }

    public overridePipelineStates (original: IPassInfo, overrides: PassOverrides): void {
        this._bs = new GFXBlendState();
        this._dss = new GFXDepthStencilState();
        this._rs = new GFXRasterizerState();
        Pass.fillinPipelineInfo(this as unknown as Pass, original);
        Pass.fillinPipelineInfo(this as unknown as Pass, overrides);
        this._onStateChange();
    }

    public tryCompile (defineOverrides?: IDefineMap) {
        if (defineOverrides) {
            if (!assignDefines(this._defines, defineOverrides)) {
                return false;
            }
        }
        const res = super.tryCompile();
        this._onStateChange();
        return res;
    }

    public createBatchedBuffer () {
        console.warn('pass instance have no batched buffer.');
    }

    public beginChangeStatesSilently () {
        this._dontNotify = true;
    }

    public endChangeStatesSilently () {
        this._dontNotify = false;
    }

    protected _onStateChange () {
        this._hash = Pass.getPSOHash(this);
        this._owner.onPassStateChange(this._dontNotify);
    }
}
