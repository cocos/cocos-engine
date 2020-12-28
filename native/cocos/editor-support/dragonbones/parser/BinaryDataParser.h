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
#ifndef DRAGONBONES_BINARY_DATA_PARSER_H
#define DRAGONBONES_BINARY_DATA_PARSER_H

#include "JSONDataParser.h"

DRAGONBONES_NAMESPACE_BEGIN

/**
 * @internal
 */
class BinaryDataParser : public JSONDataParser
{
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(BinaryDataParser)

private:
    unsigned _binaryOffset;
    const char* _binary;
    const int16_t* _intArray;
    const float* _floatArray;
    const int16_t* _frameIntArray;
    const float* _frameFloatArray;
    const int16_t* _frameArray;
    const uint16_t* _timelineArray;

    TimelineData* _parseBinaryTimeline(TimelineType type, unsigned offset, TimelineData* timelineData = nullptr);
    void _parseVertices(const rapidjson::Value& rawData, VerticesData& vertices);

protected:
    virtual void _parseMesh(const rapidjson::Value& rawData, MeshDisplayData& mesh) override;
    virtual AnimationData* _parseAnimation(const rapidjson::Value& rawData) override;
    virtual void _parseArray(const rapidjson::Value& rawData) override;

public:
    BinaryDataParser() :
        _binaryOffset(0),
        _binary(nullptr),
        _intArray(nullptr),
        _floatArray(nullptr),
        _frameIntArray(nullptr),
        _frameFloatArray(nullptr),
        _frameArray(nullptr),
        _timelineArray(nullptr)
    {}
    virtual ~BinaryDataParser() {}

    virtual DragonBonesData* parseDragonBonesData(const char* rawData, float scale = 1.0f) override;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_BINARY_DATA_PARSER_H
