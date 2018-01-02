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
        this._comp = comp;
        let armature = dragonBones.BaseFactory.prototype.buildArmature.call(this, armatureName, dragonBonesName);
        this._dragoneBones.clock.add(armature);
        this._comp = null;
        return armature;
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

        let display = new dragonBones.CCArmatureDisplay();
        display.component = this._comp;

        // fixed dragonbones sort issue
        // armature._sortSlots = this._sortSlots;

        armature.init(dataPackage.armature,
            display, display, this._dragoneBones
        );

        return armature;
    },

    _buildSlot (dataPackage, slotData, displays) {
        let slot = BaseObject.borrowObject(dragonBones.CCSlot);
        let displayList = [];

        slot.name = slotData.name;

        slot.init(
            slotData, displays,
            // rawDisplay, mesh Display
            slot, slot
        );

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
