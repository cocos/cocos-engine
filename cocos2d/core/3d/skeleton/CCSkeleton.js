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


let Skeleton = cc.Class({
    name: 'cc.Skeleton',
    extends: cc.Asset,

    ctor () {
        this.loaded = false;
        this._bindposes = [];
        this._uniqueBindPoses = [];
        this._jointPaths = [];
    },

    properties: {
        _model: cc.Model,
        _jointIndices: [],
        _skinIndex: -1,

        jointPaths: {
            get () {
                return this._jointPaths;
            }
        },
        bindposes: {
            get () {
                return this._bindposes;
            }
        },
        uniqueBindPoses: {
            get () {
                return this._uniqueBindPoses;
            }
        },
        model: {
            get () {
                return this._model;
            }
        }
    },

    onLoad () {
        let nodes = this._model.nodes;
        let jointIndices = this._jointIndices;
        let jointPaths = this._jointPaths;
        let bindposes = this._bindposes;
        let uniqueBindPoses = this._uniqueBindPoses;
        for (let i = 0; i < jointIndices.length; i++) {
            let node = nodes[jointIndices[i]];
            jointPaths[i] = node.path;
            if (node.uniqueBindPose) {
                bindposes[i] = uniqueBindPoses[i] = node.uniqueBindPose;
            }
            else {
                bindposes[i] = node.bindpose[this._skinIndex];
            }
        }
        this.loaded = true;
        this.emit("load");
    }
});

cc.Skeleton = module.exports = Skeleton;