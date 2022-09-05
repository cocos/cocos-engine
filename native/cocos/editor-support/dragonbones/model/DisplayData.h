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
#ifndef DRAGONBONESCPP_DISPLAYDATA_H
#define DRAGONBONESCPP_DISPLAYDATA_H

#include "../core/BaseObject.h"
#include "../geom/Transform.h"
#include "BoundingBoxData.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * @internal
 */
class VerticesData {
public:
    bool isShared;
    bool inheritDeform;
    unsigned offset;
    DragonBonesData* data;
    WeightData* weight;

    VerticesData() : weight(nullptr) {
    }
    ~VerticesData() {
    }

    void clear();
    void shareFrom(const VerticesData& value);
};
/**
 * @internal
 */
class DisplayData : public BaseObject {
    ABSTRACT_CLASS(DisplayData)

public:
    DisplayType type;
    std::string name;
    std::string path;
    Transform transform;
    SkinData* parent;

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    int getType() const { return (int)type; }
    void setType(int value) { type = (DisplayType)value; }

    Transform* getTransform() { return &transform; }

    SkinData* getParent() const { return parent; }
    void setParent(SkinData* value) { parent = value; }
};
/**
 * @internal
 */
class ImageDisplayData : public DisplayData {
    BIND_CLASS_TYPE_A(ImageDisplayData);

public:
    Point pivot;
    TextureData* texture;

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    Point* getPivot() { return &pivot; }

    TextureData* getTexture() const { return texture; }
    void setTexture(TextureData* value) { texture = value; }
};
/**
 * @internal
 */
class ArmatureDisplayData : public DisplayData {
    BIND_CLASS_TYPE_A(ArmatureDisplayData);

public:
    bool inheritAnimation;
    std::vector<ActionData*> actions;
    ArmatureData* armature;

protected:
    virtual void _onClear() override;

public:
    /**
     * @private
     */
    void addAction(ActionData* value);

public: // For WebAssembly.
    const std::vector<ActionData*>& getActions() const { return actions; }

    ArmatureData* getArmature() const { return armature; }
    void setArmature(ArmatureData* value) { armature = value; }
};
/**
 * @internal
 */
class MeshDisplayData : public DisplayData {
    BIND_CLASS_TYPE_A(MeshDisplayData);

public:
    VerticesData vertices;
    TextureData* texture;

protected:
    virtual void _onClear() override;
};
/**
 * @internal
 */
class BoundingBoxDisplayData : public DisplayData {
    BIND_CLASS_TYPE_B(BoundingBoxDisplayData);

public:
    BoundingBoxData* boundingBox;

    BoundingBoxDisplayData() : boundingBox(nullptr) {
        _onClear();
    }
    ~BoundingBoxDisplayData() {
        _onClear();
    }

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    const BoundingBoxData* getBoundingBox() const { return boundingBox; }
    void setBoundingBox(BoundingBoxData* value) { boundingBox = value; }
};
/**
 * @internal
 */
class WeightData : public BaseObject {
    BIND_CLASS_TYPE_A(WeightData);

public:
    unsigned count;
    unsigned offset;
    std::vector<BoneData*> bones;

protected:
    virtual void _onClear() override;

public:
    void addBone(BoneData* value);

public: // For WebAssembly.
    const std::vector<BoneData*>& getBones() const { return bones; }
};

DRAGONBONES_NAMESPACE_END

#endif //DRAGONBONESCPP_DISPLAYDATA_H
