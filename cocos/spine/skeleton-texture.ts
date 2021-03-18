/**
 * @packageDocumentation
 * @module spine
 */

import { ImageAsset, Material, Texture2D } from '../core';
import { Filter, WrapMode } from '../core/assets/asset-enum';
import spine from './lib/spine-core.js';

export class SkeletonTexture extends spine.Texture {
    name = 'sp.SkeletonTexture';
    _texture: Texture2D|ImageAsset | null = null;
    _material: Material | null = null;

    constructor (opt:ImageBitmap|HTMLImageElement) {
        super(opt);
        // TODO
    }

    setRealTexture (tex:Texture2D) {
        this._texture = tex;
    }

    getRealTexture (): Texture2D|null {
        if (!this._texture) { return null; }
        return this._texture instanceof ImageAsset ? this._texture._texture as Texture2D : this._texture;
    }

    setFilters (minFilter: spine.TextureFilter, magFilter: spine.TextureFilter) {
        if (this._texture) {
            this.getRealTexture()!.setFilters(convertFilter(minFilter), convertFilter(magFilter));
        }
    }

    setWraps (uWrap: spine.TextureWrap, vWrap: spine.TextureWrap) {
        if (this._texture) {
            this.getRealTexture()!.setWrapMode(convertWraps(uWrap), convertWraps(vWrap));
        }
    }

    dispose () { }
}

export function convertFilter (filter: spine.TextureFilter): Filter {
    switch (filter) {
    case spine.TextureFilter.Nearest:
    case spine.TextureFilter.MipMapNearestNearest:
    case spine.TextureFilter.MipMapLinearNearest:
        return Filter.NEAREST;
    case spine.TextureFilter.MipMap:
    case spine.TextureFilter.MipMapNearestLinear:
    case spine.TextureFilter.MipMapLinearLinear:
    case spine.TextureFilter.Linear:
    default:
        return Filter.LINEAR;
    }
}

export function convertWraps (wrap: spine.TextureWrap): WrapMode {
    switch (wrap) {
    case spine.TextureWrap.MirroredRepeat:
        return WrapMode.MIRRORED_REPEAT;
    case spine.TextureWrap.ClampToEdge:
        return WrapMode.CLAMP_TO_EDGE;
    case spine.TextureWrap.Repeat:
    default:
        return WrapMode.REPEAT;
    }
}
