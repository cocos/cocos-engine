/**
 * Define gfx global classes here.
 */

export class Rect {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public width: number = 1,
        public height: number = 1,
    ) {}
}

export class Viewport {
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

export class Color {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 0,
    ) {}
}

export class Offset {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {}
}

export class Extent {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public width: number = 0,
        public height: number = 0,
        public depth: number = 1,
    ) {}
}

export class TextureSubres {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public mipLevel: number = 0,
        public baseArrayLayer: number = 0,
        public layerCount: number = 1,
    ) {}
}

export class TextureCopy {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public srcSubres = new TextureSubres(),
        public srcOffset = new Offset(),
        public dstSubres = new TextureSubres(),
        public dstOffset = new Offset(),
        public extent = new Extent(),
    ) {}
}

export class BufferTextureCopy {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public buffStride: number = 0,
        public buffTexHeight: number = 0,
        public texOffset = new Offset(),
        public texExtent = new Extent(),
        public texSubres = new TextureSubres(),
    ) {}
}
