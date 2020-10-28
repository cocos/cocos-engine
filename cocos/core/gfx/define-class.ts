/**
 * Define gfx global classes here.
 */

export class GFXRect {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public width: number = 1,
        public height: number = 1,
    ) {}
}

export class GFXViewport {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public left: number = 0,
        public top: number = 0,
        public width: number = 0,
        public height: number = 0,
        public minDepth: number = 0,
        public maxDepth: number = 1,
    ) {}
}

export class GFXColor {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 0,
    ) {}
}

export class GFXOffset {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {}
}

export class GFXExtent {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public width: number = 0,
        public height: number = 0,
        public depth: number = 1,
    ) {}
}

export class GFXTextureSubres {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public mipLevel: number = 0,
        public baseArrayLayer: number = 0,
        public layerCount: number = 1,
    ) {}
}

export class GFXTextureCopy {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public srcSubres = new GFXTextureSubres(),
        public srcOffset = new GFXOffset(),
        public dstSubres = new GFXTextureSubres(),
        public dstOffset = new GFXOffset(),
        public extent = new GFXExtent(),
    ) {}
}

export class GFXBufferTextureCopy {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public buffStride: number = 0,
        public buffTexHeight: number = 0,
        public texOffset = new GFXOffset(),
        public texExtent = new GFXExtent(),
        public texSubres = new GFXTextureSubres(),
    ) {}
}
