/****************************************************************************
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
 ****************************************************************************/


import { Rect, Size, SpriteFrame, Texture2D, Vec2 } from '../core';
import { ccenum } from '../core/value-types/enum';
/**
 * !#en The orientation of tiled map.
 * !#zh Tiled Map 地图方向。
 * @enum TiledMap.Orientation
 * @static
 */
export enum Orientation {
    /**
     * !#en Orthogonal orientation.
     * !#zh 直角鸟瞰地图（90°地图）。
     * @property ORTHO
     * @type {Number}
     * @static
     */
    ORTHO = 0,

    /**
     * !#en Hexagonal orientation.
     * !#zh 六边形地图
     * @property HEX
     * @type {Number}
     * @static
     */
    HEX = 1,

    /**
     * Isometric orientation.
     * 等距斜视地图（斜45°地图）。
     * @property ISO
     * @type {Number}
     * @static
     */
    ISO = 2
}

ccenum(Orientation);

/**
 * The property type of tiled map.
 * @enum TiledMap.Property
 * @static
 */
export enum Property {
    /**
     * @property NONE
     * @type {Number}
     * @static
     */
    NONE = 0,

    /**
     * @property MAP
     * @type {Number}
     * @static
     */
    MAP = 1,

    /**
     * @property LAYER
     * @type {Number}
     * @static
     */
    LAYER = 2,

    /**
     * @property OBJECTGROUP
     * @type {Number}
     * @static
     */
    OBJECTGROUP = 3,

    /**
     * @property OBJECT
     * @type {Number}
     * @static
     */
    OBJECT = 4,

    /**
     * @property TILE
     * @type {Number}
     * @static
     */
    TILE = 5
}

ccenum(Property);

/**
 * The tile flags of tiled map.
 * @enum TiledMap.TileFlag
 * @static
 */
export enum TileFlag {
    /**
     * @property HORIZONTAL
     * @type {Number}
     * @static
     */
    HORIZONTAL = 0x80000000,

    /**
     * @property VERTICAL
     * @type {Number}
     * @static
     */
    VERTICAL = 0x40000000,

    /**
     * @property DIAGONAL
     * @type {Number}
     * @static
     */
    DIAGONAL = 0x20000000,

    /**
     * @property FLIPPED_ALL
     * @type {Number}
     * @static
     */
    FLIPPED_ALL = (0x80000000 | 0x40000000 | 0x20000000 | 0x10000000) >>> 0,

    /**
     * @property FLIPPED_MASK
     * @type {Number}
     * @static
     */
    FLIPPED_MASK = (~(0x80000000 | 0x40000000 | 0x20000000 | 0x10000000)) >>> 0
}

ccenum(TileFlag);

/**
 * !#en The stagger axis of Hex tiled map.
 * !#zh 六边形地图的 stagger axis 值
 * @enum TiledMap.StaggerAxis
 * @static
 */
export enum StaggerAxis {
    /**
     * @property STAGGERAXIS_X
     * @type {Number}
     * @static
     */
    STAGGERAXIS_X = 0,

    /**
     * @property STAGGERAXIS_Y
     * @type {Number}
     * @static
     */
    STAGGERAXIS_Y = 1
}

ccenum(StaggerAxis);

/**
 * !#en The stagger index of Hex tiled map.
 * !#zh 六边形地图的 stagger index 值
 * @enum TiledMap.RenderOrder
 * @static
 */
export enum StaggerIndex {
    /**
     * @property STAGGERINDEX_ODD
     * @type {Number}
     * @static
     */
    STAGGERINDEX_ODD = 0,

    /**
     * @property STAGGERINDEX_EVEN
     * @type {Number}
     * @static
     */
    STAGGERINDEX_EVEN = 1
}
ccenum(StaggerIndex);

/**
 * !#en The render order of tiled map.
 * !#zh 地图的渲染顺序
 * @enum TiledMap.RenderOrder
 * @static
 */
export enum RenderOrder {
    /**
     * @property RightDown
     * @type {Number}
     * @static
     */
    RightDown = 0,
    /**
     * @property RightUp
     * @type {Number}
     * @static
     */
    RightUp = 1,
    /**
     * @property LeftDown
     * @type {Number}
     * @static
     */
    LeftDown = 2,
    /**
     * @property LeftUp
     * @type {Number}
     * @static
     */
    LeftUp = 3,
}

ccenum(RenderOrder);

/**
 * !#en TiledMap Object Type
 * !#zh 地图物体类型
 * @enum TiledMap.TMXObjectType
 * @static
 */
export enum TMXObjectType {
    /**
     * @property RECT
     * @type {Number}
     * @static
     */
    RECT = 0,

    /**
     * @property ELLIPSE
     * @type {Number}
     * @static
     */
    ELLIPSE = 1,

    /**
     * @property POLYGON
     * @type {Number}
     * @static
     */
    POLYGON = 2,

    /**
     * @property POLYLINE
     * @type {Number}
     * @static
     */
    POLYLINE = 3,

    /**
     * @property IMAGE
     * @type {Number}
     * @static
     */
    IMAGE = 4,

    /**
     * @property TEXT
     * @type {Number}
     * @static
     */
    TEXT = 5,
}

ccenum(TMXObjectType);

export interface MixedGID extends Number {
    _mixed: string
}
export interface GID extends Number {
    _gid: string;
}
export interface GIDFlags extends Number {
    _flags: number;
}


/**
 * Size in pixels of the image
 * @property {cc.Size} imageSize
 */
export class TMXTilesetInfo {
    // Tileset name
    name = "";
    // First grid
    firstGid: GID = 0 as any;
    // Spacing
    spacing = 0;
    // Margin
    margin = 0;
    // Texture containing the tiles (should be sprite sheet / texture atlas)
    sourceImage?: SpriteFrame;
    // Size in pixels of the image

    imageName: string | null = null;

    imageSize = new Size(0, 0);

    tileOffset = new Vec2(0, 0);

    _tileSize = new Size(0, 0);

    collection = false;

    rectForGID(gid_: MixedGID | GID, result?: TiledGrid) {
        let rect = result || new Rect(0, 0, 0, 0);
        rect.width = this._tileSize.width;
        rect.height = this._tileSize.height;
        let gid = gid_ as unknown as number;
        gid &= TileFlag.FLIPPED_MASK;
        gid = gid - (this.firstGid as unknown as number);
        let max_x = Math.round((this.imageSize.width - this.margin * 2 + this.spacing) / (this._tileSize.width + this.spacing));
        rect.x = Math.round((gid % max_x) * (this._tileSize.width + this.spacing) + this.margin);
        rect.y = Math.round(Math.floor(gid / max_x) * (this._tileSize.height + this.spacing) + this.margin);
        return rect;
    }
};


export interface TiledGrid {

    // record texture id
    // texId: TexID;
    // record belong to which tileset
    tileset: TMXTilesetInfo;
    x: number;
    y: number;
    width: number;
    height: number;
    t: number;
    l: number;
    r: number;
    b: number;
    cx: number;
    cy: number;
    offsetX: number;
    offsetY: number;
    rotated: boolean;
    gid: GID;
    spriteFrame: SpriteFrame;
    texture: Texture2D;

    _name?: string;
    _rect?: Rect;
    _rotated?: boolean;
}


export type TiledTextureGrids = Map<GID, TiledGrid>;