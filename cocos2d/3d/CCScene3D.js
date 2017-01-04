/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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

var NIL = function () {
};

var Immediate = function (scene_) {
    var scene = scene_;
    var graphicDevice = cc._renderContext;
    var lineVertexFormat = null;
    var lineBatches = [];
    var quadMesh = null;
    var cubeLocalPos = null;
    var cubeWorldPos = null;

    var lineBatch = function () {
        // Sensible default value; buffers will be doubled and reallocated when it's not enough
        this.numLinesAllocated = 128;

        this.vb = null;
        this.vbRam = null;
        this.mesh = null;
        this.linesUsed = 0;
        this.material = null;
        this.meshInstance = null;
    };

    lineBatch.prototype = {
        init: function (device, linesToAdd) {
            // Allocate basic stuff once per batch
            if (!this.mesh) {
                this.mesh = new cc3d.Mesh();
                this.mesh.primitive[0].type = cc3d.PRIMITIVE_LINES;
                this.mesh.primitive[0].base = 0;
                this.mesh.primitive[0].indexed = false;

                this.material = new cc3d.BasicMaterial();
                this.material.vertexColors = true;
                this.material.blend = true;
                this.material.blendType = cc3d.BLEND_NORMAL;
                this.material.update();
            }

            // Increase buffer size, if it's not enough
            while ((this.linesUsed + linesToAdd) > this.numLinesAllocated) {
                this.vb = null;
                this.numLinesAllocated *= 2;
            }

            // (Re)allocate line buffer
            if (!this.vb) {
                this.vb = new cc3d.VertexBuffer(device, lineVertexFormat, this.numLinesAllocated * 2, cc3d.BUFFER_DYNAMIC);
                this.mesh.vertexBuffer = this.vb;
                this.vbRam = new DataView(this.vb.lock());

                if (!this.meshInstance) {
                    var node = {worldTransform: cc.Mat4.IDENTITY};
                    this.meshInstance = new cc3d.MeshInstance(node, this.mesh, this.material);
                }
            }
        },

        addLines: function (position, color) {
            // Append lines to buffer
            var multiColor = !!color.length;
            var offset = this.linesUsed * 2 * lineVertexFormat.size;
            var clr;
            for (var i = 0; i < position.length; i++) {
                this.vbRam.setFloat32(offset, position[i].x, true);
                offset += 4;
                this.vbRam.setFloat32(offset, position[i].y, true);
                offset += 4;
                this.vbRam.setFloat32(offset, position[i].z, true);
                offset += 4;
                clr = multiColor ? color[i] : color;
                this.vbRam.setUint8(offset, clr.r * 255);
                offset += 1;
                this.vbRam.setUint8(offset, clr.g * 255);
                offset += 1;
                this.vbRam.setUint8(offset, clr.b * 255);
                offset += 1;
                this.vbRam.setUint8(offset, clr.a * 255);
                offset += 1;
            }
            this.linesUsed += position.length / 2;
        },

        finalize: function (drawCalls) {
            // Update batch vertex buffer/issue drawcall if there are any lines
            if (this.linesUsed > 0) {
                this.vb.setData(this.vbRam.buffer);
                this.mesh.primitive[0].count = this.linesUsed * 2;
                drawCalls.push(this.meshInstance);
                this.linesUsed = 0;
            }
        }
    };

    this._addLines = function (batchId, position, color) {
        // Init global line drawing data once
        if (!lineVertexFormat) {
            lineVertexFormat = new cc3d.VertexFormat(graphicDevice, [
                {semantic: cc3d.SEMANTIC_POSITION, components: 3, type: cc3d.ELEMENTTYPE_FLOAT32},
                {semantic: cc3d.SEMANTIC_COLOR, components: 4, type: cc3d.ELEMENTTYPE_UINT8, normalize: true}
            ]);

            cc.director.on(cc.Director3D.EVENT_BEFORE_VISIT, this._preRenderImmediate, this);
        }
        if (!lineBatches[batchId]) {
            // Init used batch once
            lineBatches[batchId] = new lineBatch();
            lineBatches[batchId].init(graphicDevice, position.length / 2);
            if (batchId === cc3d.LINEBATCH_OVERLAY) {
                lineBatches[batchId].material.depthTest = false;
                lineBatches[batchId].meshInstance.layer = cc3d.LAYER_GIZMO;
            }
            else if (batchId === cc3d.LINEBATCH_GIZMO) {
                lineBatches[batchId].meshInstance.layer = cc3d.LAYER_GIZMO;
            }
        } else {
            // Possibly reallocate buffer if it's small
            lineBatches[batchId].init(graphicDevice, position.length / 2);
        }
        // Append
        lineBatches[batchId].addLines(position, color);
    }

    this.renderLine = function (start, end, color, arg3, arg4) {
        var endColor = color;
        var lineType = cc3d.LINEBATCH_WORLD;
        if (arg3) {
            if (typeof(arg3) === 'number') {
                lineType = arg3;
            } else {
                endColor = arg3;
                if (arg4) lineType = arg4;
            }
        }
        this._addLines(lineType, [start, end], [color, endColor]);
    }

    this.renderLines = function (position, color, lineType) {
        if (lineType === undefined) lineType = cc3d.LINEBATCH_WORLD;
        var multiColor = !!color.length;
        if (multiColor) {
            if (position.length !== color.length) {
                cc3d.log.error("renderLines: position/color arrays have different lengths");
                return;
            }
        }
        if (position.length % 2 !== 0) {
            cc3d.log.error("renderLines: array length is not divisible by 2");
            return;
        }
        this._addLines(lineType, position, color);
    }

    this.renderWireCube = function (matrix, color, lineType) {
        if (lineType === undefined) lineType = cc3d.LINEBATCH_WORLD;
        var i;
        // Init cube data once
        if (!cubeLocalPos) {
            var x = 0.5;
            cubeLocalPos = [new cc.Vec3(-x, -x, -x), new cc.Vec3(-x, x, -x), new cc.Vec3(x, x, -x), new cc.Vec3(x, -x, -x),
                new cc.Vec3(-x, -x, x), new cc.Vec3(-x, x, x), new cc.Vec3(x, x, x), new cc.Vec3(x, -x, x)];
            cubeWorldPos = [new cc.Vec3(), new cc.Vec3(), new cc.Vec3(), new cc.Vec3(),
                new cc.Vec3(), new cc.Vec3(), new cc.Vec3(), new cc.Vec3()];
        }
        // Transform and append lines
        for (i = 0; i < 8; i++) {
            matrix.transformPoint(cubeLocalPos[i], cubeWorldPos[i]);
        }
        this.renderLines([cubeWorldPos[0], cubeWorldPos[1],
            cubeWorldPos[1], cubeWorldPos[2],
            cubeWorldPos[2], cubeWorldPos[3],
            cubeWorldPos[3], cubeWorldPos[0],

            cubeWorldPos[4], cubeWorldPos[5],
            cubeWorldPos[5], cubeWorldPos[6],
            cubeWorldPos[6], cubeWorldPos[7],
            cubeWorldPos[7], cubeWorldPos[4],

            cubeWorldPos[0], cubeWorldPos[4],
            cubeWorldPos[1], cubeWorldPos[5],
            cubeWorldPos[2], cubeWorldPos[6],
            cubeWorldPos[3], cubeWorldPos[7]
        ], color, lineType);
    }

    this._preRenderImmediate = function () {
        for (var i = 0; i < 3; i++) {
            if (lineBatches[i]) {
                lineBatches[i].finalize(scene.immediateDrawCalls);
            }
        }
    }

    this.renderMeshInstance = function (meshInstance) {
        scene.immediateDrawCalls.push(meshInstance);
    }

    this.renderMesh = function (mesh, material, matrix) {
        var node = {worldTransform: matrix};
        var instance = new cc3d.MeshInstance(node, mesh, material);
        scene.immediateDrawCalls.push(instance);
    }

    this.renderQuad = function (matrix, material, layer) {
        // Init quad data once
        if (!quadMesh) {
            var format = new cc3d.VertexFormat(graphicDevice, [
                {semantic: cc3d.SEMANTIC_POSITION, components: 3, type: cc3d.ELEMENTTYPE_FLOAT32}
            ]);
            var quadVb = new cc3d.VertexBuffer(graphicDevice, format, 4);
            var iterator = new cc3d.VertexIterator(quadVb);
            iterator.element[cc3d.SEMANTIC_POSITION].set(-0.5, -0.5, 0);
            iterator.next();
            iterator.element[cc3d.SEMANTIC_POSITION].set(0.5, -0.5, 0);
            iterator.next();
            iterator.element[cc3d.SEMANTIC_POSITION].set(-0.5, 0.5, 0);
            iterator.next();
            iterator.element[cc3d.SEMANTIC_POSITION].set(0.5, 0.5, 0);
            iterator.end();
            quadMesh = new cc3d.Mesh();
            quadMesh.vertexBuffer = quadVb;
            quadMesh.primitive[0].type = cc3d.PRIMITIVE_TRISTRIP;
            quadMesh.primitive[0].base = 0;
            quadMesh.primitive[0].count = 4;
            quadMesh.primitive[0].indexed = false;
        }
        // Issue quad drawcall
        var node = {worldTransform: matrix};
        var quad = new cc3d.MeshInstance(node, quadMesh, material);
        if (layer) quad.layer = layer;
        scene.immediateDrawCalls.push(quad);
    }
};
/**
 * !#en
 * cc.Scene is a subclass of cc.Node that is used only as an abstract concept.<br/>
 * cc.Scene and cc.Node are almost identical with the difference that users can not modify cc.Scene manually.
 * !#zh
 * cc.Scene 是 cc.Node 的子类，仅作为一个抽象的概念。<br/>
 * cc.Scene 和 cc.Node 有点不同，用户不应直接修改 cc.Scene。
 * @class Scene
 * @extends _BaseNode
 */
cc.Scene = cc.Class({
    name: 'cc.Scene',
    extends: require('./CCBaseNode3D'),

    properties: {

        /**
         * !#en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
         * !#zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
         * @property {Boolean} autoReleaseAssets
         * @default false
         */
        autoReleaseAssets: undefined,

    },

    ctor: function () {
        this._sgScene = new cc3d.Scene();
        var sgNode = this._sgNode = new cc3d.GraphNode();
        //if (CC_JSB) {
        //    sgNode.retain();
        //}
        //sgNode.setAnchorPoint(0.0, 0.0);
        //this._anchorPoint.x = 0.0;
        //this._anchorPoint.y = 0.0;

        this._activeInHierarchy = false;
        this._inited = !cc.game._isCloning;

        // cache all depend assets for auto release
        this.dependAssets = null;
        this.immediateRenderer = new Immediate(this._sgScene);
    },

    //hack code for add camera for editor
    _addEditorCamera: function () {
        var node = new cc3d.GraphNode();
        var camera = new cc3d.Camera();
        camera._node = node;
        this._sgNode.addChild(node);
        this._sgScene.addCamera(camera);
        return camera;
    },

    destroy: function () {
        var children = this._children;
        var DontDestroy = cc.Object.Flags.DontDestroy;

        for (var i = 0, len = children.length; i < len; ++i) {
            var child = children[i];
            if (child.isValid) {
                if (!(child._objFlags & DontDestroy)) {
                    child.destroy();
                }
            }
        }

        this._super();
        this._activeInHierarchy = false;
    },

    _onHierarchyChanged: NIL,

    _load: function () {
        if (!this._inited) {
            this._onBatchCreated();
            this._inited = true;
        }
    },

    _activate: function (active) {
        active = (active !== false);
        var i, child, children = this._children, len = children.length;

        if (CC_EDITOR || CC_TEST) {
            // register all nodes to editor
            for (i = 0; i < len; ++i) {
                child = children[i];
                child._registerIfAttached(active);
            }
        }

        this._activeInHierarchy = active;

        // invoke onLoad and onEnable
        for (i = 0; i < len; ++i) {
            child = children[i];
            if (child._active) {
                child._onActivatedInHierarchy(active);
            }
        }
    }
});

module.exports = cc.Scene;
