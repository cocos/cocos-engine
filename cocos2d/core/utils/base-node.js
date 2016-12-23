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

var SgHelper = require('./scene-graph-helper');
var Destroying = require('../platform/CCObject').Flags.Destroying;
var Misc = require('./misc');
var IdGenerater = require('../platform/id-generater');

var POSITION_CHANGED = 'position-changed';
var SIZE_CHANGED = 'size-changed';
var ANCHOR_CHANGED = 'anchor-changed';
var CHILD_ADDED = 'child-added';
var CHILD_REMOVED = 'child-removed';
var CHILD_REORDER = 'child-reorder';

var ERR_INVALID_NUMBER = CC_EDITOR && 'The %s is invalid';

var idGenerater = new IdGenerater('Node');

/**
 * A base node for CCNode and CCEScene, it will:
 * - provide the same api with origin cocos2d rendering node (SGNode)
 * - maintains properties of the internal SGNode
 * - retain and release the SGNode
 * - serialize datas for SGNode (but SGNode itself will not being serialized)
 * - notifications if some properties changed
 * - define some interfaces shares between CCNode and CCEScene
 *
 *
 * @class _BaseNode
 * @extends Object
 * @private
 */
var BaseNode = cc.Class(/** @lends cc.Node# */{
    name: 'cc._BaseNode',
    extends: cc.Object,
    mixins: [cc.EventTarget],

    properties: {

        // SERIALIZABLE

        _opacity: 255,
        _color: cc.Color.WHITE,
        _cascadeOpacityEnabled: true,
        _parent: null,
        _anchorPoint: cc.p(0.5, 0.5),
        _contentSize: cc.size(0, 0),
        _children: [],
        _rotationX: 0,
        _rotationY: 0.0,
        _scaleX: 1.0,
        _scaleY: 1.0,
        _position: cc.p(0, 0),
        _skewX: 0,
        _skewY: 0,
        _localZOrder: 0,
        _globalZOrder: 0,
        _tag: cc.macro.NODE_TAG_INVALID,
        _opacityModifyRGB: false,

        // API

        /**
         * !#en Name of node.
         * !#zh 该节点名称。
         * @property name
         * @type {String}
         * @example
         * node.name = "New Node";
         * cc.log("Node Name: " + node.name);
         */
        name: {
            get: function () {
                return this._name;
            },
            set: function (value) {
                if (CC_DEV && value.indexOf('/') !== -1) {
                    cc.errorID(1632);
                    return;
                }
                this._name = value;
            },
        },

        /**
         * !#en The parent of the node.
         * !#zh 该节点的父节点。
         * @property parent
         * @type {Node}
         * @default null
         * @example
         * node.parent = newNode;
         */

        _id: {
            default: '',
            editorOnly: true
        },

        /**
         * !#en The uuid for editor, will be stripped before building project.
         * !#zh 用于编辑器使用的 uuid，在构建项目之前将会被剔除。
         * @property uuid
         * @type {String}
         * @readOnly
         * @example
         * cc.log("Node Uuid: " + node.uuid);
         */
        uuid: {
            get: function () {
                var id = this._id;
                if ( !id ) {
                    id = this._id = CC_EDITOR ? Editor.Utils.UuidUtils.uuid() : idGenerater.getNewId();
                }
                return id;
            }
        },

        /**
         * !#en All children nodes.
         * !#zh 节点的所有子节点。
         * @property children
         * @type {Node[]}
         * @readOnly
         * @example
         * var children = node.children;
         * for (var i = 0; i < children.length; ++i) {
         *     cc.log("Node: " + children[i]);
         * }
         */
        children: {
            get: function () {
                return this._children;
            }
        },

        /**
         * !#en All children nodes.
         * !#zh 节点的子节点数量。
         * @property childrenCount
         * @type {Number}
         * @readOnly
         * @example
         * var count = node.childrenCount;
         * cc.log("Node Children Count: " + count);
         */
        childrenCount: {
            get: function () {
                return this._children.length;
            }
        },

        /**
         * !#en Tag of node.
         * !#zh 节点标签。
         * @property tag
         * @type {Number}
         * @example
         * node.tag = 1001;
         */

    },

    ctor: function () {

        /**
         * Current scene graph node for this node.
         *
         * @property _sgNode
         * @type {_ccsg.Node}
         * @private
         */
        var sgNode = this._sgNode = new _ccsg.Node();
        if (CC_JSB) {
            sgNode.retain();
            sgNode._entity = this;
            sgNode.onEnter = function () {
                _ccsg.Node.prototype.onEnter.call(this);
                if (this._entity && !this._entity._active) {
                    cc.director.getActionManager().pauseTarget(this);
                    cc.eventManager.pauseTarget(this);
                }
            };
        }
        if (!cc.game._isCloning) {
            sgNode.cascadeOpacity = true;
        }

        /**
         * Current active size provider for this node.
         * Size provider can equals to this._sgNode.
         *
         * @property _sizeProvider
         * @type {_ccsg.Node}
         * @private
         */
        this._sizeProvider = null;

        this.__ignoreAnchor = false;
        this._reorderChildDirty = false;

        // Support for ActionManager and EventManager
        this.__instanceId = this._id || cc.ClassManager.getNewInstanceId();

        /**
         * Register all related EventTargets,
         * all event callbacks will be removed in _onPreDestroy
         * @property __eventTargets
         * @type {EventTarget[]}
         * @private
         */
        this.__eventTargets = [];
    },

    getTag: function () {
        return this._tag;
    },

    setTag: function (value) {
        this._tag = value;
        this._sgNode.tag = value;
    },

    getParent: function() {
        return this._parent;
    },

    setParent: function (value) {
        if (this._parent === value) {
            return;
        }
        if (CC_EDITOR && !cc.engine.isPlaying) {
            if (_Scene.DetectConflict.beforeAddChild(this)) {
                return;
            }
        }
        var sgNode = this._sgNode;
        if (sgNode.parent) {
            sgNode.parent.removeChild(sgNode, false);
        }
        //
        var oldParent = this._parent;
        this._parent = value || null;
        if (value) {
            var parent = value._sgNode;
            parent.addChild(sgNode);
            value._delaySort();
            if (!CC_JSB) {
                cc.eventManager._setDirtyForNode(this);
            }
            value._children.push(this);
            value.emit(CHILD_ADDED, this);
        }
        if (oldParent) {
            if (!(oldParent._objFlags & Destroying)) {
                var removeAt = oldParent._children.indexOf(this);
                if (CC_DEV && removeAt < 0) {
                    return cc.errorID(1633);
                }
                oldParent._children.splice(removeAt, 1);
                oldParent.emit(CHILD_REMOVED, this);
                this._onHierarchyChanged(oldParent);
            }
        }
        else if (value) {
            this._onHierarchyChanged(null);
        }
    },

    _onPreDestroy: function () {
        cc.eventManager.removeListeners(this);
        if (CC_JSB) {
            this._sgNode.release();
            this._sgNode._entity = null;
            this._sgNode = null;
        }
        for (var i = 0, len = this.__eventTargets.length; i < len; ++i) {
            var target = this.__eventTargets[i];
            target && target.targetOff(this);
        }
    },

    // ABSTRACT INTERFACES

    // called when the node's parent changed
    _onHierarchyChanged: null,

    /*
     * Initializes the instance of cc.Node
     * @method init
     * @returns {Boolean} Whether the initialization was successful.
     * @deprecated, no need anymore
     */
    init: function () {
        return true;
    },

    /**
     * !#en
     * Properties configuration function </br>
     * All properties in attrs will be set to the node, </br>
     * when the setter of the node is available, </br>
     * the property will be set via setter function.</br>
     * !#zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
     * @method attr
     * @param {Object} attrs - Properties to be set to node
     * @example
     * var attrs = { key: 0, num: 100 };
     * node.attr(attrs);
     */
    attr: function (attrs) {
        for (var key in attrs) {
            this[key] = attrs[key];
        }
    },

    /**
     * !#en
     * Returns a copy the untransformed size of the node. <br/>
     * The contentSize remains the same no matter the node is scaled or rotated.<br/>
     * All nodes has a size. Layer and Scene has the same size of the screen by default. <br/>
     * !#zh 获取节点自身大小，不受该节点是否被缩放或者旋转的影响。
     * @method getContentSize
     * @param {Boolean} [ignoreSizeProvider=false] - true if you need to get the original size of the node
     * @return {Size} The untransformed size of the node.
     * @example
     * cc.log("Content Size: " + node.getContentSize());
     */
    getContentSize: function (ignoreSizeProvider) {
        if (this._sizeProvider && !ignoreSizeProvider) {
            var size = this._sizeProvider.getContentSize();
            this._contentSize = size;
            return size;
        }
        else {
            return cc.size(this._contentSize);
        }
    },

    /**
     * !#en
     * Sets the untransformed size of the node.<br/>
     * The contentSize remains the same no matter the node is scaled or rotated.<br/>
     * All nodes has a size. Layer and Scene has the same size of the screen.
     * !#zh 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
     * @method setContentSize
     * @param {Size|Number} size - The untransformed size of the node or The untransformed size's width of the node.
     * @param {Number} [height] - The untransformed size's height of the node.
     * @example
     * node.setContentSize(cc.size(100, 100));
     * node.setContentSize(100, 100);
     */
    setContentSize: function (size, height) {
        var locContentSize = this._contentSize;
        var clone;
        if (height === undefined) {
            if ((size.width === locContentSize.width) && (size.height === locContentSize.height))
                return;
            if (CC_EDITOR) {
                clone = cc.size(locContentSize);
            }
            locContentSize.width = size.width;
            locContentSize.height = size.height;
        } else {
            if ((size === locContentSize.width) && (height === locContentSize.height))
                return;
            if (CC_EDITOR) {
                clone = cc.size(locContentSize);
            }
            locContentSize.width = size;
            locContentSize.height = height;
        }
        if (this._sizeProvider) {
            this._sizeProvider.setContentSize(locContentSize);
        }
        if (CC_EDITOR) {
            this.emit(SIZE_CHANGED, clone);
        }
        else {
            this.emit(SIZE_CHANGED);
        }
    },


    /**
     * !#en Stops all running actions and schedulers.
     * !#zh 停止所有正在播放的动作和计时器。
     * @method cleanup
     * @example
     * node.cleanup();
     */
    cleanup: function () {
        // actions
        cc.director.getActionManager().removeAllActionsFromTarget(this);
        // event
        cc.eventManager.removeListeners(this);

        // children
        var i, len = this._children.length, node;
        for (i = 0; i < len; ++i) {
            node = this._children[i];
            if (node)
                node.cleanup();
        }
    },

    // composition: GET

    /**
     * !#en Returns a child from the container given its tag.
     * !#zh 通过标签获取节点的子节点。
     * @method getChildByTag
     * @param {Number} aTag - An identifier to find the child node.
     * @return {Node} a CCNode object whose tag equals to the input parameter
     * @example
     * var child = node.getChildByTag(1001);
     */
    getChildByTag: function (aTag) {
        var children = this._children;
        if (children !== null) {
            for (var i = 0; i < children.length; i++) {
                var node = children[i];
                if (node && node.tag === aTag)
                    return node;
            }
        }
        return null;
    },

    /**
     * !#en Returns a child from the container given its uuid.
     * !#zh 通过 uuid 获取节点的子节点。
     * @method getChildByUuid
     * @param {String} uuid - The uuid to find the child node.
     * @return {Node} a Node whose uuid equals to the input parameter
     * @example
     * var child = node.getChildByUuid(uuid);
     */
    getChildByUuid: function(uuid){
        if(!uuid){
            cc.log("Invalid uuid");
            return null;
        }

        var locChildren = this._children;
        for(var i = 0, len = locChildren.length; i < len; i++){
            if(locChildren[i]._id === uuid)
                return locChildren[i];
        }
        return null;
    },

    /**
     * !#en Returns a child from the container given its name.
     * !#zh 通过名称获取节点的子节点。
     * @method getChildByName
     * @param {String} name - A name to find the child node.
     * @return {Node} a CCNode object whose name equals to the input parameter
     * @example
     * var child = node.getChildByName("Test Node");
     */
    getChildByName: function(name){
        if(!name){
            cc.log("Invalid name");
            return null;
        }

        var locChildren = this._children;
        for(var i = 0, len = locChildren.length; i < len; i++){
           if(locChildren[i]._name === name)
            return locChildren[i];
        }
        return null;
    },

    // composition: ADD

    /**
     * !#en
     * "add" logic MUST only be in this method <br/>
     * !#zh
     * 添加子节点，并且可以修改该节点的 局部 Z 顺序和标签。
     * @method addChild
     * @param {Node} child - A child node
     * @param {Number} [localZOrder] - Z order for drawing priority. Please refer to setZOrder(int)
     * @param {Number|String} [tag] - An integer or a name to identify the node easily. Please refer to setTag(int) and setName(string)
     * @example
     * node.addChild(newNode, 1, 1001);
     */
    addChild: function (child, localZOrder, tag) {
        localZOrder = localZOrder === undefined ? child._localZOrder : localZOrder;
        var name, setTag = false;
        if(typeof tag === 'undefined'){
            tag = undefined;
            name = child._name;
        } else if(cc.js.isString(tag)){
            name = tag;
            tag = undefined;
        } else if(cc.js.isNumber(tag)){
            setTag = true;
            name = "";
        }

        if (CC_DEV && !(child instanceof cc.Node)) {
            return cc.errorID(1634, cc.js.getClassName(child));
        }
        cc.assertID(child, 1606);
        cc.assertID(child._parent === null, 1605);

        // invokes the parent setter
        child.parent = this;

        child.zIndex = localZOrder;
        if (setTag)
            child.setTag(tag);
        else
            child.setName(name);
    },

    // composition: REMOVE

    /**
     * !#en
     * Remove itself from its parent node. If cleanup is true, then also remove all actions and callbacks. <br/>
     * If the cleanup parameter is not passed, it will force a cleanup. <br/>
     * If the node orphan, then nothing happens.
     * !#zh
     * 从父节点中删除一个节点。cleanup 参数为 true，那么在这个节点上所有的动作和回调都会被删除，反之则不会。<br/>
     * 如果不传入 cleanup 参数，默认是 true 的。<br/>
     * 如果这个节点是一个孤节点，那么什么都不会发生。
     * @method removeFromParent
     * @param {Boolean} [cleanup=true] - true if all actions and callbacks on this node should be removed, false otherwise.
     * @see cc.Node#removeFromParentAndCleanup
     * @example
     * node.removeFromParent();
     * node.removeFromParent(false);
     */
    removeFromParent: function (cleanup) {
        if (this._parent) {
            if (cleanup === undefined)
                cleanup = true;
            this._parent.removeChild(this, cleanup);
        }
    },

    /**
     * !#en
     * Removes a child from the container. It will also cleanup all running actions depending on the cleanup parameter. </p>
     * If the cleanup parameter is not passed, it will force a cleanup. <br/>
     * "remove" logic MUST only be on this method  <br/>
     * If a class wants to extend the 'removeChild' behavior it only needs <br/>
     * to override this method.
     * !#zh
     * 移除节点中指定的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
     * 如果 cleanup 参数不传入，默认为 true 表示清理。<br/>
     * @method removeChild
     * @param {Node} child - The child node which will be removed.
     * @param {Boolean} [cleanup=true] - true if all running actions and callbacks on the child node will be cleanup, false otherwise.
     * @example
     * node.removeChild(newNode);
     * node.removeChild(newNode, false);
     */
    removeChild: function (child, cleanup) {
        if (this._children.indexOf(child) > -1) {
            // If you don't do cleanup, the child's actions will not get removed and the
            if (cleanup || cleanup === undefined) {
                child.cleanup();
            }
            // invoke the parent setter
            child.parent = null;
        }
    },

    /**
     * !#en
     * Removes a child from the container by tag value. It will also cleanup all running actions depending on the cleanup parameter.
     * If the cleanup parameter is not passed, it will force a cleanup. <br/>
     * !#zh
     * 通过标签移除节点中指定的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
     * 如果 cleanup 参数不传入，默认为 true 表示清理。
     * @method removeChildByTag
     * @param {Number} tag - An integer number that identifies a child node
     * @param {Boolean} [cleanup=true] - true if all running actions and callbacks on the child node will be cleanup, false otherwise.
     * @see cc.Node#removeChildByTag
     * @example
     * node.removeChildByTag(1001);
     * node.removeChildByTag(1001, false);
     */
    removeChildByTag: function (tag, cleanup) {
        if (tag === cc.macro.NODE_TAG_INVALID)
            cc.logID(1609);

        var child = this.getChildByTag(tag);
        if (!child)
            cc.logID(1610, tag);
        else
            this.removeChild(child, cleanup);
    },

    /**
     * !#en
     * Removes all children from the container and do a cleanup all running actions depending on the cleanup parameter. <br/>
     * If the cleanup parameter is not passed, it will force a cleanup.
     * !#zh
     * 移除节点所有的子节点，是否需要清理所有正在运行的行为取决于 cleanup 参数。<br/>
     * 如果 cleanup 参数不传入，默认为 true 表示清理。
     * @method removeAllChildren
     * @param {Boolean} [cleanup=true] - true if all running actions on all children nodes should be cleanup, false otherwise.
     * @example
     * node.removeAllChildren();
     * node.removeAllChildren(false);
     */
    removeAllChildren: function (cleanup) {
        // not using detachChild improves speed here
        var children = this._children;
        if (cleanup === undefined)
            cleanup = true;
        for (var i = children.length - 1; i >= 0; i--) {
            var node = children[i];
            if (node) {
                //if (this._running) {
                //    node.onExitTransitionDidStart();
                //    node.onExit();
                //}

                // If you don't do cleanup, the node's actions will not get removed and the
                if (cleanup)
                    node.cleanup();

                node.parent = null;
            }
        }
        this._children.length = 0;
    },

    setNodeDirty: function(){
        this._sgNode.setNodeDirty();
    },

    /**
     * !#en
     * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
     * The matrix is in Pixels. The returned transform is readonly and cannot be changed.
     * !#zh
     * 返回将父节点的坐标系转换成节点（局部）的空间坐标系的矩阵。<br/>
     * 该矩阵以像素为单位。返回的矩阵是只读的，不能更改。
     * @method getParentToNodeTransform
     * @return {AffineTransform}
     * @example
     * var affineTransform = node.getParentToNodeTransform();
     */
    getParentToNodeTransform: function () {
        return this._sgNode.getParentToNodeTransform();
    },

    _isSgTransformArToMe: function (myContentSize) {
        var renderSize = this._sgNode.getContentSize();
        if (renderSize.width === 0 && renderSize.height === 0 &&
            (myContentSize.width !== 0 || myContentSize.height !== 0)) {
            // anchor point ignored
            return true;
        }
        if (this._sgNode.isIgnoreAnchorPointForPosition()) {
            // sg transform become anchor relative...
            return true;
        }
        return false;
    },

    /**
     * !#en Returns the world affine transform matrix. The matrix is in Pixels.
     * !#zh 返回节点到世界坐标系的仿射变换矩阵。矩阵单位是像素。
     * @method getNodeToWorldTransform
     * @return {AffineTransform}
     * @example
     * var affineTransform = node.getNodeToWorldTransform();
     */
    getNodeToWorldTransform: function () {
        var contentSize = this.getContentSize();

        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            // ensure transform computed
            cc.director._visitScene();
        }
        var mat = this._sgNode.getNodeToWorldTransform();

        if (this._isSgTransformArToMe(contentSize)) {
            // _sgNode.getNodeToWorldTransform is not anchor relative (AR), in this case,
            // we should translate to bottem left to consistent with it
            // see https://github.com/cocos-creator/engine/pull/391
            var tx = - this._anchorPoint.x * contentSize.width;
            var ty = - this._anchorPoint.y * contentSize.height;
            var offset = cc.affineTransformMake(1, 0, 0, 1, tx, ty);
            mat = cc.affineTransformConcatIn(offset, mat);
        }
        return mat;
    },


    /**
     * !#en
     * Returns the world affine transform matrix. The matrix is in Pixels.<br/>
     * This method is AR (Anchor Relative).
     * !#zh
     * 返回节点到世界坐标仿射变换矩阵。矩阵单位是像素。<br/>
     * 该方法基于节点坐标。
     * @method getNodeToWorldTransformAR
     * @return {AffineTransform}
     * @example
     * var mat = node.getNodeToWorldTransformAR();
     */
    getNodeToWorldTransformAR: function () {
        var contentSize = this.getContentSize();

        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            // ensure transform computed
            cc.director._visitScene();
        }
        var mat = this._sgNode.getNodeToWorldTransform();

        if ( !this._isSgTransformArToMe(contentSize) ) {
            // see getNodeToWorldTransform
            var tx = this._anchorPoint.x * contentSize.width;
            var ty = this._anchorPoint.y * contentSize.height;
            var offset = cc.affineTransformMake(1, 0, 0, 1, tx, ty);
            mat = cc.affineTransformConcatIn(offset, mat);
        }
        return mat;
    },
    /**
     * !#en Returns the inverse world affine transform matrix. The matrix is in Pixels.
     * !#en 返回世界坐标系到节点坐标系的逆矩阵。
     * @method getWorldToNodeTransform
     * @return {AffineTransform}
     * @example
     * var affineTransform = node.getWorldToNodeTransform();
     */
    getWorldToNodeTransform: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            // ensure transform computed
            cc.director._visitScene();
        }
        return this._sgNode.getWorldToNodeTransform();
    },

    /**
     * !#en Converts a Point to node (local) space coordinates. The result is in Vec2.
     * !#zh 将一个点转换到节点 (局部) 坐标系。结果以 Vec2 为单位。
     * @method convertToNodeSpace
     * @param {Vec2} worldPoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToNodeSpace(cc.v2(100, 100));
     */
    convertToNodeSpace: function (worldPoint) {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            // ensure transform computed
            cc.director._visitScene();
        }
        var nodePositionIgnoreAnchorPoint = this._sgNode.convertToNodeSpace(worldPoint);
        return cc.pAdd(nodePositionIgnoreAnchorPoint, cc.p(this._anchorPoint.x * this._contentSize.width, this._anchorPoint.y * this._contentSize.height));
    },

    /**
     * !#en Converts a Point to world space coordinates. The result is in Points.
     * !#zh 将一个点转换到世界空间坐标系。结果以 Vec2 为单位。
     * @method convertToWorldSpace
     * @param {Vec2} nodePoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToWorldSpace(cc.v2(100, 100));
     */
    convertToWorldSpace: function (nodePoint) {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            // ensure transform computed
            cc.director._visitScene();
        }
        var x = nodePoint.x - this._anchorPoint.x * this._contentSize.width;
        var y = nodePoint.y - this._anchorPoint.y * this._contentSize.height;
        return cc.v2(this._sgNode.convertToWorldSpace(cc.v2(x, y)));
    },

    /**
     * !#en
     * Converts a Point to node (local) space coordinates. The result is in Points.<br/>
     * treating the returned/received node point as anchor relative.
     * !#zh
     * 将一个点转换到节点 (局部) 空间坐标系。结果以 Vec2 为单位。<br/>
     * 返回值将基于节点坐标。
     * @method convertToNodeSpaceAR
     * @param {Vec2} worldPoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToNodeSpaceAR(cc.v2(100, 100));
     */
    convertToNodeSpaceAR: function (worldPoint) {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            // ensure transform computed
            cc.director._visitScene();
        }
        if (this._sgNode.isIgnoreAnchorPointForPosition()) {
            // see https://github.com/cocos-creator/engine/pull/391
            return cc.v2(this._sgNode.convertToNodeSpace(worldPoint));
        }
        else {
            return this._sgNode.convertToNodeSpaceAR(worldPoint);
        }
    },

    /**
     * !#en
     * Converts a local Point to world space coordinates.The result is in Points.<br/>
     * treating the returned/received node point as anchor relative.
     * !#zh
     * 将一个点转换到世界空间坐标系。结果以 Vec2 为单位。<br/>
     * 返回值将基于世界坐标。
     * @method convertToWorldSpaceAR
     * @param {Vec2} nodePoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToWorldSpaceAR(cc.v2(100, 100));
     */
    convertToWorldSpaceAR: function (nodePoint) {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            // ensure transform computed
            cc.director._visitScene();
        }
        if (this._sgNode.isIgnoreAnchorPointForPosition()) {
            // see https://github.com/cocos-creator/engine/pull/391
            return cc.v2(this._sgNode.convertToWorldSpace(nodePoint));
        }
        else {
            return cc.v2(this._sgNode.convertToWorldSpaceAR(nodePoint));
        }
    },

    /**
     * !#en convenience methods which take a cc.Touch instead of cc.Vec2.
     * !#zh 将触摸点转换成本地坐标系中位置。
     * @method convertTouchToNodeSpace
     * @param {Touch} touch - The touch object
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertTouchToNodeSpace(touch);
     */
    convertTouchToNodeSpace: function (touch) {
        return this.convertToNodeSpace(touch.getLocation());
    },

    /**
     * !#en converts a cc.Touch (world coordinates) into a local coordinate. This method is AR (Anchor Relative).
     * !#zh 转换一个 cc.Touch（世界坐标）到一个局部坐标，该方法基于节点坐标。
     * @method convertTouchToNodeSpaceAR
     * @param {Touch} touch - The touch object
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertTouchToNodeSpaceAR(touch);
     */
    convertTouchToNodeSpaceAR: function (touch) {
        return this.convertToNodeSpaceAR(touch.getLocation());
    },

    /**
     * !#en
     * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
     * The matrix is in Pixels.
     * !#zh 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。这个矩阵以像素为单位。
     * @method getNodeToParentTransform
     * @return {AffineTransform} The affine transform object
     * @example
     * var affineTransform = node.getNodeToParentTransform();
     */
    getNodeToParentTransform: function () {
        var contentSize = this.getContentSize();
        var mat = this._sgNode.getNodeToParentTransform();
        if (this._isSgTransformArToMe(contentSize)) {
            // see getNodeToWorldTransform
            var tx = - this._anchorPoint.x * contentSize.width;
            var ty = - this._anchorPoint.y * contentSize.height;
            var offset = cc.affineTransformMake(1, 0, 0, 1, tx, ty);
            mat = cc.affineTransformConcatIn(offset, mat);
        }
        return mat;
    },


    // HIERARCHY METHODS

    /**
     * !#en Get the sibling index.
     * !#zh 获取同级索引。
     * @method getSiblingIndex
     * @return {number}
     * @example
     * var index = node.getSiblingIndex();
     */
    getSiblingIndex: function () {
        if (this._parent) {
            return this._parent._children.indexOf(this);
        }
        else {
            return 0;
        }
    },

    /**
     * !#en Set the sibling index of this node.
     * !#zh 设置节点同级索引。
     * @method setSiblingIndex
     * @param {Number} index
     * @example
     * node.setSiblingIndex(1);
     */
    setSiblingIndex: function (index) {
        if (!this._parent) {
            return;
        }
        var array = this._parent._children;
        index = index !== -1 ? index : array.length - 1;
        var oldIndex = array.indexOf(this);
        if (index !== oldIndex) {
            array.splice(oldIndex, 1);
            if (index < array.length) {
                array.splice(index, 0, this);
            }
            else {
                array.push(this);
            }

            // update rendering scene graph, sort them by arrivalOrder
            var parent = this._parent;
            var siblings = parent._children;

            var i = 0, len = siblings.length, sibling;
            if (CC_JSB) {
                if (cc.runtime) {
                    for (; i < len; i++) {
                        sibling = siblings[i]._sgNode;
                        // Reset zorder to update their arrival order
                        var zOrder = sibling.getLocalZOrder();
                        sibling.setLocalZOrder(zOrder + 1);
                        sibling.setLocalZOrder(zOrder);
                    }
                }
                else {
                    parent._sgNode.removeChild(this._sgNode, false);
                    if (index + 1 < array.length) {
                        var nextSibling = array[index + 1];
                        parent._sgNode.insertChildBefore(this._sgNode, nextSibling._sgNode);
                    }
                    else {
                        parent._sgNode.addChild(this._sgNode);
                    }
                }
            }
            else {
                for (; i < len; i++) {
                    sibling = siblings[i]._sgNode;
                    sibling._arrivalOrder = i;
                    cc.eventManager._setDirtyForNode(sibling);
                }
                cc.renderer.childrenOrderDirty = true;
                parent._sgNode._reorderChildDirty = true;
                parent._delaySort();
            }
        }
    },

    /**
     * !#en Is this node a child of the given node?
     * !#zh 是否是指定节点的子节点？
     * @method isChildOf
     * @param {Node} parent
     * @return {Boolean} - Returns true if this node is a child, deep child or identical to the given node.
     * @example
     * node.isChildOf(newNode);
     */
    isChildOf: function (parent) {
        var child = this;
        do {
            if (child === parent) {
                return true;
            }
            child = child._parent;
        }
        while (child);
        return false;
    },

    /**
     * !#en Sorts the children array depends on children's zIndex and arrivalOrder,
     * normally you won't need to invoke this function.
     * !#zh 根据子节点的 zIndex 和 arrivalOrder 进行排序，正常情况下开发者不需要手动调用这个函数。
     *
     * @method sortAllChildren
     */
    sortAllChildren: function () {
        if (this._reorderChildDirty) {
            this._reorderChildDirty = false;
            var _children = this._children;
            if (_children.length > 1) {
                // insertion sort
                var len = _children.length, i, j, child;
                for (i = 1; i < len; i++){
                    child = _children[i];
                    j = i - 1;

                    //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller
                    while(j >= 0){
                        if (child._localZOrder < _children[j]._localZOrder) {
                            _children[j+1] = _children[j];
                        } else if (child._localZOrder === _children[j]._localZOrder &&
                                   child._sgNode._arrivalOrder < _children[j]._sgNode._arrivalOrder) {
                            _children[j+1] = _children[j];
                        } else {
                            break;
                        }
                        j--;
                    }
                    _children[j+1] = child;
                }
                this.emit(CHILD_REORDER);
            }
            cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this, this.__eventTargets);
        }
    },

    _delaySort: function () {
        if (!this._reorderChildDirty) {
            this._reorderChildDirty = true;
            cc.director.__fastOn(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this, this.__eventTargets);
        }
    },

    _updateDummySgNode: function () {
        var self = this;
        var sgNode = self._sgNode;

        sgNode.setPosition(self._position);
        sgNode.setRotationX(self._rotationX);
        sgNode.setRotationY(self._rotationY);
        sgNode.setScale(self._scaleX, self._scaleY);
        sgNode.setSkewX(self._skewX);
        sgNode.setSkewY(self._skewY);
        sgNode.setIgnoreAnchorPointForPosition(self.__ignoreAnchor);

        var arrivalOrder = sgNode._arrivalOrder;
        sgNode.setLocalZOrder(self._localZOrder);
        sgNode._arrivalOrder = arrivalOrder;     // revert arrivalOrder changed in setLocalZOrder

        sgNode.setGlobalZOrder(self._globalZOrder);

        if (CC_JSB) {
            // fix tintTo and tintBy action for jsb displays err for fireball/issues/4137
            sgNode.setColor(this._color);
        }
        sgNode.setOpacity(self._opacity);
        sgNode.setOpacityModifyRGB(self._opacityModifyRGB);
        sgNode.setCascadeOpacityEnabled(self._cascadeOpacityEnabled);
        sgNode.setTag(self._tag);
    },

    _updateSgNode: function () {
        this._updateDummySgNode();
        var sgNode = this._sgNode;
        sgNode.setAnchorPoint(this._anchorPoint);
        sgNode.setVisible(this._active);
        sgNode.setColor(this._color);

        // update ActionManager and EventManager because sgNode maybe changed
        if (this._activeInHierarchy) {
            cc.director.getActionManager().resumeTarget(this);
            cc.eventManager.resumeTarget(this);
        }
        else {
            cc.director.getActionManager().pauseTarget(this);
            cc.eventManager.pauseTarget(this);
        }
    },

    onRestore: CC_EDITOR && function () {
        this._updateDummySgNode();

        var sizeProvider = this._sizeProvider;
        if (sizeProvider) {
            sizeProvider.setContentSize(this._contentSize);
            if (sizeProvider instanceof _ccsg.Node) {
                sizeProvider.setAnchorPoint(this._anchorPoint);
                sizeProvider.setColor(this._color);
                if (sizeProvider !== this._sgNode) {
                    sizeProvider.ignoreAnchor = this.__ignoreAnchor;
                    sizeProvider.setOpacityModifyRGB(this._opacityModifyRGB);
                    if ( !this._cascadeOpacityEnabled ) {
                        sizeProvider.setOpacity(this._opacity);
                    }
                }
            }
        }

        var sgParent = this._parent && this._parent._sgNode;
        if (this._sgNode._parent !== sgParent) {
            if (this._sgNode._parent) {
                this._sgNode.removeFromParent();
            }
            if (sgParent) {
                sgParent.addChild(this._sgNode);
            }
        }

        // check activity state
        var shouldActiveInHierarchy = (this._parent && this._parent._activeInHierarchy && this._active);
        if (shouldActiveInHierarchy !== this._activeInHierarchy) {
            this._onActivatedInHierarchy(shouldActiveInHierarchy);
            this.emit('active-in-hierarchy-changed', this);
        }

        if (this._activeInHierarchy) {
            cc.director.getActionManager().resumeTarget(this);
            cc.eventManager.resumeTarget(this);
        }
        else {
            cc.director.getActionManager().pauseTarget(this);
            cc.eventManager.pauseTarget(this);
        }
    },

    _removeSgNode: SgHelper.removeSgNode,
});


// Define public getter and setter methods to ensure api compatibility.

var SameNameGetSets = ['name', 'children', 'childrenCount', 'parent',
                       /*'shaderProgram',*/ 'tag'];
var DiffNameGetSets = {
    //// privates
    //width: ['_getWidth', '_setWidth'],
    //height: ['_getHeight', '_setHeight'],
    //anchorX: ['_getAnchorX', '_setAnchorX'],
    //anchorY: ['_getAnchorY', '_setAnchorY'],
};
Misc.propertyDefine(BaseNode, SameNameGetSets, DiffNameGetSets);

cc._BaseNode = module.exports = BaseNode;
