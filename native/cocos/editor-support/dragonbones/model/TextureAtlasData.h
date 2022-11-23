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
#ifndef DRAGONBONES_TEXTUREATLAS_DATA_H
#define DRAGONBONES_TEXTUREATLAS_DATA_H

#include "../core/BaseObject.h"
#include "../geom/Rectangle.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The texture atlas data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - 贴图集数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
class TextureAtlasData : public BaseObject {
    ABSTRACT_CLASS(TextureAtlasData);

public:
    /**
     * @private
     */
    bool autoSearch;
    TextureFormat format;
    /**
     * @private
     */
    unsigned width;
    /**
     * @private
     */
    unsigned height;
    /**
     * @private
     */
    float scale;
    /**
     * - The texture atlas name.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 贴图集名称。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string name;
    /**
     * - The image path of the texture atlas.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 贴图集图片路径。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    std::string imagePath;
    /**
     * @private
     */
    std::map<std::string, TextureData*> textures;
    /**
     * @private
     */
    void copyFrom(const TextureAtlasData& value);
    /**
     * @internal
     */
    virtual TextureData* createTexture() const = 0;
    /**
     * @internal
     */
    virtual void addTexture(TextureData* value);
    /**
     * @private
     */
    inline TextureData* getTexture(const std::string& textureName) const {
        return mapFind(textures, textureName);
    }

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    const std::map<std::string, TextureData*>& getTextures() const { return textures; }
};
/**
 * @internal
 */
class TextureData : public BaseObject {
public:
    static Rectangle* createRectangle();

public:
    bool rotated;
    std::string name;
    Rectangle region;
    Rectangle* frame;
    TextureAtlasData* parent;

    TextureData() : frame(nullptr) {}
    virtual ~TextureData() = 0;

    void copyFrom(const TextureData& value);

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    Rectangle* getRegion() { return &region; }
    const Rectangle* getFrame() const { return frame; }
    void setFrame(Rectangle* value) { frame = value; }
    const TextureAtlasData* getParent() const { return parent; }
    void setParent(TextureAtlasData* value) { parent = value; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_TEXTUREATLAS_DATA_H
