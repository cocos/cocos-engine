/****************************************************************************
 Copyright (c) 2012-2020 DragonBones team and other contributors
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "dragonbones-creator-support/CCFactory.h"
#include "dragonbones-creator-support/CCArmatureDisplay.h"
#include "dragonbones-creator-support/CCSlot.h"
#include "dragonbones-creator-support/CCTextureAtlasData.h"
#include "platform/FileUtils.h"

using namespace cc;

DRAGONBONES_NAMESPACE_BEGIN

DragonBones *CCFactory::_dragonBonesInstance = nullptr;
CCFactory *CCFactory::_factory = nullptr;

TextureAtlasData *CCFactory::_buildTextureAtlasData(TextureAtlasData *textureAtlasData, void *textureAtlas) const {
    if (textureAtlasData != nullptr) {
        const auto pos = _prevPath.find_last_of("/");
        if (pos != std::string::npos) {
            const auto basePath = _prevPath.substr(0, pos + 1);
            textureAtlasData->imagePath = basePath + textureAtlasData->imagePath;
        }

        if (textureAtlas != nullptr) {
            static_cast<CCTextureAtlasData *>(textureAtlasData)->setRenderTexture(static_cast<middleware::Texture2D *>(textureAtlas));
        }
    } else {
        textureAtlasData = BaseObject::borrowObject<CCTextureAtlasData>();
    }

    return textureAtlasData;
}

Armature *CCFactory::_buildArmature(const BuildArmaturePackage &dataPackage) const {
    const auto armature = BaseObject::borrowObject<Armature>();
    const auto armatureDisplay = CCArmatureDisplay::create();

    // will release when armature destructor
    armatureDisplay->addRef();

    armature->init(
        dataPackage.armature,
        armatureDisplay, armatureDisplay, _dragonBones);

    return armature;
}

Slot *CCFactory::_buildSlot(const BuildArmaturePackage &dataPackage, const SlotData *slotData, Armature *armature) const {
    const auto slot = BaseObject::borrowObject<CCSlot>();

    slot->init(
        slotData, armature,
        slot, slot);

    return slot;
}

DragonBonesData *CCFactory::loadDragonBonesData(const std::string &filePath, const std::string &name, float scale) {
    if (!name.empty()) {
        const auto existedData = getDragonBonesData(name);
        if (existedData) {
            return existedData;
        }
    }

    const auto fullpath = cc::FileUtils::getInstance()->fullPathForFilename(filePath);
    if (cc::FileUtils::getInstance()->isFileExist(filePath)) {
        const auto pos = fullpath.find(".json");

        if (pos != std::string::npos) {
            const auto data = cc::FileUtils::getInstance()->getStringFromFile(filePath);

            return parseDragonBonesData(data.c_str(), name, scale);
        } else {
            cc::Data cocos2dData;
            cc::FileUtils::getInstance()->getContents(fullpath, &cocos2dData);
            uint8_t *binary = cocos2dData.takeBuffer();
            // NOTE: binary is freed in DragonBonesData::_onClear
            return parseDragonBonesData(reinterpret_cast<char *>(binary), name, scale);
        }
    }

    return nullptr;
}

DragonBonesData *CCFactory::parseDragonBonesDataByPath(const std::string &filePath, const std::string &name, float scale) {
    if (!name.empty()) {
        const auto existedData = getDragonBonesData(name);
        if (existedData) {
            return existedData;
        }
    }

    const auto dbbinPos = filePath.find(".dbbin");
    if (dbbinPos != std::string::npos) {
        const auto fullpath = cc::FileUtils::getInstance()->fullPathForFilename(filePath);
        if (cc::FileUtils::getInstance()->isFileExist(filePath)) {
            cc::Data cocos2dData;
            cc::FileUtils::getInstance()->getContents(fullpath, &cocos2dData);
            uint8_t *binary = cocos2dData.takeBuffer();
            // NOTE: binary is freed in DragonBonesData::_onClear
            return parseDragonBonesData(reinterpret_cast<char *>(binary), name, scale);
        }
    } else {
        return parseDragonBonesData(filePath.c_str(), name, scale);
    }

    return nullptr;
}

DragonBonesData *CCFactory::getDragonBonesDataByUUID(const std::string &uuid) {
    DragonBonesData *bonesData = nullptr;
    for (auto it = _dragonBonesDataMap.begin(); it != _dragonBonesDataMap.end();) {
        if (it->first.find(uuid) != std::string::npos) {
            bonesData = it->second;
            break;
        } else {
            it++;
        }
    }
    return bonesData;
}

void CCFactory::removeDragonBonesDataByUUID(const std::string &uuid, bool disposeData) {
    for (auto it = _dragonBonesDataMap.begin(); it != _dragonBonesDataMap.end();) {
        if (it->first.find(uuid) != std::string::npos) {
            if (disposeData) {
                it->second->returnToPool();
            }
            it = _dragonBonesDataMap.erase(it);
        } else {
            it++;
        }
    }
}

TextureAtlasData *CCFactory::loadTextureAtlasData(const std::string &filePath, const std::string &name, float scale) {
    _prevPath = cc::FileUtils::getInstance()->fullPathForFilename(filePath);
    const auto data = cc::FileUtils::getInstance()->getStringFromFile(_prevPath);
    if (data.empty()) {
        return nullptr;
    }

    return static_cast<CCTextureAtlasData *>(BaseFactory::parseTextureAtlasData(data.c_str(), nullptr, name, scale));
}

CCArmatureDisplay *CCFactory::buildArmatureDisplay(const std::string &armatureName, const std::string &dragonBonesName, const std::string &skinName, const std::string &textureAtlasName) const {
    const auto armature = buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
    if (armature != nullptr) {
        return static_cast<CCArmatureDisplay *>(armature->getDisplay());
    }

    return nullptr;
}

void CCFactory::removeTextureAtlasDataByIndex(const std::string &name, int textureIndex) {
    const auto iterator = _textureAtlasDataMap.find(name);
    if (iterator != _textureAtlasDataMap.end()) {
        auto &textureAtlasDataList = iterator->second;
        for (auto it = textureAtlasDataList.begin(); it != textureAtlasDataList.end(); it++) {
            middleware::Texture2D *texture = ((CCTextureAtlasData *)*it)->getRenderTexture();
            if (texture && texture->getRealTextureIndex() == textureIndex) {
                textureAtlasDataList.erase(it);
                break;
            }
        }
        if (textureAtlasDataList.size() == 0) {
            _textureAtlasDataMap.erase(iterator);
        }
    }
}

CCTextureAtlasData *CCFactory::getTextureAtlasDataByIndex(const std::string &name, int textureIndex) const {
    const auto iterator = _textureAtlasDataMap.find(name);
    if (iterator != _textureAtlasDataMap.end()) {
        auto &textureAtlasDataList = iterator->second;
        for (auto it = textureAtlasDataList.begin(); it != textureAtlasDataList.end(); it++) {
            middleware::Texture2D *texture = ((CCTextureAtlasData *)*it)->getRenderTexture();
            if (texture && texture->getRealTextureIndex() == textureIndex) {
                return (CCTextureAtlasData *)*it;
            }
        }
    }
    return nullptr;
}

DRAGONBONES_NAMESPACE_END
