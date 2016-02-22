/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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

/**
 * Renders a TMX Tile Map in the scene.
 * @class TiledMap
 * @extends Component
 */
var TiledMap = cc.Class({
    name: 'cc.TiledMap',
    extends: require('../core/components/CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/TiledMap',
        executeInEditMode: true
    },

    properties: {
        _tiledMap: {
            default: null,
            serializable: false,
        },

        /**
         * The tmx file.
         * @property {string} tmxFile
         * @default ""
         */
        _tmxFile: {
            default: '',
            url: cc.TiledMapAsset
        },

        tmxFile : {
            get: function () {
                return this._tmxFile;
            },
            set: function (value, force) {
                if (this._tmxFile !== value || (CC_EDITOR && force)) {
                    this._tmxFile = value;
                    this._applyFile();
                }
            },
            url: cc.TiledMapAsset
        }
    },

    ctor: function () {
        this._tiledMap = new _ccsg.TMXTiledMap();
        if (cc.sys.isNative) {
            this._tiledMap.retain();
        }
    },

    /**
     * Gets the map size.
     * @method getMapSize
     * @return {cc.Size}
     */
    getMapSize:function () {
        return this._tiledMap.getMapSize();
    },

    /**
     * Set the map size.
     * @method setMapSize
     * @param {cc.Size} mapSize
     */
    setMapSize:function (mapSize) {
        this._tiledMap.setMapSize(mapSize);
    },

    /**
     * Gets the tile size.
     * @method getTileSize
     * @return {cc.Size}
     */
    getTileSize:function () {
        return this._tiledMap.getTileSize();
    },

    /**
     * Set the tile size
     * @method setTileSize
     * @param {cc.Size} tileSize
     */
    setTileSize:function (tileSize) {
        this._tiledMap.setTileSize(tileSize);
    },

    /**
     * map orientation
     * @method getMapOrientation
     * @return {Number}
     */
    getMapOrientation:function () {
        return this._tiledMap.getMapOrientation();
    },

    /**
     * map orientation
     * @method setMapOrientation
     * @param {Number} orientation
     */
    setMapOrientation:function (orientation) {
        this._tiledMap.setMapOrientation(orientation);
    },

    /**
     * object groups
     * @method getObjectGroups
     * @return {Array}
     */
    getObjectGroups:function () {
        return this._tiledMap.getObjectGroups();
    },

    /**
     * object groups
     * @method setObjectGroups
     * @param {Array} groups
     */
    setObjectGroups:function (groups) {
        this._tiledMap.setObjectGroups(groups);
    },

    /**
     * Gets the map properties
     * @method getProperties
     * @return {object}
     */
    getProperties:function () {
        return this._tiledMap.getProperties();
    },

    /**
     * Set the map properties
     * @method setProperties
     * @param {object} properties
     */
    setProperties:function (properties) {
        this._tiledMap.setProperties(properties);
    },

    /**
     * Initializes the instance of cc.TiledMap with tmxFile
     * @method initWithTMXFile
     * @param {String} tmxFile
     * @return {Boolean} Whether the initialization was successful.
     */
    initWithTMXFile:function (tmxFile) {
        return this._tiledMap.initWithTMXFile(tmxFile);
    },

    /**
     * Initializes the instance of cc.TiledMap with tmxString
     * @method initWithXML
     * @param {String} tmxString
     * @param {String} resourcePath
     * @return {Boolean} Whether the initialization was successful.
     */
    initWithXML:function(tmxString, resourcePath){
        return this._tiledMap.initWithXML(tmxString, resourcePath);
    },

    /**
     * Return All layers array.
     * @method allLayers
     * @returns {Array}
     */
    allLayers: function () {
        var logicChildren = this.node.getChildren();
        var ret = [];
        for (var i = 0, n = logicChildren.length; i < n; i++) {
            var child = logicChildren[i];
            var tmxLayer = child.getComponent('cc.TiledLayer');
            if (tmxLayer) {
                ret.push(tmxLayer);
            }
        }

        return ret;
    },

    /**
     * return the cc.TiledLayer for the specific layer
     * @method getLayer
     * @param {String} layerName
     * @return {cc.TiledLayer}
     */
    getLayer:function (layerName) {
        var logicChildren = this.node.getChildren();
        var ret = null;
        for (var i = 0, n = logicChildren.length; i < n; i++) {
            var child = logicChildren[i];
            var tmxLayer = child.getComponent('cc.TiledLayer');
            if (tmxLayer && tmxLayer.getLayerName() === layerName) {
                ret = tmxLayer;
                break;
            }
        }

        return ret;
    },

    /**
     * Return the TMXObjectGroup for the specific group
     * @method getObjectGroup
     * @param {String} groupName
     * @return {cc.TMXObjectGroup}
     */
    getObjectGroup:function (groupName) {
        return this._tiledMap.getObjectGroup(groupName);
    },

    /**
     * Return the value for the specific property name
     * @method getProperty
     * @param {String} propertyName
     * @return {String}
     */
    getProperty:function (propertyName) {
        return this._tiledMap.getProperty(propertyName);
    },

    /**
     * Return properties dictionary for tile GID
     * @method getPropertiesForGID
     * @param {Number} GID
     * @return {object}
     */
    getPropertiesForGID: function(GID) {
        return this._tiledMap.getPropertiesForGID(GID);
    },

    onEnable: function () {
        this.node._replaceSgNode(this._tiledMap);

        if (this._tmxFile) {
            // Add layer entities
            this._addLayerEntities();
        }

        this.node.on('child-added', this._childAdded, this);
        this.node.on('child-reorder', this._reorderChildren, this);
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = this._tiledMap;
        }
    },

    onDisable: function () {
        // replace a new sgNode
        var newNode = new _ccsg.Node();
        this.node._replaceSgNode(newNode);

        // remove the logic children for tmx layers
        this._removeLayerEntities();

        // should move the tmx layers from newNode to _tiledMap
        this._moveLayersInSgNode(newNode);

        this.node.off('child-added', this._childAdded, this);
        this.node.off('child-reorder', this._reorderChildren, this);
        if ( this.node._sizeProvider === this._tiledMap ) {
            this.node._sizeProvider = newNode;
        }
    },

    onLoad: function () {
        this._applyFile();
    },

    onDestroy: function () {
        if (cc.sys.isNative) {
            this._tiledMap && this._tiledMap.release();
        }
    },

    _preloadTmx: function(file, cb) {
        cc.loader.load(file, function (err, items) {
            if (err) {
                if (cb) cb(items.getError(file) || new Error('Unknown error'));
                return;
            }

            var mapInfo = new cc.TMXMapInfo(file);
            var sets = mapInfo.getTilesets();

            if (sets) {
                var textures = sets.map(function (set) {
                    return set.sourceImage;
                });

                cc.loader.load(textures, function (err) {
                    cb(err, textures);
                });
            }
            else {
                if (cb) cb();
            }
        });
    },

    _moveLayersInSgNode: function(sgNode) {
        var children = sgNode.getChildren();
        var needRemove = [];
        for (var i = 0, n = children.length; i < n; i++) {
            var child = children[i];
            if (child instanceof _ccsg.TMXLayer) {
                needRemove.push({child: child, zorder: child.getLocalZOrder()});
            }
        }
        for (i = 0, n = needRemove.length; i < n; i++) {
            var info = needRemove[i];
            sgNode.removeChild(info.child);
            this._tiledMap.addChild(info.child, info.zorder, info.zorder);
        }
    },

    _addLayerEntities: function() {
        // add entity for the tmx layer
        var layers = this._tiledMap.allLayers();
        for (var i = 0, n = layers.length; i < n; i++) {
            var layer = layers[i];
            var name = layer.getLayerName();
            var node = new cc.Node(name);
            var addedLayer = node.addComponent(cc.TiledLayer);
            addedLayer._replaceSgNode(layer);
            this.node.addChild(node);
            node.setSiblingIndex(layer.getLocalZOrder());
        }
    },

    _removeLayerEntities: function() {
        var i, n;
        var logicChildren = this.node.getChildren();
        var needRemove = [];
        for (i = 0, n = logicChildren.length; i < n; i++) {
            var child = logicChildren[i];
            var tmxLayer = child.getComponent('cc.TiledLayer');
            if (tmxLayer) {
                needRemove.push(child);
            }
        }

        for (i = 0, n = needRemove.length; i < n; i++) {
            this.node.removeChild(needRemove[i]);
        }
    },

    _initLayers: function() {
        // get the layer names in scene graph.
        var layerNames = this._tiledMap.allLayers().map(function (layer) {
            return layer.getLayerName();
        });

        var logicChildren = this.node.getChildren();
        var needRemove = [];
        var existedLayers = [];
        var otherChildrenInfo = [];
        var i, n;

        // check the children of this.node
        for (i = 0, n = logicChildren.length; i < n; i++) {
            var child = logicChildren[i];
            var tmxLayer = child.getComponent('cc.TiledLayer');
            if (tmxLayer) {
                var layerName = tmxLayer.getLayerName();
                if (layerNames.indexOf(layerName) < 0) {
                    // the tmx layer should be removed
                    needRemove.push(child);
                } else {
                    // the tmx layer should be updated
                    existedLayers.push(child);
                    var newSGLayer = this._tiledMap.getLayer(layerName);
                    tmxLayer._replaceSgNode(newSGLayer);
                }
            } else {
                otherChildrenInfo.push({child: child, index: child.getSiblingIndex()});
            }
        }

        // remove the deprecated tmx layers
        for (i = 0, n = needRemove.length; i < n; i++) {
            this.node.removeChild(needRemove[i]);
        }

        // add new tmx layers & update the sibling index with ZOrder
        var existedNames = existedLayers.map(function(node) {
            var tmxLayer = node.getComponent('cc.TiledLayer');
            return tmxLayer.getLayerName();
        });

        for (i = 0, n = layerNames.length; i < n; i++) {
            var name = layerNames[i];
            var sgLayer = this._tiledMap.getLayer(name);
            if (existedNames.indexOf(name) < 0) {
                // need add entity for the tmx layer
                var node = new cc.Node(name);
                var addedLayer = node.addComponent(cc.TiledLayer);
                addedLayer._replaceSgNode(sgLayer);
                this.node.addChild(node);
                node.setSiblingIndex(sgLayer.getLocalZOrder());
            } else {
                existedLayers[i].setSiblingIndex(sgLayer.getLocalZOrder());
            }
        }

        // update the sibling index of the other children
        for (i = 0, n = otherChildrenInfo.length; i < n; i++) {
            var info = otherChildrenInfo[i];
            info.child.setSiblingIndex(info.index);
        }

        // reorder the children
        this._reorderChildren();
    },

    _childAdded: function(event) {
        var node = event.detail;
        if (node) {
            var tmxLayer = node.getComponent('cc.TiledLayer');
            if (!tmxLayer) {
                var childrenCount = this.node.getChildrenCount();
                node.setSiblingIndex(childrenCount);
                if (node._sgNode) {
                    node._sgNode.setLocalZOrder(childrenCount);
                }
            }
        }
    },

    _reorderChildren: function() {
        var logicChildren = this.node.getChildren();
        for (var i = 0, n = logicChildren.length; i < n; i++) {
            var child = logicChildren[i];
            var tmxLayer = child.getComponent('cc.TiledLayer');
            var zOrderValue = child.getSiblingIndex();
            if (tmxLayer) {
                tmxLayer._sgNode.setLocalZOrder(zOrderValue);
            } else {
                if (child._sgNode) {
                    child._sgNode.setLocalZOrder(zOrderValue);
                }
            }
        }
    },

    _applyFile: function () {
        var sgNode = this._tiledMap;
        var file = this._tmxFile;
        var self = this;
        if (file) {
            this._preloadTmx(file, function (err, results) {
                if (err) throw err;

                sgNode.initWithTMXFile(file);
                if (self._enabled) {
                    self._initLayers();
                }
            });
        } else {
            // tmx file is cleared
            // 1. hide the tmx layers in _tiledMap
            var layers = self._tiledMap.allLayers();
            for (var i = 0, n = layers.length; i < n; i++) {
                self._tiledMap.removeChild(layers);
            }

            // 2. if the component is enabled,
            //    should remove the entities for tmx layers in node
            if (self._enabled) {
                self._removeLayerEntities();
            }
        }
    },
});

cc.TiledMap = module.exports = TiledMap;
