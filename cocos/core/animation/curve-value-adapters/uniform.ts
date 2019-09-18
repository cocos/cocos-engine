/**
 * @hidden
 */

import { builtinResMgr } from '../../3d';
import { SpriteFrame, Texture2D } from '../../assets';
import { Material } from '../../assets/material';
import { TextureBase } from '../../assets/texture-base';
import { ccclass, property } from '../../data/class-decorator';
import { GFXBindingType } from '../../gfx';
import { GFXTextureView } from '../../gfx/texture-view';
import { Pass, samplerLib } from '../../renderer';
import { CurveValueAdapter } from '../animation-curve';

@ccclass('cc.UniformCurveValueAdapter')
export class UniformCurveValueAdapter extends CurveValueAdapter {
    @property
    public passIndex: number = 0;

    @property
    public uniformName: string = '';

    constructor () {
        super();
    }

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
            let defaultTexture: Texture2D | null = null;
            return {
                set: (value: any) => {
                    if (!value) {
                        value = defaultTexture || (defaultTexture = builtinResMgr.get<Texture2D>('default-texture'));
                    }
                    if (value instanceof GFXTextureView) {
                        pass.bindTextureView(binding, value);
                    } else if (value instanceof TextureBase || value instanceof SpriteFrame) {
                        const textureView: GFXTextureView | null = value.getGFXTextureView();
                        if (!textureView || !textureView.texture.width || !textureView.texture.height) {
                            // console.warn(`material '${this._uuid}' received incomplete texture asset '${val._uuid}'`);
                            return;
                        }
                        pass.bindTextureView(binding, textureView);
                        if (value instanceof TextureBase) {
                            pass.bindSampler(binding, samplerLib.getSampler(cc.game._gfxDevice, value.getSamplerHash()));
                        }
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
