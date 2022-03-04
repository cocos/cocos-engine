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
#ifndef DRAGONBONES_DEFORMVERTICES_H
#define DRAGONBONES_DEFORMVERTICES_H

#include "../core/BaseObject.h"

DRAGONBONES_NAMESPACE_BEGIN

/**
 * @internal
 */
class DeformVertices : public BaseObject
{
    BIND_CLASS_TYPE_A(DeformVertices);

public:
    bool verticesDirty;
    std::vector<float> vertices;
    std::vector<Bone*> bones;
    const VerticesData* verticesData;

protected:
    virtual void _onClear() override;

public:
    void init(const VerticesData* weightData, Armature* armature);
    bool isBonesUpdate() const;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_DEFORMVERTICES_H