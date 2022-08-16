#include "Bone.h"
#include "../animation/AnimationState.h"
#include "../geom/Matrix.h"
#include "../geom/Transform.h"
#include "Armature.h"
#include "Constraint.h"
#include "Slot.h"

DRAGONBONES_NAMESPACE_BEGIN

void Bone::_onClear() {
    TransformObject::_onClear();

    offsetMode = OffsetMode::Additive;
    animationPose.identity();

    _transformDirty = false;
    _childrenTransformDirty = false;
    _localDirty = true;
    _hasConstraint = false;
    _visible = true;
    _cachedFrameIndex = -1;
    _blendState.clear();
    _boneData = nullptr;
    _parent = nullptr;
    _cachedFrameIndices = nullptr;
}

void Bone::_updateGlobalTransformMatrix(bool isCache) {
    const auto flipX = _armature->getFlipX();
    const auto flipY = _armature->getFlipY() == DragonBones::yDown;
    auto inherit = _parent != nullptr;
    auto rotation = 0.0f;

    if (offsetMode == OffsetMode::Additive) {
        if (origin != nullptr) {
            // global = *origin; // Copy.
            // global.add(offset).add(animationPose);
            global.x = origin->x + offset.x + animationPose.x;
            global.scaleX = origin->scaleX * offset.scaleX * animationPose.scaleX;
            global.scaleY = origin->scaleY * offset.scaleY * animationPose.scaleY;
            if (DragonBones::yDown) {
                global.y = origin->y + offset.y + animationPose.y;
                global.skew = origin->skew + offset.skew + animationPose.skew;
                global.rotation = origin->rotation + offset.rotation + animationPose.rotation;
            } else {
                global.y = origin->y - offset.y + animationPose.y;
                global.skew = origin->skew - offset.skew + animationPose.skew;
                global.rotation = origin->rotation - offset.rotation + animationPose.rotation;
            }
        } else {
            global = offset; // Copy.
            if (!DragonBones::yDown) {
                global.y = -global.y;
                global.skew = -global.skew;
                global.rotation = -global.rotation;
            }
            global.add(animationPose);
        }
    } else if (offsetMode == OffsetMode::None) {
        if (origin != nullptr) {
            global = *origin;
            global.add(animationPose);
        } else {
            global = animationPose;
        }
    } else {
        inherit = false;
        global = offset;
        if (!DragonBones::yDown) {
            global.y = -global.y;
            global.skew = -global.skew;
            global.rotation = -global.rotation;
        }
    }

    if (inherit) {
        const auto& parentMatrix = _parent->globalTransformMatrix;
        if (_boneData->inheritScale) {
            if (!_boneData->inheritRotation) {
                _parent->updateGlobalTransform();

                if (flipX && flipY) {
                    rotation = global.rotation - (_parent->global.rotation + Transform::PI);
                } else if (flipX) {
                    rotation = global.rotation + _parent->global.rotation + Transform::PI;
                } else if (flipY) {
                    rotation = global.rotation + _parent->global.rotation;
                } else {
                    rotation = global.rotation - _parent->global.rotation;
                }

                global.rotation = rotation;
            }

            global.toMatrix(globalTransformMatrix);
            globalTransformMatrix.concat(parentMatrix);

            if (_boneData->inheritTranslation) {
                global.x = globalTransformMatrix.tx;
                global.y = globalTransformMatrix.ty;
            } else {
                globalTransformMatrix.tx = global.x;
                globalTransformMatrix.ty = global.y;
            }

            if (isCache) {
                global.fromMatrix(globalTransformMatrix);
            } else {
                _globalDirty = true;
            }
        } else {
            if (_boneData->inheritTranslation) {
                const auto x = global.x;
                const auto y = global.y;
                global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                global.y = parentMatrix.b * x + parentMatrix.d * y + parentMatrix.ty;
            } else {
                if (flipX) {
                    global.x = -global.x;
                }

                if (flipY) {
                    global.y = -global.y;
                }
            }

            if (_boneData->inheritRotation) {
                _parent->updateGlobalTransform();

                if (_parent->global.scaleX < 0.0f) {
                    rotation = global.rotation + _parent->global.rotation + Transform::PI;
                } else {
                    rotation = global.rotation + _parent->global.rotation;
                }

                if (parentMatrix.a * parentMatrix.d - parentMatrix.b * parentMatrix.c < 0.0f) {
                    rotation -= global.rotation * 2.0f;

                    if (flipX != flipY || _boneData->inheritReflection) {
                        global.skew += Transform::PI;
                    }

                    if (!DragonBones::yDown) {
                        global.skew = -global.skew;
                    }
                }

                global.rotation = rotation;
            } else if (flipX || flipY) {
                if (flipX && flipY) {
                    rotation = global.rotation + Transform::PI;
                } else {
                    if (flipX) {
                        rotation = Transform::PI - global.rotation;
                    } else {
                        rotation = -global.rotation;
                    }

                    global.skew += Transform::PI;
                }

                global.rotation = rotation;
            }

            global.toMatrix(globalTransformMatrix);
        }
    } else {
        if (flipX || flipY) {
            if (flipX) {
                global.x = -global.x;
            }

            if (flipY) {
                global.y = -global.y;
            }

            if (flipX && flipY) {
                rotation = global.rotation + Transform::PI;
            } else {
                if (flipX) {
                    rotation = Transform::PI - global.rotation;
                } else {
                    rotation = -global.rotation;
                }

                global.skew += Transform::PI;
            }

            global.rotation = rotation;
        }

        global.toMatrix(globalTransformMatrix);
    }
}

void Bone::init(const BoneData* boneData, Armature* armatureValue) {
    if (_boneData != nullptr) {
        return;
    }

    _boneData = boneData;
    _armature = armatureValue;

    if (_boneData->parent != nullptr) {
        _parent = _armature->getBone(_boneData->parent->name);
    }

    _armature->_addBone(this);
    //
    origin = &(_boneData->transform);
}

void Bone::update(int cacheFrameIndex) {
    _blendState.dirty = false;

    if (cacheFrameIndex >= 0 && _cachedFrameIndices != nullptr) {
        const auto cachedFrameIndex = (*_cachedFrameIndices)[cacheFrameIndex];
        if (cachedFrameIndex >= 0 && _cachedFrameIndex == cachedFrameIndex) // Same cache.
        {
            _transformDirty = false;
        } else if (cachedFrameIndex >= 0) // Has been Cached.
        {
            _transformDirty = true;
            _cachedFrameIndex = cachedFrameIndex;
        } else {
            if (_hasConstraint) // Update constraints.
            {
                for (const auto constraint : _armature->_constraints) {
                    if (constraint->_root == this) {
                        constraint->update();
                    }
                }
            }

            if (_transformDirty || (_parent != nullptr && _parent->_childrenTransformDirty)) // Dirty.
            {
                _transformDirty = true;
                _cachedFrameIndex = -1;
            } else if (_cachedFrameIndex >= 0) // Same cache, but not set index yet.
            {
                _transformDirty = false;
                (*_cachedFrameIndices)[cacheFrameIndex] = _cachedFrameIndex;
            } else // Dirty.
            {
                _transformDirty = true;
                _cachedFrameIndex = -1;
            }
        }
    } else {
        if (_hasConstraint) // Update constraints.
        {
            for (const auto constraint : _armature->_constraints) {
                if (constraint->_root == this) {
                    constraint->update();
                }
            }
        }

        if (_transformDirty || (_parent != nullptr && _parent->_childrenTransformDirty)) // Dirty.
        {
            cacheFrameIndex = -1;
            _transformDirty = true;
            _cachedFrameIndex = -1;
        }
    }

    if (_transformDirty) {
        _transformDirty = false;
        _childrenTransformDirty = true;
        //
        if (_cachedFrameIndex < 0) {
            const auto isCache = cacheFrameIndex >= 0;
            if (_localDirty) {
                _updateGlobalTransformMatrix(isCache);
            }

            if (isCache && _cachedFrameIndices != nullptr) {
                _cachedFrameIndex = (*_cachedFrameIndices)[cacheFrameIndex] = _armature->_armatureData->setCacheFrame(globalTransformMatrix, global);
            }
        } else {
            _armature->_armatureData->getCacheFrame(globalTransformMatrix, global, _cachedFrameIndex);
        }
        //
    } else if (_childrenTransformDirty) {
        _childrenTransformDirty = false;
    }

    _localDirty = true;
}

void Bone::updateByConstraint() {
    if (_localDirty) {
        _localDirty = false;

        if (_transformDirty || (_parent != nullptr && _parent->_childrenTransformDirty)) {
            _updateGlobalTransformMatrix(true);
        }

        _transformDirty = true;
    }
}

bool Bone::contains(const Bone* value) const {
    if (value == this) {
        return false;
    }

    auto ancestor = value;
    while (ancestor != this && ancestor != nullptr) {
        ancestor = ancestor->getParent();
    }

    return ancestor == this;
}

void Bone::setVisible(bool value) {
    if (_visible == value) {
        return;
    }

    _visible = value;

    for (const auto& slot : _armature->getSlots()) {
        if (slot->getParent() == this) {
            slot->_updateVisible();
        }
    }
}

DRAGONBONES_NAMESPACE_END
