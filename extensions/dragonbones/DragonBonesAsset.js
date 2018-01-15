/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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

/**
 * @module dragonBones
 */

/**
 * !#en The skeleton data of dragonBones.
 * !#zh dragonBones 的 骨骼数据。
 * @class DragonBonesAsset
 * @extends Asset
 */
var DragonBonesAsset = cc.Class({
    name: 'dragonBones.DragonBonesAsset',
    extends: cc.Asset,

    ctor () {
        this.reset();
    },

    properties: {
        _dragonBonesJson : '',

        /**
         * !#en See http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html
         * !#zh 可查看 DragonBones 官方文档 http://developer.egret.com/cn/github/egret-docs/DB/dbLibs/dataFormat/index.html
         * @property {string} dragonBonesJson
         */
        dragonBonesJson : {
            get: function () {
                return this._dragonBonesJson;
            },
            set: function (value) {
                this._dragonBonesJson = value;
                this.reset();
            }
        }
    },

    statics: {
        preventDeferredLoadDependents: true
    },

    createNode: CC_EDITOR &&  function (callback) {
        var node = new cc.Node(this.name);
        var armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
        armatureDisplay.dragonAsset = this;

        return callback(null, node);
    },

    reset () {
        this._dragonBonesData = null;
        if (CC_EDITOR) {
            this._armaturesEnum = null;
        }
    },

    init: function (factory) {
        if (CC_EDITOR) {
            factory = factory || new dragonBones.CCFactory();
        }
        if (this._dragonBonesData) {
            let sameNamedDragonBonesData = factory.getDragonBonesData(this._dragonBonesData.name);
            if (sameNamedDragonBonesData) {
                // already added asset, see #2002
                for (let i = 0; i < this._dragonBonesData.armatureNames.length; i++) {
                    let armatureName = this._dragonBonesData.armatureNames[i];
                    if (!sameNamedDragonBonesData.armatures[armatureName]) {
                        // merge with new armature
                        sameNamedDragonBonesData.addArmature(this._dragonBonesData.armatures[armatureName]);
                    }
                }
                this._dragonBonesData = sameNamedDragonBonesData;
            }
            else {
                factory.addDragonBonesData(this._dragonBonesData);
            }
        }
        else {
            if (CC_JSB) {
                // The 'factory' create a new one every time in JSB, they can't use getDragonBonesData
                // to get cached data, and don't need to merge armatures.
                this._dragonBonesData = factory.parseDragonBonesData(this._dragonBonesJson);
            }
            else {
                let jsonObj = JSON.parse(this._dragonBonesJson);
                let sameNamedDragonBonesData = factory.getDragonBonesData(jsonObj.name);
                if (sameNamedDragonBonesData) {
                    // already added asset, see #2002
                    let dragonBonesData;
                    for (let i = 0; i < jsonObj.armature.length; i++) {
                        let armatureName = jsonObj.armature[i].name;
                        if (!sameNamedDragonBonesData.armatures[armatureName]) {
                            // add new armature
                            if (!dragonBonesData) {
                                dragonBonesData = factory._dataParser.parseDragonBonesData(jsonObj);
                            }
                            sameNamedDragonBonesData.addArmature(dragonBonesData.armatures[armatureName]);
                        }
                    }
                    this._dragonBonesData = sameNamedDragonBonesData;
                }
                else {
                    this._dragonBonesData = factory.parseDragonBonesData(jsonObj);
                }
            }
        }
    },

    // EDITOR

    getArmatureEnum: CC_EDITOR && function () {
        if (this._armaturesEnum) {
            return this._armaturesEnum;
        }
        this.init();
        if (this._dragonBonesData) {
            var armatureNames = this._dragonBonesData.armatureNames;
            var enumDef = {};
            for (var i = 0; i < armatureNames.length; i++) {
                var name = armatureNames[i];
                enumDef[name] = i;
            }
            return this._armaturesEnum = cc.Enum(enumDef);
        }
        return null;
    },

    getAnimsEnum: CC_EDITOR && function (armatureName) {
        this.init();
        if (this._dragonBonesData) {
            var armature = this._dragonBonesData.getArmature(armatureName);
            if (!armature) {
                return null;
            }

            var enumDef = { '<None>': 0 };
            var anims = armature.animations;
            var i = 0;
            for (var animName in anims) {
                if (anims.hasOwnProperty(animName)) {
                    enumDef[animName] = i + 1;
                    i++;
                }
            }
            return cc.Enum(enumDef);
        }
        return null;
    },

    destroy () {
        var useGlobalFactory = !CC_JSB;
        if (useGlobalFactory && this._dragonBonesData) {
            var factory = dragonBones.CCFactory.getFactory();
            factory.removeDragonBonesData(this._dragonBonesData.name, true);
        }
        this._super();
    },
});

dragonBones.DragonBonesAsset = module.exports = DragonBonesAsset;
