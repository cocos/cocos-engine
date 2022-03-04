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
 * @hidden
 */

import { ccclass, float, serializable } from 'cc.decorator';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Material } from '../../assets/material';
import { SpriteFrame } from '../../../2d/assets/sprite-frame';
import { TextureBase } from '../../assets/texture-base';
import { Type } from '../../gfx';
import { Pass } from '../../renderer/core/pass';
import { getDefaultFromType } from '../../renderer/core/pass-utils';
import { IValueProxy, IValueProxyFactory } from '../value-proxy';
import { warn } from '../../platform/debug';
import { legacyCC } from '../../global-exports';

/**
 * @en
 * Value proxy factory for setting uniform on material target.
 * @zh
 * 用于设置材质目标上指定 Uniform 的曲线值代理工厂。
 */
@ccclass('cc.animation.UniformProxyFactory')
export class UniformProxyFactory implements IValueProxyFactory {
    /**
     * @en Pass index.
     * @zh Pass 索引。
     */
    @serializable
    public passIndex = 0;

    /**
     * @en Uniform name.
     * @zh Uniform 名称。
     */
    @serializable
    public uniformName = '';

    /**
     * @en
     * Specify the aimed channel of the uniform.
     * Use this when you're aiming at a single channel of the uniform instead of who uniform.
     * For example, only green(1) channel of a color uniform.
     * @zh
     * 指定目标 Uniform 的通道。
     * 当你希望设置 Uniform 单独的通道而非整个 Uniform 时应该当使用此字段。
     * 例如，仅设置颜色 Uniform 的红色通道。
     */
    @float
    public channelIndex: number | undefined = undefined;

    constructor (uniformName?: string, passIndex?: number) {
        this.passIndex = passIndex || 0;
        this.uniformName = uniformName || '';
    }

    public forTarget (target: Material): IValueProxy {
        const pass = target.passes[this.passIndex];
        const handle = pass.getHandle(this.uniformName);
        if (!handle) {
            throw new Error(`Material "${target.name}" has no uniform "${this.uniformName}"`);
        }
        const type = Pass.getTypeFromHandle(handle);
        if (type < Type.SAMPLER1D) {
            const realHandle = this.channelIndex === undefined ? handle : pass.getHandle(this.uniformName, this.channelIndex, Type.FLOAT);
            if (!realHandle) {
                throw new Error(`Uniform "${this.uniformName} (in material ${target.name}) has no channel ${this.channelIndex!}"`);
            }
            if (isUniformArray(pass, this.uniformName)) {
                return {
                    set: (value: any) => {
                        pass.setUniformArray(realHandle, value);
                    },
                };
            }
            return {
                set: (value: any) => {
                    pass.setUniform(realHandle, value);
                },
            };
        } else {
            const binding = Pass.getBindingFromHandle(handle);
            const prop = pass.properties[this.uniformName];
            const texName = prop && prop.value ? `${prop.value as string}-texture` : getDefaultFromType(prop.type) as string;
            let dftTex = builtinResMgr.get<TextureBase>(texName);
            if (!dftTex) {
                warn(`Illegal texture default value: ${texName}.`);
                dftTex = builtinResMgr.get<TextureBase>('default-texture');
            }
            return {
                set: (value: TextureBase | SpriteFrame) => {
                    if (!value) { value = dftTex; }
                    const texture = value.getGFXTexture();
                    if (!texture || !texture.width || !texture.height) { return; }
                    pass.bindTexture(binding, texture);
                    if (value instanceof TextureBase) {
                        pass.bindSampler(binding, legacyCC.game._gfxDevice.getSampler(value.getSamplerInfo()));
                    }
                },
            };
        }
    }
}

function isUniformArray (pass: Pass, name: string) {
    for (const block of pass.shaderInfo.blocks) {
        for (const uniform of block.members) {
            if (uniform.name === name) {
                return uniform.count > 1;
            }
        }
    }
    return false;
}
