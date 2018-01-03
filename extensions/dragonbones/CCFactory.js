/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

let BaseObject = dragonBones.BaseObject;

dragonBones.CCFactory = cc.Class({
    name: 'dragonBones.CCFactory',
    extends: dragonBones.BaseFactory,

    ctor () {
        this.__instanceId = cc.ClassManager.getNewInstanceId();
        this._dragoneBones = new dragonBones.DragonBones();

        if (!CC_EDITOR) {
            cc.director._scheduler.scheduleUpdate(this, cc.Scheduler.PRIORITY_SYSTEM, false);
        }
    },

    update (dt) {
        this._dragoneBones.advanceTime(dt);
    },

    buildArmatureDisplay (armatureName, dragonBonesName, comp) {
        this._display = comp;
        let armature = this.buildArmature(armatureName, dragonBonesName, comp);
        this._display = null;
        return armature;
    },

    createArmatureNode (comp, armatureName, node) {
        node = node || new cc.Node();
        let display = node.getComponent(dragonBones.ArmatureDisplay);
        if (!display) {
            display = node.addComponent(dragonBones.ArmatureDisplay);
        }

        node.name = display.armatureName = armatureName;
        display._N$dragonAsset = comp.dragonAsset;
        display._N$dragonAtlasAsset = comp.dragonAtlasAsset;
        display._init();

        return display;
    },

    _buildChildArmature (dataPackage, slot, displayData) {
        let temp = this._display;
        
        let node = new cc.Node();
        let display = this.createArmatureNode(temp, displayData.path);

        this._display = temp;
        return display._armature;
    },
    

    _buildTextureAtlasData (textureAtlasData, textureAtlas) {
        if (textureAtlasData) {
            textureAtlasData.renderTexture = textureAtlas;
        }
        else {
            textureAtlasData = BaseObject.borrowObject(dragonBones.CCTextureAtlasData);
        }
        return textureAtlasData;
    },

    _sortSlots () {
        let slots = this._slots;
        let sortedSlots = [];
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            let zOrder = slot._zOrder;
            let inserted = false;
            for (let j = sortedSlots.length - 1; j >= 0; j--) {
                if (zOrder >= sortedSlots[j]._zOrder) {
                    sortedSlots.splice(j+1, 0, slot);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                sortedSlots.splice(0, 0, slot);
            }
        }
        this._slots = sortedSlots;
    },

    _buildArmature (dataPackage) {
        let armature = BaseObject.borrowObject(dragonBones.Armature);

        armature._skinData = dataPackage.skin;
        armature._animation = BaseObject.borrowObject(dragonBones.Animation);
        armature._animation._armature = armature;

        armature.animation.animations = dataPackage.armature.animations;

        // fixed dragonbones sort issue
        // armature._sortSlots = this._sortSlots;

        armature.init(dataPackage.armature,
            this._display, this._display, this._dragoneBones
        );

        this._dragoneBones.clock.add(armature);
        
        return armature;
    },

    _buildSlot (dataPackage, slotData, displays) {
        let slot = BaseObject.borrowObject(dragonBones.CCSlot);
        let displayList = [];

        slot.name = slotData.name;

        // let display = new cc.Node();
        // display.name = slot.name;

        let display = slot;
        slot.init(slotData, displays, display, display);

        return slot;
    }
});

dragonBones.CCFactory._factory = null;
dragonBones.CCFactory.getFactory = function() {
    if (!dragonBones.CCFactory._factory) {
        dragonBones.CCFactory._factory = new dragonBones.CCFactory();
    }
    return dragonBones.CCFactory._factory;
};
