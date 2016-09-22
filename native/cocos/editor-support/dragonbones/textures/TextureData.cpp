#include "TextureData.h"

DRAGONBONES_NAMESPACE_BEGIN

Rectangle* TextureData::generateRectangle()
{
    return new Rectangle();
}

TextureData::TextureData() :
    frame(nullptr)
{}
TextureData::~TextureData() {}

void TextureData::_onClear()
{
    rotated = false;
    name.clear();

    if (frame)
    {
        delete frame;
        frame = nullptr;
    }

    parent = nullptr;
    region.clear();
}

TextureAtlasData::TextureAtlasData() {}
TextureAtlasData::~TextureAtlasData() {}

void TextureAtlasData::_onClear()
{
    autoSearch = false;
    format = TextureFormat::DEFAULT;
    scale = 1.f;
    name.clear();
    imagePath.clear();

    for (const auto& pair : textures)
    {
        pair.second->returnToPool();
    }

    textures.clear();
}

void TextureAtlasData::addTexture(TextureData * value)
{
    if (value && !value->name.empty() && textures.find(value->name) == textures.end())
    {
        textures[value->name] = value;
        value->parent = this;
    }
    else
    {
        DRAGONBONES_ASSERT(true, "Argument error.");
    }
}

DRAGONBONES_NAMESPACE_END