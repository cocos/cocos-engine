import { RenderableComponent } from '../3d/framework/renderable-component';
import { EffectAsset } from '../assets/effect-asset';
import { SpriteFrame } from '../assets/sprite-frame';
import { TextureBase } from '../assets/texture-base';
import { GFXBindingType, GFXTextureView } from '../gfx';
import { IDefineMap, PassOverrides } from '../renderer/core/pass';
import { getBindingFromHandle, getBindingTypeFromHandle } from '../renderer/core/pass-utils';
import { samplerLib } from '../renderer/core/sampler-lib';
import { murmurhash2_32_gc } from './murmurhash2_gc';
import { IPass } from './pass-interface';

export function _uploadProperty (pass: IPass, name: string, val: any) {
    const handle = pass.getHandle(name);
    if (handle === undefined) { return false; }
    const bindingType = getBindingTypeFromHandle(handle);
    if (bindingType === GFXBindingType.UNIFORM_BUFFER) {
        if (Array.isArray(val)) {
            pass.setUniformArray(handle, val);
        } else {
            pass.setUniform(handle, val);
        }
    } else if (bindingType === GFXBindingType.SAMPLER) {
        const binding = getBindingFromHandle(handle);
        if (val instanceof GFXTextureView) {
            pass.bindTextureView(binding, val);
        } else if (val instanceof TextureBase || val instanceof SpriteFrame) {
            const textureView: GFXTextureView | null = val.getGFXTextureView();
            if (!textureView || !textureView.texture.width || !textureView.texture.height) {
                // console.warn(`material '${this._uuid}' received incomplete texture asset '${val._uuid}'`);
                return false;
            }
            pass.bindTextureView(binding, textureView);
            if (val instanceof TextureBase) {
                pass.bindSampler(binding, samplerLib.getSampler(cc.game._gfxDevice, val.getSamplerHash()));
            }
        }
    }
    return true;
}

export function generateMaterailHash (mat: IMaterial) {
    let str = '';
    for (const pass of mat.passes) {
        str += pass.psoHash;
    }
    return murmurhash2_32_gc(str, 666);
}

export interface IMaterial {
    /**
     * @zh
     * 当前使用的 EffectAsset 资源。
     */
    readonly effectAsset: EffectAsset | null;

    /**
     * @zh
     * 当前使用的 EffectAsset 资源名。
     */
    readonly effectName: string;

    /**
     * @zh
     * 当前的 technique 索引。
     */
    readonly technique: number;

    /**
     * @zh
     * 当前正在使用的 pass 数组。
     */
    readonly passes: IPass[];

    /**
     * @zh
     * 材质的 hash。
     */
    readonly hash: number;

    readonly parent: IMaterial | null;
    readonly owner: RenderableComponent | null;

    /**
     * @zh
     * 重置材质的所有 uniform 参数数据为 effect 默认初始值。
     * @param clearPasses 是否同时重置当前正在用于渲染的 pass 数组内的信息
     */
    resetUniforms (clearPasses?: boolean): void;

    /**
     * @zh
     * 使用指定预处理宏重新编译当前 pass（数组）中的 shader。
     * @param overrides 新增的预处理宏列表，会覆盖进当前列表。
     * @param passIdx 要编译的 pass 索引，默认编译所有 pass。
     */
    recompileShaders (overrides: IDefineMap, passIdx?: number): void;

    /**
     * @zh
     * 使用指定管线状态重载当前的 pass（数组）。
     * @param overrides 新增的管线状态列表，会覆盖进当前列表。
     * @param passIdx 要重载的 pass 索引，默认重载所有 pass。
     */
    overridePipelineStates (overrides: PassOverrides, passIdx?: number): void;

    /**
     * @en
     * Convenient property setter provided for quick material setup.<br>
     * [[Pass.setUniform]] should be used instead<br>
     * if you need to do per-frame property update.
     * @zh
     * 设置材质 uniform 参数的统一入口。<br>
     * 注意如果需要每帧更新 uniform，建议使用 [[Pass.setUniform]] 以获得更好的性能。
     * @param name 要设置的 uniform 名字。
     * @param val 要设置的 uniform 值。
     * @param passIdx 要设置的 pass 索引，默认设置所有 pass。
     */
    setProperty (name: string, val: any, passIdx?: number): void;

    /**
     * @zh
     * 获取当前材质的指定 uniform 值。
     * @param name 要获取的 uniform 名字。
     * @param passIdx 要获取的源 pass 索引，默认遍历所有 pass，返回第一个找到指定名字的 uniform。
     */
    getProperty (name: string, passIdx?: number): any;

    /**
     * @zh
     * 销毁材质实例
     */
    destroy (): void;

    _onPassStateChanged (idx: number);
}
