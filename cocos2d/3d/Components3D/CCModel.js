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

var Component = require('../../core/components/CCComponent');
var defaultMaterial = new cc3d.StandardMaterial();
defaultMaterial.diffuse = new cc3d.Color(1.0,1,1);
defaultMaterial.update();

var ModelType = cc.Enum({
    Asset: 0,
    Box: 1,
    Sphere: 2,
    Cylinder: 3
});

var Model = cc.Class({
    name: 'cc.Model',
    extends: Component,

    editor: CC_EDITOR && {
        executeInEditMode: true,
        menu: 'i18n:MAIN_MENU.component.renderers/Model',
    },

    properties: {

        _modelType: {
            default: ModelType.Box,
            type: ModelType
        },

        _material: {
            default: null,
            type: cc.Material
        },

        _mesh: {
            default: null,
            type: cc.Mesh
        },

        modelType: {
            get: function() {
                return this._modelType;
            },
            set: function(value) {
                this._modelType = value;
                this._defaultMesh = this._defaultMeshes[value];
                this._applyMeshMaterial();
            },
            type: ModelType
        },

        mesh: {
            get: function() {
                return this._mesh;
            },
            set: function(value) {
                this._mesh = value;
                this._applyMeshMaterial();
            },
            type: cc.Mesh
        },

        material: {
            get: function() {
                return this._material;
            },
            set: function(value) {
                this._material = value;
                this._applyMeshMaterial();
            },
            type: cc.Material
        },
    },

    ctor: function () {
        this.model = new cc3d.Model();
        this._boneHierarchy = null;
        this._skeleton = null;

        this._initDefaultMeshes();
        this._defaultMesh = this._defaultMeshes[ModelType.Box];
    },

    _initDefaultMeshes: function() {
        this._defaultMeshes = {};
        //init box mesh
        var mesh = this._defaultMeshes[ModelType.Box] = new cc.Mesh();
        mesh._loaded = true;
        mesh._meshes['box'] = cc3d.createBox(cc._renderContext);
        mesh._meshRefs.push({meshID:'box'});

        //sphere
        mesh = this._defaultMeshes[ModelType.Sphere] = new cc.Mesh();
        mesh._loaded = true;
        mesh._meshes['sphere'] = cc3d.createSphere(cc._renderContext);
        mesh._meshRefs.push({meshID:'sphere'});

        //sphere
        mesh = this._defaultMeshes[ModelType.Cylinder] = new cc.Mesh();
        mesh._loaded = true;
        mesh._meshes['cylinder'] = cc3d.createCylinder(cc._renderContext);
        mesh._meshRefs.push({meshID:'cylinder'});

        //cc3d meshes
        //this._skeleton = new Skeleton();
        //this._meshRefs = [];

    },

    start: function() {
    },

    _applyMeshMaterial: function() {
        var mtlResource = this._material;
        var meshResource = this._modelType === ModelType.Asset ? this._mesh : this._defaultMesh;
        var self = this;
        var unComplete = 2;
        function compose() {
            unComplete--;
            if(unComplete > 0) return;
            var scene = cc.director.getScene();
            var model = self.model;
            self.enabled && scene._sgScene.removeModel(model);
            model.meshInstances.length = 0;
            var material = mtlResource? mtlResource.getRenderedMtl() : defaultMaterial.clone();
            //remove old bones
            var skeleton = self._boneHierarchy;
            var toplevelNodes = skeleton && skeleton.topLevelNodes;
            if(toplevelNodes) {
                for(var nodeIndex = 0; nodeIndex < toplevelNodes.length; ++nodeIndex) {
                    model.graph && model.graph.removeChild(toplevelNodes[nodeIndex]);
                }
            }
            //add new bones
            skeleton = self._boneHierarchy = meshResource && meshResource._skeleton.clone();
            toplevelNodes = skeleton && skeleton.topLevelNodes;
            if(toplevelNodes) {
                for(var nodeIndex = 0; nodeIndex < toplevelNodes.length; ++nodeIndex) {
                    model.graph && model.graph.addChild(toplevelNodes[nodeIndex]);
                }
            }

            var nodes = skeleton && skeleton.nodeMap;
            var meshRefs = (meshResource && meshResource._meshRefs) || [];
            var meshes = (meshResource && meshResource._meshes) || {};
            var meshInstances = [];
            //do compose
            for(var index = 0; index < meshRefs.length; ++index) {

                var ref = meshRefs[index];
                var mesh = null;
                if(ref) {
                    mesh = meshes[ref.meshID];
                    if(ref.bones) {
                        mesh.skin = new cc3d.Skin(cc._renderContext, ref.ibp, ref.bones);
                    }

                }
                var meshInstance = new cc3d.MeshInstance(model.graph, mesh || self._defaultMesh[ModelType.Sphere], material);
                if(mesh && mesh.skin) {
                    var skinInstance = new cc3d.SkinInstance(mesh.skin,nodes[ref.skinRoot]);
                    var skinBones = [];
                    for (var j = 0; j < mesh.skin.boneNames.length; j++) {
                        var boneName = mesh.skin.boneNames[j];
                        var bone = nodes[boneName];
                        skinBones.push(bone);
                    }
                    skinInstance.bones = skinBones;
                    meshInstance.skinInstance = skinInstance;
                }
                meshInstances.push(meshInstance);

            }
            model.meshInstances = meshInstances;
            self.enabled && scene._sgScene.addModel(model);
            if(self._modelType === ModelType.Asset) {
                var skeleton = self._skeleton = new cc3d.Skeleton(self.node._sgNode);
                skeleton.setGraph(self.node._sgNode);
                var animation = self.node.getComponent('cc.Animation3D');
                animation && animation.onAnimationDirty();
            }
        }

        if(!mtlResource || mtlResource._loaded) {
            compose();
        } else {
            mtlResource.once('load', compose);
        }

        if(!meshResource || meshResource._loaded) {
            compose();
        } else {
            meshResource.once('load', compose);
        }
    },
    __preload: function() {
        var modelNode = this.node;
        var model = this.model;
        model.graph = modelNode._sgNode;
        model.getGraph().syncHierarchy();
        this._applyMeshMaterial();
    },
    onEnable: function() {
        var scene = cc.director.getScene();
        scene._sgScene.addModel(this.model);
    },
    onDisable: function() {
        var scene = cc.director.getScene();
        scene._sgScene.removeModel(this.model);
    },
    onDestroy: function() {

    },
    onFocusInEditor: function() {

    },
    onLostFocusInEditor: function() {

    },

});

cc.Model = module.exports = Model;
