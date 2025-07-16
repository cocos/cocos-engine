#include "TextureAtlasData.h"

DRAGONBONES_NAMESPACE_BEGIN

void TextureAtlasData::_onClear() {
    for (const auto& pair : textures) {
        pair.second->returnToPool();
    }

    autoSearch = false;
    format = TextureFormat::DEFAULT;
    width = 0;
    height = 0;
    scale = 1.0f;
    name = "";
    imagePath.clear();
    textures.clear();
}

void TextureAtlasData::copyFrom(const TextureAtlasData& value) {
    autoSearch = value.autoSearch;
    format = value.format;
    width = value.width;
    height = value.height;
    scale = value.scale;
    name = value.name;
    imagePath = value.imagePath;

    for (const auto& pair : textures) {
        pair.second->returnToPool();
    }

    textures.clear();

    for (const auto& pair : value.textures) {
        const auto texture = createTexture();
        texture->copyFrom(*(pair.second));
        textures[pair.first] = texture;
    }
}

void TextureAtlasData::addTexture(TextureData* value) {
    if (textures.find(value->name) != textures.cend()) {
        DRAGONBONES_ASSERT(false, "Same texture: " + value->name);
        return;
    }

    textures[value->name] = value;
    value->parent = this;
}

Rectangle* TextureData::createRectangle() {
    return new Rectangle();
}

TextureData::~TextureData() {
}

void TextureData::_onClear() {
    if (frame != nullptr) {
        delete frame;
    }

    rotated = false;
    name = "";
    region.clear();
    parent = nullptr;
    frame = nullptr;
}

void TextureData::copyFrom(const TextureData& value) {
    rotated = value.rotated;
    name = value.name;
    region = value.region; // Copy.
    parent = value.parent;

    if (frame == nullptr && value.frame != nullptr) {
        frame = TextureData::createRectangle();
    } else if (frame != nullptr && value.frame == nullptr) {
        delete frame;
        frame = nullptr;
    }

    if (frame != nullptr && value.frame != nullptr) {
        *frame = *(value.frame); // Copy.
    }
}

DRAGONBONES_NAMESPACE_END
