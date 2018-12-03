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
#ifndef DRAGONBONES_USER_DATA_H
#define DRAGONBONES_USER_DATA_H

#include "../core/BaseObject.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The user custom data.
 * @version DragonBones 5.0
 * @language en_US
 */
/**
 * - 用户自定义数据。
 * @version DragonBones 5.0
 * @language zh_CN
 */
class UserData : public BaseObject
{
    BIND_CLASS_TYPE_A(UserData);

public:
    /**
     * - The custom int numbers.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 自定义整数。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    std::vector<int> ints;
    /**
     * - The custom float numbers.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 自定义浮点数。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    std::vector<float> floats;
    /**
     * - The custom strings.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 自定义字符串。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    std::vector<std::string> strings;

protected:
    virtual void _onClear() override;

public:
    /**
     * @internal
     */
    void addInt(int value);
    /**
     * @internal
     */
    void addFloat(float value);
    /**
     * @internal
     */
    void addString(std::string value);
    /**
     * - Get the custom int number.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 获取自定义整数。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    int getInt(unsigned index) const;
    /**
     * - Get the custom float number.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 获取自定义浮点数。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    float getFloat(unsigned index) const;
    /**
     * - Get the custom string.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 获取自定义字符串。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    std::string getString(unsigned index) const;

public: // For WebAssembly.
    const std::vector<int>& getInts() const { return ints; }
    const std::vector<float>& getFloats() const { return floats; }
    const std::vector<std::string>& getStrings() const { return strings; }
};
/**
 * @internal
 */
class ActionData : public BaseObject
{
    BIND_CLASS_TYPE_B(ActionData);

public:
    ActionType type;
    std::string name;
    const BoneData* bone;
    const SlotData* slot;
    UserData* data;

    ActionData() :
        data(nullptr)
    {
        _onClear();
    }
    virtual ~ActionData()
    {
        _onClear();
    }

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    int getType() const { return (int)type; }
    void setType(int value) { type = (ActionType)value; }

    const BoneData* getBone() const { return bone; }
    void setBone(const BoneData* value) { bone = value; }

    const SlotData* getSlot() const { return slot; }
    void setSlot(const SlotData* value) { slot = value; }

    const UserData* getData() const { return data; }
    void setData(UserData* value) { data = value; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_USER_DATA_H
