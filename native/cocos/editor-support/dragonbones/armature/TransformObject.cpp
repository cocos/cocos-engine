//
// Created by liangshuochen on 12/06/2017.
//

#include "TransformObject.h"

DRAGONBONES_NAMESPACE_BEGIN

Matrix TransformObject::_helpMatrix;
Transform TransformObject::_helpTransform;
Point TransformObject::_helpPoint;

void TransformObject::_onClear()
{
    globalTransformMatrix.identity();
    global.identity();
    offset.identity();
    origin = nullptr;
    userData = nullptr;

    _globalDirty = false;
    _armature = nullptr;
}

void TransformObject::updateGlobalTransform()
{
    if (_globalDirty)
    {
        _globalDirty = false;
        global.fromMatrix(globalTransformMatrix);
    }
}

DRAGONBONES_NAMESPACE_END
