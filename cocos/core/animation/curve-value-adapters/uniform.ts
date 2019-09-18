/**
 * @hidden
 */

import { builtinResMgr } from '../../3d/builtin/init';
import { Material } from '../../assets/material';
import { SpriteFrame } from '../../assets/sprite-frame';
import { TextureBase } from '../../assets/texture-base';
import { ccclass, property } from '../../data/class-decorator';
import { GFXBindingType } from '../../gfx/define';
import { _type2default, Pass } from '../../renderer/core/pass';
import { samplerLib } from '../../renderer/core/sampler-lib';
import { CurveValueAdapter } from '../animation-curve';

@ccclass('cc.UniformCurveValueAdapter')
export class UniformCurveValueAdapter extends CurveValueAdapter {
    @property
    public passIndex: number = 0;

    @property
    public uniformName: string = '';

    public forTarget (target: Material) {
        const pass = target.passes[this.passIndex];
        const handle = pass.getHandle(this.uniformName);
        if (handle === undefined) {
            throw new Error(`Material "${target.name}" has no uniform "${this.uniformName}"`);
        }
        const bindingType = Pass.getBindingTypeFromHandle(handle);
        if (bindingType === GFXBindingType.UNIFORM_BUFFER) {
            if (isUniformArray(pass, this.uniformName)) {
                return {
                    set: (value: any) => {
                        pass.setUniformArray(handle, value);
                    },
                };
            } else {
                return {
                    set: (value: any) => {
                        pass.setUniform(handle, value);
                    },
                };
            }
        } else if (bindingType === GFXBindingType.SAMPLER) {
            const binding = Pass.getBindingFromHandle(handle);
            const prop = pass.properties[this.uniformName];
            const texName = prop && prop.value ? prop.value + '-texture' : _type2default[prop.type];
            let dftTex = builtinResMgr.get<TextureBase>(texName);
            if (!dftTex) {
                console.warn('illegal texture default value: ' + texName);
                dftTex = builtinResMgr.get<TextureBase>('default-texture');
            }
            return {
                set: (value: TextureBase | SpriteFrame) => {
                    const tv = (value || dftTex).getGFXTextureView();
                    if (!tv || !tv.texture.width || !tv.texture.height) { return; }
                    pass.bindTextureView(binding, tv);
                    if (value instanceof TextureBase) {
                        pass.bindSampler(binding, samplerLib.getSampler(cc.game._gfxDevice, value.getSamplerHash()));
                    }
                },
            };
        } else {
            throw new Error(`Animations are not avaiable for uniforms with binding type ${bindingType}.`);
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

cc.UniformCurveValueAdapter = UniformCurveValueAdapter;
