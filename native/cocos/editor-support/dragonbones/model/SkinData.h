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
#ifndef DRAGONBONES_SKIN_DATA_H
#define DRAGONBONES_SKIN_DATA_H

#include "../core/BaseObject.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The skin data, typically a armature data instance contains at least one skinData.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 皮肤数据，通常一个骨架数据至少包含一个皮肤数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class SkinData : public BaseObject {
    BIND_CLASS_TYPE_A(SkinData);

public:
    /**
     * - The skin name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 皮肤名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string name;
    /**
     * @private
     */
    std::map<std::string, std::vector<DisplayData*>> displays;
    /**
     * @private
     */
    ArmatureData* parent;

protected:
    virtual void _onClear() override;

public:
    /**
     * @internal
     */
    void addDisplay(const std::string& slotName, DisplayData* value);
    /**
     * @private
     */
    DisplayData* getDisplay(const std::string& slotName, const std::string& displayName);
    /**
     * @private
     */
    std::vector<DisplayData*>* getDisplays(const std::string& slotName) {
        return mapFindB(displays, slotName);
    }

public: // For WebAssembly. TODO parent
    const std::map<std::string, std::vector<DisplayData*>>& getSlotDisplays() const { return displays; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_SKIN_DATA_H
