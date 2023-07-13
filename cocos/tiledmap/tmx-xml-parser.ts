/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Label, HorizontalTextAlignment, VerticalTextAlignment } from '../2d/components/label';
import codec from '../../external/compression/ZipUtils.js';
import zlib from '../../external/compression/zlib.min.js';
import { SAXParser } from '../asset/asset-manager/plist-parser';
import {
    GID, MixedGID, Orientation, PropertiesInfo, RenderOrder, StaggerAxis, StaggerIndex, TiledAnimation, TiledAnimationType,
    TileFlag, TMXImageLayerInfo, TMXLayerInfo, TMXObject, TMXObjectGroupInfo, TMXObjectType, TMXTilesetInfo,
} from './tiled-types';
import { Color, errorID, logID, Size, Vec2 } from '../core';
import { SpriteFrame } from '../2d/assets';

function uint8ArrayToUint32Array (uint8Arr: Uint8Array): null | Uint32Array | number[] {
    if (uint8Arr.length % 4 !== 0) return null;
    const arrLen = uint8Arr.length / 4;
    const retArr = window.Uint32Array ? new Uint32Array(arrLen) : [];
    for (let i = 0; i < arrLen; i++) {
        const offset = i * 4;
        retArr[i] = uint8Arr[offset] + uint8Arr[offset + 1] * (1 << 8) + uint8Arr[offset + 2] * (1 << 16) + uint8Arr[offset + 3] * (1 << 24);
    }
    return retArr;
}

function strToHAlign (value): HorizontalTextAlignment {
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

function strToVAlign (value): VerticalTextAlignment {
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

function strToColor (value: string): Color {
    if (!value) {
        return new Color(0, 0, 0, 255);
    }
    value = (value.indexOf('#') !== -1) ? value.substring(1) : value;
    if (value.length === 8) {
        const a = parseInt(value.substr(0, 2), 16) || 255;
        const r = parseInt(value.substr(2, 2), 16) || 0;
        const g = parseInt(value.substr(4, 2), 16) || 0;
        const b = parseInt(value.substr(6, 2), 16) || 0;
        return new Color(r, g, b, a);
    } else {
        const r = parseInt(value.substr(0, 2), 16) || 0;
        const g = parseInt(value.substr(2, 2), 16) || 0;
        const b = parseInt(value.substr(4, 2), 16) || 0;
        return new Color(r, g, b, 255);
    }
}

function getPropertyList (node: Element, map?: PropertiesInfo): PropertiesInfo {
    const res: any[] = [];
    const properties = node.getElementsByTagName('properties');
    for (let i = 0; i < properties.length; ++i) {
        const property = properties[i].getElementsByTagName('property');
        for (let j = 0; j < property.length; ++j) {
            res.push(property[j]);
        }
    }

    map = map || ({} as any);
    for (let i = 0; i < res.length; i++) {
        const element = res[i];
        const name = element.getAttribute('name');
        const type = element.getAttribute('type') || 'string';

        let value = element.getAttribute('value');
        if (type === 'int') {
            value = parseInt(value);
        } else if (type === 'float') {
            value = parseFloat(value);
        } else if (type === 'bool') {
            value = value === 'true';
        } else if (type === 'color') {
            value = strToColor(value);
        }

        map![name] = value;
    }

    return map!;
}

/**
 * <p>cc.TMXMapInfo contains the information about the map like: <br/>
 * - Map orientation (hexagonal, isometric or orthogonal)<br/>
 * - Tile size<br/>
 * - Map size</p>
 *
 * <p>And it also contains: <br/>
 * - Layers (an array of TMXLayerInfo objects)<br/>
 * - Tilesets (an array of TMXTilesetInfo objects) <br/>
 * - ObjectGroups (an array of TMXObjectGroupInfo objects) </p>
 *
 * <p>This information is obtained from the TMX file. </p>
 * @class TMXMapInfo
 */

export class TMXMapInfo {
    /**
     * Properties of the map info.
     * @property {Array}    properties
     */
    properties: PropertiesInfo = {} as any;

    /**
     * Map orientation.
     * @property {Number}   orientation
     */
    orientation: Orientation | null = null;

    /**
     * Parent element.
     * @property {Object}   parentElement
     */
    parentElement: Record<string, unknown> | null = null;

    /**
     * Parent GID.
     * @property {Number}   parentGID
     */
    parentGID: MixedGID = 0 as unknown as any;

    /**
     * Layer attributes.
     * @property {Object}   layerAttrs
     */
    layerAttrs = 0;

    /**
     * Is reading storing characters stream.
     * @property {Boolean}  storingCharacters
     */
    storingCharacters = false;

    /**
     * Current string stored from characters stream.
     * @property {String}   currentString
     */
    currentString: string | null = null;
    renderOrder: RenderOrder = RenderOrder.RightDown;

    protected _supportVersion = [1, 4, 0];
    protected _objectGroups: TMXObjectGroupInfo[] = [];
    protected _allChildren: (TMXLayerInfo | TMXImageLayerInfo | TMXObjectGroupInfo)[] = [];
    protected _mapSize = new Size(0, 0);
    get mapSize (): Size { return this._mapSize; }
    protected _tileSize = new Size(0, 0);
    get tileSize (): Size { return this._tileSize; }
    protected _layers: TMXLayerInfo[] = [];
    protected _tilesets: TMXTilesetInfo[] = [];
    protected _imageLayers: TMXImageLayerInfo[] = [];
    protected _tileProperties: Map<GID, PropertiesInfo> = new Map();
    protected _tileAnimations: TiledAnimationType = {} as any;
    protected _tsxContentMap: { [key: string]: string } | null = null;

    // map of textures indexed by name
    protected _spriteFrameMap: { [key: string]: SpriteFrame } | null = null;
    protected _spfSizeMap: { [key: string]: Size } = {};

    // hex map values
    protected _staggerAxis: StaggerAxis | null = null;
    protected _staggerIndex: StaggerIndex | null = null;
    protected _hexSideLength = 0;

    protected _imageLayerSPF: { [key: string]: SpriteFrame } | null = null;

    constructor (tmxFile: string, tsxContentMap: { [key: string]: string }, spfTexturesMap: { [key: string]: SpriteFrame },
        textureSizes: { [key: string]: Size }, imageLayerTextures: { [key: string]: SpriteFrame }) {
        this.initWithXML(tmxFile, tsxContentMap, spfTexturesMap, textureSizes, imageLayerTextures);
    }

    /* Gets Map orientation.
     * @return {Number}
     */
    getOrientation (): Orientation | null {
        return this.orientation;
    }

    /**
     * Set the Map orientation.
     * @param {Number} value
     */
    setOrientation (value: Orientation): void {
        this.orientation = value;
    }
    /**
     * Gets the staggerAxis of map.
     * @return {TiledMap.StaggerAxis}
     */
    getStaggerAxis (): StaggerAxis | null {
        return this._staggerAxis;
    }

    /**
     * Set the staggerAxis of map.
     * @param {TiledMap.StaggerAxis} value
     */
    setStaggerAxis (value: StaggerAxis): void {
        this._staggerAxis = value;
    }

    /**
     * Gets stagger index
     * @return {TiledMap.StaggerIndex}
     */
    getStaggerIndex (): StaggerIndex | null {
        return this._staggerIndex;
    }

    /**
     * Set the stagger index.
     * @param {TiledMap.StaggerIndex} value
     */
    setStaggerIndex (value): void {
        this._staggerIndex = value;
    }

    /**
     * Gets Hex side length.
     * @return {Number}
     */
    getHexSideLength (): number {
        return this._hexSideLength;
    }

    /**
     * Set the Hex side length.
     * @param {Number} value
     */
    setHexSideLength (value: number): void {
        this._hexSideLength = value;
    }

    /**
     * Map width & height
     * @return {Size}
     */
    getMapSize (): Size {
        return new Size(this._mapSize.width, this._mapSize.height);
    }

    /**
     * Map width & height
     * @param {Size} value
     */
    setMapSize (value: Size): void {
        this._mapSize.width = value.width;
        this._mapSize.height = value.height;
    }

    get mapWidth (): number {
        return this._mapSize.width;
    }
    set mapWidth (width: number) {
        this._mapSize.width = width;
    }

    get mapHeight (): number {
        return this._mapSize.height;
    }
    set mapHeight (height: number) {
        this._mapSize.height = height;
    }

    /**
     * Tiles width & height
     * @return {Size}
     */
    getTileSize (): Size {
        return new Size(this._tileSize.width, this._tileSize.height);
    }

    /**
     * Tiles width & height
     * @param {Size} value
     */
    setTileSize (value: Size): void {
        this._tileSize.width = value.width;
        this._tileSize.height = value.height;
    }

    get tileWidth (): number {
        return this._tileSize.width;
    }

    set tileWidth (width) {
        this._tileSize.width = width;
    }

    /**
     * Height of a tile
     */
    get tileHeight (): number {
        return this._tileSize.height;
    }

    set tileHeight (height: number) {
        this._tileSize.height = height;
    }

    /**
     * Layers
     * @return {Array}
     */
    getLayers (): TMXLayerInfo[] {
        return this._layers;
    }

    /**
     * Layers
     * @param {cc.TMXLayerInfo} value
     */
    setLayers (value: TMXLayerInfo): void {
        this._allChildren.push(value);
        this._layers.push(value);
    }

    /**
     * ImageLayers
     * @return {Array}
     */
    getImageLayers (): TMXImageLayerInfo[] {
        return this._imageLayers;
    }

    /**
     * ImageLayers
     * @param {cc.TMXImageLayerInfo} value
     */
    setImageLayers (value: TMXImageLayerInfo): void {
        this._allChildren.push(value);
        this._imageLayers.push(value);
    }

    /**
     * tilesets
     * @return {Array}
     */
    getTilesets (): TMXTilesetInfo[] {
        return this._tilesets;
    }

    /**
     * tilesets
     * @param {cc.TMXTilesetInfo} value
     */
    setTilesets (value: TMXTilesetInfo): void {
        this._tilesets.push(value);
    }

    /**
     * ObjectGroups
     * @return {Array}
     */
    getObjectGroups (): TMXObjectGroupInfo[] {
        return this._objectGroups;
    }

    /**
     * ObjectGroups
     * @param {cc.TMXObjectGroup} value
     */
    setObjectGroups (value: TMXObjectGroupInfo): void {
        this._allChildren.push(value);
        this._objectGroups.push(value);
    }

    getAllChildren (): (TMXObjectGroupInfo | TMXLayerInfo | TMXImageLayerInfo)[] {
        return this._allChildren;
    }

    /**
     * parent element
     * @return {Object}
     */
    getParentElement (): Record<string, unknown> | null {
        return this.parentElement;
    }

    /**
     * parent element
     * @param {Object} value
     */
    setParentElement (value): void {
        this.parentElement = value;
    }

    /**
     * parent GID
     * @return {Number}
     */
    getParentGID (): number {
        return this.parentGID;
    }

    /**
     * parent GID
     * @param {Number} value
     */
    setParentGID (value): void {
        this.parentGID = value;
    }

    /**
     * Layer attribute
     * @return {Object}
     */
    getLayerAttribs (): number {
        return this.layerAttrs;
    }

    /**
     * Layer attribute
     * @param {Object} value
     */
    setLayerAttribs (value): void {
        this.layerAttrs = value;
    }

    /**
     * Is reading storing characters stream
     * @return {Boolean}
     */
    getStoringCharacters (): boolean {
        return this.storingCharacters;
    }

    /**
     * Is reading storing characters stream
     * @param {Boolean} value
     */
    setStoringCharacters (value): void {
        this.storingCharacters = value;
    }

    /**
     * Properties
     * @return {Array}
     */
    getProperties (): PropertiesInfo {
        return this.properties;
    }

    /**
     * Properties
     * @param {object} value
     */
    setProperties (value): void {
        this.properties = value;
    }

    /**
     * initializes a TMX format with an XML string and a TMX resource path
     * @param {String} tmxString
     * @param {Object} tsxMap
     * @param {Object} spfTextureMap
     * @return {Boolean}
     */
    initWithXML (tmxString: string, tsxMap: { [key: string]: string }, spfTextureMap: { [key: string]: SpriteFrame },
        textureSizes: { [key: string]: Size }, imageLayerTextures: { [key: string]: SpriteFrame }): HTMLElement {
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
        this._tileProperties = new Map();
        this._tileAnimations = new Map();

        // tmp vars
        this.currentString = '';
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
    parseXMLString (xmlStr: string, tilesetFirstGid?: number): HTMLElement {
        const parser = new SAXParser();
        const mapXML: Document = parser.parse(xmlStr);
        let i: number;

        // PARSE <map>
        const map = mapXML.documentElement;

        const orientationStr = map.getAttribute('orientation');
        const staggerAxisStr = map.getAttribute('staggeraxis');
        const staggerIndexStr = map.getAttribute('staggerindex');
        const hexSideLengthStr = map.getAttribute('hexsidelength');
        const renderorderStr = map.getAttribute('renderorder');
        const version = map.getAttribute('version') || '1.0.0';

        if (map.nodeName === 'map') {
            const versionArr = version.split('.');
            const supportVersion = this._supportVersion;
            for (i = 0; i < supportVersion.length; i++) {
                const v = parseInt(versionArr[i]) || 0;
                const sv = supportVersion[i];
                if (sv < v) {
                    logID(7216, version);
                    break;
                }
            }

            if (orientationStr === 'orthogonal') this.orientation = Orientation.ORTHO;
            else if (orientationStr === 'isometric') this.orientation = Orientation.ISO;
            else if (orientationStr === 'hexagonal') this.orientation = Orientation.HEX;
            else if (orientationStr !== null) logID(7217, orientationStr);

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
            } else if (staggerAxisStr === 'y') {
                this.setStaggerAxis(StaggerAxis.STAGGERAXIS_Y);
            }

            if (staggerIndexStr === 'odd') {
                this.setStaggerIndex(StaggerIndex.STAGGERINDEX_ODD);
            } else if (staggerIndexStr === 'even') {
                this.setStaggerIndex(StaggerIndex.STAGGERINDEX_EVEN);
            }

            if (hexSideLengthStr) {
                this.setHexSideLength(parseFloat(hexSideLengthStr));
            }

            let mapSize = new Size(0, 0);
            mapSize.width = parseFloat(map.getAttribute('width')!);
            mapSize.height = parseFloat(map.getAttribute('height')!);
            this.setMapSize(mapSize);

            mapSize = new Size(0, 0);
            mapSize.width = parseFloat(map.getAttribute('tilewidth')!);
            mapSize.height = parseFloat(map.getAttribute('tileheight')!);
            this.setTileSize(mapSize);

            // The parent element is the map
            this.properties = getPropertyList(map);
        }

        // PARSE <tileset>
        let tilesets: Element[] = map.getElementsByTagName('tileset') as unknown as Element[];
        if (map.nodeName !== 'map') {
            tilesets = [];
            tilesets.push(map);
        }

        for (i = 0; i < tilesets.length; i++) {
            const curTileset = tilesets[i];
            // If this is an external tileset then start parsing that
            const tsxName = curTileset.getAttribute('source');
            if (tsxName) {
                const currentFirstGID = parseInt(curTileset.getAttribute('firstgid')!);
                const tsxXmlString = this._tsxContentMap![tsxName];
                if (tsxXmlString) {
                    this.parseXMLString(tsxXmlString, currentFirstGID);
                }
            } else {
                const images = curTileset.getElementsByTagName('image');
                const collection = images.length > 1;
                const firstImage = images[0];
                let firstImageName: string = firstImage.getAttribute('source')!;
                firstImageName = firstImageName.replace(/\\/g, '/');

                const tiles = curTileset.getElementsByTagName('tile');
                const tileCount = tiles && tiles.length || 1;
                let tile: Element | null = null;

                const tilesetName = curTileset.getAttribute('name') || '';
                const tilesetSpacing = parseInt(curTileset.getAttribute('spacing')!) || 0;
                const tilesetMargin = parseInt(curTileset.getAttribute('margin')!) || 0;
                const fgid = tilesetFirstGid || (parseInt(curTileset.getAttribute('firstgid')!) || 0);

                const tilesetSize = new Size(0, 0);
                tilesetSize.width = parseFloat(curTileset.getAttribute('tilewidth')!);
                tilesetSize.height = parseFloat(curTileset.getAttribute('tileheight')!);

                // parse tile offset
                const curTileOffset = curTileset.getElementsByTagName('tileoffset')[0];
                let tileOffsetX = 0;
                let tileOffsetY = 0;
                if (curTileOffset) {
                    tileOffsetX = parseFloat(curTileOffset.getAttribute('x')!) || 0;
                    tileOffsetY = parseFloat(curTileOffset.getAttribute('y')!) || 0;
                }

                let tileset: TMXTilesetInfo | null = null;
                for (let tileIdx = 0; tileIdx < tileCount; tileIdx++) {
                    const curImage = images[tileIdx] ? images[tileIdx] : firstImage;
                    if (!curImage) continue;
                    let curImageName: string = curImage.getAttribute('source')!;
                    curImageName = curImageName.replace(/\\/g, '/');

                    if (!tileset || collection) {
                        tileset = new TMXTilesetInfo();
                        tileset.name = tilesetName;
                        tileset.firstGid = fgid & TileFlag.FLIPPED_MASK;
                        tileset.tileOffset.x = tileOffsetX;
                        tileset.tileOffset.y = tileOffsetY;

                        tileset.collection = collection;
                        if (!collection) {
                            tileset.imageName = curImageName;
                            tileset.imageSize.width = parseFloat(curImage.getAttribute('width')!) || 0;
                            tileset.imageSize.height = parseFloat(curImage.getAttribute('height')!) || 0;
                            tileset.sourceImage = this._spriteFrameMap![curImageName];
                            if (!tileset.sourceImage) {
                                const nameWithPostfix = TMXMapInfo.getNameWithPostfix(curImageName);
                                tileset.imageName = nameWithPostfix;
                                tileset.sourceImage = this._spriteFrameMap![nameWithPostfix];
                                if (!tileset.sourceImage) {
                                    const shortName = TMXMapInfo.getShortName(curImageName);
                                    tileset.imageName = shortName;
                                    tileset.sourceImage = this._spriteFrameMap![shortName];
                                    if (!tileset.sourceImage) {
                                        console.error(`[error]: ${shortName} not find in [${Object.keys(this._spriteFrameMap!).join(', ')}]`);
                                        errorID(7221, curImageName);
                                        console.warn(`Please try asset type of ${curImageName} to 'sprite-frame'`);
                                    }
                                }
                            }
                        }
                        tileset.spacing = tilesetSpacing;
                        tileset.margin = tilesetMargin;
                        tileset._tileSize.width = tilesetSize.width;
                        tileset._tileSize.height = tilesetSize.height;
                        this.setTilesets(tileset);
                    }

                    // parse tiles by tileIdx
                    tile = tiles && tiles[tileIdx];
                    if (!tile) {
                        continue;
                    }

                    this.parentGID = (fgid + (parseInt(tile.getAttribute('id')!) || 0)) as any;
                    const tileImages = tile.getElementsByTagName('image');
                    if (tile.hasAttribute('x') && tile.hasAttribute('y')) {
                        tileset.imageOffset = new Vec2(parseFloat(tile.getAttribute('x')!) || 0, parseFloat(tile.getAttribute('y')!) || 0);
                    }
                    const hastilesize = tile.hasAttribute('width') && tile.hasAttribute('height');
                    if (hastilesize) {
                        tileset._tileSize.width = parseFloat(tile.getAttribute('width')!) || 0;
                        tileset._tileSize.height = parseFloat(tile.getAttribute('height')!) || 0;
                    }
                    if (tileImages && tileImages.length > 0) {
                        const image = tileImages[0];
                        let imageName = image.getAttribute('source')!;
                        imageName = imageName.replace(/\\/g, '/');

                        tileset.imageName = imageName;
                        tileset.imageSize.width = parseFloat(image.getAttribute('width')!) || 0;
                        tileset.imageSize.height = parseFloat(image.getAttribute('height')!) || 0;

                        if (!hastilesize) {
                            tileset._tileSize.width = tileset.imageSize.width;
                            tileset._tileSize.height = tileset.imageSize.height;
                        }

                        tileset.sourceImage = this._spriteFrameMap![imageName];
                        if (!tileset.sourceImage) {
                            const nameWithPostfix = TMXMapInfo.getNameWithPostfix(imageName);
                            tileset.imageName = nameWithPostfix;
                            tileset.sourceImage = this._spriteFrameMap![nameWithPostfix];
                            if (!tileset.sourceImage) {
                                const shortName = TMXMapInfo.getShortName(imageName);
                                tileset.imageName = shortName;
                                tileset.sourceImage = this._spriteFrameMap![shortName];
                                if (!tileset.sourceImage) {
                                    errorID(7221, imageName);
                                    console.warn(`Please try asset type of ${imageName} to 'sprite-frame'`);
                                }
                            }
                        }

                        tileset.firstGid = this.parentGID & TileFlag.FLIPPED_MASK;
                    }
                    const pid = ((TileFlag.FLIPPED_MASK & this.parentGID as unknown as number) >>> 0) as unknown as GID;
                    this._tileProperties.set(pid, getPropertyList(tile));
                    const animations = tile.getElementsByTagName('animation');
                    if (animations && animations.length > 0) {
                        const animation = animations[0];
                        const framesData = animation.getElementsByTagName('frame');
                        const animationProp: TiledAnimation = { frames: [], dt: 0, frameIdx: 0 };
                        this._tileAnimations.set(pid, animationProp);
                        const frames = animationProp.frames;
                        for (let frameIdx = 0; frameIdx < framesData.length; frameIdx++) {
                            const frame = framesData[frameIdx];
                            const tileid = fgid + (parseInt(frame.getAttribute('tileid')!) || 0);
                            const duration = parseFloat(frame.getAttribute('duration')!) || 0;
                            frames.push({ tileid: tileid as unknown as GID, duration: duration / 1000, grid: null });
                        }
                    }
                }
            }
        }

        // PARSE <layer> & <objectgroup> in order
        const childNodes = map.childNodes;
        for (i = 0; i < childNodes.length; i++) {
            const childNode = childNodes[i];
            if (this._shouldIgnoreNode(childNode)) {
                continue;
            }

            if (childNode.nodeName === 'imagelayer') {
                const imageLayer = this._parseImageLayer(childNode as Element);
                if (imageLayer) {
                    this.setImageLayers(imageLayer);
                }
            }

            if (childNode.nodeName === 'layer') {
                const layer = this._parseLayer(childNode as Element);
                this.setLayers(layer!);
            }

            if (childNode.nodeName === 'objectgroup') {
                const objectGroup = this._parseObjectGroup(childNode as Element);
                this.setObjectGroups(objectGroup);
            }
        }

        return map;
    }

    protected _shouldIgnoreNode (node: ChildNode): boolean {
        return node.nodeType === 3 // text
            || node.nodeType === 8   // comment
            || node.nodeType === 4;  // cdata
    }

    protected _parseImageLayer (selLayer: Element): TMXImageLayerInfo | null {
        const datas = selLayer.getElementsByTagName('image');
        if (!datas || datas.length === 0) return null;

        const imageLayer = new TMXImageLayerInfo();
        imageLayer.name = selLayer.getAttribute('name')!;
        imageLayer.offset.x = parseFloat(selLayer.getAttribute('offsetx')!) || 0;
        imageLayer.offset.y = parseFloat(selLayer.getAttribute('offsety')!) || 0;
        const visible = selLayer.getAttribute('visible');
        imageLayer.visible = !(visible === '0');

        const opacity = selLayer.getAttribute('opacity');
        imageLayer.opacity = opacity ? Math.round(255 * parseFloat(opacity)) : 255;

        const tintColor = selLayer.getAttribute('tintcolor');
        imageLayer.tintColor = tintColor ? strToColor(tintColor) : null;

        const data = datas[0];
        const source = data.getAttribute('source');
        imageLayer.sourceImage = this._imageLayerSPF![source!];
        imageLayer.width = parseInt(data.getAttribute('width')!) || 0;
        imageLayer.height = parseInt(data.getAttribute('height')!) || 0;
        imageLayer.trans = strToColor(data.getAttribute('trans')!);

        if (!imageLayer.sourceImage) {
            errorID(7221, source!);
            console.warn(`Please try asset type of ${source} to 'sprite-frame'`);
            return null;
        }
        return imageLayer;
    }

    protected _parseLayer (selLayer: Element): TMXLayerInfo | null {
        const data = selLayer.getElementsByTagName('data')[0];

        const layer = new TMXLayerInfo();
        layer.name = selLayer.getAttribute('name')!;

        const layerSize = new Size(0, 0);
        layerSize.width = parseFloat(selLayer.getAttribute('width')!);
        layerSize.height = parseFloat(selLayer.getAttribute('height')!);
        layer.layerSize = layerSize;

        const visible = selLayer.getAttribute('visible');
        layer.visible = !(visible === '0');

        const opacity = selLayer.getAttribute('opacity');
        if (opacity) layer.opacity = Math.round(255 * parseFloat(opacity));
        else layer.opacity = 255;
        layer.offset = new Vec2(parseFloat(selLayer.getAttribute('offsetx')!) || 0, parseFloat(selLayer.getAttribute('offsety')!) || 0);

        const tintColor = selLayer.getAttribute('tintcolor');
        layer.tintColor = tintColor ? strToColor(tintColor) : null;

        let nodeValue = '';
        for (let j = 0; j < data.childNodes.length; j++) {
            nodeValue += data.childNodes[j].nodeValue;
        }
        nodeValue = nodeValue.trim();

        // Unpack the tilemap data
        const compression = data.getAttribute('compression');
        const encoding = data.getAttribute('encoding');
        if (compression && compression !== 'gzip' && compression !== 'zlib') {
            logID(7218);
            return null;
        }
        let tiles;
        switch (compression) {
        case 'gzip':
            tiles = codec.unzipBase64AsArray(nodeValue, 4);
            break;
        case 'zlib': {
            const inflator = new zlib.Inflate(codec.Base64.decodeAsArray(nodeValue, 1));
            tiles = uint8ArrayToUint32Array(inflator.decompress());
            break;
        }
        case null:
        case '':
            // Uncompressed
            if (encoding === 'base64') tiles = codec.Base64.decodeAsArray(nodeValue, 4);
            else if (encoding === 'csv') {
                tiles = [];
                const csvTiles = nodeValue.split(',');
                for (let csvIdx = 0; csvIdx < csvTiles.length; csvIdx++) tiles.push(parseInt(csvTiles[csvIdx]));
            } else {
                // XML format
                const selDataTiles = data.getElementsByTagName('tile');
                tiles = [];
                for (let xmlIdx = 0; xmlIdx < selDataTiles.length; xmlIdx++) tiles.push(parseInt(selDataTiles[xmlIdx].getAttribute('gid')!));
            }
            break;
        default:
            if (this.layerAttrs === TMXLayerInfo.ATTRIB_NONE) logID(7219);
            break;
        }
        if (tiles) {
            layer.tiles = new Uint32Array(tiles);
        }

        // The parent element is the last layer
        layer.properties = getPropertyList(selLayer);

        return layer;
    }

    protected _parseObjectGroup (selGroup: Element): TMXObjectGroupInfo {
        const objectGroup = new TMXObjectGroupInfo();
        objectGroup.name = selGroup.getAttribute('name') || '';
        objectGroup.offset = new Vec2(parseFloat(selGroup.getAttribute('offsetx')!), parseFloat(selGroup.getAttribute('offsety')!));

        const opacity = selGroup.getAttribute('opacity');
        if (opacity) objectGroup.opacity = Math.round(255 * parseFloat(opacity));
        else objectGroup.opacity = 255;

        const tintColor = selGroup.getAttribute('tintcolor');
        objectGroup.tintColor = tintColor ? strToColor(tintColor) : null;

        const visible = selGroup.getAttribute('visible');
        if (visible && parseInt(visible) === 0) objectGroup.visible = false;

        const color = selGroup.getAttribute('color');
        if (color) objectGroup.color.fromHEX(color);

        const draworder = selGroup.getAttribute('draworder');
        if (draworder) objectGroup.draworder = draworder as any;

        // set the properties to the group
        objectGroup.setProperties(getPropertyList(selGroup));

        const objects = selGroup.getElementsByTagName('object');
        if (objects) {
            for (let j = 0; j < objects.length; j++) {
                const selObj = objects[j];
                // The value for "type" was blank or not a valid class name
                // Create an instance of TMXObjectInfo to store the object and its properties
                const objectProp: TMXObject = {} as any;

                // Set the id of the object
                objectProp.id = selObj.getAttribute('id') || j;

                // Set the name of the object to the value for "name"
                objectProp.name = selObj.getAttribute('name') || '';

                // Assign all the attributes as key/name pairs in the properties dictionary
                objectProp.width = parseFloat(selObj.getAttribute('width')!) || 0;
                objectProp.height = parseFloat(selObj.getAttribute('height')!) || 0;

                objectProp.x = parseFloat(selObj.getAttribute('x')!) || 0;
                objectProp.y = parseFloat(selObj.getAttribute('y')!) || 0;

                objectProp.rotation = parseFloat(selObj.getAttribute('rotation')!) || 0;

                getPropertyList(selObj, objectProp as any);

                // visible
                const visibleAttr = selObj.getAttribute('visible');
                objectProp.visible = !(visibleAttr && parseInt(visibleAttr) === 0);

                // text
                const texts = selObj.getElementsByTagName('text');
                if (texts && texts.length > 0) {
                    const text = texts[0];
                    objectProp.type = TMXObjectType.TEXT;
                    objectProp.wrap = text.getAttribute('wrap') === '1';
                    objectProp.color = strToColor(text.getAttribute('color')!);
                    objectProp.halign = strToHAlign(text.getAttribute('halign'));
                    objectProp.valign = strToVAlign(text.getAttribute('valign'));
                    objectProp.pixelsize = parseInt(text.getAttribute('pixelsize')!) || 16;
                    objectProp.text = text.childNodes[0].nodeValue!;
                }

                // image
                const gid = selObj.getAttribute('gid');
                if (gid) {
                    objectProp.gid = parseInt(gid) as any;
                    objectProp.type = TMXObjectType.IMAGE;
                }

                // ellipse
                const ellipse = selObj.getElementsByTagName('ellipse');
                if (ellipse && ellipse.length > 0) {
                    objectProp.type = TMXObjectType.ELLIPSE;
                }

                // polygon
                const polygonProps = selObj.getElementsByTagName('polygon');
                if (polygonProps && polygonProps.length > 0) {
                    objectProp.type = TMXObjectType.POLYGON;
                    const selPgPointStr = polygonProps[0].getAttribute('points');
                    if (selPgPointStr) objectProp.points = this._parsePointsString(selPgPointStr)!;
                }

                // polyline
                const polylineProps = selObj.getElementsByTagName('polyline');
                if (polylineProps && polylineProps.length > 0) {
                    objectProp.type = TMXObjectType.POLYLINE;
                    const selPlPointStr = polylineProps[0].getAttribute('points');
                    if (selPlPointStr) objectProp.polylinePoints = this._parsePointsString(selPlPointStr)!;
                }

                if (!objectProp.type) {
                    objectProp.type = TMXObjectType.RECT;
                }

                // Add the object to the objectGroup
                objectGroup.objects.push(objectProp);
            }

            if (draworder !== 'index') {
                objectGroup.objects.sort((a, b) => a.y - b.y);
            }
        }
        return objectGroup;
    }

    protected _parsePointsString (pointsString?: string): {
        x: number;
        y: number;
    }[] | null {
        if (!pointsString) return null;

        const points: { x: number, y: number }[] = [];
        const pointsStr = pointsString.split(' ');
        for (let i = 0; i < pointsStr.length; i++) {
            const selPointStr = pointsStr[i].split(',');
            points.push({ x: parseFloat(selPointStr[0]), y: parseFloat(selPointStr[1]) });
        }
        return points;
    }

    /**
     * Sets the tile animations.
     * @return {Object}
     */
    setTileAnimations (animations: TiledAnimationType): void {
        this._tileAnimations = animations;
    }

    /**
     * Gets the tile animations.
     * @return {Object}
     */
    getTileAnimations (): TiledAnimationType {
        return this._tileAnimations;
    }

    /**
     * Gets the tile properties.
     * @return {Object}
     */
    getTileProperties (): Map<number, PropertiesInfo> {
        return this._tileProperties;
    }

    /**
     * Set the tile properties.
     * @param {Object} tileProperties
     */
    setTileProperties (tileProperties: Map<GID, PropertiesInfo>): void {
        this._tileProperties = tileProperties;
    }

    /**
     * Gets the currentString
     * @return {String}
     */
    getCurrentString (): string | null {
        return this.currentString;
    }

    /**
     * Set the currentString
     * @param {String} currentString
     */
    setCurrentString (currentString: string): void {
        this.currentString = currentString;
    }

    static getNameWithPostfix (name: string): string {
        name = name.replace(/\\/g, '/');
        const slashIndex = name.lastIndexOf('/') + 1;
        const strLen = name.length;
        return name.substring(slashIndex, strLen);
    }

    static getShortName (name: string): string {
        name = name.replace(/\\/g, '/');
        const slashIndex = name.lastIndexOf('/') + 1;
        let dotIndex = name.lastIndexOf('.');
        dotIndex = dotIndex < 0 ? name.length : dotIndex;
        return name.substring(slashIndex, dotIndex);
    }
}
