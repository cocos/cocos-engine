/**
 * @hidden
 */

import { CurveValueAdapter } from '../animation-curve';
import { Material } from '../../assets/material';
import { property, ccclass } from '../../data/class-decorator';
import { Pass, samplerLib } from '../../renderer';
import { GFXBindingType } from '../../gfx';
import { GFXTextureView } from '../../gfx/texture-view';
import { TextureBase } from '../../assets/texture-base';
import { SpriteFrame } from '../../assets';

@ccclass('cc.UniformCurveValueAdapter')
export class UniformCurveValueAdapter extends CurveValueAdapter {
    @property
    passIndex: number = 0;

    @property
    uniformName: string = '';

    constructor() {
        super();
    }
    
    public forTarget(target: Material) {
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
            return {
                set: (value: any) => {
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
