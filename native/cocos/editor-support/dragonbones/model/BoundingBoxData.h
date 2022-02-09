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
#ifndef DRAGONBONESCPP_BOUNDINGBOXDATA_H
#define DRAGONBONESCPP_BOUNDINGBOXDATA_H

#include "../core/BaseObject.h"
#include "../geom/Point.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The base class of bounding box data.
 * @see dragonBones.RectangleData
 * @see dragonBones.EllipseData
 * @see dragonBones.PolygonData
 * @version DragonBones 5.0
 * @language en_US
 */
/**
 * - 边界框数据基类。
 * @see dragonBones.RectangleData
 * @see dragonBones.EllipseData
 * @see dragonBones.PolygonData
 * @version DragonBones 5.0
 * @language zh_CN
 */
class BoundingBoxData : public BaseObject 
{
    ABSTRACT_CLASS(BoundingBoxData);

public:
    /**
     * - The bounding box type.
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 边界框类型。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    BoundingBoxType type;
    /**
     * @private
     */
    unsigned color;
    /**
     * @private
     */
    float width;
    /**
     * @private
     */
    float height;

protected:
    virtual void _onClear() override;

public:
    /**
     * - Check whether the bounding box contains a specific point. (Local coordinate system)
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 检查边界框是否包含特定点。（本地坐标系）
     * @version DragonBones 5.0
     * @language zh_CN
     */
    virtual bool containsPoint(float pX, float pY) = 0;
    /**
     * - Check whether the bounding box intersects a specific segment. (Local coordinate system)
     * @version DragonBones 5.0
     * @language en_US
     */
    /**
     * - 检查边界框是否与特定线段相交。（本地坐标系）
     * @version DragonBones 5.0
     * @language zh_CN
     */
    virtual int intersectsSegment(
        float xA, float yA, float xB, float yB,
        Point* intersectionPointA = nullptr,
        Point* intersectionPointB = nullptr,
        Point* normalRadians = nullptr
    ) = 0;

public: // For WebAssembly.
    int getType() const { return (int)type; }
    void setType(int value) { type = (BoundingBoxType)value; }
};
/**
 * - The rectangle bounding box data.
 * @version DragonBones 5.1
 * @language en_US
 */
/**
 * - 矩形边界框数据。
 * @version DragonBones 5.1
 * @language zh_CN
 */
class RectangleBoundingBoxData : public BoundingBoxData
{
    BIND_CLASS_TYPE_A(RectangleBoundingBoxData);

private:
    enum OutCode {
        InSide = 0, // 0000
        Left = 1,   // 0001
        Right = 2,  // 0010
        Top = 4,    // 0100
        Bottom = 8  // 1000
    };
    /**
     * - Compute the bit code for a point (x, y) using the clip rectangle
     */
    static int _computeOutCode(float x, float y, float xMin, float yMin, float xMax, float yMax);

public:
    /**
     * @private
     */
    static int rectangleIntersectsSegment(
        float xA, float yA, float xB, float yB,
        float xMin, float yMin, float xMax, float yMax,
        Point* intersectionPointA = nullptr,
        Point* intersectionPointB = nullptr,
        Point* normalRadians = nullptr
    );
    /**
     * @inheritDoc
     */
    virtual bool containsPoint(float pX, float pY) override;
    /**
     * @inheritDoc
     */
    virtual int intersectsSegment(
        float xA, float yA, float xB, float yB,
        Point* intersectionPointA = nullptr,
        Point* intersectionPointB = nullptr,
        Point* normalRadians = nullptr
    ) override;

protected:
    virtual void _onClear() override;
};
/**
 * - The ellipse bounding box data.
 * @version DragonBones 5.1
 * @language en_US
 */
/**
 * - 椭圆边界框数据。
 * @version DragonBones 5.1
 * @language zh_CN
 */
class EllipseBoundingBoxData : public BoundingBoxData
{
    BIND_CLASS_TYPE_A(EllipseBoundingBoxData);

public:
    /**
     * @private
     */
    static int ellipseIntersectsSegment(
        float xA, float yA, float xB, float yB,
        float xC, float yC, float widthH, float heightH,
        Point* intersectionPointA = nullptr,
        Point* intersectionPointB = nullptr,
        Point* normalRadians = nullptr
    );
    /**
     * @inheritDoc
     */
    virtual bool containsPoint(float pX, float pY) override;
    /**
     * @inheritDoc
     */
    virtual int intersectsSegment(
        float xA, float yA, float xB, float yB,
        Point* intersectionPointA = nullptr,
        Point* intersectionPointB = nullptr,
        Point* normalRadians = nullptr
    ) override;

protected:
    virtual void _onClear() override;
};
/**
 * - The polygon bounding box data.
 * @version DragonBones 5.1
 * @language en_US
 */
/**
 * - 多边形边界框数据。
 * @version DragonBones 5.1
 * @language zh_CN
 */
class PolygonBoundingBoxData : public BoundingBoxData
{
    BIND_CLASS_TYPE_B(PolygonBoundingBoxData);

public:
    /**
     * @private
     */
    static int polygonIntersectsSegment(
        float xA, float yA, float xB, float yB,
        const std::vector<float>& vertices,
        Point* intersectionPointA = nullptr,
        Point* intersectionPointB = nullptr,
        Point* normalRadians = nullptr
    );
    /**
     * @private
     */
    float x;
    /**
     * @private
     */
    float y;
    /**
     * - The polygon vertices.
     * @version DragonBones 5.1
     * @language en_US
     */
    /**
     * - 多边形顶点。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    std::vector<float> vertices;
    WeightData* weight;
    /**
     * @inheritDoc
     */
    virtual bool containsPoint(float pX, float pY) override;
    /**
     * @inheritDoc
     */
    virtual int intersectsSegment(
        float xA, float yA, float xB, float yB,
        Point* intersectionPointA = nullptr,
        Point* intersectionPointB = nullptr,
        Point* normalRadians = nullptr
    ) override;

    PolygonBoundingBoxData() :
        weight(nullptr)
    {
        _onClear();
    }
    ~PolygonBoundingBoxData()
    {
        _onClear();
    }

protected:
    virtual void _onClear() override;

public: // For WebAssembly.
    std::vector<float>* getVertices() { return &vertices; }

    /*WeightData* getWeight() const { return weight; }
    void setWeight(WeightData* value) { weight = value; }
    */
};

DRAGONBONES_NAMESPACE_END
#endif //DRAGONBONESCPP_BOUNDINGBOXDATA_H
