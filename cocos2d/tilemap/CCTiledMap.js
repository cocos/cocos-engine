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
 * @extends _ComponentInSG
 */
var TiledMap = cc.Class({
    name: 'cc.TiledMap',
    extends: require('./../core/components/CCComponentInSG'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/TiledMap'
    },

    properties: {
        /**
         * The tmx file.
         * @property {string} file
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

    /**
     * Gets the map size.
     * @method getMapSize
     * @return {cc.Size}
     */
    getMapSize:function () {
        return this._sgNode.getMapSize();
    },

    /**
     * Set the map size.
     * @method setMapSize
     * @param {cc.Size} Var
     */
    setMapSize:function (Var) {
        this._sgNode.setMapSize(Var);
    },

    /**
     * Gets the tile size.
     * @method getTileSize
     * @return {cc.Size}
     */
    getTileSize:function () {
        return this._sgNode.getTileSize();
    },

    /**
     * Set the tile size
     * @method setTileSize
     * @param {cc.Size} Var
     */
    setTileSize:function (Var) {
        this._sgNode.setTileSize(Var);
    },

    /**
     * map orientation
     * @method getMapOrientation
     * @return {Number}
     */
    getMapOrientation:function () {
        return this._sgNode.getMapOrientation();
    },

    /**
     * map orientation
     * @method setMapOrientation
     * @param {Number} Var
     */
    setMapOrientation:function (Var) {
        this._sgNode.setMapOrientation(Var);
    },

    /**
     * object groups
     * @method getObjectGroups
     * @return {Array}
     */
    getObjectGroups:function () {
        return this._sgNode.getObjectGroups();
    },

    /**
     * object groups
     * @method setObjectGroups
     * @param {Array} Var
     */
    setObjectGroups:function (Var) {
        this._sgNode.setObjectGroups(Var);
    },

    /**
     * Gets the map properties
     * @method getProperties
     * @return {object}
     */
    getProperties:function () {
        return this._sgNode.getProperties();
    },

    /**
     * Set the map properties
     * @method setProperties
     * @param {object} Var
     */
    setProperties:function (Var) {
        this._sgNode.setProperties(Var);
    },

    /**
     * Initializes the instance of cc.TiledMap with tmxFile
     * @method initWithTMXFile
     * @param {String} tmxFile
     * @return {Boolean} Whether the initialization was successful.
     */
    initWithTMXFile:function (tmxFile) {
        return this._sgNode.initWithTMXFile(tmxFile);
    },

    /**
     * Initializes the instance of cc.TiledMap with tmxString
     * @method initWithXML
     * @param {String} tmxString
     * @param {String} resourcePath
     * @return {Boolean} Whether the initialization was successful.
     */
    initWithXML:function(tmxString, resourcePath){
        return this._sgNode.initWithXML(tmxString, resourcePath);
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
        return this._sgNode.getObjectGroup(groupName);
    },

    /**
     * Return the value for the specific property name
     * @method getProperty
     * @param {String} propertyName
     * @return {String}
     */
    getProperty:function (propertyName) {
        return this._sgNode.getProperty(propertyName);
    },

    /**
     * Return properties dictionary for tile GID
     * @method getPropertiesForGID
     * @param {Number} GID
     * @return {object}
     */
    getPropertiesForGID: function(GID) {
        return this._sgNode.getPropertiesForGID(GID);
    },

    onEnable: function () {
        if (this._sgNode && this._tmxFile) {
            this._sgNode.setVisible(true);
        }
    },

    onDestroy: function () {
        this._super();

        // remove the logic children for tmx layers
        var logicChildren = this.node.getChildren();
        var needRemove = [];
        var i, n;
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

    _preloadTmx: function(file, cb) {
        cc.loader.load(file, function (err) {
            if (err) {
                if (cb) cb(err);
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

    _initLayers: function() {
        // get the layer names in scene graph.
        var layerNames = this._sgNode.allLayers().map(function (layer) {
            return layer.getLayerName();
        });

        var logicChildren = this.node.getChildren();
        var addedChildren = [];
        var needRemove = [];
        var existedLayers = [];
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
                    var newSGLayer = this._sgNode.getLayer(layerName);
                    tmxLayer.bindSgLayer(newSGLayer);
                }
            } else {
                // not a tmx layer
                addedChildren.push(child);
            }
        }

        // remove the deprecated tmx layers
        for (i = 0, n = needRemove.length; i < n; i++) {
            this.node.removeChild(needRemove[i]);
        }

        var existedNames = existedLayers.map(function(node) {
            var tmxLayer = node.getComponent('cc.TiledLayer');
            return tmxLayer.getLayerName();
        });

        // add new tmx layers
        for (i = 0, n = layerNames.length; i < n; i++) {
            var name = layerNames[i];
            if (existedNames.indexOf(name) < 0) {
                // need add entity for the tmx layer
                var node = new cc.Node(name);
                var addedLayer = node.addComponent(cc.TiledLayer);
                var sgLayer = this._sgNode.getLayer(name);
                addedLayer.bindSgLayer(sgLayer);
                this.node.addChild(node);
                node.setSiblingIndex(sgLayer.getLocalZOrder());
            }
        }

        // TODO reorder the children of this.node
    },

    _applyFile: function () {
        var sgNode = this._sgNode;
        var file = this._tmxFile;
        var self = this;
        if (file) {
            this._preloadTmx(file, function (err, results) {
                if (err) throw err;

                sgNode.initWithTMXFile(file);
                self._initLayers();
                if (self.enabledInHierarchy && !sgNode.isVisible()) {
                    sgNode.setVisible(true);
                }
            });
        } else {
            sgNode.setVisible(false);
        }
    },

    _createSgNode: function () {
        return new _ccsg.TMXTiledMap();
    },

    _initSgNode: function () {
        this._applyFile();
    }
});

cc.TiledMap = module.exports = TiledMap;
