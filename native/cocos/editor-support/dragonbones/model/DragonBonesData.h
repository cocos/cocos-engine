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
#ifndef DRAGONBONES_DRAGONBONES_DATA_H
#define DRAGONBONES_DRAGONBONES_DATA_H

#include "../core/BaseObject.h"
#include "ArmatureData.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The DragonBones data.
 * A DragonBones data contains multiple armature data.
 * @see dragonBones.ArmatureData
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 龙骨数据。
 * 一个龙骨数据包含多个骨架数据。
 * @see dragonBones.ArmatureData
 * @version DragonBones 3.0
 * @language zh_CN
 */
class DragonBonesData : public BaseObject
{
    BIND_CLASS_TYPE_B(DragonBonesData);

public:
    /**
     * @private
     */
    bool autoSearch;
    /**
     * - The animation frame rate.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 动画帧频。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    unsigned frameRate;
    /**
     * - The data version.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 数据版本。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string version;
    /**
     * - The DragonBones data name.
     * The name is consistent with the DragonBones project name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 龙骨数据名称。
     * 该名称与龙骨项目名保持一致。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string name;
    /**
     * @internal
     */
    std::vector<unsigned> frameIndices;
    /**
     * @internal
     */
    std::vector<float> cachedFrames;
    /**
     * - All armature data names.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 所有的骨架数据名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::vector<std::string> armatureNames;
    /**
     * @private
     */
    std::map<std::string, ArmatureData*> armatures;
    /**
     * @internal
     */
    const char* binary;
    /**
     * @internal
     */
    const int16_t* intArray;
    /**
     * @internal
     */
    const float* floatArray;
    /**
     * @internal
     */
    const int16_t* frameIntArray;
    /**
     * @internal
     */
    const float* frameFloatArray;
    /**
     * @internal
     */
    const int16_t* frameArray;
    /**
     * @internal
     */
    const uint16_t* timelineArray;
    /**
     * @private
     */
    UserData* userData;
    DragonBonesData() :
        binary(nullptr),
        userData(nullptr)
    {
        _onClear();
    }
    ~DragonBonesData()
    {
        _onClear();
    }
    /**
     * @internal
     */
    void addArmature(ArmatureData* value);
    /**
     * - Get a specific armature data.
     * @param armatureName - The armature data name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取特定的骨架数据。
     * @param armatureName - 骨架数据名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline ArmatureData* getArmature(const std::string& armatureName) const
    {
        return mapFind<ArmatureData>(armatures, armatureName);
    }

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    std::vector<unsigned>* getFrameIndices() { return &frameIndices; }
    const std::vector<std::string>& getArmatureNames() const { return armatureNames; }

#if EGRET_WASM
    unsigned getBinary() const
    {
        return (unsigned)binary;
    }
#endif // EGRET_WASM

    const UserData* getUserData() const { return userData; }
    void setUserData(UserData* value) { userData = value; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_DRAGONBONES_DATA_H
