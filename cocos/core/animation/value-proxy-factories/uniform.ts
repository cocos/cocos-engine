/**
 * @hidden
 */

import { builtinResMgr } from '../../3d/builtin/init';
import { Material } from '../../assets/material';
import { SpriteFrame } from '../../assets/sprite-frame';
import { TextureBase } from '../../assets/texture-base';
import { ccclass, float, property } from '../../data/class-decorator';
import { GFXBindingType, GFXType } from '../../gfx/define';
import { Pass } from '../../renderer/core/pass';
import { getDefaultFromType } from '../../renderer/core/pass-utils';
import { samplerLib } from '../../renderer/core/sampler-lib';
import { IValueProxy, IValueProxyFactory } from '../value-proxy';
import { warn } from '../../platform/debug';
import { legacyCC } from '../../global-exports';

@ccclass('cc.animation.UniformProxyFactory')
export class UniformProxyFactory implements IValueProxyFactory {
    @property
    public passIndex: number = 0;

    @property
    public uniformName: string = '';

    /**
     * Use when your target is a single channel of the uniform instead of who uniform.
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
        if (handle === undefined) {
            throw new Error(`Material "${target.name}" has no uniform "${this.uniformName}"`);
        }
        const bindingType = Pass.getBindingTypeFromHandle(handle);
        if (bindingType === GFXBindingType.UNIFORM_BUFFER) {
            const realHandle = this.channelIndex === undefined ? handle : pass.getHandle(this.uniformName, this.channelIndex, GFXType.FLOAT);
            if (realHandle === undefined) {
                throw new Error(`Uniform "${this.uniformName} (in material ${target.name}) has no channel ${this.channelIndex}"`);
            }
            if (isUniformArray(pass, this.uniformName)) {
                return {
                    set: (value: any) => {
                        pass.setUniformArray(realHandle, value);
                    },
                };
            } else {
                return {
                    set: (value: any) => {
                        pass.setUniform(realHandle, value);
                    },
                };
            }
        } else if (bindingType === GFXBindingType.SAMPLER) {
            const binding = Pass.getBindingFromHandle(handle);
            const prop = pass.properties[this.uniformName];
            const texName = prop && prop.value ? prop.value + '-texture' : getDefaultFromType(prop.type) as string;
            let dftTex = builtinResMgr.get<TextureBase>(texName);
            if (!dftTex) {
                warn(`Illegal texture default value: ${texName}.`);
                dftTex = builtinResMgr.get<TextureBase>('default-texture');
            }
            return {
                set: (value: TextureBase | SpriteFrame) => {
                    if (!value) { value = dftTex; }
                    const tv = value.getGFXTextureView();
                    if (!tv || !tv.texture.width || !tv.texture.height) { return; }
                    pass.bindTextureView(binding, tv);
                    if (value instanceof TextureBase) {
                        pass.bindSampler(binding, samplerLib.getSampler(legacyCC.game._gfxDevice, value.getSamplerHash()));
                    }
                },
            };
        } else {
            throw new Error(`Animations are not available for uniforms with binding type ${bindingType}.`);
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
