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
 * @class TMXTiledMap
 * @extends _ComponentInSG
 */
var TMXTiledMap = cc.Class({
    name: 'cc.TMXTiledMap',
    extends: require('./CCComponentInSG'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/TileMap'
    },

    properties: {
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
     * @return {cc.Size}
     */
    getMapSize:function () {
        return this._sgNode.getMapSize();
    },

    /**
     * Set the map size.
     * @param {cc.Size} Var
     */
    setMapSize:function (Var) {
        this._sgNode.setMapSize(Var);
    },

    /**
     * Gets the tile size.
     * @return {cc.Size}
     */
    getTileSize:function () {
        return this._sgNode.getTileSize();
    },

    /**
     * Set the tile size
     * @param {cc.Size} Var
     */
    setTileSize:function (Var) {
        this._sgNode.setTileSize(Var);
    },

    /**
     * map orientation
     * @return {Number}
     */
    getMapOrientation:function () {
        return this._sgNode.getMapOrientation();
    },

    /**
     * map orientation
     * @param {Number} Var
     */
    setMapOrientation:function (Var) {
        this._sgNode.setMapOrientation(Var);
    },

    /**
     * object groups
     * @return {Array}
     */
    getObjectGroups:function () {
        return this._sgNode.getObjectGroups();
    },

    /**
     * object groups
     * @param {Array} Var
     */
    setObjectGroups:function (Var) {
        this._sgNode.setObjectGroups(Var);
    },

    /**
     * Gets the map properties
     * @return {object}
     */
    getProperties:function () {
        return this._sgNode.getProperties();
    },

    /**
     * Set the map properties
     * @param {object} Var
     */
    setProperties:function (Var) {
        this._sgNode.setProperties(Var);
    },

    /**
     * Initializes the instance of cc.TMXTiledMap with tmxFile
     * @param {String} tmxFile
     * @return {Boolean} Whether the initialization was successful.
     */
    initWithTMXFile:function (tmxFile) {
        return this._sgNode.initWithTMXFile(tmxFile);
    },

    /**
     * Initializes the instance of cc.TMXTiledMap with tmxString
     * @param {String} tmxString
     * @param {String} resourcePath
     * @return {Boolean} Whether the initialization was successful.
     */
    initWithXML:function(tmxString, resourcePath){
        return this._sgNode.initWithXML(tmxString, resourcePath);
    },

    /**
     * Return All layers array.
     * @returns {Array}
     */
    allLayers: function () {
        return this._sgNode.allLayers();
    },

    /**
     * return the TMXLayer for the specific layer
     * @param {String} layerName
     * @return {cc.TMXLayer}
     */
    getLayer:function (layerName) {
        return this._sgNode.getLayer(layerName);
    },

    /**
     * Return the TMXObjectGroup for the specific group
     * @param {String} groupName
     * @return {cc.TMXObjectGroup}
     */
    getObjectGroup:function (groupName) {
        return this._sgNode.getObjectGroup(groupName);
    },

    /**
     * Return the value for the specific property name
     * @param {String} propertyName
     * @return {String}
     */
    getProperty:function (propertyName) {
        return this._sgNode.getProperty(propertyName);
    },

    /**
     * Return properties dictionary for tile GID
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

    _applyFile: function () {
        var sgNode = this._sgNode;
        var file = this._tmxFile;
        var self = this;
        if (file) {
            cc.loader.load(file, function (err, results) {
                if (err) throw err;

                sgNode.initWithTMXFile(file);
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

cc.TMXTiledMap = module.exports = TMXTiledMap;
