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

    buildArmature (armatureName, dragonBonesName, comp) {
        this._comp = comp;
        let armature = dragonBones.BaseFactory.prototype.buildArmature.call(this, armatureName, dragonBonesName);
        let armatureDisplay = armature ? armature._display : null;
        if (armatureDisplay) {
            armatureDisplay.advanceTimeBySelf(true);
        }
        this._comp = null;
        return armature;
    },

    _generateTextureAtlasData (textureAtlasData, texture) {
        if (! textureAtlasData) {
            textureAtlasData = BaseObject.borrowObject(dragonBones.CCTextureAtlasData);
        }

        textureAtlasData.texture = texture;
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

    _generateArmature (dataPackage) {
        let armature = BaseObject.borrowObject(dragonBones.Armature);

        armature._armatureData = dataPackage.armature;
        armature._skinData = dataPackage.skin;
        armature._animation = BaseObject.borrowObject(dragonBones.Animation);
        armature._animation._armature = armature;

        armature.animation.animations = dataPackage.armature.animations;

        armature._display = new dragonBones.CCArmatureDisplay();
        armature._display.component = this._comp;
        armature._display._armature = armature;

        // fixed dragonbones sort issue
        armature._sortSlots = this._sortSlots;

        return armature;
    },

    _generateSlot (dataPackage, slotDisplayDataSet) {
        let slot = BaseObject.borrowObject(dragonBones.CCSlot);
        let slotData = slotDisplayDataSet.slot;
        let displayList = [];

        slot.name = slotData.name;
        slot._meshDisplay = slot._rawDisplay = slot;

        for (let i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
            let displayData = slotDisplayDataSet.displays[i];
            switch (displayData.type) {
                case dragonBones.DisplayType.Image:
                case dragonBones.DisplayType.Mesh:
                    if (!displayData.texture) {
                        displayData.texture = this._getTextureData(dataPackage.dataName, displayData.name);
                    }

                    displayList.push(slot);
                    break;

                case dragonBones.DisplayType.Armature:
                    let childArmature = dragonBones.BaseFactory.prototype.buildArmature.call(this, displayData.name, dataPackage.dataName);
                    if (childArmature) {
                        if (!slot.inheritAnimation) {
                            let actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
                            if (actions.length > 0) {
                                for (let j = 0, n = actions.length; j < n; ++j) {
                                    childArmature._bufferAction(actions[j]);
                                }
                            } else {
                                childArmature.animation.play();
                            }
                        }

                        displayData.armature = childArmature.armatureData; //
                    }

                    displayList.push(childArmature);
                    break;

                default:
                    displayList.push(null);
                    break;
            }
        }

        slot._setDisplayList(displayList);

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
