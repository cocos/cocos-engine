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

var EventTarget = require('../../core/event/event-target');
//attibute conversion
var AttributeTable = {
    POSITION:       {semantic: cc3d.SEMANTIC_POSITION,type: cc3d.ELEMENTTYPE_FLOAT32, components:3, normalized: false},
    NORMAL:         {semantic: cc3d.SEMANTIC_NORMAL,type: cc3d.ELEMENTTYPE_FLOAT32, components:3, normalized: true},
    COLOR:          {semantic: cc3d.SEMANTIC_COLOR,type: cc3d.ELEMENTTYPE_FLOAT32, components:4, normalized: false},
    TANGENT:        {semantic: cc3d.SEMANTIC_TANGENT,type: cc3d.ELEMENTTYPE_FLOAT32, components:3, normalized: false},
    BINORMAL:       {semantic: cc3d.SEMANTIC_ATTR0,type: cc3d.ELEMENTTYPE_FLOAT32, components:3, normalized: false},
    BLENDINDEX:     {semantic: cc3d.SEMANTIC_BLENDINDICES,type: cc3d.ELEMENTTYPE_FLOAT32, components:4, normalized: false},
    BLENDWEIGHT:    {semantic: cc3d.SEMANTIC_BLENDWEIGHT,type: cc3d.ELEMENTTYPE_FLOAT32, components:4, normalized: false},
    TEXCOORD0:      {semantic: cc3d.SEMANTIC_TEXCOORD0,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
    TEXCOORD1:      {semantic: cc3d.SEMANTIC_TEXCOORD1,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
    TEXCOORD2:      {semantic: cc3d.SEMANTIC_TEXCOORD2,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
    TEXCOORD3:      {semantic: cc3d.SEMANTIC_TEXCOORD3,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
    TEXCOORD4:      {semantic: cc3d.SEMANTIC_TEXCOORD4,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
    TEXCOORD5:      {semantic: cc3d.SEMANTIC_TEXCOORD5,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
    TEXCOORD6:      {semantic: cc3d.SEMANTIC_TEXCOORD6,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
    TEXCOORD7:      {semantic: cc3d.SEMANTIC_TEXCOORD7,type: cc3d.ELEMENTTYPE_FLOAT32, components:2, normalized: false},
};

var Skeleton = function() {
    this.topLevelNodes = [];
    this.nodeMap = {};
};

Skeleton.prototype = {
    clone: function() {
        var skeleton = new Skeleton();
        for(var index = 0; index < this.topLevelNodes.length; ++index) {
            skeleton.topLevelNodes.push(skeleton._cloneFrom(this.topLevelNodes[index]));
        }
        return skeleton;
    },
    _cloneFrom: function(node) {
        if(!node) return null;
        var cloned = node.clone();
        this.nodeMap[cloned.getName()] = cloned;
        //clone children tree
        var children = node.getChildren();
        for(var index = 0; index < children.length; ++index) {
            var child = this._cloneFrom(children[index]);
            cloned.addChild(child);
        }
        return cloned;
    }
};

var Mesh = cc.Class(/** @lends cc.Mesh# */{
    name: 'cc.Mesh',
    extends: require('../../core/assets/CCAsset'),
    mixins: [EventTarget],
    ctor: function() {
        this._jasons = null;
        this._loaded = false;
        //cc3d meshes
        this._meshes = {};
        this._skeleton = new Skeleton();
        this._meshRefs = [];
    },
    _serialize: CC_EDITOR && function (exporting) {
        return {
            name: this._name,
            content: this._jasons
        };
    },
    _deserialize: function (data, handle) {
        this._name = data.name;
        this._jasons = data.content;
        this._parseJasonMesh(data.content.meshes);
        this._parseJasonNodes(data.content.nodes);
        this.emit('load');
        this._loaded = true;
    },
    _parseJasonMesh: function(jasonMesh) {
        if(cc._renderContext) {
            for(var i = 0; i < jasonMesh.length; ++i) {
                //a jason mesh will be represented by a mesh group
                var jasonMesh = jasonMesh[i];
                //create shared vertexBuffer, use vertices and attributes
                var vertDesc = [];
                for(var semanticIndex = 0; semanticIndex<jasonMesh.attributes.length; ++semanticIndex) {
                    vertDesc.push(AttributeTable[jasonMesh.attributes[semanticIndex]]);
                }
                var vertexFormat = new cc3d.VertexFormat(cc._renderContext,vertDesc);
                var verts = new Float32Array(jasonMesh.vertices.length);
                verts.set(jasonMesh.vertices,0);
                //(graphicsDevice, format, numVertices, usage, initialData)
                var vertexBuffer = new cc3d.VertexBuffer(cc._renderContext, vertexFormat,
                    verts.length/vertexFormat.size * 4);
                vertexBuffer.setData(verts);

                //init mesh parts
                for(var subMeshIndex = 0; subMeshIndex < jasonMesh.parts.length; ++subMeshIndex) {
                    var mesh = new cc3d.Mesh();
                    mesh.vertexBuffer = vertexBuffer;
                    var indexArray = new Uint16Array(jasonMesh.parts[subMeshIndex].indices);
                    var indexBuffer = new cc3d.IndexBuffer(cc._renderContext, cc3d.INDEXFORMAT_UINT16,jasonMesh.parts[subMeshIndex].indices.length);
                    indexBuffer.storage = indexArray;
                    indexBuffer.unlock();
                    mesh.indexBuffer = [indexBuffer];
                    mesh.primitive = [ {
                        type: cc3d.PRIMITIVE_TRIANGLES,
                        indexed: true,
                        base: 0,
                        count: indexBuffer.getNumIndices(),
                    }];
                    this._meshes[jasonMesh.parts[subMeshIndex].id] = mesh;
                }

            }
        }
    },
    _parseJasonNodes: function(jasonNodes) {
        for(var index = 0 ; index < jasonNodes.length; ++index) {
            var result = this._parseNodeTree(jasonNodes[index]);
            this._skeleton.topLevelNodes.push(result.nodeTree);
            result.nodeTree.syncHierarchy();
            this._meshRefs = this._meshRefs.concat(result.meshRefs);
        }
    },
    _parseNodeTree: function(jason) {
        var nodeTree = new cc.Node3D();
        var nodeMeshRefs = [];
        nodeTree.setName(jason.id);
        if(this._skeleton.nodeMap[jason.id]) {
            cc.error("duplicated id"  + jason.id+ "for nodes in meshes");
        } else {
            this._skeleton.nodeMap[jason.id] = nodeTree;
        }
        //todo review TRS parsing
        if(jason.scale) {
            nodeTree.setLocalScale(jason.scale[0],jason.scale[1],jason.scale[2]);
        }

        if(jason.translation) {
            nodeTree.setLocalPosition(jason.translation[0],jason.translation[1],jason.translation[2]);
        }

        if(jason.rotation) {
            nodeTree.setLocalRotation(jason.rotation[0],jason.rotation[1],jason.rotation[2],jason.rotation[3]);
        }

        //todo parse parts
        if(jason.parts) {
            for(var index = 0; index < jason.parts.length; ++index) {
                var boneNames = [];
                var boneBindingMatrices = [];
                var bones = jason.parts[index].bones;
                if(bones && bones.length > 0) {
                    var t = new cc.Vec3(), r = new cc.Quat(), s = new cc.Vec3();
                    for(var boneIndex = 0; boneIndex < bones.length; ++boneIndex) {
                        var bone = bones[boneIndex];
                        boneNames.push(bone.node);
                        t.set(bone.translation[0],bone.translation[1],bone.translation[2]);
                        r.set(bone.rotation[0],bone.rotation[1],bone.rotation[2],bone.rotation[3]);
                        s.set(bone.scale[0],bone.scale[1],bone.scale[2]);
                        boneBindingMatrices.push(new cc.Mat4().setTRS(t,r,s).invert());
                    }
                } else {
                    boneNames = undefined;
                    boneBindingMatrices = undefined;
                }

                nodeMeshRefs.push({
                    meshID: jason.parts[index].meshpartid,
                    skinRoot: jason.id,
                    bones: boneNames,
                    ibp: boneBindingMatrices,
                });
            }
        }
        if(jason.children) {
            for(var index = 0 ; index < jason.children.length; ++index) {
                var result = this._parseNodeTree(jason.children[index]);
                nodeTree.addChild(result.nodeTree);
                for(var index2 = 0 ; index2 < result.meshRefs.length; ++index2) {
                    nodeMeshRefs.push(result.meshRefs[index2]);
                }
            }
        }
        return {
            nodeTree:nodeTree,
            meshRefs: nodeMeshRefs,
        }
    },
});

cc.Mesh = module.exports = Mesh;
