/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
/**
 * !#en Renders the TMX object group.
 * !#zh 渲染 tmx object group。
 * @class TiledObjectGroup
 * @extends Component
 */
let TiledObjectGroup = cc.Class({
    name: 'cc.TiledObjectGroup',

    // Inherits from the abstract class directly,
    // because TiledLayer not create or maintains the sgNode by itself.
    extends: cc.Component,

    /**
     * !#en Offset position of child objects.
     * !#zh 获取子对象的偏移位置。
     * @method getPositionOffset
     * @return {Vec2}
     * @example
     * let offset = tMXObjectGroup.getPositionOffset();
     */
    getPositionOffset () {
        return this._positionOffset;
    },

    /**
     * !#en List of properties stored in a dictionary.
     * !#zh 以映射的形式获取属性列表。
     * @method getProperties
     * @return {Object}
     * @example
     * let offset = tMXObjectGroup.getProperties();
     */
    getProperties () {
        return this._properties;
    },

    /**
     * !#en Gets the Group name.
     * !#zh 获取组名称。
     * @method getGroupName
     * @return {String}
     * @example
     * let groupName = tMXObjectGroup.getGroupName;
     */
    getGroupName () {
        return this._groupName;
    },

    /**
     * Return the value for the specific property name
     * @param {String} propertyName
     * @return {Object}
     */
    getProperty (propertyName) {
        return this._properties[propertyName.toString()];
    },

    /**
     * !#en
     * Return the object for the specific object name. <br />
     * It will return the 1st object found on the array for the given name.
     * !#zh 获取指定的对象。
     * @method getObject
     * @param {String} objectName
     * @return {Object|Null}
     * @example
     * let object = tMXObjectGroup.getObject("Group");
     */
    getObject (objectName) {
        for (let i = 0, len = this._objects.length; i < len; i++) {
            let obj = this._objects[i];
            if (obj && obj.name === objectName) {
                return obj;
            }
        }
        // object not found
        return null;
    },

    /**
     * !#en Gets the objects.
     * !#zh 获取对象数组。
     * @method getObjects
     * @return {Array}
     * @example
     * let objects = tMXObjectGroup.getObjects();
     */
    getObjects () {
        return this._objects;
    },

    _init (groupInfo, mapInfo, texGrids) {
        const TiledMap = cc.TiledMap;
        const TMXObjectType = TiledMap.TMXObjectType;
        const Orientation = TiledMap.Orientation;
        const StaggerAxis = TiledMap.StaggerAxis;
        const TileFlag = TiledMap.TileFlag;
        const FLIPPED_MASK = TileFlag.FLIPPED_MASK;
        const FLAG_HORIZONTAL = TileFlag.HORIZONTAL;
        const FLAG_VERTICAL = TileFlag.VERTICAL;

        this._groupName = groupInfo.name;
        this._positionOffset = groupInfo.offset;
        this._mapInfo = mapInfo;
        this._properties = groupInfo.getProperties();
        this._offset = cc.v2(groupInfo.offset.x, -groupInfo.offset.y);
        this._opacity = groupInfo._opacity;

        let mapSize = mapInfo._mapSize;
        let tileSize = mapInfo._tileSize;
        let width = 0, height = 0;
        if (mapInfo.orientation === Orientation.HEX) {
            if (mapInfo.getStaggerAxis() === StaggerAxis.STAGGERAXIS_X) {
                height = tileSize.height * (mapSize.height + 0.5);
                width = (tileSize.width + mapInfo.getHexSideLength()) * Math.floor(mapSize.width / 2) + tileSize.width * (mapSize.width % 2);
            } else {
                width = tileSize.width * (mapSize.width + 0.5);
                height = (tileSize.height + mapInfo.getHexSideLength()) * Math.floor(mapSize.height / 2) + tileSize.height * (mapSize.height % 2);
            }
        } else if (mapInfo.orientation === Orientation.ISO) {
            let wh = mapSize.width + mapSize.height;
            width = tileSize.width * 0.5 * wh;
            height = tileSize.height * 0.5 * wh;
        } else {
            width = mapSize.width * tileSize.width; 
            height = mapSize.height * tileSize.height;
        }
        this.node.setContentSize(width, height);

        let leftTopX = width * this.node.anchorX;
        let leftTopY = height * (1 - this.node.anchorY);

        let objects = groupInfo._objects;
        let aliveNodes = {};
        for (let i = 0, l = objects.length; i < l; i++) {
            let object = objects[i];
            let objType = object.type;
            object.offset = cc.v2(object.x, object.y);
            
            let points = object.points || object.polylinePoints;
            if (points) {
                for (let pi = 0; pi < points.length; pi++) {
                    points[pi].y *= -1;
                }
            }         

            if (Orientation.ISO !== mapInfo.orientation) {
                object.y = height - object.y;
            } else {
                let posIdxX = object.x / tileSize.height;
                let posIdxY = object.y / tileSize.height;
                object.x = tileSize.width * 0.5 * (mapSize.height + posIdxX - posIdxY);
                object.y = tileSize.height * 0.5 * (mapSize.width + mapSize.height - posIdxX - posIdxY);
            }

            if (objType === TMXObjectType.TEXT) {
                let textName = "text" + object.id;
                aliveNodes[textName] = true;

                let textNode = this.node.getChildByName(textName);
                if (!textNode) {
                    textNode = new cc.Node();
                }

                textNode.active = object.visible;
                textNode.anchorX = 0;
                textNode.anchorY = 1;
                textNode.angle = -object.rotation;
                textNode.x = object.x - leftTopX;
                textNode.y = object.y - leftTopY;
                textNode.name = textName;
                textNode.parent = this.node;
                textNode.color = object.color;
                textNode.opacity = this._opacity;
                textNode.setSiblingIndex(i);

                let label = textNode.getComponent(cc.Label);
                if (!label) {
                    label = textNode.addComponent(cc.Label);
                }
                
                label.overflow = cc.Label.Overflow.SHRINK;
                label.lineHeight = object.height;
                label.string = object.text;
                label.horizontalAlign = object.halign;
                label.verticalAlign = object.valign;
                label.fontSize = object.pixelsize;

                textNode.width = object.width;
                textNode.height = object.height;
            }

            if (objType === TMXObjectType.IMAGE) {
                let gid = object.gid;
                let grid = texGrids[(gid & FLIPPED_MASK) >>> 0];
                if (!grid) continue;
                let tileset = grid.tileset;
                let imgName = "img" + object.id;
                aliveNodes[imgName] = true;
                let imgNode = this.node.getChildByName(imgName);
                let imgWidth = object.width || grid.width;
                let imgHeight = object.height || grid.height;
                let tileOffsetX = tileset.tileOffset.x;
                let tileOffsetY = tileset.tileOffset.y;

                // Delete image nodes implemented as private nodes
                // Use cc.Node to implement node-level requirements
                if (imgNode instanceof cc.PrivateNode) {
                    imgNode.removeFromParent();
                    imgNode.destroy();
                    imgNode = null;
                }

                if (!imgNode) {
                    imgNode = new cc.Node();
                }

                if (Orientation.ISO == mapInfo.orientation) {
                    imgNode.anchorX = 0.5 + tileOffsetX / imgWidth;
                    imgNode.anchorY = tileOffsetY / imgHeight;
                } else {
                    imgNode.anchorX = tileOffsetX / imgWidth;
                    imgNode.anchorY = tileOffsetY / imgHeight;
                }
                imgNode.active = object.visible;
                imgNode.angle = -object.rotation;
                imgNode.x = object.x - leftTopX;
                imgNode.y = object.y - leftTopY;
                imgNode.name = imgName;
                imgNode.parent = this.node;
                imgNode.opacity = this._opacity;
                imgNode.setSiblingIndex(i);

                let sp = imgNode.getComponent(cc.Sprite);
                if (!sp) {
                    sp = imgNode.addComponent(cc.Sprite);
                }
                let spf = sp.spriteFrame;
                if (!spf) {
                    spf = new cc.SpriteFrame();
                }

                if ((gid & FLAG_HORIZONTAL) >>> 0) {
                    spf.setFlipX(true);
                } else {
                    spf.setFlipX(false);
                }

                if ((gid & FLAG_VERTICAL) >>> 0) {
                    spf.setFlipY(true);
                } else {
                    spf.setFlipY(false);
                }

                spf.setTexture(grid.tileset.sourceImage, cc.rect(grid));
                sp.spriteFrame = spf;
                sp.setVertsDirty();

                // object group may has no width or height info
                imgNode.width = imgWidth;
                imgNode.height = imgHeight;
            }
        }
        this._objects = objects;

        // destroy useless node
        let children = this.node.children;
        let uselessExp = /^(?:img|text)\d+$/;
        for (let i = 0, n = children.length; i < n; i++) {
            let c = children[i];
            let cName = c._name;
            let isUseless = uselessExp.test(cName);
            if (isUseless && !aliveNodes[cName]) c.destroy();
        }
    }
});

cc.TiledObjectGroup = module.exports = TiledObjectGroup;
