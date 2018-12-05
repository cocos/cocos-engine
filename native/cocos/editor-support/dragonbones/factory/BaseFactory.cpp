#include "BaseFactory.h"

DRAGONBONES_NAMESPACE_BEGIN

JSONDataParser BaseFactory::_jsonParser;
BinaryDataParser BaseFactory::_binaryParser;

TextureData* BaseFactory::_getTextureData(const std::string& textureAtlasName, const std::string& textureName) const
{
    const auto iterator = _textureAtlasDataMap.find(textureAtlasName);
    if (iterator != _textureAtlasDataMap.end())
    {
        for (const auto textureAtlasData : iterator->second)
        {
            const auto textureData = textureAtlasData->getTexture(textureName);
            if (textureData != nullptr)
            {
                return textureData;
            }
        }
    }

    if (autoSearch)
    {
        for (const auto& pair : _textureAtlasDataMap)
        {
            for (const auto textureAtlasData : pair.second)
            {
                if (textureAtlasData->autoSearch)
                {
                    const auto textureData = textureAtlasData->getTexture(textureName);
                    if (textureData != nullptr)
                    {
                        return textureData;
                    }
                }
            }
        }
    }

    return nullptr;
}

bool BaseFactory::_fillBuildArmaturePackage(
    BuildArmaturePackage& dataPackage, 
    const std::string& dragonBonesName, const std::string& armatureName, const std::string& skinName, const std::string& textureAtlasName
) const
{
    std::string mapName = dragonBonesName;
    DragonBonesData* dragonBonesData = nullptr;
    ArmatureData* armatureData = nullptr;

    if (!mapName.empty())
    {
        const auto iterator = _dragonBonesDataMap.find(mapName);
        if (iterator != _dragonBonesDataMap.end())
        {
            dragonBonesData = iterator->second;
            armatureData = dragonBonesData->getArmature(armatureName);
        }
    }

    if (armatureData == nullptr && (mapName.empty() || autoSearch))
    {
        for (const auto& pair : _dragonBonesDataMap)
        {
            dragonBonesData = pair.second;
            if (mapName.empty() || dragonBonesData->autoSearch)
            {
                armatureData = dragonBonesData->getArmature(armatureName);
                if (armatureData != nullptr)
                {
                    mapName = pair.first;
                    break;
                }
            }
        }
    }

    if (armatureData != nullptr)
    {
        dataPackage.dataName = mapName;
        dataPackage.textureAtlasName = textureAtlasName;
        dataPackage.data = dragonBonesData;
        dataPackage.armature = armatureData;
        dataPackage.skin = nullptr;

        if (!skinName.empty()) 
        {
            dataPackage.skin = armatureData->getSkin(skinName);
            if (dataPackage.skin == nullptr && autoSearch)
            {
                for (const auto& pair : _dragonBonesDataMap)
                {
                    const auto skinDragonBonesData = pair.second;
                    const auto skinArmatureData = skinDragonBonesData->getArmature(skinName);
                    if (skinArmatureData != nullptr)
                    {
                        dataPackage.skin = skinArmatureData->defaultSkin;
                        break;
                    }
                }
            }
        }
            
        if (dataPackage.skin == nullptr)
        {
            dataPackage.skin = armatureData->defaultSkin;
        }

        return true;
    }

    return false;
}

void BaseFactory::_buildBones(const BuildArmaturePackage& dataPackage, Armature* armature) const
{
    for (const auto boneData : dataPackage.armature->sortedBones)
    {
        const auto bone = BaseObject::borrowObject<Bone>();
        bone->init(boneData, armature);
    }

    for (const auto& pair : dataPackage.armature->constraints)
    {
        // TODO more constraint type.
        const auto constraint = BaseObject::borrowObject<IKConstraint>();
        constraint->init(pair.second, armature);
        armature->_addConstraint(constraint);
    }
}

void BaseFactory::_buildSlots(const BuildArmaturePackage& dataPackage, Armature* armature) const
{
    const auto currentSkin = dataPackage.skin;
    const auto defaultSkin = dataPackage.armature->defaultSkin;
    if (currentSkin == nullptr || defaultSkin == nullptr) 
    {
        return;
    }

    std::map<std::string, std::vector<DisplayData*>*> skinSlots;
    for (auto& pair : defaultSkin->displays) 
    {
        auto& displays = pair.second;
        skinSlots[pair.first] = &displays;
    }

    if (currentSkin != defaultSkin) 
    {
        for (auto& pair : currentSkin->displays) 
        {
            auto& displays = pair.second;
            skinSlots[pair.first] = &displays;
        }
    }

    for (const auto slotData : dataPackage.armature->sortedSlots) 
    {
        const auto displayDatas = skinSlots[slotData->name];
        const auto slot = _buildSlot(dataPackage, slotData, armature);
        slot->setRawDisplayDatas(displayDatas);

        if (displayDatas != nullptr)
        {
            std::vector<std::pair<void*, DisplayType>> displayList;

            for (const auto displayData : *displayDatas)
            {
                if (displayData != nullptr)
                {
                    displayList.push_back(_getSlotDisplay(&dataPackage, displayData, nullptr, slot));
                }
                else
                {
                    displayList.push_back(std::make_pair(nullptr, DisplayType::Image));
                }
            }

            slot->_setDisplayList(displayList);
        }

        slot->_setDisplayIndex(slotData->displayIndex, true);
    }
}

Armature* BaseFactory::_buildChildArmature(const BuildArmaturePackage* dataPackage, Slot* slot, DisplayData* displayData) const
{
    return buildArmature(displayData->path, dataPackage != nullptr ? dataPackage->dataName : "", "", dataPackage != nullptr ? dataPackage->textureAtlasName : "");
}

std::pair<void*, DisplayType> BaseFactory::_getSlotDisplay(const BuildArmaturePackage* dataPackage, DisplayData* displayData, DisplayData* rawDisplayData, Slot* slot) const
{
    std::string dataName = "";

    if (dataPackage != nullptr)
    {
        dataName = dataPackage->dataName;
    }
    else 
    {
        for (const auto& pair : _dragonBonesDataMap) 
        {
            if (pair.second == displayData->parent->parent->parent)
            {
                dataName = pair.first;
            }
        }

        if (dataName.empty())
        {
            dataName = displayData->parent->parent->parent->name;
        }
    }
        dataPackage != nullptr ? dataPackage->dataName : displayData->parent->parent->parent->name;

    std::pair<void*, DisplayType> display(nullptr, DisplayType::Image);
    switch (displayData->type)
    {
        case DisplayType::Image:
        {
            auto imageDisplayData = static_cast<ImageDisplayData*>(displayData);
            if (imageDisplayData->texture == nullptr)
            {
                imageDisplayData->texture = _getTextureData(dataName, displayData->path);
            }
            else if (dataPackage != nullptr && !dataPackage->textureAtlasName.empty())
            {
                imageDisplayData->texture = _getTextureData(dataPackage->textureAtlasName, displayData->path);
            }

            display.first = slot->_rawDisplay;
            display.second = DisplayType::Image;
            break;
        }

        case DisplayType::Mesh:
        {
            auto meshDisplayData = static_cast<MeshDisplayData*>(displayData);
            if (meshDisplayData->texture == nullptr)
            {
                meshDisplayData->texture = _getTextureData(dataName, meshDisplayData->path);
            }
            else if (dataPackage != nullptr && !dataPackage->textureAtlasName.empty())
            {
                meshDisplayData->texture = _getTextureData(dataPackage->textureAtlasName, meshDisplayData->path);
            }

            if (_isSupportMesh())
            {
                display.first = slot->_meshDisplay;
                display.second = DisplayType::Mesh;
            }
            else
            {
                display.first = slot->_rawDisplay;
                display.second = DisplayType::Image;
            }
            break;
        }

        case DisplayType::Armature:
        {
            auto armatureDisplayData = static_cast<ArmatureDisplayData*>(displayData);
            const auto childArmature = _buildChildArmature(dataPackage, slot, displayData);
            if (childArmature != nullptr)
            {
                childArmature->inheritAnimation = armatureDisplayData->inheritAnimation;
                if (!childArmature->inheritAnimation)
                {
                    const auto actions = !armatureDisplayData->actions.empty() ? &(armatureDisplayData->actions) : &(childArmature->_armatureData->defaultActions);
                    if (!actions->empty())
                    {
                        for (const auto action : *actions)
                        {
                            childArmature->getAnimation()->fadeIn(action->name);
                        }
                    }
                    else {
                        childArmature->getAnimation()->play();
                    }
                }

                armatureDisplayData->armature = childArmature->_armatureData; //
            }

            display.first = childArmature;
            display.second = DisplayType::Armature;
            break;
        }

        case DisplayType::BoundingBox:
            break;

        default:
            break;
    }

    return display;
}

DragonBonesData* BaseFactory::parseDragonBonesData(const char* rawData, const std::string& name, float scale)
{
    DRAGONBONES_ASSERT(rawData != nullptr, "");

    DataParser* dataParser = nullptr;

    if (
        rawData[0] == 'D' &&
        rawData[1] == 'B' &&
        rawData[2] == 'D' &&
        rawData[3] == 'T'
    )
    {
        dataParser = &_binaryParser;
    }
    else 
    {
        dataParser = _dataParser;
    }

    const auto dragonBonesData = dataParser->parseDragonBonesData(rawData, scale);

    while (true) 
    {
        const auto textureAtlasData = _buildTextureAtlasData(nullptr, nullptr);
        if (dataParser->parseTextureAtlasData(nullptr, *textureAtlasData, scale))
        {
            addTextureAtlasData(textureAtlasData, name);
        }
        else 
        {
            textureAtlasData->returnToPool();
            break;
        }
    }
        
    if (dragonBonesData != nullptr)
    {
        addDragonBonesData(dragonBonesData, name);
    }

    return dragonBonesData;
}

TextureAtlasData* BaseFactory::parseTextureAtlasData(const char* rawData, void* textureAtlas, const std::string& name, float scale)
{
    const auto textureAtlasData = _buildTextureAtlasData(nullptr, nullptr);
    _dataParser->parseTextureAtlasData(rawData, *textureAtlasData, scale);
    _buildTextureAtlasData(textureAtlasData, textureAtlas);
    addTextureAtlasData(textureAtlasData, name);

    return textureAtlasData;
}

void BaseFactory::addDragonBonesData(DragonBonesData* data, const std::string& name)
{
    const auto& mapName = !name.empty()? name : data->name;
    if (_dragonBonesDataMap.find(mapName) != _dragonBonesDataMap.cend())
    {
        if (_dragonBonesDataMap[name] == data) 
        {
            return;
        }

        DRAGONBONES_ASSERT(false, "Can not add same name data: " + name);
        return;
    }

    _dragonBonesDataMap[mapName] = data;
}

void BaseFactory::removeDragonBonesData(const std::string& name, bool disposeData)
{
    const auto iterator = _dragonBonesDataMap.find(name);
    if (iterator != _dragonBonesDataMap.cend())
    {
        if (disposeData)
        {
            iterator->second->returnToPool();
        }

        _dragonBonesDataMap.erase(iterator);
    }
}

void BaseFactory::addTextureAtlasData(TextureAtlasData* data, const std::string& name)
{
    const auto& mapName = !name.empty() ? name : data->name; 
    auto& textureAtlasList = _textureAtlasDataMap[mapName];
    if (std::find(textureAtlasList.cbegin(), textureAtlasList.cend(), data) == textureAtlasList.cend())
    {
        textureAtlasList.push_back(data);
    }
}

void BaseFactory::removeTextureAtlasData(const std::string& name, bool disposeData)
{
    const auto iterator = _textureAtlasDataMap.find(name);
    if (iterator != _textureAtlasDataMap.end())
    {
        if (disposeData)
        {
            for (const auto textureAtlasData : iterator->second)
            {
                textureAtlasData->returnToPool();
            }
        }

        _textureAtlasDataMap.erase(iterator);
    }
}

ArmatureData* BaseFactory::getArmatureData(const std::string& name, const std::string& dragonBonesName) const
{
    BuildArmaturePackage dataPackage;
    if (!_fillBuildArmaturePackage(dataPackage, dragonBonesName, name, "", "")) 
    {
        return nullptr;
    }

    return dataPackage.armature;
}

void BaseFactory::clear(bool disposeData)
{
    if (disposeData)
    {
        for (const auto& pair : _dragonBonesDataMap)
        {
            pair.second->returnToPool();
        }

        for (const auto& pair : _textureAtlasDataMap)
        {
            for (const auto textureAtlasData : pair.second)
            {
                textureAtlasData->returnToPool();
            }
        }
    }

    _dragonBonesDataMap.clear();
    _textureAtlasDataMap.clear();
}

Armature * BaseFactory::buildArmature(const std::string& armatureName, const std::string& dragonBonesName, const std::string& skinName, const std::string& textureAtlasName) const
{
    BuildArmaturePackage dataPackage;
    if (!_fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, skinName, textureAtlasName))
    {
        DRAGONBONES_ASSERT(false, "No armature data: " + armatureName + ", " + (!dragonBonesName.empty() ? dragonBonesName : ""));
        return nullptr;
    }

    const auto armature = _buildArmature(dataPackage);
    _buildBones(dataPackage, armature);
    _buildSlots(dataPackage, armature);
    armature->invalidUpdate("", true);
    armature->advanceTime(0.0f); // Update armature pose.

    return armature;
}

void BaseFactory::replaceDisplay(Slot* slot, DisplayData* displayData, int displayIndex) const
{
    if (displayIndex < 0)
    {
        displayIndex = slot->getDisplayIndex();
    }

    if (displayIndex < 0)
    {
        displayIndex = 0;
    }

    slot->replaceDisplayData(displayData, displayIndex);

    auto displayList = slot->getDisplayList(); // Copy.
    if (displayList.size() <= (unsigned)displayIndex)
    {
        displayList.resize(displayIndex + 1, std::make_pair(nullptr, DisplayType::Image));
    }

    if (displayData != nullptr)
    {
        const auto rawDisplayDatas = slot->getRawDisplayDatas();
        displayList[displayIndex] = _getSlotDisplay(
            nullptr,
            displayData,
            rawDisplayDatas != nullptr && (unsigned)displayIndex < rawDisplayDatas->size() ? rawDisplayDatas->at(displayIndex) : nullptr,
            slot
        );
    }
    else
    {
        displayList[displayIndex] = std::make_pair(nullptr, DisplayType::Image);
    }

    slot->setDisplayList(displayList);
}

bool BaseFactory::replaceSlotDisplay(const std::string& dragonBonesName, const std::string& armatureName, const std::string& slotName, const std::string& displayName, Slot* slot, int displayIndex) const
{
    DRAGONBONES_ASSERT(slot, "Arguments error.");

    const auto armatureData = getArmatureData(armatureName, dragonBonesName);
    if (!armatureData || !armatureData->defaultSkin) 
    {
        return false;
    }

    const auto displayData = armatureData->defaultSkin->getDisplay(slotName, displayName);
    if (!displayData) 
    {
        return false;
    }

    replaceDisplay(slot, displayData, displayIndex);

    return true;
}

bool BaseFactory::replaceSlotDisplayList(const std::string& dragonBonesName, const std::string& armatureName, const std::string& slotName, Slot* slot) const
{
    DRAGONBONES_ASSERT(slot, "Arguments error.");

    const auto armatureData = getArmatureData(armatureName, dragonBonesName);
    if (!armatureData || !armatureData->defaultSkin)
    {
        return false;
    }

    const auto displays = armatureData->defaultSkin->getDisplays(slotName);
    if (!displays) 
    {
        return false;
    }

    auto displayIndex = 0;
    for (const auto displayData : *displays)
    {
        replaceDisplay(slot, displayData, displayIndex++);
    }

    return true;
}

bool BaseFactory::replaceSkin(Armature* armature, SkinData* skin, bool isOverride, const std::vector<std::string>* exclude) const
{
    DRAGONBONES_ASSERT(armature && skin, "Arguments error.");

    auto success = false;
    const auto defaultSkin = skin->parent->defaultSkin;

    for (const auto slot : armature->getSlots()) 
    {
        if (exclude != nullptr && std::find(exclude->cbegin(), exclude->cend(), slot->getName()) != exclude->cend()) 
        {
            continue;
        }

        auto displays = skin->getDisplays(slot->getName());
        if (displays == nullptr)
        {
            if (defaultSkin != nullptr && skin != defaultSkin) 
            {
                displays = defaultSkin->getDisplays(slot->getName());
            }

            if (isOverride)
            {
                std::vector<std::pair<void*, DisplayType>> displayList;
                slot->setRawDisplayDatas(nullptr);
                slot->setDisplayList(displayList);
            }
            continue;
        }

        auto displayList = slot->getDisplayList(); // Copy.
        displayList.resize(displays->size(), std::make_pair(nullptr, DisplayType::Image));
        for (std::size_t i = 0, l = displays->size(); i < l; ++i) 
        {
            const auto displayData = displays->at(i);
            if (displayData != nullptr) 
            {
                displayList[i] = _getSlotDisplay(nullptr, displayData, nullptr, slot);
            }
            else 
            {
                displayList[i] = std::make_pair(nullptr, DisplayType::Image);
            }
        }

        success = true;
        slot->setRawDisplayDatas(displays);
        slot->setDisplayList(displayList);
    }

    return success;
}

bool BaseFactory::replaceAnimation(Armature* armature, ArmatureData* armatureData, bool isReplaceAll) const
{
    const auto skinData = armatureData->defaultSkin;
    if (skinData == nullptr) 
    {
        return false;
    }

    if (isReplaceAll)
    {
        armature->getAnimation()->setAnimations(armatureData->animations);
    }
    else 
    {
        auto animations = armature->getAnimation()->getAnimations(); // Copy.
        for (const auto& pair : armatureData->animations)
        {
            animations[pair.first] = pair.second;
        }

        armature->getAnimation()->setAnimations(animations);
    }

    for (const auto slot : armature->getSlots())
    {
        unsigned index = 0;
        for (const auto& pair : slot->getDisplayList())
        {
            if (pair.second == DisplayType::Armature)
            {
                auto displayDatas = skinData->getDisplays(slot->getName());
                if (displayDatas != nullptr && index < displayDatas->size())
                {
                    const auto displayData = (*displayDatas)[index];
                    if (displayData != nullptr && displayData->type == DisplayType::Armature)
                    {
                        const auto childArmatureData = getArmatureData(displayData->path, displayData->parent->parent->parent->name);
                        if (childArmatureData != nullptr)
                        {
                            replaceAnimation((Armature*)pair.first, childArmatureData, isReplaceAll);
                        }
                    }
                }
            }

            index++;
        }
    }

    return true;
}

DRAGONBONES_NAMESPACE_END
