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
#ifndef DRAGONBONES_BASE_FACTORY_H
#define DRAGONBONES_BASE_FACTORY_H

#include "../animation/Animation.h"
#include "../armature/Armature.h"
#include "../armature/Bone.h"
#include "../armature/Constraint.h"
#include "../armature/Slot.h"
#include "../parser/BinaryDataParser.h"
#include "../parser/JSONDataParser.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - Base class for the factory that create the armatures. (Typically only one global factory instance is required)
 * The factory instance create armatures by parsed and added DragonBonesData instances and TextureAtlasData instances.
 * Once the data has been parsed, it has been cached in the factory instance and does not need to be parsed again until it is cleared by the factory instance.
 * @see dragonBones.DragonBonesData
 * @see dragonBones.TextureAtlasData
 * @see dragonBones.ArmatureData
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 创建骨架的工厂基类。 （通常只需要一个全局工厂实例）
 * 工厂通过解析并添加的 DragonBonesData 实例和 TextureAtlasData 实例来创建骨架。
 * 当数据被解析过之后，已经添加到工厂中，在没有被工厂清理之前，不需要再次解析。
 * @see dragonBones.DragonBonesData
 * @see dragonBones.TextureAtlasData
 * @see dragonBones.ArmatureData
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 * @language zh_CN
 */
class BaseFactory {
protected:
    static JSONDataParser _jsonParser;
    static BinaryDataParser _binaryParser;

public:
    /**
     * @private
     */
    bool autoSearch;

protected:
    std::map<std::string, DragonBonesData*> _dragonBonesDataMap;
    std::map<std::string, std::vector<TextureAtlasData*>> _textureAtlasDataMap;
    DragonBones* _dragonBones;
    DataParser* _dataParser;

public:
    /**
     * - Create a factory instance. (typically only one global factory instance is required)
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 创建一个工厂实例。 （通常只需要一个全局工厂实例）
     * @version DragonBones 3.0
     * @language zh_CN
     */
    BaseFactory(DataParser* dataParser = nullptr) : autoSearch(false),
                                                    _dragonBonesDataMap(),
                                                    _textureAtlasDataMap(),
                                                    _dragonBones(nullptr),
                                                    _dataParser(nullptr) {
        _dataParser = dataParser != nullptr ? dataParser : &BaseFactory::_jsonParser;
    }
    virtual ~BaseFactory() {
        clear();

        _dragonBones = nullptr;
        _dataParser = nullptr;
    }

protected:
    virtual inline bool _isSupportMesh() const {
        return true;
    }
    virtual TextureData* _getTextureData(const std::string& textureAtlasName, const std::string& textureName) const;
    virtual bool _fillBuildArmaturePackage(
        BuildArmaturePackage& dataPackage,
        const std::string& dragonBonesName, const std::string& armatureName, const std::string& skinName, const std::string& textureAtlasName) const;
    virtual void _buildBones(const BuildArmaturePackage& dataPackage, Armature* armature) const;
    /**
     * @private
     */
    virtual void _buildSlots(const BuildArmaturePackage& dataPackage, Armature* armature) const;
    virtual Armature* _buildChildArmature(const BuildArmaturePackage* dataPackage, Slot* slot, DisplayData* displayData) const;
    virtual std::pair<void*, DisplayType> _getSlotDisplay(const BuildArmaturePackage* dataPackage, DisplayData* displayData, DisplayData* rawDisplayData, Slot* slot) const;
    virtual TextureAtlasData* _buildTextureAtlasData(TextureAtlasData* textureAtlasData, void* textureAtlas) const = 0;
    virtual Armature* _buildArmature(const BuildArmaturePackage& dataPackage) const = 0;
    virtual Slot* _buildSlot(const BuildArmaturePackage& dataPackage, const SlotData* slotData, Armature* armature) const = 0;

public:
    /**
     * - Parse the raw data to a DragonBonesData instance and cache it to the factory.
     * @param rawData - The raw data.
     * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
     * @param scale - Specify a scaling value for all armatures. (Default: 1.0)
     * @returns DragonBonesData instance
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 将原始数据解析为 DragonBonesData 实例，并缓存到工厂中。
     * @param rawData - 原始数据。
     * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     * @param scale - 为所有的骨架指定一个缩放值。 （默认: 1.0）
     * @returns DragonBonesData 实例
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 4.5
     * @language zh_CN
     */
    virtual DragonBonesData* parseDragonBonesData(const char* rawData, const std::string& name = "", float scale = 1.0f);
    /**
     * - Parse the raw texture atlas data and the texture atlas object to a TextureAtlasData instance and cache it to the factory.
     * @param rawData - The raw texture atlas data.
     * @param textureAtlas - The texture atlas object.
     * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (If not set, use the instance name instead)
     * @param scale - Specify a scaling value for the map set. (Default: 1.0)
     * @returns TextureAtlasData instance
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 将原始贴图集数据和贴图集对象解析为 TextureAtlasData 实例，并缓存到工厂中。
     * @param rawData - 原始贴图集数据。
     * @param textureAtlas - 贴图集对象。
     * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     * @param scale - 为贴图集指定一个缩放值。 （默认: 1.0）
     * @returns TextureAtlasData 实例
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 4.5
     * @language zh_CN
     */
    virtual TextureAtlasData* parseTextureAtlasData(const char* rawData, void* textureAtlas, const std::string& name = "", float scale = 1.0f);
    /**
     * - Get a specific DragonBonesData instance.
     * @param name - The DragonBonesData instance cache name.
     * @returns DragonBonesData instance
     * @see #parseDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取特定的 DragonBonesData 实例。
     * @param name - DragonBonesData 实例的缓存名称。
     * @returns DragonBonesData 实例
     * @see #parseDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline DragonBonesData* getDragonBonesData(const std::string& name) const {
        return mapFind(_dragonBonesDataMap, name);
    }
    /**
     * - Cache a DragonBonesData instance to the factory.
     * @param data - The DragonBonesData instance.
     * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 将 DragonBonesData 实例缓存到工厂中。
     * @param data - DragonBonesData 实例。
     * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    virtual void addDragonBonesData(DragonBonesData* data, const std::string& name = "");
    /**
     * - Remove a DragonBonesData instance.
     * @param name - The DragonBonesData instance cache name.
     * @param disposeData - Whether to dispose data. (Default: true)
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 移除 DragonBonesData 实例。
     * @param name - DragonBonesData 实例缓存名称。
     * @param disposeData - 是否释放数据。 （默认: true）
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    virtual void removeDragonBonesData(const std::string& name, bool disposeData = true);
    /**
     * - Get a list of specific TextureAtlasData instances.
     * @param name - The TextureAtlasData cahce name.
     * @see #parseTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 获取特定的 TextureAtlasData 实例列表。
     * @param name - TextureAtlasData 实例缓存名称。
     * @see #parseTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    inline std::vector<TextureAtlasData*>* getTextureAtlasData(const std::string& name) {
        return mapFindB(_textureAtlasDataMap, name);
    }
    /**
     * - Cache a TextureAtlasData instance to the factory.
     * @param data - The TextureAtlasData instance.
     * @param name - Specify a cache name for the instance so that the instance can be obtained through this name. (if not set, use the instance name instead)
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 将 TextureAtlasData 实例缓存到工厂中。
     * @param data - TextureAtlasData 实例。
     * @param name - 为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    virtual void addTextureAtlasData(TextureAtlasData* data, const std::string& name = "");
    /**
     * - Remove a TextureAtlasData instance.
     * @param name - The TextureAtlasData instance cache name.
     * @param disposeData - Whether to dispose data.
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 移除 TextureAtlasData 实例。
     * @param name - TextureAtlasData 实例的缓存名称。
     * @param disposeData - 是否释放数据。
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    virtual void removeTextureAtlasData(const std::string& name, bool disposeData = true);
    /**
     * - Get a specific armature data.
     * @param name - The armature data name.
     * @param dragonBonesName - The cached name for DragonbonesData instance.
     * @see dragonBones.ArmatureData
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 获取特定的骨架数据。
     * @param name - 骨架数据名称。
     * @param dragonBonesName - DragonBonesData 实例的缓存名称。
     * @see dragonBones.ArmatureData
     * @version DragonBones 5.1
     * @language zh_CN
     */
    virtual ArmatureData* getArmatureData(const std::string& name, const std::string& dragonBonesName = "") const;
    /**
     * - Clear all cached DragonBonesData instances and TextureAtlasData instances.
     * @param disposeData - Whether to dispose data.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 清除缓存的所有 DragonBonesData 实例和 TextureAtlasData 实例。
     * @param disposeData - 是否释放数据。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    virtual void clear(bool disposeData = true);
    /**
     * - Create a armature from cached DragonBonesData instances and TextureAtlasData instances.
     * Note that when the created armature that is no longer in use, you need to explicitly dispose {@link #dragonBones.Armature#dispose()}.
     * @param armatureName - The armature data name.
     * @param dragonBonesName - The cached name of the DragonBonesData instance. (If not set, all DragonBonesData instances are retrieved, and when multiple DragonBonesData instances contain a the same name armature data, it may not be possible to accurately create a specific armature)
     * @param skinName - The skin name, you can set a different ArmatureData name to share it's skin data. (If not set, use the default skin data)
     * @returns The armature.
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     let armature = factory.buildArmature("armatureName", "dragonBonesName");
     *     armature.clock = factory.clock;
     * </pre>
     * @see dragonBones.DragonBonesData
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架。
     * 注意，创建的骨架不再使用时，需要显式释放 {@link #dragonBones.Armature#dispose()}。
     * @param armatureName - 骨架数据名称。
     * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
     * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。（如果未设置，则使用默认的皮肤数据）
     * @returns 骨架。
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     let armature = factory.buildArmature("armatureName", "dragonBonesName");
     *     armature.clock = factory.clock;
     * </pre>
     * @see dragonBones.DragonBonesData
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    virtual Armature* buildArmature(const std::string& armatureName, const std::string& dragonBonesName = "", const std::string& skinName = "", const std::string& textureAtlasName = "") const;
    /**
     * @private
     */
    virtual void replaceDisplay(Slot* slot, DisplayData* displayData, int displayIndex) const;
    /**
     * - Replaces the current display data for a particular slot with a specific display data.
     * Specify display data with "dragonBonesName/armatureName/slotName/displayName".
     * @param dragonBonesName - The DragonBonesData instance cache name.
     * @param armatureName - The armature data name.
     * @param slotName - The slot data name.
     * @param displayName - The display data name.
     * @param slot - The slot.
     * @param displayIndex - The index of the display data that is replaced. (If it is not set, replaces the current display data)
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     let slot = armature.getSlot("weapon");
     *     factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
     * </pre>
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 用特定的显示对象数据替换特定插槽当前的显示对象数据。
     * 用 "dragonBonesName/armatureName/slotName/displayName" 指定显示对象数据。
     * @param dragonBonesName - DragonBonesData 实例的缓存名称。
     * @param armatureName - 骨架数据名称。
     * @param slotName - 插槽数据名称。
     * @param displayName - 显示对象数据名称。
     * @param slot - 插槽。
     * @param displayIndex - 被替换的显示对象数据的索引。 （如果未设置，则替换当前的显示对象数据）
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     let slot = armature.getSlot("weapon");
     *     factory.replaceSlotDisplay("dragonBonesName", "armatureName", "slotName", "displayName", slot);
     * </pre>
     * @version DragonBones 4.5
     * @language zh_CN
     */
    virtual bool replaceSlotDisplay(
        const std::string& dragonBonesName, const std::string& armatureName, const std::string& slotName, const std::string& displayName,
        Slot* slot, int displayIndex = -1) const;
    /**
     * @private
     */
    virtual bool replaceSlotDisplayList(
        const std::string& dragonBonesName, const std::string& armatureName, const std::string& slotName,
        Slot* slot) const;
    /**
     * - Share specific skin data with specific armature.
     * @param armature - The armature.
     * @param skin - The skin data.
     * @param isOverride - Whether it completely override the original skin. (Default: false)
     * @param exclude - A list of slot names that do not need to be replace.
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
     *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
     *     if (armatureDataB && armatureDataB.defaultSkin) {
     *     factory.replaceSkin(armatureA, armatureDataB.defaultSkin, false, ["arm_l", "weapon_l"]);
     *     }
     * </pre>
     * @see dragonBones.Armature
     * @see dragonBones.SkinData
     * @version DragonBones 5.6
     * @language en_US
     */
    /**
     * - 将特定的皮肤数据共享给特定的骨架使用。
     * @param armature - 骨架。
     * @param skin - 皮肤数据。
     * @param isOverride - 是否完全覆盖原来的皮肤。 （默认: false）
     * @param exclude - 不需要被替换的插槽名称列表。
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
     *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
     *     if (armatureDataB && armatureDataB.defaultSkin) {
     *     factory.replaceSkin(armatureA, armatureDataB.defaultSkin, false, ["arm_l", "weapon_l"]);
     *     }
     * </pre>
     * @see dragonBones.Armature
     * @see dragonBones.SkinData
     * @version DragonBones 5.6
     * @language zh_CN
     */
    virtual bool replaceSkin(Armature* armature, SkinData* skin, bool isOverride, const std::vector<std::string>& exclude) const;
    /**
     * - Replaces the existing animation data for a specific armature with the animation data for the specific armature data.
     * This enables you to make a armature template so that other armature without animations can share it's animations.
     * @param armature - The armtaure.
     * @param armatureData - The armature data.
     * @param isOverride - Whether to completely overwrite the original animation. (Default: false)
     * @example
     * TypeScript style, for reference only.
     * <pre>
     *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
     *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
     *     if (armatureDataB) {
     *     factory.replaceAnimation(armatureA, armatureDataB);
     *     }
     * </pre>
     * @see dragonBones.Armature
     * @see dragonBones.ArmatureData
     * @version DragonBones 5.6
     * @language en_US
     */
    /**
     * - 用特定骨架数据的动画数据替换特定骨架现有的动画数据。
     * 这样就能实现制作一个骨架动画模板，让其他没有制作动画的骨架共享该动画。
     * @param armature - 骨架。
     * @param armatureData - 骨架数据。
     * @param isOverride - 是否完全覆盖原来的动画。（默认: false）
     * @example
     * TypeScript 风格，仅供参考。
     * <pre>
     *     let armatureA = factory.buildArmature("armatureA", "dragonBonesA");
     *     let armatureDataB = factory.getArmatureData("armatureB", "dragonBonesB");
     *     if (armatureDataB) {
     *     factory.replaceAnimation(armatureA, armatureDataB);
     *     }
     * </pre>
     * @see dragonBones.Armature
     * @see dragonBones.ArmatureData
     * @version DragonBones 5.6
     * @language zh_CN
     */
    virtual bool replaceAnimation(Armature* armature, ArmatureData* armatureData, bool isReplaceAll = true) const;
    /**
     * @private
     */
    inline const std::map<std::string, std::vector<TextureAtlasData*>>& getAllTextureAtlasData() const {
        return _textureAtlasDataMap;
    }
    /**
     * @private
     */
    inline const std::map<std::string, DragonBonesData*>& getAllDragonBonesData() const {
        return _dragonBonesDataMap;
    }
    /**
     * - An Worldclock instance updated by engine.
     * @version DragonBones 5.7
     * @language en_US
     */
    /**
     * - 由引擎驱动的 WorldClock 实例。
     * @version DragonBones 5.7
     * @language zh_CN
     */
    inline WorldClock* getClock() const {
        return _dragonBones->getClock();
    }

    /**
     * - Deprecated, please refer to {@link #replaceSkin}.
     * @deprecated
     * @language en_US
     */
    /**
     * - 已废弃，请参考 {@link #replaceSkin}。
     * @deprecated
     * @language zh_CN
     */
    inline bool changeSkin(Armature* armature, SkinData* skin, const std::vector<std::string>& exclude) const {
        return replaceSkin(armature, skin, false, exclude);
    }
};
/**
 * @internal
 */
class BuildArmaturePackage {
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(BuildArmaturePackage)

public:
    std::string dataName;
    std::string textureAtlasName;
    DragonBonesData* data;
    ArmatureData* armature;
    SkinData* skin;

    BuildArmaturePackage() : dataName(),
                             textureAtlasName(),
                             data(nullptr),
                             armature(nullptr),
                             skin(nullptr) {}
    ~BuildArmaturePackage() {}
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_BASE_FACTORY_H
