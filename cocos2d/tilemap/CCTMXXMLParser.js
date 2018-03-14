/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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

var codec = require('../compression/ZipUtils');
var zlib = require('../compression/zlib.min');
var js = require('../core/platform/js');

function uint8ArrayToUint32Array (uint8Arr) {
    if(uint8Arr.length % 4 !== 0)
        return null;

    let arrLen = uint8Arr.length /4;
    let retArr = window.Uint32Array? new Uint32Array(arrLen) : [];
    for(let i = 0; i < arrLen; i++){
        let offset = i * 4;
        retArr[i] = uint8Arr[offset]  + uint8Arr[offset + 1] * (1 << 8) + uint8Arr[offset + 2] * (1 << 16) + uint8Arr[offset + 3] * (1<<24);
    }
    return retArr;
}

// Bits on the far end of the 32-bit global tile ID (GID's) are used for tile flags

/**
 * <p>cc.TMXLayerInfo contains the information about the layers like: <br />
 * - Layer name<br />
 * - Layer size <br />
 * - Layer opacity at creation time (it can be modified at runtime)  <br />
 * - Whether the layer is visible (if it's not visible, then the CocosNode won't be created) <br />
 *  <br />
 * This information is obtained from the TMX file.</p>
 * @class TMXLayerInfo
 *
 * @property {Array}    properties  - Properties of the layer info.
 */
cc.TMXLayerInfo = function () {
    this.properties = {};
    this.name = "";
    this._layerSize = null;
    this._tiles = [];
    this.visible = true;
    this._opacity = 0;
    this.ownTiles = true;
    this._minGID = 100000;
    this._maxGID = 0;
    this.offset = cc.p(0,0);
};

cc.TMXLayerInfo.prototype = {
    constructor: cc.TMXLayerInfo,
    /**
     * Gets the Properties.
     * @return {Array}
     */
    getProperties () {
        return this.properties;
    },

    /**
     * Set the Properties.
     * @param {object} value
     */
    setProperties (value) {
        this.properties = value;
    }
};

/**
 * <p>cc.TMXObjectGroupInfo contains the information about the object group like: <br />
 * - group name<br />
 * - group size <br />
 * - group opacity at creation time (it can be modified at runtime)  <br />
 * - Whether the group is visible <br />
 *  <br />
 * This information is obtained from the TMX file.</p>
 * @class TMXObjectGroupInfo
 *
 * @property {Array}    properties  - Properties of the ObjectGroup info.
 */
cc.TMXObjectGroupInfo = function () {
    this.properties = {};
    this.name = "";
    this._objects = [];
    this.visible = true;
    this._opacity = 0;
    this._color = new cc.Color(255, 255, 255, 255);
    this.offset = cc.p(0,0);
    this._draworder = 'topdown';
};

cc.TMXObjectGroupInfo.prototype = {
    constructor: cc.TMXObjectGroupInfo,
    /**
     * Gets the Properties.
     * @return {Array}
     */
    getProperties () {
        return this.properties;
    },

    /**
     * Set the Properties.
     * @param {object} value
     */
    setProperties (value) {
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
 *
 * @property {string} name - Tileset name
 * @property {number} firstGid - First grid
 * @property {number} spacing - Spacing
 * @property {number} margin - Margin
 * @property {null} sourceImage - Texture containing the tiles (should be sprite sheet / texture atlas)
 * @property {cc.Size} imageSize - Size in pixels of the image
 */
cc.TMXTilesetInfo = function () {
    // Tileset name
    this.name = "";
    // First grid
    this.firstGid = 0;
    // Spacing
    this.spacing = 0;
    // Margin
    this.margin = 0;
    // Texture containing the tiles (should be sprite sheet / texture atlas)
    this.sourceImage = null;
    // Size in pixels of the image
    this.imageSize = cc.size(0, 0);

    this.tileOffset = cc.p(0, 0);

    this._tileSize = cc.size(0, 0);
};
cc.TMXTilesetInfo.prototype = {
    constructor: cc.TMXTilesetInfo,
    /**
     * Return rect
     * @param {Number} gid
     * @return {Rect}
     */
    rectForGID (gid, result) {
        let rect = result || cc.rect(0, 0, 0, 0);
        rect.width = this._tileSize.width;
        rect.height = this._tileSize.height;
        gid &= cc.TiledMap.TileFlag.FLIPPED_MASK;
        gid = gid - parseInt(this.firstGid, 10);
        let max_x = parseInt((this.imageSize.width - this.margin * 2 + this.spacing) / (this._tileSize.width + this.spacing), 10);
        rect.x = parseInt((gid % max_x) * (this._tileSize.width + this.spacing) + this.margin, 10);
        rect.y = parseInt(parseInt(gid / max_x, 10) * (this._tileSize.height + this.spacing) + this.margin, 10);
        return rect;
    }
};

function getPropertyList (node) {
    let res = [];
    let properties = node.getElementsByTagName("properties");
    for (let i = 0; i < properties.length; ++i) {
        let property = properties[i].getElementsByTagName("property");
        for (let j = 0; j < property.length; ++j) {
            res.push(property[j]);
        }
    }
    return res.length ? res : null;
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
 * @class
 * @extends cc.saxParser
 *
 * @property {Array}    properties          - Properties of the map info.
 * @property {Number}   orientation         - Map orientation.
 * @property {Object}   parentElement       - Parent element.
 * @property {Number}   parentGID           - Parent GID.
 * @property {Object}   layerAttrs        - Layer attributes.
 * @property {Boolean}  storingCharacters   - Is reading storing characters stream.
 * @property {String}   currentString       - Current string stored from characters stream.
 * @property {Number}   mapWidth            - Width of the map
 * @property {Number}   mapHeight           - Height of the map
 * @property {Number}   tileWidth           - Width of a tile
 * @property {Number}   tileHeight          - Height of a tile
 *
 * @param {String} tmxFile fileName or content string
 * @param {String} resourcePath  If tmxFile is a file name ,it is not required.If tmxFile is content string ,it is must required.
 * @example
 * 1.
 * //create a TMXMapInfo with file name
 * let tmxMapInfo = new cc.TMXMapInfo("res/orthogonal-test1.tmx");
 * 2.
 * //create a TMXMapInfo with content string and resource path
 * let resources = "res/TileMaps";
 * let filePath = "res/TileMaps/orthogonal-test1.tmx";
 * let xmlStr = cc.loader.getRes(filePath);
 * let tmxMapInfo = new cc.TMXMapInfo(xmlStr, resources);
 */

/**
 * Creates a TMX Format with a tmx file or content string                           <br/>
 * Constructor of cc.TMXMapInfo
 * @method constructor
 * @param {String} tmxFile content string
 * @param {String} resourcePath
 * @param {Object} textures
 */
cc.TMXMapInfo = function (tmxFile, resourcePath, textures) {
    this.properties = [];
    this.orientation = null;
    this.parentElement = null;
    this.parentGID = null;
    this.layerAttrs = 0;
    this.storingCharacters = false;
    this.currentString = null;

    this._parser = new cc.SAXParser();
    this._objectGroups = [];
    this._allChildren = [];
    this._mapSize = cc.size(0, 0);
    this._tileSize = cc.size(0, 0);
    this._layers = [];
    this._tilesets = [];
    this._tileProperties = {};
    this._resources = "";

    // map of textures indexed by name
    this._textures = null;

    // hex map values
    this._staggerAxis = null;
    this._staggerIndex = null;
    this._hexSideLength = 0;

    this.initWithXML(tmxFile, resourcePath, textures);
};
cc.TMXMapInfo.prototype = {
    constructor: cc.TMXMapInfo,
    /**
     * Gets Map orientation.
     * @return {Number}
     */
    getOrientation () {
        return this.orientation;
    },

    /**
     * Set the Map orientation.
     * @param {Number} value
     */
    setOrientation (value) {
        this.orientation = value;
    },

    /**
     * Gets the staggerAxis of map.
     * @return {cc.TiledMap.StaggerAxis}
     */
    getStaggerAxis () {
        return this._staggerAxis;
    },

    /**
     * Set the staggerAxis of map.
     * @param {cc.TiledMap.StaggerAxis} value
     */
    setStaggerAxis (value) {
        this._staggerAxis = value;
    },

    /**
     * Gets stagger index
     * @return {cc.TiledMap.StaggerIndex}
     */
    getStaggerIndex () {
        return this._staggerIndex;
    },

    /**
     * Set the stagger index.
     * @param {cc.TiledMap.StaggerIndex} value
     */
    setStaggerIndex (value) {
        this._staggerIndex = value;
    },

    /**
     * Gets Hex side length.
     * @return {Number}
     */
    getHexSideLength () {
        return this._hexSideLength;
    },

    /**
     * Set the Hex side length.
     * @param {Number} value
     */
    setHexSideLength (value) {
        this._hexSideLength = value;
    },

    /**
     * Map width & height
     * @return {Size}
     */
    getMapSize () {
        return cc.size(this._mapSize.width,this._mapSize.height);
    },

    /**
     * Map width & height
     * @param {Size} value
     */
    setMapSize (value) {
        this._mapSize.width = value.width;
        this._mapSize.height = value.height;
    },

	_getMapWidth () {
		return this._mapSize.width;
	},
	_setMapWidth (width) {
		this._mapSize.width = width;
	},
	_getMapHeight () {
		return this._mapSize.height;
	},
	_setMapHeight (height) {
		this._mapSize.height = height;
	},

    /**
     * Tiles width & height
     * @return {Size}
     */
    getTileSize () {
        return cc.size(this._tileSize.width, this._tileSize.height);
    },

    /**
     * Tiles width & height
     * @param {Size} value
     */
    setTileSize (value) {
        this._tileSize.width = value.width;
        this._tileSize.height = value.height;
    },

	_getTileWidth () {
		return this._tileSize.width;
	},
	_setTileWidth (width) {
		this._tileSize.width = width;
	},
	_getTileHeight () {
		return this._tileSize.height;
	},
	_setTileHeight (height) {
		this._tileSize.height = height;
	},

    /**
     * Layers
     * @return {Array}
     */
    getLayers () {
        return this._layers;
    },

    /**
     * Layers
     * @param {cc.TMXLayerInfo} value
     */
    setLayers (value) {
        this._allChildren.push(value);
        this._layers.push(value);
    },

    /**
     * tilesets
     * @return {Array}
     */
    getTilesets () {
        return this._tilesets;
    },

    /**
     * tilesets
     * @param {cc.TMXTilesetInfo} value
     */
    setTilesets (value) {
        this._tilesets.push(value);
    },

    /**
     * ObjectGroups
     * @return {Array}
     */
    getObjectGroups () {
        return this._objectGroups;
    },

    /**
     * ObjectGroups
     * @param {cc.TMXObjectGroup} value
     */
    setObjectGroups (value) {
        this._allChildren.push(value);
        this._objectGroups.push(value);
    },

    getAllChildren() {
        return this._allChildren;
    },

    /**
     * parent element
     * @return {Object}
     */
    getParentElement () {
        return this.parentElement;
    },

    /**
     * parent element
     * @param {Object} value
     */
    setParentElement (value) {
        this.parentElement = value;
    },

    /**
     * parent GID
     * @return {Number}
     */
    getParentGID () {
        return this.parentGID;
    },

    /**
     * parent GID
     * @param {Number} value
     */
    setParentGID (value) {
        this.parentGID = value;
    },

    /**
     * Layer attribute
     * @return {Object}
     */
    getLayerAttribs () {
        return this.layerAttrs;
    },

    /**
     * Layer attribute
     * @param {Object} value
     */
    setLayerAttribs (value) {
        this.layerAttrs = value;
    },

    /**
     * Is reading storing characters stream
     * @return {Boolean}
     */
    getStoringCharacters () {
        return this.storingCharacters;
    },

    /**
     * Is reading storing characters stream
     * @param {Boolean} value
     */
    setStoringCharacters (value) {
        this.storingCharacters = value;
    },

    /**
     * Properties
     * @return {Array}
     */
    getProperties () {
        return this.properties;
    },

    /**
     * Properties
     * @param {object} value
     */
    setProperties (value) {
        this.properties = value;
    },

    /**
     * initializes a TMX format with an XML string and a TMX resource path
     * @param {String} tmxString
     * @param {String} resourcePath
     * @param {Object} textures
     * @return {Boolean}
     */
    initWithXML (tmxString, resourcePath, textures) {
        this._tilesets.length = 0;
        this._layers.length = 0;

        if (resourcePath)
            this._resources = resourcePath;
        this._textures = textures;

        this._objectGroups.length = 0;
        this._allChildren.length = 0;
        this.properties.length = 0;
        this._tileProperties.length = 0;

        // tmp vars
        this.currentString = "";
        this.storingCharacters = false;
        this.layerAttrs = cc.TMXLayerInfo.ATTRIB_NONE;
        this.parentElement = cc.TiledMap.NONE;

        return this.parseXMLString(tmxString);
    },

    /** Initalises parsing of an XML file, either a tmx (Map) file or tsx (Tileset) file
     * @param {String} tmxFile
     * @param {boolean} [isXmlString=false]
     * @param {Number} tilesetFirstGid
     * @return {Element}
     */
    parseXMLFile (tmxFile, isXmlString, tilesetFirstGid) {
        isXmlString = isXmlString || false;
	    var xmlStr = isXmlString ? tmxFile : cc.loader.getRes(tmxFile);
        if (!xmlStr) {
            cc.errorID(7220, tmxFile);
        }

        let mapXML = this._parser._parseXML(xmlStr);
        let i, j;

        // PARSE <map>
        let map = mapXML.documentElement;

        let version = map.getAttribute('version');
        let orientationStr = map.getAttribute('orientation');
        let staggerAxisStr = map.getAttribute('staggeraxis');
        let staggerIndexStr = map.getAttribute('staggerindex');
        let hexSideLengthStr = map.getAttribute('hexsidelength');

        if (map.nodeName === "map") {
            if (version !== "1.0" && version !== null)
                cc.logID(7216, version);

            if (orientationStr === "orthogonal")
                this.orientation = cc.TiledMap.Orientation.ORTHO;
            else if (orientationStr === "isometric")
                this.orientation = cc.TiledMap.Orientation.ISO;
            else if (orientationStr === "hexagonal")
                this.orientation = cc.TiledMap.Orientation.HEX;
            else if (orientationStr !== null)
                cc.logID(7217, orientationStr);

            if (staggerAxisStr === 'x') {
                this.setStaggerAxis(cc.TiledMap.StaggerAxis.STAGGERAXIS_X);
            }
            else if (staggerAxisStr === 'y') {
                this.setStaggerAxis(cc.TiledMap.StaggerAxis.STAGGERAXIS_Y);
            }

            if (staggerIndexStr === 'odd') {
                this.setStaggerIndex(cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD);
            }
            else if (staggerIndexStr === 'even') {
                this.setStaggerIndex(cc.TiledMap.StaggerIndex.STAGGERINDEX_EVEN);
            }

            if (hexSideLengthStr) {
                this.setHexSideLength(parseFloat(hexSideLengthStr));
            }

            let mapSize = cc.size(0, 0);
            mapSize.width = parseFloat(map.getAttribute('width'));
            mapSize.height = parseFloat(map.getAttribute('height'));
            this.setMapSize(mapSize);

            mapSize = cc.size(0, 0);
            mapSize.width = parseFloat(map.getAttribute('tilewidth'));
            mapSize.height = parseFloat(map.getAttribute('tileheight'));
            this.setTileSize(mapSize);

            // The parent element is the map
            var propertyArr = getPropertyList(map);
            if (propertyArr) {
                let aPropertyDict = {};
                for (i = 0; i < propertyArr.length; i++) {
                    aPropertyDict[propertyArr[i].getAttribute('name')] = propertyArr[i].getAttribute('value');
                }
                this.properties = aPropertyDict;
            }
        }

        // PARSE <tileset>
        let tilesets = map.getElementsByTagName('tileset');
        if (map.nodeName !== "map") {
            tilesets = [];
            tilesets.push(map);
        }

        for (i = 0; i < tilesets.length; i++) {
            let selTileset = tilesets[i];
            // If this is an external tileset then start parsing that
            let tsxName = selTileset.getAttribute('source');
            if (tsxName) {
                let currentFirstGID = parseInt(selTileset.getAttribute('firstgid'));
                let tsxPath = isXmlString ? cc.path.join(this._resources, tsxName) : cc.path.changeBasename(tmxFile, tsxName);
                this.parseXMLFile(tsxPath, false, currentFirstGID);
            } else {
                let tileset = new cc.TMXTilesetInfo();
                tileset.name = selTileset.getAttribute('name') || "";
                if (tilesetFirstGid) {
                    tileset.firstGid = tilesetFirstGid;
                } else {
                    tileset.firstGid = parseInt(selTileset.getAttribute('firstgid')) || 0;
                }

                tileset.spacing = parseInt(selTileset.getAttribute('spacing')) || 0;
                tileset.margin = parseInt(selTileset.getAttribute('margin')) || 0;

                let tilesetSize = cc.size(0, 0);
                tilesetSize.width = parseFloat(selTileset.getAttribute('tilewidth'));
                tilesetSize.height = parseFloat(selTileset.getAttribute('tileheight'));
                tileset._tileSize = tilesetSize;

                var image = selTileset.getElementsByTagName('image')[0];
                var imagename = image.getAttribute('source');
                tileset.sourceImage = this._textures[imagename];
                if (!tileset.sourceImage) {
                    cc.errorID(7221, imagename);
                }

                this.setTilesets(tileset);

                // parse tile offset
                let offset = selTileset.getElementsByTagName('tileoffset')[0];
                if (offset) {
                    let offsetX = parseFloat(offset.getAttribute('x'));
                    let offsetY = parseFloat(offset.getAttribute('y'));
                    tileset.tileOffset = cc.p(offsetX, offsetY);
                }

                // PARSE  <tile>
                let tiles = selTileset.getElementsByTagName('tile');
                if (tiles) {
                    for (let tIdx = 0; tIdx < tiles.length; tIdx++) {
                        let t = tiles[tIdx];
                        this.parentGID = parseInt(tileset.firstGid) + parseInt(t.getAttribute('id') || 0);
                        var tp = getPropertyList(t);
                        if (tp) {
                            let dict = {};
                            for (j = 0; j < tp.length; j++) {
                                let name = tp[j].getAttribute('name');
                                dict[name] = tp[j].getAttribute('value');
                            }
                            this._tileProperties[this.parentGID] = dict;
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

            if (childNode.nodeName === 'layer') {
                let layer = this._parseLayer(childNode);
                this.setLayers(layer);
            }

            if (childNode.nodeName === 'objectgroup') {
                let objectGroup = this._parseObjectGroup(childNode);
                this.setObjectGroups(objectGroup);
            }
        }

        return map;
    },

    _shouldIgnoreNode (node) {
        return node.nodeType === 3 // text
            || node.nodeType === 8   // comment
            || node.nodeType === 4;  // cdata
    },

    _parseLayer (selLayer) {
        let data = selLayer.getElementsByTagName('data')[0];

        let layer = new cc.TMXLayerInfo();
        layer.name = selLayer.getAttribute('name');

        let layerSize = cc.size(0, 0);
        layerSize.width = parseFloat(selLayer.getAttribute('width'));
        layerSize.height = parseFloat(selLayer.getAttribute('height'));
        layer._layerSize = layerSize;

        let visible = selLayer.getAttribute('visible');
        layer.visible = !(visible == "0");

        let opacity = selLayer.getAttribute('opacity') || 1;
        if (opacity)
            layer._opacity = parseInt(255 * parseFloat(opacity));
        else
            layer._opacity = 255;
        layer.offset = cc.p(parseFloat(selLayer.getAttribute('x')) || 0, parseFloat(selLayer.getAttribute('y')) || 0);

        let nodeValue = '';
        for (let j = 0; j < data.childNodes.length; j++) {
            nodeValue += data.childNodes[j].nodeValue
        }
        nodeValue = nodeValue.trim();

        // Unpack the tilemap data
        let compression = data.getAttribute('compression');
        let encoding = data.getAttribute('encoding');
        if(compression && compression !== "gzip" && compression !== "zlib"){
            cc.logID(7218);
            return null;
        }
        let tiles;
        switch (compression) {
            case 'gzip':
                tiles = codec.unzipBase64AsArray(nodeValue, 4);
                break;
            case 'zlib':
                var inflator = new zlib.Inflate(codec.Base64.decodeAsArray(nodeValue, 1));
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
                        tiles.push(parseInt(selDataTiles[xmlIdx].getAttribute("gid")));
                }
                break;
            default:
                if(this.layerAttrs === cc.TMXLayerInfo.ATTRIB_NONE)
                    cc.logID(7219);
                break;
        }
        if (tiles) {
            layer._tiles = new Uint32Array(tiles);
        }

        // The parent element is the last layer
        var layerProps = getPropertyList(selLayer);
        if (layerProps) {
            let layerProp = {};
            for (let j = 0; j < layerProps.length; j++) {
                layerProp[layerProps[j].getAttribute('name')] = layerProps[j].getAttribute('value');
            }
            layer.properties = layerProp;
        }
        return layer;
    },

    _parseObjectGroup (selGroup) {
        let objectGroup = new cc.TMXObjectGroupInfo();
        objectGroup.name = selGroup.getAttribute('name') || '';
        objectGroup.offset = cc.p(parseFloat(selGroup.getAttribute('offsetx')), parseFloat(selGroup.getAttribute('offsety')));

        let opacity = selGroup.getAttribute('opacity') || 1;
        if (opacity)
            objectGroup._opacity = parseInt(255 * parseFloat(opacity));
        else
            objectGroup._opacity = 255;

        let visible = selGroup.getAttribute('visible');
        if (visible && parseInt(visible) === 0)
            objectGroup.visible = false;

        let color = selGroup.getAttribute('color');
        if (color)
            objectGroup._color = cc.hexToColor(color);

        let draworder = selGroup.getAttribute('draworder');
        if (draworder)
            objectGroup._draworder = draworder;

        var groupProps = getPropertyList(selGroup);
        if (groupProps) {
            let parsedProps = {};
            for (let j = 0; j < groupProps.length; j++) {
                parsedProps[groupProps[j].getAttribute('name')] = groupProps[j].getAttribute('value');
            }
            // set the properties to the group
            objectGroup.setProperties(parsedProps);
        }

        var objects = selGroup.getElementsByTagName('object');
        if (objects) {
            for (let j = 0; j < objects.length; j++) {
                let selObj = objects[j];
                // The value for "type" was blank or not a valid class name
                // Create an instance of TMXObjectInfo to store the object and its properties
                let objectProp = {};

                // Set the id of the object
                objectProp['id'] = selObj.getAttribute('id') || 0;

                // Set the name of the object to the value for "name"
                objectProp["name"] = selObj.getAttribute('name') || "";

                // Assign all the attributes as key/name pairs in the properties dictionary
                objectProp["width"] = parseFloat(selObj.getAttribute('width')) || 0;
                objectProp["height"] = parseFloat(selObj.getAttribute('height')) || 0;

                objectProp["x"] = (selObj.getAttribute('x') || 0);
                objectProp["y"] = (selObj.getAttribute('y') || 0);

                objectProp["rotation"] = parseFloat(selObj.getAttribute('rotation')) || 0;

                var docObjProps = getPropertyList(selObj);
                if (docObjProps) {
                    for (let k = 0; k < docObjProps.length; k++)
                        objectProp[docObjProps[k].getAttribute('name')] = docObjProps[k].getAttribute('value');
                }

                // visible
                let visibleAttr = selObj.getAttribute('visible');
                objectProp['visible'] = ! (visibleAttr && parseInt(visibleAttr) === 0);

                // image
                let gid = selObj.getAttribute('gid');
                if (gid) {
                    objectProp['gid'] = parseInt(gid);
                    objectProp['type'] = cc.TiledMap.TMXObjectType.IMAGE;
                }

                // ellipse
                var ellipse = selObj.getElementsByTagName('ellipse');
                if (ellipse && ellipse.length > 0) {
                    objectProp['type'] = cc.TiledMap.TMXObjectType.ELLIPSE;
                }

                //polygon
                var polygonProps = selObj.getElementsByTagName("polygon");
                if(polygonProps && polygonProps.length > 0) {
                    objectProp['type'] = cc.TiledMap.TMXObjectType.POLYGON;
                    let selPgPointStr = polygonProps[0].getAttribute('points');
                    if(selPgPointStr)
                        objectProp["points"] = this._parsePointsString(selPgPointStr);
                }

                //polyline
                var polylineProps = selObj.getElementsByTagName("polyline");
                if(polylineProps && polylineProps.length > 0) {
                    objectProp['type'] = cc.TiledMap.TMXObjectType.POLYLINE;
                    let selPlPointStr = polylineProps[0].getAttribute('points');
                    if(selPlPointStr)
                        objectProp["polylinePoints"] = this._parsePointsString(selPlPointStr);
                }

                if (!objectProp['type']) {
                    objectProp['type'] = cc.TiledMap.TMXObjectType.RECT;
                }

                // Add the object to the objectGroup
                objectGroup._objects.push(objectProp);
            }
        }
        return objectGroup;
    },

    _parsePointsString(pointsString){
         if(!pointsString)
            return null;

        let points = [];
        let pointsStr = pointsString.split(' ');
        for(let i = 0; i < pointsStr.length; i++){
            let selPointStr = pointsStr[i].split(',');
            points.push({'x':parseFloat(selPointStr[0]), 'y':parseFloat(selPointStr[1])});
        }
        return points;
    },

    /**
     * initializes parsing of an XML string, either a tmx (Map) string or tsx (Tileset) string
     * @param {String} xmlString
     * @return {Boolean}
     */
    parseXMLString (xmlString) {
        return this.parseXMLFile(xmlString, true);
    },

    /**
     * Gets the tile properties.
     * @return {object}
     */
    getTileProperties () {
        return this._tileProperties;
    },

    /**
     * Set the tile properties.
     * @param {object} tileProperties
     */
    setTileProperties (tileProperties) {
        this._tileProperties.push(tileProperties);
    },

    /**
     * Gets the currentString
     * @return {String}
     */
    getCurrentString () {
        return this.currentString;
    },

    /**
     * Set the currentString
     * @param {String} currentString
     */
    setCurrentString (currentString) {
        this.currentString = currentString;
    }
};

let _p = cc.TMXMapInfo.prototype;

// Extended properties
js.getset(_p, "mapWidth", _p._getMapWidth, _p._setMapWidth);
js.getset(_p, "mapHeight", _p._getMapHeight, _p._setMapHeight);
js.getset(_p, "tileWidth", _p._getTileWidth, _p._setTileWidth);
js.getset(_p, "tileHeight", _p._getTileHeight, _p._setTileHeight);


/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_NONE = 1 << 0;
/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_BASE64 = 1 << 1;
/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_GZIP = 1 << 2;
/**
 * @constant
 * @type Number
 */
cc.TMXLayerInfo.ATTRIB_ZLIB = 1 << 3;
