#include "SkinData.h"
#include "DisplayData.h"

DRAGONBONES_NAMESPACE_BEGIN

void SkinData::_onClear() {
    for (const auto& pair : displays) {
        for (const auto display : pair.second) {
            if (display != nullptr) {
                display->returnToPool();
            }
        }
    }

    name = "";
    displays.clear();
    parent = nullptr;
}

void SkinData::addDisplay(const std::string& slotName, DisplayData* value) {
    if (value != nullptr) {
        value->parent = this;
    }

    displays[slotName].push_back(value); // TODO clear prev
}

DisplayData* SkinData::getDisplay(const std::string& slotName, const std::string& displayName) {
    const auto slotDisplays = getDisplays(slotName);
    if (slotDisplays != nullptr) {
        for (const auto display : *slotDisplays) {
            if (display != nullptr && display->name == displayName) {
                return display;
            }
        }
    }

    return nullptr;
}

DRAGONBONES_NAMESPACE_END
