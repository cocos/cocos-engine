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
 * !#en SkeletonAnimationClip Asset.
 * !#zh 骨骼动画剪辑。
 * @class SkeletonAnimationClip
 * @extends AnimationClip
 */
var SkeletonAnimationClip = cc.Class({
    name: 'cc.SkeletonAnimationClip',
    extends: cc.AnimationClip,

    properties: {
        _modelSetter: {
            set: function (model) {
                this._model = model;
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
        this._animationID = -1;
        this._model = null;
        this._inited = false;
    },

    init () {
        if (this._inited) return;
        this._inited = true;
        this._model.initAnimationClip(this);
    },

    _serialize: CC_EDITOR && function (exporting) {
        let modelUuid = this._modelUuid;
        if (exporting) {
            modelUuid = Editor.Utils.UuidUtils.compressUuid(modelUuid, true);
        }
        return {
            modelUuid: modelUuid,
            animationID: this._animationID,
            name: this._name,
        }
    },

    _deserialize (data, handle) {
        this._modelUuid = data.modelUuid;
        this._animationID = data.animationID;
        this._name = data.name;

        if (this._modelUuid) {
            handle.result.push(this, '_modelSetter', this._modelUuid);
        }
    }
});

cc.SkeletonAnimationClip = module.exports = SkeletonAnimationClip;
