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

let ModelMeshResource = cc.Class({
    name: 'ModelMeshResource',

    ctor () {
        this._subMeshes = [];
        this._ibs = [];
        this._vbs = [];
        this._inited = false;
        this._minPos = cc.v3();
        this._maxPos = cc.v3();
    },

    properties: {
        _meshID: -1,
        _model: {
            type: Model,
            default: null
        },

        meshID: {
            get () {
                return this._meshID;
            },
            set (val) {
                this._meshID = val;
            }
        },

        model: {
            get () {
                return this._model;
            },
            set (val) {
                this._model = val;
            }
        }
    },

    flush (mesh) {
        if (!this._inited) {
            this._inited = true;
            this.model.initMesh(this);
        }

        mesh._vbs = this._vbs;
        mesh._ibs = this._ibs;
        mesh._subMeshes = this._subMeshes;
        mesh._minPos = this._minPos;
        mesh._maxPos = this._maxPos;
    }
});

module.exports = ModelMeshResource;
