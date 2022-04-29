/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
#ifndef DRAGONBONES_ARMATURE_DATA_H
#define DRAGONBONES_ARMATURE_DATA_H

#include "../core/BaseObject.h"
#include "../geom/Matrix.h"
#include "../geom/Transform.h"
#include "../geom/ColorTransform.h"
#include "../geom/Rectangle.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The armature data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 骨架数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class ArmatureData : public BaseObject
{
    BIND_CLASS_TYPE_B(ArmatureData);

public:
    /**
     * @private
     */
    ArmatureType type;
    /**
     * - The animation frame rate.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画帧率。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    unsigned frameRate;
    /**
     * @private
     */
    unsigned cacheFrameRate;
    /**
     * @private
     */
    float scale;
    /**
     * - The armature name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨架名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string name;
    /**
     * @private
     */
    Rectangle aabb;
    /**
     * - The names of all the animation data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 所有的动画数据名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::vector<std::string> animationNames;
    /**
     * @private
     */
    std::vector<BoneData*> sortedBones;
    /**
     * @private
     */
    std::vector<SlotData*> sortedSlots;
    /**
     * @private
     */
    std::vector<ActionData*> defaultActions;
    /**
     * @private
     */
    std::vector<ActionData*> actions;
    /**
     * @private
     */
    std::map<std::string, BoneData*> bones;
    /**
     * @private
     */
    std::map<std::string, SlotData*> slots;
    /**
     * @private
     */
    std::map<std::string, ConstraintData*> constraints;
    /**
     * @private
     */
    std::map<std::string, SkinData*> skins;
    /**
     * @private
     */
    std::map<std::string, AnimationData*> animations;
    /**
     * - The default skin data.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 默认插槽数据。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    SkinData* defaultSkin;
    /**
     * - The default animation data.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 默认动画数据。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    AnimationData* defaultAnimation;
    /**
     * @private
     */
    CanvasData* canvas;
    /**
     * @private
     */
    UserData* userData;
    /**
     * @private
     */
    DragonBonesData* parent;
    ArmatureData() :
        canvas(nullptr),
        userData(nullptr)
    {
        _onClear();
    }
    ~ArmatureData()
    {
        _onClear();
    }

protected:
virtual void _onClear() override;

public:
    /**
     * @internal
     */
    void sortBones();
    /**
     * @internal
     */
    void cacheFrames(unsigned frameRate);
    /**
     * @internal
     */
    int setCacheFrame(const Matrix& globalTransformMatrix, const Transform& transform);
    /**
     * @internal
     */
    void getCacheFrame(Matrix& globalTransformMatrix, Transform& transform, unsigned arrayOffset) const;
    /**
     * @internal
     */
    void addBone(BoneData* value);
    /**
     * @internal
     */
    void addSlot(SlotData* value);
    /**
     * @internal
     */
    void addConstraint(ConstraintData* value);
    /**
     * @internal
     */
    void addSkin(SkinData* value);
    /**
     * @internal
     */
    void addAnimation(AnimationData* value);
    /**
     * @internal
     */
    void addAction(ActionData* value, bool isDefault);
    /**
     * - Get a specific done data.
     * @param boneName - The bone name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取特定的骨骼数据。
     * @param boneName - 骨骼名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline BoneData* getBone(const std::string& boneName) const
    {
        return mapFind<BoneData>(bones, boneName);
    }
    /**
     * - Get a specific slot data.
     * @param slotName - The slot name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取特定的插槽数据。
     * @param slotName - 插槽名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline SlotData* getSlot(const std::string& slotName) const
    {
        return mapFind<SlotData>(slots, slotName);
    }
    /**
     * @private
     */
    inline ConstraintData* getConstraint(const std::string& constraintName) const
    {
        return mapFind<ConstraintData>(constraints, constraintName);
    }
    /**
     * - Get a specific skin data.
     * @param skinName - The skin name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取特定皮肤数据。
     * @param skinName - 皮肤名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline SkinData* getSkin(const std::string& skinName) const
    {
        return mapFind(skins, skinName);
    }
    /**
     * @private
     */
    MeshDisplayData* getMesh(const std::string& skinName, const std::string& slotName, const std::string& meshName) const;
    /**
     * - Get a specific animation data.
     * @param animationName - The animation animationName.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取特定的动画数据。
     * @param animationName - 动画名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline AnimationData* getAnimation(const std::string& animationName) const
    {
        return mapFind(animations, animationName);
    }

public: // For WebAssembly.
    int getType() const { return (int)type; }
    void setType(int value) { type = (ArmatureType)value; }

    Rectangle* getAABB() { return &aabb; }
    const std::vector<std::string>& getAnimationNames() const { return animationNames; }
    const std::vector<BoneData*>& getSortedBones() const { return sortedBones; }
    const std::vector<SlotData*>& getSortedSlots() const { return sortedSlots; }
    const std::vector<ActionData*>& getDefaultActions() const { return defaultActions; }
    const std::vector<ActionData*>& getActions() const { return actions; }

    SkinData* getDefaultSkin() const { return defaultSkin; }
    void setDefaultSkin(SkinData* value) { defaultSkin = value; }

    AnimationData* getDefaultAnimation() const { return defaultAnimation; }
    void setDefaultAnimation(AnimationData* value) { defaultAnimation = value; }

    const UserData* getUserData() const { return userData; }
    void setUserData(UserData* value) { userData = value; }

    const DragonBonesData* getParent() const { return parent; }
    void setParent(DragonBonesData* value) { parent = value; }
};
/**
 * - The bone data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 骨骼数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class BoneData : public BaseObject 
{
    BIND_CLASS_TYPE_B(BoneData);

public:
    /**
     * @private
     */
    bool inheritTranslation;
    /**
     * @private
     */
    bool inheritRotation;
    /**
     * @private
     */
    bool inheritScale;
    /**
     * @private
     */
    bool inheritReflection;
    /**
     * - The bone length.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼长度。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    float length;
    /**
     * - The bone name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 骨骼名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string name;
    /**
     * @private
     */
    Transform transform;
    /**
     * @private
     */
    UserData* userData;
    /**
     * - The parent bone data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 父骨骼数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    BoneData* parent;
    BoneData() :
        userData(nullptr)
    {
        _onClear();
    }
    ~BoneData()
    {
        _onClear();
    }

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    Transform* getTransfrom() { return &transform; }

    const UserData* getUserData() const { return userData; }
    void setUserData(UserData* value) { userData = value; }

    const BoneData* getParent() const { return parent; }
    void setParent(BoneData* value) { parent = value; }
};
/**
 * - The slot data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 插槽数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class SlotData : public BaseObject
{
    BIND_CLASS_TYPE_B(SlotData);

public:
    /**
     * @internal
     */
    static ColorTransform DEFAULT_COLOR;
    /**
     * @internal
     */
    static ColorTransform* createColor();

public:
    /**
     * @private
     */
    BlendMode blendMode;
    /**
     * @private
     */
    int displayIndex;
    /**
     * @private
     */
    int zOrder;
    /**
     * - The slot name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 插槽名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string name;
    /**
     * @private
     */
    ColorTransform* color;
    /**
     * @private
     */
    UserData* userData;
    /**
     * - The parent bone data.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 父骨骼数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    BoneData* parent;
    SlotData() :
        color(nullptr),
        userData(nullptr)
    {
        _onClear();
    }
    ~SlotData()
    {
        _onClear();
    }

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    static ColorTransform* getDefaultColor() { return &DEFAULT_COLOR; }

    int getBlendMode() const { return (int)blendMode; }
    void setBlendMode(int value) { blendMode = (BlendMode)value; }

    ColorTransform* getColor() const { return color; }
    void setColor(ColorTransform* value) { color = value; }

    const BoneData* getParent() const { return parent; }
    void setParent(BoneData* value) { parent = value; }

    const UserData* getUserData() const { return userData; }
    void setUserData(UserData* value) { userData = value; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_ARMATURE_DATA_H
