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
        this._bindposes = [];
        this._jointPaths = [];
    },

    properties: {
        _model: cc.Model,
        _jointIndices: [],

        jointPaths: {
            get () {
                return this._jointPaths;
            }
        },
        bindposes: {
            get () {
                return this._bindposes;
            }
        }
    },

    onLoad () {
        let nodes = this._model.nodes;
        let jointIndices = this._jointIndices;
        let jointPaths = this._jointPaths;
        let bindposes = this._bindposes;
        for (let i = 0; i < jointIndices.length; i++) {
            let node = nodes[jointIndices[i]];
            jointPaths[i] = node.path;
            bindposes[i] = node.bindpose;
        }
    }
});

cc.Skeleton = module.exports = Skeleton;