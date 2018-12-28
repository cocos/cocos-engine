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

const Animation = require('../components/CCAnimation');
const Model = require('./CCModel');
const SkeletonAnimationClip = require('./CCSkeletonAnimationClip');
const AnimationClip = require('../../animation/animation-clip');

/**
 * @module cc
 */
/**
 * !#en .
 * !#zh 。
 * @class SkeletonAnimation
 * @extends Animation
 */
let SkeletonAnimation = cc.Class({
    name: 'cc.SkeletonAnimation',
    extends: Animation,

    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/skeleton-animation.js',
        menu: 'i18n:MAIN_MENU.component.others/Skeleton Animation',
    },

    properties: {
        _model: Model,

        _defaultClip: {
            override: true,
            default: null,
            type: SkeletonAnimationClip,
        },

        _clips: {
            override: true,
            default: [],
            type: [SkeletonAnimationClip],
            visible: true,
        },

        defaultClip: {
            override: true,
            get () {
                return this._defaultClip;
            },
            set (v) {
                this._defaultClip = v;
            },
            type: SkeletonAnimationClip,
        },

        model: {
            get () {
                return this._model;
            },
            set (val) {
                this._model = val;
            },
            type: Model
        },
    },

    getAnimationState (name) {
        let state = this._super(name);
        let clip = state.clip;
        clip.init();
        return state;
    },

    searchClips: CC_EDITOR && function () {
        this._clips.length = 0;
        let self = this;
        Editor.assetdb.queryPathByUuid(this._model._uuid, function (err, modelPath) {
            if (err) return console.error(err);
            
            const Path = require('fire-path');
            let queryPath = Path.relative(Editor.remote.Project.path, modelPath);
            queryPath = Path.join(Path.dirname(queryPath), Path.basenameNoExt(queryPath));
            queryPath = `db://${queryPath}*/*.sac`;

            Editor.assetdb.queryAssets(queryPath, null, function (err, results) {
                if (results) {
                    for (let i = 0; i < results.length; i++) {
                        let clip = new SkeletonAnimationClip();
                        clip._uuid = results[i].uuid;
                        self._clips.push(clip);
                    }
                    self._defaultClip = self._clips[0];
                }
            });
        });
    }
});

cc.SkeletonAnimation = module.exports = SkeletonAnimation;
