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
#ifndef DRAGONBONES_COLOR_TRANSFORM_H
#define DRAGONBONES_COLOR_TRANSFORM_H

#include "../core/DragonBones.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * @internal
 */
class ColorTransform
{
public:
    float alphaMultiplier;
    float redMultiplier;
    float greenMultiplier;
    float blueMultiplier;
    int alphaOffset;
    int redOffset;
    int greenOffset;
    int blueOffset;

    ColorTransform():
        alphaMultiplier(1.0f),
        redMultiplier(1.0f),
        greenMultiplier(1.0f),
        blueMultiplier(1.0f),
        alphaOffset(0),
        redOffset(0),
        greenOffset(0),
        blueOffset(0)
    {}
    ColorTransform(const ColorTransform &value)
    {
        operator=(value);
    }
    ~ColorTransform() {}

    inline void operator=(const ColorTransform &value)
    {
        alphaMultiplier = value.alphaMultiplier;
        redMultiplier = value.redMultiplier;
        greenMultiplier = value.greenMultiplier;
        blueMultiplier = value.blueMultiplier;
        alphaOffset = value.alphaOffset;
        redOffset = value.redOffset;
        greenOffset = value.greenOffset;
        blueOffset = value.blueOffset;
    }

    inline void identity()
    {
        alphaMultiplier = redMultiplier = greenMultiplier = blueMultiplier = 1.0f;
        alphaOffset = redOffset = greenOffset = blueOffset = 0;
    }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_COLOR_TRANSFORM_H
