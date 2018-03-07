/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const RenderComponent = require('../core/components/CCRenderComponent');
const renderer = require('../core/renderer');
const renderEngine = require('../core/renderer/render-engine');
const SpriteMaterial = renderEngine.SpriteMaterial;

/**
 * !#en Render the TMX layer.
 * !#zh 渲染 TMX layer。
 * @class TiledLayer
 * @extends Component
 */
let TiledLayer = cc.Class({
    name: 'cc.TiledLayer',

    // Inherits from the abstract class directly,
    // because TiledLayer not create or maintains the sgNode by itself.
    extends: RenderComponent,

    ctor () {
        this._tiles = [];
        this._texGrids = [];
        this._textures = [];
        this._spriteTiles = {};

        this._tiledTiles = [];

        this._layerName = '';
        this._layerOrientation = null;
    },

    /**
     * !#en Gets the layer name.
     * !#zh 获取层的名称。
     * @method getLayerName
     * @return {String}
     * @example
     * let layerName = tiledLayer.getLayerName();
     * cc.log(layerName);
     */
    getLayerName () {
        return this._layerName;
    },

    /**
     * !#en Set the layer name.
     * !#zh 设置层的名称
     * @method SetLayerName
     * @param {String} layerName
     * @example
     * tiledLayer.setLayerName("New Layer");
     */
    setLayerName (layerName) {
        this._layerName = layerName;
    },

    /**
     * !#en Return the value for the specific property name.
     * !#zh 获取指定属性名的值。
     * @method getProperty
     * @param {String} propertyName
     * @return {*}
     * @example
     * let property = tiledLayer.getProperty("info");
     * cc.log(property);
     */
    getProperty (propertyName) {
        return this._properties[propertyName];
    },


    /**
     * !#en Returns the position in pixels of a given tile coordinate.
     * !#zh 获取指定 tile 的像素坐标。
     * @method getPositionAt
     * @param {Vec2|Number} pos position or x
     * @param {Number} [y]
     * @return {Vec2}
     * @example
     * let pos = tiledLayer.getPositionAt(cc.v2(0, 0));
     * cc.log("Pos: " + pos);
     * let pos = tiledLayer.getPositionAt(0, 0);
     * cc.log("Pos: " + pos);
     */
    getPositionAt (pos, y) {
        let x;
        if (y !== undefined) {
            x = Math.floor(pos);
            y = Math.floor(y);
        }
        else {
            x = Math.floor(pos.x);
            y = Math.floor(pos.y);
        }
        
        let ret;
        switch (this._layerOrientation) {
            case cc.TiledMap.Orientation.ORTHO:
                ret = this._positionForOrthoAt(x, y);
                break;
            case cc.TiledMap.Orientation.ISO:
                ret = this._positionForIsoAt(x, y);
                break;
            case cc.TiledMap.Orientation.HEX:
                ret = this._positionForHexAt(x, y);
                break;
        }
        return ret;
    },

    _positionForIsoAt (x, y) {
        return cc.p(
            this._mapTileSize.width / 2 * ( this._layerSize.width + x - y - 1),
            this._mapTileSize.height / 2 * (( this._layerSize.height * 2 - x - y) - 2)
        );
    },

    _positionForOrthoAt (x, y) {
        return cc.p(
            x * this._mapTileSize.width,
            (this._layerSize.height - y - 1) * this._mapTileSize.height
        );
    },

    _positionForHexAt (x, y) {
        let xy;
        let offset = this._tileset.tileOffset;

        let odd_even = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
        switch (this._staggerAxis) {
            case cc.TiledMap.StaggerAxis.STAGGERAXIS_Y:
                let diffX = 0;
                if (y % 2 === 1)
                {
                    diffX = this._mapTileSize.width/2 * odd_even;
                }
                xy = cc.p(x * this._mapTileSize.width+diffX+offset.x,
                    (this._layerSize.height - y - 1) * (this._mapTileSize.height-(this._mapTileSize.height-this._hexSideLength)/2)-offset.y);
                break;
            case cc.TiledMap.StaggerAxis.STAGGERAXIS_X:
                let diffY = 0;
                if (x % 2 === 1)
                {
                    diffY = this._mapTileSize.height/2 * -odd_even;
                }

                xy = cc.p(x * (this._mapTileSize.width-(this._mapTileSize.width-this._hexSideLength)/2)+offset.x,
                    (this._layerSize.height - y - 1) * this._mapTileSize.height + diffY-offset.y);
                break;
            default: 
                xy = cc.p(0, 0);
                break;
        }
        return xy;
    },

    /**
     * !#en
     * Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
     * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
     * If a tile is already placed at that position, then it will be removed.
     * !#zh
     * 设置给定坐标的 tile 的 gid (gid = tile 全局 id)，
     * tile 的 GID 可以使用方法 “tileGIDAt” 来获得。<br />
     * 如果一个 tile 已经放在那个位置，那么它将被删除。
     * @method setTileGID
     * @param {Number} gid
     * @param {Vec2|Number} posOrX position or x
     * @param {Number} flagsOrY flags or y
     * @param {Number} [flags]
     * @example
     * tiledLayer.setTileGID(1001, 10, 10, 1)
     */
    setTileGIDAt (gid, posOrX, flagsOrY, flags) {
        if (posOrX === undefined) {
            throw new Error("_ccsg.TMXLayer.setTileGID(): pos should be non-null");
        }
        let pos;
        if (flags !== undefined || !(posOrX instanceof cc.Vec2)) {
            // four parameters or posOrX is not a Vec2 object
            pos = cc.p(posOrX, flagsOrY);
        } else {
            pos = posOrX;
            flags = flagsOrY;
        }

        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        if(pos.x >= this._layerSize.width || pos.y >= this._layerSize.height || pos.x < 0 || pos.y < 0) {
            throw new Error("CCTiledLayer.setTileGID(): invalid position");
        }
        if (!this._tiles) {
            cc.logID(7206);
            return;
        }
        if (gid !== 0 && gid < this._tileset.firstGid) {
            cc.logID(7207, gid);
            return;
        }

        flags = flags || 0;
        let currentFlags = this.getTileFlagsAt(pos);
        let currentGID = this.getTileGIDAt(pos);

        if (currentGID === gid && currentFlags === flags) return;

        let gidAndFlags = (gid | flags) >>> 0;
        this._updateTileForGID(gidAndFlags, pos);
    },

    _updateTileForGID (gid, pos) {
        if (!this._texGrids[gid]) {
            return;
        }

        let idx = 0 | (pos.x + pos.y * this._layerSize.width);
        if (idx < this._tiles.length) {
            this._tiles[idx] = gid;
        }
    },

    /**
     * !#en
     * Returns the tile gid at a given tile coordinate. <br />
     * if it returns 0, it means that the tile is empty. <br />
     * !#zh
     * 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
     * 如果它返回 0，则表示该 tile 为空。<br />
     * @method getTileGIDAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     * @example
     * let tileGid = tiledLayer.getTileGIDAt(0, 0);
     */
    getTileGIDAt (pos, y) {
        if (pos === undefined) {
            throw new Error("_ccsg.TMXLayer.getTileGIDAt(): pos should be non-null");
        }
        let x = pos;
        if (y === undefined) {
            x = pos.x;
            y = pos.y;
        }
        if (x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0) {
            throw new Error("_ccsg.TMXLayer.getTileGIDAt(): invalid position");
        }
        if (!this._tiles) {
            cc.logID(7205);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        let tile = this._tiles[index];

        return (tile & cc.TiledMap.TileFlag.FLIPPED_MASK) >>> 0;
    },

    getTileFlagsAt (pos, y) {
        if(!pos)
            throw new Error("_ccsg.TMXLayer.getTileFlagsAt(): pos should be non-null");
        if(y !== undefined)
            pos = cc.p(pos, y);
        if(pos.x >= this._layerSize.width || pos.y >= this._layerSize.height || pos.x < 0 || pos.y < 0)
            throw new Error("_ccsg.TMXLayer.getTileFlagsAt(): invalid position");
        if(!this._tiles){
            cc.logID(7208);
            return null;
        }

        let idx = Math.floor(pos.x) + Math.floor(pos.y) * this._layerSize.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        let tile = this._tiles[idx];

        return (tile & cc.TiledMap.TileFlag.FLIPPED_ALL) >>> 0;
    },

    /**
     * !#en
     * Returns the tile (_ccsg.Sprite) at a given a tile coordinate. <br/>
     * The returned _ccsg.Sprite will be already added to the _ccsg.TMXLayer. Don't add it again.<br/>
     * The _ccsg.Sprite can be treated like any other _ccsg.Sprite: rotated, scaled, translated, opacity, color, etc. <br/>
     * You can remove either by calling: <br/>
     * - layer.removeChild(sprite, cleanup); <br/>
     * - or layer.removeTileAt(ccp(x,y));
     * !#zh
     * 通过指定的 tile 坐标获取对应的 tile(Sprite)。 返回的 tile(Sprite) 应是已经添加到 TMXLayer，请不要重复添加。<br/>
     * 这个 tile(Sprite) 如同其他的 Sprite 一样，可以旋转、缩放、翻转、透明化、设置颜色等。<br/>
     * 你可以通过调用以下方法来对它进行删除:<br/>
     * 1. layer.removeChild(sprite, cleanup);<br/>
     * 2. 或 layer.removeTileAt(cc.v2(x,y));
     * @method getTileAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {cc.TiledTile}
     * @example
     * let title = tiledLayer.getTileAt(100, 100);
     * cc.log(title);
     */
    getTiledTileAt (pos, y) {
        if (pos === undefined) {
            throw new Error("_ccsg.TMXLayer.getTileAt(): pos should be non-null");
        }
        let x = pos;
        if (y === undefined) {
            x = pos.x;
            y = pos.y;
        }
        if (x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0) {
            throw new Error("_ccsg.TMXLayer.getTileAt(): invalid position");
        }
        if (!this._tiles) {
            cc.logID(7204);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        return this._tiledTiles[index];
    },

    setTiledTileAt (pos, y, tiledTile) {
        if (pos === undefined) {
            throw new Error("_ccsg.TMXLayer.getTileAt(): pos should be non-null");
        }
        let x = pos;
        if (y === undefined) {
            x = pos.x;
            y = pos.y;
        }
        if (x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0) {
            throw new Error("_ccsg.TMXLayer.getTileAt(): invalid position");
        }
        if (!this._tiles) {
            cc.logID(7204);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        return this._tiledTiles[index] = tiledTile;
    },

    /**
     * !#en Return texture of cc.SpriteBatchNode.
     * !#zh 获取纹理。
     * @method getTexture
     * @return {Texture2D}
     * @example
     * let texture = tiledLayer.getTexture();
     * cc.log("Texture: " + texture);
     */
    getTexture () {
        return this._texture;
    },

    /**
     * !#en Set the texture of cc.SpriteBatchNode.
     * !#zh 设置纹理。
     * @method setTexture
     * @param {Texture2D} texture
     * @example
     * tiledLayer.setTexture(texture);
     */
    setTexture (texture){
        this._texture = texture;
        this._activateMaterial();
    },

    /**
     * !#en Gets layer size.
     * !#zh 获得层大小。
     * @method getLayerSize
     * @return {Size}
     * @example
     * let size = tiledLayer.getLayerSize();
     * cc.log("layer size: " + size);
     */
    getLayerSize () {
        return this._layerSize;
    },

    /**
     * !#en Size of the map's tile (could be different from the tile's size).
     * !#zh 获取 tile 的大小( tile 的大小可能会有所不同)。
     * @method getMapTileSize
     * @return {Size}
     * @example
     * let mapTileSize = tiledLayer.getMapTileSize();
     * cc.log("MapTile size: " + mapTileSize);
     */
    getMapTileSize () {
        return this._mapTileSize;
    },

    /**
     * !#en Tile set information for the layer.
     * !#zh 获取 layer 的 Tileset 信息。
     * @method getTileSet
     * @return {TMXTilesetInfo}
     * @example
     * let tileset = tiledLayer.getTileSet();
     */
    getTileSet () {
        return this._tileset;
    },

    /**
     * !#en Tile set information for the layer.
     * !#zh 设置 layer 的 Tileset 信息。
     * @method setTileSet
     * @param {TMXTilesetInfo} tileset
     * @example
     * tiledLayer.setTileSet(tileset);
     */
    setTileSet (tileset) {
        this._tileset = tileset;
    },

    /**
     * !#en Layer orientation, which is the same as the map orientation.
     * !#zh 获取 Layer 方向(同地图方向)。
     * @method getLayerOrientation
     * @return {Number}
     * @example
     * let orientation = tiledLayer.getLayerOrientation();
     * cc.log("Layer Orientation: " + orientation);
     */
    getLayerOrientation () {
        return this._layerOrientation;
    },


    /**
     * !#en properties from the layer. They can be added using Tiled.
     * !#zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
     * @method getProperties
     * @return {Array}
     * @example
     * let properties = tiledLayer.getProperties();
     * cc.log("Properties: " + properties);
     */
    getProperties () {
        return this._properties;
    },

    _init (tileset, layerInfo, mapInfo) {
        let size = layerInfo._layerSize;
        
        // layerInfo
        this._layerName = layerInfo.name;
        this._tiles = layerInfo._tiles;
        this._properties = layerInfo.properties;
        this._layerSize = size;
        this._minGID = layerInfo._minGID;
        this._maxGID = layerInfo._maxGID;
        this._opacity = layerInfo._opacity;
        this._staggerAxis = mapInfo.getStaggerAxis();
        this._staggerIndex = mapInfo.getStaggerIndex();
        this._hexSideLength = mapInfo.getHexSideLength();

        // tilesetInfo
        this._tileset = tileset;

        // mapInfo
        this._layerOrientation = mapInfo.orientation;
        this._mapTileSize = mapInfo.getTileSize();

        let tilesets = mapInfo._tilesets;
        if (tilesets) {
            this._textures.length = tilesets.length;
            this._texGrids.length = 0;
            for (let i = 0, l = tilesets.length; i < l; ++i) {
                let tilesetInfo = tilesets[i];
                let tex = tilesetInfo.sourceImage;
                this._textures[i] = tex;
                this._fillTextureGrids(tilesetInfo, i);
                if (tileset === tilesetInfo) {
                    this.setTexture(tex);
                }
            }
        }

        // offset (after layer orientation is set);
        this._offset = this._calculateLayerOffset(layerInfo.offset);

        if (this.layerOrientation === cc.TiledMap.Orientation.HEX) {
            let width = 0, height = 0;
            if (this._staggerAxis === cc.TiledMap.StaggerAxis.STAGGERAXIS_X) {
                height = mapInfo._tileSize.height * (this._layerSize.height + 0.5);
                width = (mapInfo._tileSize.width + this._hexSideLength) * Math.floor(this._layerSize.width / 2) + mapInfo._tileSize.width * (this._layerSize.width % 2);
            } else {
                width = mapInfo._tileSize.width * (this._layerSize.width + 0.5);
                height = (mapInfo._tileSize.height + this._hexSideLength) * Math.floor(this._layerSize.height / 2) + mapInfo._tileSize.height * (this._layerSize.height % 2);
            }
            this.node.setContentSize(width, height);
        } else {
            this.node.setContentSize(this._layerSize.width * this._mapTileSize.width,
                this._layerSize.height * this._mapTileSize.height);
        }
        this._useAutomaticVertexZ = false;
        this._vertexZvalue = 0;
    },

    _calculateLayerOffset (pos) {
        let ret = cc.p(0,0);
        switch (this.layerOrientation) {
            case cc.TiledMap.Orientation.ORTHO:
                ret = cc.p(pos.x * this._mapTileSize.width, -pos.y * this._mapTileSize.height);
                break;
            case cc.TiledMap.Orientation.ISO:
                ret = cc.p((this._mapTileSize.width / 2) * (pos.x - pos.y),
                    (this._mapTileSize.height / 2 ) * (-pos.x - pos.y));
                break;
            case cc.TiledMap.Orientation.HEX:
                if(this._staggerAxis === cc.TiledMap.StaggerAxis.STAGGERAXIS_Y)
                {
                    let diffX = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_EVEN) ? this._mapTileSize.width/2 : 0;
                    ret = cc.p(pos.x * this._mapTileSize.width + diffX,
                               -pos.y * (this._mapTileSize.height - (this._mapTileSize.width - this._hexSideLength) / 2));
                }
                else if(this._staggerAxis === cc.TiledMap.StaggerAxis.STAGGERAXIS_X)
                {
                    let diffY = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD) ? this._mapTileSize.height/2 : 0;
                    ret = cc.p(pos.x * (this._mapTileSize.width - (this._mapTileSize.width - this._hexSideLength) / 2),
                               -pos.y * this._mapTileSize.height + diffY);
                }
                break;
        }
        return ret;
    },

    _fillTextureGrids (tileset, texId) {
        let tex = this._textures[texId];
        if (!tex.loaded) {
            tex.once('load', function () {
                this._fillTextureGrids(tileset, texId);
            }, this);
            return;
        }
        if (!tileset.imageSize.width || !tileset.imageSize.height) {
            tileset.imageSize.width = tex.width;
            tileset.imageSize.height = tex.height;
        }
        let tw = tileset._tileSize.width,
            th = tileset._tileSize.height,
            imageW = tex.width,
            imageH = tex.height,
            spacing = tileset.spacing,
            margin = tileset.margin,

            cols = Math.floor((imageW - margin*2 + spacing) / (tw + spacing)),
            rows = Math.floor((imageH - margin*2 + spacing) / (th + spacing)),
            count = rows * cols,

            gid = tileset.firstGid,
            maxGid = tileset.firstGid + count,
            grids = this._texGrids,
            grid = null,
            override = grids[gid] ? true : false,
            texelCorrect = cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX ? 0.5 : 0;

        for (; gid < maxGid; ++gid) {
            // Avoid overlapping
            if (override && !grids[gid]) {
                override = false;
            }
            if (!override && grids[gid]) {
                break;
            }

            grid = {
                texId: texId,
                x: 0, y: 0, width: tw, height: th,
                t: 0, l: 0, r: 0, b: 0
            };
            tileset.rectForGID(gid, grid);
            grid.x += texelCorrect;
            grid.y += texelCorrect;
            grid.width -= texelCorrect*2;
            grid.height -= texelCorrect*2;
            grid.t = (grid.y) / imageH;
            grid.l = (grid.x) / imageW;
            grid.r = (grid.x + grid.width) / imageW;
            grid.b = (grid.y + grid.height) / imageH;
            grids[gid] = grid;
        }
    },

    _activateMaterial () {
        if (this._material) return;
        
        let texture = this._texture;
        let url = texture.url;
        let material = renderer.materialUtil.get(url);
        
        // Get material
        if (!material) {
            material = new SpriteMaterial();
            renderer.materialUtil.register(url, material);
        }
        // TODO: old texture in material have been released by loader
        material.texture = texture.getImpl();
        
        this._material = material;
    },
});

cc.TiledLayer = module.exports = TiledLayer;
