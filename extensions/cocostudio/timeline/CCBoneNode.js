/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.

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

//9980397

/**
 * BoneNode
 * base class
 * @class
 */
ccs.BoneNode = (function () {

    var Node = _ccsg.Node;
    var SkinNode = ccs.SkinNode;
    var BlendFunc = cc.BlendFunc;
    var type = {
        p: cc.p,
        size: cc.size,
        rect: cc.rect
    };
    var debug = {
        log: cc.log,
        assert: cc.assert
    };

    var BoneNode = Node.extend(/** @lends ccs.BoneNode# */{
        _customCommand: null,
        _blendFunc: null,

        _rackColor: null,

        _rackLength: null,
        _rackWidth: null,

        _childBones: null,
        _boneSkins: null,
        _rootSkeleton: null,

        _squareVertices: null,
        _squareColors: null,
        _noMVPVertices: null,

        ctor: function (length) {
            Node.prototype.ctor.call(this);
            // null
            // length
            // _isRackShow -> _renderCmd._debug
            if (this._squareVertices === null)
                this._squareVertices = [
                    {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}
                ];

            this._rackColor = cc.Color.WHITE;
            this._blendFunc = BlendFunc.ALPHA_NON_PREMULTIPLIED;

            this._childBones = [];
            this._boneSkins = [];

            this._rackLength = length === undefined ? 50 : length;
            this._rackWidth = 20;
            this._updateVertices();
            //this._updateColor();
        },

        addSkin: function (skin, display, hideOthers/*false*/) {
            // skin, display
            // skin, display, hideOthers
            var boneSkins = this._boneSkins;
            debug.assert(skin != null, "Argument must be non-nil");
            if (hideOthers) {
                for (var i = 0; i < boneSkins.length; i++) {
                    boneSkins[i].setVisible(false);
                }
            }
            Node.prototype.addChild.call(this, skin);
            this._boneSkins.push(skin);
            skin.setVisible(display);
        },

        getChildBones: function () {
            return this._childBones;
        },

        getSkins: function () {
            return this._boneSkins;
        },

        displaySkin: function (skin, hideOthers) {
            var boneSkins = this._boneSkins;
            var boneSkin, i;
            if (typeof skin === "string") {
                for (i = 0; i < boneSkins.length; i++) {
                    boneSkin = boneSkins[i];
                    if (skin == boneSkin.getName()) {
                        boneSkin.setVisible(true);
                    } else if (hideOthers) {
                        boneSkin.setVisible(false);
                    }
                }
            } else {
                for (i = 0; i < boneSkins.length; i++) {
                    boneSkin = boneSkins[i];
                    if (boneSkin == skin) {
                        boneSkin.setVisible(true);
                    } else if (hideOthers) {
                        boneSkin.setVisible(false);
                    }
                }
            }
        },

        getVisibleSkins: function () {
            var displayingSkins = [];
            var boneSkins = this._boneSkins;
            for (var boneSkin, i = 0; i < boneSkins.length; i++) {
                boneSkin = boneSkins[i];
                if (boneSkin.isVisible()) {
                    displayingSkins.push(boneSkin);
                }
            }
            return displayingSkins;
        },

        getRootSkeletonNode: function () {
            return this._rootSkeleton;
        },

        getAllSubBones: function () {
            var allBones = [];
            var boneStack = []; // for avoid recursive
            var childBones = this._childBones;
            for (var i = 0; i < childBones.length; i++) {
                boneStack.push(childBones[i]);
            }

            while (boneStack.length > 0) {
                var top = boneStack.pop();
                allBones.push(top);
                var topChildren = top.getChildBones();
                for (var j = 0; j < topChildren; j++) {
                    boneStack.push(topChildren[j]);
                }
            }
            return allBones;
        },

        getAllSubSkins: function () {
            var allBones = this.getAllSubBones();
            var allSkins = [];
            for (var i = 0; i < allBones.length; i++) {
                var skins = allBones[i].getSkins();
                for (var j = 0; j < skins.length; j++) {
                    allSkins.push(skins[i]);
                }
            }
            return allSkins;
        },

        addChild: function (child, localZOrder, tag) {
            //child, localZOrder, tag
            //child, localZOrder, name
            Node.prototype.addChild.call(this, child, localZOrder, tag);
            this._addToChildrenListHelper(child);
        },

        removeChild: function (child, cleanup) {
            if(this._children.indexOf(child) !== -1){
                Node.prototype.removeChild.call(this, child, cleanup);
                this._removeFromChildrenListHelper(child);
            }
        },

        setBlendFunc: function (blendFunc) {
            var ob = this._blendFunc;
            if(blendFunc && ob.src !== blendFunc.src && ob.dst !== blendFunc.dst){
                this._blendFunc = blendFunc;
                var boneSkins = this._boneSkins;
                for (var boneSkin, i = 0; i < boneSkins.length; i++) {
                    boneSkin = boneSkins[i];
                    boneSkin.setBlendFunc(blendFunc);
                }
            }
        },

        getBlendFunc: function () {
            return this._blendFunc;
        },

        setDebugDrawLength: function (length) {
            this._rackLength = length;
            this._updateVertices();
        },

        getDebugDrawLength: function () {
            return this._rackLength;
        },

        setDebugDrawWidth: function (width) {
            this._rackWidth = width;
            this._updateVertices();
        },

        getDebugDrawWidth: function () {
            return this._rackWidth;
        },

        setDebugDrawEnabled: function (isDebugDraw) {
            var renderCmd = this._renderCmd;
            if (renderCmd._debug === isDebugDraw)
                return;

            renderCmd._debug = isDebugDraw;
            cc.renderer.childrenOrderDirty = true;

            if(this._visible && null != this._rootSkeleton){
                this._rootSkeleton._subBonesDirty = true;
                this._rootSkeleton._subBonesOrderDirty = true;
            }
        },

        isDebugDrawEnabled: function () {
            return this._renderCmd._debug;
        },

        setDebugDrawColor: function (color) {
            this._rackColor = color;
        },

        getDebugDrawColor: function () {
            return this._rackColor;
        },

        getVisibleSkinsRect: function () {
            var minx, miny, maxx, maxy = 0;
            minx = miny = maxx = maxy;
            var first = true;

            var displayRect = type.rect(0, 0, 0, 0);
            if (this._renderCmd._debug && this._rootSkeleton != null && this._rootSkeleton._renderCmd._debug) {
                maxx = this._rackWidth;
                maxy = this._rackLength;
                first = false;
            }

            var boneSkins = this._boneSkins;
            for (var skin, i = 0; i < boneSkins.length; i++) {
                skin = boneSkins[i];
                var r = skin.getBoundingBox();
                if (!skin.isVisible() || (r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0))
                    continue;

                if (first) {
                    minx = cc.rectGetMinX(r);
                    miny = cc.rectGetMinY(r);
                    maxx = cc.rectGetMaxX(r);
                    maxy = cc.rectGetMaxY(r);

                    first = false;
                } else {
                    minx = Math.min(cc.rectGetMinX(r), minx);
                    miny = Math.min(cc.rectGetMinY(r), miny);
                    maxx = Math.max(cc.rectGetMaxX(r), maxx);
                    maxy = Math.max(cc.rectGetMaxY(r), maxy);
                }
                displayRect.setRect(minx, miny, maxx - minx, maxy - miny);
            }
            return displayRect;
        },

        getBoundingBox: function () {
            var boundingBox = this.getVisibleSkinsRect();
            return cc.rectApplyAffineTransform(boundingBox, this.getNodeToParentAffineTransform());
        },

        batchBoneDrawToSkeleton: function (bone) {},

        setLocalZOrder: function (localZOrder) {
            Node.prototype.setLocalZOrder.call(this, localZOrder);
            if (this._rootSkeleton != null)
                this._rootSkeleton._subBonesOrderDirty = true;
        },

        setName: function (name) {
            var rootSkeleton = this._rootSkeleton;
            var oldName = this.getName();
            Node.prototype.setName.call(this, name);
            if (rootSkeleton != null) {
                var oIter = rootSkeleton._subBonesMap[oldName];
                var nIter = rootSkeleton._subBonesMap[name];
                if (oIter && !nIter) {
                    delete rootSkeleton._subBonesMap[oIter];
                    rootSkeleton._subBonesMap[name] = oIter;
                }
            }
        },

        setContentSize: function(contentSize){
            Node.prototype.setContentSize.call(this, contentSize);
            this._updateVertices();
        },

        setAnchorPoint: function(anchorPoint){
            Node.prototype.setAnchorPoint.call(this, anchorPoint);
            this._updateVertices();
        },

        setVisible: function (visible) {
            if (this._visible == visible)
                return;
            Node.prototype.setVisible.call(this, visible);
            if (this._rootSkeleton != null){
                this._rootSkeleton._subBonesDirty = true;
                this._rootSkeleton._subBonesOrderDirty = true;
            }
        },

        _addToChildrenListHelper: function (child) {
            if (child instanceof BoneNode) {
                this._addToBoneList(child);
            } else {
                //if (child instanceof SkinNode) {
                    this._addToSkinList(child);
                //}
            }
        },

        _removeFromChildrenListHelper: function (child) {
            if (child instanceof BoneNode) {
                this._removeFromBoneList(child);
            }else{
                if (child instanceof SkinNode)
                    this._removeFromSkinList(skin);
            }
        },

        _removeFromBoneList: function (bone) {
            if(
                this._rootSkeleton != null &&
                bone instanceof ccs.SkeletonNode &&
                bone._rootSkeleton === this._rootSkeleton
            ){
                bone._rootSkeleton = null;
                var subBones = bone.getAllSubBones();
                subBones.push(bone);
                for (var subBone, i = 0; i < subBones.length; i++) {
                    subBone = subBones[i];
                    subBone._rootSkeleton = null;
                    delete this._rootSkeleton._subBonesMap[subBone.getName()];
                    this._rootSkeleton._subBonesDirty = true;
                    this._rootSkeleton._subBonesOrderDirty = true;
                }
            }else{
                this._rootSkeleton._subBonesDirty = true;
                this._rootSkeleton._subBonesOrderDirty = true;
            }
            cc.js.array.remove(this._childBones, bone);
        },

        _setRootSkeleton: function(rootSkeleton){
            this._rootSkeleton = rootSkeleton;
            var subBones = this.getAllSubBones();
            for (var i = 0; i < subBones.length; i++) {
                this._addToBoneList(subBones[i]);
            }
        },

        _addToBoneList: function (bone) {
            if(this._childBones.indexOf(bone) === -1)
                this._childBones.push(bone);
            if (this._rootSkeleton != null) {
                var skeletonNode = bone;
                if (!(skeletonNode instanceof SkinNode) && !bone._rootSkeleton) {// not nest skeleton
                    var subBones = bone.getAllSubBones();
                    subBones.push(bone);
                    for (var subBone, i = 0; i < subBones.length; i++) {
                        subBone = subBones[i];
                        subBone._setRootSkeleton(this._rootSkeleton);
                        var bonename = subBone.getName();
                        if (!this._rootSkeleton._subBonesMap[bonename]){
                            this._rootSkeleton._subBonesMap[subBone.getName()] = subBone;
                            this._rootSkeleton._subBonesDirty = true;
                            this. _rootSkeleton._subBonesOrderDirty = true;
                        }else{
                            cc.log("already has a bone named %s in skeleton %s", bonename, this._rootSkeleton.getName());
                            this._rootSkeleton._subBonesDirty = true;
                            this. _rootSkeleton._subBonesOrderDirty = true;
                        }
                    }
                }
            }
        },

        _visitSkins: function(){
            var cmd = this._renderCmd;
            // quick return if not visible
            if (!this._visible)
                return;

            var parentCmd = cmd.getParentRenderCmd();
            if (parentCmd)
                cmd._curLevel = parentCmd._curLevel + 1;

            //visit for canvas
            var i, children = this._boneSkins, child;
            //var i, children = this._children, child;
            cmd._syncStatus(parentCmd);
            var len = children.length;
            if (len > 0) {
                this.sortAllChildren();
                // draw children zOrder < 0
                for (i = 0; i < len; i++) {
                    child = children[i];
                    if (child._localZOrder < 0)
                        child._renderCmd.visit(cmd);
                    else
                        break;
                }
                for (; i < len; i++)
                    children[i]._renderCmd.visit(cmd);
            }
            cmd._dirtyFlag = 0;
        },

        _addToSkinList: function (skin) {
            this._boneSkins.push(skin);
            if (skin.getBlendFunc){
                var blendFunc = skin.getBlendFunc();
                if(this._blendFunc.src !== blendFunc.src && this._blendFunc.dst !== blendFunc.dst)
                    skin.setBlendFunc(this._blendFunc);
            }
        },

        _removeFromSkinList: function (skin) {
            cc.js.array.remove(this._boneSkins, skin);
        },

        sortAllChildren: function () {
            this._sortArray(this._childBones);
            this._sortArray(this._boneSkins);
            Node.prototype.sortAllChildren.call(this);
        },

        _sortArray: function (array) {
            if (!array)
                return;
            var len = array.length, i, j, tmp;
            for (i = 1; i < len; i++) {
                tmp = array[i];
                j = i - 1;
                while (j >= 0) {
                    if (tmp._localZOrder < array[j]._localZOrder) {
                        array[j + 1] = array[j];
                    } else if (tmp._localZOrder === array[j]._localZOrder && tmp.arrivalOrder < array[j].arrivalOrder) {
                        array[j + 1] = array[j];
                    } else {
                        break;
                    }
                    j--;
                }
                array[j + 1] = tmp;
            }
        },

        _updateVertices: function () {
            var squareVertices = this._squareVertices,
                  anchorPointInPoints = this._renderCmd._anchorPointInPoints;
            if (this._rackLength != squareVertices[2].x - anchorPointInPoints.x ||
                squareVertices[3].y != this._rackWidth / 2  - anchorPointInPoints.y) {

                squareVertices[1].x = squareVertices[1].y = squareVertices[3].y = 0;
                squareVertices[0].x = squareVertices[2].x = this._rackLength * .1;
                squareVertices[2].y = this._rackWidth * .5;
                squareVertices[0].y = -squareVertices[2].y;
                squareVertices[3].x = this._rackLength;

                for(var i=0; i<squareVertices.length; i++){
                    squareVertices[i].x += anchorPointInPoints.x;
                    squareVertices[i].y += anchorPointInPoints.y;
                }

                this._renderCmd.updateDebugPoint(squareVertices);
            }
        },

        _createRenderCmd: function () {
            if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
                return new BoneNodeCanvasCmd(this);
            else
                return new BoneNodeWebGLCmd(this);
        }
    });

    BoneNode.create = function (length, color) {
        // null
        // length
        // length, color
        return new ccui.BoneNode(length, color);
    };

    var BoneNodeCanvasCmd = (function () {

        var BoneNodeCanvasCmd = function (node) {
            Node.CanvasRenderCmd.call(this, node);
            this._debug = false;
            this._color = cc.Color.WHITE;
            this._drawNode = new cc.DrawNode();
        };

        var proto = BoneNodeCanvasCmd.prototype = Object.create(Node.CanvasRenderCmd.prototype);
        proto.constructor = BoneNodeCanvasCmd;

        proto.visit = function (parentCmd) {
            var node = this._node;
            node._visit && node._visit(parentCmd);
        };
        proto.updateDebugPoint = function (points) {
            this._drawNode.clear();
            this._drawNode.drawPoly(points, this._color, 0, this._color);
        };

        proto.transform = function (parentCmd, recursive) {
            var rootSkeleton = this._node._rootSkeleton;
            Node.CanvasRenderCmd.prototype.transform.call(this, parentCmd, recursive);
            if (rootSkeleton && rootSkeleton._renderCmd._debug) {
                this._drawNode._renderCmd.transform(this);
            }
        };

        return BoneNodeCanvasCmd;

    })();

    var BoneNodeWebGLCmd = (function () {

        var BoneNodeWebGLCmd = function (node) {
            Node.WebGLRenderCmd.call(this, node);
            this._debug = false;
            this._color = cc.Color.WHITE;
            this._drawNode = new cc.DrawNode();
        };

        var proto = BoneNodeWebGLCmd.prototype = Object.create(Node.WebGLRenderCmd.prototype);
        proto.constructor = BoneNodeWebGLCmd;

        proto.visit = function (parentCmd) {
            var node = this._node;
            node._visit && node._visit(parentCmd);
        };
        proto.updateDebugPoint = function (points) {
            this._drawNode.clear();
            this._drawNode.drawPoly(points, this._color, 0, this._color);
        };

        proto.transform = function (parentCmd, recursive) {
            var rootSkeleton = this._node._rootSkeleton;
            Node.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
            if (rootSkeleton && rootSkeleton._renderCmd._debug) {
                this._drawNode._renderCmd.transform(this);
            }
        };

        return BoneNodeWebGLCmd;

    })();

    return BoneNode;

})();
