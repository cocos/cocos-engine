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
//
// Created by liangshuochen on 12/06/2017.
//

#ifndef DRAGONBONESCPP_CONSTRAINTS_H
#define DRAGONBONESCPP_CONSTRAINTS_H

#include "../core/BaseObject.h"
#include "../geom/Matrix.h"
#include "../geom/Point.h"
#include "../geom/Transform.h"
#include "../model/ArmatureData.h"
#include "../model/ConstraintData.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * @internal
 */
class Constraint : public BaseObject {
    ABSTRACT_CLASS(Constraint)

protected:
    static Matrix _helpMatrix;
    static Transform _helpTransform;
    static Point _helpPoint;

public:
    /**
     * - For timeline state.
     * @internal
     */
    ConstraintData* _constraintData;
    /**
     * - For sort bones.
     * @internal
     */
    Bone* _target;
    /**
     * - For sort bones.
     * @internal
     */
    Bone* _root;

protected:
    Armature* _armature;
    Bone* _bone;

    virtual void _onClear() override;

public:
    virtual void init(ConstraintData* constraintData, Armature* armature) = 0;
    virtual void update() = 0;
    virtual void invalidUpdate() = 0;

    inline const std::string& getName() {
        return _constraintData->name;
    }
};
/**
 * @internal
 */
class IKConstraint : public Constraint {
    BIND_CLASS_TYPE_A(IKConstraint);

public:
    /**
     * - For timeline state.
     * @internal
     */
    bool _bendPositive;
    /**
     * - For timeline state.
     * @internal
     */
    float _weight;

private:
    bool _scaleEnabled;

protected:
    virtual void _onClear() override;

private:
    void _computeA();
    void _computeB();

public:
    virtual void init(ConstraintData* constraintData, Armature* armature) override;
    virtual void update() override;
    virtual void invalidUpdate() override;
};

DRAGONBONES_NAMESPACE_END
#endif //DRAGONBONESCPP_CONSTRAINTS_H
