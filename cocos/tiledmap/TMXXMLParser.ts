/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import * as cc from "../core";

import { Label, HorizontalTextAlignment, VerticalTextAlignment } from "../ui/components/label";

import { codec } from '../../extensions/compression/ZipUtils';
import zlib from '../../extensions/compression/zlib.min.js';
import { js } from '../core/utils/js';
import { SAXParser } from '../core/load-pipeline/plist-parser';
import { GID, MixedGID, Orientation, RenderOrder, StaggerAxis, StaggerIndex, TiledGrid, TileFlag, TMXObjectType, TMXTilesetInfo } from "./TiledTypes";

function uint8ArrayToUint32Array(uint8Arr: Uint8Array): null | Uint32Array | number[] {
    if (uint8Arr.length % 4 !== 0)
        return null;

    let arrLen = uint8Arr.length / 4;
    let retArr = window.Uint32Array ? new Uint32Array(arrLen) : [];
    for (let i = 0; i < arrLen; i++) {
        let offset = i * 4;
        retArr[i] = uint8Arr[offset] + uint8Arr[offset + 1] * (1 << 8) + uint8Arr[offset + 2] * (1 << 16) + uint8Arr[offset + 3] * (1 << 24);
    }
    return retArr;
}

type NN = number;

// Bits on the far end of the 32-bit global tile ID (GID's) are used for tile flags

export type PropertiesInfo = {(key: string): number | string};
//export type TiledAnimationType = {[key:GID]:TiledAnimation};
export type TiledAnimationType = Map<GID, TiledAnimation>;
/**
 * cc.TMXLayerInfo contains the information about the layers like:
 * - Layer name
 * - Layer size
 * - Layer opacity at creation time (it can be modified at runtime)
 * - Whether the layer is visible (if it's not visible, then the CocosNode won't be created)
 * This information is obtained from the TMX file.
 * @class TMXLayerInfo
 */
/**
 * Properties of the layer info.
 * @property {Object} properties
 */
export class TMXLayerInfo {
    properties: PropertiesInfo = {} as any;
    name = "";
    _layerSize: cc.Size | null = null;
    _tiles: number[] | Uint32Array = [];
    visible = true;
    _opacity = 0;
    ownTiles = true;
    _minGID: GID = 100000 as unknown as GID;
    _maxGID: GID = 0 as unknown as GID;
    offset: cc.Vec2 = cc.v2(0, 0);
    tintColor: cc.Color | null = null;

    /**
     * Gets the Properties.
     * @return {Object}
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Set the Properties.
     * @param {object} value
     */
    setProperties(value: PropertiesInfo) {
        this.properties = value;
    }


    /**
     * @property ATTRIB_NONE
     * @constant
     * @static
     * @type {Number}
     * @default 1
     */
    static ATTRIB_NONE = 1 << 0;
    /**
     * @property ATTRIB_BASE64
     * @constant
     * @static
     * @type {Number}
     * @default 2
     */
    static ATTRIB_BASE64 = 1 << 1;
    /**
     * @property ATTRIB_GZIP
     * @constant
     * @static
     * @type {Number}
     * @default 4
     */
    static ATTRIB_GZIP = 1 << 2;
    /**
     * @property ATTRIB_ZLIB
     * @constant
     * @static
     * @type {Number}
     * @default 8
     */
    static ATTRIB_ZLIB = 1 << 3;
}


/**
 * cc.TMXImageLayerInfo contains the information about the image layers.
 * This information is obtained from the TMX file.
 * @class TMXImageLayerInfo
 */
export class TMXImageLayerInfo {
    name = "";
    visible = true;
    width = 0;
    height = 0;
    offset: cc.Vec2 = cc.v2(0, 0);
    opacity = 0;
    trans = new cc.Color(255, 255, 255, 255);
    sourceImage?: cc.SpriteFrame;

    tintColor: cc.Color | null = null;
}

type DrawOrder = "topdown" | "bottomup";

export interface TMXObject {
    id: number | string;
    name: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
    type: TMXObjectType;
    visible: boolean;
    wrap: boolean;
    color: cc.Color;
    halign: HorizontalTextAlignment;
    valign: VerticalTextAlignment;
    pixelsize: number;
    text: string;
    gid: MixedGID;
    points: { x: number, y: number }[];
    polylinePoints: { x: number, y: number }[] | null;

    offset?: cc.Vec2;
}

/**
 * <p>cc.TMXObjectGroupInfo contains the information about the object group like:
 * - group name
 * - group size
 * - group opacity at creation time (it can be modified at runtime)
 * - Whether the group is visible
 *
 * This information is obtained from the TMX file.</p>
 * @class TMXObjectGroupInfo
 */

/**
 * Properties of the ObjectGroup info.
 * @property {Array} properties
 */
export class TMXObjectGroupInfo {
    properties: PropertiesInfo = {} as any;
    name: string = "";
    _objects: TMXObject[] = [];
    visible = true;
    _opacity = 0;
    _color: cc.Color = new cc.Color(255, 255, 255, 255);
    offset: cc.Vec2 = cc.v2(0, 0);
    _draworder: DrawOrder = 'topdown';

    tintColor:cc.Color|null = null;
    /**
     * Gets the Properties.
     * @return {Array}
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Set the Properties.
     * @param {object} value
     */
    setProperties(value: PropertiesInfo) {
        this.properties = value;
    }
};


/**
 * <p>cc.TMXTilesetInfo contains the information about the tilesets like: <br />
 * - Tileset name<br />
 * - Tileset spacing<br />
 * - Tileset margin<br />
 * - size of the tiles<br />
 * - Image used for the tiles<br />
 * - Image size<br />
 *
 * This information is obtained from the TMX file. </p>
 * @class TMXTilesetInfo
 */

/**
 * Tileset name
 * @property {string} name
 */

/**
 * First grid
 * @property {number} firstGid
 */

/**
 * Spacing
 * @property {number} spacing
 */

/**
 * Margin
 * @property {number} margin
 */

/**
 * Texture containing the tiles (should be sprite sheet / texture atlas)
 * @property {any} sourceImage
 */


function strToHAlign(value): HorizontalTextAlignment {
    const hAlign = Label.HorizontalAlign;
    switch (value) {
        case 'center':
            return hAlign.CENTER;
        case 'right':
            return hAlign.RIGHT;
        default:
            return hAlign.LEFT;
    }
}

function strToVAlign(value): VerticalTextAlignment {
    const vAlign = Label.VerticalAlign;
    switch (value) {
        case 'center':
            return vAlign.CENTER;
        case 'bottom':
            return vAlign.BOTTOM;
        default:
            return vAlign.TOP;
    }
}

function strToColor(value: string): cc.Color {
    if (!value) {
        return cc.color(0, 0, 0, 255);
    }
    value = (value.indexOf('#') !== -1) ? value.substring(1) : value;
    if (value.length === 8) {
        let a = parseInt(value.substr(0, 2), 16) || 255;
        let r = parseInt(value.substr(2, 2), 16) || 0;
        let g = parseInt(value.substr(4, 2), 16) || 0;
        let b = parseInt(value.substr(6, 2), 16) || 0;
        return cc.color(r, g, b, a);
    } else {
        let r = parseInt(value.substr(0, 2), 16) || 0;
        let g = parseInt(value.substr(2, 2), 16) || 0;
        let b = parseInt(value.substr(4, 2), 16) || 0;
        return cc.color(r, g, b, 255);
    }
}

function getPropertyList(node: Element, map?: PropertiesInfo): PropertiesInfo {
    let res: any[] = [];
    let properties = node.getElementsByTagName("properties");
    for (let i = 0; i < properties.length; ++i) {
        let property = properties[i].getElementsByTagName("property");
        for (let j = 0; j < property.length; ++j) {
            res.push(property[j]);
        }
    }

    map = map || ({} as any);
    for (let i = 0; i < res.length; i++) {
        let element = res[i];
        let name = element.getAttribute('name');
        let type = element.getAttribute('type') || 'string';

        let value = element.getAttribute('value');
        if (type === 'int') {
            value = parseInt(value);
        }
        else if (type === 'float') {
            value = parseFloat(value);
        }
        else if (type === 'bool') {
            value = value === 'true';
        }
        else if (type === 'color') {
            value = strToColor(value);
        }

        map![name] = value;
    }

    return map!;
}

interface TiledAnimation {
    frames: { grid: TiledGrid | null, tileid: GID, duration: number }[];
    dt: number;
    frameIdx: number;
}

/**
 * <p>cc.TMXMapInfo contains the information about the map like: <br/>
 *- Map orientation (hexagonal, isometric or orthogonal)<br/>
 *- Tile size<br/>
 *- Map size</p>
 *
 * <p>And it also contains: <br/>
 * - Layers (an array of TMXLayerInfo objects)<br/>
 * - Tilesets (an array of TMXTilesetInfo objects) <br/>
 * - ObjectGroups (an array of TMXObjectGroupInfo objects) </p>
 *
 * <p>This information is obtained from the TMX file. </p>
 * @class TMXMapInfo
 */

/**
 * Properties of the map info.
 * @property {Array}    properties
 */

/**
 * Map orientation.
 * @property {Number}   orientation
 */

/**
 * Parent element.
 * @property {Object}   parentElement
 */

/**
 * Parent GID.
 * @property {Number}   parentGID
 */

/**
 * Layer attributes.
 * @property {Object}   layerAttrs
 */

/**
 * Is reading storing characters stream.
 * @property {Boolean}  storingCharacters
 */

/**
 * Current string stored from characters stream.
 * @property {String}   currentString
 */

/**
 * Width of the map
 * @property {Number}   mapWidth
 */

/**
 * Height of the map
 * @property {Number}   mapHeight
 */

/**
 * Width of a tile
 * @property {Number}   tileWidth
 */

/**
 * Height of a tile
 * @property {Number}   tileHeight
 */

/**
 * @example
 * 1.
 * //create a TMXMapInfo with file name
 * let tmxMapInfo = new cc.TMXMapInfo("res/orthogonal-test1.tmx");
 * 2.
 * //create a TMXMapInfo with content string and resource path
 * let resources = "res/TileMaps";
 * let filePath = "res/TileMaps/orthogonal-test1.tmx";
 * let xmlStr = cc.resources.get(filePath);
 * let tmxMapInfo = new cc.TMXMapInfo(xmlStr, resources);
 */

/**
 * Creates a TMX Format with a tmx file or content string
 */
export class TMXMapInfo {
    properties: PropertiesInfo = {} as any;
    orientation: Orientation | null = null;
    parentElement: Object | null = null;
    parentGID: MixedGID = 0 as unknown as any;
    layerAttrs = 0;
    storingCharacters = false;
    currentString: string | null = null;
    renderOrder: RenderOrder = RenderOrder.RightDown;

    _supportVersion = [1, 4, 0];
    _objectGroups: TMXObjectGroupInfo[] = [];
    _allChildren: (TMXLayerInfo | TMXImageLayerInfo | TMXObjectGroupInfo)[] = [];
    _mapSize = cc.size(0, 0);
    _tileSize = cc.size(0, 0);
    _layers: TMXLayerInfo[] = [];
    _tilesets: TMXTilesetInfo[] = [];
    _imageLayers: TMXImageLayerInfo[] = [];
    _tileProperties: Map<GID, PropertiesInfo> = new Map;
    _tileAnimations: TiledAnimationType = {} as any;
    _tsxContentMap: { [key: string]: string } | null = null;

    // map of textures indexed by name
    _spriteFrameMap: { [key: string]: cc.SpriteFrame } | null = null;
    _spfSizeMap: {[key:string]:cc.Size} = {};

    // hex map values
    _staggerAxis: StaggerAxis | null = null;
    _staggerIndex: StaggerIndex | null = null;
    _hexSideLength = 0;

    _imageLayerSPF: { [key: string]: cc.SpriteFrame } | null = null;

    constructor(tmxFile:string, tsxContentMap:{[key: string]: string}, spfTexturesMap:{[key: string]:cc.SpriteFrame}, textureSizes:{[key: string]:cc.Size}, imageLayerTextures:{[key:string]:cc.SpriteFrame}) {
        this.initWithXML(tmxFile, tsxContentMap, spfTexturesMap, textureSizes, imageLayerTextures);
    }

    /* Gets Map orientation.
     * @return {Number}
     */
    getOrientation() {
        return this.orientation;
    }

    /**
     * Set the Map orientation.
     * @param {Number} value
     */
    setOrientation(value: Orientation) {
        this.orientation = value;
    }
    /**
     * Gets the staggerAxis of map.
     * @return {TiledMap.StaggerAxis}
     */
    getStaggerAxis() {
        return this._staggerAxis;
    }

    /**
     * Set the staggerAxis of map.
     * @param {TiledMap.StaggerAxis} value
     */
    setStaggerAxis(value: StaggerAxis) {
        this._staggerAxis = value;
    }

    /**
     * Gets stagger index
     * @return {TiledMap.StaggerIndex}
     */
    getStaggerIndex() {
        return this._staggerIndex;
    }

    /**
     * Set the stagger index.
     * @param {TiledMap.StaggerIndex} value
     */
    setStaggerIndex(value) {
        this._staggerIndex = value;
    }

    /**
     * Gets Hex side length.
     * @return {Number}
     */
    getHexSideLength() {
        return this._hexSideLength;
    }

    /**
     * Set the Hex side length.
     * @param {Number} value
     */
    setHexSideLength(value: number) {
        this._hexSideLength = value;
    }

    /**
     * Map width & height
     * @return {Size}
     */
    getMapSize() {
        return cc.size(this._mapSize.width, this._mapSize.height);
    }

    /**
     * Map width & height
     * @param {Size} value
     */
    setMapSize(value: cc.Size) {
        this._mapSize.width = value.width;
        this._mapSize.height = value.height;
    }

    _getMapWidth() {
        return this._mapSize.width;
    }
    _setMapWidth(width: number) {
        this._mapSize.width = width;
    }
    _getMapHeight() {
        return this._mapSize.height;
    }
    _setMapHeight(height: number) {
        this._mapSize.height = height;
    }

    /**
     * Tiles width & height
     * @return {Size}
     */
    getTileSize() {
        return cc.size(this._tileSize.width, this._tileSize.height);
    }

    /**
     * Tiles width & height
     * @param {Size} value
     */
    setTileSize(value: cc.Size) {
        this._tileSize.width = value.width;
        this._tileSize.height = value.height;
    }

    _getTileWidth() {
        return this._tileSize.width;
    }
    _setTileWidth(width) {
        this._tileSize.width = width;
    }
    _getTileHeight() {
        return this._tileSize.height;
    }
    _setTileHeight(height: number) {
        this._tileSize.height = height;
    }

    /**
     * Layers
     * @return {Array}
     */
    getLayers() {
        return this._layers;
    }

    /**
     * Layers
     * @param {cc.TMXLayerInfo} value
     */
    setLayers(value: TMXLayerInfo) {
        this._allChildren.push(value);
        this._layers.push(value);
    }

    /**
     * ImageLayers
     * @return {Array}
     */
    getImageLayers() {
        return this._imageLayers;
    }

    /**
     * ImageLayers
     * @param {cc.TMXImageLayerInfo} value
     */
    setImageLayers(value: TMXImageLayerInfo) {
        this._allChildren.push(value);
        this._imageLayers.push(value);
    }

    /**
     * tilesets
     * @return {Array}
     */
    getTilesets() {
        return this._tilesets;
    }

    /**
     * tilesets
     * @param {cc.TMXTilesetInfo} value
     */
    setTilesets(value: TMXTilesetInfo) {
        this._tilesets.push(value);
    }

    /**
     * ObjectGroups
     * @return {Array}
     */
    getObjectGroups() {
        return this._objectGroups;
    }

    /**
     * ObjectGroups
     * @param {cc.TMXObjectGroup} value
     */
    setObjectGroups(value: TMXObjectGroupInfo) {
        this._allChildren.push(value);
        this._objectGroups.push(value);
    }

    getAllChildren() {
        return this._allChildren;
    }

    /**
     * parent element
     * @return {Object}
     */
    getParentElement() {
        return this.parentElement;
    }

    /**
     * parent element
     * @param {Object} value
     */
    setParentElement(value) {
        this.parentElement = value;
    }

    /**
     * parent GID
     * @return {Number}
     */
    getParentGID() {
        return this.parentGID;
    }

    /**
     * parent GID
     * @param {Number} value
     */
    setParentGID(value) {
        this.parentGID = value;
    }

    /**
     * Layer attribute
     * @return {Object}
     */
    getLayerAttribs() {
        return this.layerAttrs;
    }

    /**
     * Layer attribute
     * @param {Object} value
     */
    setLayerAttribs(value) {
        this.layerAttrs = value;
    }

    /**
     * Is reading storing characters stream
     * @return {Boolean}
     */
    getStoringCharacters() {
        return this.storingCharacters;
    }

    /**
     * Is reading storing characters stream
     * @param {Boolean} value
     */
    setStoringCharacters(value) {
        this.storingCharacters = value;
    }

    /**
     * Properties
     * @return {Array}
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Properties
     * @param {object} value
     */
    setProperties(value) {
        this.properties = value;
    }

    /**
     * initializes a TMX format with an XML string and a TMX resource path
     * @param {String} tmxString
     * @param {Object} tsxMap
     * @param {Object} spfTextureMap
     * @return {Boolean}
     */
    initWithXML(tmxString: string, tsxMap:{[key: string]:string}, spfTextureMap: { [key: string]: cc.SpriteFrame }, textureSizes: {[key:string]: cc.Size}, imageLayerTextures:{[key: string]:cc.SpriteFrame}) {
        this._tilesets.length = 0;
        this._layers.length = 0;
        this._imageLayers.length = 0;

        this._tsxContentMap = tsxMap;
        this._spriteFrameMap = spfTextureMap;
        this._imageLayerSPF = imageLayerTextures;
        this._spfSizeMap = textureSizes;

        this._objectGroups.length = 0;
        this._allChildren.length = 0;
        this.properties = {} as any;
        this._tileProperties = new Map;
        this._tileAnimations = new Map;

        // tmp vars
        this.currentString = "";
        this.storingCharacters = false;
        this.layerAttrs = TMXLayerInfo.ATTRIB_NONE;
        this.parentElement = null;

        return this.parseXMLString(tmxString);
    }

    /**
     * Initializes parsing of an XML string, either a tmx (Map) string or tsx (Tileset) string
     * @param {String} xmlString
     * @param {Number} tilesetFirstGid
     * @return {Element}
     */
    parseXMLString(xmlStr: string, tilesetFirstGid?: number) {
        let parser = new SAXParser();
        let mapXML: Document = parser._parseXML(xmlStr);
        let i:number;

        // PARSE <map>
        let map = mapXML.documentElement;

        let orientationStr = map.getAttribute('orientation');
        let staggerAxisStr = map.getAttribute('staggeraxis');
        let staggerIndexStr = map.getAttribute('staggerindex');
        let hexSideLengthStr = map.getAttribute('hexsidelength');
        let renderorderStr = map.getAttribute('renderorder');
        let version = map.getAttribute('version') || '1.0.0';

        if (map.nodeName === "map") {
            let versionArr = version.split('.');
            let supportVersion = this._supportVersion;
            for (let i = 0; i < supportVersion.length; i++) {
                let v = parseInt(versionArr[i]) || 0;
                let sv = supportVersion[i];
                if (sv < v) {
                    cc.logID(7216, version);
                    break;
                }
            }

            if (orientationStr === "orthogonal")
                this.orientation = Orientation.ORTHO;
            else if (orientationStr === "isometric")
                this.orientation = Orientation.ISO;
            else if (orientationStr === "hexagonal")
                this.orientation = Orientation.HEX;
            else if (orientationStr !== null)
                cc.logID(7217, orientationStr);

            if (renderorderStr === 'right-up') {
                this.renderOrder = RenderOrder.RightUp;
            } else if (renderorderStr === 'left-up') {
                this.renderOrder = RenderOrder.LeftUp;
            } else if (renderorderStr === 'left-down') {
                this.renderOrder = RenderOrder.LeftDown;
            } else {
                this.renderOrder = RenderOrder.RightDown;
            }

            if (staggerAxisStr === 'x') {
                this.setStaggerAxis(StaggerAxis.STAGGERAXIS_X);
            }
            else if (staggerAxisStr === 'y') {
                this.setStaggerAxis(StaggerAxis.STAGGERAXIS_Y);
            }

            if (staggerIndexStr === 'odd') {
                this.setStaggerIndex(StaggerIndex.STAGGERINDEX_ODD);
            }
            else if (staggerIndexStr === 'even') {
                this.setStaggerIndex(StaggerIndex.STAGGERINDEX_EVEN);
            }

            if (hexSideLengthStr) {
                this.setHexSideLength(parseFloat(hexSideLengthStr));
            }

            let mapSize = cc.size(0, 0);
            mapSize.width = parseFloat(map.getAttribute('width')!);
            mapSize.height = parseFloat(map.getAttribute('height')!);
            this.setMapSize(mapSize);

            mapSize = cc.size(0, 0);
            mapSize.width = parseFloat(map.getAttribute('tilewidth')!);
            mapSize.height = parseFloat(map.getAttribute('tileheight')!);
            this.setTileSize(mapSize);

            // The parent element is the map
            this.properties = getPropertyList(map);
        }

        // PARSE <tileset>
        let tilesets: Element[] = map.getElementsByTagName('tileset') as unknown as Element[];
        if (map.nodeName !== "map") {
            tilesets.length = 0;
            tilesets.push(map);
        }

        for (i = 0; i < tilesets.length; i++) {
            let selTileset = tilesets[i];
            // If this is an external tileset then start parsing that
            let tsxName = selTileset.getAttribute('source');
            if (tsxName) {
                let currentFirstGID = parseInt(selTileset.getAttribute('firstgid')!);
                let tsxXmlString = this._tsxContentMap![tsxName];
                if (tsxXmlString) {
                    this.parseXMLString(tsxXmlString, currentFirstGID);
                }
            } else {
                let images = selTileset.getElementsByTagName('image');
                let collection = images.length > 1;
                let firstImage = images[0];
                let firstImageName: string = firstImage.getAttribute('source')!;
                firstImageName = firstImageName.replace(/\\/g, '\/');

                let tiles = selTileset.getElementsByTagName('tile');
                let tileCount = tiles && tiles.length || 1;
                let tile: Element | null = null;

                let tilesetName = selTileset.getAttribute('name') || "";
                let tilesetSpacing = parseInt(selTileset.getAttribute('spacing')!) || 0;
                let tilesetMargin = parseInt(selTileset.getAttribute('margin')!) || 0;
                let fgid = tilesetFirstGid ? tilesetFirstGid : (parseInt(selTileset.getAttribute('firstgid')!) || 0);

                let tilesetSize = cc.size(0, 0);
                tilesetSize.width = parseFloat(selTileset.getAttribute('tilewidth')!);
                tilesetSize.height = parseFloat(selTileset.getAttribute('tileheight')!);

                // parse tile offset
                let firstTileOffset = selTileset.getElementsByTagName('tileoffset')[0];
                let tileOffsetX = 0;
                let tileOffsetY = 0;
                if (firstTileOffset) {
                    tileOffsetX = parseFloat(firstTileOffset.getAttribute('x')!) || 0;
                    tileOffsetY = parseFloat(firstTileOffset.getAttribute('y')!) || 0;
                }

                let tileset: TMXTilesetInfo | null = null;
                for (let tileIdx = 0; tileIdx < tileCount; tileIdx++) {
                    if (!tileset || collection) {
                        tileset = new TMXTilesetInfo();
                        tileset.name = tilesetName;
                        tileset.firstGid = ((fgid as unknown as number) & TileFlag.FLIPPED_MASK) as unknown as GID;
                        tileset.tileOffset.x = tileOffsetX;
                        tileset.tileOffset.y = tileOffsetY;

                        tileset.collection = collection;
                        if (!collection) {

                            tileset.imageName = firstImageName;
                            tileset.imageSize.width = parseFloat(firstImage.getAttribute('width')!) || 0;
                            tileset.imageSize.height = parseFloat(firstImage.getAttribute('height')!) || 0;
                            tileset.sourceImage = this._spriteFrameMap![firstImageName];
                            if (!tileset.sourceImage) {
                                let shortName = TMXMapInfo.getShortName(firstImageName);
                                tileset.imageName = shortName;
                                tileset.sourceImage = this._spriteFrameMap![shortName];
                                if (!tileset.sourceImage) {
                                    console.error(`[error]: ${shortName} not find in [${Object.keys(this._spriteFrameMap!).join(", ")}]`);
                                    cc.errorID(7221, firstImageName);
                                }
                            }
                        }

                        tileset.spacing = tilesetSpacing;
                        tileset.margin = tilesetMargin;
                        tileset._tileSize.width = tilesetSize.width;
                        tileset._tileSize.height = tilesetSize.height;

                        this.setTilesets(tileset);
                    }

                    tile = tiles && tiles[tileIdx];
                    if (!tile) {
                        continue;
                    }

                    this.parentGID = (fgid + (parseInt(tile.getAttribute('id')!) || 0)) as any;
                    let tileImages = tile.getElementsByTagName('image');
                    if (tileImages && tileImages.length > 0) {
                        let image = tileImages[0];
                        let imageName = image.getAttribute('source')!;
                        imageName = imageName.replace(/\\/g, '\/');

                        tileset.imageName = imageName;
                        tileset.imageSize.width = parseFloat(image.getAttribute('width')!) || 0;
                        tileset.imageSize.height = parseFloat(image.getAttribute('height')!) || 0;

                        tileset._tileSize.width = tileset.imageSize.width;
                        tileset._tileSize.height = tileset.imageSize.height;

                        tileset.sourceImage = this._spriteFrameMap![imageName];
                        if (!tileset.sourceImage) {
                            let shortName = TMXMapInfo.getShortName(imageName);
                            tileset.imageName = shortName;
                            tileset.sourceImage = this._spriteFrameMap![shortName];
                            if (!tileset.sourceImage) {
                                cc.errorID(7221, imageName);
                            }
                        }

                        tileset.firstGid = ((this.parentGID as unknown as number) & TileFlag.FLIPPED_MASK) as unknown as GID;;
                    }
                    let pid = ((TileFlag.FLIPPED_MASK & this.parentGID as unknown as number) >>> 0) as unknown as GID;
                    this._tileProperties.set(pid, getPropertyList(tile));
                    let animations = tile.getElementsByTagName('animation');
                    if (animations && animations.length > 0) {
                        let animation = animations[0];
                        let framesData = animation.getElementsByTagName('frame');
                        let animationProp: TiledAnimation = { frames: [], dt: 0, frameIdx: 0 };
                        this._tileAnimations.set(pid, animationProp);
                        let frames = animationProp.frames;
                        for (let frameIdx = 0; frameIdx < framesData.length; frameIdx++) {
                            let frame = framesData[frameIdx];
                            let tileid = fgid + (parseInt(frame.getAttribute('tileid')!) || 0);
                            let duration = parseFloat(frame.getAttribute('duration')!) || 0;
                            frames.push({ tileid: tileid as unknown as GID, duration: duration / 1000, grid: null });
                        }
                    }
                }
            }
        }

        // PARSE <layer> & <objectgroup> in order
        let childNodes = map.childNodes;
        for (i = 0; i < childNodes.length; i++) {
            let childNode = childNodes[i];
            if (this._shouldIgnoreNode(childNode)) {
                continue;
            }

            if (childNode.nodeName === 'imagelayer') {
                let imageLayer = this._parseImageLayer(childNode as Element);
                if (imageLayer) {
                    this.setImageLayers(imageLayer);
                }
            }

            if (childNode.nodeName === 'layer') {
                let layer = this._parseLayer(childNode as Element);
                this.setLayers(layer!);
            }

            if (childNode.nodeName === 'objectgroup') {
                let objectGroup = this._parseObjectGroup(childNode as Element);
                this.setObjectGroups(objectGroup);
            }
        }

        return map;
    }

    _shouldIgnoreNode(node:ChildNode): boolean{
        return node.nodeType === 3 // text
            || node.nodeType === 8   // comment
            || node.nodeType === 4;  // cdata
    }

    _parseImageLayer(selLayer: Element) {
        let datas = selLayer.getElementsByTagName('image');
        if (!datas || datas.length === 0) return null;

        let imageLayer = new TMXImageLayerInfo();
        imageLayer.name = selLayer.getAttribute('name')!;
        imageLayer.offset.x = parseFloat(selLayer.getAttribute('offsetx')!) || 0;
        imageLayer.offset.y = parseFloat(selLayer.getAttribute('offsety')!) || 0;
        let visible = selLayer.getAttribute('visible');
        imageLayer.visible = !(visible === "0");

        let opacity = selLayer.getAttribute('opacity');
        imageLayer.opacity = opacity ? Math.round(255 * parseFloat(opacity)) : 255;

        let tintColor = selLayer.getAttribute('tintcolor');
        imageLayer.tintColor = tintColor ? strToColor(tintColor) : null;

        let data = datas[0];
        let source = data.getAttribute('source');
        imageLayer.sourceImage = this._imageLayerSPF![source!];
        imageLayer.width = parseInt(data.getAttribute('width')!) || 0;
        imageLayer.height = parseInt(data.getAttribute('height')!) || 0;
        imageLayer.trans = strToColor(data.getAttribute('trans')!);

        if (!imageLayer.sourceImage) {
            cc.errorID(7221, source);
            return null;
        }
        return imageLayer;
    }

    _parseLayer(selLayer: Element) {
        let data = selLayer.getElementsByTagName('data')[0];

        let layer = new TMXLayerInfo();
        layer.name = selLayer.getAttribute('name')!;

        let layerSize = cc.size(0, 0);
        layerSize.width = parseFloat(selLayer.getAttribute('width')!);
        layerSize.height = parseFloat(selLayer.getAttribute('height')!);
        layer._layerSize = layerSize;

        let visible = selLayer.getAttribute('visible');
        layer.visible = !(visible === "0");

        let opacity = selLayer.getAttribute('opacity');
        if (opacity)
            layer._opacity = Math.round(255 * parseFloat(opacity));
        else
            layer._opacity = 255;
        layer.offset = cc.v2(parseFloat(selLayer.getAttribute('offsetx')!) || 0, parseFloat(selLayer.getAttribute('offsety')!) || 0);

        let tintColor = selLayer.getAttribute('tintcolor');
        layer.tintColor = tintColor ? strToColor(tintColor) : null;

        let nodeValue = '';
        for (let j = 0; j < data.childNodes.length; j++) {
            nodeValue += data.childNodes[j].nodeValue
        }
        nodeValue = nodeValue.trim();

        // Unpack the tilemap data
        let compression = data.getAttribute('compression');
        let encoding = data.getAttribute('encoding');
        if (compression && compression !== "gzip" && compression !== "zlib") {
            cc.logID(7218);
            return null;
        }
        let tiles;
        switch (compression) {
            case 'gzip':
                tiles = codec.unzipBase64AsArray(nodeValue, 4);
                break;
            case 'zlib':
                let inflator = new (zlib as unknown as any).Inflate(codec.Base64.decodeAsArray(nodeValue, 1));
                tiles = uint8ArrayToUint32Array(inflator.decompress());
                break;
            case null:
            case '':
                // Uncompressed
                if (encoding === "base64")
                    tiles = codec.Base64.decodeAsArray(nodeValue, 4);
                else if (encoding === "csv") {
                    tiles = [];
                    let csvTiles = nodeValue.split(',');
                    for (let csvIdx = 0; csvIdx < csvTiles.length; csvIdx++)
                        tiles.push(parseInt(csvTiles[csvIdx]));
                } else {
                    //XML format
                    let selDataTiles = data.getElementsByTagName("tile");
                    tiles = [];
                    for (let xmlIdx = 0; xmlIdx < selDataTiles.length; xmlIdx++)
                        tiles.push(parseInt(selDataTiles[xmlIdx].getAttribute("gid")!));
                }
                break;
            default:
                if (this.layerAttrs === TMXLayerInfo.ATTRIB_NONE)
                    cc.logID(7219);
                break;
        }
        if (tiles) {
            layer._tiles = new Uint32Array(tiles);
        }

        // The parent element is the last layer
        layer.properties = getPropertyList(selLayer);

        return layer;
    }

    _parseObjectGroup(selGroup: Element) {
        let objectGroup = new TMXObjectGroupInfo();
        objectGroup.name = selGroup.getAttribute('name') || '';
        objectGroup.offset = cc.v2(parseFloat(selGroup.getAttribute('offsetx')!), parseFloat(selGroup.getAttribute('offsety')!));

        let opacity = selGroup.getAttribute('opacity');
        if (opacity)
            objectGroup._opacity = Math.round(255 * parseFloat(opacity));
        else
            objectGroup._opacity = 255;

        objectGroup.tintColor = strToColor(selGroup.getAttribute('tintcolor')!) || null;

        let visible = selGroup.getAttribute('visible');
        if (visible && parseInt(visible) === 0)
            objectGroup.visible = false;

        let color = selGroup.getAttribute('color');
        if (color)
            objectGroup._color.fromHEX(color);

        let draworder = selGroup.getAttribute('draworder');
        if (draworder)
            objectGroup._draworder = draworder as any;

        // set the properties to the group
        objectGroup.setProperties(getPropertyList(selGroup));

        let objects = selGroup.getElementsByTagName('object');
        if (objects) {
            for (let j = 0; j < objects.length; j++) {
                let selObj = objects[j];
                // The value for "type" was blank or not a valid class name
                // Create an instance of TMXObjectInfo to store the object and its properties
                let objectProp: TMXObject = {} as any;

                // Set the id of the object
                objectProp.id = selObj.getAttribute('id') || j;

                // Set the name of the object to the value for "name"
                objectProp.name = selObj.getAttribute('name') || "";

                // Assign all the attributes as key/name pairs in the properties dictionary
                objectProp.width = parseFloat(selObj.getAttribute('width')!) || 0;
                objectProp.height = parseFloat(selObj.getAttribute('height')!) || 0;

                objectProp.x = parseFloat(selObj.getAttribute('x')!) || 0;
                objectProp.y = parseFloat(selObj.getAttribute('y')!) || 0;

                objectProp.rotation = parseFloat(selObj.getAttribute('rotation')!) || 0;

                getPropertyList(selObj, objectProp as any);

                // visible
                let visibleAttr = selObj.getAttribute('visible');
                objectProp.visible = !(visibleAttr && parseInt(visibleAttr) === 0);

                // text
                let texts = selObj.getElementsByTagName('text');
                if (texts && texts.length > 0) {
                    let text = texts[0];
                    objectProp.type = TMXObjectType.TEXT;
                    objectProp.wrap = text.getAttribute('wrap') == '1';
                    objectProp.color = strToColor(text.getAttribute('color')!);
                    objectProp.halign = strToHAlign(text.getAttribute('halign'));
                    objectProp.valign = strToVAlign(text.getAttribute('valign'));
                    objectProp.pixelsize = parseInt(text.getAttribute('pixelsize')!) || 16;
                    objectProp.text = text.childNodes[0].nodeValue!;
                }

                // image
                let gid = selObj.getAttribute('gid');
                if (gid) {
                    objectProp.gid = parseInt(gid) as any;
                    objectProp.type = TMXObjectType.IMAGE;
                }

                // ellipse
                let ellipse = selObj.getElementsByTagName('ellipse');
                if (ellipse && ellipse.length > 0) {
                    objectProp.type = TMXObjectType.ELLIPSE;
                }

                //polygon
                let polygonProps = selObj.getElementsByTagName("polygon");
                if (polygonProps && polygonProps.length > 0) {
                    objectProp.type = TMXObjectType.POLYGON;
                    let selPgPointStr = polygonProps[0].getAttribute('points');
                    if (selPgPointStr)
                        objectProp.points = this._parsePointsString(selPgPointStr)!;
                }

                //polyline
                let polylineProps = selObj.getElementsByTagName("polyline");
                if (polylineProps && polylineProps.length > 0) {
                    objectProp.type = TMXObjectType.POLYLINE;
                    let selPlPointStr = polylineProps[0].getAttribute('points');
                    if (selPlPointStr)
                        objectProp.polylinePoints = this._parsePointsString(selPlPointStr)!;
                }

                if (!objectProp.type) {
                    objectProp.type = TMXObjectType.RECT;
                }

                // Add the object to the objectGroup
                objectGroup._objects.push(objectProp);
            }

            if (draworder !== 'index') {
                objectGroup._objects.sort(function (a, b) {
                    return a.y - b.y;
                });
            }
        }
        return objectGroup;
    }

    _parsePointsString(pointsString?: string) {
        if (!pointsString)
            return null;

        let points: { x: number, y: number }[] = [];
        let pointsStr = pointsString.split(' ');
        for (let i = 0; i < pointsStr.length; i++) {
            let selPointStr = pointsStr[i].split(',');
            points.push({ x: parseFloat(selPointStr[0]), y: parseFloat(selPointStr[1]) });
        }
        return points;
    }

    /**
     * Sets the tile animations.
     * @return {Object}
     */
    setTileAnimations(animations: TiledAnimationType) {
        this._tileAnimations = animations;
    }

    /**
     * Gets the tile animations.
     * @return {Object}
     */
    getTileAnimations(): TiledAnimationType {
        return this._tileAnimations;
    }

    /**
     * Gets the tile properties.
     * @return {Object}
     */
    getTileProperties() {
        return this._tileProperties;
    }

    /**
     * Set the tile properties.
     * @param {Object} tileProperties
     */
    setTileProperties(tileProperties: Map<GID, PropertiesInfo>) {
        this._tileProperties = tileProperties;
    }

    /**
     * Gets the currentString
     * @return {String}
     */
    getCurrentString() {
        return this.currentString;
    }

    /**
     * Set the currentString
     * @param {String} currentString
     */
    setCurrentString(currentString:string) {
        this.currentString = currentString;
    }

    static getShortName(name: string) {
        name = name.replace(/\\/g, '\/');
        let splashIndex = name.lastIndexOf("/") + 1;
        let dotIndex = name.lastIndexOf(".");
        dotIndex = dotIndex < 0 ? name.length : dotIndex;
        return name.substring(splashIndex, dotIndex);
    }
}

let _p = TMXMapInfo.prototype;

// Extended properties
js.getset(_p, "mapWidth", _p._getMapWidth, _p._setMapWidth);
js.getset(_p, "mapHeight", _p._getMapHeight, _p._setMapHeight);
js.getset(_p, "tileWidth", _p._getTileWidth, _p._setTileWidth);
js.getset(_p, "tileHeight", _p._getTileHeight, _p._setTileHeight);

