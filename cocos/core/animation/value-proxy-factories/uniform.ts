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
    @property
    public passIndex: number = 0;

    /**
     * @en Uniform name.
     * @zh Uniform 名称。
     */
    @property
    public uniformName: string = '';

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
                    const texture = value.getGFXTexture();
                    if (!texture || !texture.width || !texture.height) { return; }
                    pass.bindTexture(binding, texture);
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
