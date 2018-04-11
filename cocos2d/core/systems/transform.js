/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

const renderEngine = require('../renderer/render-engine');
const math = renderEngine.math;

let transformSys = {
    _dirtyNodes: [],
    _updatedNodes: [],

    _calculWorldMatrix (node) {
        // Avoid as much function call as possible
        if (node._localMatDirty) {
            node._updateLocalMatrix();
        }
        
        // Assume parent world matrix is correct
        if (node._parent) {
            let parentMat = node._parent._worldMatrix;
            math.mat4.mul(node._worldMatrix, parentMat, node._matrix);
        }
        else {
            math.mat4.copy(node._worldMatrix, node._matrix);
        }
        node._worldMatDirty = false;
        node._worldMatUpdated = true;
        // For resetting _worldMatUpdated flag in afterDraw
        this._updatedNodes.push(node);

        let children = node._children;
        for (let i = 0, len = children.length; i < len; ++i) {
            let child = children[i];
            this._calculWorldMatrix(child);
        }
    },

    _updateWorldMatrix (node) {
        let changedRoot = null;
        while (node) {
            if (node._localMatDirty || node._worldMatDirty) {
                changedRoot = node;
            }
            node = node._parent;
        }
        if (changedRoot) {
            this._calculWorldMatrix(changedRoot);
        }
    },

    setNodeDirty (node) {
        if (!node._localMatDirty) {
            node._localMatDirty = true;
            if (!this._dirtyNodes[node._level]) {
                this._dirtyNodes[node._level] = [];
            }
            this._dirtyNodes[node._level].push(node);
        }
    },

    setWorldDirty (node) {
        if (!node._worldMatDirty) {
            node._worldMatDirty = true;
            if (!this._dirtyNodes[node._level]) {
                this._dirtyNodes[node._level] = [];
            }
            this._dirtyNodes[node._level].push(node);
        }
    },

    _updateLevel (nodes) {
        let node;
        for (let i = 0, n = nodes.length; i < n; i++) {
            node = nodes[i];
            if (node._localMatDirty || node._worldMatDirty) {
                this._calculWorldMatrix(node);
            }
        }
        nodes.length = 0;
    },

    update () {
        let levels = this._dirtyNodes;
        for (let i = 0, l = levels.length; i < l; i++) {
            this._updateLevel(levels[i]);
        }
    },

    afterDraw () {
        for (let i = 0, l = this._updatedNodes.length; i < l; i++) {
            this._updatedNodes[i]._worldMatUpdated = false;
        }
        this._updatedNodes.length = 0;
    }
};

module.exports = transformSys;