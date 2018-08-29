/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

const Model = require('./CCModel');

 /**
 * @module cc
 */
/**
 * !#en Mesh Asset.
 * !#zh 网格资源。
 * @class Mesh
 * @extends Asset
 */
var Mesh = cc.Class({
    name: 'cc.Mesh',
    extends: cc.Asset,

    properties: {
        _modelSetter: {
            set: function (model) {
                this.initWithModel(model);
            }
        },

        /**
         * !#en Get ir set the sub meshes.
         * !#zh 设置或者获取子网格。
         * @property {[renderEngine.InputAssembler]} subMeshes
         */
        subMeshes: {
            get () {
                return this._subMeshes;
            },
            set (v) {
                this._subMeshes = v;
            }
        },

        model: {
            get () {
                return this._model;
            },

            type: Model
        }
    },

    ctor () {
        this._modelUuid = '';
        this._meshID = -1;
        this._model = null;

        this._subMeshes = [];
    },

    initWithModel (model) {
        if (!model) return;
        this._model = model;
        this._model.initMesh(this);
    },

    _serialize: CC_EDITOR && function () {
        return {
            modelUuid: this._modelUuid,
            meshID: this._meshID,
        }
    },

    _deserialize (data, handle) {
        this._modelUuid = data.modelUuid;
        this._meshID = data.meshID;

        if (this._modelUuid) {
            handle.result.push(this, '_modelSetter', this._modelUuid);
        }
    }
});

cc.Mesh = module.exports = Mesh;
