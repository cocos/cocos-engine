#include "DragonBonesData.h"
#include "UserData.h"
#include "ArmatureData.h"


DRAGONBONES_NAMESPACE_BEGIN

void DragonBonesData::_onClear()
{
    for (const auto& pair : armatures)
    {
        pair.second->returnToPool();
    }

    if (binary != nullptr)
    {
        delete binary;
    }

    if (userData != nullptr)
    {
        userData->returnToPool();
    }

    autoSearch = false;
    frameRate = 0;
    version = "";
    name = "";
    frameIndices.clear();
    cachedFrames.clear();
    armatureNames.clear();
    armatures.clear();
    binary = nullptr;
    intArray = nullptr;
    floatArray = nullptr;
    frameIntArray = nullptr;
    frameFloatArray = nullptr;
    frameArray = nullptr;
    timelineArray = nullptr;
    userData = nullptr;
}

void DragonBonesData::addArmature(ArmatureData* value)
{
    if (armatures.find(value->name) != armatures.end()) 
    {
        DRAGONBONES_ASSERT(false, "Same armature: " + value->name);
        return;
    }

    value->parent = this;
    armatures[value->name] = value;
    armatureNames.push_back(value->name);
}

DRAGONBONES_NAMESPACE_END
