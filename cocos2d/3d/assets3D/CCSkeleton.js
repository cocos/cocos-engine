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

var Skeleton = cc.Class(/** @lends cc.Skeleton# */{
    name: 'cc.Skeleton',
    extends: require('../../core/assets/CCAsset'),
    mixins: [EventTarget],
    ctor: function() {
        this._jasons = null;
        this._loaded = false;

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
        for(var index = 0 ; index < this._jasons.length; ++index) {
            var result = this._parseNodeTree(this._jasons[index]);
            this._root.addChild(result.nodeTree);
            this._meshRefs = this._meshRefs.concat(result.meshRefs);
        }
        this.emit('load');
        this._loaded = true;
    },

    _parseNodeTree: function(jason) {
        var nodeTree = new cc3d.GraphNode();
        var nodeSkinMesh = [];
        nodeTree.setName(jason.id);
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
            var skinMeshes = [];
            for(var index = 0; index < jason.parts.length; ++index) {
                var boneNames = [];
                var boneBindingMatrices = [];
                var bones = jason.parts[index].bones;
                var t = new cc.Vec3(), r = new cc.Quat(), s = new cc.Vec3();
                for(var boneIndex = 0; boneIndex < bones.length; ++boneIndex) {
                    var bone = bones[boneIndex];
                    boneNames.push(bone.node);
                    t.set(bone.translation[0],bone.translation[1],bone.translation[2]);
                    r.set(bone.rotation[0],bone.rotation[1],bone.rotation[2],bone.rotation[3]);
                    s.set(bone.scale[0],bone.scale[1],bone.scale[2]);
                    boneBindingMatrices.push(new cc.Mat4().setTRS(t,r,s))
                }
                skinMeshes.push({meshID: jason.parts[index].meshpartid, bones:boneNames, ibp: boneBindingMatrices});
            }
            nodeSkinMesh.push({
                node: nodeTree,
                skinMesh: skinMeshes
            });
        }
        if(jason.children) {
            for(var index = 0 ; index < jason.children.length; ++index) {
                var result = this._parseNodeTree(jason.children[index]);
                nodeTree.addChild(result.nodeTree);
                for(var skinMeshIndex = 0 ; skinMeshIndex < result.meshRefs.length; ++skinMeshIndex) {
                    nodeSkinMesh.push(result.meshRefs[skinMeshIndex]);
                }
            }
        }
        return {
            nodeTree:nodeTree,
            skinMeshes: nodeSkinMesh,
        }
    },
});

cc.Skeleton = module.exports = Skeleton;
